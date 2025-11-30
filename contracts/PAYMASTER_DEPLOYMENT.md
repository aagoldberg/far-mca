# Paymaster-Enabled Contracts Deployment

Deployed on: November 25, 2025
Network: Base Sepolia Testnet
Branch: `new-contracts-paymaster`

## Deployed Contracts

### MicroLoanFactory
**Address:** `0x5F2c46b41f8A4978b94c244f8720eF5481F6A81E`
**Deployer:** `0x6F1e5BD44783327984f4723C87E0D2939524943B`
**USDC Address:** `0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe`

## What's New

These contracts include the `*For()` functions that enable fully gasless transactions:

### New Functions Added

```solidity
// MicroLoan.sol
function contributeFor(address contributor, uint256 amount) external nonReentrant;
function repayFor(address payer, uint256 amount) external nonReentrant;
function claimFor(address contributor) external nonReentrant;
```

### How It Works

#### Smart Wallet Users (100% Gasless)
1. User connects with CDP Smart Wallet (email, social login, etc.)
2. User clicks "Contribute $100"
3. Smart Wallet batches two transactions:
   - Approve USDC to loan contract
   - Call `contribute()`
4. Coinbase paymaster sponsors ALL gas
5. User pays $0, you pay $0

#### EOA Users (99% Gasless)
1. User connects with MetaMask/RainbowKit
2. User approves USDC to loan contract (one-time, ~$0.01)
3. User signs message for future transactions
4. Your relay endpoint calls `contributeFor(userAddress, amount)`
5. User pays $0, you pay ~$0.03 per transaction

## Frontend Configuration

Updated in `.env.local`:
```bash
NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS=0x5F2c46b41f8A4978b94c244f8720eF5481F6A81E
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/3mwr4N2wzGkdpICiqJa2v7TMTXwmgCg5
```

## Paymaster Configuration

Configured in Coinbase Developer Platform:
- **Network:** Base Sepolia (unlimited sponsorship for testing)
- **USDC Contract:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (allowlisted)
- **Allowed Function:** `approve(address,uint256)`
- **Gas Policy:**
  - Max per user: $5
  - Max operations: 100
  - Cycle: Daily

## Testing Checklist

Before merging to main:

- [ ] Create test loan via Smart Wallet
- [ ] Test gasless contribute with Smart Wallet
- [ ] Test gasless repay with Smart Wallet
- [ ] Test gasless claim with Smart Wallet
- [ ] Test EOA connect and approve USDC
- [ ] Test EOA relay contribute (after approval)
- [ ] Test wallet type auto-detection
- [ ] Verify paymaster sponsorship in Coinbase dashboard
- [ ] Monitor gas costs and limits

## Cost Analysis

### Smart Wallet (100 transactions)
- **User cost:** $0 (never pays)
- **Your cost:** $0 (Coinbase sponsors)
- **Limitation:** Coinbase daily/monthly limits

### EOA Wallet (100 transactions)
- **User cost:** $0.01 (one-time approval)
- **Your cost:** ~$3-5 (relay gas)
- **Limitation:** Ongoing relay costs

## Production Migration

When ready for mainnet:

1. **Update Paymaster Network:**
   - Switch from Base Sepolia to Base Mainnet
   - Note: $10k/month limit on mainnet
   - Get mainnet paymaster URL from CDP dashboard

2. **Deploy to Base Mainnet:**
   ```bash
   make deploy-mainnet
   ```

3. **Update Frontend:**
   ```bash
   # .env.local
   NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY
   NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS=<mainnet-address>
   ```

4. **Update Subgraph:**
   - Deploy new subgraph pointing to mainnet factory
   - Update NEXT_PUBLIC_SUBGRAPH_URL

## Documentation

- **Setup Guide:** [GASLESS_SETUP_GUIDE.md](../GASLESS_SETUP_GUIDE.md)
- **Hook Documentation:** `apps/web-cdp/src/hooks/useSmartWalletGasless.ts`
- **Wallet Detection:** `apps/web-cdp/src/lib/walletUtils.ts`

## Support

- **CDP Dashboard:** https://portal.cdp.coinbase.com
- **Paymaster Docs:** https://docs.cdp.coinbase.com/wallet-services/docs/paymasters
- **Base Sepolia Explorer:** https://sepolia.basescan.org/address/0x5F2c46b41f8A4978b94c244f8720eF5481F6A81E

## Next Steps

1. Test all gasless flows thoroughly
2. Monitor paymaster usage in CDP dashboard
3. Create PR to merge `new-contracts-paymaster` → `main`
4. Plan mainnet deployment strategy
