# The Algorithm

## How We Calculate Social Trust Scores

We calculate social distance between borrower and lender by measuring mutual connections on Farcaster using the **Adamic-Adar Index**—a proven link prediction algorithm from network science.

---

## The 4-Step Process

### Step 1: Identify Mutual Connections

Find all shared connections between borrower and lender:

```
B = borrower's social network (followers ∪ following)
L = lender's social network (followers ∪ following)
M = |B ∩ L| = count of mutual connections
```

---

### Step 2: Adamic-Adar Weighting

{% hint style="info" %}
**Core Insight**

A mutual friend with 20 connections is a much stronger signal than a mutual friend with 20,000 connections.
{% endhint %}

Instead of treating all mutuals equally, we weight each by how "selective" they are:

```
For each mutual connection z:
  degree(z) = total connections (followers + following)
  weight(z) = 1 / log(degree(z))

AA_score = Σ weight(z) for all mutuals
```

**Example weights:**
- Friend with 25 connections → weight = 0.31
- Friend with 10,000 connections → weight = 0.11
- **Small network weighted 3× higher**

{% hint style="success" %}
**Why Logarithm?**

Provides diminishing returns as networks grow:
- 10 → 100 connections: weight drops 50%
- 100 → 1,000: drops 33%
- 1,000 → 10,000: drops 25%

This prevents influencer gaming while rewarding tight-knit communities.
{% endhint %}

---

### Step 3: Quality Adjustment

Multiply Adamic-Adar score by quality scores to filter spam/bots:

```
Q_avg = (Q_borrower + Q_lender) / 2
AA_effective = AA_score × Q_avg
```

**Neynar quality scores (0-1 scale):**
- Legitimate active user: 0.9
- Low-activity account: 0.5
- Bot/spam: 0.1

---

### Step 4: Calculate Social Distance Score (0-100)

Final score combines three components:

#### A. Base Score (max 60 points)

| AA_effective | Points | Meaning |
|-------------|--------|---------|
| ≥ 20 | 60 | Very tight-knit community |
| ≥ 10 | 50 | Strong social ties |
| ≥ 5 | 35 | Moderate connections |
| ≥ 2.5 | 20 | Some shared connections |
| ≥ 1 | 10 | Weak connection |

---

#### B. Overlap Bonus (max 30 points)

Rewards when significant portion of both networks overlap:

```
P_overlap = (M / min(|B|, |L|)) × 100
Bonus = min(P_overlap × 3, 30) if P_overlap > 10%
```

---

#### C. Mutual Follow Bonus (max 10 points)

| Relationship | Points |
|-------------|--------|
| Both follow each other | +10 |
| One-way follow | +5 |
| No direct follow | +0 |

---

### Final Score

```
S_total = min(S_base + S_overlap + S_mutual, 100)
```

---

## Complete Example

**Given:**
- 25 mutual connections
- AA_score = 8.5
- Q_borrower = 0.9, Q_lender = 0.85
- Both follow each other

**Calculation:**
1. AA_effective = 8.5 × 0.875 = **7.44**
2. Base score = 35 points (between 5 and 10)
3. Overlap bonus = 0 (below 10% threshold)
4. Mutual follow = 10 points
5. **Total = 45 points (MEDIUM RISK)**

---

## Research Foundation

{% hint style="success" %}
**Proven Effectiveness**

**Adamic & Adar (2003)**: 82% improvement over simple mutual counting

**Lin et al. (2013)**: 16% improvement in P2P lending default prediction

**Liben-Nowell & Kleinberg (2007)**: Adamic-Adar consistently ranks top-3 across multiple networks

[→ View full citations](../../references.md)
{% endhint %}

---

## Why This Works

**Information Asymmetry Reduction:** Friends know you better than strangers

**Prevents Influencer Gaming:** Following 10,000 people gives minimal trust signal

**Rewards Tight Communities:** Close-knit groups get highest scores

**Sybil Resistant:** Quality scores filter bots, Adamic-Adar penalizes large networks

**Transparent:** All calculations use public social graph data

---

## Comparison to Alternatives

| Algorithm | Pros | Cons | Our Choice |
|-----------|------|------|------------|
| **Simple Count** | Easy | Vulnerable to gaming | ❌ |
| **Jaccard** | Size independent | Doesn't weight rarity | ❌ |
| **Adamic-Adar** | Weights rarity, proven | Requires degree lookup | ✅ |
| **PageRank** | Global analysis | Too expensive | ❌ |
| **Node2Vec** | ML embeddings | Needs training data | ❌ |

---

## Next Steps

- **See how scores determine risk?** → [Risk Tiers](risk-tiers.md)
- **Curious about social dynamics?** → [Trust Cascades](trust-cascades.md)
- **Worried about gaming?** → [Sybil Resistance](sybil-resistance.md)
- **Need implementation details?** → [Implementation](implementation.md)

**Back to:** [Social Trust Scoring Overview](README.md)
