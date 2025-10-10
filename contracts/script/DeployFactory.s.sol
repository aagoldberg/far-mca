// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CampaignFactory} from "../src/CampaignFactory.sol";

contract DeployFactory is Script {
    function run() external returns (CampaignFactory) {
        // --- Read Configuration from Environment Variables ---
        address usdcToken = vm.envAddress("DEFAULT_USDC_ADDRESS");
        address initialOwner = vm.envAddress("OWNER_ADDRESS");
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // --- Pre-flight Checks ---
        require(usdcToken != address(0), "DeployFactory: DEFAULT_USDC_ADDRESS is not set");
        require(initialOwner != address(0), "DeployFactory: OWNER_ADDRESS is not set");
        require(deployerPrivateKey != 0, "DeployFactory: PRIVATE_KEY is not set");

        console.log("-------------------------------------");
        console.log("Deploying CampaignFactory with:");
        console.log("USDC Token:      ", usdcToken);
        console.log("Initial Owner:   ", initialOwner);
        console.log("Deployer Address:", vm.addr(deployerPrivateKey));
        console.log("-------------------------------------");

        // --- Deployment ---
        vm.startBroadcast(deployerPrivateKey);

        CampaignFactory factory = new CampaignFactory(
            usdcToken,
            initialOwner
        );

        vm.stopBroadcast();

        console.log("CampaignFactory deployed at:", address(factory));
        return factory;
    }
} 