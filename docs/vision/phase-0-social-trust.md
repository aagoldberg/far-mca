# Phase 0: Prove Trust Works

Live on Base Sepolia Testnet • 2024-2025

---

{% hint style="info" %}
**At a Glance**

Testing zero-interest loans ($100-$5K) backed by social trust on Farcaster. Goal: Prove 90%+ repayment rate with no collateral.

**Status:** Live on testnet, launching mainnet 2025
{% endhint %}

---

## Core Thesis

Can uncollateralized lending work when reputation is at stake?

Phase 0 is designed to answer this question with zero-interest loans backed purely by social signals. No credit checks. No collateral. Just trust, quantified through your network.

{% hint style="warning" %}
Before building complex cashflow integrations or automated repayment systems, we need to prove the fundamental primitive: **people will repay loans when their reputation matters.**
{% endhint %}

---

## What We're Building

### Zero-Interest Microloans

| Feature | Details |
|---------|---------|
| **Loan sizes** | $100 - $5,000 |
| **Interest** | 0% (altruistic phase) |
| **Repayment** | Flexible timing, single maturity date |
| **Platform** | Farcaster mini apps + web interface |

**How it works:**

1. **Borrow** from your network by sharing a loan request
2. **Get funded** by friends and community members who trust you
3. **Repay** on your own schedule before maturity
4. **Build reputation** through timely repayment and optional tipping

<details>
<summary><strong>Technical Implementation</strong></summary>

**MicroLoan.sol** (Single-maturity model, 416 lines):
- Crowdfunding phase until fully funded
- Disburse to borrower when goal reached
- Flexible repayment (any amount, anytime)
- Accumulator-based distribution for gas efficiency
- On-chain default recording if unpaid at maturity

**MicroLoanFactory.sol** (146 lines):
- Creates individual loan contracts per request
- Enforces policy bounds (min principal, duration limits)
- Prevents multiple active loans per borrower
- Pausable emergency controls
- On-chain loan registry

</details>

---

## Social Trust Scoring

### The Algorithm: Adamic-Adar Weighted Connections

We don't just count mutual friends—we weight them by rarity.

{% hint style="success" %}
**Key Insight**

A mutual connection with 20 total friends is a **stronger signal** than someone with 20,000 followers. Rare, genuine relationships predict repayment better than social media popularity.
{% endhint %}

**Research Foundation:** Calibrated on Kiva and Grameen Bank data showing social proximity drives 10% better repayment rates.

**Scoring Components:**
- **Mutual connections** (0-60 points) — Weighted by Adamic-Adar algorithm
- **Network overlap** (0-30 points) — Percentage of shared connections
- **Follow relationship** (0-10 points) — Mutual follow > one-way follow

**Total Trust Score:** 0-100

### Risk Tiers

| Tier | Criteria | Expected Repayment |
|------|----------|-------------------|
| **Low Risk** | Effective mutuals ≥9 OR social distance ≥60 | 98%+ (Kiva: 20+ friend lenders) |
| **Medium Risk** | Effective mutuals ≥2.5 OR social distance ≥30 | 85-95% |
| **High Risk** | Below medium thresholds | <85%, higher monitoring |

**Definitions:**
- **Effective mutuals** = Adamic-Adar weighted count (rare friends worth more)
- **Social distance** = 0-100 score based on network overlap and relationship strength

### Platform-Specific Trust Signals

**Farcaster (Primary Platform)**

Why Farcaster first:
- Wallet-based identity (unforgeable crypto signatures)
- Neynar quality scores filter bots/spam (0-1 scale)
- Real relationships in crypto community
- Power Badge verification
- On-chain transaction history via wallet address

*Strongest trust signals available.*

**Bluesky (Expanding)**

Integration status: In progress
- Domain-based verification (yourname.com)
- AT Protocol decentralized identity
- Account age, follower count, engagement scoring
- Profile completeness analysis
- Quality tiers: High (70+), Medium (40-70), Low (<40)

*Better than Twitter, not as tight as Farcaster.*

**Web (via Privy)**

For non-crypto users:
- Social login (Google, email, Twitter)
- Wallet creation for on-chain transactions
- Progressive disclosure (contribute first, learn crypto later)

*Onboarding path for mainstream users.*

---

## Why Start with Farcaster?

**Strongest Trust Signals**
- Crypto-native users already understand wallets and on-chain transactions
- Quality filtering removes bots and spam via Neynar
- Real relationships (not follow-for-follow games like Twitter)
- Open social graph API enables instant Trust Score calculation

**Solves Cold Start**
- Borrowers bring their own lenders (friends)
- Each loan introduces new lenders to the platform
- Trust Scores make strangers comfortable funding

