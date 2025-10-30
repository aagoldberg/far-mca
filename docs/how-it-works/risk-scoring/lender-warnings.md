# Lender Warnings

## Transparent Risk Communication

Lenders see clear, prominent warnings before contributing to any loan. Warnings escalate based on risk grade.

---

## Visual Warning System

### 🟢 Green (Grades A-B): Minimal Warnings

```
✅ Low Risk Loan
- Borrower has strong repayment history
- Close social connection to you
- Loan size is reasonable for their history
```

**Action:** Lend confidently

---

### 🟡 Yellow (Grades C-D): Moderate Warnings

```
⚠️ Moderate Risk Loan
- Limited repayment history (1-3 loans)
- Moderate social connection
- Loan size is 2-5× their previous loans
→ Consider contributing a smaller amount
```

**Action:** Proceed with caution, consider smaller contribution

---

### 🔴 Red (Grades E-HR): Strong Warnings

```
🚨 High Risk Loan - Lend with Caution
- First-time borrower with NO repayment history
- Minimal or no social connection to you
- Large loan amount ($1,500) for first loan
→ This borrower has not yet proven they can repay
→ Only contribute what you can afford to lose
→ Expected default rate: >35%
```

**Action:** Only lend what you can afford to lose

---

## Specific Risk Flags

Lenders see individual risk flags on loan detail pages:

| Flag | Condition | Warning |
|------|-----------|---------|
| 🆕 **First Loan** | 0 completed loans | "First-time borrower with no repayment history" |
| 📈 **Large Request** | Loan > $500 with no history OR >5× previous max | "Unusually large loan relative to history" |
| ⚠️ **Past Default** | 1+ defaults | "Borrower has defaulted before (X times)" |
| 👥 **Weak Social Ties** | Social distance < 30 | "Minimal social connection between you and borrower" |
| 🆕 **New Account** | Farcaster quality < 0.5 | "Borrower has new/low-activity Farcaster account" |
| 🔄 **Recovery Loan** | Borrower in default recovery | "Borrower is rebuilding reputation after default" |

---

## Lender Tools

### Risk Tolerance Filtering

Filter loans by your comfort level:

```
☑ Show Grades A-B only (Low risk)
☐ Include Grade C (Moderate risk)
☐ Include Grades D-E (High risk)
☐ Include Grade HR (Very high risk)
```

### Portfolio Diversification

Dashboard shows your risk distribution:

```
Your Portfolio: $500 across 12 loans

Risk Distribution:
🟢 A-B: $300 (60%) - 8 loans
🟡 C-D: $150 (30%) - 3 loans
🔴 E-HR: $50 (10%) - 1 loan

Recommendation: Balanced portfolio with controlled high-risk exposure
```

---

## Decision Framework

### If You Know the Borrower

| Your Risk Grade | Recommendation |
|----------------|---------------|
| 🟢 **Grade A-B** | Fund confidently - Strong relationship provides accountability |
| 🟡 **Grade C-D** | Proceed cautiously - Consider smaller amount |
| 🔴 **Grade E-HR** | High risk - Only if you can afford to lose it |

### If You DON'T Know the Borrower

Check if others fund first:

| Support Strength | Recommendation |
|-----------------|---------------|
| **Many lenders (10+)** | Safe to join - Market validation |
| **Some lenders (3-9)** | Moderate validation - Assess their profiles |
| **Few lenders (1-2)** | High risk - May not fund |
| **No lenders yet** | Wait for others or skip |

---

## Best Practices

### For Lenders

✅ Check both risk grade AND social distance
✅ Diversify across multiple loans
✅ Start with Grade A-B loans to understand the system
✅ Only lend to Grade E-HR if you know them personally

### For Borrowers

✅ Start with small loans to build Grade A status
✅ Share with close friends first (better grades)
✅ Repay on-time to maintain high grades
✅ Avoid requesting 5×+ previous loan amounts

---

## Next Steps

- **Understand grading:** [Risk Grades](risk-grades.md)
- **Learn about constraints:** [Loan Constraints](loan-constraints.md)
- **Technical details:** [Implementation](implementation.md)

**Back to:** [Risk Scoring Overview](README.md)
