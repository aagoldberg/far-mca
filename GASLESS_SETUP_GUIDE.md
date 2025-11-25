# Gasless Transaction Setup Guide

Complete guide for implementing fully gasless transactions for Smart Wallet users.

## Overview

We now support **TWO gasless transaction methods**:

### 1. Smart Wallet + Paymaster (100% Gasless) ⭐
- **For**: CDP Smart Wallet users (email, SMS, social login)
- **Cost**: $0 for user, $0 for you (Coinbase sponsors)
- **User Experience**: Click once → Sign once → Done
- **Includes**: Gasless USDC approvals!

### 2. Relay Endpoints (99% Gasless)
- **For**: EOA wallet users (MetaMask, RainbowKit, etc.)
- **Cost**: User pays $0.01 once (approval), you pay ~$0.01-0.05 per transaction
- **User Experience**: Approve USDC once → Then fully gasless

---

## Setup Steps

### Step 1: Get Coinbase Paymaster URL

1. Go to https://portal.cdp.coinbase.com
2. Sign in with your Coinbase Developer Platform account
3. Navigate to **Paymasters** section
4. Enable paymaster for your project
5. Copy the paymaster URL

### Step 2: Add Environment Variable

Add to `.env.local`:

```bash
NEXT_PUBLIC_PAYMASTER_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_KEY
```

### Step 3: Deploy Updated Contracts

The contracts now have `*For()` functions:
```solidity
function contributeFor(address contributor, uint256 amount) external;
function repayFor(address payer, uint256 amount) external;
function claimFor(address contributor) external;
```

Deploy these to Base Sepolia:
```bash
cd contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast
```

Update contract addresses in `apps/web-cdp/src/lib/constants.ts`

### Step 4: Fund Relayer Wallet (For EOA Users)

For the relay endpoints, fund a wallet with Base Sepolia ETH:

```bash
# Add to .env
RELAYER_PRIVATE_KEY=0x...your-private-key
```

Get testnet ETH:
- https://www.coinbase.com/faucets
- https://www.alchemy.com/faucets/base-sepolia

---

## Usage Examples

### For Smart Wallet Users (Fully Gasless)

```typescript
import { useSmartWalletContribute } from '@/hooks/useSmartWalletGasless';
import { useGaslessMethod } from '@/lib/walletUtils';

function ContributeButton() {
  const { method, description } = useGaslessMethod();
  const { contribute, isPending, isConfirmed } = useSmartWalletContribute();

  const handleContribute = async () => {
    if (method === 'paymaster') {
      // Smart Wallet: Fully gasless including approval!
      await contribute(loanAddress, "100"); // $100 USDC
    } else {
      // EOA: Use relay endpoint (fallback)
      // User will need to approve USDC first
    }
  };

  return (
    <button onClick={handleContribute} disabled={isPending}>
      {isPending ? 'Processing...' : `Contribute $100 (${description})`}
    </button>
  );
}
```

### For EOA Users (Relay Endpoints)

```typescript
import { useContributeGasless } from '@/hooks/useMicroLoanGasless';

function ContributeButton() {
  const { contribute, isPending, isSuccess } = useContributeGasless();

  const handleContribute = async () => {
    // User must approve USDC to loan contract first (one-time, they pay gas)
    // Then this is gasless (you pay via relay)
    await contribute(loanAddress, "100");
  };

  return <button onClick={handleContribute}>Contribute $100</button>;
}
```

### Auto-Detect Wallet Type

```typescript
import { useGaslessMethod } from '@/lib/walletUtils';
import { useSmartWalletContribute } from '@/hooks/useSmartWalletGasless';
import { useContributeGasless } from '@/hooks/useMicroLoanGasless';

function SmartContributeButton() {
  const { method } = useGaslessMethod();
  const smartWallet = useSmartWalletContribute();
  const relay = useContributeGasless();

  const handleContribute = async () => {
    if (method === 'paymaster') {
      // Smart Wallet: Batch approve + contribute
      await smartWallet.contribute(loanAddress, "100");
    } else {
      // EOA: Use relay (requires prior approval)
      await relay.contribute(loanAddress, "100");
    }
  };

  return <button onClick={handleContribute}>Contribute $100</button>;
}
```

---

## Available Hooks

