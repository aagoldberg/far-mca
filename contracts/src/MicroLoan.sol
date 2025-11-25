// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IMicroLoanFactory {
    function notifyLoanClosed() external;
}

/**
 * @title MicroLoan (Zero-Interest, Single-Maturity, Flexible Repayment)
 * @notice Ultra-simple microloan: crowdfund principal, disburse to borrower, repay anytime before maturity.
 * @dev No installments, no grace period - just principal, maturity date, and flexible repayment.
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
    IERC20 public immutable fundingToken;
    IMicroLoanFactory public immutable factory;
    address public immutable borrower;
    string public metadataURI;

    uint256 public immutable principal;
    uint256 public immutable dueAt;                  // Single maturity timestamp
    uint256 public immutable fundraisingDeadline;
    uint256 public immutable disbursementWindow;

    // --------------------
    // State
    // --------------------
    bool public fundraisingActive = true;
    bool public active;
    bool public completed;
    bool public cancelled;

    uint256 public totalFunded;
    uint256 public totalRepaid;
    uint256 public outstandingPrincipal;
    uint256 public fundedAt;

    mapping(address => uint256) public contributions;
    address[] public contributors;

    // Accumulator-based distribution (gas-efficient)
    uint256 public accRepaidPerShare;
    mapping(address => uint256) public userRewardDebt;
    uint256 private constant ACC_PRECISION = 1e18;

    // --------------------
    // Events (Rich for off-chain tracking)
    // --------------------
    event Contributed(address indexed contributor, uint256 amount);
    event FundraisingClosed(uint256 totalAmount);
    event Disbursed(address indexed borrower, uint256 amount, uint256 dueAt);
    event Repayment(
        address indexed payer,
        uint256 amount,
        uint256 totalRepaid,
        uint256 outstanding,
        uint256 timestamp,
        uint256 secondsUntilDue
    );
    event Claimed(address indexed contributor, uint256 amount);
    event Completed(uint256 totalRepaid, uint256 timestamp);
    event Refunded(address indexed contributor, uint256 amount);
    event FundraisingCancelled();

    // --------------------
    // Constructor
    // --------------------
    constructor(
        address _factory,
        address _fundingToken,
        address _borrower,
        string memory _metadataURI,
        uint256 _principal,
        uint256 _dueAt,
        uint256 _fundraisingDeadline,
        uint256 _disbursementWindow
    ) {
        require(_factory != address(0), "factory=0");
        require(_fundingToken != address(0), "token=0");
        require(_borrower != address(0), "borrower=0");
        require(_principal > 0, "principal=0");
        require(_dueAt > block.timestamp, "dueAt in past");
        require(_fundraisingDeadline > block.timestamp, "deadline in past");
        require(_disbursementWindow > 0, "disbursement window=0");

        factory = IMicroLoanFactory(_factory);
        fundingToken = IERC20(_fundingToken);
        borrower = _borrower;
        metadataURI = _metadataURI;
        principal = _principal;
        dueAt = _dueAt;
        fundraisingDeadline = _fundraisingDeadline;
        disbursementWindow = _disbursementWindow;

        outstandingPrincipal = _principal;
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
    function contributorsCount() external view returns (uint256) {
        return contributors.length;
    }

    /**
     * @notice Check if the loan is currently in default
     * @return true if past due date and principal remains unpaid
     */
    function isDefaulted() public view returns (bool) {
        if (!active || completed) return false;
        return block.timestamp > dueAt && outstandingPrincipal > 0;
    }

    /**
     * @notice Get seconds remaining until due date (0 if past due)
     */
    function secondsUntilDue() public view returns (uint256) {
        if (block.timestamp >= dueAt) return 0;
        return dueAt - block.timestamp;
    }

    // --------------------
    // Fundraising
    // --------------------
    /**
     * @notice Contribute funds to this loan during the fundraising period
     * @param amount Amount of funding token to contribute
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

    /**
     * @notice Gasless contribution - relayer calls on behalf of contributor
     * @param contributor Address of the actual contributor (must have approved USDC to this contract)
     * @param amount Amount of funding token to contribute
     */
    function contributeFor(address contributor, uint256 amount) external nonReentrant {
        if (!fundraisingActive) revert FundraisingNotActive();
        if (block.timestamp > fundraisingDeadline) revert FundraisingEnded();
        if (amount == 0) revert InvalidAmount();
        if (totalFunded + amount > principal) revert GoalExceeded();

        fundingToken.safeTransferFrom(contributor, address(this), amount);

        if (contributions[contributor] == 0) {
            contributors.push(contributor);
        }
        contributions[contributor] += amount;
        totalFunded += amount;

        emit Contributed(contributor, amount);

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
     */
    function disburse() external onlyBorrower nonReentrant {
        require(!active, "already disbursed");
        require(!fundraisingActive && totalFunded == principal, "not fully funded");
        require(fundedAt != 0, "not yet fully funded");
        require(block.timestamp <= fundedAt + disbursementWindow, "disburse window passed");

        active = true;
        fundingToken.safeTransfer(borrower, totalFunded);
        emit Disbursed(borrower, totalFunded, dueAt);
    }

    /**
     * @notice Cancel a fully-funded loan if borrower fails to disburse within the window
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

    /**
     * @notice Borrower can cancel loan anytime before disbursing funds
     */
    function cancelFundraise() external onlyBorrower {
        require(!active, "already disbursed");
        require(!cancelled, "already cancelled");
        fundraisingActive = false;
        cancelled = true;
        emit FundraisingCancelled();
        factory.notifyLoanClosed();
    }

    // --------------------
    // Repayment (Flexible - any amount, anytime)
    // --------------------
    /**
     * @notice Repay principal on this loan (flexible: any amount, anytime before/after maturity)
     * @dev Anyone can repay on behalf of borrower. Overpayments distributed to lenders as bonus.
     * @param amount Amount to repay (excess beyond outstanding principal distributed to lenders)
     */
    function repay(uint256 amount) external nonReentrant {
        if (!active) revert NotActive();
        if (completed) revert AlreadyCompleted();
        if (amount == 0) revert InvalidAmount();

        fundingToken.safeTransferFrom(msg.sender, address(this), amount);

        // Apply full payment amount (including any overpayment)
        uint256 principalPortion = amount > outstandingPrincipal ? outstandingPrincipal : amount;

        outstandingPrincipal -= principalPortion;
        totalRepaid += amount; // Track total including overpayments

        // Update accumulator for pro-rata distribution (includes overpayments)
        accRepaidPerShare += (amount * ACC_PRECISION) / principal;

        // Rich repayment event for off-chain reputation tracking
        uint256 timeUntilDue = secondsUntilDue();
        emit Repayment(
            msg.sender,
            amount,
            totalRepaid,
            outstandingPrincipal,
            block.timestamp,
            timeUntilDue
        );

        // Check completion
        if (outstandingPrincipal == 0) {
            completed = true;
            // Finalize accumulator to ensure all funds (including overpayments) are distributable
            // This handles any rounding dust and ensures lenders can claim 100% of totalRepaid
            if (totalRepaid > 0) {
                accRepaidPerShare = (totalRepaid * ACC_PRECISION) / principal;
            }
            emit Completed(totalRepaid, block.timestamp);
            factory.notifyLoanClosed();
        }
    }

    /**
     * @notice Gasless repayment - relayer calls on behalf of payer
     * @param payer Address of the actual payer (must have approved USDC to this contract)
     * @param amount Amount to repay (excess beyond outstanding principal distributed to lenders)
     */
    function repayFor(address payer, uint256 amount) external nonReentrant {
        if (!active) revert NotActive();
        if (completed) revert AlreadyCompleted();
        if (amount == 0) revert InvalidAmount();

        fundingToken.safeTransferFrom(payer, address(this), amount);

        // Apply full payment amount (including any overpayment)
        uint256 principalPortion = amount > outstandingPrincipal ? outstandingPrincipal : amount;

        outstandingPrincipal -= principalPortion;
        totalRepaid += amount; // Track total including overpayments

        // Update accumulator for pro-rata distribution (includes overpayments)
        accRepaidPerShare += (amount * ACC_PRECISION) / principal;

        // Rich repayment event for off-chain reputation tracking
        uint256 timeUntilDue = secondsUntilDue();
        emit Repayment(
            payer,
            amount,
            totalRepaid,
            outstandingPrincipal,
            block.timestamp,
            timeUntilDue
        );

        // Check completion
        if (outstandingPrincipal == 0) {
            completed = true;
            // Finalize accumulator to ensure all funds (including overpayments) are distributable
            // This handles any rounding dust and ensures lenders can claim 100% of totalRepaid
            if (totalRepaid > 0) {
                accRepaidPerShare = (totalRepaid * ACC_PRECISION) / principal;
            }
            emit Completed(totalRepaid, block.timestamp);
            factory.notifyLoanClosed();
        }
    }

    // --------------------
    // Lender Claims
    // --------------------
    /**
     * @notice View claimable repayment amount for a contributor
     */
    function claimableAmount(address contributor) public view returns (uint256) {
        uint256 accumulated = (contributions[contributor] * accRepaidPerShare) / ACC_PRECISION;
        return accumulated - userRewardDebt[contributor];
    }

    /**
     * @notice Claim your share of repaid principal
     */
    function claim() external nonReentrant {
        uint256 pending = claimableAmount(msg.sender);
        if (pending == 0) revert NoReturnsAvailable();

        uint256 accumulated = (contributions[msg.sender] * accRepaidPerShare) / ACC_PRECISION;
        userRewardDebt[msg.sender] = accumulated;

        fundingToken.safeTransfer(msg.sender, pending);
        emit Claimed(msg.sender, pending);
    }

    /**
     * @notice Gasless claim - relayer calls on behalf of contributor
     * @param contributor Address of the contributor to claim for
     */
    function claimFor(address contributor) external nonReentrant {
        uint256 pending = claimableAmount(contributor);
        if (pending == 0) revert NoReturnsAvailable();

        uint256 accumulated = (contributions[contributor] * accRepaidPerShare) / ACC_PRECISION;
        userRewardDebt[contributor] = accumulated;

        fundingToken.safeTransfer(contributor, pending);
        emit Claimed(contributor, pending);
    }

    // --------------------
    // Refunds (if fundraising fails)
    // --------------------
    /**
     * @notice Claim refund if loan was cancelled or failed to reach funding goal
     */
    function refund() external nonReentrant {
        require(!active, "already disbursed");
        if (!cancelled) {
            if (block.timestamp <= fundraisingDeadline) revert FundraisingEnded();
            if (totalFunded == principal) revert NotFullyFunded();
        }

        uint256 contributed = contributions[msg.sender];
        require(contributed > 0, "nothing to refund");

        contributions[msg.sender] = 0;
        totalFunded -= contributed;

        fundingToken.safeTransfer(msg.sender, contributed);
        emit Refunded(msg.sender, contributed);
    }

    // --------------------
    // Loan Status View
    // --------------------
    /**
     * @notice Get comprehensive loan status in a single call
     * @return _fundraisingActive Whether fundraising is still accepting contributions
     * @return _active Whether loan has been disbursed to borrower
     * @return _completed Whether loan has been fully repaid
     * @return _cancelled Whether loan was cancelled
     * @return _defaulted Whether loan is currently in default
     * @return percentFunded Percentage funded in basis points (10000 = 100%)
     * @return percentRepaid Percentage repaid in basis points (10000 = 100%)
     * @return _secondsUntilDue Seconds remaining until due date (0 if past due)
     */
    function getStatus() external view returns (
        bool _fundraisingActive,
        bool _active,
        bool _completed,
        bool _cancelled,
        bool _defaulted,
        uint256 percentFunded,
        uint256 percentRepaid,
        uint256 _secondsUntilDue
    ) {
        return (
            fundraisingActive,
            active,
            completed,
            cancelled,
            isDefaulted(),
            totalFunded > 0 ? (totalFunded * 10000) / principal : 0,
            active && totalRepaid > 0 ? (totalRepaid * 10000) / principal : 0,
            secondsUntilDue()
        );
    }
}
