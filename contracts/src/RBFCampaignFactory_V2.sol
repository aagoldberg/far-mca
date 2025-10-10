// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RBFCampaign.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RBFCampaignFactory V2
 * @dev Factory with configurable parameters for RBF campaigns
 */
contract RBFCampaignFactory is Ownable {
    
    // --- Custom Errors ---
    error InvalidFundingGoal();
    error InvalidDeadline();
    error InvalidRevenueShare();
    error InvalidRepaymentCap();
    error TokenNotWhitelisted();
    error EmptyMetadataURI();
    error InvalidParameterUpdate();

    // --- State Variables ---
    address public immutable defaultToken;
    address[] public campaigns;
    mapping(address => address[]) public businessCampaigns;
    mapping(address => bool) public isValidCampaign;
    mapping(address => bool) public whitelistedTokens;
    
    // Configurable limits (can be updated by owner)
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
        address indexed token,
        uint256 fundingGoal,
        uint256 deadline,
        uint256 revenueSharePercent,
        uint256 repaymentCap
    );
    
    event TokenWhitelisted(address indexed token, bool status);
    event ParametersUpdated(string parameterType, uint256 newMin, uint256 newMax);

    constructor(address _defaultToken) Ownable(msg.sender) {
        defaultToken = _defaultToken;
        whitelistedTokens[_defaultToken] = true;
    }

    /**
     * @dev Update funding goal limits
     */
    function updateFundingLimits(uint256 _min, uint256 _max) external onlyOwner {
        if (_min == 0 || _max <= _min) revert InvalidParameterUpdate();
        
        minFundingGoal = _min;
        maxFundingGoal = _max;
        
        emit ParametersUpdated("FundingGoal", _min, _max);
    }

    /**
     * @dev Update funding period limits
     */
    function updateFundingPeriodLimits(uint256 _minDays, uint256 _maxDays) external onlyOwner {
        if (_minDays == 0 || _maxDays <= _minDays) revert InvalidParameterUpdate();
        
        minFundingPeriod = _minDays * 1 days;
        maxFundingPeriod = _maxDays * 1 days;
        
        emit ParametersUpdated("FundingPeriod", _minDays, _maxDays);
    }

    /**
     * @dev Update revenue share limits
     */
    function updateRevenueShareLimits(uint256 _min, uint256 _max) external onlyOwner {
        if (_min == 0 || _max > 10000 || _max <= _min) revert InvalidParameterUpdate();
        
        minRevenueShare = _min;
        maxRevenueShare = _max;
        
        emit ParametersUpdated("RevenueShare", _min, _max);
    }

    /**
     * @dev Update repayment cap limits
     */
    function updateRepaymentCapLimits(uint256 _min, uint256 _max) external onlyOwner {
        if (_min < 10000 || _max > 100000 || _max <= _min) revert InvalidParameterUpdate();
        
        minRepaymentCap = _min;
        maxRepaymentCap = _max;
        
        emit ParametersUpdated("RepaymentCap", _min, _max);
    }

    /**
     * @dev Create a new RBF campaign with default token (USDC)
     */
    function createCampaign(
        string memory metadataURI,
        uint256 fundingGoal,
        uint256 fundingPeriodDays,
        uint256 revenueSharePercent,
        uint256 repaymentCap
    ) external returns (address) {
        return _createCampaign(
            defaultToken,
            metadataURI,
            fundingGoal,
            fundingPeriodDays,
            revenueSharePercent,
            repaymentCap
        );
    }

    /**
     * @dev Create a new RBF campaign with custom token
     */
    function createCampaignWithToken(
        address token,
        string memory metadataURI,
        uint256 fundingGoal,
        uint256 fundingPeriodDays,
        uint256 revenueSharePercent,
        uint256 repaymentCap
    ) external returns (address) {
        if (!whitelistedTokens[token]) revert TokenNotWhitelisted();
        
        return _createCampaign(
            token,
            metadataURI,
            fundingGoal,
            fundingPeriodDays,
            revenueSharePercent,
            repaymentCap
        );
    }

    function _createCampaign(
        address token,
        string memory metadataURI,
        uint256 fundingGoal,
        uint256 fundingPeriodDays,
        uint256 revenueSharePercent,
        uint256 repaymentCap
    ) private returns (address) {
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

        // Deploy new campaign
        RBFCampaign campaign = new RBFCampaign(
            msg.sender, // business owner
            token,
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
            token,
            fundingGoal,
            deadline,
            revenueSharePercent,
            repaymentCap
        );

        return campaignAddress;
    }

    /**
     * @dev Whitelist a token for campaign creation
     */
    function setTokenWhitelist(address token, bool status) external onlyOwner {
        whitelistedTokens[token] = status;
        emit TokenWhitelisted(token, status);
    }

    // --- Emergency Functions ---

    /**
     * @dev Emergency pause for specific campaign (requires campaign upgrade)
     */
    function pauseCampaign(address campaign) external onlyOwner {
        require(isValidCampaign[campaign], "Invalid campaign");
        // Would require IPausable interface on campaigns
        // IPausable(campaign).pause();
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