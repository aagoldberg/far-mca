# Monthly Income Question: Pros, Cons, and Approaches

## Context: Kiva's Approach

**What Kiva does:**
- ✅ Asks for monthly income during application
- ✅ Uses it internally to approve/reject loan listings
- ❌ Does NOT display it publicly on loan profiles
- ✅ Relies on "Trustee" partners to vet borrowers before going live

**Why this works for Kiva:**
- Filters out unrealistic loan requests before they go live
- Protects borrower privacy (income not public)
- Trustee acts as intermediary/gatekeeper
- Borrowers can mention income in their story if they choose

**Why LendFriend is different:**
- We're **direct P2P** - no intermediary/Trustee
- Loans go live immediately when submitted
- All information is public on blockchain
- Lenders make risk assessment themselves

---

## PROS of Asking Monthly Income

### 1. Repayment Capacity Assessment ✅
**Benefit:** Clear signal if borrower can afford the payment

**Example:**
- Borrower requests: $1,500 over 8 weeks
- Bi-weekly payment: $375
- Monthly income: $2,000
- **Result:** Payment is 18.75% of income → ⚠️ High burden

**vs.**

- Monthly income: $5,000
- **Result:** Payment is 7.5% of income → ✅ Manageable

**Industry standard (P2P lending):**
- Prosper/LendingClub: 40-50% debt-to-income max
- Mortgage lending: 28-36% housing expense ratio
- Personal finance advice: <20% for non-housing debt

### 2. Automatic Risk Warnings ✅
**Benefit:** Protect borrowers from taking on too much debt

**Smart validation example:**
```
User enters:
- Loan: $2,000
- Timeline: 8 weeks
- Monthly income: $1,500

System calculates:
- Bi-weekly payment: $500
- Payment as % of monthly income: 33%

Warning shown:
⚠️ This repayment schedule may be challenging
Your bi-weekly payment ($500) is 33% of your monthly income.
Consider:
- Longer timeline (16 weeks → $250 bi-weekly = 16.7%)
- Smaller loan amount ($1,200 → $300 bi-weekly = 20%)
```

**Benefit:** Reduces defaults by encouraging realistic timelines

### 3. Lender Confidence Signal ✅
**Benefit:** Borrowers can use income to build trust

**Example in "How will you repay?" field:**
"I work full-time as a nurse earning $3,750/month. This $187 bi-weekly payment is only 5% of my income, so I can easily afford it. I also have $3,000 in savings as backup."

**Psychology:** Specific numbers build credibility

### 4. Filters Unrealistic Requests ✅
**Benefit:** Self-selection - borrowers realize if they can't afford it

**Example:**
- User earning $1,500/month
- Tries to request $5,000 over 4 weeks
- Bi-weekly payment: $1,250
- System shows: "This is 83% of your monthly income"
- User realizes it's unrealistic, adjusts to longer timeline

### 5. Multi-Loan Risk Management ✅
**Benefit:** Track total debt burden across multiple loans

**Scenario:**
- Borrower has active loan: $200/month payment
- Requests new loan: $300/month payment
- Total: $500/month in payments
- Monthly income: $2,000
- **Debt-to-income:** 25% → Still reasonable

**Use case:** Prevent over-leveraging

### 6. Data for Platform Improvements ✅
**Benefit:** Understand what income levels correlate with repayment success

**Analytics example:**
- Income $0-1k: 60% repayment rate
- Income $1-3k: 80% repayment rate
- Income $3-5k: 90% repayment rate
- Income $5k+: 95% repayment rate

**Result:** Can optimize loan amount limits, recommended timelines

---

## CONS of Asking Monthly Income

### 1. Privacy Concerns ❌
**Problem:** People don't want financial details public

**Example:**
- User earns $2,000/month (modest income)
- Doesn't want everyone to know this
- Feels vulnerable sharing publicly
- May lie or inflate to save face

**Crypto context:**
- Web3 users value privacy
- "Don't dox yourself" culture
- Financial privacy is a core value

### 2. Verification Impossible ❌
**Problem:** We can't verify income, so data might be inaccurate

**TradFi verification methods we CAN'T use:**
- Bank statements
- Pay stubs
- Tax returns
- Employment verification letters
- Employer phone calls

