# Phase 0: Prove Trust Works

**Timeline:** Testnet Now → Mainnet 2025
**Status:** Live on Base Sepolia testnet

---

## The Core Thesis

Can uncollateralized lending work when reputation is at stake?

Phase 0 is designed to answer this question with zero-interest loans backed purely by social signals. No credit checks. No collateral. Just trust, quantified through your network.

**Why start here:** Before building complex cashflow integrations or automated repayment systems, we need to prove the fundamental primitive works: people will repay loans when their reputation matters.

---

## What We're Building

### Zero-Interest Microloans

**Loan sizes:** $100 - $5,000
**Interest:** 0% (altruistic phase)
**Repayment:** Flexible timing, single maturity date
**Platform:** Farcaster mini apps + web interface

**How it works:**
1. **Borrow** from your network by sharing a loan request
2. **Get funded** by friends and community members who trust you
3. **Repay** on your own schedule before maturity
4. **Build reputation** through timely repayment and optional tipping

**Smart contract:** Single-maturity model (MicroLoan.sol)
- Crowdfunding phase until fully funded
- Disburse to borrower when goal reached
- Flexible repayment (any amount, anytime)
- Accumulator-based distribution for gas efficiency
- On-chain default recording if unpaid at maturity

---

## Social Trust Scoring

### The Algorithm: Adamic-Adar Weighted Connections

We don't just count mutual friends—we weight them by rarity.

**Why this matters:** A mutual connection who has 20 total friends is a stronger signal than someone with 20,000 followers. The algorithm recognizes that rare, genuine relationships predict repayment better than social media popularity.

**Research foundation:** Calibrated on Kiva and Grameen Bank data showing social proximity drives 10% better repayment rates.

**Components:**
- **Mutual connections** (0-60 points): Weighted by Adamic-Adar algorithm
- **Network overlap** (0-30 points): Percentage of shared connections
- **Follow relationship** (0-10 points): Mutual follow > one-way follow

**Total Trust Score:** 0-100

### Risk Tiers

| Tier | Criteria | Expected Behavior |
|------|----------|-------------------|
| **LOW** | Effective mutuals ≥9 OR social distance ≥60 | 98%+ repayment (Kiva data: 20+ friend lenders) |
| **MEDIUM** | Effective mutuals ≥2.5 OR social distance ≥30 | 85-95% repayment |
| **HIGH** | Below medium thresholds | <85% repayment, higher monitoring |

**Effective mutuals** = Adamic-Adar weighted count (rare friends worth more)
**Social distance** = 0-100 score based on network overlap and relationship strength

### Platform-Specific Trust Signals

**Farcaster (Primary Platform):**
- Wallet-based identity (crypto signatures, unforgeable)
- Neynar quality scores filter bots/spam (0-1 scale)
- Real relationships in crypto community
- Power Badge verification
- On-chain transaction history via wallet address

**Bluesky (Expanding):**
- Domain-based verification (yourname.com)
- AT Protocol decentralized identity
- Account age, follower count, engagement rate scoring
- Profile completeness analysis
- Quality tiers: High (70+), Medium (40-70), Low (<40)

**Web users (via Privy):**
- Social login (Google, email, Twitter)
- Wallet creation for on-chain transactions
- Progressive disclosure (contribute first, learn crypto later)

---

## Why Start with Farcaster?

**Strongest trust signals:**
- Crypto-native users already understand wallets and on-chain transactions
- Quality filtering removes bots and spam via Neynar
- Real relationships (not follow-for-follow games like Twitter)
- Open social graph API enables instant Trust Score calculation

**Solves cold start:**
- Borrowers bring their own lenders (friends)
- Each loan introduces new lenders to the platform
- Trust Scores make strangers comfortable funding

**Built for virality:**
- Mini apps run inside posts (no external clicks)
- Cast Actions enable one-tap contributions
- Activity appears in feeds organically

**Data advantage:** Farcaster launched mini apps in January 2024 and saw massive engagement. The platform proves crypto users will use financial apps embedded in social feeds.

---

## Technical Implementation

### Smart Contracts (Base Sepolia)

**MicroLoan.sol** (416 lines):
- Zero-interest, single-maturity lending
- Flexible repayment (any amount, anytime before/after maturity)
- Accumulator-based distribution (gas-efficient lender claims)
- IPFS metadata for borrower communication
- On-chain default handling (no grace period in v1)
- Overpayment distribution to lenders as bonus
- Refund mechanism if fundraising fails

