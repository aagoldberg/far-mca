// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 * @title FarcasterFundraise
 * @author Your Name/Organization
 * @notice This contract facilitates crowdfunding campaigns using a "Milestone (Flexible Funding)" model.
 * In this model:
 * 1. The `goalAmount` is a transparent target, not a strict requirement for claiming funds.
 * 2. Creators can claim any funds raised at any time during or after the campaign.
 * 3. The `deadline` can be extended by the creator. Funding is only allowed before the deadline.
 * 4. Contributors can only get refunds if the creator explicitly cancels the campaign.
 */

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/utils/Pausable.sol";

interface IERC20WithPermit is IERC20 {
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

contract FarcasterFundraise is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- Custom Errors ---
    error InvalidGoalAmount();
    error ContributionMustBePositive();
    error CampaignNotActive();
    error NotCampaignCreator();
    error NoFundsToClaim();
    error TransferFailed();
    error RefundsNotAvailable(); // For when refunds are not applicable (e.g. trying to refund from non-cancelled campaign)
    error NoContributionToRefund();
    error CampaignAlreadyCancelled();
    error CampaignNotCancelled(); // For operations that require campaign to be NOT cancelled
    error EmptyMetadataCID(); // New error for empty metadata CID
    error CampaignHasEnded(); // When trying to interact with a campaign that has passed its deadline.
    error InvalidDuration(); // For campaign creation with zero duration.
    error InvalidExtensionDuration(); // For campaign extension with zero duration.
    error DurationExceedsMax(uint256 duration, uint256 maxDuration);
    error InvalidFeePercentage(uint256 feePercentage);
    error CannotWithdrawUSDC();

    struct Campaign {
        address creator; // Creator's address
        string metadataCID; // IPFS/Arweave CID containing all campaign metadata (title, description, image)
        uint256 goalAmount; // In USDC, now serves as a target
        uint256 totalRaised; // In USDC
        uint256 deadline;   // Deadline for the campaign
        bool cancelled;     // True if campaign was cancelled by creator
        mapping(address => uint256) contributions;
        address[] contributors;
    }

    IERC20 public usdcToken;
    uint256 public campaignCounter;
    mapping(uint256 => Campaign) public campaigns;

    // --- Admin Config ---
    uint256 public maxDuration; // Maximum campaign duration in seconds
    address public feeAddress;
    uint256 public feePercentage; // In basis points (e.g., 100 = 1%)

