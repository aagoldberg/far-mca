// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Campaign.sol";

/**
 * @title CampaignFactory
 * @author Your Name
 * @notice A factory contract to deploy and track Campaign contracts.
 */
contract CampaignFactory {
    // --- Custom Errors ---
    error NotOwner();
    error InvalidGoalAmount();
    error InvalidDeadline();
    error EmptyMetadataURI();
    error InvalidPagination();

    // --- State Variables ---

    uint256 public campaignCount;
    mapping(uint256 => address) public campaigns;
    
    address public immutable owner;
    address public immutable tokenAddress; // The address of the token used for all campaigns (e.g., USDC)

    // --- Events ---

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed campaignAddress,
        address indexed creator,
        address tokenAddress,
        uint256 goalAmount,
        uint256 deadline,
        string metadataURI
    );

    // --- Modifier ---

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // --- Functions ---

    constructor(address _tokenAddress, address _owner) {
        owner = _owner;
        tokenAddress = _tokenAddress;
    }

    /**
     * @notice Deploys a new Campaign contract and stores its address.
     * @param _goalAmount The fundraising goal in token units.
     * @param _deadline The Unix timestamp for the campaign's end.
     * @param _metadataURI The URI pointing to the campaign's metadata.
     * @return campaignId The ID of the newly created campaign.
     */
    function createCampaign(
        uint256 _goalAmount,
        uint256 _deadline,
        string memory _metadataURI
    ) external returns (uint256 campaignId) {
        if (_goalAmount == 0) revert InvalidGoalAmount();
        if (_deadline <= block.timestamp) revert InvalidDeadline();
        if (bytes(_metadataURI).length == 0) revert EmptyMetadataURI();

        campaignId = campaignCount;

        Campaign newCampaign = new Campaign(
            msg.sender,
            tokenAddress,
            _goalAmount,
            _deadline,
            _metadataURI
        );

        address newCampaignAddress = address(newCampaign);
        campaigns[campaignId] = newCampaignAddress;

        emit CampaignCreated(
            campaignId,
            newCampaignAddress,
            msg.sender,
            tokenAddress,
            _goalAmount,
            _deadline,
            _metadataURI
        );

        campaignCount++;
    }

    /**
     * @notice Returns a paginated array of deployed campaign addresses.
     * @param _start The starting index of the campaigns to retrieve.
     * @param _limit The maximum number of campaigns to retrieve.
     * @return An array of campaign addresses.
     */
    function getCampaigns(uint256 _start, uint256 _limit) external view returns (address[] memory) {
        if (_start >= campaignCount) {
            return new address[](0);
        }
        if (_limit == 0) revert InvalidPagination();

        uint256 end = _start + _limit;
        if (end > campaignCount) {
            end = campaignCount;
        }

        address[] memory addresses = new address[](end - _start);
        for (uint256 i = _start; i < end; i++) {
            addresses[i - _start] = campaigns[i];
        }
        return addresses;
    }
} 