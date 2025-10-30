# Risk Grades

## The A-HR Grading System

Every loan receives a risk grade from **A (minimal risk) to HR (very high risk)** based on four weighted factors.

---

## Grading Scale

| Grade | Risk Level | Description | Est. Default Rate* |
|-------|-----------|-------------|-------------------|
| **A** 🟢 | Minimal | Excellent history, strong social ties, reasonable loan size | <5% |
| **B** 🟢 | Low | Good history, moderate social ties, appropriate size | 5-10% |
| **C** 🟡 | Moderate | Some history OR strong social ties, moderate size | 10-20% |
| **D** 🟡 | Elevated | Limited history, weak social ties, or large loan | 20-35% |
| **E** 🔴 | High | No history, weak ties, large loan | 35-50% |
| **HR** 🔴 | Very High | First loan + high amount OR default recovery | >50% |

*Estimates based on P2P lending research (Prosper, LendingClub). Will update with actual LendFriend data quarterly.

---

## Grade Calculation Formula

```
Risk Grade = f(
  Repayment History (40%),
  Social Trust Score (30%),
  Loan Size Risk (20%),
  Account Quality (10%)
)

Total Points (0-100) → Grade Mapping:
- 80-100 points → Grade A
- 65-79 points → Grade B
- 50-64 points → Grade C
- 35-49 points → Grade D
- 20-34 points → Grade E
- 0-19 points → Grade HR
```

---

## The Four Risk Factors

### 1. Repayment History (40%)

Strongest predictor of future behavior. Borrowers with strong repayment records earn maximum points.

| History | Points | Grade Impact |
|---------|--------|--------------|
| **10+ loans, 0 defaults, 90%+ on-time** | 40 | A |
| **4-9 loans, 0 defaults, 80%+ on-time** | 32 | B |
| **1-3 loans, 0 defaults** | 24 | C |
| **0 loans (first-time)** | 12 | D-E |
| **1+ defaults** | 0-8 | E-HR |

**Details:**
- **On-time rate**: % of loans repaid before or on maturity date
- **Default penalty**: -8 points per default
- **Recovery bonus**: +4 points per successful loan after default (max +12)

---

### 2. Social Trust Score (30%)

Based on [Social Trust Scoring algorithm](../social-trust-scoring/README.md) using Adamic-Adar Index and mutual Farcaster connections.

| Social Distance | Points | Grade Impact |
|----------------|--------|--------------|
| **80-100** (Very close) | 30 | A-B |
| **60-79** (Close) | 24 | B-C |
| **40-59** (Moderate) | 18 | C-D |
| **20-39** (Weak) | 12 | D-E |
| **0-19** (Minimal/None) | 6 | E-HR |

**Why it matters:**
- Close friends provide social accountability
- Research shows 22% lower default rates with friend endorsements (Iyer et al. 2016)
- Can offset lack of repayment history

---

### 3. Loan Size Risk (20%)

Evaluates if loan amount is appropriate given borrower's history.

#### For Borrowers with History

| Scenario | Points | Grade Impact |
|----------|--------|--------------|
| **Amount < 2× largest previous loan** | 20 | No penalty |
| **Amount = 2-5× largest previous loan** | 12 | Moderate risk |
| **Amount > 5× largest previous loan** | 4 | High risk |

#### For First-Time Borrowers

| Scenario | Points | Grade Impact |
|----------|--------|--------------|
| **First loan ≤ $200** | 16 | Starter-friendly |
| **First loan $201-500** | 10 | Moderate risk |
| **First loan > $500** | 2 | High risk |

**Why it matters:**
- Progressive lending research shows borrowers who start small have significantly better repayment rates
- Large first loans indicate higher risk-taking behavior
- Gradual increases demonstrate responsible borrowing patterns

---

### 4. Account Quality (10%)

Farcaster account health and activity level (Neynar quality score).

| Quality Score | Points | Grade Impact |
|--------------|--------|--------------|
| **0.9-1.0** | 10 | Legitimate account |
| **0.7-0.89** | 7 | Active account |
| **0.5-0.69** | 4 | Low activity |
| **<0.5** | 0 | Bot/spam risk |

**What Neynar measures:**
- Account age and activity patterns
- Engagement diversity (casts, likes, recasts)
- Follower/following ratios
- Bot behavior detection

---

## Complete Calculation Examples

### Example 1: Alice (First-Time, Small Loan, Close Friend)

**Loan Details:**
- Amount: $100
- Duration: 30 days
- Borrower: Alice (0 completed loans)
- Lender: Bob (Social Distance: 75/100)

**Calculation:**
| Factor | Points | Max | Rationale |
|--------|--------|-----|-----------|
| Repayment History | 12 | 40 | First-time borrower |
| Social Trust | 24 | 30 | Close friend (75/100 social score) |
| Loan Size Risk | 16 | 20 | First loan ≤$200 (starter-friendly) |
| Account Quality | 10 | 10 | High-quality account (0.9) |
| **Total** | **62** | **100** | |

**Result: Grade B 🟢**
- **Risk Level:** Low
- **Est. Default:** 5-10%
- **Funding Speed:** 1-2 days

**Why B not A?** No repayment history yet, but strong social ties and responsible loan size.

---

### Example 2: Bob (First-Time, Large Loan, Stranger)

**Loan Details:**
- Amount: $1,500
- Duration: 30 days
- Borrower: Bob (0 completed loans)
- Lender: Carol (Social Distance: 15/100)

