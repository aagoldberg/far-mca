// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RBFAdvance
 * @dev Revenue-Based Financing contract for managing business funding advances
 */
contract RBFAdvance is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // State variables
    IERC20 public immutable fundingToken; // USDC
    address public immutable business;
    string public metadataURI;
    
    uint256 public fundingGoal;
    uint256 public totalFunded;
    uint256 public revenueSharePercentage; // In basis points (500 = 5%)
    uint256 public repaymentCap; // In basis points (15000 = 1.5x)
    uint256 public totalRepaid;
    uint256 public lastRevenueReportDate;
    uint256 public monthlyRevenue;
    
    bool public fundingActive;
    bool public repaymentActive;
    
    // Investor tracking
    mapping(address => uint256) public investments;
    mapping(address => uint256) public investorReturns;
    address[] public investors;
    
    // Events
    event FundingReceived(address indexed investor, uint256 amount);
    event RevenueShared(uint256 amount, uint256 timestamp);
    event RepaymentCompleted(uint256 totalAmount);
    event MetadataUpdated(string newURI);
    event FundingClosed();
    event WithdrawalMade(address indexed investor, uint256 amount);
    
    constructor(
        address _fundingToken,
        address _business,
        string memory _metadataURI,
        uint256 _fundingGoal,
        uint256 _revenueSharePercentage,
        uint256 _repaymentCap
    ) Ownable(msg.sender) {
        fundingToken = IERC20(_fundingToken);
        business = _business;
        metadataURI = _metadataURI;
        fundingGoal = _fundingGoal;
        revenueSharePercentage = _revenueSharePercentage;
        repaymentCap = _repaymentCap;
        fundingActive = true;
        lastRevenueReportDate = block.timestamp;
    }
    
    /**
     * @dev Invest in the business advance
     */
    function invest(uint256 amount) external nonReentrant {
        require(fundingActive, "Funding is closed");
        require(amount > 0, "Amount must be greater than 0");
        require(totalFunded + amount <= fundingGoal, "Exceeds funding goal");
        
        fundingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        if (investments[msg.sender] == 0) {
            investors.push(msg.sender);
        }
        
        investments[msg.sender] += amount;
        totalFunded += amount;
        
        emit FundingReceived(msg.sender, amount);
        
        // Auto-close funding if goal reached
        if (totalFunded >= fundingGoal) {
            _closeFunding();
        }
    }
    
    /**
     * @dev Close funding and release funds to business
     */
    function closeFunding() external onlyOwner {
        _closeFunding();
    }
    
    function _closeFunding() private {
        require(fundingActive, "Funding already closed");
        fundingActive = false;
        repaymentActive = true;
        
        // Transfer funds to business
        fundingToken.safeTransfer(business, totalFunded);
        
        emit FundingClosed();
    }
    
    /**
     * @dev Submit monthly revenue share payment
     */
    function submitRevenueShare(uint256 revenueAmount) external nonReentrant {
        require(msg.sender == business, "Only business can submit revenue");
        require(repaymentActive, "Repayment not active");
        require(block.timestamp >= lastRevenueReportDate + 30 days, "Too early for next payment");
        
        uint256 shareAmount = (revenueAmount * revenueSharePercentage) / 10000;
        uint256 maxRepayment = (totalFunded * repaymentCap) / 10000;
        uint256 remainingCap = maxRepayment - totalRepaid;
        
        // Cap the payment if it would exceed the repayment cap
        if (shareAmount > remainingCap) {
            shareAmount = remainingCap;
        }
        
        require(shareAmount > 0, "No payment due");
        
        fundingToken.safeTransferFrom(msg.sender, address(this), shareAmount);
        
        // Distribute proportionally to investors
        for (uint256 i = 0; i < investors.length; i++) {
            address investor = investors[i];
            uint256 investorShare = (shareAmount * investments[investor]) / totalFunded;
            investorReturns[investor] += investorShare;
        }
        
        totalRepaid += shareAmount;
        monthlyRevenue = revenueAmount;
        lastRevenueReportDate = block.timestamp;
        
        emit RevenueShared(shareAmount, block.timestamp);
        
        // Check if repayment cap reached
        if (totalRepaid >= maxRepayment) {
            repaymentActive = false;
            emit RepaymentCompleted(totalRepaid);
        }
    }
    
    /**
     * @dev Investor withdraws their returns
     */
    function withdrawReturns() external nonReentrant {
        uint256 amount = investorReturns[msg.sender];
        require(amount > 0, "No returns available");
        
        investorReturns[msg.sender] = 0;
        fundingToken.safeTransfer(msg.sender, amount);
        
        emit WithdrawalMade(msg.sender, amount);
    }
    
    /**
     * @dev Update metadata URI
     */
    function updateMetadata(string memory newURI) external onlyOwner {
        metadataURI = newURI;
        emit MetadataUpdated(newURI);
    }
    
    /**
     * @dev Get investor count
     */
    function getInvestorCount() external view returns (uint256) {
        return investors.length;
    }
    
    /**
     * @dev Calculate expected monthly payment based on revenue
     */
    function calculateMonthlyPayment(uint256 revenue) external view returns (uint256) {
        uint256 shareAmount = (revenue * revenueSharePercentage) / 10000;
        uint256 maxRepayment = (totalFunded * repaymentCap) / 10000;
        uint256 remainingCap = maxRepayment - totalRepaid;
        
        return shareAmount > remainingCap ? remainingCap : shareAmount;
    }
    
    /**
     * @dev Get advance details
     */
    function getAdvanceDetails() external view returns (
        uint256 _fundingGoal,
        uint256 _totalFunded,
        uint256 _totalRepaid,
        uint256 _revenueSharePercentage,
        uint256 _repaymentCap,
        bool _fundingActive,
        bool _repaymentActive
    ) {
        return (
            fundingGoal,
            totalFunded,
            totalRepaid,
            revenueSharePercentage,
            repaymentCap,
            fundingActive,
            repaymentActive
        );
    }
}