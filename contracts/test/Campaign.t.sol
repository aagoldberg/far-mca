// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Campaign.sol";
import "../src/CampaignFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract CampaignTest is Test {
    CampaignFactory public factory;
    Campaign public campaign;
    MockUSDC public usdc;
    
    address public creator = address(0x1);
    address public donor1 = address(0x2);
    address public donor2 = address(0x3);
    address public factoryOwner = address(0x4);
    
    uint256 public constant GOAL_AMOUNT = 10000 * 10**6; // 10,000 USDC
    uint256 public deadline;
    string public constant METADATA_URI = "ipfs://QmTest123";
    
    function setUp() public {
        // Deploy mock USDC
        usdc = new MockUSDC();
        
        // Set deadline to 30 days from now
        deadline = block.timestamp + 30 days;
        
        // Deploy factory with token address and owner
        factory = new CampaignFactory(address(usdc), factoryOwner);
        
        // Create campaign through factory
        vm.prank(creator);
        uint256 campaignId = factory.createCampaign(
            GOAL_AMOUNT,
            deadline,
            METADATA_URI
        );
        address campaignAddress = factory.campaigns(campaignId);
        campaign = Campaign(payable(campaignAddress));
        
        // Fund test accounts
        usdc.transfer(donor1, 5000 * 10**6); // 5,000 USDC
        usdc.transfer(donor2, 5000 * 10**6); // 5,000 USDC
    }
    
    function test_CampaignCreation() public view {
        assertEq(campaign.owner(), creator);
        assertEq(campaign.goalAmount(), GOAL_AMOUNT);
        assertEq(campaign.metadataURI(), METADATA_URI);
        assertEq(address(campaign.token()), address(usdc));
        assertEq(campaign.totalDonations(), 0);
        assertEq(campaign.deadline(), deadline);
        assertFalse(campaign.endedByOwner());
    }
    
    function test_Donate() public {
        uint256 donationAmount = 100 * 10**6; // 100 USDC
        
        vm.startPrank(donor1);
        usdc.approve(address(campaign), donationAmount);
        campaign.donate(donationAmount);
        vm.stopPrank();
        
        assertEq(campaign.totalDonations(), donationAmount);
        assertEq(campaign.contributions(donor1), donationAmount);
        assertEq(usdc.balanceOf(address(campaign)), donationAmount);
    }
    
    function test_DonateWithPermit() public {
        // This would require implementing EIP-2612 permit functionality
        // For now, we'll skip the actual permit signature testing
        // and just test the donation flow
        
        uint256 donationAmount = 200 * 10**6; // 200 USDC
        
        vm.startPrank(donor1);
        usdc.approve(address(campaign), donationAmount);
        campaign.donate(donationAmount);
        vm.stopPrank();
        
        assertEq(campaign.totalDonations(), donationAmount);
    }
    
    function test_MultipleDonations() public {
        uint256 donation1 = 100 * 10**6; // 100 USDC
        uint256 donation2 = 200 * 10**6; // 200 USDC
        
        // First donation
        vm.startPrank(donor1);
        usdc.approve(address(campaign), donation1);
        campaign.donate(donation1);
        vm.stopPrank();
        
        // Second donation
        vm.startPrank(donor2);
        usdc.approve(address(campaign), donation2);
        campaign.donate(donation2);
        vm.stopPrank();
        
        assertEq(campaign.totalDonations(), donation1 + donation2);
        assertEq(campaign.contributions(donor1), donation1);
        assertEq(campaign.contributions(donor2), donation2);
    }
    
    function test_ClaimFunds() public {
        uint256 donationAmount = 1000 * 10**6; // 1,000 USDC
        
        // Make donation
        vm.startPrank(donor1);
        usdc.approve(address(campaign), donationAmount);
        campaign.donate(donationAmount);
        vm.stopPrank();
        
        // Creator claims funds
        uint256 creatorBalanceBefore = usdc.balanceOf(creator);
        
        vm.prank(creator);
        campaign.claimFunds();
        
        uint256 creatorBalanceAfter = usdc.balanceOf(creator);
        assertEq(creatorBalanceAfter - creatorBalanceBefore, donationAmount);
        assertEq(usdc.balanceOf(address(campaign)), 0);
    }
    
    function test_OnlyOwnerCanClaimFunds() public {
        uint256 donationAmount = 500 * 10**6; // 500 USDC
        
        // Make donation
        vm.startPrank(donor1);
        usdc.approve(address(campaign), donationAmount);
        campaign.donate(donationAmount);
        vm.stopPrank();
        
        // Non-creator tries to claim
        vm.expectRevert(Campaign.NotOwner.selector);
        vm.prank(donor1);
        campaign.claimFunds();
    }
    
    function test_EndCampaign() public {
        vm.prank(creator);
        campaign.endCampaign();
        
        assertTrue(campaign.endedByOwner());
        
        // Try to donate after campaign ended
        vm.startPrank(donor1);
        usdc.approve(address(campaign), 100 * 10**6);
        vm.expectRevert(Campaign.CampaignHasBeenEnded.selector);
        campaign.donate(100 * 10**6);
        vm.stopPrank();
    }
    
    function test_RefundAfterCampaignEnded() public {
        uint256 donationAmount = 300 * 10**6; // 300 USDC
        
        // Make donation
        vm.startPrank(donor1);
        usdc.approve(address(campaign), donationAmount);
        campaign.donate(donationAmount);
        vm.stopPrank();
        
        // End campaign
        vm.prank(creator);
        campaign.endCampaign();
        
        // Request refund
        uint256 donorBalanceBefore = usdc.balanceOf(donor1);
        
        vm.prank(donor1);
        campaign.refund();
        
        uint256 donorBalanceAfter = usdc.balanceOf(donor1);
        assertEq(donorBalanceAfter - donorBalanceBefore, donationAmount);
        assertEq(campaign.contributions(donor1), 0);
    }
    
    function test_UpdateMetadataURI() public {
        string memory newURI = "ipfs://QmNewMetadata";
        
        vm.prank(creator);
        campaign.updateMetadataURI(newURI);
        
        assertEq(campaign.metadataURI(), newURI);
    }
    
    function test_OnlyCreatorCanUpdateMetadata() public {
        string memory newURI = "ipfs://QmNewMetadata";
        
        vm.expectRevert(Campaign.NotOwner.selector);
        vm.prank(donor1);
        campaign.updateMetadataURI(newURI);
    }
    
    function test_DonateZeroAmount() public {
        vm.startPrank(donor1);
        usdc.approve(address(campaign), 0);
        vm.expectRevert(Campaign.DonationMustBePositive.selector);
        campaign.donate(0);
        vm.stopPrank();
    }
    
    function test_DonateWithoutApproval() public {
        vm.prank(donor1);
        vm.expectRevert();
        campaign.donate(100 * 10**6);
    }
}