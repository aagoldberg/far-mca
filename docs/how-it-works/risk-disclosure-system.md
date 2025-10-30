# Risk Disclosure System

## Market-Driven Lending with Transparent Risk Assessment

LendFriend doesn't artificially limit loan amounts. Instead, we provide comprehensive risk information to lenders, who decide what risk they're comfortable with.

**Core Philosophy:** Transparency over restriction. Let the market find equilibrium.

---

## MVP Constraints

### Duration Limits (All Borrowers)

To gather behavioral data quickly and maintain manageable risk during MVP:

| Phase | Max Duration | Reason |
|-------|-------------|---------|
| **Phase 1** (Months 1-3) | **30 days** | Rapid feedback loop, limit exposure |
| **Phase 2** (Months 4-6) | **60 days** | Expand based on data |
| **Phase 3** (Months 7+) | **90 days** | Mature system, longer terms |

**No amount limits** - borrowers can request any amount, lenders see risk warnings.

---

## Risk Grade System

Every loan gets a **Risk Grade (A-HR)** based on borrower history and loan characteristics.

### Grade Calculation

```
Risk Grade = f(
  Repayment History (40%),
  Social Trust Score (30%),
  Loan Size Risk (20%),
  Account Quality (10%)
)
```

### Risk Grades

| Grade | Risk Level | Description | Est. Default Rate* |
|-------|-----------|-------------|-------------------|
| **A** 🟢 | Minimal | Excellent history, strong social ties, reasonable loan size | <5% |
| **B** 🟢 | Low | Good history, moderate social ties, appropriate size | 5-10% |
| **C** 🟡 | Moderate | Some history OR strong social ties, moderate size | 10-20% |
| **D** 🟡 | Elevated | Limited history, weak social ties, or large loan | 20-35% |
| **E** 🔴 | High | No history, weak ties, large loan | 35-50% |
| **HR** 🔴 | Very High | First loan + high amount OR default recovery | >50% |

*Estimates based on P2P lending research, will update with actual LendFriend data

---

## Risk Factors Assessed

### 1. Repayment History (40%)

| History | Points | Grade Impact |
|---------|--------|--------------|
| **10+ loans, 0 defaults, 90%+ on-time** | 40 | A |
| **4-9 loans, 0 defaults, 80%+ on-time** | 32 | B |
| **1-3 loans, 0 defaults** | 24 | C |
| **0 loans (first-time)** | 12 | D-E |
| **1+ defaults** | 0-8 | E-HR |

### 2. Social Trust Score (30%)

Based on [Social Trust Scoring](social-trust-scoring/README.md) algorithm:

| Social Distance | Points | Grade Impact |
|----------------|--------|--------------|
| **80-100** (Very close) | 30 | A-B |
| **60-79** (Close) | 24 | B-C |
| **40-59** (Moderate) | 18 | C-D |
| **20-39** (Weak) | 12 | D-E |
| **0-19** (Minimal/None) | 6 | E-HR |

### 3. Loan Size Risk (20%)

Evaluates if loan size is appropriate given history:

| Scenario | Points | Grade Impact |
|----------|--------|--------------|
| **Amount < 2× largest previous loan** | 20 | No penalty |
| **Amount = 2-5× largest previous loan** | 12 | Moderate risk |
| **Amount > 5× largest previous loan** | 4 | High risk |
| **First loan ≤ $200** | 16 | Starter-friendly |
| **First loan $201-500** | 10 | Moderate risk |
| **First loan > $500** | 2 | High risk |

### 4. Account Quality (10%)

Farcaster account health and activity:

| Quality Score | Points | Grade Impact |
|--------------|--------|--------------|
| **0.9-1.0** | 10 | Legitimate account |
| **0.7-0.89** | 7 | Active account |
| **0.5-0.69** | 4 | Low activity |
| **<0.5** | 0 | Bot/spam risk |

---

## Risk Grade Calculation Example

**Scenario 1: Alice (First-Time Borrower, $100 loan)**
- Repayment History: 0 loans → 12 points
- Social Trust: 75/100 (close friend) → 24 points
- Loan Size Risk: First loan $100 → 16 points
- Account Quality: 0.9 → 10 points
- **Total: 62 points → Grade B** 🟢

**Scenario 2: Bob (First-Time Borrower, $1,500 loan)**
- Repayment History: 0 loans → 12 points
- Social Trust: 45/100 (moderate) → 18 points
- Loan Size Risk: First loan $1,500 → 2 points
- Account Quality: 0.85 → 7 points
- **Total: 39 points → Grade HR** 🔴

