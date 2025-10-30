# Risk Grades

## The A-HR Scale

Every loan gets a grade from A (minimal risk) to HR (very high risk).

**Note:** These grades and weights are initial parameters based on P2P lending research. We'll continuously refine the model and adjust parameters as we collect more repayment data.

---

## Grade Meanings

| Grade | Risk | Description |
|-------|------|-------------|
| **A** 🟢 | Minimal | Excellent history + strong ties |
| **B** 🟢 | Low | Good history OR strong ties |
| **C** 🟡 | Moderate | Some history, moderate ties |
| **D** 🟡 | Elevated | Limited history or weak ties |
| **E** 🔴 | High | No history + large loan |
| **HR** 🔴 | Very High | High risk situation or recovery |

**Note on default rates:** Once we collect sufficient repayment data, we'll publish estimated default rates by grade to help lenders make informed decisions.

---

## How Grades Are Calculated

Based on 4 weighted factors:

```
Grade = History (40%) + Social Trust (30%) + Loan Size (20%) + Quality (10%)

Total points (0-100) → Grade:
- 80-100 points = A
- 65-79 points = B
- 50-64 points = C
- 35-49 points = D
- 20-34 points = E
- 0-19 points = HR
```

**Important:** These weights (40%, 30%, 20%, 10%) and grade thresholds are initial estimates informed by P2P lending research. As we collect actual repayment data, we'll update the model parameters to improve accuracy.

[→ See detailed calculation](calculation.md) | [→ See examples](examples.md)

---

**Learn More:**
- [How Calculation Works](calculation.md)
- [Calculation Examples](examples.md)
- [Lender Warnings](lender-warnings.md)

**Back to:** [Risk Scoring](README.md)
