# Loan Constraints

## Duration Limits Only

LendFriend limits loan **duration** but not **amount**.

---

## Duration Approach

**Starting point:** Loans begin at **90-day terms** (3 months), with lump sum repayment at maturity.

**Future expansion:** As the platform matures and collects repayment data, we can incrementally elongate terms (6 months, 12 months, etc.) for qualified borrowers.

**All borrowers** get same duration limit regardless of history.

{% hint style="info" %}
**Why 90 days?** Short-term loans reduce risk for first-time borrowers while keeping repayment manageable. Research shows 3-month terms work well for building initial trust.
{% endhint %}

---

## Why Lump Sum Repayment (No Installments)?

**Initial approach:** Single payment at maturity rather than weekly/monthly installments.

**Research backing:** Field & Pande (2008) found that **less frequent repayments did not increase defaults** in microfinance lending. Their randomized trial with 1,026 first-time borrowers in India showed monthly repayments had the same default rates as traditional weekly installments, while reducing borrower stress and collection costs.

**Why this works for 90-day loans:**
- Simpler for borrowers (one payment vs multiple)
- Reduces transaction costs and cognitive load
- Research shows frequency doesn't affect repayment
- Appropriate for short-term loans

**With maturity:** As we elongate terms (6+ months), we can introduce installment options for borrowers who prefer gradual repayment. Research shows installments become more valuable for longer durations.

[See research: Field, E., & Pande, R. (2008). "Repayment Frequency and Default in Microfinance: Evidence From India." *Journal of the European Economic Association*, 6(2-3), 501-509.]

---

## Why No Amount Limits?

**Market decides through risk grades:**

- Close friend lending $1,000 to first-timer: Grade B (funds quickly)
- Stranger lending $1,000 to first-timer: Grade HR (won't fund)

**Result:** Social trust determines appropriate loan sizes naturally.

---

## How Borrowers Are Incentivized

### Lower Risk = Faster Funding

| Grade | Funding Speed |
|-------|--------------|
| A-B 🟢 | 1-3 days |
| C-D 🟡 | 3-7 days |
| E-HR 🔴 | May not fund |

### Pre-Loan Estimator

Borrowers see before creating loan:

```
$100 loan: Grade B 🟢 (Funds in 2 days)
$1,500 loan: Grade HR 🔴 (May not fund)

Recommendation: Start with $100-200
```

**Natural learning:** Market teaches borrowers to start small.

---

## Expected Loan Sizes

Market will naturally create distribution:

| Size | % of Loans | Typical Use |
|------|-----------|-------------|
| $50-200 | 40-50% | First loans |
| $201-500 | 30-40% | Building history |
| $501-1000 | 15-20% | Established |
| $1001+ | 5-10% | Proven OR close friends |

---

**Next:** [Implementation](implementation.md) | **Back to:** [Risk Scoring](README.md)
