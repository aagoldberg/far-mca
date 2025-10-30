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

## How Are Grades Calculated?

Grades are calculated using four weighted factors:
- **Repayment History** (40%) - Past loan performance
- **Social Trust Score** (30%) - Connection strength to lender
- **Loan Size Risk** (20%) - Amount relative to history
- **Account Quality** (10%) - Farcaster account health

Points from each factor are combined into a total score (0-100), which maps to a letter grade.

**For the detailed scoring methodology and grade thresholds,** see [Calculation](calculation.md).

---

**Learn More:**
- [Calculation](calculation.md) - Detailed scoring methodology and thresholds
- [Examples](examples.md) - Real calculation scenarios
- [Lender Warnings](lender-warnings.md) - What lenders see

**Back to:** [Risk Scoring](README.md)
