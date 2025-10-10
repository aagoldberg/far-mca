// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FarcasterFundraise} from "../src/CrowdFund.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

contract DeployScript is Script {
    function run() external returns (FarcasterFundraise) {
        // --- Read Configuration from Environment Variables ---
        address usdcToken = vm.envAddress("USDC_ADDRESS");
        address feeAddress = vm.envAddress("FEE_ADDRESS");
        uint16 feePercentage = uint16(vm.envUint("FEE_PERCENTAGE"));
        uint256 maxDuration = vm.envUint("MAX_DURATION");

        // --- Pre-flight Checks ---
        require(usdcToken != address(0), "DeployScript: USDC_ADDRESS is not set");
        require(feeAddress != address(0), "DeployScript: FEE_ADDRESS is not set");

        console.log("-------------------------------------");
        console.log("Deploying FarcasterFundraise with:");
        console.log("USDC Token:      ", usdcToken);
        console.log("Fee Address:     ", feeAddress);
        console.log("Fee Percentage:  ", feePercentage);
        console.log("Max Duration:    ", maxDuration);
        console.log("-------------------------------------");

        // --- Deployment ---
        vm.startBroadcast();

        // The deployer of the script will be the initial owner of the contract
        address initialOwner = msg.sender;

        FarcasterFundraise fundraiser = new FarcasterFundraise(
            usdcToken,
            initialOwner,
            feeAddress,
            feePercentage,
            maxDuration
        );

        vm.stopBroadcast();

        console.log("FarcasterFundraise deployed at:", address(fundraiser));
        return fundraiser;
    }
} 