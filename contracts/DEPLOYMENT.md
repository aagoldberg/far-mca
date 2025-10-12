# Deployment Guide

## Prerequisites

1. **Foundry installed**: Install from [getfoundry.sh](https://getfoundry.sh)
2. **Private key**: Wallet with ETH on Base Sepolia for gas
3. **RPC access**: Base Sepolia RPC URL (default: https://sepolia.base.org)
4. **Basescan API key**: For contract verification (get from [basescan.org](https://basescan.org))

## Setup

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in `.env` file**:
   ```bash
   # Required
   PRIVATE_KEY=0x...  # Your deployer private key (with 0x prefix)
   BASESCAN_API_KEY=...  # From basescan.org/myapikey

   # For Base Sepolia with TestUSDC
   DEPLOY_TEST_USDC=true
   BASE_SEPOLIA_USDC=0x0000000000000000000000000000000000000000  # Not used when DEPLOY_TEST_USDC=true

   # Or to use existing USDC on Base Sepolia (if available)
   # DEPLOY_TEST_USDC=false
   # BASE_SEPOLIA_USDC=0x...  # Address of existing USDC contract
   ```

3. **Install dependencies**:
   ```bash
   make install
   # or
   forge install
   ```

4. **Build contracts**:
   ```bash
   make build
   # or
   forge build
   ```

5. **Run tests**:
   ```bash
   make test
   # or
   forge test -vv
   ```

## Deployment Options

### Option 1: Deploy with TestUSDC (Recommended for MVP)

**Benefits**:
- Unlimited minting for testing
- No need to find real USDC
- Full control over token supply

Set in `.env`:
```bash
DEPLOY_TEST_USDC=true
```

Then deploy:
```bash
make deploy-sepolia
```

### Option 2: Use Existing USDC

If you have the address of an existing USDC contract on Base Sepolia:

Set in `.env`:
```bash
DEPLOY_TEST_USDC=false
BASE_SEPOLIA_USDC=0x...  # Your USDC address
```

Then deploy:
```bash
make deploy-sepolia
```

## Deployment Commands

### Dry Run (Simulate deployment)
```bash
make deploy-sepolia-dry
```

### Deploy to Base Sepolia
```bash
make deploy-sepolia
```

This will:
1. Deploy TestUSDC (if `DEPLOY_TEST_USDC=true`)
2. Deploy MicroLoanFactory
3. Verify contracts on Basescan
4. Print deployment addresses

### Deploy to Base Mainnet (Production)
```bash
make deploy-mainnet
```

⚠️ **WARNING**: This deploys to production. Make sure:
- You've tested thoroughly on Sepolia
- Your `.env` has `BASE_MAINNET_USDC` set to real USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Your wallet has sufficient ETH for gas
- You understand the risks

## After Deployment

### Save Deployment Addresses

The deployment script will output:
```
=== Deployment Summary ===
Network: Base Sepolia
USDC: 0x...
Factory: 0x...
========================
```

**Save these addresses** - you'll need them for:
- Frontend integration
- Creating loans
- Monitoring contracts

### Verify Contracts (if auto-verify fails)

If automatic verification fails, manually verify:

```bash
# Verify Factory
forge verify-contract \
  <FACTORY_ADDRESS> \
  src/MicroLoanFactory.sol:MicroLoanFactory \
  --chain base-sepolia \
  --constructor-args $(cast abi-encode "constructor(address)" <USDC_ADDRESS>)

# Verify TestUSDC (if deployed)
forge verify-contract \
  <USDC_ADDRESS> \
  src/TestUSDC.sol:TestUSDC \
  --chain base-sepolia
```

### Test Deployment

1. **Mint TestUSDC** (if using TestUSDC):
   ```bash
   cast send <USDC_ADDRESS> "faucet(uint256)" 1000000000 --private-key $PRIVATE_KEY --rpc-url $BASE_SEPOLIA_RPC_URL
   ```
   This mints 1000 USDC (6 decimals)

2. **Create a test loan**:
   Use the frontend or call `createLoan()` directly via cast

3. **View on Basescan**:
   - Factory: `https://sepolia.basescan.org/address/<FACTORY_ADDRESS>`
   - USDC: `https://sepolia.basescan.org/address/<USDC_ADDRESS>`

## Troubleshooting

### "Failed to send transaction"
- Check you have enough ETH for gas
- Verify your PRIVATE_KEY is correct (includes 0x prefix)
- Check RPC URL is accessible

### "Verification failed"
- Wait a few minutes and try manual verification
- Check BASESCAN_API_KEY is valid
- Basescan can be slow sometimes - retry later

### "Invalid contract address"
- If using existing USDC, verify the address is correct
- Make sure you're on the right network (Sepolia vs Mainnet)

### "Transaction underpriced"
- Base Sepolia might be congested
- Try again with `--gas-price` flag or wait

## Configuration Updates

To change factory settings after deployment, call these owner-only functions:

```solidity
// Update bounds
factory.setBounds(minTerm, maxTerm, minPeriodLen, maxPeriodLen);

// Update minimum principal
factory.setMinPrincipal(newMin);

// Update disbursement window
factory.setDisbursementWindow(newWindow);

// Update grace period
factory.setGracePeriod(newGracePeriod);

// Emergency pause
factory.pause();
factory.unpause();
```

Use `cast send` or your frontend admin panel to call these.

## Security Checklist

Before mainnet deployment:

- [ ] All tests passing
- [ ] Contract verified on Basescan
- [ ] Factory owner is correct address
- [ ] Factory settings are production-ready
- [ ] USDC address is official Base USDC (not TestUSDC!)
- [ ] Emergency pause is accessible
- [ ] Deployment wallet is secured

## Useful Commands

```bash
# View deployment help
make help

# Run tests with gas reporting
make test-gas

# Format code
make format

# Generate coverage report
make coverage

# Start local Anvil node
make anvil

# Deploy to local Anvil (for testing)
make deploy-local
```

## Next Steps

After successful deployment:

1. **Update frontend** with contract addresses
2. **Set up The Graph** subgraph for indexing
3. **Create test loans** to verify everything works
4. **Monitor contracts** on Basescan
5. **Consider multisig** for factory owner (Gnosis Safe)

## Support

- Check deployment logs in `broadcast/` folder
- Review contract code in `src/`
- Run tests: `make test`
