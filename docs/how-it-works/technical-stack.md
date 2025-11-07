# Technical Stack

LendFriend is built on modern web3 infrastructure, prioritizing low costs, transparency, and ease of use.

---

## Blockchain

### Base L2 (Ethereum)

All loans live on [Base](https://base.org) - an Ethereum Layer 2 blockchain backed by Coinbase.

**Why Base?**
- **$0.01 transactions** - Lending $100 costs a penny, not $50
- **2-second confirmations** - Fast enough to feel instant
- **Ethereum security** - Inherits Ethereum's battle-tested security
- **Growing ecosystem** - 20M+ active addresses, USDC native support

**Network details:**
- Mainnet: Chain ID 8453
- Explorer: [basescan.org](https://basescan.org)

---

### Smart Contracts

**Factory pattern:** One factory deploys individual loan contracts.

**MicroLoanFactory** - Creates and tracks loans
- Enforces constraints (min $100, max 365 days)
- One active loan per borrower
- Tracks all loans on-chain

**MicroLoan** (per loan) - Handles the money
- Accepts USDC contributions from lenders
- Disburses when fully funded
- Tracks repayments
- Enables pro-rata claims

**Security:**
- OpenZeppelin standards (battle-tested code)
- Reentrancy protection
- Gas optimized for low fees
- Open source and auditable

---

### Currency: USDC

**Contract:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

**Why USDC?**
- Dollar-pegged (no crypto volatility)
- Trusted issuer (Circle)
- Easy on/off ramps (Coinbase, exchanges)
- Native Base support

---

## Identity & Social Data

### Farcaster Protocol

Farcaster provides the social layer - verifiable identities and connections.

**What it gives us:**
- Decentralized social network (150k+ users)
- On-chain identities that can't be faked
- Cryptographic proof of connections
- Spam/bot filtering (quality scores)

**Why Farcaster?**
- Verifiable social graphs (can't game with fake followers)
- Quality scores filter bots
- Decentralized (no platform risk)
- Growing community of early adopters

**Data via Neynar API:**
- Follower/following relationships
- User profiles and quality scores
- Connection strength metrics

---

## Data Layer

### The Graph (Blockchain Indexing)

Reading blockchain data directly is slow and expensive. [The Graph](https://thegraph.com) indexes all loan events in real-time for instant queries.

**What we index:**
- All loans (amount, status, maturity date)
- All contributions (who funded what)
- All repayments (timing, amounts)
- Complete repayment history per borrower

This creates a **permanent, queryable credit history** visible to all future lenders.

---

### IPFS (Metadata Storage)

[IPFS](https://ipfs.tech) stores loan details too expensive to put on-chain (images, descriptions, budget breakdowns).

**Why IPFS?**
- Decentralized (no single point of failure)
- Immutable (can't edit loan terms after creation)
- Permanent (content addressed storage)
- Cost-effective

Each loan has an IPFS link stored on-chain. Once uploaded, metadata **cannot be changed** - ensuring transparency and preventing fraud.

---

## Frontend

**Built with:**
- Next.js 14 (modern React framework)
- Privy (embedded wallets + social login)
- Wagmi/Viem (Ethereum interactions)
- Tailwind CSS (clean, responsive design)

**Supports:**
- MetaMask, Coinbase Wallet, WalletConnect
- Email/SMS embedded wallets (no crypto needed)
- Mobile passkeys

---

## Trust Score Calculation

Social trust scores are computed off-chain using the [Adamic-Adar algorithm](social-trust-scoring/the-algorithm.md).

**Performance:**
- Calculation: <100ms
- Cached for 30 minutes (Redis)
- 60-80% cache hit rate

Keeps the UI fast while minimizing API costs.

---

## Infrastructure

**Hosting:**
- Vercel (frontend)
- Redis Cloud (caching)
- Neynar API (Farcaster data)
- Pinata (IPFS pinning)

**Cost:** $20-70/month for MVP

---

## Security

**Smart contracts:**
- OpenZeppelin standards
- Reentrancy guards
- Access control
- Input validation

**API:**
- Rate limiting
- Server-side API keys
- Input validation

**Audits:**
- Internal review complete
- External audit planned (Q2 2025)

**Bug bounty:** Up to $10,000 for critical vulnerabilities
📧 security@lendfriend.org

---

## Open Source

All code is MIT licensed:
- [github.com/aagoldberg/far-mca](https://github.com/aagoldberg/far-mca)

---

**Next:** [Smart Contract Flow](smart-contract-flow.md) · [Risk & Default Handling](risk-and-defaults.md)
