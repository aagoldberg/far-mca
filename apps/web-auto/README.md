# CDP Auto-Repayment Demo

A demonstration of Coinbase Developer Platform (CDP) Smart Wallets with automatic repayment using ERC-4337 session keys.

## What This Demonstrates

This demo shows how to implement **automatic loan repayments** for revenue-based financing using:

- **CDP Smart Wallets** (ERC-4337 account abstraction)
- **Session Keys** (sign once, auto-approve future transactions)
- **Revenue-based repayment** simulation
- **Gasless transactions** (via Paymaster - coming soon)

## Key Features

### 1. Session Key Creation
Borrowers sign **once** to authorize future repayments with:
- Maximum amount per transaction
- Maximum amount per month
- Time-based expiration
- Contract whitelisting

### 2. Auto-Repayment Flow
```
Merchant Revenue → Backend Calculates % → Bridge (USD→USDC) →
Smart Contract → Session Key Validates → Auto-Approve → Repayment Complete
```

### 3. Non-Custodial
- Users maintain full control
- Can revoke session keys anytime
- All rules enforced by smart contract logic

## Getting Started

### 1. Install Dependencies

```bash
cd apps/web-auto
npm install
```

### 2. Set Up Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your credentials:
```
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wc_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003)

## How It Works

### Session Keys (ERC-4337)

Session keys allow pre-authorized transactions without manual signing:

```typescript
// Borrower signs ONCE
const sessionKey = await smartWallet.createSessionKey({
  allowedContracts: [LOAN_CONTRACT],
  allowedFunctions: ['repayLoan'],
  maxAmount: parseUnits('500', 6), // $500/month
  validUntil: Date.now() + (90 * 24 * 60 * 60 * 1000), // 90 days
})

// Future repayments execute automatically
// Smart wallet's validateUserOp() checks session rules
// If valid → auto-approve (no signature needed!)
```

### Architecture

```
┌─────────────────┐
│ Merchant Revenue│
│  (Stripe/Square)│
└────────┬────────┘
         │ Webhook
         ↓
┌─────────────────┐
│  Your Backend   │ Calculates % repayment
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Bridge API    │ USD → USDC conversion
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Smart Contract  │ calls repayLoan() with session key
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ CDP Smart Wallet│ validateUserOp() checks rules
│  (ERC-4337)     │ ✓ Within limits? → Auto-approve
└────────┬────────┘
         │
         ↓
    ✅ Repaid!
```

## Tech Stack

- **Next.js 15** - React framework
- **Wagmi** - Ethereum hooks
- **Viem** - Ethereum interactions
- **Coinbase Wallet SDK** - CDP Smart Wallet integration
- **Tailwind CSS** - Styling

## Key Components

### WalletConnect
- Connects CDP Smart Wallet
- Forces `smartWalletOnly` mode (ERC-4337)

### SessionKeyDemo
- UI for creating session keys
- Configurable limits and expiration
- Shows active session status

### AutoRepaymentDemo
- Simulates revenue-based repayment
- Calculates % of merchant revenue
- Logs repayment history

## Production Implementation

For real-world usage, you'll need:

1. **Backend Integration**
   - Stripe/Square webhook handling
   - Revenue calculation logic
   - Session key storage

2. **Bridge Integration**
   - USD → USDC conversion API
   - Handle conversion rates

3. **Smart Contract**
   - Loan repayment logic
   - Session key validation
   - Lender distribution

4. **CDP Paymaster** (Optional)
   - Sponsor gas fees
   - Improve UX further

## Phase 2 Plans

See **[PHASE-2-AUTO-DEDUCTION.md](./PHASE-2-AUTO-DEDUCTION.md)** for detailed implementation plans including:

- **Plan A: Chainlink Automation** - Decentralized triggers with revenue oracles
- **Plan B: Multi-Sig Backend** - Enhanced security with multiple signatures
- **Plan C: On-Chain Attestations** - Fully transparent revenue reporting (future)
- **Plan D: Crypto-Native Revenue** - Fully decentralized for crypto merchants

Each plan includes complete smart contract code, architecture diagrams, and trade-off analysis.

## Learn More

- [CDP Documentation](https://docs.cdp.coinbase.com)
- [ERC-4337 Spec](https://eips.ethereum.org/EIPS/eip-4337)
- [Session Keys Guide](https://docs.erc4337.io/smart-accounts/session-keys-and-delegation)
- [Bridge API](https://www.bridge.xyz/docs)

## License

MIT