**Result:** Income field is "honor system" only

**Risk:**
- Borrowers inflate income to look better
- Lenders make decisions on false data
- Creates false sense of security

### 3. Traditional Banking Feel ❌
**Problem:** Goes against crypto-native, trustless ethos

**Web3 philosophy:**
- On-chain data > self-reported claims
- Code is law
- Don't trust, verify
- Transparent, verifiable information

**Asking for income feels like:**
- TradFi loan application
- Credit card application
- Mortgage paperwork

**User perception:** "Why do they need to know my income? This is supposed to be DeFi"

### 4. Discourages Applications ❌
**Problem:** Feels invasive, reduces completion rate

**User psychology:**
- Form asks for income → "This is too personal"
- Abandons application
- Goes to competitor with simpler form

**Data from form optimization:**
- Each additional field = 5-10% drop in completion
- Personal/financial questions = 15-20% drop
- Optional fields reduce drop by half

### 5. Variable Income Complexity ❌
**Problem:** Not straightforward for many users

**Examples of variable income:**
- **Freelancers:** $500 one month, $3,000 the next
- **Gig workers:** Uber/DoorDash varies weekly
- **Seasonal business:** Landscaper earns 80% in summer
- **Crypto traders:** Highly variable
- **Commission sales:** Base + variable comp

**Question:** What should they enter?
- Last month's income?
- Average over 6 months?
- Expected next month?
- Minimum guaranteed?

**Result:** Inconsistent, incomparable data

### 6. Low Income ≠ High Risk ❌
**Problem:** Could discriminate against low earners unfairly

**Example:**
- **Borrower A:** Earns $1,500/month, requests $300 loan over 12 weeks
  - Bi-weekly payment: $50 (3.3% of income) → Very manageable
  - Risk: LOW

- **Borrower B:** Earns $8,000/month, requests $5,000 loan over 4 weeks
  - Bi-weekly payment: $1,250 (15.6% of income) → Higher burden
  - Risk: MEDIUM

**What matters:** Payment as % of income, not absolute income level

**Risk:** Lenders might dismiss low-income borrowers without doing math

### 7. We Have Wallet Activity Already ❌
**Problem:** Redundant signal

**Wallet activity score already shows:**
- Transaction count (activity level)
- Balance (current funds)
- Account age (stability)
- Recent activity (current engagement)

**Example:**
- User claims $5,000/month income
- But wallet shows:
  - 2 transactions total
  - Balance: $15 USDC
  - Account age: 14 days
  - No recent activity

**Disconnect:** Self-reported income doesn't match on-chain behavior

**Better approach:** Trust verifiable on-chain data > unverifiable claims

---

## Comparison of Approaches

### Option 1: Ask and Display Publicly

**How it works:**
- Required field: "Monthly income"
- Displayed on loan card: "Monthly income: $3,500"

**PROS:**
✅ Transparent
✅ Lenders have clear signal
✅ Can calculate DTI

**CONS:**
❌ Privacy invasion
❌ Can't verify
❌ Discourages applications
❌ Low completion rate

**Verdict:** ❌ Too invasive for crypto context

---

### Option 2: Ask Privately, Use for Internal Risk Scoring (Kiva's Model)

**How it works:**
- Optional field during application
- Used to calculate internal risk score
- NOT displayed publicly
- Powers automatic warnings ("payment is 40% of income")
- Borrower can choose to mention in story if helpful

**PROS:**
✅ Protects privacy
✅ Enables smart validation
✅ Filters unrealistic requests
✅ Borrower controls disclosure

**CONS:**
⚠️ Lenders don't see it directly
⚠️ Still can't verify
⚠️ Adds friction to form

**Verdict:** ✅ Good middle ground

---

### Option 3: Don't Ask, Rely on Wallet Activity

**How it works:**
- No income field at all
- Wallet activity score shows financial health
- Borrowers can voluntarily mention income in "repayment plan" story

**PROS:**
✅ Simplest form
✅ Fully on-chain/verifiable
✅ Crypto-native approach
✅ No privacy concerns
✅ Higher completion rate

**CONS:**
❌ No income data for analytics
❌ Can't auto-calculate DTI warnings
❌ Lenders have less information
❌ No protection from over-borrowing

