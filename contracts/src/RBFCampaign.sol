// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RBFCampaign
 * @dev Enhanced Revenue-Based Financing campaign combining crowdfunding + revenue sharing
 * Merges the best of Campaign.sol (simple fundraising) + RBFAdvance.sol (revenue sharing)
 */
contract RBFCampaign is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- Custom Errors ---
    error NotOwner();
    error CampaignHasEnded();
    error CampaignNotActive();
    error InvalidAmount();
    error FundingGoalExceeded();
    error InsufficientFunding();
    error RevenueReportTooEarly();
    error RepaymentComplete();
    error NoReturnsAvailable();
    error TransferFailed();
    error PermitDeadlineExpired();

    // --- State Variables ---
    address public immutable owner;
    IERC20 public immutable token;
    string public metadataURI;

    // Fundraising phase
    uint256 public immutable fundingGoal;
    uint256 public immutable fundingDeadline;
    uint256 public totalFunded;
    bool public fundingActive = true;
    
    // RBF phase
    uint256 public immutable revenueSharePercent; // Basis points (500 = 5%)
    uint256 public immutable repaymentCap; // Basis points (15000 = 1.5x)
    uint256 public totalRepaid;
    uint256 public lastRevenueReport;
    bool public repaymentActive;

    // Participant tracking
    mapping(address => uint256) public contributions;
    mapping(address => uint256) public pendingReturns;
    address[] public contributors;

    // --- Events ---
    event Contributed(address indexed contributor, uint256 amount);
    event FundingGoalReached(uint256 totalAmount);
    event FundingWithdrawn(uint256 amount);
    event RevenueShared(uint256 revenueAmount, uint256 shareAmount);
    event ReturnsWithdrawn(address indexed contributor, uint256 amount);
    event RepaymentCompleted(uint256 totalAmount);
    event CampaignRefunded(address indexed contributor, uint256 amount);
    event MetadataUpdated(string newURI);

    // --- Modifiers ---
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(
        address _owner,
        address _token,
        string memory _metadataURI,
        uint256 _fundingGoal,
        uint256 _fundingDeadline,
        uint256 _revenueSharePercent,
        uint256 _repaymentCap
    ) {
        owner = _owner;
        token = IERC20(_token);
        metadataURI = _metadataURI;
        fundingGoal = _fundingGoal;
        fundingDeadline = _fundingDeadline;
        revenueSharePercent = _revenueSharePercent;
        repaymentCap = _repaymentCap;
        lastRevenueReport = block.timestamp;
    }

    /**
     * @dev Contribute to the campaign (fundraising phase)
     */
    function contribute(uint256 amount) external nonReentrant {
        if (!fundingActive) revert CampaignNotActive();
        if (block.timestamp >= fundingDeadline) revert CampaignHasEnded();
        if (amount == 0) revert InvalidAmount();
        if (totalFunded + amount > fundingGoal) revert FundingGoalExceeded();

        token.safeTransferFrom(msg.sender, address(this), amount);

        // Track new contributors
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }

        contributions[msg.sender] += amount;
        totalFunded += amount;

        emit Contributed(msg.sender, amount);

        // Auto-transition if goal reached
        if (totalFunded >= fundingGoal) {
            _startRepaymentPhase();
        }
    }

    /**
     * @dev Contribute with EIP-2612 permit signature (gas-less approval)
     */
    function contributeWithPermit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        if (!fundingActive) revert CampaignNotActive();
        if (block.timestamp >= fundingDeadline) revert CampaignHasEnded();
        if (amount == 0) revert InvalidAmount();
        if (totalFunded + amount > fundingGoal) revert FundingGoalExceeded();
        if (block.timestamp > deadline) revert PermitDeadlineExpired();

        // Execute permit
        IERC20Permit(address(token)).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );

        token.safeTransferFrom(msg.sender, address(this), amount);

        // Track new contributors
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }

        contributions[msg.sender] += amount;
        totalFunded += amount;

        emit Contributed(msg.sender, amount);

        // Auto-transition if goal reached
        if (totalFunded >= fundingGoal) {
            _startRepaymentPhase();
        }
    }

    /**
     * @dev Manually transition to repayment phase (if funding goal reached)
     */
    function startRepaymentPhase() external onlyOwner {
        if (totalFunded < fundingGoal) revert InsufficientFunding();
        _startRepaymentPhase();
    }

    function _startRepaymentPhase() private {
        fundingActive = false;
        repaymentActive = true;
        
        // Transfer funds to business owner
        token.safeTransfer(owner, totalFunded);
        
        emit FundingGoalReached(totalFunded);
    }

    /**
     * @dev Submit monthly revenue share (repayment phase)
     */
    function submitRevenueShare(uint256 revenueAmount) external nonReentrant {
        if (msg.sender != owner) revert NotOwner();
        if (!repaymentActive) revert CampaignNotActive();
        if (block.timestamp < lastRevenueReport + 30 days) revert RevenueReportTooEarly();

        uint256 shareAmount = (revenueAmount * revenueSharePercent) / 10000;
        uint256 maxRepayment = (totalFunded * repaymentCap) / 10000;
        uint256 remainingCap = maxRepayment - totalRepaid;

        // Cap payment if exceeds total repayment limit
        if (shareAmount > remainingCap) {
            shareAmount = remainingCap;
        }

        if (shareAmount == 0) revert InvalidAmount();

        token.safeTransferFrom(msg.sender, address(this), shareAmount);

        // Distribute proportionally to all contributors
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 contributorShare = (shareAmount * contributions[contributor]) / totalFunded;
            pendingReturns[contributor] += contributorShare;
        }

        totalRepaid += shareAmount;
        lastRevenueReport = block.timestamp;

        emit RevenueShared(revenueAmount, shareAmount);

        // Check if repayment complete
        if (totalRepaid >= maxRepayment) {
            repaymentActive = false;
            emit RepaymentCompleted(totalRepaid);
        }
    }

    /**
     * @dev Contributors withdraw their revenue share returns
     */
    function withdrawReturns() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        if (amount == 0) revert NoReturnsAvailable();

        pendingReturns[msg.sender] = 0;
        token.safeTransfer(msg.sender, amount);

        emit ReturnsWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Refund contributors if funding goal not reached by deadline
     */
    function refund() external nonReentrant {
        if (fundingActive && block.timestamp < fundingDeadline) revert CampaignHasEnded();
        if (totalFunded >= fundingGoal) revert FundingGoalExceeded();
        
        uint256 contribution = contributions[msg.sender];
        if (contribution == 0) revert InvalidAmount();

        contributions[msg.sender] = 0;
        totalFunded -= contribution;
        
        token.safeTransfer(msg.sender, contribution);
        
        emit CampaignRefunded(msg.sender, contribution);
    }

    /**
     * @dev Update campaign metadata
     */
    function updateMetadata(string memory newURI) external onlyOwner {
        metadataURI = newURI;
        emit MetadataUpdated(newURI);
    }

    // --- View Functions ---

    function getCampaignDetails() external view returns (
        uint256 _fundingGoal,
        uint256 _totalFunded,
        uint256 _totalRepaid,
        uint256 _revenueSharePercent,
        uint256 _repaymentCap,
        bool _fundingActive,
        bool _repaymentActive,
        uint256 _contributorCount
    ) {
        return (
            fundingGoal,
            totalFunded,
            totalRepaid,
            revenueSharePercent,
            repaymentCap,
            fundingActive,
            repaymentActive,
            contributors.length
        );
    }

    function getContributorCount() external view returns (uint256) {
        return contributors.length;
    }

    function calculateExpectedReturn(address contributor) external view returns (uint256) {
        if (totalFunded == 0) return 0;
        uint256 maxRepayment = (totalFunded * repaymentCap) / 10000;
        return (maxRepayment * contributions[contributor]) / totalFunded;
    }

    function getRemainingRepayment() external view returns (uint256) {
        if (!repaymentActive) return 0;
        uint256 maxRepayment = (totalFunded * repaymentCap) / 10000;
        return maxRepayment - totalRepaid;
    }

    function getNextPaymentDue() external view returns (uint256) {
        if (!repaymentActive) return 0;
        return lastRevenueReport + 30 days;
    }

    // --- ETH Rejection ---
    receive() external payable {
        revert TransferFailed();
    }
}

/**
 * @title IERC20Permit
 * @notice Interface for ERC20 tokens that support the EIP-2612 permit function.
 */
interface IERC20Permit is IERC20 {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}