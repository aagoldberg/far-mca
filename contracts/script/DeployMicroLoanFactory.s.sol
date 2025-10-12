// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MicroLoanFactory.sol";
import "../src/TestUSDC.sol";

contract DeployMicroLoanFactory is Script {
    function run() external {
        vm.startBroadcast();

        // Replace TestUSDC with chain USDC address in production
        TestUSDC usdc = new TestUSDC();
        MicroLoanFactory factory = new MicroLoanFactory(address(usdc));

        console2.log("USDC:", address(usdc));
        console2.log("MicroLoanFactory:", address(factory));

        vm.stopBroadcast();
    }
}


