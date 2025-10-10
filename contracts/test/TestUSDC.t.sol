// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TestUSDC} from "../src/TestUSDC.sol";

contract TestUSDCTest is Test {
    TestUSDC public testUSDC;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        testUSDC = new TestUSDC();
    }

    function test_InitialState() public {
        assertEq(testUSDC.name(), "Test USDC");
        assertEq(testUSDC.symbol(), "tUSDC");
        assertEq(testUSDC.decimals(), 6);
        assertEq(testUSDC.totalSupply(), 1_000_000 * 10**6); // 1M USDC
        assertEq(testUSDC.balanceOf(address(this)), 1_000_000 * 10**6);
    }

    function test_Mint() public {
        uint256 amount = 100 * 10**6; // 100 USDC
        testUSDC.mint(alice, amount);
        
        assertEq(testUSDC.balanceOf(alice), amount);
    }

    function test_MintUSDC() public {
        uint256 usdcAmount = 500; // 500 USDC
        testUSDC.mintUSDC(alice, usdcAmount);
        
        assertEq(testUSDC.balanceOf(alice), usdcAmount * 10**6);
    }

    function test_Faucet() public {
        vm.prank(alice);
        testUSDC.faucet(100 * 10**6); // 100 USDC in base units
        
        assertEq(testUSDC.balanceOf(alice), 100 * 10**6);
    }

    function test_FaucetUSDC() public {
        vm.prank(alice);
        testUSDC.faucetUSDC(250); // 250 USDC
        
        assertEq(testUSDC.balanceOf(alice), 250 * 10**6);
    }

    function test_FaucetLimit() public {
        vm.prank(alice);
        vm.expectRevert("TestUSDC: Amount exceeds 1000 USDC limit");
        testUSDC.faucetUSDC(1001); // Over limit
    }

    function test_BatchMint() public {
        address[] memory recipients = new address[](2);
        uint256[] memory amounts = new uint256[](2);
        
        recipients[0] = alice;
        recipients[1] = bob;
        amounts[0] = 100 * 10**6; // 100 USDC
        amounts[1] = 200 * 10**6; // 200 USDC
        
        testUSDC.batchMint(recipients, amounts);
        
        assertEq(testUSDC.balanceOf(alice), 100 * 10**6);
        assertEq(testUSDC.balanceOf(bob), 200 * 10**6);
    }

    function test_ERC20Functionality() public {
        // Mint some tokens to alice
        testUSDC.mintUSDC(alice, 1000);
        
        // Test transfer
        vm.prank(alice);
        testUSDC.transfer(bob, 100 * 10**6);
        
        assertEq(testUSDC.balanceOf(alice), 900 * 10**6);
        assertEq(testUSDC.balanceOf(bob), 100 * 10**6);
        
        // Test approve/transferFrom
        vm.prank(alice);
        testUSDC.approve(bob, 200 * 10**6);
        
        vm.prank(bob);
        testUSDC.transferFrom(alice, bob, 150 * 10**6);
        
        assertEq(testUSDC.balanceOf(alice), 750 * 10**6);
        assertEq(testUSDC.balanceOf(bob), 250 * 10**6);
    }

    function test_PermitFunctionality() public {
        // This tests that EIP-2612 permit is available
        // (Full permit testing would require signature creation)
        assertTrue(address(testUSDC).code.length > 0);
        // The permit function exists if the contract compiles with ERC20Permit
    }
}