# Social Trust Scoring

## How We Turn Relationships into Credit Scores

LendFriend enables uncollateralized lending by quantifying social trust. Your network doesn't just vouch for you—we algorithmically prove your creditworthiness through measurable social proximity.

---

## The Research Foundation

We calculate social distance between borrower and lender by measuring mutual connections on Farcaster.

{% hint style="success" %}
📊 **Impact of Social Connections**

- **20+ friend/family lenders**: 98% repayment rate
- **0 friend/family lenders**: 88% repayment rate
- **Result**: 10% improvement from social proximity alone

*Source: [Kiva and Grameen Bank research](../references.md)*
{% endhint %}

---

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

Quality scores come from Neynar (0-1 scale) and identify spam/bot accounts.

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

Rewards when a significant portion of both networks overlap.

#### Mutual Follow Bonus (max 10 points)
- Both follow each other → +10 points (strongest signal)
- One-way follow → +5 points (moderate signal)

### Final Score
```
S_total = min(S_base + S_overlap + S_mutual, 100)
```

---

## Risk Tier Classification

Individual lender-borrower trust scores determine risk tier:

| Risk Level | Criteria |
|-----------|----------|
| **LOW RISK** 🟢 | AA_eff ≥ 10 OR S_total ≥ 60 |
| **MEDIUM RISK** 🟡 | AA_eff ≥ 2.5 OR S_total ≥ 30 |
| **HIGH RISK** 🔴 | AA_eff < 2.5 AND S_total < 30 |

---

## What Lenders See

When you contribute to a loan, the UI displays your social proximity to the borrower:

| Metric | Description |
|--------|-------------|
| **Mutual Connections** | Count of shared connections |
| **Social Distance** | Score from 0-100 (higher = closer) |
| **Risk Tier** | LOW / MEDIUM / HIGH based on thresholds |
| **Support Strength** | Loan-level aggregate (see below) |

All calculations run **off-chain** with a 30-minute cache. Results guide lender decisions but don't affect smart contract logic.

---

## Loan-Level Support Strength

For the entire loan, we aggregate proximity across all lenders:

```
N_connected = number of lenders with social connections to borrower
N_total = total number of lenders
P_network = (N_connected / N_total) × 100
```

| Support Strength | Criteria | Meaning |
|-----------------|----------|---------|
| **STRONG** 🟢 | P_network ≥ 60% | Most lenders know borrower |
| **MODERATE** 🟡 | 30% ≤ P_network < 60% | Some lenders know borrower |
| **WEAK** 🟠 | 0% < P_network < 30% | Few lenders know borrower |
| **NONE** ⚪ | P_network = 0% | No social connections |

**Research shows:**
- STRONG support loans: 2-5% default rate (similar to Grameen Bank)
- WEAK/NONE support loans: 20-40% default rate

---

## Trust Cascades

The system creates natural trust cascades:

1. **Core network contributes first** (high trust, small amounts)
2. **Extended network sees validation** (medium trust, joins in)
3. **Public lenders feel safe** (low/no connection, but validated by others)
4. **Loan reaches full funding** (diverse lender base)

This mirrors traditional lending: you ask family first, then friends, then acquaintances, then institutions.

### Why Trust Cascades Work

- **Peer Monitoring**: Group members monitor each other's behavior, reducing moral hazard
- **Social Sanctions**: Network connections create enforcement through reputation damage
- **Information Cascades**: Early endorsements by trusted connections influence subsequent lenders

{% hint style="info" %}
**Research shows**: Increased meeting frequency in lending groups builds social capital and information sharing, improving repayment by creating persistent social ties (Feigenberg et al., 2013). [See complete research](../references.md)
{% endhint %}

---

## How Contributions Signal Trust

When someone contributes to your loan, they're doing two things:

1. **Providing capital** - Direct financial support
2. **Vouching for you** - Staking their social reputation

**Key principle:** A $10 contribution from a mutual friend is a stronger trust signal than $100 from a stranger with zero mutual connections.

### Economic Signaling

Contributions have two dimensions:

**Financial Signal:**
- Amount contributed (financial commitment)
- Early contributions (risk-taking signal)
- Full funding (community confidence)

**Social Signal:**
- Proximity to borrower (closer = stronger endorsement)
- Contributor's reputation (well-connected lenders add more credibility)
- Network overlap (multiple lenders from same network = coordinated trust)

