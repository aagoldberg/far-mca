# The Algorithm

We measure social distance between borrower and lender using the **Adamic-Adar Index**—a proven network science algorithm that weights selective connections higher.

---

## The 4-Step Process

### 1. Find Mutual Connections

```
B = borrower's network (followers + following)
L = lender's network (followers + following)
M = mutual connections (B ∩ L)
```

---

### 2. Adamic-Adar Weighting

**Core insight:** A mutual friend with 20 connections is a stronger signal than one with 20,000.

```
For each mutual connection:
  weight = 1 / log(total_connections)

AA_score = Σ weights for all mutuals
```

**Example:**
- Friend with 25 connections → weight = 0.31
- Friend with 10,000 connections → weight = 0.11
- **Small network weighted 3× higher**

The logarithm provides diminishing returns as networks grow, preventing influencer gaming while rewarding tight-knit communities.

---

### 3. Quality Adjustment

Filter spam/bots using Neynar quality scores:

```
Q_avg = (Q_borrower + Q_lender) / 2
AA_effective = AA_score × Q_avg
```

Quality scores (0-1 scale):
- Legitimate user: 0.9
- Low activity: 0.5
- Bot/spam: 0.1

---

### 4. Calculate Final Score (0-100)

Three components (initial thresholds):

**A. Base Score (max 60 points)**

| AA_effective | Points |
|-------------|--------|
| ≥ 20 | 60 |
| ≥ 10 | 50 |
| ≥ 5 | 35 |
| ≥ 2.5 | 20 |
| ≥ 1 | 10 |

**B. Overlap Bonus (max 30 points)**

When significant portion of both networks overlap:

```
P_overlap = (M / min(|B|, |L|)) × 100
Bonus = min(P_overlap × 3, 30) if P_overlap > 10%
```

**C. Mutual Follow Bonus (max 10 points)**

- Both follow each other: +10
- One-way follow: +5
- No direct follow: +0

**Final:**
```
S_total = min(S_base + S_overlap + S_mutual, 100)
```

{% hint style="info" %}
**Ongoing Refinement**

The specific thresholds (≥20, ≥10, etc.), bonus multipliers, and score caps are initial parameters based on network science research. We'll continuously refine these as we collect repayment data to optimize prediction accuracy.
{% endhint %}

---

## Example

**Given:**
- 25 mutual connections
- AA_score = 8.5
- Q_borrower = 0.9, Q_lender = 0.85
- Both follow each other

**Result:**
1. AA_effective = 8.5 × 0.875 = 7.44
2. Base = 35 points
3. Overlap = 0 (below 10% threshold)
4. Mutual follow = 10 points
5. **Total = 45 (MEDIUM RISK)**

---

## Why This Works

{% hint style="success" %}
**Research shows:**
- Adamic-Adar improves link prediction accuracy by 82% over simple friend counting [[7]](../../references.md#adamic-and-adar-2003)
- Social network ties on Prosper.com correlate with better repayment performance [[8]](../../references.md#lin-et-al-2013)
- Consistently top-3 performing algorithm for network similarity measurement

**Note:** The algorithm was designed for link prediction, not loan defaults. We're testing whether it translates to repayment prediction in Phase 0.
{% endhint %}

**Benefits:**
- Friends know you better than strangers (reduces information asymmetry)
- Penalizes influencer gaming (following 10K people = minimal signal)
- Rewards tight communities (close-knit groups score highest)
- Sybil resistant (quality filtering + weighting)
- Transparent (public social graph data)

---

**Back to:** [Social Trust Scoring](README.md) · [Risk Scoring](../risk-scoring/README.md)
