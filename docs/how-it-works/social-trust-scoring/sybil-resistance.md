# Sybil Resistance

## How We Prevent Gaming the Trust System

A **Sybil attack** is when someone creates many fake accounts to manipulate a reputation system. LendFriend's trust algorithm is designed to make Sybil attacks ineffective and economically irrational.

---

## Why Traditional Trust Systems Fail

### Simple Mutual Counting (Vulnerable)

```
Trust Score = Count of mutual connections
```

**Attack vector:**
1. Create 100 fake Farcaster accounts
2. Make all fake accounts follow each other
3. Have fake accounts follow your real account
4. Result: 100 mutual connections → high trust score

**Cost:** ~$0 (accounts are free)
**Benefit:** Can borrow without social accountability

{% hint style="danger" %}
**This doesn't work on LendFriend**

Our Adamic-Adar weighting + quality filtering makes this attack ineffective.
{% endhint %}

---

## LendFriend's Multi-Layer Defense

### Layer 1: Adamic-Adar Weighting

**Core mechanism:** Weight connections by rarity (1/log(degree))

#### Attack Scenario:
- Attacker creates 100 fake accounts
- Each fake account follows 99 other fakes + 1 real account
- Degree of each fake = ~100

**Result:**
```
Weight per fake connection = 1/log(100) = 0.22
Total AA_score = 100 × 0.22 = 22
```

**Compare to legitimate user:**
- 10 real friends with 50 connections each
- Weight per friend = 1/log(50) = 0.29
- Total AA_score = 10 × 0.29 = 2.9

{% hint style="warning" %}
**Problem for Attacker**

100 fake accounts only gives AA_score = 22, which sounds high... until quality filtering kicks in.
{% endhint %}

---

### Layer 2: Quality Filtering

**Core mechanism:** Multiply AA_score by Neynar quality scores

```
Q_avg = (Q_borrower + Q_lender) / 2
AA_effective = AA_score × Q_avg
```

**Neynar Quality Scores:**
- Legitimate active user: Q = 0.8-1.0
- Low-activity account: Q = 0.4-0.7
- Bot/spam account: Q = 0.0-0.3

#### Attack Impact:
- Fake accounts: Q = 0.1 (spam detected)
- Q_avg = (0.1 + 0.9) / 2 = 0.5
- AA_effective = 22 × 0.5 = **11**

**Compare to legitimate user:**
- Real friends: Q = 0.9
- Q_avg = (0.9 + 0.9) / 2 = 0.9
- AA_effective = 2.9 × 0.9 = **2.6**

{% hint style="success" %}
**Still looks bad for attacker...**

But wait! The attacker's **borrower** account also needs to look legitimate. If the borrower account is fake (Q = 0.1), then:

AA_effective = 22 × 0.1 = **2.2**

Now the 100 fake accounts give less trust than 10 real friends.
{% endhint %}

---

### Layer 3: Network Overlap Bonus

**Core mechanism:** Reward when significant portion of networks overlap

```
P_overlap = (M / min(|B|, |L|)) × 100
Bonus = min(P_overlap × 3, 30) if P_overlap > 10%
```

#### Attack Fails Here:

**Attacker's fake network:**
- 100 fake accounts
- Each follows 99 others
- Lender and borrower have 100% overlap (all fake)

**Legitimate lender checking:**
- Lender has 300 real connections
- Borrower has 100 fake connections
- Mutual: 100 fake accounts
- P_overlap = 100/100 = 100%
- Bonus = 30 points

**Problem:**
```
Base score from AA_eff = 11 → 50 points (looks good!)
Overlap bonus = 30 points
Mutual follow bonus = 10 points (if they follow each other)
Total = 50 + 30 + 10 = 90 points (🟢 LOW RISK)
```

{% hint style="danger" %}
**Wait, the attack works?**

Not so fast. This assumes a **legitimate lender** with Q = 0.9 is checking. But the attacker doesn't control legitimate lenders.

The attacker can only create **fake lenders**, which means:
{% endhint %}

---

### Layer 4: Support Strength Requirement

**Core mechanism:** Loan-level aggregate requires real network validation

```
N_connected = lenders with social connections
P_network = (N_connected / N_total) × 100
```

**For STRONG support:** P_network ≥ 60%

#### Attack Fails Completely:

**Scenario 1: Only fake lenders fund**
- 10 fake lender accounts fund $50 each
- All have Q = 0.1 (spam)
- All have fake mutual connections
- Support strength: 10/10 = 100% → 🟢 STRONG

