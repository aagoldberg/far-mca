// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CampaignFactory} from "../src/CampaignFactory.sol";

contract DeployCampaignFactory is Script {
    function run() external returns (CampaignFactory) {
        // --- Read Configuration from Environment Variables ---
        address usdcAddress = vm.envAddress("USDC_ADDRESS");

        // --- Pre-flight Checks ---
        require(usdcAddress != address(0), "DeployCampaignFactory: USDC_ADDRESS is not set in your .env file");

        console.log("-------------------------------------");
        console.log("Deploying CampaignFactory with:");
        console.log("USDC Token Address: ", usdcAddress);
        console.log("Initial Owner:      ", msg.sender);
        console.log("-------------------------------------");

        vm.startBroadcast();

        CampaignFactory campaignFactory = new CampaignFactory(usdcAddress, msg.sender);
        
        vm.stopBroadcast();
        
        console.log("CampaignFactory deployed at:", address(campaignFactory));
        return campaignFactory;
    }
} 