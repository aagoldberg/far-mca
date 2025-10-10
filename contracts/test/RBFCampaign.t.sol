// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RBFCampaign.sol";
import "../src/RBFCampaignFactory.sol";
import "../src/TestUSDC.sol";

contract RBFCampaignTest is Test {
    RBFCampaignFactory factory;
    TestUSDC usdc;
    
    address business = address(0x1);
    address contributor1 = address(0x2);
    address contributor2 = address(0x3);
    
    uint256 constant FUNDING_GOAL = 100_000e6; // $100k
    uint256 constant FUNDING_PERIOD = 30; // 30 days
    uint256 constant REVENUE_SHARE = 500; // 5%
    uint256 constant REPAYMENT_CAP = 15000; // 1.5x
    
    event Contributed(address indexed contributor, uint256 amount);
    event FundingGoalReached(uint256 totalAmount);
    event RevenueShared(uint256 revenueAmount, uint256 shareAmount);

    function setUp() public {
        usdc = new TestUSDC();
        factory = new RBFCampaignFactory(address(usdc));
        
        // Give contributors some USDC
        usdc.mint(contributor1, 1_000_000e6);
        usdc.mint(contributor2, 1_000_000e6);
    }

    function test_CreateCampaign() public {
        vm.prank(business);
        address campaignAddress = factory.createCampaign(
            "ipfs://test-metadata",
            FUNDING_GOAL,
            FUNDING_PERIOD,
            REVENUE_SHARE,
            REPAYMENT_CAP
        );
        
        assertTrue(factory.isValidCampaign(campaignAddress));
        assertEq(factory.getCampaignCount(), 1);
        
        RBFCampaign campaign = RBFCampaign(payable(campaignAddress));
        assertEq(campaign.owner(), business);
        assertEq(campaign.fundingGoal(), FUNDING_GOAL);
    }

    function test_ContributeAndReachGoal() public {
        // Create campaign
        vm.prank(business);
        address campaignAddress = factory.createCampaign(
            "ipfs://test-metadata",
            FUNDING_GOAL,
            FUNDING_PERIOD,
            REVENUE_SHARE,
            REPAYMENT_CAP
        );
        
        RBFCampaign campaign = RBFCampaign(payable(campaignAddress));
        
        // Contributors contribute
        vm.startPrank(contributor1);
        usdc.approve(campaignAddress, 60_000e6);
        
        vm.expectEmit(true, false, false, true);
        emit Contributed(contributor1, 60_000e6);
        campaign.contribute(60_000e6);
        vm.stopPrank();
        
        vm.startPrank(contributor2);
        usdc.approve(campaignAddress, 40_000e6);
        
        vm.expectEmit(false, false, false, true);
        emit FundingGoalReached(FUNDING_GOAL);
        campaign.contribute(40_000e6);
        vm.stopPrank();
        
        // Check campaign state
        (, , , , , bool fundingActive, bool repaymentActive,) = campaign.getCampaignDetails();
        assertFalse(fundingActive);
        assertTrue(repaymentActive);
        
        // Business should have received funds
        assertEq(usdc.balanceOf(business), FUNDING_GOAL);
    }

    function test_RevenueSharing() public {
        // Setup funded campaign
        vm.prank(business);
        address campaignAddress = factory.createCampaign(
            "ipfs://test-metadata",
            FUNDING_GOAL,
            FUNDING_PERIOD,
            REVENUE_SHARE,
            REPAYMENT_CAP
        );
        
        RBFCampaign campaign = RBFCampaign(payable(campaignAddress));
        
        // Fund the campaign
        vm.startPrank(contributor1);
        usdc.approve(campaignAddress, FUNDING_GOAL);
        campaign.contribute(FUNDING_GOAL);
        vm.stopPrank();
        
        // Fast forward 30 days
        vm.warp(block.timestamp + 31 days);
        
        // Business reports revenue and shares
        uint256 monthlyRevenue = 20_000e6; // $20k revenue
        uint256 expectedShare = (monthlyRevenue * REVENUE_SHARE) / 10000; // $1k share
        
        vm.startPrank(business);
        usdc.mint(business, expectedShare); // Give business tokens to share
        usdc.approve(campaignAddress, expectedShare);
        
        vm.expectEmit(false, false, false, true);
        emit RevenueShared(monthlyRevenue, expectedShare);
        campaign.submitRevenueShare(monthlyRevenue);
        vm.stopPrank();
        
        // Contributor can withdraw returns
        uint256 initialBalance = usdc.balanceOf(contributor1);
        
        vm.prank(contributor1);
        campaign.withdrawReturns();
        
        assertEq(usdc.balanceOf(contributor1), initialBalance + expectedShare);
        assertEq(campaign.pendingReturns(contributor1), 0);
    }

    function test_RefundIfGoalNotMet() public {
        // Create campaign
        vm.prank(business);
        address campaignAddress = factory.createCampaign(
            "ipfs://test-metadata",
            FUNDING_GOAL,
            FUNDING_PERIOD,
            REVENUE_SHARE,
            REPAYMENT_CAP
        );
        
        RBFCampaign campaign = RBFCampaign(payable(campaignAddress));
        
        // Partial contribution
        vm.startPrank(contributor1);
        usdc.approve(campaignAddress, 50_000e6);
        campaign.contribute(50_000e6);
        vm.stopPrank();
        
        // Fast forward past deadline
        vm.warp(block.timestamp + FUNDING_PERIOD * 1 days + 1);
        
        // Contributor can get refund
        uint256 initialBalance = usdc.balanceOf(contributor1);
        
        vm.prank(contributor1);
        campaign.refund();
        
        assertEq(usdc.balanceOf(contributor1), initialBalance + 50_000e6);
        assertEq(campaign.contributions(contributor1), 0);
    }
}