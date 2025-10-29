# The Algorithm

## How We Calculate Social Trust Scores

We calculate social distance between borrower and lender by measuring mutual connections on Farcaster using the **Adamic-Adar Index**—a proven link prediction algorithm from network science.

---

## The 4-Step Process

### Step 1: Identify Mutual Connections

First, we find all shared connections between the borrower and lender:

```
Let B = borrower's social network (followers ∪ following)
Let L = lender's social network (followers ∪ following)
Let M = |B ∩ L| = count of mutual connections
```

**Example:**
- Borrower follows 300 people, has 450 followers → |B| = 750
- Lender follows 200 people, has 350 followers → |L| = 550
- They share 25 mutual connections → M = 25

---

### Step 2: Adamic-Adar Weighting

{% hint style="info" %}
**Core Insight**

A mutual friend with 20 connections is a much stronger signal than a mutual friend with 20,000 connections.
{% endhint %}

Instead of treating all mutual connections equally, we weight each by how "selective" they are. This is the **Adamic-Adar Index**.

**Formula:**

```
For each mutual connection z:
  degree(z) = total connections of person z (followers + following)
  weight(z) = 1 / log(degree(z))

AA_score = Σ weight(z) for all mutual connections
```

**Example Calculation:**

| Mutual Friend | Total Connections | Weight Calculation | Weight |
|--------------|------------------|-------------------|--------|
| Alice | 25 | 1/log(25) | 0.31 |
| Bob | 100 | 1/log(100) | 0.22 |
| Charlie | 10,000 | 1/log(10,000) | 0.11 |
| **Sum** | — | **AA_score** | **0.64** |

Alice is weighted **3× higher** than Charlie because her small network makes her endorsement more meaningful.

{% hint style="success" %}
**Why Logarithm?**

Provides diminishing returns as network size grows:
- 10 → 100 connections: weight drops 50%
- 100 → 1,000 connections: weight drops 33%
- 1,000 → 10,000 connections: weight drops 25%

This prevents influencer gaming while rewarding tight-knit communities.
{% endhint %}

---

### Step 3: Quality Adjustment

We multiply the Adamic-Adar score by quality scores to filter spam/bots:

```
Q_borrower = Neynar quality score for borrower (0-1 scale)
Q_lender = Neynar quality score for lender (0-1 scale)
Q_avg = (Q_borrower + Q_lender) / 2

AA_effective = AA_score × Q_avg
```

**Quality Score Examples:**
- Legitimate active user: Q = 0.9
- Low-activity account: Q = 0.5
- Bot/spam account: Q = 0.1

If both users have Q = 0.9, then Q_avg = 0.9. If borrower has Q = 0.2 (spam), then Q_avg = 0.55 (penalized).

---

### Step 4: Calculate Social Distance Score (0-100)

The final score combines three components:

#### A. Base Score (max 60 points)

Based on quality-weighted Adamic-Adar score:

| AA_effective | Base Score | Meaning |
|-------------|-----------|---------|
| ≥ 20 | 60 points | Very tight-knit community |
| ≥ 10 | 50 points | Strong social ties |
| ≥ 5 | 35 points | Moderate connections |
| ≥ 2.5 | 20 points | Some shared connections |
| ≥ 1 | 10 points | Weak connection |
| < 1 | 0 points | Minimal/no connection |

---

#### B. Overlap Bonus (max 30 points)

Rewards when a significant portion of both networks overlap:

```
P_overlap = (M / min(|B|, |L|)) × 100
```

**Bonus calculation:**
```
If P_overlap > 10%:
  Bonus = min(P_overlap × 3, 30)
Else:
  Bonus = 0
```

**Example:**
- 25 mutual connections
- Smaller network has 200 total connections
- P_overlap = (25/200) × 100 = 12.5%
- Bonus = 12.5 × 3 = 37.5 → capped at 30 points

---

#### C. Mutual Follow Bonus (max 10 points)

Direct relationship signal:

| Relationship | Bonus | Meaning |
|-------------|-------|---------|
| Both follow each other | +10 points | Strongest signal (direct connection) |
| One-way follow | +5 points | Moderate signal |
| No direct follow | +0 points | Indirect connection only |

---

### Final Score

```
S_total = min(S_base + S_overlap + S_mutual, 100)
```

The score is capped at 100 to maintain a consistent scale.

---

## Complete Example

Let's calculate the trust score for a lender-borrower pair:

**Given:**
- 25 mutual connections
- AA_score = 8.5 (after weighting)
- Q_borrower = 0.9, Q_lender = 0.85 → Q_avg = 0.875
- Borrower network: 750 connections
- Lender network: 550 connections (smaller)
- Both follow each other

**Step-by-step:**

1. **AA_effective** = 8.5 × 0.875 = **7.44**

2. **Base Score** = 35 points (AA_eff between 5 and 10)

3. **Overlap Bonus**:
   - P_overlap = (25/550) × 100 = 4.5%
   - Bonus = 0 (below 10% threshold)

4. **Mutual Follow Bonus** = 10 points (both follow each other)

5. **S_total** = 35 + 0 + 10 = **45 points**

**Result:** MEDIUM RISK (score between 30-59)

---

## Research Foundation

{% hint style="success" %}
**Proven Effectiveness**

**Adamic & Adar (2003)**: Original link prediction paper showing 82% improvement over simple mutual counting.

**Lin et al. (2013)**: Demonstrated 16% improvement in P2P lending default prediction when using weighted connections.

**Liben-Nowell & Kleinberg (2007)**: Benchmark study showing Adamic-Adar consistently ranks top-3 across multiple social networks.

[→ View full citations](../../references.md)
{% endhint %}

---

## Why This Works

### 1. Information Asymmetry Reduction
Friends know you better than strangers. Social ties reduce information gaps about creditworthiness.

### 2. Prevents Influencer Gaming
Following 10,000 people gives minimal trust signal. Adamic-Adar weighs real friends higher than mass connections.

### 3. Rewards Tight-Knit Communities
Close communities where everyone knows everyone get the highest scores—exactly matching microfinance research on group lending.

### 4. Sybil Resistant
Quality scores filter bots. Adamic-Adar penalizes large networks. Creating 1000 fake accounts with no real connections = zero trust score.

### 5. Transparent & Auditable
All calculations use public social graph data. Anyone can verify the scores.

---

## Comparison to Alternative Algorithms

| Algorithm | Pros | Cons | LendFriend Choice |
|-----------|------|------|------------------|
| **Simple Mutual Count** | Easy to understand | Vulnerable to influencer gaming | ❌ Too basic |
| **Jaccard Similarity** | Network size independent | Doesn't weight by rarity | ❌ Missing key signal |
| **Adamic-Adar** | Weights by rarity, proven accuracy | Requires degree lookup | ✅ **Our choice** |
| **Personalized PageRank** | Global network analysis | Computationally expensive | ❌ Overkill for MVP |
| **Node2Vec** | ML embeddings | Requires training data | ❌ No data yet |

**Decision:** Adamic-Adar provides the best balance of accuracy, research backing, and implementation feasibility.

---

## Next Steps

- **Want to see how scores determine risk?** → [Risk Tiers](risk-tiers.md)
- **Curious about social dynamics?** → [Trust Cascades](trust-cascades.md)
- **Worried about gaming?** → [Sybil Resistance](sybil-resistance.md)
- **Need technical implementation details?** → [Implementation](implementation.md)

---

**Back to:** [Social Trust Scoring Overview](README.md)
