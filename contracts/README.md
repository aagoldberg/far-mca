# FAR-MCA Smart Contracts

Revenue-Based Financing smart contracts for zero-interest crowdfunding on Base blockchain.

## Overview

This directory contains the Solidity smart contracts for the FAR-MCA platform. The contracts enable businesses to create revenue-based financing campaigns where funders receive exactly their contribution back (1.0x repayment cap) with zero profit.

## Contract Architecture

### Core Contracts

**RBFCampaignFactory.sol**
- Factory pattern for deploying individual RBF campaigns
- Maintains registry of all campaigns
- Events for tracking campaign creation
- Minimal gas costs for deployment

**RBFCampaign.sol**
- Individual revenue-based financing campaign
- Manages contributions from funders
- Tracks revenue-based repayments
- Distributes repayments proportionally to funders
- Supports EIP-2612 permit signatures for gasless approvals

**TestUSDC.sol**
- ERC-20 token for testing
- Faucet functionality for easy testing
- Mimics USDC functionality
- Use for development and testnet only

### Legacy/Alternative Contracts

**Campaign.sol** - Original campaign contract (non-RBF)
**CampaignFactory.sol** - Factory for standard campaigns
**CrowdFund.sol** - Alternative crowdfunding implementation
**RBFFactory.sol** - Simplified RBF factory
**RBFAdvance.sol** - Alternative RBF implementation

## Key Features

### Zero-Interest Model

The contracts are designed to support a **1.0x repayment cap**:

```solidity
// Example campaign creation
uint256 goalAmount = 10000 * 10**6;  // 10,000 USDC
uint256 revenueShareBps = 500;        // 5% revenue share
uint256 repaymentCap = 100;           // 1.0x cap (100 = 100%)

// Funder contributes: 10,000 USDC
// Business repays: 10,000 USDC (exactly)
// Funder profit: 0 USDC
```

### Revenue-Based Repayment

Businesses pay a percentage of their monthly revenue:

```solidity
// Business makes revenue payment
function makeRevenuePayment(uint256 amount) external {
    // Transfer USDC from business to campaign
    usdc.transferFrom(msg.sender, address(this), amount);

    // Distribute proportionally to all funders
    // Payments stop when totalRepaid >= goalAmount * repaymentCap
}
```

### Dual Contribution Methods

**Standard Approve/Transfer:**
```solidity
// 1. Approve USDC spending
usdc.approve(campaignAddress, amount);

// 2. Contribute to campaign
campaign.contribute(amount);
```

**Gasless Permit (EIP-2612):**
```solidity
// Single transaction with signature
campaign.contributeWithPermit(
    amount,
    deadline,
    v, r, s  // Signature components
);
```

## Setup & Installation

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Git for submodule management

### Installation

```bash
cd contracts

# Initialize Foundry (if needed)
forge init --force

# Install dependencies
forge install

# Or manually install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts
```

### Configuration

Edit `.env.example` and save as `.env`:

```bash
# Blockchain Configuration
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key

# Contract Addresses (update after deployment)
CAMPAIGN_FACTORY_ADDRESS=0x...
USDC_ADDRESS=0x...
```

## Development

### Compile Contracts

```bash
forge build
```

### Run Tests

```bash
# Run all tests
forge test

# Run with verbose output
forge test -vvv

# Run specific test
forge test --match-test testContribute

# Run with gas reporting
forge test --gas-report
```

### Format Code

```bash
forge fmt
```

### Gas Snapshots

```bash
forge snapshot
```

## Deployment

### Deploy to Base Sepolia (Testnet)

**1. Deploy TestUSDC:**
```bash
forge script script/DeployTestUSDC.s.sol:DeployTestUSDC \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

**2. Deploy RBF Factory:**
```bash
forge script script/DeployRBFFactory.s.sol:DeployRBFFactory \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

**3. Update `.env` with deployed addresses**

### Deploy to Base Mainnet

```bash
# Same commands but use base_mainnet RPC
forge script script/DeployRBFFactory.s.sol:DeployRBFFactory \
  --rpc-url base_mainnet \
  --broadcast \
  --verify \
  --slow  # Add delay between transactions
```