**Built for Virality**
- Mini apps run inside posts (no external clicks)
- Cast Actions enable one-tap contributions
- Activity appears in feeds organically

> Farcaster launched mini apps in January 2024 and saw massive engagement. The platform proves crypto users will use financial apps embedded in social feeds.

---

## Technical Implementation

### Smart Contracts (Base Sepolia)

| Contract | Lines | Purpose |
|----------|-------|---------|
| **MicroLoan.sol** | 416 | Zero-interest, single-maturity lending |
| **MicroLoanFactory.sol** | 146 | Loan contract deployment and policy |
| **TestUSDC** | - | Sepolia testnet token with airdrop |

<details>
<summary><strong>Full Contract Features</strong></summary>

**MicroLoan.sol:**
- Zero-interest, single-maturity lending
- Flexible repayment (any amount, anytime before/after maturity)
- Accumulator-based distribution (gas-efficient lender claims)
- IPFS metadata for borrower communication
- On-chain default handling (no grace period in v1)
- Overpayment distribution to lenders as bonus
- Refund mechanism if fundraising fails

**MicroLoanFactory.sol:**
- Creates individual loan contracts per request
- Enforces policy bounds (min principal, duration limits)
- Prevents multiple active loans per borrower
- Pausable emergency controls
- On-chain loan registry

</details>

### Frontend Applications

**Web App** (Next.js 15 + React 19):
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

**Current payment options:**
- **Coinbase Pay** — Card-to-crypto conversion with fiat onramp
- **Privy** — Wallet funding + social login
- **Direct wallet** — Connect wallet and send USDC
- **Gasless approvals** — ERC-4337 smart account abstraction via Pimlico

{% hint style="success" %}
**Why Gasless Matters**

New users can fund loans without holding ETH for gas. This reduces friction significantly and enables true one-click contributions.

Powered by Pimlico (ERC-4337 bundler).
{% endhint %}

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

### Behavioral Patterns
- How quickly do loans get funded?
- What Trust Score threshold predicts timely repayment?
- Do borrowers tip beyond principal? (Signal of gratitude/reliability)
- How does social proximity affect funding speed?

### Network Topology
- Which community clusters fund each other?
- Do strangers fund loans outside their network?
- What trust cascades look like (close friends → extended network → platform users)

### Signal Predictiveness
- Does Farcaster's quality score correlate with repayment?
- Do Power Badge holders repay more reliably?
- Does on-chain wallet history add predictive value?

### Community Dynamics
- Will lenders browse loans or only fund friends?
- Do successful repayments create repeat borrowers/lenders?
- How viral is organic sharing?

---

## Success Metrics

### Quantitative Goals
- 500-1,000 users (borrowers + lenders)
- 90%+ repayment rate at maturity
- 3-6 months of clean behavioral data
- Viral growth (K-factor > 1)

### Qualitative Goals
- Proof that reputation-backed loans work
- Community feedback on Trust Score fairness
- Understanding of default triggers (life events, bad actors, miscalculation)
- Validation that social accountability matters

{% hint style="success" %}
**Key Milestone**

If we demonstrate **90%+ repayment** with zero interest and zero collateral, we've proven the primitive works. That unlocks Phase 1 (cashflow + interest).
{% endhint %}

---

## Current Limitations (By Design)

{% hint style="warning" %}
**Phase 0 Constraints**

- **No interest** — Altruistic phase, testing trust alone
- **No installments** — Single maturity keeps contracts simple
- **No cashflow verification** — Pure social trust
- **No automated repayment** — Tests if social pressure drives action
- **Single platform focus** — Farcaster first (highest signal quality)

These limitations are intentional. We're testing the core primitive before adding complexity.
{% endhint %}

---

## What's Next

**When Phase 0 succeeds** (90%+ repayment, 500+ users), we move to Phase 1:

→ [Phase 1: Scale with Cashflow](phase-1-cashflow.md)

**New capabilities:**
- Add cashflow verification (Plaid, Square, Shopify)
- Enable larger loan amounts ($5K-$50K+)
- Introduce liquidity pools for passive lenders
- Interest-based lending for sustainability

**Why this sequence matters:** Social trust works for small loans among tight communities. To scale beyond personal networks, we need objective cashflow data. Phase 0 gathers the behavioral data to build that hybrid model.

---

## Related Pages

- [Vision](../vision.md) — The future we're building
- [Motivation](../motivation.md) — Why uncollateralized lending matters
- [Social Trust Scoring](../how-it-works/social-trust-scoring/README.md) — Algorithm details
- [Farcaster Virality](../how-it-works/virality-and-growth/farcaster-virality.md) — Platform integration