**Problem:** No legitimate lender will fund because:
- All existing lenders are obvious spam accounts (Q = 0.1)
- Support strength metric shows 100% but it's 100% fake
- Legitimate lenders check **who** the other lenders are, not just the percentage

{% hint style="success" %}
**Key Insight: Transparency Defeats Sybils**

All lender profiles are public. When legitimate users see that every existing lender is a spam account with Q = 0.1, they won't contribute.

The attacker needs **real people** to contribute, but real people won't contribute to loans backed only by fake accounts.
{% endhint %}

---

## Attack Cost Analysis

Let's calculate the cost to successfully execute a Sybil attack:

### Step 1: Create fake accounts with high quality scores

**Challenge:** Neynar quality scores are based on:
- Account age
- Engagement (casts, replies, likes)
- Follow/follower ratios
- Human behavior patterns

**To reach Q = 0.7 (minimum for plausible account):**
- 6+ months of activity
- Regular casting (3-5 per week)
- Organic-looking engagement
- Varied content

**Cost per account:**
- Time: 10 hours over 6 months
- At $20/hour: $200 per account
- For 100 accounts: **$20,000**

---

### Step 2: Build real network connections

**Challenge:** Real users need to follow your fake accounts

**Options:**
- Follow/unfollow spam (gets detected, Q drops)
- Buy followers (obvious bot patterns, Q drops)
- Organic growth (slow, expensive)

**Cost:** Additional $100-500 per account to look organic

**Total: $30,000-$70,000**

---

### Step 3: Coordinate lending attack

**Challenge:** Need real lenders to achieve STRONG support

**You need:**
- 60% of lenders to be real people
- If loan is $500, that's 6 lenders × $50 = $300 from real people
- To trick 6 real people, you need at least 4 fake lenders

**Problem:** Real lenders check:
- Your profile (is Q high?)
- Existing lender profiles (are they spam?)
- Support strength (who are the connected lenders?)

**Chance of success:** Near zero if any lender does basic due diligence

---

## Attack Vectors That Don't Work

### ❌ Attack 1: Mass Fake Accounts

**Strategy:** Create 1000 fake Farcaster accounts, follow each other

**Why it fails:**
- Quality scores detect bot behavior (Q = 0.0-0.2)
- AA_effective = AA_score × 0.1 = very low trust
- No legitimate lender will fund

---

### ❌ Attack 2: Circular Vouching

**Strategy:** Small group of real people vouch for each other repeatedly

**Example:**
- Alice, Bob, Charlie form a lending circle
- Each borrows $500, others fund
- All default together

**Why it fails:**
- Defaults are recorded on-chain permanently
- After first default, all three have bad reputation
- Future loans from this group get flagged
- Other lenders can see their default history

{% hint style="warning" %}
**Phase 2 Enhancement**

On-chain reputation scores will explicitly penalize repeat defaults and circular lending patterns.
{% endhint %}

---

### ❌ Attack 3: Paid Vouching

**Strategy:** Offer payment for contributions

**Example:**
- "I'll pay you $10 to contribute $50 to my loan, then I'll repay you $60"

**Why it fails:**
- All transactions are on-chain and traceable
- Patterns of immediate repayment to lenders are visible
- Looks suspicious: why repay specific lenders first?
- Community can flag coordinated behavior

---

### ❌ Attack 4: Single Large Lender

**Strategy:** One wealthy person funds entire loan, pretends to be borrower's friend

**Why it fails:**
- Support strength = 1/1 = 100% (looks good)
- But only 1 lender total (suspicious)
- No trust cascade (no extended network validation)
- Other lenders see single-lender pattern and avoid

{% hint style="info" %}
**Best Loans Have 5-15 Lenders**

Legitimate loans show diverse lender base:
- 3-5 core network (close friends)
- 5-10 extended network (acquaintances)
- 2-5 public lenders (strangers)

Single-lender loans are anomalous and easy to spot.
{% endhint %}

---

### ❌ Attack 5: Influencer Gaming

**Strategy:** Follow 10,000 influencers, hope for follow-backs, claim high mutual counts

**Why it fails:**
- Adamic-Adar specifically penalizes large networks
- Influencer with 50,000 followers: weight = 1/log(50,000) = **0.09**
- Friend with 50 followers: weight = 1/log(50) = **0.29**
- Real friend is weighted **3.2× higher** than influencer

```
1000 influencer connections: AA_score ≈ 90
10 real friend connections: AA_score ≈ 2.9

But influencer-based score has terrible quality adjustment:
- Your account looks like spam (follow 10K people)
- Q_borrower = 0.3
- AA_effective = 90 × 0.3 = 27

Real friends win: AA_effective = 2.9 × 0.9 = 2.6
```

