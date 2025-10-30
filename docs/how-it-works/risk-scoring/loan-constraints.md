# Loan Constraints

## Duration Limits Only

LendFriend limits loan **duration** but not **amount**.

---

## MVP Duration Limits

| Phase | Max Duration | Why |
|-------|-------------|-----|
| **Phase 1** | 30 days | Fast feedback (12× per year vs 1×) |
| **Phase 2** | 60 days | Expand based on data |
| **Phase 3** | 90 days | Mature system |

**All borrowers** get same duration limit regardless of history.

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
