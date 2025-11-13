# Quick Start Guide

## What You Just Built

A fully functional demo showing **CDP Smart Wallet auto-repayment** with session keys.

## Running the Demo

```bash
cd apps/web-auto
npm run dev
```

Open [http://localhost:3003](http://localhost:3003)

## Demo Flow

### Step 1: Connect CDP Smart Wallet
- Click "Connect with Coinbase Wallet"
- Create or sign in with passkey/Google/Apple
- You'll get an ERC-4337 smart wallet on Base

### Step 2: Create Session Key
Configure auto-repayment rules:
- **Max per transaction**: $100 USDC
- **Max per month**: $500 USDC
- **Valid for**: 90 days

Click "Create Session Key (Sign Once)" - this is the **only signature required!**

### Step 3: Simulate Auto-Repayment
- Set merchant revenue: $1,000
- Set repayment percentage: 10%
- Click "Trigger Auto-Repayment"

Watch it execute **without requiring a signature** ✨

## What's Happening Under the Hood

```typescript
// 1. Session key validates the transaction
function validateUserOp(userOp) {
  const session = getSessionKey(userOp.signature)

  // Check all rules
  if (userOp.value > session.maxPerTx) return REJECT
  if (block.timestamp > session.validUntil) return REJECT

  return APPROVE // ← Auto-approves!
}

// 2. No user signature needed for repayment
// Smart wallet automatically approves via session key logic
```

## Real-World Integration

To use this in production:

### 1. Backend Setup (Stripe Webhook)
```typescript
app.post('/webhooks/stripe/payment', async (req) => {
  const payment = req.body

  // Calculate 10% repayment
  const repayment = payment.amount * 0.10

  // Convert USD → USDC
  const usdc = await bridge.convert(repayment)

  // Trigger repayment (uses session key)
  await loanContract.repay({
    borrower: merchant.wallet,
    amount: usdc,
    useSessionKey: true // ← No signature!
  })
})
```

### 2. Smart Contract
```solidity
function repayLoan(
  address borrower,
  uint256 amount,
  bool useSessionKey
) external {
  // Transfer automatically validates via session key
  IERC20(USDC).transferFrom(borrower, lenders, amount);
  distributeFunds(loanId, amount);
}
```

### 3. Session Key Creation (One-Time)
```typescript
// Borrower signs ONCE when taking loan
await smartWallet.createSessionKey({
  allowedContracts: [LOAN_CONTRACT_ADDRESS],
  allowedFunctions: ['repayLoan'],
  maxAmountPerTx: parseUnits('100', 6),
  maxAmountPerMonth: parseUnits('500', 6),
  validUntil: loanDeadline
})
```

## Architecture Comparison

### Without Session Keys (Traditional)
```
Merchant Revenue → Backend calculates → Send email to borrower →
Borrower logs in → Approves transaction → Signs → Payment sent
❌ Friction: 4-5 manual steps
```

### With Session Keys (CDP Smart Wallets)
```
Merchant Revenue → Backend calculates → Auto-repayment executes
✅ Zero friction: Fully automated
```

## Key Benefits

| Feature | Traditional Wallet | CDP Smart Wallet |
|---------|-------------------|------------------|
| **Signatures** | Every payment | Once (setup) |
| **User Action** | Manual approval each time | Zero after setup |
| **Merchant Experience** | Must remember to pay | Automatic |
| **Missed Payments** | Common | Impossible |
| **Gas Fees** | User pays each time | Can be sponsored |

## Next Steps

1. **Add Paymaster** - Sponsor gas fees for even better UX
2. **Integrate Bridge** - Real USD → USDC conversion
3. **Deploy Contracts** - Production loan repayment logic
4. **Stripe/Square Integration** - Real merchant revenue tracking

## Learn More

- **This Demo**: Shows UI/UX and session key concept
- **Real Implementation**: Requires smart contract development
- **CDP Docs**: https://docs.cdp.coinbase.com
- **Session Keys**: https://docs.erc4337.io

## Questions?

This is a **demonstration** showing how session keys enable auto-repayment. For production:
- You'll need actual smart contracts deployed
- Backend integration with Stripe/Square
- Bridge API for fiat conversion
- Security audits

But the core UX you see here - **sign once, auto-approve forever** - is exactly how it works! 🎉
