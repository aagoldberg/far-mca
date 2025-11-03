# Phase 0: Prove Trust Works

![Status](https://img.shields.io/badge/Status-Live%20on%20Testnet-success) ![Timeline](https://img.shields.io/badge/Timeline-2024--2025-blue) ![Network](https://img.shields.io/badge/Network-Base%20Sepolia-purple)

---

{% hint style="info" %}
**📚 TL;DR**
- **What:** Zero-interest loans ($100-$5K) backed purely by social trust
- **How:** Adamic-Adar algorithm weights rare friends > influencers
- **Where:** Farcaster mini apps + web (Base Sepolia testnet)
- **Goal:** Prove 90%+ repayment rate with no collateral, no credit checks
- **Status:** Live on testnet, launching mainnet 2025
{% endhint %}

{% hint style="success" %}
**🎯 Quick Navigation**
- [The Core Thesis](#the-core-thesis)
- [Social Trust Scoring](#social-trust-scoring)
- [Technical Implementation](#technical-implementation)
- [What We're Learning](#what-were-learning)
- [Success Metrics](#success-metrics)
{% endhint %}

---

## 🧪 The Core Thesis

> **Can uncollateralized lending work when reputation is at stake?**

Phase 0 is designed to answer this question with zero-interest loans backed purely by social signals. No credit checks. No collateral. Just trust, quantified through your network.

{% hint style="warning" %}
**Why Start Here**

Before building complex cashflow integrations or automated repayment systems, we need to prove the fundamental primitive works: **people will repay loans when their reputation matters.**
{% endhint %}

---

## 🏗️ What We're Building

### Zero-Interest Microloans

| Feature | Details |
|---------|---------|
| **Loan sizes** | $100 - $5,000 |
| **Interest** | 0% (altruistic phase) |
| **Repayment** | Flexible timing, single maturity date |
| **Platform** | Farcaster mini apps + web interface |

**📋 How it works:**
1. 💸 **Borrow** from your network by sharing a loan request
2. 🤝 **Get funded** by friends and community members who trust you
3. ✅ **Repay** on your own schedule before maturity
4. ⭐ **Build reputation** through timely repayment and optional tipping

<details>
<summary><strong>🔧 Smart Contract Details</strong></summary>

**MicroLoan.sol** (Single-maturity model):
- Crowdfunding phase until fully funded
- Disburse to borrower when goal reached
- Flexible repayment (any amount, anytime)
- Accumulator-based distribution for gas efficiency
- On-chain default recording if unpaid at maturity

**Factory Pattern:**
- Creates individual loan contracts per request
- Enforces policy bounds (min principal, duration limits)
- Prevents multiple active loans per borrower
- Pausable emergency controls
</details>

---

## 🧮 Social Trust Scoring

### The Algorithm: Adamic-Adar Weighted Connections

{% hint style="success" %}
**💡 Key Insight**

We don't just count mutual friends—we weight them by rarity.

A mutual connection with 20 total friends is a **stronger signal** than someone with 20,000 followers. Rare, genuine relationships predict repayment better than social media popularity.
{% endhint %}

**📊 Research Foundation:**
Calibrated on Kiva and Grameen Bank data showing social proximity drives **10% better repayment rates**.

**Components:**
- 🤝 **Mutual connections** (0-60 points): Weighted by Adamic-Adar algorithm
- 🌐 **Network overlap** (0-30 points): Percentage of shared connections
- 👥 **Follow relationship** (0-10 points): Mutual follow > one-way follow

**Total Trust Score:** 0-100

### 📊 Risk Tiers

| Tier | Criteria | Expected Repayment |
|------|----------|-------------------|
| 🟢 **LOW** | Effective mutuals ≥9 OR social distance ≥60 | 98%+ (Kiva: 20+ friend lenders) |
| 🟡 **MEDIUM** | Effective mutuals ≥2.5 OR social distance ≥30 | 85-95% |
| 🔴 **HIGH** | Below medium thresholds | <85%, higher monitoring |

{% hint style="info" %}
**Terminology**
- **Effective mutuals** = Adamic-Adar weighted count (rare friends worth more)
- **Social distance** = 0-100 score based on network overlap and relationship strength
{% endhint %}

### 🌐 Platform-Specific Trust Signals

{% tabs %}
{% tab title="Farcaster (Primary)" %}
**Why Farcaster first:**
- ✅ Wallet-based identity (unforgeable crypto signatures)
- ✅ Neynar quality scores filter bots/spam (0-1 scale)
- ✅ Real relationships in crypto community
- ✅ Power Badge verification
- ✅ On-chain transaction history via wallet address

**Strongest trust signals available.**
{% endtab %}

{% tab title="Bluesky (Expanding)" %}
**Integration status: In progress**
- 🌐 Domain-based verification (yourname.com)
- 🔗 AT Protocol decentralized identity
- 📊 Account age, follower count, engagement scoring
- 📝 Profile completeness analysis
- 🎯 Quality tiers: High (70+), Medium (40-70), Low (<40)

**Better than Twitter, not as tight as Farcaster.**
{% endtab %}

{% tab title="Web (via Privy)" %}
**For non-crypto users:**
- 🔐 Social login (Google, email, Twitter)
- 💳 Wallet creation for on-chain transactions
- 📈 Progressive disclosure (contribute first, learn crypto later)

**Onboarding path for mainstream users.**
{% endtab %}
{% endtabs %}

---

## 🚀 Why Start with Farcaster?

{% hint style="success" %}
**Farcaster Advantages**

**🔒 Strongest Trust Signals**
- Crypto-native users understand wallets + on-chain transactions
- Neynar quality filtering removes bots and spam
- Real relationships (not follow-for-follow games)

**❄️ Solves Cold Start**
- Borrowers bring their own lenders (friends)
- Each loan introduces new lenders to platform
- Trust Scores make strangers comfortable funding

**📈 Built for Virality**
- Mini apps run inside posts (no external clicks)
- Cast Actions enable one-tap contributions
- Activity appears in feeds organically
{% endhint %}

> **Data Advantage:** Farcaster launched mini apps in January 2024 and saw massive engagement. The platform proves crypto users will use financial apps embedded in social feeds.

---

## ⚙️ Technical Implementation

### 🔗 Smart Contracts (Base Sepolia)

| Contract | Lines | Purpose |
|----------|-------|---------|
| **MicroLoan.sol** | 416 | Zero-interest, single-maturity lending |
| **MicroLoanFactory.sol** | 146 | Loan contract deployment and policy |
| **TestUSDC** | - | Sepolia testnet token with airdrop |

<details>
<summary><strong>📋 Full Contract Features</strong></summary>

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

### 🖥️ Frontend Applications

**Web App** (Next.js 15 + React 19):
- ✅ Multi-step loan creation form with validation
- ✅ Loan discovery and filtering (status, amount, progress)
- ✅ Funding flow with USDC approval
- ✅ Repayment tracking and claim interface
- ✅ Trust signals display (Farcaster, Bluesky profiles)
- ✅ Social sharing to 12+ platforms

**Farcaster Mini App:**
- ✅ Native mini app SDK integration
- ✅ Tab-based interface optimized for mobile
- ✅ Create and manage loans from Farcaster
- ✅ Fund loans without leaving the app
- ✅ Automatic Farcaster profile lookup

### 💳 Payment Infrastructure

{% tabs %}
{% tab title="Payment Methods" %}
**Current options:**
- 💳 **Coinbase Pay:** Card-to-crypto conversion with fiat onramp
- 🔐 **Privy:** Wallet funding + social login
- 💰 **Direct wallet:** Connect wallet and send USDC
- ⚡ **Gasless approvals:** ERC-4337 smart account abstraction via Pimlico
{% endtab %}

{% tab title="Why Gasless?" %}
{% hint style="success" %}
**Why Gasless Matters**

New users can fund loans without holding ETH for gas. This reduces friction significantly and enables true one-click contributions.

Powered by Pimlico (ERC-4337 bundler).
{% endhint %}
{% endtab %}
{% endtabs %}

### 📊 Data & Indexing

**The Graph subgraph:**
- Indexes all loan events (created, funded, repaid, defaulted)
- Enables fast queries without scanning blockchain
- Powers loan discovery and status updates

**IPFS storage:**
- Loan metadata (title, description, photos)
- Borrower information and budget breakdown
- Immutable, decentralized storage

---

## 📖 What We're Learning

{% hint style="info" %}
**This phase is data gathering, not just product validation.**
{% endhint %}

### 📊 Behavioral Patterns
- How quickly do loans get funded?
- What Trust Score threshold predicts timely repayment?
- Do borrowers tip beyond principal? (Signal of gratitude/reliability)
- How does social proximity affect funding speed?

### 🌐 Network Topology
- Which community clusters fund each other?
- Do strangers fund loans outside their network?
- What trust cascades look like (close friends → extended network → platform users)

### 🔍 Signal Predictiveness
- Does Farcaster's quality score correlate with repayment?
- Do Power Badge holders repay more reliably?
- Does on-chain wallet history add predictive value?

### 🤝 Community Dynamics
- Will lenders browse loans or only fund friends?
- Do successful repayments create repeat borrowers/lenders?
- How viral is organic sharing?

---

## 🎯 Success Metrics

### Quantitative
- ✅ **500-1,000 users** (borrowers + lenders)
- ✅ **90%+ repayment rate** at maturity
- ✅ **3-6 months** of clean behavioral data
- ✅ **K-factor > 1** (viral growth)

### Qualitative
- ✅ Proof that reputation-backed loans work
- ✅ Community feedback on Trust Score fairness
- ✅ Understanding of default triggers (life events, bad actors, miscalculation)
- ✅ Validation that social accountability matters

{% hint style="success" %}
**🎖️ Key Milestone**

If we demonstrate **90%+ repayment** with zero interest and zero collateral, we've proven the primitive works. That unlocks Phase 1 (cashflow + interest).
{% endhint %}

---

## ⚠️ Current Limitations (By Design)

{% hint style="warning" %}
**Phase 0 Constraints**

**No interest** → Altruistic phase, testing trust alone
**No installments** → Single maturity keeps contracts simple
**No cashflow verification** → Pure social trust
**No automated repayment** → Tests if social pressure drives action
**Single platform focus** → Farcaster first (highest signal quality)

These limitations are intentional. We're testing the core primitive before adding complexity.
{% endhint %}

---

## 🚀 What's Next

{% hint style="success" %}
**When Phase 0 Succeeds** (90%+ repayment, 500+ users)

→ [Phase 1: Scale with Cashflow](phase-1-cashflow.md)
- 📊 Add cashflow verification (Plaid, Square, Shopify)
- 💰 Enable larger loan amounts ($5K-$50K+)
- 🏊 Introduce liquidity pools for passive lenders
- 📈 Interest-based lending for sustainability

**Why this sequence matters:** Social trust works for small loans among tight communities. To scale beyond personal networks, we need objective cashflow data. Phase 0 gathers the behavioral data to build that hybrid model.
{% endhint %}

---

## 📚 Related Pages

- [Vision](../vision.md) - The future we're building
- [Motivation](../motivation.md) - Why uncollateralized lending matters
- [Social Trust Scoring](../how-it-works/social-trust-scoring/README.md) - Algorithm details
- [Farcaster Virality](../how-it-works/virality-and-growth/farcaster-virality.md) - Platform integration
