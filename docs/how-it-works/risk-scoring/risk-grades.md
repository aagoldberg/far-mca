# Risk Grades

## The A-HR Scale

Every loan gets a grade from A (minimal risk) to HR (very high risk).

**Note:** These grades, weights, and default rate estimates are initial parameters based on P2P lending research. We'll continuously refine the model and adjust parameters as we collect more repayment data.

---

## Grade Meanings

| Grade | Risk | Est. Default | Description |
|-------|------|-------------|-------------|
| **A** 🟢 | Minimal | <5% | Excellent history + strong ties |
| **B** 🟢 | Low | 5-10% | Good history OR strong ties |
| **C** 🟡 | Moderate | 10-20% | Some history, moderate ties |
| **D** 🟡 | Elevated | 20-35% | Limited history or weak ties |
| **E** 🔴 | High | 35-50% | No history + large loan |
| **HR** 🔴 | Very High | >50% | High risk situation or recovery |

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
