# Sybil Resistance

## How We Prevent Gaming the Trust System

A **Sybil attack** is when someone creates many fake accounts to manipulate a reputation system. LendFriend's multi-layer defense makes these attacks ineffective and economically irrational.

---

## Why Simple Counting Fails

**Vulnerable approach:**
```
Trust Score = Count of mutual connections
```

**Attack:** Create 100 fake Farcaster accounts, make them all follow each other → 100 mutual connections

**Cost:** $0 (accounts are free)

{% hint style="danger" %}
**This doesn't work on LendFriend**

Our Adamic-Adar weighting + quality filtering defeats this attack.
{% endhint %}

---

## Our Four-Layer Defense

### Layer 1: Adamic-Adar Weighting
Weight connections by rarity: `1/log(degree)`

**Result:** 100 fake accounts with 100 connections each only gives AA_score ≈ 22, while 10 real friends with 50 connections each gives AA_score ≈ 2.9

Fake accounts don't get the boost attackers expect.

---

### Layer 2: Quality Filtering
Multiply AA_score by Neynar quality scores (0-1 scale)

```
AA_effective = AA_score × Q_avg
```

**Neynar detects:**
- Account age and activity patterns
- Bot behavior (predictable timing)
- Engagement diversity
- Follower/following ratios
- Spam patterns

**Result:**
- Fake accounts: Q = 0.1-0.2
- Real accounts: Q = 0.8-1.0
- Attacker's score gets reduced by 70-90%

---

### Layer 3: Network Overlap Bonus
Rewards genuine community overlap, but requires **both** networks to overlap significantly (>10% threshold)

Attackers can't fake this without controlling the lender's account too.

---

### Layer 4: Support Strength Transparency
All lender profiles are **public**. When legitimate users see that every existing lender is a spam account (Q = 0.1), they won't contribute.

{% hint style="success" %}
**Transparency Defeats Sybils**

Attackers need **real people** to contribute for STRONG support. Real people check who else funded and won't contribute to loans backed only by obvious spam accounts.
{% endhint %}

---

## Attack Cost Analysis

**To create plausible fake accounts (Q ≥ 0.7):**
- 6+ months of activity per account
- Regular casting, organic engagement
- Varied content, human behavior patterns

**Cost:** ~$200 per account × 100 accounts = **$20,000**

**Plus:** Need to trick real lenders to achieve STRONG support

**Expected benefit:** Borrow $500 and default

**Result:** Attack is economically irrational

---

## Common Attacks That Don't Work

### ❌ Mass Fake Accounts
Quality scores detect bots (Q = 0.1) → AA_effective stays very low

### ❌ Circular Vouching
Small group defaults together → all get permanent on-chain default records → future loans flagged

### ❌ Paid Vouching
"I'll pay you $10 to fund my $50 loan" → traceable on-chain → suspicious patterns visible to community

###  ❌ Single Large Lender
Support strength = 100% but only 1 lender → obvious anomaly (normal loans have 5-15 lenders)

### ❌ Influencer Gaming
Following 10,000 influencers → Adamic-Adar specifically penalizes large networks
- Influencer (50K followers): weight = 0.09
- Real friend (50 followers): weight = 0.29
- Real friend weighted **3.2× higher**

---

## Red Flags for Lenders

🚩 **New borrower account** - Low quality score (< 0.5)

🚩 **Zero social validation** - Support strength is ⚪ NONE

🚩 **Single large lender** - Normal loans have 5-15 diverse lenders

🚩 **All spam lenders** - Check existing lender profiles; if all Q < 0.3, don't fund

🚩 **Vague metadata** - No clear explanation or repayment plan

---

## Why It Works

{% hint style="info" %}
**Defense in Depth**

No single mechanism is perfect, but combined they make attacks economically irrational.

**Cost to attack:** $20,000-$70,000
**Benefit:** Borrow $500 and default
**Expected value:** Massively negative
{% endhint %}

Creating high-quality fake accounts costs more than legitimate borrowing. Transparency makes coordinated attacks visible to the community.

---

## Expected Performance

Based on similar reputation systems:

| System | Fraud Rate | Mitigation |
|--------|-----------|-----------|
| **Kiva** | ~0.1% | Field partners + community flagging |
| **Airbnb** | ~0.01% | ID verification + reviews |
| **LendFriend target** | <1% | Multi-layer defense + transparency |

---

## Next Steps

- **Understand the math?** → [The Algorithm](the-algorithm.md)
- **See risk classifications?** → [Risk Tiers](risk-tiers.md)
- **Curious about social dynamics?** → [Trust Cascades](trust-cascades.md)

**Back to:** [Social Trust Scoring Overview](README.md)
