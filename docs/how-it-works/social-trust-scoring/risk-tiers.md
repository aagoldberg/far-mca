# Risk Tiers

## How Trust Scores Translate to Risk Levels

Every lender-borrower pair gets a numerical trust score (0-100) and a risk classification. This helps lenders quickly assess social proximity.

---

## Individual Risk Classification

| Risk Level | Criteria | What It Means |
|-----------|----------|---------------|
| 🟢 **LOW RISK** | AA_eff ≥ 10 **OR** S_total ≥ 60 | Close social ties, strong confidence in repayment |
| 🟡 **MEDIUM RISK** | AA_eff ≥ 2.5 **OR** S_total ≥ 30 | Some shared connections, moderate accountability |
| 🔴 **HIGH RISK** | AA_eff < 2.5 **AND** S_total < 30 | Few/no connections, minimal social pressure |

{% hint style="info" %}
**Dual Criteria System**

We use **OR** logic to capture different types of strong connections:
- **AA_eff ≥ 10**: Many selective mutual friends (tight community)
- **S_total ≥ 60**: High overall score (direct relationship + network overlap)

Either condition qualifies for the tier.
{% endhint %}

---

## What Lenders See

When you contribute to a loan, the UI displays:

| Metric | Description | Example |
|--------|-------------|---------|
| **Mutual Connections** | Count of shared connections | 25 mutual |
| **Social Distance** | Score 0-100 (higher = closer) | 45/100 |
| **Risk Tier** | LOW / MEDIUM / HIGH | 🟡 MEDIUM |
| **Support Strength** | Loan-level aggregate | 🟢 STRONG |

All calculations run **off-chain** with 30-minute cache. Results guide decisions but don't affect smart contracts.

---

## Loan-Level Support Strength

For the entire loan, we aggregate proximity across all lenders:

```
N_connected = lenders with social connections to borrower
P_network = (N_connected / N_total) × 100
```

| Support Strength | Criteria | Meaning |
|-----------------|----------|---------|
| 🟢 **STRONG** | P_network ≥ 60% | Most lenders know borrower |
| 🟡 **MODERATE** | 30% ≤ P_network < 60% | Some lenders know borrower |
| 🟠 **WEAK** | 0% < P_network < 30% | Few lenders know borrower |
| ⚪ **NONE** | P_network = 0% | No social connections |

{% hint style="success" %}
**Research-Backed Performance**

**STRONG support loans:** 2-5% default rate
**WEAK/NONE support loans:** 20-40% default rate

Social validation is the strongest predictor of repayment.
{% endhint %}

---

## Decision Framework

### If You Know the Borrower

| Your Risk Tier | Recommendation |
|---------------|---------------|
| 🟢 **LOW RISK** | **Fund confidently.** Strong social ties and accountability. |
| 🟡 **MEDIUM RISK** | **Proceed with caution.** Consider a smaller amount. |
| 🔴 **HIGH RISK** | **Be skeptical.** Only fund if you can afford to lose it. |

---

### If You DON'T Know the Borrower

Check loan-level **Support Strength**:

| Support Strength | Recommendation |
|-----------------|---------------|
| 🟢 **STRONG** | **Safe to fund.** Most lenders know borrower, early validation signals confidence. |
| 🟡 **MODERATE** | **Mixed signals.** Some network validation but also public funding. |
| 🟠 **WEAK** | **High risk.** Very few lenders know borrower. |
| ⚪ **NONE** | **Do not fund.** Zero social validation, speculative lending. |

---

## Best Practices

### For Lenders
✅ Check both your personal risk tier AND loan support strength
✅ Prioritize loans with STRONG support (better repayment rates)
✅ Contribute early if you're close friends (signals confidence)
✅ Diversify ($10 to 10 loans > $100 to 1 loan)

### For Borrowers
✅ Share with close connections first (higher trust scores)
✅ Explain your story clearly in metadata
✅ Start small to build reputation
✅ Repay on time for future loans

---

## Expected Distribution

Based on social network analysis:

| Risk Tier | % of Pairs | Typical Use Case |
|-----------|-----------|------------------|
| 🟢 LOW | 15-25% | Close friends, family |
| 🟡 MEDIUM | 30-40% | Friends-of-friends |
| 🔴 HIGH | 40-50% | Public lending, strangers |

{% hint style="info" %}
**Network Effects**

Most people have 150-300 close connections. With ~20% network overlap, you'll be LOW RISK to 30-60 people and MEDIUM RISK to 100-200 people.

Everyone else sees you as HIGH RISK until you build on-chain reputation.
{% endhint %}

---

## Next Steps

- **Understand the algorithm?** → [The Algorithm](the-algorithm.md)
- **Curious about social dynamics?** → [Trust Cascades](trust-cascades.md)
- **Worried about gaming?** → [Sybil Resistance](sybil-resistance.md)
- **Need technical details?** → [Implementation](implementation.md)

**Back to:** [Social Trust Scoring Overview](README.md)
