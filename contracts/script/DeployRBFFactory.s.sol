// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {RBFCampaignFactory} from "../src/RBFCampaignFactory.sol";

contract DeployRBFFactory is Script {
    function run() external returns (RBFCampaignFactory) {
        // Get USDC address from environment
        address usdcAddress = vm.envAddress("USDC_ADDRESS");
        
        // Use default TestUSDC address for Base Sepolia if not set
        if (usdcAddress == address(0)) {
            // Your deployed TestUSDC address
            usdcAddress = 0xYourTestUSDCAddress; // TODO: Update with actual address
            console.log("Using TestUSDC address:", usdcAddress);
        }

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("-------------------------------------");
        console.log("Deploying RBFCampaignFactory with:");
        console.log("USDC Address:    ", usdcAddress);
        console.log("Deployer:        ", vm.addr(deployerPrivateKey));
        console.log("-------------------------------------");

        vm.startBroadcast(deployerPrivateKey);
        
        RBFCampaignFactory factory = new RBFCampaignFactory(usdcAddress);
        
        vm.stopBroadcast();

        console.log("RBFCampaignFactory deployed at:", address(factory));
        console.log("\n=== Deployment Summary ===");
        console.log("Factory Address:", address(factory));
        console.log("USDC Token:     ", factory.usdcToken());
        console.log("Owner:          ", factory.owner());
        
        // Display initial limits
        (
            uint256 minFunding,
            uint256 maxFunding,
            uint256 minRevShare,
            uint256 maxRevShare,
            uint256 minRepCap,
            uint256 maxRepCap,
            uint256 minDays,
            uint256 maxDays
        ) = factory.getLimits();
        
        console.log("\n=== Initial Limits ===");
        console.log("Funding:  $", minFunding/1e6, "- $", maxFunding/1e6);
        console.log("Period:   ", minDays, "-", maxDays, "days");
        console.log("Revenue:  ", minRevShare/100, "% -", maxRevShare/100, "%");
        console.log("RepCap:   ", minRepCap/10000, "x -", maxRepCap/10000, "x");
        
        return factory;
    }
}