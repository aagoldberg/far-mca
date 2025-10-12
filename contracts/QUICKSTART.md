# Quick Deployment Guide

## 1. Setup (5 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit .env and fill in:
# - PRIVATE_KEY (your wallet private key)
# - BASESCAN_API_KEY (from basescan.org)
# - DEPLOY_TEST_USDC=true (for testing)

# Install dependencies
make install

# Test everything works
make test
```

## 2. Deploy to Base Sepolia

```bash
# Dry run first (simulate)
make deploy-sepolia-dry

# Deploy for real
make deploy-sepolia
```

## 3. Save Deployment Info

The script will output:
```
USDC: 0x...
Factory: 0x...
```

**Save these addresses!** You'll need them for the frontend.

## 4. Test Your Deployment

```bash
# Mint some test USDC to your wallet
cast send <USDC_ADDRESS> "faucet(uint256)" 1000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url $BASE_SEPOLIA_RPC_URL

# View on Basescan
# https://sepolia.basescan.org/address/<FACTORY_ADDRESS>
```

## Done! 🎉

Your contracts are now live on Base Sepolia.

Next steps:
- Update frontend with contract addresses
- Create a test loan
- Set up The Graph for indexing

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for full documentation.