---

## Why Quality Scores Matter

Neynar quality scores are the **secret weapon** against Sybil attacks.

### How Quality Scores Work

Neynar analyzes:
- **Account age** - New accounts get low scores
- **Engagement patterns** - Bots have predictable timing
- **Content diversity** - Real humans vary their activity
- **Network structure** - Real networks have organic growth
- **Follower/following ratios** - Bots follow thousands, get few follows back
- **Interaction reciprocity** - Real humans engage in conversations

### Quality Score Examples

| Account Type | Quality Score | Why |
|-------------|--------------|-----|
| Active community member | 0.9-1.0 | Organic engagement, diverse network |
| Casual user | 0.6-0.8 | Some activity, growing network |
| Inactive account | 0.3-0.5 | Old account, no recent activity |
| New account | 0.2-0.4 | Insufficient history |
| Bot/spam | 0.0-0.2 | Detected patterns |

{% hint style="success" %}
**Quality filtering is the kill shot**

Even if an attacker bypasses Adamic-Adar weighting, quality scores reduce their effective trust by 70-90%.

Creating high-quality fake accounts costs more than legitimate borrowing.
{% endhint %}

---

## Real-World Analogy

Think of LendFriend's Sybil resistance like airport security:

### Single Check (Vulnerable)
- **ID check only**: Easy to fake an ID
- **Simple mutual count**: Easy to create fake connections

### Multi-Layer Security (Robust)
- **ID check**: Verify identity (Farcaster account)
- **Boarding pass**: Verify intent (Adamic-Adar weighting)
- **Behavior screening**: Detect suspicious patterns (quality scores)
- **Random checks**: Sample validation (community flagging)

{% hint style="info" %}
**Defense in depth**

No single mechanism is perfect, but combined they make attacks economically irrational.

**Cost to attack:** $30,000-$70,000
**Benefit of attack:** Borrow $500 and default
**Expected value:** Massively negative
{% endhint %}

---

## Community Flagging (Future)

{% hint style="warning" %}
**Phase 2 Enhancement**

Future versions will add community flagging mechanisms:
- Report suspicious loans
- Vote on borrower reputation
- Penalty for false reports (skin in the game)
- Reward for accurate fraud detection

This adds a fifth layer of defense: human judgment.
{% endhint %}

---

## Best Practices for Lenders

### How to Spot Suspicious Loans

🚩 **Red Flag 1: New borrower account**
- Check Farcaster account age
- Look for profile activity history
- Low quality score (< 0.5) is suspicious

🚩 **Red Flag 2: All lenders are strangers**
- Check support strength (should be 🟢 STRONG or 🟡 MODERATE)
- ⚪ NONE means zero social validation

🚩 **Red Flag 3: Single large lender**
- Normal loans have 5-15 lenders
- Single lender for full amount is unusual

🚩 **Red Flag 4: Existing lenders are spam accounts**
- Click on lender profiles
- Check their quality scores
- If all existing lenders have Q < 0.3, don't fund

🚩 **Red Flag 5: Unrealistic repayment terms**
- Borrowing $500, repaying in 7 days (how?)
- No explanation of income source
- Vague metadata

---

## Transparency as Defense

All data is public:
- Borrower's Farcaster profile
- All lender profiles
- Trust scores for each lender
- Loan metadata
- Repayment history (once implemented)

{% hint style="success" %}
**Sunlight is the best disinfectant**

Fraudsters rely on opacity. LendFriend's full transparency makes coordinated attacks visible to the community.

Anyone can audit the social graph and verify trust calculations.
{% endhint %}

---

## Expected Attack Rate

Based on similar social reputation systems:

| System | Attack Rate | Mitigation |
|--------|------------|-----------|
| **eBay** | ~0.5% fraudulent sellers | Feedback system + PayPal protection |
| **Kiva** | ~0.1% suspected fraud | Field partners + community flagging |
| **Airbnb** | ~0.01% serious fraud | ID verification + reviews + insurance |

**LendFriend target:** <1% fraud rate (Phase 1)

With 100 loans, we expect 0-1 coordinated Sybil attacks. Community flagging and reputation history will drive this toward 0% over time.

---

## Next Steps

- **Understand the algorithm?** → [The Algorithm](the-algorithm.md)
- **Want to see risk classifications?** → [Risk Tiers](risk-tiers.md)
- **Curious about social dynamics?** → [Trust Cascades](trust-cascades.md)
- **Need technical details?** → [Implementation](implementation.md)

---

**Back to:** [Social Trust Scoring Overview](README.md)
