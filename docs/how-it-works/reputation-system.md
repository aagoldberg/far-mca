# Reputation System

## Current Status

Reputation tracking is **partially implemented**. All repayment behavior is recorded on-chain, but we're still gathering data to build a robust reputation scoring algorithm.

Here's what's tracked now and planned for the future.

## Trust Score vs Reputation

| Aspect | Trust Score | Reputation |
|--------|-------------|------------|
| **Focus** | Current social validation | Historical creditworthiness |
| **Based on** | Mutual connections with lenders | Past repayment behavior |
| **Scope** | Per loan | Across all loans |
| **Status** | ✅ Implemented | 🚧 Planned |

### Trust Score (Implemented)
Measures current social validation. Based on mutual connections between you and your lenders. Calculated for each new loan.

### Reputation (Future)
Measures historical creditworthiness. Based on past repayment behavior, timeliness, and track record. Persists across all loans.

## What's On-Chain Now

Each loan contract permanently stores:

| Variable | Description |
|----------|-------------|
| **P** | Principal requested |
| **R_total** | Total raised |
| **R_paid** | Total repaid |
| **T_maturity** | Maturity timestamp |
| **C_i** | Each lender's contribution |
| **D_i** | Each lender's claims |

**Factory constraint**: One active loan per borrower at a time

## Planned Reputation Formula

Once we have sufficient repayment data (target: **100+ loans**), reputation will be calculated as a weighted score:

```
Rep = w₁·Ratio + w₂·Time + w₃·Count + w₄·Trust + w₅·Volume
```

### Components

**Ratio** (40% weight)
```
Ratio = Σ(R_paid) / Σ(R_total) across all loans
```
*Total amount repaid divided by total amount borrowed*

**Time** (30% weight)
```
Time = avg(T_repay − T_maturity) normalized to [-1, 1]
```
*Average repayment timing: early = positive, late = negative*

**Count** (15% weight)
```
Count = log(N_loans + 1)
```
*Number of successfully completed loans (logarithmic to prevent gaming)*

**Trust** (10% weight)
```
Trust = avg(P_network) across all loans
```
*Average social validation across all your loans*

**Volume** (5% weight)
```
Volume = log(Σ(P) + 1)
```
*Total principal borrowed (logarithmic)*

### Proposed Weights

| Component | Weight | Rationale |
|-----------|--------|-----------|
| **Repayment Ratio** | 40% | Most important: did you pay back? |
| **Timing** | 30% | Second most: did you pay on time? |
| **Count** | 15% | Track record matters |
| **Trust** | 10% | Social validation adds context |
| **Volume** | 5% | Size matters less than behavior |

*Subject to tuning based on actual data*

## What Reputation Unlocks

### Phase 1 (Current: 0-100 loans)
- ✅ Transparent repayment history
- ✅ Social accountability
- ✅ Build track record

### Phase 2 (100-1000 loans)
- 🔮 Dynamic loan limits based on Rep score
- 🔮 Risk-adjusted interest rates (low Rep = higher rates)
- 🔮 Optional lender insurance pools
- 🔮 Faster funding for high-Rep borrowers

### Phase 3 (1000+ loans)
- 🔮 Traditional credit bureau reporting
- 🔮 Cross-platform reputation (use in other DeFi protocols)
- 🔮 Borrower tiers with special benefits
- 🔮 Institutional lending at market rates

## Reputation Evolution

The system is designed to **evolve with data**:

1. **Bootstrap (0-100 loans)**: Pure social validation, 0% interest
2. **Calibration (100-1000 loans)**: Tune weights, introduce reputation scores
3. **Market Rates (1000+ loans)**: Full risk-based pricing, cross-platform reputation

This evolution strategy is detailed in our [Research](../research.md) documentation.

## On-Chain Reputation NFT (Future)

We're exploring issuing **Reputation NFTs** that:
- Encode your complete loan history
- Update automatically with each loan
- Can be used across DeFi protocols
- Remain yours even if LendFriend shuts down

**Privacy consideration**: Reputation NFTs would be opt-in. Some users may prefer privacy over portability.

## Borrower Reputation Dashboard (Planned)

Future UI features:
- Visual reputation score with breakdown
- Historical loan timeline
- Repayment pattern analysis
- Comparison to network average
- Projection: "If you repay on time, your score will increase by X"

## Lender Filtering (Planned)

Lenders will be able to filter loans by:
- Minimum reputation score
- Maximum risk tier
- Social proximity threshold
- Historical default rate

This creates natural market segmentation: high-trust lenders fund risky borrowers, conservative lenders fund only proven borrowers.

---

**Next**: Learn about [Risk & Default Handling](risk-and-defaults.md)
