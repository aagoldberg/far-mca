// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../contracts/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../../contracts/lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../contracts/lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

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
    address public immutable borrower;    // loan recipient
    string public metadataURI;            // off-chain info (title, description, image)

    uint256 public immutable principal;         // target raise
    uint256 public immutable termPeriods;       // number of installments
    uint256 public immutable periodLength;      // seconds per period
    uint256 public immutable firstDueDate;      // unix timestamp of first due date
    uint256 public immutable fundraisingDeadline;

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

    mapping(address => uint256) public contributions;   // contributor => amount
    address[] public contributors;                      // list for iteration in distribution

    mapping(address => uint256) public pendingReturns;  // contributor => claimable principal returned

    // --------------------
    // Events
    // --------------------
    event Contributed(address indexed contributor, uint256 amount);
    event FundraisingClosed(uint256 totalAmount);
    event Disbursed(address indexed borrower, uint256 amount);
    event Repaid(uint256 amountApplied, uint256 outstandingPrincipal);
    event Claimed(address indexed contributor, uint256 amount);
    event Completed(uint256 totalRepaid);
    event Refunded(address indexed contributor, uint256 amount);
    event FundraisingCancelled();

    // --------------------
    // Constructor
    // --------------------
    constructor(
        address _fundingToken,
        address _borrower,
        string memory _metadataURI,
        uint256 _principal,
        uint256 _termPeriods,
        uint256 _periodLength,
        uint256 _firstDueDate,
        uint256 _fundraisingDeadline
    ) {
        require(_fundingToken != address(0), "token=0");
        require(_borrower != address(0), "borrower=0");
        require(_principal > 0, "principal=0");
        require(_termPeriods > 0, "term=0");
        require(_periodLength > 0, "period=0");
        require(_firstDueDate > block.timestamp, "firstDue in past");
        require(_fundraisingDeadline > block.timestamp, "deadline in past");

        fundingToken = IERC20(_fundingToken);
        borrower = _borrower;
        metadataURI = _metadataURI;
        principal = _principal;
        termPeriods = _termPeriods;
        periodLength = _periodLength;
        firstDueDate = _firstDueDate;
        fundraisingDeadline = _fundraisingDeadline;

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

    // --------------------
    // Fundraising
    // --------------------
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
            emit FundraisingClosed(totalFunded);
        }
    }

    // --------------------
    // Disbursement
    // --------------------
    function disburse() external onlyBorrower nonReentrant {
        if (active || !fundraisingActive && totalFunded == principal) {
            // ok
        } else {
            revert NotFullyFunded();
        }
        if (active) revert AlreadyDisbursed();

        fundraisingActive = false;
        active = true;

        fundingToken.safeTransfer(borrower, totalFunded);
        emit Disbursed(borrower, totalFunded);
    }

    // --------------------
    // Borrower cancellation (pre-full funding)
    // --------------------
    function cancelFundraise() external onlyBorrower {
        require(!active, "already disbursed");
        require(fundraisingActive, "not fundraising");
        require(totalFunded < principal, "already fully funded");
        fundraisingActive = false;
        cancelled = true;
        emit FundraisingCancelled();
    }

    // --------------------
    // Repayment
    // --------------------
    function repay(uint256 amount) external nonReentrant {
        if (!active) revert NotActive();
        if (completed) revert AlreadyCompleted();
        if (amount == 0) revert InvalidAmount();

        fundingToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 applied = _applyToPrincipal(amount);
        _distributeProRata(applied);

        emit Repaid(applied, outstandingPrincipal);

        if (outstandingPrincipal == 0) {
            completed = true;
            emit Completed(principal);
        }
    }

    // --------------------
    // Lender claims
    // --------------------
    function claim() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        if (amount == 0) revert NoReturnsAvailable();
        pendingReturns[msg.sender] = 0;
        fundingToken.safeTransfer(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }

    // --------------------
    // Refunds (if not fully funded by deadline)
    // --------------------
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
    function _applyToPrincipal(uint256 amount) internal returns (uint256 applied) {
        uint256 remaining = amount;
        // settle due periods one by one with equal principal; last period absorbs remainder.
        while (remaining > 0 && outstandingPrincipal > 0) {
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

            // If this period is fully paid, advance to next period
            if (pay == dueForThisPeriod && nextDuePeriodIndex < termPeriods) {
                unchecked { nextDuePeriodIndex += 1; }
            } else {
                // partial payment for this period; stop loop
                break;
            }
        }
    }

    function _distributeProRata(uint256 amount) internal {
        if (amount == 0) return;
        uint256 funded = totalFunded; // equal to principal after disburse
        if (funded == 0) return;

        // Distribute to each contributor proportionally by their contribution share.
        uint256 length = contributors.length;
        for (uint256 i = 0; i < length; i++) {
            address contributor = contributors[i];
            uint256 share = (amount * contributions[contributor]) / funded;
            if (share > 0) {
                pendingReturns[contributor] += share;
            }
        }
    }
}


