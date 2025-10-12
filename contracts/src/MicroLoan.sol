// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
interface IMicroLoanFactory { function notifyLoanClosed() external; }

/**
 * @title MicroLoan (Zero-Interest, Fixed-Term, Crowdfunded)
 * @notice MVP implementation of a Kiva-style microloan: crowdfund principal, disburse to borrower,
 *         and repay principal in equal installments with no interest or borrower fees.
 */
contract MicroLoan is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --------------------
    // Errors
    // --------------------
    error NotBorrower();
    error FundraisingNotActive();
    error FundraisingEnded();
    error InvalidAmount();
    error GoalExceeded();
    error NotFullyFunded();
    error AlreadyDisbursed();
    error NotActive();
    error AlreadyCompleted();
    error NoReturnsAvailable();

    // --------------------
    // Immutable Config
    // --------------------
    IERC20 public immutable fundingToken; // e.g., USDC
    IMicroLoanFactory public immutable factory; // factory for lifecycle notifications
    address public immutable borrower;    // loan recipient
    string public metadataURI;            // off-chain info (title, description, image)

    uint256 public immutable principal;         // target raise
    uint256 public immutable termPeriods;       // number of installments
    uint256 public immutable periodLength;      // seconds per period
    uint256 public immutable firstDueDate;      // unix timestamp of first due date
    uint256 public immutable fundraisingDeadline;
    uint256 public immutable disbursementWindow; // time allowed to disburse after fully funded
    uint256 public immutable gracePeriod;        // time after due date before considered defaulted

    // --------------------
    // State
    // --------------------
    bool public fundraisingActive = true;       // accepts contributions
    bool public active;                         // disbursed and in repayment
    bool public completed;                      // fully repaid
    bool public cancelled;                      // borrower cancelled fundraising

    uint256 public totalFunded;                 // total raised from contributors
    uint256 public outstandingPrincipal;        // remaining principal to be repaid
    uint256 public nextDuePeriodIndex;          // 0..termPeriods-1
    uint256 public fundedAt;                    // timestamp when fully funded

    mapping(address => uint256) public contributions;   // contributor => amount
    address[] public contributors;                      // list for iteration in distribution

    // Accumulator-based distribution (no loops on repay)
    uint256 public accRepaidPerShare;                  // scaled by 1e18
    mapping(address => uint256) public userRewardDebt;  // amount already accounted for each contributor
    uint256 private constant ACC_PRECISION = 1e18;

    // --------------------
    // Events
    // --------------------
    event Contributed(address indexed contributor, uint256 amount);
    event FundraisingClosed(uint256 totalAmount);
    event Disbursed(address indexed borrower, uint256 amount);
    event Repaid(uint256 amountApplied, uint256 outstandingPrincipal);
    event PeriodPaid(uint256 indexed periodIndex, uint256 amountPaid, uint256 dueDate, address indexed payer);
    event Claimed(address indexed contributor, uint256 amount);
    event Completed(uint256 totalRepaid);
    event Refunded(address indexed contributor, uint256 amount);
    event FundraisingCancelled();
    event LoanDefaulted(uint256 missedPaymentDate, uint256 periodsOverdue);

    // --------------------
    // Constructor
    // --------------------
    constructor(
        address _factory,
        address _fundingToken,
        address _borrower,
        string memory _metadataURI,
        uint256 _principal,
        uint256 _termPeriods,
        uint256 _periodLength,
        uint256 _firstDueDate,
        uint256 _fundraisingDeadline,
        uint256 _disbursementWindow,
        uint256 _gracePeriod
    ) {
        require(_factory != address(0), "factory=0");
        require(_fundingToken != address(0), "token=0");
        require(_borrower != address(0), "borrower=0");
        require(_principal > 0, "principal=0");
        require(_termPeriods > 0, "term=0");
        require(_periodLength > 0, "period=0");
        require(_firstDueDate > block.timestamp, "firstDue in past");
        require(_fundraisingDeadline > block.timestamp, "deadline in past");
        require(_disbursementWindow > 0, "disbursement window=0");
        require(_gracePeriod > 0, "grace period=0");

        factory = IMicroLoanFactory(_factory);
        fundingToken = IERC20(_fundingToken);
        borrower = _borrower;
        metadataURI = _metadataURI;
        principal = _principal;
        termPeriods = _termPeriods;
        periodLength = _periodLength;
        firstDueDate = _firstDueDate;
        fundraisingDeadline = _fundraisingDeadline;
        disbursementWindow = _disbursementWindow;
        gracePeriod = _gracePeriod;

        outstandingPrincipal = _principal;
        nextDuePeriodIndex = 0;
    }

    // --------------------
    // Modifiers
    // --------------------
    modifier onlyBorrower() {
        if (msg.sender != borrower) revert NotBorrower();
        _;
    }

    // --------------------
    // Views
    // --------------------
    function perPeriodPrincipal() public view returns (uint256) {
        return principal / termPeriods; // final period handles remainder
    }

    function contributorsCount() external view returns (uint256) {
        return contributors.length;
    }

    function currentDueDate() public view returns (uint256) {
        if (nextDuePeriodIndex >= termPeriods) return 0;
        return firstDueDate + (nextDuePeriodIndex * periodLength);
    }

    /**
     * @notice Get the deadline including grace period (when loan becomes defaulted)
     * @return timestamp when loan becomes defaulted if unpaid, or 0 if no payment due
     */
    function defaultDeadline() public view returns (uint256) {
        uint256 due = currentDueDate();
        if (due == 0) return 0;
        return due + gracePeriod;
    }

    /**
     * @notice Check if the loan is currently in default
     * @return true if payment is overdue beyond grace period and principal remains
     * @dev Borrowers can still repay even when defaulted - this is status only
     */
    function isDefaulted() public view returns (bool) {
        // Not defaulted if loan isn't active or is already completed
        if (!active || completed) return false;

        // Not defaulted if no payments are due yet
        uint256 due = currentDueDate();
        if (due == 0) return false;

        // Defaulted if current time exceeds due date + grace period
        // AND there's still outstanding principal to be repaid
        return block.timestamp > due + gracePeriod && outstandingPrincipal > 0;
    }

    // --------------------
    // Fundraising
    // --------------------
    /**
     * @notice Contribute funds to this loan during the fundraising period
     * @dev Reverts if fundraising inactive, deadline passed, or would exceed principal
     * @param amount Amount of funding token to contribute (in base units, e.g., 1000000 = 1 USDC)
     */
    function contribute(uint256 amount) external nonReentrant {
        if (!fundraisingActive) revert FundraisingNotActive();
        if (block.timestamp > fundraisingDeadline) revert FundraisingEnded();
        if (amount == 0) revert InvalidAmount();
        if (totalFunded + amount > principal) revert GoalExceeded();

        fundingToken.safeTransferFrom(msg.sender, address(this), amount);

        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += amount;
        totalFunded += amount;

        emit Contributed(msg.sender, amount);

        if (totalFunded == principal) {
            fundraisingActive = false;
            fundedAt = block.timestamp;
            emit FundraisingClosed(totalFunded);
        }
    }

    // --------------------
    // Disbursement
    // --------------------
    /**
     * @notice Disburse the fully-funded loan to the borrower
     * @dev Only callable by borrower, within disbursement window after full funding
     * @dev Reverts if not fully funded, already disbursed, or disbursement window expired
     */
    function disburse() external onlyBorrower nonReentrant {
        require(!active, "already disbursed");
        require(!fundraisingActive && totalFunded == principal, "not fully funded");
        require(fundedAt != 0, "not yet fully funded");
        require(block.timestamp <= fundedAt + disbursementWindow, "disburse window passed");

        active = true;
        fundingToken.safeTransfer(borrower, totalFunded);
        emit Disbursed(borrower, totalFunded);
    }

    /**
     * @notice Cancel a fully-funded loan if borrower fails to disburse within the window
     * @dev Callable by anyone after disbursement window expires. Opens refunds for contributors.
     */
    function cancelIfNoDisburse() external {
        require(!active, "already disbursed");
        require(totalFunded == principal && fundedAt != 0, "not fully funded");
        require(block.timestamp > fundedAt + disbursementWindow, "window not passed");
        fundraisingActive = false;
        cancelled = true;
        emit FundraisingCancelled();
        factory.notifyLoanClosed();
    }

    // --------------------
    // Borrower cancellation (pre-full funding)
    // --------------------
    /**
     * @notice Borrower can cancel fundraising before full funding is reached
     * @dev Only callable by borrower. Opens refunds for existing contributors.
     */
    function cancelFundraise() external onlyBorrower {
        require(!active, "already disbursed");
        require(fundraisingActive, "not fundraising");
        require(totalFunded < principal, "already fully funded");
        fundraisingActive = false;
        cancelled = true;
        emit FundraisingCancelled();
        factory.notifyLoanClosed();
    }

    // --------------------
    // Repayment
    // --------------------
    /**
     * @notice Repay principal on this loan
     * @dev Anyone can repay on behalf of borrower. Payments applied to periods in order.
     * @dev Overpayments are refunded. Emits LoanDefaulted event if loan was in default.
     * @param amount Amount to repay (excess beyond outstanding principal will be refunded)
     */
    function repay(uint256 amount) external nonReentrant {
        if (!active) revert NotActive();
        if (completed) revert AlreadyCompleted();
        if (amount == 0) revert InvalidAmount();

        // Check if loan was defaulted before this repayment
        bool wasDefaulted = isDefaulted();
        uint256 periodsOverdue = 0;
        if (wasDefaulted) {
            uint256 due = currentDueDate();
            if (due > 0 && block.timestamp > due) {
                periodsOverdue = ((block.timestamp - due) / periodLength) + 1;
            }
        }

        fundingToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 applied = _applyToPrincipal(amount, msg.sender);

        // Emit default event if loan was in default (for indexing/analytics)
        if (wasDefaulted) {
            uint256 missedDate = currentDueDate();
            if (missedDate == 0 && nextDuePeriodIndex > 0) {
                // If we just paid the last period, calculate previous due date
                missedDate = firstDueDate + ((nextDuePeriodIndex - 1) * periodLength);
            }
            emit LoanDefaulted(missedDate, periodsOverdue);
        }

        // Refund any overpayment beyond outstanding principal
        uint256 refundAmt = amount - applied;
        if (refundAmt > 0) {
            fundingToken.safeTransfer(msg.sender, refundAmt);
        }

        // Update accumulator for distribution
        // acc += applied / principal (scaled by ACC_PRECISION)
        if (applied > 0) {
            accRepaidPerShare += (applied * ACC_PRECISION) / principal;
        }

        emit Repaid(applied, outstandingPrincipal);

        if (outstandingPrincipal == 0) {
            completed = true;
            // Finalize accumulator to 1.0 share to release rounding dust
            if (accRepaidPerShare < ACC_PRECISION) {
                accRepaidPerShare = ACC_PRECISION;
            }
            emit Completed(principal);
            factory.notifyLoanClosed();
        }
    }

    // --------------------
    // Lender claims
    // --------------------
    /**
     * @notice View function to check claimable repayment amount for a contributor
     * @param contributor Address of the contributor to check
     * @return Amount of tokens the contributor can currently claim
     */
    function claimableAmount(address contributor) public view returns (uint256) {
        uint256 accumulated = (contributions[contributor] * accRepaidPerShare) / ACC_PRECISION;
        return accumulated - userRewardDebt[contributor];
    }

    /**
     * @notice Claim your share of repaid principal
     * @dev Uses accumulator pattern for efficient distribution
     */
    function claim() external nonReentrant {
        uint256 pending = claimableAmount(msg.sender);
        if (pending == 0) revert NoReturnsAvailable();

        uint256 accumulated = (contributions[msg.sender] * accRepaidPerShare) / ACC_PRECISION;
        userRewardDebt[msg.sender] = accumulated;
        fundingToken.safeTransfer(msg.sender, pending);
        emit Claimed(msg.sender, pending);
    }

    // --------------------
    // Refunds (if not fully funded by deadline)
    // --------------------
    /**
     * @notice Claim refund if loan was cancelled or failed to reach funding goal
     * @dev Available if: (1) borrower cancelled, or (2) deadline passed without full funding
     */
    function refund() external nonReentrant {
        // Refunds are allowed if:
        // 1) Borrower cancelled before full funding, or
        // 2) Fundraising deadline passed and loan not fully funded/disbursed
        require(!active, "already disbursed");
        if (!cancelled) {
            if (block.timestamp <= fundraisingDeadline) revert FundraisingEnded();
            if (totalFunded == principal) revert NotFullyFunded();
        }

        uint256 contributed = contributions[msg.sender];
        require(contributed > 0, "nothing to refund");

        contributions[msg.sender] = 0;
        // decrease totalFunded for accounting; prevents double-claims
        totalFunded -= contributed;

        fundingToken.safeTransfer(msg.sender, contributed);
        emit Refunded(msg.sender, contributed);
    }

    // --------------------
    // Internal helpers
    // --------------------
    function _applyToPrincipal(uint256 amount, address payer) internal returns (uint256 applied) {
        uint256 remaining = amount;
        // settle due periods one by one with equal principal; last period absorbs remainder.
        while (remaining > 0 && outstandingPrincipal > 0) {
            uint256 currentPeriod = nextDuePeriodIndex;
            uint256 perPeriod = perPeriodPrincipal();
            uint256 dueForThisPeriod;

            // For the final period, due equals all remaining outstanding.
            if (nextDuePeriodIndex == termPeriods - 1) {
                dueForThisPeriod = outstandingPrincipal;
            } else {
                // minimum due is perPeriod unless less outstanding remains
                dueForThisPeriod = perPeriod <= outstandingPrincipal ? perPeriod : outstandingPrincipal;
            }

            uint256 pay = remaining < dueForThisPeriod ? remaining : dueForThisPeriod;
            outstandingPrincipal -= pay;
            remaining -= pay;
            applied += pay;

            // If this period is fully paid, advance to next period and emit event
            if (pay == dueForThisPeriod && nextDuePeriodIndex < termPeriods) {
                uint256 dueDate = firstDueDate + (currentPeriod * periodLength);
                emit PeriodPaid(currentPeriod, pay, dueDate, payer);
                unchecked { nextDuePeriodIndex += 1; }
            } else {
                // partial payment for this period; stop loop
                break;
            }
        }
    }

    
}


