// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../src/CrowdFund.sol";

// Mock ERC20 token for testing purposes
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract CrowdFundTest is Test {
    FarcasterFundraise crowdFund;
    MockUSDC usdc;
    
    address owner = address(0x1);
    address creator = address(0x2);
    address contributor1 = address(0x3);
    address contributor2 = address(0x4);
    address feeAddress = address(0x5);

    uint256 constant ONE_DAY = 1 days;

    function setUp() public {
        vm.prank(owner);
        usdc = new MockUSDC();
        
        uint16 feePercentage = 100; // 1%
        uint256 maxCampaignDuration = 30 * ONE_DAY;

        vm.prank(owner);
        crowdFund = new FarcasterFundraise(
            address(usdc),
            owner,
            feeAddress,
            feePercentage,
            maxCampaignDuration
        );

        // Mint some USDC for our test accounts
        usdc.mint(creator, 1000e6);
        usdc.mint(contributor1, 500e6);
        usdc.mint(contributor2, 500e6);
    }

    function test_CreateCampaign() public {
        vm.prank(creator);
        uint256 campaignId = crowdFund.createCampaign("cid", 100e6, ONE_DAY);
        assertEq(campaignId, 1);

        (address campaignCreator, , , , , ) = crowdFund.campaigns(campaignId);
        assertEq(campaignCreator, creator);
    }
    
    function test_Fail_CreateCampaignWithTooLongDuration() public {
        vm.prank(creator);
        uint256 tooLongDuration = 31 * ONE_DAY;
        uint256 maxDuration = 30 * ONE_DAY;
        vm.expectRevert(abi.encodeWithSelector(FarcasterFundraise.DurationExceedsMax.selector, tooLongDuration, maxDuration));
        crowdFund.createCampaign("cid", 100e6, tooLongDuration);
    }

    function test_FundCampaign() public {
        vm.prank(creator);
        uint256 campaignId = crowdFund.createCampaign("cid", 100e6, ONE_DAY);

        vm.prank(contributor1);
        usdc.approve(address(crowdFund), 50e6);
        
        vm.prank(contributor1);
        crowdFund.fundCampaign(campaignId, 50e6);
        
        ( , , , uint256 totalRaised, , ) = crowdFund.campaigns(campaignId);
        assertEq(totalRaised, 50e6);
        
        // Mappings within structs are not directly accessible via the auto-getter.
        // We need a dedicated getter if we want to check contributions in tests.
        // For now, this part of the test is removed as it's untestable without a contract change.
        // assertEq(campaign.contributions[contributor1], 50e6);
    }

    function test_ClaimFunds_WithFee() public {
        // 1. Create campaign
        vm.prank(creator);
        uint256 campaignId = crowdFund.createCampaign("cid", 100e6, ONE_DAY);

        // 2. Fund campaign
        vm.prank(contributor1);
        usdc.approve(address(crowdFund), 50e6);
        vm.prank(contributor1);
        crowdFund.fundCampaign(campaignId, 50e6);

        vm.prank(contributor2);
        usdc.approve(address(crowdFund), 75e6);
        vm.prank(contributor2);
        crowdFund.fundCampaign(campaignId, 75e6);

        // 3. Fast forward time past the deadline
        vm.warp(block.timestamp + 2 * ONE_DAY);

        // 4. Claim funds
        uint256 totalRaised = 125e6;
        uint256 expectedFee = (totalRaised * 100) / 10000; // 1%
        uint256 expectedAmountForCreator = totalRaised - expectedFee;

        uint256 balanceBeforeClaim_Creator = usdc.balanceOf(creator);
        uint256 balanceBeforeClaim_FeeAddress = usdc.balanceOf(feeAddress);

        vm.prank(creator);
        crowdFund.claimFunds(campaignId);

        // 5. Assert balances
        assertEq(usdc.balanceOf(creator), balanceBeforeClaim_Creator + expectedAmountForCreator);
        assertEq(usdc.balanceOf(feeAddress), balanceBeforeClaim_FeeAddress + expectedFee);

        // 6. Assert campaign state
        ( , , , uint256 totalRaisedAfterClaim, , ) = crowdFund.campaigns(campaignId);
        assertEq(totalRaisedAfterClaim, 0); // Total raised should be reset
    }

    function test_ExtendCampaign() public {
        vm.prank(creator);
        uint256 campaignId = crowdFund.createCampaign("cid", 100e6, ONE_DAY);
        
        ( , , , , uint256 initialDeadline, ) = crowdFund.campaigns(campaignId);

        vm.prank(creator);
        crowdFund.extendCampaign(campaignId, ONE_DAY);

        ( , , , , uint256 newDeadline, ) = crowdFund.campaigns(campaignId);
        assertEq(newDeadline, initialDeadline + ONE_DAY);
    }

    function test_CancelCampaignAndRefund() public {
        // 1. Create and fund
        vm.prank(creator);
        uint256 campaignId = crowdFund.createCampaign("cid", 100e6, ONE_DAY);
        vm.prank(contributor1);
        usdc.approve(address(crowdFund), 50e6);
        vm.prank(contributor1);
        crowdFund.fundCampaign(campaignId, 50e6);
        
        // 2. Creator cancels
        vm.prank(creator);
        crowdFund.cancelCampaign(campaignId);

        // 3. Contributor claims refund
        uint256 balanceBeforeRefund = usdc.balanceOf(contributor1);
        vm.prank(contributor1);
        crowdFund.refund(campaignId);
        assertEq(usdc.balanceOf(contributor1), balanceBeforeRefund + 50e6);
    }

    function test_RescueERC20() public {
        MockUSDC otherToken = new MockUSDC();
        otherToken.mint(address(crowdFund), 1000);

        assertEq(otherToken.balanceOf(address(crowdFund)), 1000);
        assertEq(otherToken.balanceOf(owner), 0);

        vm.prank(owner);
        crowdFund.rescueERC20(address(otherToken), owner, 1000);

        assertEq(otherToken.balanceOf(address(crowdFund)), 0);
        assertEq(otherToken.balanceOf(owner), 1000);
    }
} 