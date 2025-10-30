# Loan Constraints

## Duration Limits, Not Amount Limits

LendFriend restricts loan **duration** during MVP but allows borrowers to request **any amount**.

**Philosophy:** Let the market decide appropriate loan sizes through risk disclosure and funding behavior.

---

## MVP Duration Limits

To gather behavioral data quickly and maintain manageable risk:

| Phase | Max Duration | Reason |
|-------|-------------|---------|
| **Phase 1** (Months 1-3) | **30 days** | Rapid feedback loop, 12× data points per year |
| **Phase 2** (Months 4-6) | **60 days** | Expand based on Phase 1 data |
| **Phase 3** (Months 7+) | **90 days** | Mature system, longer terms available |

**All borrowers subject to same duration limits** regardless of history or risk grade.

---

## Why No Amount Limits?

### 1. Market Efficiency

**Lenders know their risk tolerance better than the platform.**

Examples:
- Close friend lending $1,000 to first-timer: Grade B (funds quickly)
- Stranger lending $1,000 to first-timer: Grade HR (won't fund)

**Result:** Social trust determines appropriate loan sizes naturally.

### 2. Faster Liquidity

Proven borrowers access capital immediately without artificial caps:
- Traditional system: "Sorry, you can only borrow $500"
- LendFriend: Request $2,000 → Grade A → Funds in hours

### 3. Natural Screening

High-risk loans get fewer lenders (or none):
- Grade HR loan: 0-2 lenders, may not fund
- Grade A loan: 10-15 lenders in hours

**Market-based limits** emerge from funding behavior, not platform rules.

---

## Why Duration Limits?

### 1. Faster Data Collection

```
30-day loans = 12 data points per year
365-day loans = 1 data point per year
```

**Learning speed:** 12× faster behavioral feedback during MVP.

### 2. Lower Exposure

Shorter terms limit potential loss during learning phase:
- 30-day default: $500 exposure for 1 month
- 365-day default: $500 exposure for 1 year

### 3. Easier Monitoring

Track repayment behavior quickly, adjust system based on real data.

### 4. Progressive Expansion

Can safely increase duration limits as confidence grows:
- Month 1-3: Observe 30-day behavior
- Month 4: If <10% default rate → expand to 60 days
- Month 7: If <15% default rate → expand to 90 days

---

## Borrower Incentives

While we don't restrict amounts, we **incentivize** responsible borrowing through market dynamics:

### 1. Lower Risk = Faster Funding

| Grade | Typical Funding Speed | Lender Pool Size |
|-------|----------------------|------------------|
| **A-B** 🟢 | 1-3 days | Large (many willing lenders) |
| **C-D** 🟡 | 3-7 days | Medium (selective lenders) |
| **E-HR** 🔴 | 7-30 days or never | Very small (high risk tolerance only) |

**Natural incentive:** Request appropriate amounts to get better grades and fund faster.

### 2. Pre-Loan Risk Grade Estimator

Before creating loan, borrowers see:

```
Estimated Risk Grade for your loan:

$100 loan: Grade B 🟢 (Typically funds in 2 days)
$500 loan: Grade C 🟡 (Typically funds in 4 days)
$1,500 loan: Grade HR 🔴 (May not fund)

Recommendation: Start with $100-200 to build Grade A history
```

### 3. Reputation Building Path

**Smart progression example:**
1. First loan: $100, Grade B → Funds in 2 days
2. Second loan: $250, Grade A → Funds in 1 day
3. Third loan: $500, Grade A → Funds in < 1 day
4. Fourth loan: $1,500, Grade A → Funds easily

vs.

**Aggressive borrowing:**
1. First loan: $1,500, Grade HR → Takes weeks or never funds

**Learning:** Market teaches borrowers to start small through funding incentives.

---

## Trust-Based Lending Dynamics

### High Social Trust Can Overcome No History

Same borrower, same $500 loan, different lenders:

| Lender Relationship | Social Distance | Risk Grade | Likely Outcome |
|--------------------|----------------|------------|----------------|
| **Stranger** | 15/100 | HR 🔴 | Won't fund |
| **Friend-of-friend** | 55/100 | C 🟡 | May fund slowly |
| **Close friend** | 92/100 | B 🟢 | Funds quickly |

**Why?** Social collateral provides accountability even without financial history.

### Example: Close Friend Lending

```
Loan: $800
Borrower: Alice (0 loans completed)
Lender: Bob (Social Distance: 92/100 - very close)

Risk Grade: B 🟢 (despite no history)

Bob sees:
✅ Low Risk for You
- Alice is a very close connection (15 mutual friends)
- Strong social ties provide accountability
- Loan size is reasonable with high social backing
```

---

## Default Recovery & Second Chances

Borrowers with past defaults can still borrow, but market imposes natural constraints:

### Recovery Grade Calculation

```
If (defaultCount > 0):
  Base Grade = HR
  If (loans after default ≥ 3 AND all successful):
    Upgrade to Grade E
  If (loans after default ≥ 6 AND all successful):
    Upgrade to Grade D
```

### Market Constraints on Recovery Loans

- **Grade HR recovery loans**: Very few lenders willing
- **Must start small**: $50-100 to get any funding
- **Progressive rebuilding**: Each successful loan opens larger amounts

**Natural rehabilitation:** Market forces defaulters to prove themselves with small loans first.

---

## Research Foundation

| Principle | Source | Application |
|-----------|--------|-------------|
| **No amount restrictions** | Prosper, LendingClub | Market decides through risk grades |
| **Short-term for risk management** | Microfinance (max 2 years) | 30-90 day MVP limits |
| **Progressive lending** | Grameen Bank | Market incentivizes starting small |
| **Social compensates for no history** | Group lending research | High trust = higher appropriate amounts |

---

## Expected Outcomes

### Loan Size Distribution (Predicted)

| Loan Size | % of Loans | Typical Grade |
|-----------|-----------|--------------|
| **$50-200** | 40-50% | First loans, building reputation |
| **$201-500** | 30-40% | Second/third loans, moderate history |
| **$501-1000** | 15-20% | Established borrowers |
| **$1001+** | 5-10% | Proven borrowers OR close friend loans |

**Market will naturally limit** large first loans through lack of funding.

---

## Monitoring & Iteration

### Track quarterly:

1. **Funding success rate by grade:**
   - Target: A-B (>90%), C-D (>60%), E-HR (<30%)

2. **Average loan size by loan cycle:**
   - Expect: $150 → $300 → $600 (progressive growth)

3. **Default rate by loan size:**
   - Validate: Larger jumps = higher defaults

### Adjust if needed:

- If Grade E loans funding at >50% → recalibrate grading formula
- If defaults spike at certain loan sizes → add size-specific warnings
- If duration limits too restrictive → expand faster

---

## Next Steps

- **Understand grading:** [Risk Grades](risk-grades.md)
- **See lender warnings:** [Lender Warnings](lender-warnings.md)
- **Technical implementation:** [Implementation](implementation.md)

**Back to:** [Risk Scoring Overview](README.md)