**Note**: On mainnet, use the real USDC contract address instead of TestUSDC.

## Contract Interactions

### Create a Campaign

```bash
# Using cast
cast send $FACTORY_ADDRESS \
  "createCampaign(uint256,string)" \
  10000000000 \
  "ipfs://QmYourMetadataHash" \
  --rpc-url base_sepolia \
  --private-key $PRIVATE_KEY
```

### Contribute to Campaign

```bash
# Approve USDC
cast send $USDC_ADDRESS \
  "approve(address,uint256)" \
  $CAMPAIGN_ADDRESS \
  1000000000 \
  --rpc-url base_sepolia \
  --private-key $PRIVATE_KEY

# Contribute
cast send $CAMPAIGN_ADDRESS \
  "contribute(uint256)" \
  1000000000 \
  --rpc-url base_sepolia \
  --private-key $PRIVATE_KEY
```

### Make Revenue Payment

```bash
# Approve USDC for payment
cast send $USDC_ADDRESS \
  "approve(address,uint256)" \
  $CAMPAIGN_ADDRESS \
  500000000 \
  --rpc-url base_sepolia \
  --private-key $PRIVATE_KEY

# Make payment
cast send $CAMPAIGN_ADDRESS \
  "makeRevenuePayment(uint256)" \
  500000000 \
  --rpc-url base_sepolia \
  --private-key $PRIVATE_KEY
```

## Contract Addresses

### Base Sepolia Testnet

```
RBFCampaignFactory: 0x0Eb3075cF3bAAB9715c8D3F423F1634571c4B312
TestUSDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### Base Mainnet

```
To be deployed
USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

## Testing

### Test Files

- `RBFCampaign.t.sol` - Tests for RBF campaign contract
- `Campaign.t.sol` - Tests for standard campaign
- `TestUSDC.t.sol` - Tests for USDC mock
- `CrowdFund.t.sol` - Tests for alternative implementation

### Run Specific Test Suite

```bash
forge test --match-contract RBFCampaignTest
```

### Test Coverage

```bash
forge coverage
```

## Security Considerations

### Audits

⚠️ **These contracts have not been professionally audited.** Use at your own risk.

Before mainnet deployment:
- [ ] Complete professional security audit
- [ ] Bug bounty program
- [ ] Gradual rollout with deposit limits

### Known Considerations

1. **Reentrancy**: Protected with checks-effects-interactions pattern
2. **Integer Overflow**: Using Solidity 0.8+ built-in checks
3. **Access Control**: Creator-only functions for campaign management
4. **Emergency Functions**: Pause functionality for security incidents

## Contract Verification

After deployment, verify on Basescan:

```bash
forge verify-contract \
  $CONTRACT_ADDRESS \
  src/RBFCampaignFactory.sol:RBFCampaignFactory \
  --chain-id 84532 \
  --etherscan-api-key $BASESCAN_API_KEY
```

## Upgradeability

Current contracts are **non-upgradeable** for security and simplicity. The factory pattern allows deploying new versions:

1. Deploy new factory with improved logic
2. Update frontend to use new factory
3. Old campaigns continue to function
4. New campaigns use new implementation

## Gas Optimization

The contracts use several gas optimization techniques:

- Factory pattern for efficient campaign deployment
- Minimal storage variables
- Events for off-chain data
- Efficient loops for distributions
- Custom errors instead of string reverts

## Integration with Frontend

The frontend uses these contracts via the ABIs in `src/abi/`:

- `RBFCampaignFactory.json` - Factory ABI
- `RBFCampaign.json` - Campaign ABI
- `TestUSDC.json` - USDC ABI

ABIs are auto-generated during `forge build` in the `out/` directory.

## Troubleshooting

### "Foundry not found"
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### "Dependencies not found"
```bash
forge install
```

### "RPC connection failed"
Check `.env` file has correct `RPC_URL`

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity Docs](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Base Docs](https://docs.base.org/)
- [EIP-2612 Permit](https://eips.ethereum.org/EIPS/eip-2612)

## License

MIT License

---

**Ready to deploy?** Follow the deployment steps above and update the frontend with your contract addresses!
