# Social Trust Scoring

## How We Turn Relationships into Trust Scores

LendFriend enables uncollateralized lending by quantifying social trust. Your network doesn't just contribute—they signal you're trustworthy. We measure how close those connections are to generate your trust score.

---

## Overview

Traditional lending requires collateral or credit history. LendFriend uses **social collateral**—your network on Farcaster—as proof of creditworthiness. This isn't subjective vouching; it's algorithmic trust measurement backed by decades of microfinance research.

{% hint style="success" %}
📊 **Research-Backed Performance**

Microfinance institutions using social collateral achieve:
- **Grameen Bank**: 97-98% repayment rate (9.6M borrowers) [[9]](../../references.md#grameen-bank)
- **Kiva**: 96.3% repayment rate ($1.8B+ loans) [[10]](../../references.md#kiva)
- **Akhuwat**: 99.9% repayment rate (interest-free)

Social proximity improves repayment rates by **10 percentage points** [[6]](../../references.md#karlan-et-al-2009).

*Full research: [Academic Research](../../references.md)*
{% endhint %}

---

## How It Works

**The Basic Flow:**

1. **You request a loan** and share it to your Farcaster network
2. **Your connections contribute** to fund your loan—their financial backing vouches for your trustworthiness
3. **We measure relationship strength** between you and each lender using your shared connections
4. **Other lenders see the trust signals** and decide whether to contribute based on how well-connected you are

The closer your mutual connections, the stronger the trust signal. Someone with 20 selective friends carries more weight than a distant follower of an influencer with 10,000 connections.

---

### 1. [The Algorithm](the-algorithm.md)

We use the **Adamic-Adar Index** to weight connections by how selective they are, combined with quality filtering and cryptographic social proof.

→ [Learn the technical details](the-algorithm.md)

---

### 2. [Risk Tiers](risk-tiers.md)

Every lender-borrower pair gets a trust score (0-100) and risk classification:

| Risk Level | Trust Score | Meaning |
|-----------|-------------|---------|
| 🟢 **LOW RISK** | ≥60 | Close social ties, tight-knit community |
| 🟡 **MEDIUM RISK** | 30-59 | Some shared connections |
| 🔴 **HIGH RISK** | <30 | Few or no mutual connections |

Loans also get **Support Strength** ratings based on what percentage of lenders know the borrower.

→ [Understand risk classification](risk-tiers.md)

---

### 3. [Trust Cascades](trust-cascades.md)

Social trust creates natural funding progression:

1. **Core network contributes first** (high trust, small amounts)
2. **Extended network sees validation** (medium trust, joins in)
3. **Public lenders feel safe** (low connection, but validated by others)

This mirrors traditional lending—you ask family first, then friends, then institutions.

→ [Explore trust cascades](trust-cascades.md)

---

### 4. [Sybil Resistance](sybil-resistance.md)

Creating fake accounts to game the system doesn't work because:

- Quality filtering removes spam/bots
- Adamic-Adar weighting penalizes large networks
- Network overlap requires real communities
- No connections = zero trust score

→ [Learn about anti-gaming mechanisms](sybil-resistance.md)

---

### 5. [Implementation](implementation.md)

Trust scores are calculated **off-chain** using Farcaster social graph data via Neynar API:

- **Computation**: TypeScript with 30-minute cache
- **API Cost**: 4 + N calls per score (N = mutual count)
- **Display**: Shown in UI, not stored on-chain
- **Gas Optimization**: Keeps transaction costs at ~$0.01

→ [See technical implementation](implementation.md)

---

## Key Principles

{% hint style="info" %}
**Information Asymmetry Reduction**

Friends know you better than strangers. Social ties reduce information gaps and make it harder to misrepresent creditworthiness.
{% endhint %}

{% hint style="info" %}
**Social Pressure**

You care about maintaining reputation with your network. Defaulting damages relationships, not just Trust Scores.
{% endhint %}

{% hint style="info" %}
**Cryptographic Verification**

Farcaster provides unforgeable proof of social connections, solving identity verification at scale.
{% endhint %}

---

## Research-Backed Approach

LendFriend combines multiple proven techniques:

| Approach | Research Foundation |
|----------|---------------------|
| **Adamic-Adar weighting** | 82% more accurate than simple counting for predicting social network connections [[7]](../../references.md#adamic-and-adar-2003) |
| **Quality filtering** | Reduces spam/bot influence on network metrics |
| **Social collateral** | Strong social ties reduce default rates in P2P lending [[8]](../../references.md#lin-et-al-2013) [[3]](../../references.md#iyer-et-al-2016) |

This multi-layered approach leverages established network science and lending research, though LendFriend is the first to combine Adamic-Adar with on-chain lending

---

## Why Adamic-Adar Over PageRank/Centrality?

Research shows **close selective friends are more predictive of repayment than influential connections**:

**Key Findings**:
- Mobile micro-lending studies (2022): **strong ties more predictive** than weak ties for loan defaults
- Evolutionary analysis (2023): **repeated interaction matters more** than closeness or kinship
- Network centrality research (2022-2025): Degree/eigenvector centrality **does improve prediction**, but as supplementary signal

**Why we prioritize Adamic-Adar**:
- Close friends enable monitoring through repeated interaction
- Local measure (fast, O(N) complexity)
- Works with incomplete social graph data
- 0.92 AUC performance in link prediction

**Potential future enhancement**: Add PageRank/centrality as 30% supplementary signal to capture network influence effects, while keeping Adamic-Adar as 70% primary measure.

→ [View detailed algorithm comparison](../../references.md#network-algorithms-comparison-adamic-adar-vs-pagerankcentrality)

---

## Next Steps

- **Understand the math?** Start with [The Algorithm](the-algorithm.md)
- **Lender deciding whether to fund?** Check [Risk Tiers](risk-tiers.md)
- **Curious about social mechanics?** Read [Trust Cascades](trust-cascades.md)
- **Worried about gaming?** See [Sybil Resistance](sybil-resistance.md)
- **Building with LendFriend?** Review [Implementation](implementation.md)

---

{% hint style="success" %}
**Research Foundation**

Our mechanics are backed by 15+ peer-reviewed papers and institutional case studies from Grameen Bank, Kiva, and leading microfinance researchers.

[→ View complete bibliography](../../references.md)
{% endhint %}
