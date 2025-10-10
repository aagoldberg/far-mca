// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TestUSDC} from "../src/TestUSDC.sol";

contract DeployTestUSDC is Script {
    function run() external returns (TestUSDC testUSDC) {
        vm.startBroadcast();

        // Deploy TestUSDC contract
        testUSDC = new TestUSDC();

        console.log("TestUSDC deployed at:", address(testUSDC));
        console.log("Name:", testUSDC.name());
        console.log("Symbol:", testUSDC.symbol());
        console.log("Decimals:", testUSDC.decimals());
        console.log("Initial supply:", testUSDC.totalSupply());
        console.log("Deployer balance:", testUSDC.balanceOf(msg.sender));

        vm.stopBroadcast();

        // Verify the deployment
        console.log("\n=== Deployment Summary ===");
        console.log("Network: Base Sepolia");
        console.log("TestUSDC Address:", address(testUSDC));
        console.log("Deployer:", msg.sender);
        console.log("\n=== Next Steps ===");
        console.log("1. Update NEXT_PUBLIC_USDC_CONTRACT_ADDRESS to:", address(testUSDC));
        console.log("2. Test the faucet functions:");
        console.log("   - faucetUSDC(100) // Mint 100 test USDC");
        console.log("   - mintUSDC(address, 1000) // Mint 1000 test USDC to address");
        console.log("3. Verify contract on Basescan (optional)");
    }
}