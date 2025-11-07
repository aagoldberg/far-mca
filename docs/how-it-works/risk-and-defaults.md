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

{% hint style="success" %}
**Research shows:**
- Grameen Bank achieved 97-98% repayment using group lending and social pressure [[9]](../references.md#grameen-bank)
- Social proximity improves repayment by 10 percentage points [[6]](../references.md#karlan-et-al-2009)
- Borrowers from regions with higher social capital have lower default rates
{% endhint %}

We expect repayment rates to correlate with social support strength:

- **Strong social ties** between borrowers and lenders → better repayment
- **Moderate connections** → moderate performance
- **Weak or no connections** → higher risk

**We'll track actual performance on-chain** to understand which trust signals best predict repayment in our model.

---

## Lender Risk Acceptance

By contributing, lenders acknowledge:
- **No guarantee** of repayment
- **No legal recourse**
- **Social accountability** is the primary enforcement
- **On-chain transparency** is the primary protection

---

## Our Philosophy

**Phase 0 approach:**
- Record behavior transparently on-chain
- Let community decide who to fund
- Allow redemption through smaller loans
- No legal recourse or traditional collections

**As we learn:** We'll let the data guide what's needed. Our priority is helping people access credit while protecting lenders. If defaults become systemic, we're open to exploring additional mechanisms - but we start with social accountability first.

---

**Next:** [Technical Stack](technical-stack.md) · [Social Trust Scoring](social-trust-scoring/README.md) · [Risk Scoring](risk-scoring/README.md)
