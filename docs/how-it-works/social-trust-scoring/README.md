# Social Trust Scoring

## How We Turn Relationships into Credit Scores

LendFriend enables uncollateralized lending by quantifying social trust. Your network doesn't just vouch for you—we algorithmically prove your creditworthiness through measurable social proximity.

---

## Overview

Traditional lending requires collateral or credit history. LendFriend uses **social collateral**—your network on Farcaster—as proof of creditworthiness. This isn't subjective vouching; it's algorithmic trust measurement backed by decades of microfinance research.

{% hint style="success" %}
📊 **Research-Backed Performance**

Microfinance institutions using social collateral achieve:
- **Grameen Bank**: 97-98% repayment rate (9.6M borrowers)
- **Kiva**: 96.3% repayment rate ($1.8B+ loans)
- **Akhuwat**: 99.9% repayment rate (interest-free)

Social proximity improves repayment rates by **10 percentage points**.

*Source: [Academic Research](../../references.md)*
{% endhint %}

---

## How It Works

### 1. [The Algorithm](the-algorithm.md)

We calculate social distance using the **Adamic-Adar Index**, which weights mutual connections by how "selective" they are. A mutual friend with 20 connections is weighted **3× higher** than an influencer with 10,000 connections.

**Key Innovation:** First lending protocol to combine Adamic-Adar weighting with quality filtering and cryptographic social proof.

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

You care about maintaining reputation with your network. Defaulting damages relationships, not just credit scores.
{% endhint %}

{% hint style="info" %}
**Cryptographic Verification**

Farcaster provides unforgeable proof of social connections, solving identity verification at scale.
{% endhint %}

---

## Expected Performance

Based on academic research and LendFriend's hybrid approach:

| Approach | Expected Improvement |
|----------|---------------------|
| **Simple mutual counting** | Baseline |
| **+ Adamic-Adar weighting** | +15-25% accuracy |
| **+ Quality filtering** | +10-15% accuracy |
| **Combined (LendFriend)** | **+25-40% better default prediction** |

**LendFriend target**: 5-12% default rate (Phase 1)

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
