# CDP Smart Wallet Auto-Repayment

**Technology**: CDP (Coinbase Developer Platform) Smart Wallets with ERC-4337
**Status**: Demo built, production-ready architecture designed
**Demo**: [apps/web-auto](../../apps/web-auto)

---

## Overview

CDP Smart Wallets enable **automatic loan repayments** without requiring users to manually approve each transaction. This is achieved through **session keys** - a feature of ERC-4337 account abstraction that allows pre-authorized transactions within defined rules.

**The user experience**: Sign once to authorize repayments, then everything happens automatically.

---

## How Session Keys Work

### Traditional Wallet (MetaMask, etc.)
```
Revenue arrives → Backend calculates repayment → Email borrower →
Borrower logs in → Approves transaction → Signs with wallet → Payment sent
```
❌ **High friction**: 5+ manual steps, easily forgotten

### CDP Smart Wallet with Session Keys
```
Revenue arrives → Backend calculates repayment → Smart contract executes →
Wallet validates session key → Auto-approves → Payment sent
```
✅ **Zero friction**: Fully automated after one-time setup

---

## Technical Implementation

### Session Key Creation (One-Time Setup)

When a borrower takes out a loan, they create a session key with predefined rules:

```typescript
const sessionKey = await smartWallet.createSessionKey({
  // What contract can be called
  allowedContracts: [LOAN_REPAYMENT_CONTRACT],

  // What functions are allowed
  allowedFunctions: ['repayLoan'],

  // Spending limits
  maxAmountPerTransaction: parseUnits('100', 6),  // $100 max per payment
  maxAmountPerMonth: parseUnits('500', 6),        // $500 max per month

  // Time-based expiration
  validUntil: Date.now() + (90 * 24 * 60 * 60 * 1000), // 90 days
})
```

**This is the ONLY signature required** from the borrower.

### On-Chain Validation

Every repayment transaction is validated on-chain by the smart wallet:

```solidity
function validateUserOp(UserOperation calldata userOp)
  external returns (uint256 validationData)
{
  // Check if transaction uses a valid session key
  SessionKey memory session = getSessionKey(userOp.signature);

  // Validate against rules
  require(block.timestamp <= session.validUntil, "Session expired");
  require(userOp.callData.target == session.allowedContract, "Invalid contract");
  require(userOp.callData.value <= session.maxPerTransaction, "Exceeds limit");
  require(monthlyTotal + userOp.callData.value <= session.maxPerMonth, "Monthly limit");

  return 0; // Valid - auto-approve
}
```

### Automatic Repayment Flow

```
1. Merchant processes sale via Stripe/Square
   ↓
2. Webhook triggers backend
   ↓
3. Backend calculates repayment (% of revenue)
   ↓
4. Bridge API converts USD → USDC
   ↓
5. Smart contract calls repayLoan() with session key
   ↓
6. CDP Smart Wallet validates session key rules
   ↓
7. Auto-approves if valid (NO SIGNATURE NEEDED)
   ↓
8. USDC distributed to lenders
```

---

## Key Benefits

### For Borrowers
- **Zero friction**: Sign once, never think about payments again
- **Can't forget**: Payments happen automatically
- **Stay in control**: Set spending limits, revoke anytime
- **Still non-custodial**: You control your keys

### For Lenders
- **Lower defaults**: No missed payments from forgetfulness
- **Predictable yield**: Automated repayment schedule
- **No chasing payments**: Everything automatic

### For the Protocol
- **Better UX**: Removes biggest friction point
- **Lower default rate**: Automation prevents forgetfulness
- **Scalable**: Works for 10 or 10,000 borrowers

---

## Architecture Comparison

| Aspect | Traditional Wallet | CDP Smart Wallet |
|--------|-------------------|------------------|
| **Setup** | Connect wallet | Connect wallet + create session key |
| **Each payment** | Manual approval + signature | Automatic (no action) |
| **Missed payments** | Common (forgetfulness) | Impossible (automated) |
| **User effort** | High (every payment) | Zero (after setup) |
| **Gas costs** | User pays each time | Can be sponsored (Paymaster) |
| **Security** | Manual review each time | Pre-approved rules enforced on-chain |

---

## Security Features

### 1. On-Chain Rule Enforcement
All session key rules are validated on-chain by the smart wallet contract - not by your backend.

### 2. Spending Limits
- Maximum per transaction
- Maximum per month
- Can never exceed these limits, even if backend is compromised

### 3. Time-Based Expiration
- Session keys expire automatically
- Borrower must renew to continue automatic payments

### 4. Contract Whitelisting
- Can only call specific approved contracts
- Cannot drain wallet to arbitrary addresses

### 5. User Control
- Borrower can revoke session key anytime
- Emergency pause function available
- Still fully non-custodial

---

## Demo Application

We've built a working demo at **`apps/web-auto`** that showcases:

1. **CDP Wallet Connection** - Connect via passkey, Google, or Apple
2. **Session Key Creation** - Configure limits and expiration
3. **Auto-Repayment Simulation** - See it work without signatures

**Run the demo:**
```bash
cd apps/web-auto
npm install
npm run dev
```

Visit http://localhost:3003

---

## Production Implementation

For production deployment, see detailed implementation plans:

📄 [Phase 2 Auto-Deduction Plans](../vision/phase-2-implementation-plans.md)

Plans include:
- **Plan A**: Chainlink Automation (decentralized triggers)
- **Plan B**: Multi-Sig Backend (enhanced security)
- **Plan C**: On-Chain Attestations (future)
- **Plan D**: Crypto-Native Revenue (fully decentralized)

---

## Trust Model

### What's Non-Custodial
✅ User controls private keys via CDP smart wallet
✅ Session key rules enforced on-chain
✅ Spending limits cannot be exceeded
✅ User can revoke access anytime

### What's Centralized
⚠️ Backend calculates repayment amounts
⚠️ Revenue data comes from Stripe/Square (off-chain)
⚠️ Timing of repayments controlled by backend

### Protection Mechanisms
- Session key limits enforce maximum amounts
- Transparent on-chain logging
- Dispute mechanism for incorrect calculations
- Emergency pause function

---

## Technology Stack

- **CDP SDK**: `@coinbase/wallet-sdk`, `@coinbase/onchainkit`
- **Smart Wallet Standard**: ERC-4337 account abstraction
- **Network**: Base (Coinbase L2)
- **Token**: USDC
- **Revenue Sources**: Stripe, Square (via webhooks)
- **Fiat Conversion**: Bridge API

---

## Next Steps

1. ✅ **Demo Built** - Working proof of concept
2. 🚧 **Smart Contracts** - Deploy production loan repayment contracts
3. 🚧 **Stripe Integration** - Production webhook handling
4. 🚧 **Bridge Integration** - USD → USDC conversion
5. 📅 **Chainlink Automation** - Decentralized triggers (Phase 2B)

---

## Learn More

- **Demo Code**: [apps/web-auto](../../apps/web-auto)
- **Implementation Plans**: [Phase 2 Plans](../vision/phase-2-implementation-plans.md)
- **CDP Documentation**: https://docs.cdp.coinbase.com
- **ERC-4337 Spec**: https://eips.ethereum.org/EIPS/eip-4337