**MicroLoanFactory.sol** (146 lines):
- Creates individual loan contracts per request
- Enforces policy bounds (min principal, duration limits)
- Prevents multiple active loans per borrower
- Pausable emergency controls
- On-chain loan registry

**TestUSDC:** For Base Sepolia testing with airdrop functionality

### Frontend Applications

**Web App (Next.js 15 + React 19):**
- Multi-step loan creation form with validation
- Loan discovery and filtering (status, amount, progress)
- Funding flow with USDC approval
- Repayment tracking and claim interface
- Trust signals display (Farcaster, Bluesky profiles)
- Social sharing to 12+ platforms

**Farcaster Mini App:**
- Native mini app SDK integration
- Tab-based interface optimized for mobile
- Create and manage loans from Farcaster
- Fund loans without leaving the app
- Automatic Farcaster profile lookup

### Payment Infrastructure

**Current options:**
- **Coinbase Pay:** Card-to-crypto conversion with fiat onramp
- **Privy:** Wallet funding + social login
- **Direct wallet:** Connect wallet and send USDC
- **Gasless approvals:** ERC-4337 smart account abstraction via Pimlico

**Why gasless matters:** New users can fund loans without holding ETH for gas. Reduces friction significantly.

### Data & Indexing

**The Graph subgraph:**
- Indexes all loan events (created, funded, repaid, defaulted)
- Enables fast queries without scanning blockchain
- Powers loan discovery and status updates

**IPFS storage:**
- Loan metadata (title, description, photos)
- Borrower information and budget breakdown
- Immutable, decentralized storage

---

## What We're Learning

This phase is data gathering, not just product validation.

**Behavioral patterns:**
- How quickly do loans get funded?
- What Trust Score threshold predicts timely repayment?
- Do borrowers tip beyond principal? (Signal of gratitude/reliability)
- How does social proximity affect funding speed?

**Network topology:**
- Which community clusters fund each other?
- Do strangers fund loans outside their network?
- What trust cascades look like (close friends → extended network → platform users)

**Signal predictiveness:**
- Does Farcaster's quality score correlate with repayment?
- Do Power Badge holders repay more reliably?
- Does on-chain wallet history add predictive value?

**Community dynamics:**
- Will lenders browse loans or only fund friends?
- Do successful repayments create repeat borrowers/lenders?
- How viral is organic sharing?

---

## Success Metrics

**Quantitative:**
- 500-1,000 users (borrowers + lenders)
- 90%+ repayment rate at maturity
- 3-6 months of clean behavioral data
- Viral growth (K-factor > 1)

**Qualitative:**
- Proof that reputation-backed loans work
- Community feedback on Trust Score fairness
- Understanding of default triggers (life events, bad actors, miscalculation)
- Validation that social accountability matters

**Key milestone:** If we can demonstrate 90%+ repayment with zero interest and zero collateral, we've proven the primitive works. That unlocks Phase 1 (cashflow + interest).

---

## Current Limitations (By Design)

**No interest:** This phase is altruistic. We're asking lenders to fund based on trust alone, not yield.

**No installments:** Single maturity date keeps contracts simple. We're testing "will they repay?" before optimizing "how should they repay?"

**No cashflow verification:** Pure social trust. Borrowers self-report income ranges for context, but we don't verify bank accounts or business revenue yet.

**No automated repayment:** Borrowers must manually repay. This tests whether social pressure alone drives action.

**Single platform focus:** Starting with Farcaster (highest signal quality) before expanding to noisier networks.

---

## What's Next

**When Phase 0 succeeds** (90%+ repayment, 500+ users), we move to Phase 1:

→ [Phase 1: Scale with Cashflow](phase-1-cashflow.md)
- Add cashflow verification (Plaid, Square, Shopify)
- Enable larger loan amounts ($5K-$50K+)
- Introduce liquidity pools for passive lenders
- Interest-based lending for sustainability

**Why this sequence matters:** Social trust works for small loans among tight communities. To scale beyond personal networks, we need objective cashflow data. Phase 0 gathers the behavioral data to build that hybrid model.

---

## Related Pages

- [Vision](../vision.md) - The future we're building
- [Motivation](../motivation.md) - Why uncollateralized lending matters
- [Social Trust Scoring](../how-it-works/social-trust-scoring/README.md) - Algorithm details
- [Farcaster Virality](../how-it-works/virality-and-growth/farcaster-virality.md) - Platform integration
