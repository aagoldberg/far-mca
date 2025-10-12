// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title TestUSDC
 * @notice A test USDC token for Base Sepolia testing with unlimited minting
 * @dev Compatible with your existing Campaign contracts and includes EIP-2612 permit functionality
 */
contract TestUSDC is ERC20, ERC20Permit {
    // Same decimals as real USDC
    uint8 private constant DECIMALS = 6;

    // Events
    event Minted(address indexed to, uint256 amount);
    event BatchMinted(address[] recipients, uint256[] amounts);

    constructor() ERC20("Test USDC", "tUSDC") ERC20Permit("Test USDC") {
        // Mint initial supply to deployer for distribution
        _mint(msg.sender, 1_000_000 * 10**DECIMALS); // 1M test USDC
    }

    /**
     * @notice Returns 6 decimals like real USDC
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Public minting function for faucet functionality
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in base units, e.g., 1000000 = 1 USDC)
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
        emit Minted(to, amount);
    }

    /**
     * @notice Mint tokens to the caller (self-service faucet)
     * @param amount Amount of tokens to mint to msg.sender
     */
    function faucet(uint256 amount) external {
        // Reasonable limits to prevent spam (1000 USDC max per call)
        require(amount <= 1000 * 10**DECIMALS, "TestUSDC: Amount exceeds faucet limit");

        _mint(msg.sender, amount);
        emit Minted(msg.sender, amount);
    }

    /**
     * @notice Batch mint to multiple addresses (useful for testing)
     * @param recipients Array of addresses to mint to
     * @param amounts Array of amounts to mint (must match recipients length)
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "TestUSDC: Arrays length mismatch");
        require(recipients.length <= 100, "TestUSDC: Too many recipients");

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }

        emit BatchMinted(recipients, amounts);
    }

    /**
     * @notice Convenience function to mint exact USDC amounts (handles decimals)
     * @param to Address to mint to
     * @param usdcAmount Amount in USDC (e.g., 100 = 100 USDC)
     */
    function mintUSDC(address to, uint256 usdcAmount) external {
        uint256 amount = usdcAmount * 10**DECIMALS;
        _mint(to, amount);
        emit Minted(to, amount);
    }

    /**
     * @notice Self-service faucet with USDC amount (handles decimals)
     * @param usdcAmount Amount in USDC to mint to caller
     */
    function faucetUSDC(uint256 usdcAmount) external {
        require(usdcAmount <= 1000, "TestUSDC: Amount exceeds 1000 USDC limit");

        uint256 amount = usdcAmount * 10**DECIMALS;
        _mint(msg.sender, amount);
        emit Minted(msg.sender, amount);
    }
}
