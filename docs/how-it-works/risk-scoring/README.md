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

Grades are based on four factors:

**1. Repayment History**
- Past loan performance (on-time, late, defaults)
- Number of completed loans
- Most predictive factor for future behavior

**2. Social Trust Score**
- Connection strength between lender and borrower
- Based on Adamic-Adar algorithm (see [Social Trust Scoring](../social-trust-scoring/README.md))
- Weights selective mutual friends higher

**3. Loan Size Risk**
- Amount requested relative to borrower's history
- Larger loans for new borrowers = higher risk

**4. Account Quality**
- Farcaster account age and activity
- Filters spam/bot accounts

**The exact weighting and scoring formulas will be refined as we collect repayment data.** Phase 0 focuses on gathering behavioral data to build a robust risk model informed by actual performance, not assumptions.

---

## Why This Works

**Research shows:**
- Prosper proved transparent risk grades work at scale [[36]](../../references.md#peer-to-peer-lending-and-reputation)
- Friend bids (capital contributions) reduce defaults by 14% [[12]](../../references.md#iyer-et-al-2016)
- Market-based filtering reduces defaults (high-risk loans don't fund)

**Key principles:**
- Lenders make informed decisions
- Market naturally filters high-risk loans
- Borrowers self-select appropriate amounts
- Short terms (30-90 days) create fast feedback loops

---

## Security & Gaming Resistance

Risk grades incorporate quality filtering and Sybil resistance mechanisms. See [Anti-Gaming & Sybil Resistance](../anti-gaming.md) for how we defend against fake accounts and coordinated manipulation.

---

## Lender Warnings

Before contributing, lenders see clear warnings based on risk level. [View warning system →](lender-warnings.md)

---

---

## Cashflow-Based Risk Scoring (Phase 1+)

For borrowers with connected Shopify, Stripe, or Square accounts, we incorporate cashflow-based signals into risk assessment. This uses industry-researched models from FICO SBSS, Kabbage, and e-commerce RBF lenders.

[View Cashflow Risk Model →](cashflow-risk-model.md)

---

**Next:** [Cashflow Risk Model](cashflow-risk-model.md) · [Social Trust Scoring](../social-trust-scoring/README.md) · [Anti-Gaming](../anti-gaming.md) · [Lender Warnings](lender-warnings.md)
