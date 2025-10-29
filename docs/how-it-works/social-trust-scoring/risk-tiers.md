# Risk Tiers

## How Trust Scores Translate to Risk Levels

Every lender-borrower pair gets both a numerical trust score (0-100) and a risk classification. This helps lenders quickly assess social proximity without needing to understand the underlying algorithm.

---

## Individual Risk Classification

Individual lender-borrower trust scores determine risk tier:

| Risk Level | Criteria | What It Means |
|-----------|----------|---------------|
| 🟢 **LOW RISK** | AA_eff ≥ 10 **OR** S_total ≥ 60 | Close social ties, tight-knit community. Strong confidence in repayment. |
| 🟡 **MEDIUM RISK** | AA_eff ≥ 2.5 **OR** S_total ≥ 30 | Some shared connections. Moderate social accountability. |
| 🔴 **HIGH RISK** | AA_eff < 2.5 **AND** S_total < 30 | Few or no mutual connections. Minimal social pressure to repay. |

{% hint style="info" %}
**Dual Criteria System**

We use **OR** logic to capture different types of strong connections:
- **AA_eff ≥ 10**: Many selective mutual friends (tight community)
- **S_total ≥ 60**: High overall score (direct relationship + network overlap)

Either condition qualifies for the tier, ensuring we don't miss genuine connections.
{% endhint %}

---

## What Lenders See

When you contribute to a loan, the UI displays your social proximity to the borrower:

| Metric | Description | Example |
|--------|-------------|---------|
| **Mutual Connections** | Count of shared Farcaster connections | 25 mutual |
| **Social Distance** | Score from 0-100 (higher = closer) | 45/100 |
| **Risk Tier** | LOW / MEDIUM / HIGH based on thresholds | 🟡 MEDIUM RISK |
| **Support Strength** | Loan-level aggregate (see below) | 🟢 STRONG |

All calculations run **off-chain** with a 30-minute cache. Results guide lender decisions but don't affect smart contract logic.

---

## Loan-Level Support Strength

For the entire loan, we aggregate proximity across all lenders:

```
N_connected = number of lenders with social connections to borrower
N_total = total number of lenders
P_network = (N_connected / N_total) × 100
```

### Support Strength Classification

| Support Strength | Criteria | Meaning |
|-----------------|----------|---------|
| 🟢 **STRONG** | P_network ≥ 60% | Most lenders know borrower—strong social accountability |
| 🟡 **MODERATE** | 30% ≤ P_network < 60% | Some lenders know borrower—mixed social/public trust |
| 🟠 **WEAK** | 0% < P_network < 30% | Few lenders know borrower—mostly public funding |
| ⚪ **NONE** | P_network = 0% | No social connections—purely speculative lending |

{% hint style="success" %}
**Research-Backed Performance**

**STRONG support loans:** 2-5% default rate (similar to Grameen Bank)

**WEAK/NONE support loans:** 20-40% default rate

Social validation is the strongest predictor of repayment.
{% endhint %}

---

## Example: Loan Progression

Let's see how support strength changes as a loan gets funded:

### State 1: Early Funding

| Lender | Amount | Risk Tier | Connected? |
|--------|--------|-----------|-----------|
| Alice | $20 | 🟢 LOW RISK | ✅ Yes (25 mutual) |
| Bob | $15 | 🟢 LOW RISK | ✅ Yes (18 mutual) |
| Charlie | $10 | 🟡 MEDIUM RISK | ✅ Yes (5 mutual) |

**Support Strength:** 3/3 = 100% → 🟢 **STRONG**

---

### State 2: Mid Funding

| Lender | Amount | Risk Tier | Connected? |
|--------|--------|-----------|-----------|
| Alice | $20 | 🟢 LOW RISK | ✅ Yes |
| Bob | $15 | 🟢 LOW RISK | ✅ Yes |
| Charlie | $10 | 🟡 MEDIUM RISK | ✅ Yes |
| Dave | $30 | 🔴 HIGH RISK | ❌ No (0 mutual) |
| Eve | $25 | 🔴 HIGH RISK | ❌ No (0 mutual) |

**Support Strength:** 3/5 = 60% → 🟢 **STRONG** (barely)

---

### State 3: Fully Funded

