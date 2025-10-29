# Trust Score Algorithm

## Social Proximity Measurement

We calculate social distance between borrower and lender by measuring mutual connections on Farcaster. The algorithm is based on research from Kiva and Grameen Bank showing that **20+ friend/family lenders achieve 98% repayment vs 88% with 0 friend/family lenders**<sup>[[1]](../references.md#grameen-bank)</sup>—a 10% improvement from social proximity alone.

## The Algorithm

### Step 1: Identify Mutual Connections

```
Let B = borrower's social network (followers ∪ following)
Let L = lender's social network (followers ∪ following)
Let M = |B ∩ L| = count of mutual connections
```

### Step 2: Quality Weighting

Filter spam/bots using identity quality scores (0-1 scale):

```
Q_avg = (Q_borrower + Q_lender) / 2
M_effective = M × Q_avg
```

### Step 3: Calculate Social Distance Score (0-100)

The score has three components:

#### Base Score (max 60 points)
Based on effective mutual connections:
- M_eff ≥ 18 → 60 points
- M_eff ≥ 9 → 50 points
- M_eff ≥ 4.5 → 35 points
- M_eff ≥ 2.5 → 20 points
- M_eff ≥ 0.8 → 10 points

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

This algorithm is grounded in microfinance research:

- **Grameen Bank**: 97-98% repayment rate across 9.6M borrowers using group lending with social ties<sup>[[1]](../references.md#grameen-bank)</sup>
- **Kiva**: 96.3% repayment rate with loans showing 20+ friend/family lenders achieving 98% vs 88% with zero social connections<sup>[[2]](../references.md#kiva)</sup>
- **Besley & Coate (1995)**: Foundational paper establishing that social collateral can substitute for traditional collateral<sup>[[3]](../references.md#group-lending-and-social-collateral)</sup>
- **Peer-to-Peer Lending**: Friend endorsements reduce default rates by 22% (Iyer et al., 2016)<sup>[[4]](../references.md#peer-to-peer-lending-and-reputation)</sup>
- **Social Connectedness**: Increases lending by 24.5% and reduces defaults (Kuchler et al., 2022)<sup>[[5]](../references.md#social-capital-and-network-effects)</sup>

{% hint style="info" %}
**See full research citations**: [Academic Research](../references.md)
{% endhint %}

## Why It Works

1. **Information Asymmetry**: Friends know you better than strangers—social ties reduce information gaps<sup>[[6]](../references.md#peer-to-peer-lending-and-reputation)</sup>
2. **Social Pressure**: You care about maintaining reputation with your network<sup>[[7]](../references.md#social-capital-and-network-effects)</sup>
3. **Verifiable**: Farcaster provides cryptographic proof of social connections (solving identity verification at scale)
4. **Sybil Resistant**: Quality scores filter fake accounts, overlap bonus requires real networks

---

**Next**: Learn how trust scores integrate with [Smart Contract Flow](smart-contract-flow.md)
