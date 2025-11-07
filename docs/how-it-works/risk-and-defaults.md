# Risk & Default Handling

## What Happens If Someone Doesn't Repay?

**Phase 0 uses 0% interest** - lenders give out of generosity, not for profit. This lets us gather behavioral data without complexity of interest calculation or legal enforcement.

Defaults are recorded on-chain and visible to all future lenders. **Redemption is possible** - borrowers can rebuild trust through smaller, successful loans.

---

## On-Chain Transparency

All repayment behavior is permanently recorded on Base:

- Total borrowed and repaid by address
- Number of active vs. completed loans
- Maturity dates vs. actual repayment dates

This creates a **permanent credit history** visible across DeFi.

---

## No Legal Recourse

Loans have **no legal enforcement**:
- No collections agencies
- No credit bureau reporting
- No lawsuits

Lenders rely on:
1. **Social pressure** from mutual connections
2. **On-chain reputation** visible to future lenders
3. **Community accountability**

---

## Why 0% Interest?

Zero interest lets us gather clean behavioral data and follows proven models:

**For lenders:** Give to help, not for profit - creates stronger social bonds

**For borrowers:** Repay from gratitude and reputation-building, not fear

**For LendFriend:** Clean dataset showing intrinsic motivation, not fear of penalties

{% hint style="success" %}
**Research shows it works:**
- Akhuwat (Islamic microfinance): **99.9% repayment rate** using interest-free loans [[9]](../references.md#grameen-bank)
- Kiva: 96.3% repayment on $1.8B+ in zero-interest loans [[10]](../references.md#kiva)
- Grameen Bank: 97-98% repayment using social collateral [[9]](../references.md#grameen-bank)

Removing profit motive strengthens social bonds and trust, leading to HIGHER repayment rates.
{% endhint %}

---

## What Happens in Different Scenarios

**Partial repayment:** Lenders claim funds pro-rata. Borrower's on-chain history shows partial repayment. Can still request smaller future loans.

**No repayment:** Lenders lose funds. Borrower's reputation permanently shows 0% repayment. Extremely unlikely to get funded again.

**Late repayment:** Lenders eventually get full funds back. On-chain history shows timing. Better than default, but affects future trust.

**Tipping:** Borrowers can repay more than 100% (e.g., $110 on $100 loan). Tips distribute proportionally to lenders, strengthen reputation, and signal financial health.

---

## Risk Mitigation

**For borrowers:**
- Start small ($100-500 for first loan)
- Repay early or add a tip (5-10% extra) to build reputation
- Keep lenders informed

**For lenders:**
- Check trust scores - only fund borrowers with social connections
- Diversify ($100 across 10 loans > $1000 on one)
- Follow early lenders - if close friends funded, it's a good signal

---

## What We Expect

Based on microfinance research, repayment correlates with social support:

- **Strong social support** (60%+ lenders know borrower): Best repayment rates (Grameen: 97-98%)
- **Moderate support** (30-60%): Moderate performance
- **Weak/no support** (<30%): Higher default risk

**Actual performance will be tracked and published on-chain** as we collect data.

---

## Lender Risk Acceptance

By contributing, lenders acknowledge:
- **No guarantee** of repayment
- **No legal recourse**
- **Social accountability** is the primary enforcement
- **On-chain transparency** is the primary protection

---

## Our Philosophy

**We don't:** Shame defaulters publicly (beyond on-chain data), sell debt to collections, sue borrowers, or block access permanently.

**We do:** Record behavior transparently, let community decide who to fund, allow redemption through smaller loans.

Financial exclusion got borrowers here. We won't exclude them further for struggling.

---

**Next:** [Technical Stack](technical-stack.md) · [Social Trust Scoring](social-trust-scoring/README.md) · [Risk Scoring](risk-scoring/README.md)
