// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../src/MicroLoanFactory.sol";
import "../src/TestUSDC.sol";

contract MicroLoanTest is Test {
    using SafeERC20 for IERC20;

    TestUSDC usdc;
    MicroLoanFactory factory;
    address borrower = address(0xB0);
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        usdc = new TestUSDC();
        factory = new MicroLoanFactory(address(usdc));
        usdc.mint(alice, 1_000_000e6);
        usdc.mint(bob, 1_000_000e6);
        usdc.mint(borrower, 1_000_000e6);
    }

    function _createLoan(uint256 principal, uint256 duration, uint256 fundDeadlineIn)
        internal returns (MicroLoan loan)
    {
        uint256 deadline = block.timestamp + fundDeadlineIn;
        address loanAddr = factory.createLoan(
            borrower,
            "ipfs://metadata",
            principal,
            duration,
            deadline
        );
        loan = MicroLoan(loanAddr);
    }

    function test_Fund_Disburse_Repay_Claim() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        // Alice contributes 60%
        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(600e6);
        vm.stopPrank();

        // Bob contributes 40%
        vm.startPrank(bob);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(400e6);
        vm.stopPrank();

        // Borrower disburses
        vm.startPrank(borrower);
        loan.disburse();
        vm.stopPrank();

        // Borrower repays 50%
        uint256 repayAmount = 500e6;
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(repayAmount);
        vm.stopPrank();

        // Check repayment was recorded
        assertEq(loan.totalRepaid(), 500e6);
        assertEq(loan.outstandingPrincipal(), 500e6);

        // Check pro-rata claimable amounts
        uint256 aliceExpected = (600e6 * repayAmount) / 1_000e6;
        uint256 bobExpected = (400e6 * repayAmount) / 1_000e6;

        // Alice claims
        uint256 a0 = usdc.balanceOf(alice);
        vm.prank(alice);
        loan.claim();
        uint256 a1 = usdc.balanceOf(alice);
        assertEq(a1 - a0, aliceExpected);

        // Bob claims
        uint256 b0 = usdc.balanceOf(bob);
        vm.prank(bob);
        loan.claim();
        uint256 b1 = usdc.balanceOf(bob);
        assertEq(b1 - b0, bobExpected);
    }

    function test_FlexibleRepayment() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        // Fund
        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(1_000e6);
        vm.stopPrank();

        // Disburse
        vm.prank(borrower);
        loan.disburse();

        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);

        // Multiple flexible payments
        loan.repay(100e6);
        assertEq(loan.totalRepaid(), 100e6);
        assertEq(loan.outstandingPrincipal(), 900e6);

        loan.repay(250e6);
        assertEq(loan.totalRepaid(), 350e6);
        assertEq(loan.outstandingPrincipal(), 650e6);

        loan.repay(650e6); // Pay rest
        assertEq(loan.totalRepaid(), 1_000e6);
        assertEq(loan.outstandingPrincipal(), 0);
        assertTrue(loan.completed());

        vm.stopPrank();
    }

    function test_RepaymentOverpaymentDistributed() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(1_000e6);
        vm.stopPrank();

        vm.prank(borrower);
        loan.disburse();

        // Borrower overpays by 50% as a tip to lenders
        uint256 borrowerBefore = usdc.balanceOf(borrower);
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(1_500e6); // overpay by 500 (50% bonus)
        vm.stopPrank();

        // Loan is completed
        assertTrue(loan.completed());
        assertEq(loan.outstandingPrincipal(), 0);
        assertEq(loan.totalRepaid(), 1_500e6); // Tracks full amount including overpayment

        // Borrower was charged full amount (no refund)
        uint256 borrowerAfter = usdc.balanceOf(borrower);
        assertEq(borrowerBefore - borrowerAfter, 1_500e6);

        // Alice can claim 150% of her contribution (principal + 50% bonus)
        uint256 aliceBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        loan.claim();
        uint256 aliceAfter = usdc.balanceOf(alice);
        assertEq(aliceAfter - aliceBefore, 1_500e6); // Gets back 1500 (1000 principal + 500 bonus)
    }

    function test_DefaultDetection() public {
        MicroLoan loan = _createLoan(1_000e6, 10 days, 7 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(1_000e6);
        vm.stopPrank();

        vm.prank(borrower);
        loan.disburse();

        // Not defaulted initially
        assertFalse(loan.isDefaulted());

        // Warp to just before due date
        vm.warp(loan.dueAt() - 1);
        assertFalse(loan.isDefaulted());

        // Warp to exactly at due date (boundary)
        vm.warp(loan.dueAt());
        assertFalse(loan.isDefaulted());

        // Warp to 1 second past due date - NOW DEFAULTED (no grace period)
        vm.warp(loan.dueAt() + 1);
        assertTrue(loan.isDefaulted());

        // Borrower can still repay even when defaulted
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(1_000e6);
        vm.stopPrank();

        // No longer defaulted after full repayment
        assertFalse(loan.isDefaulted());
    }

    function test_Refunds_AfterDeadline_NotFullyFunded() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 2 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(200e6);
        vm.stopPrank();

        vm.warp(block.timestamp + 3 days);
        uint256 before = usdc.balanceOf(alice);
        vm.prank(alice);
        loan.refund();
        uint256 afterBal = usdc.balanceOf(alice);
        assertEq(afterBal - before, 200e6);
    }

    function test_CancelIfNoDisburse_AllowsRefunds() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(1_000e6);
        vm.stopPrank();

        vm.warp(block.timestamp + loan.disbursementWindow() + 1);
        loan.cancelIfNoDisburse();

        uint256 before = usdc.balanceOf(alice);
        vm.prank(alice);
        loan.refund();
        uint256 afterBal = usdc.balanceOf(alice);
        assertEq(afterBal - before, 1_000e6);
    }

    function test_ManyContributors() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        // 5 contributors with different amounts
        address c1 = address(0x1);
        address c2 = address(0x2);
        address c3 = address(0x3);
        address c4 = address(0x4);
        address c5 = address(0x5);

        usdc.mint(c1, 100e6);
        usdc.mint(c2, 200e6);
        usdc.mint(c3, 300e6);
        usdc.mint(c4, 250e6);
        usdc.mint(c5, 150e6);

        vm.prank(c1); usdc.approve(address(loan), type(uint256).max);
        vm.prank(c1); loan.contribute(100e6);

        vm.prank(c2); usdc.approve(address(loan), type(uint256).max);
        vm.prank(c2); loan.contribute(200e6);

        vm.prank(c3); usdc.approve(address(loan), type(uint256).max);
        vm.prank(c3); loan.contribute(300e6);

        vm.prank(c4); usdc.approve(address(loan), type(uint256).max);
        vm.prank(c4); loan.contribute(250e6);

        vm.prank(c5); usdc.approve(address(loan), type(uint256).max);
        vm.prank(c5); loan.contribute(150e6);

        assertEq(loan.totalFunded(), 1_000e6);
        assertEq(loan.contributorsCount(), 5);

        // Disburse and repay 20%
        vm.prank(borrower);
        loan.disburse();

        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(200e6); // 20%
        vm.stopPrank();

        // Check each contributor can claim their proportional share
        uint256 c1Before = usdc.balanceOf(c1);
        vm.prank(c1); loan.claim();
        assertEq(usdc.balanceOf(c1) - c1Before, 20e6); // 10% of 200

        uint256 c3Before = usdc.balanceOf(c3);
        vm.prank(c3); loan.claim();
        assertEq(usdc.balanceOf(c3) - c3Before, 60e6); // 30% of 200
    }

    function test_ClaimableAmount() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(600e6);
        vm.stopPrank();

        vm.startPrank(bob);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(400e6);
        vm.stopPrank();

        vm.prank(borrower);
        loan.disburse();

        // Initially no claimable amount
        assertEq(loan.claimableAmount(alice), 0);

        // Repay 10%
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(100e6);
        vm.stopPrank();

        // Check claimable amounts
        assertEq(loan.claimableAmount(alice), 60e6); // 60% of 100
        assertEq(loan.claimableAmount(bob), 40e6);   // 40% of 100

        // Alice claims
        vm.prank(alice);
        loan.claim();

        // Alice's claimable is now 0
        assertEq(loan.claimableAmount(alice), 0);
        // Bob's is still available
        assertEq(loan.claimableAmount(bob), 40e6);
    }

    function test_FactoryBoundsEnforcement() public {
        // Test min principal enforcement
        vm.expectRevert("principal below minimum");
        factory.createLoan(
            borrower,
            "ipfs://test",
            50e6, // below minimum
            56 days,
            block.timestamp + 7 days
        );

        // Test duration bounds
        vm.expectRevert("duration out of bounds");
        factory.createLoan(
            borrower,
            "ipfs://test",
            100e6,
            6 days, // below min (7 days)
            block.timestamp + 7 days
        );

        vm.expectRevert("duration out of bounds");
        factory.createLoan(
            borrower,
            "ipfs://test",
            100e6,
            366 days, // above max (365 days)
            block.timestamp + 7 days
        );
    }

    function test_OneBorrowerOneLoan() public {
        MicroLoan loan1 = _createLoan(1_000e6, 56 days, 7 days);

        // Try to create second loan for same borrower
        vm.expectRevert("borrower has active loan");
        factory.createLoan(
            borrower,
            "ipfs://second",
            500e6,
            56 days,
            block.timestamp + 7 days
        );

        // Cancel first loan
        vm.prank(borrower);
        loan1.cancelFundraise();

        // Now borrower can create another loan
        address loan2Addr = factory.createLoan(
            borrower,
            "ipfs://second",
            500e6,
            56 days,
            block.timestamp + 7 days
        );
        assertTrue(loan2Addr != address(0));
    }

    function test_PauseUnpause() public {
        // Owner pauses factory
        factory.pause();

        // Cannot create loan when paused
        vm.expectRevert();
        factory.createLoan(
            borrower,
            "ipfs://test",
            100e6,
            56 days,
            block.timestamp + 7 days
        );

        // Owner unpauses
        factory.unpause();

        // Can create loan after unpause
        address loanAddr = factory.createLoan(
            borrower,
            "ipfs://test",
            100e6,
            56 days,
            block.timestamp + 7 days
        );
        assertTrue(loanAddr != address(0));
    }

    function test_SecondsUntilDue() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        // Before disbursement, should return time until due
        uint256 secondsRemaining = loan.secondsUntilDue();
        assertGt(secondsRemaining, 0);
        assertLe(secondsRemaining, 56 days);

        // After maturity, should return 0
        vm.warp(loan.dueAt() + 1);
        assertEq(loan.secondsUntilDue(), 0);
    }

    // COMMENTED OUT: updateMetadata() was removed when metadataURI was made immutable
    // function test_MetadataUpdate() public {
    //     MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

    //     // Fund and disburse
    //     vm.startPrank(alice);
    //     usdc.approve(address(loan), type(uint256).max);
    //     loan.contribute(1_000e6);
    //     vm.stopPrank();

    //     vm.prank(borrower);
    //     loan.disburse();

    //     // Borrower updates metadata with progress update
    //     vm.prank(borrower);
    //     loan.updateMetadata("ipfs://QmProgressUpdate1");
    //     assertEq(loan.metadataURI(), "ipfs://QmProgressUpdate1");

    //     // Borrower updates again with thank you message
    //     vm.prank(borrower);
    //     loan.updateMetadata("ipfs://QmThankYou");
    //     assertEq(loan.metadataURI(), "ipfs://QmThankYou");

    //     // Non-borrower cannot update
    //     vm.prank(alice);
    //     vm.expectRevert();
    //     loan.updateMetadata("ipfs://Unauthorized");
    // }

    // COMMENTED OUT: updateMetadata() was removed when metadataURI was made immutable
    // function test_MetadataUpdateAfterCompletion() public {
    //     MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

    //     // Fund, disburse, and complete
    //     vm.startPrank(alice);
    //     usdc.approve(address(loan), type(uint256).max);
    //     loan.contribute(1_000e6);
    //     vm.stopPrank();

    //     vm.prank(borrower);
    //     loan.disburse();

    //     vm.startPrank(borrower);
    //     usdc.approve(address(loan), type(uint256).max);
    //     loan.repay(1_000e6);
    //     vm.stopPrank();

    //     // Borrower can still update metadata after completion (for final thank you)
    //     vm.prank(borrower);
    //     loan.updateMetadata("ipfs://QmFinalThankYou");
    //     assertEq(loan.metadataURI(), "ipfs://QmFinalThankYou");
    // }

    // COMMENTED OUT: recoverTokens() was removed for MVP
    // function test_TokenRecovery() public {
    //     MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

    //     // Fund, disburse, and complete
    //     vm.startPrank(alice);
    //     usdc.approve(address(loan), type(uint256).max);
    //     loan.contribute(1_000e6);
    //     vm.stopPrank();

    //     vm.prank(borrower);
    //     loan.disburse();

    //     vm.startPrank(borrower);
    //     usdc.approve(address(loan), type(uint256).max);
    //     loan.repay(1_000e6);
    //     vm.stopPrank();

    //     // Alice claims her funds
    //     vm.prank(alice);
    //     loan.claim();

    //     // Someone accidentally sends 100 USDC to the completed loan
    //     usdc.mint(address(loan), 100e6);

    //     // Anyone can recover the accidentally sent tokens
    //     uint256 recoveryRecipientBefore = usdc.balanceOf(bob);
    //     vm.prank(alice);
    //     loan.recoverTokens(address(usdc), bob);
    //     uint256 recoveryRecipientAfter = usdc.balanceOf(bob);

    //     assertEq(recoveryRecipientAfter - recoveryRecipientBefore, 100e6);
    // }

    // COMMENTED OUT: recoverTokens() was removed for MVP
    // function test_TokenRecoveryOnCancelled() public {
    //     MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

    //     // Borrower cancels fundraising
    //     vm.prank(borrower);
    //     loan.cancelFundraise();

    //     // Someone accidentally sends tokens
    //     usdc.mint(address(loan), 50e6);

    //     // Can recover from cancelled loan
    //     vm.prank(alice);
    //     loan.recoverTokens(address(usdc), alice);
    //     // Verify recovery succeeded (no revert)
    // }

    function test_GetStatus() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        // Initial state
        (
            bool fundraisingActive,
            bool active,
            bool completed,
            bool cancelled,
            bool defaulted,
            uint256 percentFunded,
            uint256 percentRepaid,
            uint256 secondsUntilDue
        ) = loan.getStatus();

        assertTrue(fundraisingActive);
        assertFalse(active);
        assertFalse(completed);
        assertFalse(cancelled);
        assertFalse(defaulted);
        assertEq(percentFunded, 0);
        assertEq(percentRepaid, 0);
        assertGt(secondsUntilDue, 0);

        // After 60% funding
        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(600e6);
        vm.stopPrank();

        (,,,, , percentFunded,,) = loan.getStatus();
        assertEq(percentFunded, 6000); // 60% in basis points

        // After full funding and disbursement
        vm.startPrank(bob);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(400e6);
        vm.stopPrank();

        vm.prank(borrower);
        loan.disburse();

        (, active, , , , percentFunded,,) = loan.getStatus();
        assertTrue(active);
        assertEq(percentFunded, 10000); // 100%

        // After 30% repayment
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(300e6);
        vm.stopPrank();

        (,,,,,, percentRepaid,) = loan.getStatus();
        assertEq(percentRepaid, 3000); // 30%

        // After full repayment
        vm.startPrank(borrower);
        loan.repay(700e6);
        vm.stopPrank();

        (,, completed,,,, percentRepaid,) = loan.getStatus();
        assertTrue(completed);
        assertEq(percentRepaid, 10000); // 100%
    }

    function test_GetStatusWithOverpayment() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(1_000e6);
        vm.stopPrank();

        vm.prank(borrower);
        loan.disburse();

        // Borrower overpays by 50%
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(1_500e6);
        vm.stopPrank();

        (,, bool completed,,,, uint256 percentRepaid,) = loan.getStatus();
        assertTrue(completed);
        assertEq(percentRepaid, 15000); // 150% (includes tip)
    }

    function test_AccumulatorFinalizationWithOverpayment() public {
        MicroLoan loan = _createLoan(1_000e6, 56 days, 7 days);

        // Multiple lenders contribute
        vm.prank(alice); usdc.approve(address(loan), type(uint256).max);
        vm.prank(alice); loan.contribute(600e6);

        vm.prank(bob); usdc.approve(address(loan), type(uint256).max);
        vm.prank(bob); loan.contribute(400e6);

        vm.prank(borrower);
        loan.disburse();

        // Borrower overpays by 20%
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(1_200e6);
        vm.stopPrank();

        // Both lenders should be able to claim exactly their proportional share
        uint256 aliceBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        loan.claim();
        uint256 aliceAfter = usdc.balanceOf(alice);
        assertEq(aliceAfter - aliceBefore, 720e6); // 60% of 1200

        uint256 bobBefore = usdc.balanceOf(bob);
        vm.prank(bob);
        loan.claim();
        uint256 bobAfter = usdc.balanceOf(bob);
        assertEq(bobAfter - bobBefore, 480e6); // 40% of 1200

        // No dust should remain
        assertEq(loan.claimableAmount(alice), 0);
        assertEq(loan.claimableAmount(bob), 0);
    }
}