**Scenario 3: Carol (5 loans completed, requesting $800)**
- Repayment History: 5 loans, 0 defaults, 85% on-time → 32 points
- Social Trust: 55/100 (moderate) → 18 points
- Loan Size Risk: Previous max was $500, requesting $800 (1.6×) → 20 points
- Account Quality: 0.92 → 10 points
- **Total: 80 points → Grade A** 🟢

---

## Lender Risk Warnings

### Warning System

Lenders see **clear, prominent warnings** before contributing. Warnings escalate based on risk factors:

#### 🟢 Green (Grades A-B): Minimal Warnings

```
✅ Low Risk Loan
- Borrower has strong repayment history
- Close social connection to you
- Loan size is reasonable for their history
```

#### 🟡 Yellow (Grades C-D): Moderate Warnings

```
⚠️ Moderate Risk Loan
- Limited repayment history (1-3 loans)
- Moderate social connection
- Loan size is 2-5× their previous loans
→ Consider contributing a smaller amount
```

#### 🔴 Red (Grades E-HR): Strong Warnings

```
🚨 High Risk Loan - Lend with Caution
- First-time borrower with NO repayment history
- Minimal or no social connection to you
- Large loan amount ($1,500) for first loan
→ This borrower has not yet proven they can repay
→ Only contribute what you can afford to lose
→ Expected default rate: >35%
```

### Specific Risk Flags

Lenders see individual risk flags on loan detail pages:

| Flag | Condition | Warning |
|------|-----------|---------|
| 🆕 **First Loan** | 0 completed loans | "First-time borrower with no repayment history" |
| 📈 **Large Request** | Loan > $500 with no history OR >5× previous max | "Unusually large loan relative to history" |
| ⚠️ **Past Default** | 1+ defaults | "Borrower has defaulted before (X times)" |
| 👥 **Weak Social Ties** | Social distance < 30 | "Minimal social connection between you and borrower" |
| 🆕 **New Account** | Farcaster quality < 0.5 | "Borrower has new/low-activity Farcaster account" |
| 🔄 **Recovery Loan** | Borrower in default recovery | "Borrower is rebuilding reputation after default" |

---

## Lender Filtering & Portfolio Tools

### Risk Tolerance Filtering

Lenders can filter loan listings by risk grade:

```
☑ Show Grades A-B only (Low risk)
☐ Include Grade C (Moderate risk)
☐ Include Grades D-E (High risk)
☐ Include Grade HR (Very high risk)
```

### Portfolio Diversification

Dashboard shows lender's portfolio risk distribution:

```
Your Portfolio: $500 contributed across 12 loans

Risk Distribution:
🟢 A-B: $300 (60%) - 8 loans
🟡 C-D: $150 (30%) - 3 loans
🔴 E-HR: $50 (10%) - 1 loan

Recommendation: Balanced portfolio with controlled high-risk exposure
```

---

## Borrower Incentives

While we don't restrict amounts, we **incentivize** responsible borrowing:

### 1. Lower Risk = Faster Funding

- **Grade A-B loans**: Typically fund in 1-3 days (larger lender pool)
- **Grade C-D loans**: Fund in 3-7 days (fewer lenders willing)
- **Grade E-HR loans**: May not fund at all (very limited lender appetite)

### 2. Risk Grade Display

Borrowers see their estimated risk grade BEFORE creating loan:

```
Based on your history and loan details:
Estimated Risk Grade: B 🟢

Want to improve your grade?
- Start with a smaller loan ($100-200) → Upgrade to Grade A
- Share with close friends (high social trust) → Upgrade to Grade A
- Build repayment history first → Future loans get better grades
```

### 3. Reputation Building

Strong history enables larger loans with better grades:

**Path Example:**
1. First loan: $100, Grade B → Funds in 2 days
2. Second loan: $250, Grade A → Funds in 1 day
3. Third loan: $500, Grade A → Funds in < 1 day
4. Fourth loan: $1,500, Grade A → Funds easily

vs.

**Aggressive borrowing:**
1. First loan: $1,500, Grade HR → May never fund OR takes weeks

---

## Trust-Based Lending Dynamics

### High Social Trust Can Overcome No History

A first-time borrower requesting $500 might be:
- **Grade HR** (🔴) if borrowing from strangers
- **Grade C** (🟡) if borrowing from friends-of-friends
- **Grade B** (🟢) if borrowing from close friends

**Why?** Social collateral provides accountability even without financial history.

### Example: Close Friend Lending

```
Loan: $800
Borrower: Alice (0 loans completed)
Lender: Bob (Social Distance: 92/100 - very close)

Grade: B 🟢 (despite no history)

Bob sees:
✅ Low Risk for You
- Alice is a very close connection (15 mutual friends, 92/100 social score)
- Even though Alice has no loan history, your strong social ties provide accountability
- Loan size is reasonable for a first loan with strong social backing
```

