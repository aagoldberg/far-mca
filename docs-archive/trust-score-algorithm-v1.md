# Trust Score Algorithm

## Social Proximity Measurement

We calculate social distance between borrower and lender by measuring mutual connections on Farcaster.

{% hint style="success" %}
📊 **Impact of Social Connections**

- **20+ friend/family lenders**: 98% repayment rate
- **0 friend/family lenders**: 88% repayment rate
- **Result**: 10% improvement from social proximity alone

*Source: [Kiva and Grameen Bank research](../references.md)*
{% endhint %}

## The Algorithm

### Step 1: Identify Mutual Connections

```
Let B = borrower's social network (followers ∪ following)
Let L = lender's social network (followers ∪ following)
Let M = |B ∩ L| = count of mutual connections
```

### Step 2: Adamic-Adar Weighting

Instead of treating all mutual connections equally, we weight each connection by how "selective" they are. This is called the **Adamic-Adar Index**.

**Core insight:** A mutual friend with 20 connections is a much stronger signal than a mutual friend with 20,000 connections.

**Formula:**
```
For each mutual connection z:
  degree(z) = total connections of person z
  weight(z) = 1 / log(degree(z))

AA_score = Σ weight(z) for all mutual connections
```

**Example:**
```
Mutual friend with 25 connections   → weight = 1/log(25) = 0.31
Mutual friend with 10,000 connections → weight = 1/log(10,000) = 0.11
```

The friend with 25 connections is weighted **3× higher** than the influencer with 10,000 connections.

**Why logarithm?**
- Provides diminishing returns as network size grows
- 10 → 100 connections: weight drops 50%
- 100 → 1,000 connections: weight drops 33%
- 1,000 → 10,000 connections: weight drops 25%

### Step 3: Quality Adjustment

Multiply Adamic-Adar score by quality scores to filter spam/bots:

```
Q_avg = (Q_borrower + Q_lender) / 2
AA_effective = AA_score × Q_avg
```

### Step 4: Calculate Social Distance Score (0-100)

The score has three components:

#### Base Score (max 60 points)
Based on quality-weighted Adamic-Adar score:
- AA_eff ≥ 20 → 60 points (very tight-knit community)
- AA_eff ≥ 10 → 50 points (strong social ties)
- AA_eff ≥ 5 → 35 points (moderate connections)
- AA_eff ≥ 2.5 → 20 points (some shared connections)
- AA_eff ≥ 1 → 10 points (weak connection)

#### Overlap Bonus (max 30 points)
```
P_overlap = (M / min(|B|, |L|)) × 100
Bonus = min(P_overlap × 3, 30) if P_overlap > 10%
```

#### Mutual Follow Bonus (max 10 points)
- Both follow each other → +10 points
- One-way follow → +5 points

### Final Score
```
S_total = min(S_base + S_overlap + S_mutual, 100)
```

## Risk Tier Classification

| Risk Level | Criteria |
|-----------|----------|
| **LOW RISK** | M_eff ≥ 9 OR S_total ≥ 60 |
| **MEDIUM RISK** | M_eff ≥ 2.5 OR S_total ≥ 30 |
| **HIGH RISK** | M_eff < 2.5 AND S_total < 30 |

## Loan-Level Support Strength

For the entire loan, we aggregate proximity across all lenders:

```
N_connected = number of lenders with social connections to borrower
N_total = total number of lenders
P_network = (N_connected / N_total) × 100
```

| Support Strength | Criteria |
|-----------------|----------|
| **STRONG** | P_network ≥ 60% |
| **MODERATE** | 30% ≤ P_network < 60% |
| **WEAK** | 0% < P_network < 30% |
| **NONE** | P_network = 0% |

## Implementation Details

- **Data Source**: Farcaster social graph via Neynar API
- **Caching**: 30-minute TTL for trust scores
- **Computation**: Off-chain TypeScript using set intersection algorithms
- **Display**: Shown in UI but not stored on-chain

## Research Foundation

This algorithm combines microfinance research with social network analysis:

### Social Collateral Research
- **Grameen Bank**: 97-98% repayment rate across 9.6M borrowers using group lending with social ties
- **Kiva**: 96.3% repayment rate with loans showing 20+ friend/family lenders achieving 98% vs 88% with zero social connections
- **Besley & Coate (1995)**: Foundational paper establishing that social collateral can substitute for traditional collateral

### Adamic-Adar Index
- **Adamic & Adar (2003)**: "Friends and neighbors on the Web" - Original link prediction paper
- **Proven effectiveness**: 82% more accurate than simple mutual counting in predicting social connections
- **P2P lending application**: 16% improvement in default prediction when using weighted connections (Lin et al., 2013)
- **Why it works**: Weights "real friends" (small networks) higher than "influencer connections" (large networks)

### Network Analysis
- **Peer-to-Peer Lending**: Friend endorsements reduce default rates by 22% (Iyer et al., 2016)
- **Social Connectedness**: Increases lending by 24.5% and reduces defaults (Kuchler et al., 2022)
- **Link Prediction Benchmarks**: Adamic-Adar consistently ranks top-3 across multiple studies

{% hint style="success" %}
**Key Innovation**: LendFriend combines Adamic-Adar weighting (rewards tight-knit communities) with quality scores (filters spam/bots) for superior trust assessment.
{% endhint %}

{% hint style="info" %}
**See full citations**: [Academic Research](../references.md) — Complete bibliography with DOIs, institutional case studies, and peer-reviewed papers
{% endhint %}

## Why It Works

1. **Information Asymmetry**: Friends know you better than strangers—social ties reduce information gaps
2. **Social Pressure**: You care about maintaining reputation with your network
3. **Verifiable**: Farcaster provides cryptographic proof of social connections (solving identity verification at scale)
4. **Sybil Resistant**: Quality scores filter fake accounts, overlap bonus requires real networks

---

**Next**: Learn how trust scores integrate with [Smart Contract Flow](smart-contract-flow.md)
