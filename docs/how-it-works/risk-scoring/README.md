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

**From P2P lending research:** Platforms that provide detailed risk information see lower default rates because:
1. Lenders make informed decisions
2. High-risk loans get filtered by market (don't fund)
3. Borrowers self-select appropriate loan sizes

**Our model draws from:**

- **Prosper (2006-2020)**: Pioneered transparent risk grades (AA-HR) without loan amount restrictions. Proved market-based filtering works at scale—lenders could see risk and decide for themselves, creating natural market equilibrium.

- **Grameen Bank (1983-present)**: 97-98% repayment rate using social collateral instead of traditional collateral. Demonstrated that social accountability can substitute for financial guarantees in lending.

- **Iyer et al. (2016)**: Research on Prosper.com showing loans with friend endorsements have 22% lower default rates. This is why our Social Trust Score carries 30% weight in the risk model.

**Why short loan terms?** MVP uses 30-90 day durations (microfinance best practice) to create fast feedback loops for gathering behavioral data and refining the model.

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