**Verdict:** ✅ Purist approach, but less protection

---

### Option 4: Ask Qualitatively in Story (Recommended)

**How it works:**
- No separate income field
- In "How will you repay?" field, guidance suggests mentioning income
- Borrower controls how much to share
- Can be vague or specific

**Guidance text:**
```
💡 Help lenders understand your repayment capacity:

You can mention (if comfortable):
✅ "I have steady full-time income that more than covers this payment"
✅ "I earn about $2,500/month from freelance work"
✅ "My business generates $2,000-3,000/month in revenue"
✅ "I work full-time plus have savings as backup"

Avoid sharing if:
❌ You prefer to keep income private
❌ Income is highly variable
❌ You'd rather rely on wallet activity score
```

**Example responses:**

**Specific (builds more trust):**
"I work full-time as a nurse earning $3,750/month. This $187 bi-weekly payment is only 5% of my income, making it very manageable. I also have $3,000 in savings as backup."

**Vague (maintains privacy):**
"I have steady employment income and the bi-weekly payment is a small percentage of my earnings. I'm confident I can repay on time."

**No mention (relies on wallet score):**
"My wallet shows consistent transaction activity and I've been active in crypto for 2 years. I'm committed to repaying to maintain my reputation in this community."

**PROS:**
✅ Flexible - borrower controls disclosure
✅ Natural part of story, not separate field
✅ Can be specific or vague
✅ No separate privacy concerns
✅ Doesn't feel like TradFi form
✅ High completion rate

**CONS:**
⚠️ Inconsistent format (hard to parse)
⚠️ Can't auto-calculate warnings
⚠️ No structured data for analytics

**Verdict:** ✅ Best for crypto-native, privacy-focused approach

---

## Recommended Approach for LendFriend

### Hybrid: Optional Private Field + Story Guidance

**Implementation:**

1. **Optional income field (not displayed)**
   - Label: "Approximate monthly income (optional, for risk assessment only)"
   - Helper text: "This helps us warn you if the repayment schedule might be challenging. We'll never display this publicly."
   - Dropdown ranges (not exact):
     - Prefer not to say
     - Less than $1,000/month
     - $1,000 - $2,000/month
     - $2,000 - $3,500/month
     - $3,500 - $5,000/month
     - $5,000 - $7,500/month
     - More than $7,500/month

2. **Use for smart warnings (if provided)**
   ```
   If income provided and payment > 25% of income:
   ⚠️ Warning: "This payment is X% of your stated income. Consider a longer timeline."

   Can still submit, just a warning.
   ```

3. **Guidance in "Repayment Plan" field**
   ```
   "How will you repay this loan?"

   💡 Tip: Mentioning your income or financial situation helps lenders trust
   you can repay. You decide how specific to be.

   Examples:
   - "I earn $2,500/month, payment is only 8% of my income"
   - "I have steady income that easily covers this payment"
   - "My wallet activity shows I'm financially stable"
   ```

4. **Never display income field publicly**
   - Not on loan card
   - Not in loan details
   - Only used internally for warnings
   - Only visible if borrower mentions in story

---

## Smart Validation Examples

### Scenario 1: Unrealistic Request
```
User input:
- Loan: $3,000
- Timeline: 4 weeks
- Income: $1,500/month

System calculates:
- Bi-weekly payment: $750
- Payment % of income: 50%

Warning shown:
⚠️ This repayment schedule is very challenging

Your bi-weekly payment ($750) is 50% of your stated monthly income.
Most successful borrowers keep payments under 20% of income.

Suggestions:
- Extend timeline to 16 weeks → $375 bi-weekly (25%)
- Reduce loan to $1,200 → $300 bi-weekly (20%)

[Adjust Loan] [Continue Anyway]
```

**Result:** Borrower adjusts to realistic timeline, higher chance of success

### Scenario 2: Comfortable Payment
```
User input:
- Loan: $1,500
- Timeline: 12 weeks
- Income: $4,000/month

System calculates:
- Bi-weekly payment: $250
- Payment % of income: 6.25%

Encouragement shown:
✅ This looks manageable!

Your bi-weekly payment ($250) is only 6% of your stated income.
This is well within the recommended range.

💡 Tip: Mentioning this in your "repayment plan" helps build lender confidence.

[Continue]
```

