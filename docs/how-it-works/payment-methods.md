# Payment Methods

LendFriend makes lending accessible whether you're crypto-native or new to web3.

---

## For Crypto Users

**Direct USDC transfer**

Connect your wallet (MetaMask, Coinbase Wallet, etc.) and contribute USDC directly to any loan.

- **Cost:** ~$0.02 per contribution (Base L2 gas fees)
- **Speed:** 2-second confirmation
- **Control:** Non-custodial, you control your keys

---

## For Non-Crypto Users

**Pay with card (Coinbase Pay)**

Buy USDC with a debit or credit card. USDC is sent directly to the loan - no crypto wallet needed.

- **Supported cards:** Visa, Mastercard, Amex
- **Fee:** ~2.5% for card purchases
- **Instant:** Contribution appears immediately

**Embedded wallet (Privy)**

Create a wallet automatically when you first contribute. No seed phrases, no complexity.

- **Sign up:** Email or social login (Google, Twitter)
- **Fee:** ~3-4% for card purchases
- **Progressive:** Export to self-custody wallet anytime

---

## Gasless Contributions

**Account abstraction** lets new users contribute without paying gas fees.

How it works:
- LendFriend sponsors your first contribution's gas fee
- You only need USDC, not ETH
- One gasless transaction per user per loan
- Falls back to regular transaction if limit reached

This removes the "you need ETH to do anything" barrier that confuses new users.

---

## Payment Flow

**Crypto users:**
1. Connect wallet
2. Approve USDC spending (one-time)
3. Contribute to loan
4. Done

**Non-crypto users:**
1. Click "Contribute with Card"
2. Enter card details
3. USDC purchased and sent to loan
4. Done

All contributions convert to USDC on Base L2 before reaching the loan contract.

---

## Fees Summary

| Method | Fee | Who Pays |
|--------|-----|----------|
| **Direct USDC** | ~$0.02 | Contributor (gas) |
| **Coinbase Pay** | ~2.5% | Contributor |
| **Privy Onramp** | ~3-4% | Contributor |
| **Gasless (first time)** | $0 | LendFriend sponsors |

**LendFriend takes no platform fees.** All fees go to payment processors and network costs.

---

## Security

**Direct USDC:**
- Non-custodial (you control keys)
- Transparent on-chain

**Coinbase Pay:**
- USDC sent directly to loan contract
- No intermediate custody by LendFriend

**Privy Embedded Wallets:**
- Non-custodial (you can export anytime)
- Encrypted shards held by Privy
- Export seed phrase after you're comfortable

---

## Why Base L2?

All payments settle on Base L2 (Ethereum Layer 2):

- **$0.01 gas fees** (vs $50+ on Ethereum mainnet)
- **2-second confirmations** (feels instant)
- **Ethereum security** (inherits mainnet security)
- **Native USDC** (no bridging needed)

---

**Next:** [Technical Stack](technical-stack.md) · [Smart Contract Flow](smart-contract-flow.md)
