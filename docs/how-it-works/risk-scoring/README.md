# Risk Scoring

## Market-Driven Lending with Transparent Risk Assessment

LendFriend doesn't artificially limit loan amounts. Instead, we provide comprehensive risk information to lenders, who decide what risk they're comfortable with.

**Core Philosophy:** Transparency over restriction. Let the market find equilibrium.

---

## How It Works

Traditional P2P platforms like Prosper and LendingClub use risk grades (AA-HR, A-G) to disclose risk **without restricting loan amounts**. We follow the same model.

### Key Principles

**🎯 No Amount Limits**
- Borrowers request any amount they need
- Close friends can lend $1,000+ to first-timers
- Proven borrowers access capital immediately

**⏱️ Duration Limits Only**
- MVP Phase 1: 30 days max (all loans)
- MVP Phase 2: 60 days max
- MVP Phase 3: 90 days max
- **Why?** Fast feedback loop for behavioral data

**🔍 Risk Disclosure**
- Every loan gets Risk Grade (A-HR)
- Lenders see warnings and risk flags
- Market decides through funding behavior

---

## The Risk Grade System

We assign every loan a grade from **A (minimal risk) to HR (very high risk)** based on four factors:

```
Risk Grade = f(
  Repayment History (40%),
  Social Trust Score (30%),
  Loan Size Risk (20%),
  Account Quality (10%)
)
```

| Grade | Risk Level | Est. Default Rate | Typical Scenario |
|-------|-----------|-------------------|------------------|
| **A** 🟢 | Minimal | <5% | Excellent history + strong ties |
| **B** 🟢 | Low | 5-10% | Good history OR strong ties |
| **C** 🟡 | Moderate | 10-20% | Some history, moderate ties |
| **D** 🟡 | Elevated | 20-35% | Limited history, weak ties |
| **E** 🔴 | High | 35-50% | No history + large loan |
| **HR** 🔴 | Very High | >50% | First loan >$500, weak ties |

[→ Learn about Risk Grades](risk-grades.md)

---

## Examples: How Grades Work

### Example 1: Close Friend, First Loan
```
Borrower: Alice (0 completed loans)
Loan: $100 for 30 days
Lender: Bob (Social Distance: 92/100 - very close)

Risk Grade: B 🟢
Why: Strong social ties compensate for no history
Funding Speed: 1-2 days
```

### Example 2: Stranger, Large First Loan
```
Borrower: Carol (0 completed loans)
Loan: $1,500 for 30 days
Lender: Dave (Social Distance: 15/100 - minimal)

Risk Grade: HR 🔴
Why: No history + large amount + weak ties
Funding Speed: May never fund
```

### Example 3: Proven Borrower
```
Borrower: Eve (8 loans, 0 defaults, 90% on-time)
Loan: $2,000 for 30 days
Lender: Frank (Social Distance: 55/100 - moderate)

Risk Grade: A 🟢
Why: Excellent repayment history
Funding Speed: <1 day
```

---

## Lender Protection

### Visual Warning System

Lenders see clear warnings before contributing:

**🟢 Low Risk (A-B):**
```
✅ Low Risk Loan
- Borrower has strong repayment history
- Close social connection to you
- Loan size is reasonable
```

**🟡 Moderate Risk (C-D):**
```
⚠️ Moderate Risk Loan
- Limited repayment history
- Moderate social connection
- Consider contributing smaller amount
```

**🔴 High Risk (E-HR):**
```
🚨 High Risk - Lend with Caution
- First-time borrower with NO history
- Minimal social connection
- Large loan amount for first loan
→ Only contribute what you can afford to lose
→ Expected default rate: >35%
```

[→ Learn about Lender Warnings](lender-warnings.md)

---

## Borrower Incentives

While we don't restrict amounts, the **market naturally incentivizes** responsible borrowing:

### Lower Risk = Faster Funding
- **Grade A-B**: Fund in 1-3 days (large lender pool)
- **Grade C-D**: Fund in 3-7 days (fewer lenders)
- **Grade E-HR**: May not fund at all (very limited appetite)

### Clear Improvement Path
1. Start small ($100-200) → Grade B-C → Funds in 2 days
2. Repay on-time → Build history
3. Next loan larger ($500) → Grade A → Funds in 1 day
4. After 5+ successful loans → Request $2,000 → Grade A → Funds immediately

### Pre-Loan Estimator
Borrowers see estimated grade BEFORE creating loan:

```
Based on your details:
Estimated Risk Grade: B 🟢

Want to improve your grade?
- Start with smaller loan ($100-200) → Upgrade to A
- Share with close friends → Upgrade to A
```

[→ Learn about Loan Constraints](loan-constraints.md)

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

## Market Dynamics

### How the Market Self-Regulates

**High-Risk Loans Get Fewer Lenders:**
- Grade HR loan requesting $1,500: May get 0-2 lenders
- Grade A loan requesting $1,500: Gets 10-15 lenders in hours

**Natural Loan Size Discovery:**
- First-timer requests $2,000: Grade HR → Doesn't fund
- First-timer adjusts to $200: Grade C → Funds in 3 days
- Learns optimal size through market feedback

**Social Trust Premium:**
- Stranger lending $1,000 to first-timer: Grade HR (won't fund)
- Close friend lending $1,000 to first-timer: Grade B (funds quickly)
- **Result:** Close friends can take larger risks, strangers can't

---

## Phase Rollout

### Phase 1: Basic Grading (Launch)
- Risk grade calculation
- Visual warnings
- Risk flags display

### Phase 2: Lender Tools (Month 2)
- Filter by risk grade
- Portfolio risk dashboard
- Risk tolerance settings

### Phase 3: Advanced Features (Month 3)
- Pre-loan grade estimator
- "Improve Your Grade" suggestions
- Historical funding speed data

[→ Learn about Implementation](implementation.md)

---

## Learn More

**Understand the grades:**
- [Risk Grades](risk-grades.md) - How A-HR grades are calculated

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