---

## Sybil Resistance

Creating fake Farcaster accounts to game the system doesn't work because:

- **No connections**: Fake accounts have no mutual connections with the borrower (socialDistance = 0)
- **Quality filtering**: Neynar quality scores filter out spam/bot accounts (avgQuality adjustment)
- **Adamic-Adar weighting**: Even if bots follow each other, they have large networks → low weight
- **Network threshold**: Support strength requires 30%+ of lenders to be from your real network

### Anti-Patterns (What Doesn't Work)

❌ **Sybil attacks**: Fake accounts with no real connections
❌ **Circular vouching**: Small groups vouching for each other repeatedly
❌ **Paid vouching**: Offering payment for contributions (detectable on-chain)
❌ **Single large lender**: No social validation, just capital
❌ **Influencer gaming**: Following 1000s of influencers → low Adamic-Adar score

---

## Implementation Details

### Off-Chain Computation

- **Data Source**: Farcaster social graph via Neynar API
- **Caching**: 30-minute TTL for trust scores
- **Computation**: TypeScript using set intersection + Adamic-Adar algorithm
- **Display**: Shown in UI but not stored on-chain
- **Gas Optimization**: Smart contracts only handle money movement, not social graph analysis

### API Calls Per Score Calculation

1. Fetch borrower followers (1 call)
2. Fetch borrower following (1 call)
3. Fetch lender followers (1 call)
4. Fetch lender following (1 call)
5. **Fetch degree for each mutual** (N calls, where N = mutual count)

**Total:** 4 + N API calls per trust score

**Example:** 20 mutual connections = 24 API calls

### Performance Optimization

- All degree fetches run in parallel
- Graceful fallback if any fetch fails
- Consider caching degree counts in future (connection counts change slowly)

---

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

---

## Why This Works

### 1. Information Asymmetry Reduction
Friends know you better than strangers—social ties reduce information gaps. You can't fake a mutual friend network.

### 2. Social Pressure
You care about maintaining reputation with your network. Defaulting hurts relationships, not just credit score.

### 3. Verifiable Connections
Farcaster provides cryptographic proof of social connections, solving identity verification at scale.

### 4. Sybil Resistant
Quality scores + Adamic-Adar weighting filter fake accounts and require real networks with selective connections.

### 5. Transparent & Auditable
All trust calculations use public social graph data. Anyone can verify the scores.

---

## Best Practices

### For Borrowers

✅ **Share with close connections first** - They'll give you higher trust scores
✅ **Explain your story clearly** in metadata
✅ **Update supporters** as you reach milestones
✅ **Start small** to build reputation
✅ **Repay on time** to build trust for future loans

### For Lenders

✅ **Check trust scores** before contributing
✅ **Prioritize borrowers** with strong network support
✅ **Contribute early to friends** (signals confidence)
✅ **Watch support strength** - STRONG/MODERATE = safer bets
✅ **Diversify** - Spread $100 across 10 loans instead of $1000 on one
✅ **Follow early lenders** - If close friends funded, it's a good signal

---

## Comparison to Traditional Credit Scoring

| Traditional Credit | LendFriend Social Trust |
|-------------------|------------------------|
| Credit history | Social graph |
| Payment timeliness | Trust score + repayment |
| Debt-to-income ratio | Support strength |
| Credit utilization | Loan-level aggregation |
| Hard inquiries hurt score | Trust scores encourage borrowing |
| Takes years to build | Instant (based on existing network) |
| Centralized (credit bureaus) | Decentralized (on-chain + Farcaster) |
| Not portable | Portable across Farcaster apps |

---

## Expected Performance

Based on academic research and LendFriend's hybrid approach:

**Simple mutual counting:** Baseline accuracy

**+ Adamic-Adar weighting:** 15-25% improvement (link prediction benchmarks)

**+ Quality filtering:** Additional 10-15% improvement (spam/bot reduction)

**Combined approach:** **Expected 25-40% better default prediction** vs simple counting

**Real-world benchmarks:**
- Grameen Bank (group lending): 2-3% default rate
- Kiva (P2P + social ties): 3.7% default rate
- Prosper.com (with social endorsements): 22% lower defaults

**LendFriend target:** 5-12% default rate (conservative estimate for Phase 1)

---

**Next**: Learn how trust scores integrate with [Smart Contract Flow](smart-contract-flow.md)