**Result:** Borrower includes this in story, lenders see confidence

### Scenario 3: No Income Provided
```
User skips income field

System shows:
💡 Helpful for you to know:

Your bi-weekly payment will be $375.

Make sure this is comfortable for your budget!
We recommend keeping loan payments under 20% of your income.

[Continue]
```

**Result:** No warning, but helpful context

---

## Data Privacy & Security

### What We Store (if income provided):
- Income range (not exact number)
- Never displayed publicly
- Used only for internal risk scoring
- Encrypted in database

### What We Display Publicly:
- ❌ NOT the income field
- ✅ Only what borrower writes in story
- ✅ Wallet activity score
- ✅ Social proximity score

### Blockchain Transparency:
- Income field: Off-chain (not on blockchain)
- Loan amount, timeline, repayments: On-chain
- Borrower address: On-chain
- Repayment history: On-chain

**Result:** Privacy + transparency where it matters

---

## A/B Testing Plan

### Test 1: Income Field Presence
- **A:** No income field at all
- **B:** Optional income field (ranges, not displayed)
- **Measure:**
  - Completion rate
  - Default rate by income bracket
  - Quality of repayment plan descriptions

### Test 2: Income Field Placement
- **A:** Income field in Section 1 (basics)
- **B:** Income field in Section 3 (repayment)
- **Measure:** Completion rate, drop-off point

### Test 3: Warning Aggressiveness
- **A:** Show warning at 25% DTI
- **B:** Show warning at 35% DTI
- **Measure:** Adjustment rate, default rate

---

## Recommendation: Option 4 (Hybrid Approach)

**Best of both worlds:**

✅ **Optional income ranges** (not displayed)
- Low friction (optional + ranges vs. exact)
- Powers smart warnings
- No public display (privacy protected)
- Ranges easier than exact numbers for variable income

✅ **Guidance in story field**
- Borrowers control disclosure level
- Natural, not formulaic
- Feels less like TradFi interrogation

✅ **Rely on wallet activity as primary signal**
- Verifiable on-chain data
- Crypto-native approach
- Can't be faked

✅ **Smart warnings protect borrowers**
- Reduce defaults
- Encourage realistic timelines
- Better long-term outcomes

---

## Implementation Checklist

- [ ] Add optional income dropdown (ranges) to loan form
  - [ ] Placement: After "Repayment Plan" field
  - [ ] Label: "Approximate monthly income (optional)"
  - [ ] Helper text: "For risk assessment only, never displayed publicly"
  - [ ] Options: 7 ranges from "Prefer not to say" to "$7,500+"

- [ ] Build smart validation logic
  - [ ] Calculate bi-weekly payment
  - [ ] If income provided, calculate % of income
  - [ ] Show warning if >25%
  - [ ] Suggest alternative timelines
  - [ ] Allow override ("Continue Anyway")

- [ ] Update "Repayment Plan" field guidance
  - [ ] Add examples of income mentions
  - [ ] Suggest specific vs. vague approaches
  - [ ] Encourage but don't require

- [ ] Store income data securely
  - [ ] Encrypt in database
  - [ ] Never expose via API
  - [ ] Never display on frontend
  - [ ] Log access for security

- [ ] Analytics tracking
  - [ ] Track completion rate with/without income
  - [ ] Track default rate by income bracket
  - [ ] Track warning → adjustment rate
  - [ ] Track income mention in stories

---

## Conclusion

**Don't ask monthly income as a separate public field.**

**Do:**
1. ✅ Offer optional income ranges (not displayed, for warnings)
2. ✅ Guide borrowers to mention income in story if they choose
3. ✅ Use wallet activity as primary verifiable signal
4. ✅ Show smart warnings to prevent over-borrowing
5. ✅ Let borrowers control their own disclosure level

**This balances:**
- Privacy (income not public)
- Protection (warnings for unrealistic requests)
- Trust (borrowers can build credibility by sharing)
- Crypto values (on-chain data > self-reported claims)

**Philosophy:**
> "Make it easy to do the right thing, but don't force it."

Borrowers who are confident in their repayment ability will naturally share income details. Those who prefer privacy can rely on wallet scores. The platform protects both with smart warnings.
