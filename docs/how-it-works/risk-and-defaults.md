# Risk & Default Handling

## What Happens If Someone Doesn't Repay?

Phase 1 uses **0% interest**, which means lenders are giving out of generosity, not chasing returns. This lets us gather behavioral data without the complexity of interest calculation or legal enforcement.

Defaults are recorded on-chain and visible to all future lenders, but we don't block borrowers from trying again. **Redemption is possible**—borrowers can rebuild their track record through smaller, successful loans.

## On-Chain Transparency

All repayment behavior is permanently recorded on Base L2. Anyone can query:

- ✅ Total amount borrowed by an address
- ✅ Total amount repaid
- ✅ Number of active vs completed loans
- ✅ Maturity dates vs actual repayment dates

This creates a **permanent credit history** that follows you across DeFi.

## No Legal Recourse (Phase 1)

Current loans have **no legal enforcement**:
- ❌ No collections agencies
- ❌ No credit bureau reporting
- ❌ No lawsuits
- ✅ Pure social accountability and on-chain reputation

Lenders rely on:
1. **Social pressure** from mutual connections
2. **On-chain reputation** visible to future lenders
3. **Community trust** in the borrower's story

> **Future**: Optional credit reporting for borrowers who want to build traditional credit history

## Why Start at 0% Interest?

Zero interest aligns incentives and follows proven models:

### For Lenders
- Give because they want to help, not for profit
- Pure altruism creates stronger social bonds
- Lower stakes = more experimentation

### For Borrowers
- Repay from gratitude and reputation-building
- No financial penalty pressure
- Pure behavioral signal: "I'm trustworthy"

### For LendFriend
- **Clean dataset**: Repayments happen from intrinsic motivation, not fear
- **Behavioral insights**: More valuable for future underwriting than noisy interest-bearing data
- **Community building**: Generosity creates loyalty

### Research Support

Zero-interest lending is not experimental—it has proven track records:

- **Akhuwat (Islamic Microfinance)**: 99.9% repayment rate using completely interest-free loans (Qard Hassan) distributed through mosques
- **Kiva**: Zero interest to borrowers, 96.3% repayment rate across $1.8B+ in loans
- **Islamic Finance Research**: Interest-free models create stronger social accountability and community bonds

{% hint style="success" %}
**Key insight**: Removing the profit motive from lending strengthens social bonds and trust, leading to HIGHER repayment rates, not lower. ([See research](../references.md))
{% endhint %}

## Default Scenarios

### Scenario 1: Partial Repayment
**What happens**: Borrower repays 60% of loan, then goes silent

- ✅ Lenders claim their 60% pro-rata
- 📊 Borrower's reputation shows 60% repayment ratio
- ⚠️ Future lenders see this history
- 🔄 Borrower can still request new loans (smaller amounts)

### Scenario 2: Zero Repayment
**What happens**: Borrower takes funds, never repays

- ❌ Lenders lose their funds
- 📊 Borrower's reputation shows 0% repayment
- ⚠️ Extremely unlikely to get funded again
- 🚫 Social reputation damaged permanently

### Scenario 3: Late Repayment
**What happens**: Borrower repays 100% but 6 months late

- ✅ Lenders get full funds back
- 📊 Reputation shows 100% repayment but poor timing
- ⚠️ Future loans may have shorter maturity periods
- ✅ Still considered better than default

### Scenario 4: Overpayment / Tipping
**What happens**: Borrower repays 110% of loan ($110 on $100 principal)

- ✅ Lenders receive their contribution + proportional tip
- 📊 Borrower's reputation shows 110% repayment (exceptional)
- 🌟 Builds stronger relationships with lenders
- ✅ Signals financial health and gratitude
- 🚀 Future loans likely to fund faster with better support

## Risk Mitigation Strategies

### For Borrowers
1. **Start small**: Request $100-500 for first loan
2. **Overfund buffer**: Request slightly less than needed
3. **Early repayment**: Pay back early to build trust
4. **Add a tip**: Repay 105-110% to show gratitude and strengthen reputation
5. **Regular updates**: Keep lenders informed

### For Lenders
1. **Check trust scores**: Only fund borrowers with social connections
2. **Diversify**: Spread $100 across 10 loans instead of $1000 on one
3. **Follow early lenders**: If close friends funded, it's a good signal
4. **Watch support strength**: Strong/Moderate = safer bets

## Future: Interest-Bearing Loans

Once we have 100+ completed loans, we'll introduce risk-based pricing:

### Dynamic Interest Rates
```
Rate = BaseRate + RiskPremium(Rep)

Example:
- High Rep (>80): 0% (gift economy continues)
- Medium Rep (50-80): 5% APR
- Low Rep (<50): 15% APR
- No history: 25% APR or declined
```

### Lender Insurance Pools (Optional)
- Lenders can pay 2% fee for default insurance
- Pool covers first 50% of defaults
- Incentivizes risky lending with safety net

### Traditional Credit Integration
- Report repayments to credit bureaus
- Build real-world credit score
- Bridge crypto reputation to TradFi

## Performance Expectations

Based on established microfinance research, repayment performance correlates strongly with social support:

| Loan Type | Expected Performance | Research Basis |
|-----------|----------------------|----------------|
| **Strong social support** (P_network ≥ 60%) | Best repayment rates | Grameen Bank: 97-98% repayment |
| **Moderate support** (30-60%) | Moderate repayment rates | Mixed social ties show intermediate performance |
| **Weak/No support** (<30%) | Higher default risk | Minimal social accountability |

**Actual performance will be tracked and published quarterly** on-chain as the platform builds real-world data.

### Benchmarks from Established Institutions

| Institution | Repayment Rate | Default Rate | Model |
|------------|---------------|--------------|-------|
| **Grameen Bank** | 97-98% | 2-3% | Group lending |
| **Kiva** | 96.3% | 3.7% | P2P crowdfunding |
| **Akhuwat** | 99.9% | 0.1% | Zero-interest, mosque-based |

{% hint style="info" %}
LendFriend combines elements from all three models: zero-interest (Akhuwat/Kiva), social connections (Grameen), and peer-to-peer crowdfunding (Kiva). [See complete research](../references.md)
{% endhint %}

## Lender Risk Acceptance

By contributing to a loan, lenders acknowledge:

1. **No guarantee** of repayment
2. **No legal recourse** in Phase 1
3. **Social accountability** is the primary enforcement
4. **On-chain transparency** is the primary protection

This is explicitly stated in the UI before contributing.

## Ethical Considerations

### We Don't
- ❌ Shame defaulters publicly (beyond on-chain data)
- ❌ Sell debt to collections agencies
- ❌ Sue borrowers for defaults
- ❌ Block access permanently

### We Do
- ✅ Record behavior transparently
- ✅ Let community decide who to fund
- ✅ Allow redemption through smaller loans
- ✅ Focus on rehabilitation, not punishment

**Philosophy**: Financial exclusion got borrowers here. We won't exclude them further for struggling.

## Emergency Situations

For borrowers facing genuine hardship:
- Contact lenders directly (contact info in metadata)
- Explain situation transparently
- Negotiate payment plan
- Many lenders will be understanding

**Community support**: We're exploring mutual aid pools for borrowers hit by unexpected crises.

---

**Next**: See the [Technical Stack](technical-stack.md) powering LendFriend
