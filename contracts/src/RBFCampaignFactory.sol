// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RBFCampaign.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RBFCampaignFactory
 * @dev Factory contract for deploying unified RBF campaigns (crowdfunding + revenue sharing)
 * Replaces the need for separate Campaign and RBFAdvance deployments
 */
contract RBFCampaignFactory is Ownable {
    
    // --- Custom Errors ---
    error InvalidFundingGoal();
    error InvalidDeadline();
    error InvalidRevenueShare();
    error InvalidRepaymentCap();
    error EmptyMetadataURI();
    error InvalidParameterUpdate();

    // --- State Variables ---
    address public immutable usdcToken; // USDC token address
    address[] public campaigns;
    mapping(address => address[]) public businessCampaigns;
    mapping(address => bool) public isValidCampaign;
    
    // Configurable limits (updateable by owner)
    uint256 public minFundingGoal = 1000e6; // $1,000 USDC
    uint256 public maxFundingGoal = 10_000_000e6; // $10M USDC
    uint256 public minFundingPeriod = 7 days;
    uint256 public maxFundingPeriod = 90 days;
    uint256 public minRevenueShare = 100; // 1%
    uint256 public maxRevenueShare = 2000; // 20%
    uint256 public minRepaymentCap = 11000; // 1.1x
    uint256 public maxRepaymentCap = 30000; // 3.0x

    // --- Events ---
    event CampaignCreated(
        address indexed campaign,
        address indexed business,
        uint256 fundingGoal,
        uint256 deadline,
        uint256 revenueSharePercent,
        uint256 repaymentCap
    );
    
    event ParametersUpdated(string parameterType, uint256 newMin, uint256 newMax);

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = _usdcToken;
    }

    /**
     * @dev Create a new RBF campaign (USDC only for MVP)
     */
    function createCampaign(
        string memory metadataURI,
        uint256 fundingGoal,
        uint256 fundingPeriodDays,
        uint256 revenueSharePercent,
        uint256 repaymentCap
    ) external returns (address) {
        // Validate inputs against current limits
        if (bytes(metadataURI).length == 0) revert EmptyMetadataURI();
        if (fundingGoal < minFundingGoal || fundingGoal > maxFundingGoal) {
            revert InvalidFundingGoal();
        }
        
        uint256 fundingPeriodSeconds = fundingPeriodDays * 1 days;
        if (fundingPeriodSeconds < minFundingPeriod || fundingPeriodSeconds > maxFundingPeriod) {
            revert InvalidDeadline();
        }
        
        if (revenueSharePercent < minRevenueShare || revenueSharePercent > maxRevenueShare) {
            revert InvalidRevenueShare();
        }
        
        if (repaymentCap < minRepaymentCap || repaymentCap > maxRepaymentCap) {
            revert InvalidRepaymentCap();
        }

        // Calculate deadline
        uint256 deadline = block.timestamp + fundingPeriodSeconds;

        // Deploy new campaign with USDC
        RBFCampaign campaign = new RBFCampaign(
            msg.sender, // business owner
            usdcToken,
            metadataURI,
            fundingGoal,
            deadline,
            revenueSharePercent,
            repaymentCap
        );

        address campaignAddress = address(campaign);
        
        // Track campaign
        campaigns.push(campaignAddress);
        businessCampaigns[msg.sender].push(campaignAddress);
        isValidCampaign[campaignAddress] = true;

        emit CampaignCreated(
            campaignAddress,
            msg.sender,
            fundingGoal,
            deadline,
            revenueSharePercent,
            repaymentCap
        );

        return campaignAddress;
    }

    /**
     * @dev Update funding goal limits
     */
    function updateFundingLimits(uint256 _min, uint256 _max) external onlyOwner {
        require(_min > 0 && _max > _min, "Invalid limits");
        minFundingGoal = _min;
        maxFundingGoal = _max;
        emit ParametersUpdated("FundingGoal", _min, _max);
    }

    /**
     * @dev Update funding period limits (in days)
     */
    function updateFundingPeriodLimits(uint256 _minDays, uint256 _maxDays) external onlyOwner {
        require(_minDays > 0 && _maxDays > _minDays, "Invalid limits");
        minFundingPeriod = _minDays * 1 days;
        maxFundingPeriod = _maxDays * 1 days;
        emit ParametersUpdated("FundingPeriod", _minDays, _maxDays);
    }

    /**
     * @dev Update revenue share limits (basis points)
     */
    function updateRevenueShareLimits(uint256 _min, uint256 _max) external onlyOwner {
        require(_min > 0 && _max <= 10000 && _max > _min, "Invalid limits");
        minRevenueShare = _min;
        maxRevenueShare = _max;
        emit ParametersUpdated("RevenueShare", _min, _max);
    }

    /**
     * @dev Update repayment cap limits (basis points)
     */
    function updateRepaymentCapLimits(uint256 _min, uint256 _max) external onlyOwner {
        require(_min >= 10000 && _max <= 100000 && _max > _min, "Invalid limits");
        minRepaymentCap = _min;
        maxRepaymentCap = _max;
        emit ParametersUpdated("RepaymentCap", _min, _max);
    }

    // --- View Functions ---

    /**
     * @dev Get current parameter limits
     */
    function getLimits() external view returns (
        uint256 _minFundingGoal,
        uint256 _maxFundingGoal,
        uint256 _minRevenueShare,
        uint256 _maxRevenueShare,
        uint256 _minRepaymentCap,
        uint256 _maxRepaymentCap,
        uint256 _minFundingDays,
        uint256 _maxFundingDays
    ) {
        return (
            minFundingGoal,
            maxFundingGoal,
            minRevenueShare,
            maxRevenueShare,
            minRepaymentCap,
            maxRepaymentCap,
            minFundingPeriod / 1 days,
            maxFundingPeriod / 1 days
        );
    }

    /**
     * @dev Get all campaigns
     */
    function getCampaigns() external view returns (address[] memory) {
        return campaigns;
    }

    /**
     * @dev Get campaigns for a specific business
     */
    function getBusinessCampaigns(address business) external view returns (address[] memory) {
        return businessCampaigns[business];
    }

    /**
     * @dev Get total number of campaigns
     */
    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }

    /**
     * @dev Get campaign details in a single call (for frontend efficiency)
     */
    function getCampaignDetails(address campaignAddress) external view returns (
        bool isValid,
        address owner,
        address token,
        string memory metadataURI,
        uint256 fundingGoal,
        uint256 totalFunded,
        bool fundingActive,
        bool repaymentActive
    ) {
        if (!isValidCampaign[campaignAddress]) {
            return (false, address(0), address(0), "", 0, 0, false, false);
        }

        RBFCampaign campaign = RBFCampaign(payable(campaignAddress));
        
        (
            uint256 _fundingGoal,
            uint256 _totalFunded,
            ,,,
            bool _fundingActive,
            bool _repaymentActive,
        ) = campaign.getCampaignDetails();

        return (
            true,
            campaign.owner(),
            address(campaign.token()),
            campaign.metadataURI(),
            _fundingGoal,
            _totalFunded,
            _fundingActive,
            _repaymentActive
        );
    }

    /**
     * @dev Get active campaigns (still in funding phase)
     */
    function getActiveCampaigns() external view returns (address[] memory) {
        uint256 activeCount = 0;
        
        // First pass: count active campaigns
        for (uint256 i = 0; i < campaigns.length; i++) {
            RBFCampaign campaign = RBFCampaign(payable(campaigns[i]));
            (, , , , , bool fundingActive, ,) = campaign.getCampaignDetails();
            if (fundingActive && block.timestamp < campaign.fundingDeadline()) {
                activeCount++;
            }
        }
        
        // Second pass: populate array
        address[] memory activeCampaigns = new address[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < campaigns.length; i++) {
            RBFCampaign campaign = RBFCampaign(payable(campaigns[i]));
            (, , , , , bool fundingActive, ,) = campaign.getCampaignDetails();
            if (fundingActive && block.timestamp < campaign.fundingDeadline()) {
                activeCampaigns[index] = campaigns[i];
                index++;
            }
        }
        
        return activeCampaigns;
    }

    /**
     * @dev Get campaigns in repayment phase
     */
    function getRepaymentCampaigns() external view returns (address[] memory) {
        uint256 repaymentCount = 0;
        
        // First pass: count repayment campaigns
        for (uint256 i = 0; i < campaigns.length; i++) {
            RBFCampaign campaign = RBFCampaign(payable(campaigns[i]));
            (, , , , , , bool repaymentActive,) = campaign.getCampaignDetails();
            if (repaymentActive) {
                repaymentCount++;
            }
        }
        
        // Second pass: populate array
        address[] memory repaymentCampaigns = new address[](repaymentCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < campaigns.length; i++) {
            RBFCampaign campaign = RBFCampaign(payable(campaigns[i]));
            (, , , , , , bool repaymentActive,) = campaign.getCampaignDetails();
            if (repaymentActive) {
                repaymentCampaigns[index] = campaigns[i];
                index++;
            }
        }
        
        return repaymentCampaigns;
    }
}