# LendFriend Technical Documentation

> Uncollateralized P2P lending using social trust as collateral. This documentation explains the protocol architecture, trust scoring algorithm, and research foundation.

---

## Overview

LendFriend enables uncollateralized lending by replacing traditional credit scores with **verifiable social relationships**. Borrowers request loans on-chain, friends contribute by vouching with both capital and reputation, and trust scores calculate the strength of social connections between lenders and borrowers using the Adamic-Adar algorithm.

**Core mechanism:** When mutual friends with small, selective networks vouch for a borrower, it signals stronger accountability than endorsements from users with large, diffuse networks. This weighted social proximity predicts repayment behavior.

**Built on proven models:** Grameen Bank (97-98% repayment), Kiva (96.3%), and Akhuwat (99.9%) demonstrate that social collateral works at scale. We're adapting these principles for decentralized social networks.

---

## Key Innovations

**1. Algorithmic Social Trust**

We use Adamic-Adar Index to weight mutual connections inversely by network size. A mutual friend with 20 connections carries more predictive weight than one with 20,000. Research shows this approach improves default prediction by 82% over simple friend counting [[7]](references.md#adamic-and-adar-2003).

→ [Algorithm Details](how-it-works/social-trust-scoring/the-algorithm.md)

**2. On-Chain Reputation**

All loan activity records permanently on Base L2. Borrowers build verifiable credit history visible across DeFi. Defaults are transparent but allow redemption through smaller future loans.

→ [Smart Contract Flow](how-it-works/smart-contract-flow.md)

**3. Farcaster-Native Identity**

Decentralized social protocol provides cryptographic proof of relationships. Quality scores filter bots. No KYC required—your verifiable social graph is your identity.

→ [Borrower Profiles](how-it-works/borrower-profiles.md)

**4. Zero Cost Infrastructure**

Base L2 ($0.01 transactions), USDC stablecoin (no volatility), factory pattern smart contracts. Eliminates 15-30% overhead of traditional fintech lending.

→ [Technical Stack](how-it-works/technical-stack.md)

---

## Architecture

```
Borrower Request → Farcaster Broadcast → Friend Contributions
                                              ↓
                                    Trust Score Calculation
                                    (Adamic-Adar + Quality)
                                              ↓
                                    Lender Decision → On-Chain Funding
                                              ↓
                                    Loan Disbursed (USDC, Base L2)
                                              ↓
                                    Repayment → Pro-Rata Distribution
```

**Key components:**
- **Off-chain:** Trust score API (Neynar + Redis), metadata storage (IPFS)
- **On-chain:** Factory contract, individual loan contracts, USDC settlement
- **Data layer:** The Graph indexing, permanent repayment history

→ [Complete Architecture](how-it-works/technical-stack.md)

---

## Research Foundation

This protocol synthesizes 30+ years of microfinance research with modern network science and blockchain infrastructure.

**Microfinance Evidence:**
- Grameen Bank: 97-98% repayment, 9.6M borrowers [[22]](references.md#grameen-bank)
- Kiva: 96.3% repayment, $1.8B+ disbursed [[24]](references.md#kiva)
- Akhuwat: 99.9% repayment, interest-free model [[26]](references.md)

**Network Science:**
- Adamic-Adar Index: 82% improvement over simple counting [[2]](references.md#adamic-and-adar-2003)
- Social proximity reduces defaults by 13% [[19]](references.md#karlan-et-al-2009)
- Friend endorsements lower default rates by 22% [[12]](references.md#iyer-et-al-2016)

**P2P Lending Studies:**
- Soft information improves prediction by 45% [[12]](references.md#iyer-et-al-2016)
- Network centrality predicts repayment [[6]](references.md#chen-et-al-2022)
- Repeated interaction matters more than closeness [[5]](references.md#banking-on-cooperation-2023)

→ [Full Research Bibliography](references.md) (45+ citations)

---

## Three-Phase Evolution

**Phase 0: Bootstrap Trust (Current)**
- 0% interest loans to gather clean behavioral data
- $100-$5,000 loans, 30-90 day terms
- Farcaster-native MVP
- Goal: Prove social trust predicts repayment in our model

**Phase 1: Scale with Cashflow**
- Market-rate interest (8-12%)
- Integrate payment data (Stripe, Square, Plaid)
- Multi-platform expansion (Bluesky, Twitter)
- Introduce passive liquidity pools

**Phase 2: Automate Everything**
- AI underwriting (payment data + social trust)
- Automated repayment via merchant integrations
- Open protocol for developers
- Reputation-backed credit becomes DeFi primitive

→ [Vision & Roadmap](vision.md)

---

## Technical Deep Dives

**Core Protocol:**
- [Social Trust Scoring](how-it-works/social-trust-scoring/README.md) - Adamic-Adar implementation
- [Risk Scoring](how-it-works/risk-scoring/README.md) - A-HR grading system
- [Smart Contract Flow](how-it-works/smart-contract-flow.md) - Factory pattern, pro-rata claims
- [Risk & Default Handling](how-it-works/risk-and-defaults.md) - What happens when loans fail

**Infrastructure:**
- [Technical Stack](how-it-works/technical-stack.md) - Base L2, USDC, The Graph, IPFS
- [Payment Methods](how-it-works/payment-methods.md) - Account abstraction, gasless transactions
- [Farcaster Mini App](how-it-works/farcaster-miniapp.md) - Native in-feed lending

**Context:**
- [Economic Context](economic-context.md) - Why now? Credit crisis, gig economy, stablecoins
- [Web3 Cost Advantage](cheaper-lending.md) - How we eliminate 15-30% overhead
- [Virality & Growth](how-it-works/virality-and-growth/README.md) - Network effects and viral mechanics

---

## Open Questions

**We're actively researching:**

1. **Optimal trust thresholds** - Current score ranges (0-100, LOW/MEDIUM/HIGH risk) are initial parameters. We'll refine with repayment data.

2. **Hybrid scoring models** - Could eigenvector centrality (network influence) supplement Adamic-Adar's focus on close ties?

3. **Cross-platform trust** - How do trust scores transfer between Farcaster, Bluesky, and Twitter?

4. **Default contagion** - Can social pressure accelerate defaults during crises? How do we mitigate?

5. **Collections mechanisms** - Starting with pure social accountability. Will we need additional enforcement?

Phase 0 gathers data to answer these questions empirically.

---

## Status & Access

**Current:** Testnet deployment on Base Sepolia
**Launch:** Phase 0 mainnet Q2 2025

**Code:** [github.com/aagoldberg/far-mca](https://github.com/aagoldberg/far-mca) (MIT License)
**App:** [lendfriend.org](https://lendfriend.org)
**Farcaster:** [@lendfriend](https://warpcast.com/lendfriend)

---

## Documentation Structure

This documentation is organized for technical readers:

1. **How It Works** - Protocol mechanics and algorithms
2. **Vision & Roadmap** - Three-phase evolution
3. **Economic Context** - Market opportunity and timing
4. **Research Foundation** - 45+ academic citations
5. **FAQ** - Common technical questions

{% hint style="info" %}
**Note:** This is a living document. Parameters, thresholds, and implementation details will be refined as we collect repayment data during Phase 0.
{% endhint %}

---

*Built by [@aagoldberg](https://warpcast.com/aagoldberg) • Last updated January 2025*
