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

    function _createLoan(uint256 principal, uint256 term, uint256 periodLen, uint256 startIn, uint256 fundDeadlineIn)
        internal returns (MicroLoan loan)
    {
        uint256 firstDue = block.timestamp + startIn;
        uint256 deadline = block.timestamp + fundDeadlineIn;
        address loanAddr = factory.createLoan(
            borrower,
            "ipfs://metadata",
            principal,
            term,
            periodLen,
            firstDue,
            deadline
        );
        loan = MicroLoan(loanAddr);
    }

    function test_Fund_Disburse_Repay_Claim() public {
        MicroLoan loan = _createLoan(1_000e6, 10, 30 days, 30 days, 7 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(600e6);
        vm.stopPrank();

        vm.startPrank(bob);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(400e6);
        vm.stopPrank();

        vm.startPrank(borrower);
        loan.disburse();
        vm.stopPrank();

        uint256 perPeriod = loan.perPeriodPrincipal();
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(perPeriod);
        vm.stopPrank();

        uint256 aliceExpected = (600e6 * perPeriod) / 1_000e6;
        uint256 bobExpected = (400e6 * perPeriod) / 1_000e6;

        uint256 a0 = usdc.balanceOf(alice);
        vm.prank(alice);
        loan.claim();
        uint256 a1 = usdc.balanceOf(alice);
        assertEq(a1 - a0, aliceExpected);

        uint256 b0 = usdc.balanceOf(bob);
        vm.prank(bob);
        loan.claim();
        uint256 b1 = usdc.balanceOf(bob);
        assertEq(b1 - b0, bobExpected);
    }

    function test_Refunds_AfterDeadline_NotFullyFunded() public {
        MicroLoan loan = _createLoan(1_000e6, 6, 30 days, 30 days, 2 days);
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
        MicroLoan loan = _createLoan(1_000e6, 6, 30 days, 30 days, 7 days);

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

    // --------------------
    // Additional Edge Case Tests
    // --------------------

    function test_MultiplePartialRepayments() public {
        MicroLoan loan = _createLoan(1_000e6, 10, 30 days, 30 days, 7 days);

        // Fund loan
        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(1_000e6);
        vm.stopPrank();

        // Disburse
        vm.prank(borrower);
        loan.disburse();

        // Per period = 1000/10 = 100
        uint256 perPeriod = loan.perPeriodPrincipal();
        assertEq(perPeriod, 100e6);

        // Make multiple payments (some full, some partial)
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);

        // Pay full first period
        loan.repay(100e6);
        assertEq(loan.nextDuePeriodIndex(), 1);
        assertEq(loan.outstandingPrincipal(), 900e6);

        // Pay full second period
        loan.repay(100e6);
        assertEq(loan.nextDuePeriodIndex(), 2);
        assertEq(loan.outstandingPrincipal(), 800e6);

        // Make partial payment on third period
        loan.repay(50e6);
        assertEq(loan.nextDuePeriodIndex(), 2); // still on period 2
        assertEq(loan.outstandingPrincipal(), 750e6);

        vm.stopPrank();
    }

    function test_ManyContributors() public {
        MicroLoan loan = _createLoan(1_000e6, 5, 30 days, 30 days, 7 days);

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

        // Disburse and repay one period
        vm.prank(borrower);
        loan.disburse();

        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(200e6); // 1 period = 1000/5 = 200
        vm.stopPrank();

        // Check each contributor can claim their proportional share
        uint256 c1Before = usdc.balanceOf(c1);
        vm.prank(c1); loan.claim();
        assertEq(usdc.balanceOf(c1) - c1Before, 20e6); // 10% of 200

        uint256 c3Before = usdc.balanceOf(c3);
        vm.prank(c3); loan.claim();
        assertEq(usdc.balanceOf(c3) - c3Before, 60e6); // 30% of 200
    }

    function test_GracePeriodAndDefaultDetection() public {
        MicroLoan loan = _createLoan(1_000e6, 4, 30 days, 10 days, 7 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(1_000e6);
        vm.stopPrank();

        vm.prank(borrower);
        loan.disburse();

        // Not defaulted initially
        assertFalse(loan.isDefaulted());

        // Warp to just before first due date
        uint256 firstDue = loan.currentDueDate();
        vm.warp(firstDue - 1);
        assertFalse(loan.isDefaulted());

        // Warp to within grace period
        vm.warp(firstDue + 3 days);
        assertFalse(loan.isDefaulted());

        // Warp past grace period
        vm.warp(firstDue + 8 days);
        assertTrue(loan.isDefaulted());

        // Check defaultDeadline
        assertEq(loan.defaultDeadline(), firstDue + 7 days);

        // Borrower can still repay
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(250e6);
        vm.stopPrank();

        // No longer defaulted after payment
        assertFalse(loan.isDefaulted());
    }

    function test_ClaimableAmount() public {
        MicroLoan loan = _createLoan(1_000e6, 10, 30 days, 30 days, 7 days);

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

        // Repay first period
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
            10,
            30 days,
            block.timestamp + 30 days,
            block.timestamp + 7 days
        );

        // Test term bounds
        vm.expectRevert("term out of bounds");
        factory.createLoan(
            borrower,
            "ipfs://test",
            100e6,
            2, // below min (3)
            30 days,
            block.timestamp + 30 days,
            block.timestamp + 7 days
        );

        vm.expectRevert("term out of bounds");
        factory.createLoan(
            borrower,
            "ipfs://test",
            100e6,
            61, // above max (60)
            30 days,
            block.timestamp + 30 days,
            block.timestamp + 7 days
        );
    }

    function test_OneBorrowerOneLoan() public {
        MicroLoan loan1 = _createLoan(1_000e6, 10, 30 days, 30 days, 7 days);

        // Try to create second loan for same borrower
        vm.expectRevert("borrower has active loan");
        factory.createLoan(
            borrower,
            "ipfs://second",
            500e6,
            5,
            30 days,
            block.timestamp + 30 days,
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
            5,
            30 days,
            block.timestamp + 30 days,
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
            10,
            30 days,
            block.timestamp + 30 days,
            block.timestamp + 7 days
        );

        // Owner unpauses
        factory.unpause();

        // Can create loan after unpause
        address loanAddr = factory.createLoan(
            borrower,
            "ipfs://test",
            100e6,
            10,
            30 days,
            block.timestamp + 30 days,
            block.timestamp + 7 days
        );
        assertTrue(loanAddr != address(0));
    }

    function test_RepaymentOverpaymentRefund() public {
        MicroLoan loan = _createLoan(1_000e6, 10, 30 days, 30 days, 7 days);

        vm.startPrank(alice);
        usdc.approve(address(loan), type(uint256).max);
        loan.contribute(1_000e6);
        vm.stopPrank();

        vm.prank(borrower);
        loan.disburse();

        // Borrower overpays
        uint256 borrowerBefore = usdc.balanceOf(borrower);
        vm.startPrank(borrower);
        usdc.approve(address(loan), type(uint256).max);
        loan.repay(1_500e6); // overpay by 500
        vm.stopPrank();

        // Loan is completed
        assertTrue(loan.completed());
        assertEq(loan.outstandingPrincipal(), 0);

        // Borrower got refunded the overpayment
        uint256 borrowerAfter = usdc.balanceOf(borrower);
        assertEq(borrowerBefore - borrowerAfter, 1_000e6); // only charged 1000, not 1500
    }
}


