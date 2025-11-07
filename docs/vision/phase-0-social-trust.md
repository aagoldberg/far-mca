# Phase 0: Prove Trust Works

**Status:** Live on Base Sepolia Testnet
**Timeline:** 2024-2025
**Network:** Base Sepolia (Chain ID: 84532)

---

{% hint style="info" %}
**For High-Level Overview**

This page contains Phase 0 deployment status and technical specifications.

For vision, goals, and roadmap → [lendfriend.org/vision](https://lendfriend.org/vision)
{% endhint %}

---

## Overview

Phase 0 tests zero-interest microloans ($100-$5K) backed by social trust signals from Farcaster.

**Core hypothesis:** Reputation-based lending can achieve 85%+ repayment without collateral or interest.

**Goal:** 500-1,000 users demonstrating 85%+ repayment rate to prove social accountability can replace collateral.

→ [Why uncollateralized lending matters](../motivation.md)

---

## System Architecture

Phase 0 implements the core LendFriend protocol on Base L2 with Farcaster identity integration.

→ [Complete technical stack](../how-it-works/technical-stack.md) | [System overview](../how-it-works/overview.md)

**Key components:**
- **Frontend:** Next.js 15 web app + Farcaster Mini App
- **Identity:** Farcaster (via Neynar API) + Privy wallet auth
- **Blockchain:** Base L2 with MicroLoan smart contracts
- **Data:** The Graph subgraph + IPFS metadata storage

---

## Smart Contracts

### Deployed Contracts (Base Sepolia)

| Contract | Address | Purpose |
|----------|---------|---------|
| **MicroLoanFactory** | `0x747988...bFff` | Loan contract deployment and policy |
| **MicroLoan** (template) | Individual contracts | Zero-interest, single-maturity lending |
| **TestUSDC** | `0x2d04a1...aaFe` | Sepolia testnet token with faucet |

**Mainnet deployment:** Planned for Q1 2025 after testnet validation

→ [Smart contract flow and lifecycle](../how-it-works/smart-contract-flow.md)

---

## Social Trust Scoring

Phase 0 uses social trust as the primary underwriting signal. Trust scores are calculated off-chain using Farcaster social graph data.

**Algorithm:** Adamic-Adar weighted mutual connections

→ [Trust scoring algorithm](../how-it-works/social-trust-scoring/the-algorithm.md) | [Implementation details](../how-it-works/social-trust-scoring/implementation.md) | [Sybil resistance](../how-it-works/social-trust-scoring/sybil-resistance.md)

**Data sources:**
- Mutual connections between borrower and lenders
- Farcaster Power Badge status
- Neynar quality scores
- Account age and activity

→ [Complete social trust scoring documentation](../how-it-works/social-trust-scoring/README.md)

---

## Risk Assessment

Risk scoring in Phase 0 is simplified to focus on social signals:

- **60%** Social Trust Score
- **30%** Repayment History (from past loans)
- **10%** Loan Size Risk

→ [Risk scoring methodology](../how-it-works/risk-scoring/README.md) | [Risk calculation](../how-it-works/risk-scoring/calculation.md) | [Risk grades and tiers](../how-it-works/risk-scoring/risk-grades.md)

---

## User Experience

### Loan Lifecycle (Visual)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. CREATE              2. SHARE              3. FUND           │
│  ────────               ────────              ────────          │
│  👤 Borrower            🔗 Viral              💰 Lenders        │
│  Connect Farcaster      Share on socials     Contribute USDC   │
│  Request $2,000         Trust score visible   See trust score  │
│  30-day term            12+ platforms         Direct P2P        │
│  0% interest            ↓                     ↓                 │
│  ↓                      Friends see loan      $2,000 funded    │
│                                                                 │
│  4. RECEIVE             5. REPAY              6. COMPLETE       │
│  ────────               ────────              ────────          │
│  ✅ Funds released      📅 Before maturity    ⭐ Build rep     │
│  Smart contract         Manual payment        On-chain history │
│  Auto to wallet         Grace period: 7 days  Future loans     │
│                         or → DEFAULT 🚫       Trust increases  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### For Borrowers

- Create loan with Farcaster identity
- Share loan link across social platforms (12+ platforms)
- Receive funds automatically when fully funded
- Repay before maturity date (7-day grace period)

→ [Borrower profiles and identity](../how-it-works/borrower-profiles.md)

### For Lenders

- Discover loans through social connections
- See trust score before contributing
- Earn 0% interest (Phase 0), building reputation for future phases
- Track repayment on-chain

→ [Virality and growth mechanics](../how-it-works/virality-and-growth/README.md) | [Farcaster virality](../how-it-works/virality-and-growth/farcaster-virality.md)

---

## Default Handling

Phase 0 tracks defaults on-chain but does not enforce liquidation (no collateral).

**Default definition:** Loan unpaid at maturity date + 7 day grace period

**Consequences:**
- On-chain default record (permanent reputation damage)
- Ineligible for future loans
- Social accountability via Farcaster network

→ [Risk and default handling](../how-it-works/risk-and-defaults.md) | [Lender warnings](../how-it-works/risk-scoring/lender-warnings.md)

---

## Phase 0 Technical Constraints

These constraints are intentional design decisions:

| Constraint | Rationale |
|-----------|-----------|
| **Zero interest** | Simplifies contracts, tests pure social accountability |
| **Single maturity** | No installment logic, simpler state management |
| **Farcaster only** | Highest quality trust signals, smaller attack surface |
| **No cashflow verification** | Focus on social trust primitive first |
| **Manual repayment** | Tests if reputation incentive is sufficient |

→ Phase 1 will add cashflow verification, interest rates, and liquidity pools

---

## Data Collection

Phase 0 is designed for behavioral data gathering to validate the social trust hypothesis.

**On-chain data:**
- Loan creation, contributions, repayments, defaults
- Timing patterns and amounts

**Off-chain data:**
- Trust scores at loan creation
- Social graph snapshots
- User acquisition sources
- Viral sharing metrics

**Purpose:** Analyze correlation between social trust scores and repayment behavior to refine risk model for Phase 1.

---

## Prerequisites for Phase 1

Before moving to Phase 1 (cashflow-based lending):

- ✅ 100+ completed loans
- ✅ 3-6 months of repayment data
- ✅ Validated trust score correlation with repayment
- ✅ Proven 85%+ repayment rate
- ✅ Mainnet deployment successful

---

## Next Phase

→ [Phase 1: Scale with Cashflow](phase-1-cashflow.md)

**New capabilities:**
- Cashflow verification (Plaid, Square, Shopify)
- Liquidity pools for passive lending
- Interest rates (0-8% APR)
- Hybrid risk scoring (social + financial)

---

## Related Documentation

**Complete technical documentation:**
- [How It Works - Overview](../how-it-works/overview.md)
- [Smart Contract Flow](../how-it-works/smart-contract-flow.md)
- [Technical Stack](../how-it-works/technical-stack.md)
- [Social Trust Scoring](../how-it-works/social-trust-scoring/README.md)
- [Risk Scoring](../how-it-works/risk-scoring/README.md)

**Research and context:**
- [Research Foundation](../references.md) — 80+ citations and peer-reviewed papers
- [Motivation](../motivation.md) — Why this matters
- [Whitepaper](https://lendfriend.org/whitepaper) — Complete manifesto
