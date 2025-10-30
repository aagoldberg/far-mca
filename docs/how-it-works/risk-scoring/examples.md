# Calculation Examples

## Real Scenarios with Point Breakdowns

---

## Example 1: First Loan, Small Amount, Close Friend

**Scenario:**
- Borrower: Alice (0 completed loans)
- Loan: $100 for 30 days
- Lender: Bob (Social Distance: 75/100)
- Account: High quality (0.9)

**Calculation:**

| Factor | Points | Reasoning |
|--------|--------|-----------|
| History | 12/40 | First-time borrower |
| Social | 24/30 | Close friend (75/100) |
| Size | 16/20 | First loan ≤$200 |
| Quality | 10/10 | High-quality account |
| **Total** | **62/100** | |

**Result: Grade B 🟢**
- Risk: Low
- Funding: 1-2 days

**Why B not A?** No history yet, but strong social ties compensate.

---

## Example 2: First Loan, Large Amount, Stranger

**Scenario:**
- Borrower: Carol (0 completed loans)
- Loan: $1,500 for 30 days
- Lender: Dave (Social Distance: 15/100)
- Account: Decent (0.85)

**Calculation:**

| Factor | Points | Reasoning |
|--------|--------|-----------|
| History | 12/40 | First-time borrower |
| Social | 6/30 | Minimal connection (15/100) |
| Size | 2/20 | First loan >$500 |
| Quality | 7/10 | Decent account |
| **Total** | **27/100** | |

**Result: Grade E 🔴**
- Risk: High
- Funding: May not fund

**Why so low?** No history + large amount + weak ties = high risk.

---

## Example 3: Proven Borrower, Reasonable Request

**Scenario:**
- Borrower: Eve (5 loans, 0 defaults, 85% on-time)
- Loan: $800 for 30 days
- Lender: Frank (Social Distance: 55/100)
- Previous largest: $500
- Account: Excellent (0.92)

**Calculation:**

| Factor | Points | Reasoning |
|--------|--------|-----------|
| History | 32/40 | 5 loans, 0 defaults, 85% on-time |
| Social | 18/30 | Moderate connection |
| Size | 20/20 | $800 is 1.6× previous (<2×) |
| Quality | 10/10 | Excellent account |
| **Total** | **80/100** | |

**Result: Grade A 🟢**
- Risk: Minimal
- Funding: <1 day

**Why Grade A?** Strong history + responsible loan growth.

---

## Example 4: Default Recovery

**Scenario:**
- Borrower: Dan (6 loans, 1 default, 70% on-time)
- Loan: $150 for 30 days
- Lender: Grace (Social Distance: 40/100)
- 3 successful loans since default
- Account: Good (0.88)

**Calculation:**

| Factor | Points | Reasoning |
|--------|--------|-----------|
| History | 12/40 | 1 default (-8) + 3 recovery (+12) |
| Social | 18/30 | Moderate connection |
| Size | 16/20 | Small, reasonable request |
| Quality | 9/10 | Good account |
| **Total** | **55/100** | |

**Result: Grade C 🟡**
- Risk: Moderate
- Funding: 3-5 days

**Recovery path working:** Default penalty offset by successful rebuilding.

---

## Key Takeaways

**Social trust can compensate for no history:**
- Example 1: First-timer gets Grade B with close friend

**Large loans + no history = high risk:**
- Example 2: First-timer requesting $1,500 gets Grade E

**History is powerful:**
- Example 3: Proven borrower gets Grade A despite moderate social ties

**Defaults can be overcome:**
- Example 4: Rebuilding through small successful loans improves grade

---

**Back to:** [Risk Grades](risk-grades.md) | [Calculation Details](calculation.md)