| Lender | Amount | Risk Tier | Connected? |
|--------|--------|-----------|-----------|
| Alice | $20 | 🟢 LOW RISK | ✅ Yes |
| Bob | $15 | 🟢 LOW RISK | ✅ Yes |
| Charlie | $10 | 🟡 MEDIUM RISK | ✅ Yes |
| Dave | $30 | 🔴 HIGH RISK | ❌ No |
| Eve | $25 | 🔴 HIGH RISK | ❌ No |
| Frank | $40 | 🔴 HIGH RISK | ❌ No |
| Grace | $35 | 🔴 HIGH RISK | ❌ No |
| Henry | $25 | 🔴 HIGH RISK | ❌ No |

**Support Strength:** 3/8 = 37.5% → 🟡 **MODERATE**

{% hint style="warning" %}
**Watch Support Strength Drop**

As more strangers fund, support strength can decrease even though the loan is fully funded. **STRONG** loans have better repayment outcomes than **WEAK** loans.
{% endhint %}

---

## Decision Framework for Lenders

### If You're in the Borrower's Network

| Your Risk Tier | Recommendation |
|---------------|---------------|
| 🟢 **LOW RISK** | **Fund confidently.** You have strong social ties and accountability mechanisms. This is like lending to a close friend. |
| 🟡 **MEDIUM RISK** | **Proceed with caution.** You share some connections but not many. Consider contributing a smaller amount. |
| 🔴 **HIGH RISK** | **Be skeptical.** No social connections means no social pressure to repay. Only fund if you trust the story and can afford to lose the money. |

---

### If You're NOT in the Borrower's Network

Check the loan-level **Support Strength**:

| Support Strength | Recommendation |
|-----------------|---------------|
| 🟢 **STRONG** | **Safe to fund.** Most lenders know the borrower. Their early validation signals strong confidence. |
| 🟡 **MODERATE** | **Mixed signals.** Some network validation but also public funding. Medium confidence. |
| 🟠 **WEAK** | **High risk.** Very few lenders know the borrower. Minimal social accountability. |
| ⚪ **NONE** | **Do not fund.** Zero social validation. This is speculative lending with no reputation backing. |

---

## Best Practices

### For Lenders

✅ **Check both your personal risk tier AND loan-level support strength**

✅ **Prioritize loans with STRONG support** - They have the best repayment rates

✅ **Contribute early if you're close friends** - Your contribution signals confidence to others

✅ **Diversify** - Spread $100 across 10 loans instead of $1000 on one loan

✅ **Follow early lenders** - If close friends funded, it's a good signal

❌ **Don't ignore WEAK support loans** - They have 4-8× higher default rates

---

### For Borrowers

✅ **Share with close connections first** - They'll give you higher trust scores and signal confidence to others

✅ **Explain your story clearly** - Metadata helps lenders who don't know you personally

✅ **Start small** - Build reputation with smaller loans before requesting larger amounts

✅ **Repay on time** - Good repayment history improves future loan terms

✅ **Update supporters** - Keep lenders informed as you reach milestones

❌ **Don't overpromise** - Only borrow what you can confidently repay

---

## Risk Tier Distribution (Expected)

Based on social network analysis research, we expect:

| Risk Tier | % of Lender-Borrower Pairs | Typical Use Case |
|-----------|---------------------------|------------------|
| 🟢 LOW RISK | 15-25% | Close friends, family, tight communities |
| 🟡 MEDIUM RISK | 30-40% | Friends-of-friends, extended network |
| 🔴 HIGH RISK | 40-50% | Public lending, distant/no connections |

{% hint style="info" %}
**Network Effects**

Most people have 150-300 close connections (Dunbar's number). With ~20% average network overlap, you'll be LOW RISK to 30-60 people and MEDIUM RISK to 100-200 people.

Everyone else sees you as HIGH RISK until you build on-chain reputation.
{% endhint %}

---

## Future: Reputation-Based Risk Adjustment

{% hint style="warning" %}
**Phase 2 Enhancement**

In future versions, risk tiers will incorporate on-chain repayment history:

- **Perfect repayment (3+ loans)**: Risk tier upgraded by one level
- **Late payments**: Risk tier downgraded by one level
- **Defaults**: Risk tier set to HIGH for all future loans

Social trust + repayment history = more accurate risk assessment.
{% endhint %}

---

## Next Steps

- **Understand the algorithm?** → [The Algorithm](the-algorithm.md)
- **Curious about social dynamics?** → [Trust Cascades](trust-cascades.md)
- **Worried about gaming?** → [Sybil Resistance](sybil-resistance.md)
- **Need technical details?** → [Implementation](implementation.md)

---

**Back to:** [Social Trust Scoring Overview](README.md)
