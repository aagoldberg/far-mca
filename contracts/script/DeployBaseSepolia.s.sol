// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MicroLoanFactory.sol";
import "../src/TestUSDC.sol";

/**
 * @title DeployBaseSepolia
 * @notice Deployment script for Base Sepolia testnet
 * @dev Reads configuration from environment variables
 */
contract DeployBaseSepolia is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdcAddress = vm.envAddress("BASE_SEPOLIA_USDC");
        bool deployTestUSDC = vm.envBool("DEPLOY_TEST_USDC");

        vm.startBroadcast(deployerPrivateKey);

        address usdc;

        // Deploy TestUSDC if needed, otherwise use existing USDC
        if (deployTestUSDC) {
            console2.log("Deploying TestUSDC...");
            TestUSDC testUSDC = new TestUSDC();
            usdc = address(testUSDC);
            console2.log("TestUSDC deployed at:", usdc);
        } else {
            require(usdcAddress != address(0), "USDC address not set in .env");
            usdc = usdcAddress;
            console2.log("Using existing USDC at:", usdc);
        }

        // Deploy MicroLoanFactory
        console2.log("Deploying MicroLoanFactory...");
        MicroLoanFactory factory = new MicroLoanFactory(usdc);
        console2.log("MicroLoanFactory deployed at:", address(factory));

        // Log deployer info
        console2.log("Deployed by:", vm.addr(deployerPrivateKey));
        console2.log("Factory owner:", factory.owner());

        vm.stopBroadcast();

        // Save deployment addresses
        console2.log("\n=== Deployment Summary ===");
        console2.log("Network: Base Sepolia");
        console2.log("USDC:", usdc);
        console2.log("Factory:", address(factory));
        console2.log("========================\n");
    }
}
