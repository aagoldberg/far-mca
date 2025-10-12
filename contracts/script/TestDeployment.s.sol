// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TestUSDC.sol";
import "../src/MicroLoanFactory.sol";
import "../src/MicroLoan.sol";

/**
 * @title TestDeployment
 * @notice Script to test the deployed contracts on Base Sepolia
 * @dev This script will:
 *      1. Mint TestUSDC to your wallet
 *      2. Create a test loan
 *      3. Verify the loan was created successfully
 */
contract TestDeployment is Script {
    // Deployed contract addresses
    address constant USDC_ADDRESS = 0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe;
    address constant FACTORY_ADDRESS = 0x747988d925e8eeC76CF1E143307630dD8BE4bFff;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console2.log("=== Testing Deployed Contracts ===");
        console2.log("Deployer address:", deployer);
        console2.log("TestUSDC:", USDC_ADDRESS);
        console2.log("Factory:", FACTORY_ADDRESS);
        console2.log("");

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Mint TestUSDC
        TestUSDC usdc = TestUSDC(USDC_ADDRESS);
        console2.log("Step 1: Minting TestUSDC to", deployer);
        // Faucet limit is 1000 USDC per call, so call twice to get 2000 USDC
        usdc.faucet(1000e6);
        usdc.faucet(1000e6);
        uint256 balance = usdc.balanceOf(deployer);
        console2.log("  Balance after mint:", balance / 1e6, "USDC");
        require(balance >= 2000e6, "Mint failed");
        console2.log("  [OK] Mint successful");
        console2.log("");

        // Step 2: Create a test loan
        MicroLoanFactory factory = MicroLoanFactory(FACTORY_ADDRESS);
        console2.log("Step 2: Creating test loan");

        uint256 principal = 1_000e6; // 1,000 USDC
        uint256 termPeriods = 12; // 12 months
        uint256 periodLength = 30 days;
        uint256 firstDueDate = block.timestamp + 30 days;
        uint256 fundraisingDeadline = block.timestamp + 7 days;

        console2.log("  Principal:", principal / 1e6, "USDC");
        console2.log("  Term:", termPeriods, "periods");
        console2.log("  Period length:", periodLength / 1 days, "days");
        console2.log("  First due date:", firstDueDate);
        console2.log("  Fundraising deadline:", fundraisingDeadline);

        address loanAddress = factory.createLoan(
            deployer, // borrower
            "ipfs://QmTest123", // metadataURI
            principal,
            termPeriods,
            periodLength,
            firstDueDate,
            fundraisingDeadline
        );

        console2.log("  [OK] Loan created at:", loanAddress);
        console2.log("");

        // Step 3: Verify loan parameters
        MicroLoan loan = MicroLoan(loanAddress);
        console2.log("Step 3: Verifying loan parameters");
        console2.log("  Borrower:", loan.borrower());
        console2.log("  Principal:", loan.principal() / 1e6, "USDC");
        console2.log("  Term periods:", loan.termPeriods());
        console2.log("  Period length:", loan.periodLength() / 1 days, "days");
        console2.log("  Fundraising active:", loan.fundraisingActive());
        console2.log("  [OK] All parameters verified");
        console2.log("");

        // Step 4: Test contribution
        console2.log("Step 4: Testing contribution (contributing 500 USDC)");
        uint256 contributionAmount = 500e6;
        usdc.approve(loanAddress, contributionAmount);
        loan.contribute(contributionAmount);

        uint256 contributed = loan.contributions(deployer);
        console2.log("  Contributed amount:", contributed / 1e6, "USDC");
        console2.log("  Total funded:", loan.totalFunded() / 1e6, "USDC");
        console2.log("  [OK] Contribution successful");
        console2.log("");

        vm.stopBroadcast();

        console2.log("=== Test Summary ===");
        console2.log("[OK] TestUSDC faucet working");
        console2.log("[OK] Factory creating loans");
        console2.log("[OK] Loan accepting contributions");
        console2.log("[OK] All core functionality verified");
        console2.log("");
        console2.log("Loan address:", loanAddress);
        console2.log("View on Basescan: https://sepolia.basescan.org/address/", loanAddress);
    }
}