---

## Default Recovery & Second Chances

Borrowers with past defaults can still borrow, but face high scrutiny:

### Recovery Grade Calculation

```
If (defaultCount > 0):
  Base Grade = HR
  If (loans after default ≥ 3 AND all successful):
    Upgrade to Grade E
  If (loans after default ≥ 6 AND all successful):
    Upgrade to Grade D
```

### Recovery Loan Warnings

```
🚨 Default Recovery Loan
- Borrower defaulted X times in the past
- Has completed Y successful loans since last default
- Currently rebuilding reputation
→ Higher risk, but borrower is showing recovery effort
```

---

## MVP Implementation

### Phase 1: Basic Risk Grading (Launch)

**Smart Contract:**
- Track repayment history per borrower
- Store: totalLoans, completed, defaulted, totalBorrowed, totalRepaid

**API Route:**
```typescript
// /api/risk-grade/calculate
POST {
  borrowerFid: number,
  lenderFid: number,
  loanAmount: number
}

Response: {
  grade: "A" | "B" | "C" | "D" | "E" | "HR",
  score: number,  // 0-100
  factors: {
    historyPoints: number,
    socialPoints: number,
    sizeRiskPoints: number,
    qualityPoints: number
  },
  warnings: string[],
  riskFlags: string[]
}
```

**Frontend:**
- Loan detail page shows risk grade badge
- Warning modal before contribution
- List of risk flags displayed

### Phase 2: Lender Filtering (Month 2)

**Features:**
- Filter loans by risk grade
- Portfolio risk distribution dashboard
- Risk tolerance settings

**UI:**
```
Your Settings:
☐ Auto-contribute to Grade A loans
☐ Notify me of Grade B loans from close friends
☐ Never show Grade HR loans
```

### Phase 3: Dynamic Incentives (Month 3)

**Features:**
- Pre-loan risk grade estimator (borrower sees grade before creating)
- "Improve Your Grade" suggestions
- Historical funding speed by grade
- Lender portfolio optimization recommendations

---

## Research Foundation

| Principle | Source | Application |
|-----------|--------|-------------|
| **Risk grade disclosure** | Prosper (AA-HR), LendingClub (A-G) | Transparent 6-grade system |
| **No amount restrictions** | P2P lending platforms | Market decides, not platform |
| **Short-term duration** | Microfinance (max 2 years) | 30-90 day limits for MVP |
| **Transparency = lower defaults** | P2P research (PLOS ONE) | Comprehensive risk warnings |
| **Social collateral** | Grameen Bank | Social trust can offset no history |
| **Progressive sizing** | Microfinance best practices | Faster funding for smaller first loans |

---

## Monitoring & Iteration

**Track actual default rates by grade:**

```
Target (based on P2P research):
- Grade A: <5%
- Grade B: 5-10%
- Grade C: 10-20%
- Grade D: 20-35%
- Grade E: 35-50%
- Grade HR: >50%
```

**Quarterly adjustments:**
- Recalibrate grade formula if actual rates diverge from targets
- Adjust point weights for risk factors
- Add new risk flags based on observed patterns

---

## Key Design Decisions

### Why No Amount Limits?

**Market efficiency:** Lenders know their risk tolerance better than the platform. Some lenders are comfortable with high-risk/high-trust situations (lending $1k to a close friend with no history).

**Faster liquidity:** Proven borrowers can access capital quickly without arbitrary caps.

**Natural screening:** High-risk loans naturally get fewer lenders (or none), creating market-based limits.

### Why Duration Limits?

**Faster data collection:** 30-day loans provide 12× more feedback per year than 365-day loans.

**Lower exposure:** Shorter terms limit potential loss during MVP learning phase.

**Easier monitoring:** Track repayment behavior quickly, adjust system based on data.

**Progressive expansion:** Can safely increase duration limits as confidence grows.

### Why Risk Grades Over Binary Approve/Reject?

**Nuanced risk:** Credit is not binary - there's a spectrum of risk.

**Market discovery:** Let lenders find their comfort zone.

**Transparency:** Shows borrowers exactly why they're rated the way they are.

**Improvement path:** Clear path to better grades through responsible behavior.

---

## Next Steps

- **How social trust affects risk:** [Social Trust Scoring](social-trust-scoring/README.md)
- **Technical implementation:** [Smart Contract Flow](smart-contract-flow.md)
- **Default handling:** [Risk & Default Handling](risk-and-defaults.md)

**Questions?** Join our [Discord](https://discord.gg/lendfriend) or file an issue on [GitHub](https://github.com/aagoldberg/far-mca).
