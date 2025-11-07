# Risk Scoring

LendFriend provides transparent risk assessment to lenders, who decide what risk they're comfortable with. We follow Prosper and LendingClub's model: disclose risk clearly, let the market decide.

---

## Risk Grades

Every loan receives a grade from **A (minimal risk) to HR (very high risk)**:

| Grade | Risk | Description |
|-------|------|-------------|
| **A** 🟢 | Minimal | Excellent history + strong ties |
| **B** 🟢 | Low | Good history OR strong ties |
| **C** 🟡 | Moderate | Some history, moderate ties |
| **D** 🟡 | Elevated | Limited history or weak ties |
| **E** 🔴 | High | No history + large loan |
| **HR** 🔴 | Very High | High risk situation or recovery |

**High risk grades (E-HR)** may not fund successfully. Borrowers should start smaller or build their network first.

---

## How Grades Are Calculated

Four weighted factors (0-100 points total):

**1. Repayment History (40%)**
- 10+ loans, 0 defaults: 40 points
- 4-9 loans, 0 defaults: 32 points
- 1-3 loans, 0 defaults: 24 points
- First-time borrower: 12 points
- Any defaults: 0-8 points

**2. Social Trust Score (30%)**
- Based on Adamic-Adar algorithm (see [Social Trust Scoring](../social-trust-scoring/README.md))
- Close connections: 30 points
- Some connections: 15-25 points
- No connections: 0-10 points

**3. Loan Size Risk (20%)**
- Small relative to history: 20 points
- Medium: 10-15 points
- Large for borrower: 0-10 points

**4. Account Quality (10%)**
- Active, verified account: 10 points
- Basic account: 5 points
- Low quality: 0-5 points

Total points map to grades: 90+ = A, 80+ = B, 70+ = C, 60+ = D, 50+ = E, <50 = HR

---

## Why This Works

**Research shows:**
- Prosper proved transparent risk grades work at scale [[36]](../../references.md#peer-to-peer-lending-and-reputation)
- Loans with friend endorsements have 22% lower defaults [[3]](../../references.md#iyer-et-al-2016)
- Market-based filtering reduces defaults (high-risk loans don't fund)

**Key principles:**
- Lenders make informed decisions
- Market naturally filters high-risk loans
- Borrowers self-select appropriate amounts
- Short terms (30-90 days) create fast feedback loops

---

## Lender Warnings

Before contributing, lenders see clear warnings based on risk level. [View warning system →](lender-warnings.md)

---

**Next:** [Social Trust Scoring](../social-trust-scoring/README.md) · [Lender Warnings](lender-warnings.md) · [Research](../../references.md)