    // --- Events ---
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string metadataCID,
        uint256 goalAmount,
        uint256 deadline
    );

    event CampaignMetadataUpdated(
        uint256 indexed campaignId,
        string oldMetadataCID,
        string newMetadataCID,
        uint256 timestamp
    );

    event ContributionMade(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    event FundsClaimed(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );
    event FundsRefunded(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );
    event CampaignCancelled(
        uint256 indexed campaignId,
        address indexed creator
    );
    event CampaignDurationExtended(
        uint256 indexed campaignId,
        uint256 newDeadline
    );

    // Admin Events
    event MaxDurationUpdated(uint256 oldMaxDuration, uint256 newMaxDuration);
    event FeeAddressUpdated(address oldFeeAddress, address newFeeAddress);
    event FeePercentageUpdated(uint256 oldFeePercentage, uint256 newFeePercentage);
    event ContractPaused(address account);
    event ContractUnpaused(address account);

    // --- Modifiers ---
    modifier onlyCreator(uint256 _campaignId) {
        if (campaigns[_campaignId].creator != msg.sender) revert NotCampaignCreator();
        _;
    }
    
    modifier campaignIsActiveAndNotCancelled(uint256 _campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        if (campaign.cancelled) revert CampaignAlreadyCancelled();
        if (block.timestamp >= campaign.deadline) revert CampaignHasEnded();
        _;
    }

    constructor(
        address _usdcTokenAddress,
        address _initialOwner,
        address _feeAddress,
        uint16 _feePercentage,
        uint256 _maxDuration
    ) Ownable(_initialOwner) {
        if (_usdcTokenAddress == address(0)) revert();
        if (_feeAddress == address(0)) revert();
        if (_feePercentage > 10000) revert InvalidFeePercentage(_feePercentage); // Max 100%

        usdcToken = IERC20(_usdcTokenAddress);
        feeAddress = _feeAddress;
        feePercentage = _feePercentage;
        maxDuration = _maxDuration;
        campaignCounter = 0;
    }

    function createCampaign(
        string memory _metadataCID,
        uint256 _goalAmount, // In USDC
        uint256 _duration // in seconds
    ) public whenNotPaused returns (uint256) {
        if (_goalAmount == 0) revert InvalidGoalAmount();
        if (bytes(_metadataCID).length == 0) revert EmptyMetadataCID();
        if (_duration == 0) revert InvalidDuration();
        if (maxDuration > 0 && _duration > maxDuration) revert DurationExceedsMax(_duration, maxDuration);

        campaignCounter++;
        uint256 currentCampaignId = campaignCounter;
        uint256 campaignDeadline = block.timestamp + _duration;

        Campaign storage newCampaign = campaigns[currentCampaignId];
        newCampaign.creator = msg.sender;
        newCampaign.metadataCID = _metadataCID;
        newCampaign.goalAmount = _goalAmount;
        newCampaign.deadline = campaignDeadline;
        newCampaign.totalRaised = 0;
        newCampaign.cancelled = false;

        emit CampaignCreated(currentCampaignId, msg.sender, _metadataCID, _goalAmount, campaignDeadline);
        return currentCampaignId;
    }

    function updateCampaignMetadata(
        uint256 _campaignId,
        string memory _newMetadataCID
    ) 
        public 
        whenNotPaused 
        nonReentrant 
        onlyCreator(_campaignId)
        campaignIsActiveAndNotCancelled(_campaignId)
    {
        if (bytes(_newMetadataCID).length == 0) revert EmptyMetadataCID();
        
        Campaign storage campaign = campaigns[_campaignId];
        string memory oldMetadataCID = campaign.metadataCID;
        
        campaign.metadataCID = _newMetadataCID;
        
        emit CampaignMetadataUpdated(
            _campaignId,
            oldMetadataCID,
            _newMetadataCID,
            block.timestamp
        );
    }

    function extendCampaign(uint256 _campaignId, uint256 _extensionInSeconds) 
        public 
        whenNotPaused 
        nonReentrant 
        onlyCreator(_campaignId)
        campaignIsActiveAndNotCancelled(_campaignId)
    {
        if (_extensionInSeconds == 0) revert InvalidExtensionDuration();
        
        Campaign storage campaign = campaigns[_campaignId];
        
        campaign.deadline += _extensionInSeconds;
        
        emit CampaignDurationExtended(_campaignId, campaign.deadline);
    }

    function fundCampaign(
        uint256 _campaignId,
        uint256 _amount
    ) public whenNotPaused nonReentrant campaignIsActiveAndNotCancelled(_campaignId) {
        _fundCampaign(_campaignId, msg.sender, _amount);
    }

    function fundWithPermit(
        uint256 _campaignId,
        uint256 _amount,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public whenNotPaused nonReentrant campaignIsActiveAndNotCancelled(_campaignId) {
        IERC20WithPermit(address(usdcToken)).permit(
            msg.sender,
            address(this),
            _amount,
            _deadline,
            _v,
            _r,
            _s
        );
        _fundCampaign(_campaignId, msg.sender, _amount);
    }

    function _fundCampaign(uint256 _campaignId, address _contributor, uint256 _amount) internal {
        if (_amount == 0) revert ContributionMustBePositive();
        
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.contributions[_contributor] == 0) {
            campaign.contributors.push(_contributor);
        }

        campaign.contributions[_contributor] += _amount;
        campaign.totalRaised += _amount;

        usdcToken.safeTransferFrom(_contributor, address(this), _amount);

        emit ContributionMade(_campaignId, _contributor, _amount);
    }

    function claimFunds(uint256 _campaignId) 
        public 
        whenNotPaused 
        nonReentrant 
        onlyCreator(_campaignId) 
    {
        // The creator can claim funds at any time, even after the deadline has passed.
        // We only check that the campaign has not been manually cancelled.
        Campaign storage campaign = campaigns[_campaignId];
        if (campaign.cancelled) revert CampaignAlreadyCancelled();
        
        uint256 amountToClaim = campaign.totalRaised;
        if (amountToClaim == 0) revert NoFundsToClaim();

        // The campaign remains active for claims until explicitly cancelled by the creator.
        campaign.totalRaised = 0; // Reset totalRaised after claiming to support multiple claims.

        // Platform Fee Logic
        uint256 fee = (amountToClaim * feePercentage) / 10000;
        uint256 amountToCreator = amountToClaim - fee;

        if (fee > 0) {
            usdcToken.safeTransfer(feeAddress, fee);
        }
        usdcToken.safeTransfer(campaign.creator, amountToCreator);
        
        emit FundsClaimed(_campaignId, campaign.creator, amountToCreator);
    }

    function refund(uint256 _campaignId) 
        public 
        whenNotPaused 
        nonReentrant 
    {
        Campaign storage campaign = campaigns[_campaignId];
        if (!campaign.cancelled) revert RefundsNotAvailable();

        uint256 amountToRefund = campaign.contributions[msg.sender];
        if (amountToRefund == 0) revert NoContributionToRefund();

        campaign.contributions[msg.sender] = 0;

        usdcToken.safeTransfer(msg.sender, amountToRefund);
        emit FundsRefunded(_campaignId, msg.sender, amountToRefund);
    }

    function cancelCampaign(uint256 _campaignId) 
        public 
        whenNotPaused 
        nonReentrant 
        onlyCreator(_campaignId)
        campaignIsActiveAndNotCancelled(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        // Creator can cancel anytime before the deadline, which allows contributors to get refunds.
        // This action makes the campaign inactive for funding and claiming.
        campaign.cancelled = true;

        emit CampaignCancelled(_campaignId, msg.sender);
    }

    // --- Owner Functions ---
    function pauseContract() public onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    function unpauseContract() public onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    function setUsdcTokenAddress(address _newUsdcTokenAddress) public onlyOwner {
        if (_newUsdcTokenAddress == address(0)) revert();
        usdcToken = IERC20(_newUsdcTokenAddress);
    }

    function setMaxDuration(uint256 _newMaxDuration) public onlyOwner {
        emit MaxDurationUpdated(maxDuration, _newMaxDuration);
        maxDuration = _newMaxDuration;
    }

    function setFeeAddress(address _newFeeAddress) public onlyOwner {
        require(_newFeeAddress != address(0), "Cannot set fee address to the zero address");
        emit FeeAddressUpdated(feeAddress, _newFeeAddress);
        feeAddress = _newFeeAddress;
    }

    function setFeePercentage(uint256 _newFeePercentage) public onlyOwner {
        // We recommend a max fee of 10% (1000 basis points) to prevent accidental fat-fingering
        if (_newFeePercentage > 1000) revert InvalidFeePercentage(_newFeePercentage);
        emit FeePercentageUpdated(feePercentage, _newFeePercentage);
        feePercentage = _newFeePercentage;
    }

    function rescueERC20(address _tokenAddress, address _to, uint256 _amount) public onlyOwner {
        if (_tokenAddress == address(usdcToken)) revert CannotWithdrawUSDC();
        IERC20(_tokenAddress).safeTransfer(_to, _amount);
    }

    // --- View Functions ---
    function getCampaignCount() public view returns (uint256) {
        return campaignCounter;
    }

    function getCampaignDetails(uint256 _campaignId) 
        public 
        view 
        returns (
            address creator,
            string memory metadataCID,
            uint256 goalAmount,
            uint256 totalRaised,
            uint256 deadline,
            bool cancelled,
            uint256 contributorCount
        )
    {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        Campaign storage c = campaigns[_campaignId];
        return (
            c.creator,
            c.metadataCID,
            c.goalAmount,
            c.totalRaised,
            c.deadline,
            c.cancelled,
            c.contributors.length
        );
    }

    // Function to get the list of contributors for a campaign
    function getContributors(uint256 _campaignId) public view returns (address[] memory) {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        return campaigns[_campaignId].contributors;
    }

    // Function to get a specific contribution amount for a contributor
    function getContributionAmount(uint256 _campaignId, address _contributor) public view returns (uint256) {
        require(_campaignId > 0 && _campaignId <= campaignCounter, "Invalid campaign ID");
        return campaigns[_campaignId].contributions[_contributor];
    }
} 