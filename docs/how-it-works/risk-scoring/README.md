# Risk Scoring

## Market-Driven Lending with Transparent Risk Assessment

LendFriend provides comprehensive risk information to lenders, who decide what risk they're comfortable with.

---

## How It Works

Traditional P2P platforms like Prosper and LendingClub use risk grades (AA-HR, A-G) to disclose risk **without restricting loan amounts**. We follow the same model.

Every loan receives a grade from **A (minimal risk) to HR (very high risk)** based on four factors:
- **Repayment History** - Past loan performance
- **Social Trust Score** - Connection strength to lender
- **Loan Size Risk** - Amount relative to history
- **Account Quality** - Farcaster account health

We'll continually refine the model as we collect more repayment data. Lenders see clear warnings before contributing, and the market naturally filters high-risk loans through slower funding or no funding at all.

---

## Why This Approach?

### Research-Backed

| Principle | Source | Application |
|-----------|--------|-------------|
| **Risk grades, no limits** | Prosper, LendingClub | A-HR grading system |
| **Transparency reduces defaults** | P2P research | Comprehensive warnings |
| **Short-term for MVP** | Microfinance | 30-90 day duration limits |
| **Market efficiency** | P2P platforms | Lenders decide risk tolerance |
| **Social offsets no history** | Grameen Bank | High trust = better grade |

### Key Insight

**From P2P lending research:** Platforms that provide detailed risk information see lower default rates because:
1. Lenders make informed decisions
2. High-risk loans get filtered by market (don't fund)
3. Borrowers self-select appropriate loan sizes

---

## Learn More

**Understand the grades:**
- [Risk Grades](risk-grades.md) - How A-HR grades are calculated
- [Calculation](calculation.md) - The 4 factors explained
- [Examples](examples.md) - Real calculation scenarios

**See what lenders see:**
- [Lender Warnings](lender-warnings.md) - Warning system and risk flags

**Understand constraints:**
- [Loan Constraints](loan-constraints.md) - Duration limits and borrower incentives

**Technical details:**
- [Implementation](implementation.md) - API, smart contracts, phases

---

## Related Topics

- **Social trust affects risk:** [Social Trust Scoring](../social-trust-scoring/README.md)
- **What happens on default:** [Risk & Default Handling](../risk-and-defaults.md)
- **Technical implementation:** [Smart Contract Flow](../smart-contract-flow.md)

**Questions?** Join our [Discord](https://discord.gg/lendfriend) or file an issue on [GitHub](https://github.com/aagoldberg/far-mca).