### Smart Wallet Hooks (Fully Gasless)
Located in `apps/web-cdp/src/hooks/useSmartWalletGasless.ts`:

```typescript
// Contribute (batches approve + contribute)
const { contribute, isPending, isConfirmed } = useSmartWalletContribute();

// Repay (batches approve + repay)
const { repay, isPending, isConfirmed } = useSmartWalletRepay();

// Claim (no approval needed)
const { claim, isPending, isConfirmed } = useSmartWalletClaim();

// Pre-approve USDC (optional)
const { approve, isPending, isConfirmed } = useSmartWalletApprove();
```

### Relay Hooks (For EOA)
Located in `apps/web-cdp/src/hooks/useMicroLoanGasless.ts`:

```typescript
// Contribute (requires prior USDC approval)
const { contribute, isPending, isSuccess } = useContributeGasless();

// Repay (requires prior USDC approval)
const { repay, isPending, isSuccess } = useRepayGasless();

// Claim (no approval needed)
const { claim, isPending, isSuccess, claimedAmount } = useClaimGasless();
```

### Utility Hooks
Located in `apps/web-cdp/src/lib/walletUtils.ts`:

```typescript
// Detect wallet type
const { isSmartWallet, connectorName } = useIsSmartWallet();

// Check paymaster support
const { supportsPaymaster, hasPaymasterConfigured } = useSupportsPaymaster();

// Get recommended method
const { method, description } = useGaslessMethod();
// method: 'paymaster' | 'relay'
```

---

## Cost Comparison

### Smart Wallet User (100 transactions)
- User cost: **$0** (never pays gas)
- Your cost: **$0** (Coinbase sponsors)
- Limitation: Coinbase daily/monthly limits

### EOA User (100 transactions)
- User cost: **$0.01** (one-time USDC approval)
- Your cost: **~$3-5** (100 transactions × $0.03-0.05 relay gas)
- Limitation: You pay ongoing relay costs

---

## Testing Checklist

Before production:

- [ ] Get Coinbase paymaster URL and add to environment
- [ ] Deploy updated contracts with `*For()` functions
- [ ] Fund relayer wallet with testnet ETH
- [ ] Test Smart Wallet gasless contribute
- [ ] Test Smart Wallet gasless repay
- [ ] Test Smart Wallet gasless claim
- [ ] Test EOA relay contribute (after approval)
- [ ] Test EOA relay repay (after approval)
- [ ] Test EOA relay claim
- [ ] Test wallet type detection
- [ ] Monitor paymaster usage/limits
- [ ] Monitor relay gas costs

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Clicks Button                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Detect Wallet   │
                    │ Type            │
                    └─────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │  Smart Wallet?       │    │  EOA Wallet?         │
    │  (CDP, Safe, etc.)   │    │  (MetaMask, etc.)    │
    └──────────────────────┘    └──────────────────────┘
                │                           │
                ▼                           ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │ Batch Transaction:   │    │ 1. Check Approval    │
    │ 1. Approve USDC      │    │ 2. Sign Message      │
    │ 2. Contribute        │    │ 3. Relay Endpoint    │
    └──────────────────────┘    └──────────────────────┘
                │                           │
                ▼                           ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │ Coinbase Paymaster   │    │ Your Relayer Pays    │
    │ Sponsors Gas         │    │ Gas                  │
    │ (FREE)               │    │ (~$0.03)             │
    └──────────────────────┘    └──────────────────────┘
                │                           │
                └───────────┬───────────────┘
                            ▼
                 ┌────────────────────┐
                 │ Transaction        │
                 │ Confirmed          │
                 └────────────────────┘
```

---

## Next Steps

1. **Get paymaster URL** from Coinbase CDP portal
2. **Add to .env**: `NEXT_PUBLIC_PAYMASTER_URL=...`
3. **Deploy contracts** with new `*For()` functions
4. **Test with Smart Wallet**: Create account via email/social
5. **Test with EOA**: Connect MetaMask
6. **Monitor costs**: Track paymaster usage and relay gas

---

## Support

- Coinbase Developer Platform: https://docs.cdp.coinbase.com
- Paymaster Docs: https://docs.cdp.coinbase.com/wallet-services/docs/paymasters
- Issues: https://github.com/aagoldberg/far-mca/issues

