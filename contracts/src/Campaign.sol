// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

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

/**
 * @title Campaign
 * @author Your Name
 * @notice A contract for a single fundraising campaign, designed to be deployed by a factory.
 * This contract follows a "GoFundMe-style" flexible funding model and uses an ERC20 token for donations.
 */
contract Campaign {
    using SafeERC20 for IERC20;

    // --- Custom Errors ---
    error NotOwner();
    error CampaignHasEnded();
    error CampaignHasBeenEnded();
    error DonationMustBePositive();
    error PermitDeadlineExpired();
    error CampaignNotEnded(); // For deadline checks
    error FundsAlreadyClaimed();
    error TransferFailed();
    error CampaignNotEndedByOwner(); // For refund checks
    error NoContributionToRefund();
    error MetadataURICannotBeEmpty();

    // --- State Variables ---

    address public immutable owner;
    IERC20 public immutable token; // The ERC20 token for donations (e.g., USDC)
    uint256 public immutable goalAmount; // The target funding amount in token units.
    uint256 public immutable deadline; // Unix timestamp of when the campaign ends.
    string public metadataURI; // URI for off-chain metadata (title, description, image).

    uint256 public totalDonations; // The total amount of funds raised.
    mapping(address => uint256) public contributions; // Tracks contributions per donor.

    bool public fundsClaimed; // Flag to prevent double-claiming.
    bool public endedByOwner; // Flag to indicate if the campaign has been ended by the owner.

    // --- Events ---

    event Donated(address indexed donor, uint256 amount);
    event Claimed(uint256 amount);
    event CampaignEnded();
    event Refunded(address indexed donor, uint256 amount);
    event MetadataUpdated(string oldMetadataURI, string newMetadataURI, uint256 timestamp);

    // --- Modifiers ---

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // --- Functions ---

    constructor(
        address _owner,
        address _tokenAddress,
        uint256 _goalAmount,
        uint256 _deadline,
        string memory _metadataURI
    ) {
        owner = _owner;
        token = IERC20(_tokenAddress);
        goalAmount = _goalAmount;
        deadline = _deadline;
        metadataURI = _metadataURI;
    }

    function updateMetadataURI(string memory _newMetadataURI) external onlyOwner {
        if (bytes(_newMetadataURI).length == 0) revert MetadataURICannotBeEmpty();
        
        string memory oldMetadataURI = metadataURI;
        metadataURI = _newMetadataURI;

        emit MetadataUpdated(oldMetadataURI, _newMetadataURI, block.timestamp);
    }

    function donate(uint256 _amount) external {
        if (block.timestamp >= deadline) revert CampaignHasEnded();
        if (endedByOwner) revert CampaignHasBeenEnded();
        if (_amount == 0) revert DonationMustBePositive();

        token.safeTransferFrom(msg.sender, address(this), _amount);

        contributions[msg.sender] += _amount;
        totalDonations += _amount;

        emit Donated(msg.sender, _amount);
    }

    function donateWithPermit(
        address _donor,
        uint256 _amount,
        uint256 _permitDeadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external {
        if (block.timestamp >= deadline) revert CampaignHasEnded();
        if (endedByOwner) revert CampaignHasBeenEnded();
        if (_amount == 0) revert DonationMustBePositive();
        if (block.timestamp > _permitDeadline) revert PermitDeadlineExpired();

        IERC20Permit(address(token)).permit(
            _donor,
            address(this),
            _amount,
            _permitDeadline,
            _v,
            _r,
            _s
        );

        token.safeTransferFrom(_donor, address(this), _amount);

        contributions[_donor] += _amount;
        totalDonations += _amount;

        emit Donated(_donor, _amount);
    }

    function claimFunds() external onlyOwner {
        if (block.timestamp < deadline) revert CampaignNotEnded();
        if (fundsClaimed) revert FundsAlreadyClaimed();

        fundsClaimed = true;
        uint256 balance = token.balanceOf(address(this));
        
        emit Claimed(balance);

        token.safeTransfer(owner, balance);
    }

    function endCampaign() external onlyOwner {
        if (endedByOwner) revert CampaignHasBeenEnded();
        endedByOwner = true;
        emit CampaignEnded();
    }

    function refund() external {
        if (!endedByOwner) revert CampaignNotEndedByOwner();
        
        uint256 amountToRefund = contributions[msg.sender];
        if (amountToRefund == 0) revert NoContributionToRefund();

        contributions[msg.sender] = 0;
        totalDonations -= amountToRefund;

        emit Refunded(msg.sender, amountToRefund);

        token.safeTransfer(msg.sender, amountToRefund);
    }

    // --- ETH Rejection ---

    /**
     * @notice Rejects direct ETH transfers to the contract to prevent locked funds.
     */
    receive() external payable {
        revert TransferFailed();
    }

    fallback() external payable {
        revert TransferFailed();
    }
} 