**Calculation:**
| Factor | Points | Max | Rationale |
|--------|--------|-----|-----------|
| Repayment History | 12 | 40 | First-time borrower |
| Social Trust | 6 | 30 | Minimal connection (15/100 score) |
| Loan Size Risk | 2 | 20 | First loan >$500 (high risk) |
| Account Quality | 7 | 10 | Decent account (0.85) |
| **Total** | **27** | **100** | |

**Result: Grade E 🔴**
- **Risk Level:** High
- **Est. Default:** 35-50%
- **Funding Speed:** May never fund

**Why so low?** Triple threat: No history + large amount + weak social ties.

---

### Example 3: Carol (Proven Borrower, Moderate Request)

**Loan Details:**
- Amount: $800
- Duration: 30 days
- Borrower: Carol (5 loans, 0 defaults, 85% on-time)
- Lender: Dave (Social Distance: 55/100)
- Previous largest loan: $500

**Calculation:**
| Factor | Points | Max | Rationale |
|--------|--------|-----|-----------|
| Repayment History | 32 | 40 | 5 loans, 0 defaults, 85% on-time |
| Social Trust | 18 | 30 | Moderate connection (55/100) |
| Loan Size Risk | 20 | 20 | $800 is 1.6× previous max (<2×) |
| Account Quality | 10 | 10 | High-quality account (0.92) |
| **Total** | **80** | **100** | |

**Result: Grade A 🟢**
- **Risk Level:** Minimal
- **Est. Default:** <5%
- **Funding Speed:** <1 day

**Why Grade A?** Strong repayment history + reasonable loan growth.

---

### Example 4: Dan (Default Recovery)

**Loan Details:**
- Amount: $150
- Duration: 30 days
- Borrower: Dan (6 loans, 1 default, 70% on-time)
- Lender: Eve (Social Distance: 40/100)
- 3 successful loans since default

**Calculation:**
| Factor | Points | Max | Rationale |
|--------|--------|-----|-----------|
| Repayment History | 12 | 40 | 1 default (-8) + 3 recovery loans (+12) = 12 |
| Social Trust | 18 | 30 | Moderate connection (40/100) |
| Loan Size Risk | 16 | 20 | Small loan, reasonable request |
| Account Quality | 9 | 10 | Good account (0.88) |
| **Total** | **55** | **100** | |

**Result: Grade C 🟡**
- **Risk Level:** Moderate
- **Est. Default:** 10-20%
- **Funding Speed:** 3-5 days

**Recovery path working:** Default penalty offset by successful recovery loans.

---

## Grade Distribution (Expected)

Based on social network dynamics and lending behavior:

| Grade | % of Loans | Typical Use Case |
|-------|-----------|------------------|
| **A** | 10-15% | Proven borrowers, reasonable requests |
| **B** | 20-30% | Close friends, first small loans |
| **C** | 25-35% | Moderate ties, some history |
| **D** | 15-20% | First loans, moderate amounts |
| **E** | 5-10% | High-risk situations |
| **HR** | 5-10% | Very high risk or recovery |

---

## Why These Weights?

### Repayment History = 40%
**Most predictive factor** in P2P lending research. Past behavior strongly predicts future behavior.

### Social Trust = 30%
**Uniquely powerful in crypto lending.** Can compensate for lack of history through social accountability.

### Loan Size Risk = 20%
**Progressive lending indicator.** Borrowers who grow gradually have better track records.

### Account Quality = 10%
**Sybil resistance.** Filters spam/bot accounts, but legitimate users range from 0.5-1.0.

---

## Grade Adjustment Rules

### Multiple Defaults
- **2+ defaults:** Maximum grade is D (regardless of other factors)
- **3+ defaults:** Maximum grade is E
- **Reason:** Pattern of non-repayment

### Exceptional Social Trust
- **Social Distance ≥ 90 + First Loan ≤$200:** Minimum grade is B
- **Reason:** Very close friend lending small amount has low actual risk

### Large Loan Jumps
- **Requesting >10× previous max:** Automatic Grade HR
- **Reason:** Indicates distress or aggressive risk-taking

---

## Monitoring & Calibration

We track actual default rates by grade quarterly and adjust thresholds:

**Current Targets (from P2P research):**
```
Target Default Rates:
- Grade A: <5%
- Grade B: 5-10%
- Grade C: 10-20%
- Grade D: 20-35%
- Grade E: 35-50%
- Grade HR: >50%
```

**If actual rates diverge from targets:**
1. Adjust point thresholds for grade boundaries
2. Reweight the four factors (may increase history weight to 45%, decrease quality to 5%)
3. Add new risk factors (e.g., "time between loans")

---

## Research Foundation

| Design Element | Source | Finding |
|---------------|--------|---------|
| **Letter grade system** | Prosper (AA-HR), LendingClub (A-G) | Clear risk communication reduces defaults |
| **History as top factor** | PLOS ONE P2P study | Repayment history most predictive |
| **Social trust weighting** | Lin et al. 2013 | Social connections reduce defaults 22% |
| **Progressive sizing** | Grameen Bank, microfinance research | Small first loans = better repayment |
| **Quality filtering** | Spam detection research | Account quality indicates legitimacy |

---

## Next Steps

- **See what lenders see:** [Lender Warnings](lender-warnings.md)
- **Understand constraints:** [Loan Constraints](loan-constraints.md)
- **Technical implementation:** [Implementation](implementation.md)

**Back to:** [Risk Scoring Overview](README.md)
