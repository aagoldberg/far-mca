# Final Loan Form Specification

## Overview
- **Total fields:** 8 (7 required + 1 optional)
- **Estimated completion time:** 10-12 minutes
- **Target completion rate:** ~75%
- **Mobile-friendly:** Yes
- **Philosophy:** Kiva's storytelling approach, adapted for crypto

---

## Form Structure

### Section 1: Loan Basics (~2 minutes)

**1. Loan Amount**
- Type: Number input
- Range: $100 - $10,000 USDC
- Required: Yes
- Validation: Increments of $10

**2. Repayment Period**
- Type: Dropdown
- Options: 4, 8, 12, 16, 24 weeks
- Required: Yes

**3. Loan Title**
- Type: Text input
- Max length: 80 characters
- Required: Yes
- Example: "Buying sewing machine to expand tailoring business"
- Placeholder: "Make it specific and action-oriented"

---

### Section 2: About You (~3-5 minutes)

**4. Who are you and what do you do?**
- Type: Textarea
- Suggested length: 200-600 characters (~2-4 sentences)
- Required: Yes
- Warning threshold: <100 characters
- Purpose: Establish credibility and context

**Guidance:**
```
💡 Help lenders understand who you are:

Include (if relevant):
✅ What you do for work or business
✅ How long you've been doing it
✅ Your relevant background or skills
✅ Current situation (student, employed, entrepreneur, etc.)

Keep it concise:
✅ 2-4 sentences is perfect
✅ Focus on facts that build credibility
✅ Mention income or client base if it helps your case

Avoid:
❌ Long personal history
❌ Irrelevant details
❌ Just "I need money"
```

**Example:**
"I'm Alex, a freelance graphic designer based in Austin. I've been doing design work for 2 years, specializing in branding for small businesses. I currently work with 8 active clients and earn about $2,500/month. Before freelancing, I worked at a marketing agency for 3 years."

---

### Section 3: This Loan (~5-8 minutes)

**5. What will you use this loan for?**
- Type: Textarea
- Suggested length: 150-500 characters
- Required: Yes
- Warning threshold: <75 characters
- Smart validation: Auto-sum numbers, warn if doesn't match loan amount

**Guidance:**
```
💡 Be specific with numbers:

✅ Break down exactly what you'll buy
✅ Include prices for each item
✅ Numbers should add up to your loan amount
✅ Explain WHY you need this

Format like:
- Item 1: $XXX
- Item 2: $XXX
- Item 3: $XXX
Total: $X,XXX
```

**Example:**
"I'll use the $1,500 to:
- Refurbished MacBook Pro M2: $1,400
- Adobe Creative Cloud (1 year): $100

My current laptop is 8 years old and crashes 2-3 times per day, which means I'm losing clients and can't meet deadlines."

---

**6. What will this help you achieve?**
- Type: Textarea
- Suggested length: 100-400 characters (~1-2 sentences)
- Required: Yes
- Warning threshold: <50 characters
- Purpose: Show impact and future plans

**Guidance:**
```
💡 Show the impact:

✅ What changes after you get this loan?
✅ Specific outcomes (more clients, higher revenue, new opportunities)
✅ Numbers if possible (e.g., "2x my production", "+$500/month")

Keep it short:
✅ 1-2 sentences is perfect
✅ Focus on measurable impact
```

**Example:**
"This laptop will let me take on 3-5 more clients per month (currently turning them down). That's an extra $1,200-$1,500 in monthly revenue, which means I can repay this loan in 2 months and reinvest the rest into marketing."

---

**7. How will you repay this loan?**
- Type: Textarea
- Suggested length: 150-400 characters (~2-3 sentences)
- Required: Yes
- Warning threshold: <75 characters
- Purpose: Risk assessment and repayment capacity

**Guidance:**
```
💡 Show you can repay:

Include:
✅ Your income source (job, business, freelance, etc.)
✅ Approximate monthly income if comfortable sharing
✅ Why the repayment is manageable for you
✅ Any backup plans (savings, other income)

Calculate your payment:
Your loan: $X,XXX over Y weeks
Bi-weekly payment: $XXX

Examples:
✅ "I work full-time earning $3,500/month. The $150 payment is only 8% of my income."
✅ "My business generates $2,000/month in revenue. This $125 payment is manageable."
✅ "I have steady freelance income of $1,800/month plus $2,000 in savings as backup."

Avoid:
❌ "I'll definitely pay back" (not specific)
❌ "Trust me" (no evidence)
```

**Example:**
"I earn $2,500/month from my design freelance work, with 8 active clients providing steady income. The bi-weekly payment of $187 is only 7.5% of my monthly income. I also have $3,000 in savings as a backup."

---

**8. Approximate Monthly Income (OPTIONAL)**
- Type: Dropdown select
- Required: No
- Purpose: Enable smart warnings, never displayed publicly

**Label:** "Approximate monthly income (optional)"

**Helper Text:**
"This helps us warn you if the repayment schedule might be challenging. We'll never display this publicly—only you see it."

**Options:**
1. Prefer not to say
2. Less than $1,000/month
3. $1,000 - $2,000/month
4. $2,000 - $3,500/month
5. $3,500 - $5,000/month
6. $5,000 - $7,500/month
7. More than $7,500/month

**Privacy Guarantees:**
- ❌ NEVER displayed on loan card
- ❌ NEVER shown in loan details page
- ❌ NEVER exposed via public API
- ✅ Only used for internal risk warnings
- ✅ Encrypted in database
- ✅ Only visible to borrower

**Smart Warnings (if provided):**

If bi-weekly payment > 25% of monthly income:
```
⚠️ This repayment schedule may be challenging

Your bi-weekly payment ($750) is 50% of your stated monthly income.
Most successful borrowers keep payments under 20% of income.

Suggestions:
- Extend timeline to 16 weeks → $375 bi-weekly (25% of income)
- Reduce loan to $1,200 → $300 bi-weekly (20% of income)

[Adjust Loan] [Continue Anyway]
```

If payment < 20% of monthly income:
```
✅ This looks manageable!

Your bi-weekly payment ($250) is only 6% of your stated monthly income.
This is well within the recommended range.

💡 Tip: Mentioning this in your "repayment plan" above helps build lender confidence.
```

---

### Section 4: Add a Photo (~2 minutes)

**9. Upload a photo (REQUIRED)**
- Type: Image upload with crop tool
- Required: Yes
- Accepted formats: JPEG, PNG, WebP
- Max size: 10 MB
- Recommended aspect ratio: 16:9
- Validation: Cannot submit without photo

**Banner:**
```
📸 Loans with photos get funded 35% faster

Show yourself and what you're working on. Lenders want to see the person behind the request.
```

**Photo Guidelines:**
```
Good loan photos:
✅ You + your business/workspace/product
✅ Clear, well-lit, in focus
✅ Shows what you're working on

Avoid:
❌ Selfies or headshots only
❌ Photos unrelated to your loan
❌ Blurry or dark images
```

**Why it's required:**
- Photos dramatically increase funding success
- Builds trust and authenticity
- Shows lenders the real person behind the request
- Differentiates serious borrowers from spam

---

### Section 5: Review & Submit (~1 minute)

**Preview Card**
Shows how loan will appear to lenders:
- Loan title, amount, timeline
- Story excerpts (first 200 chars)
- Photo or Farcaster pfp
- Social proximity badge (if viewer connected)
- Wallet activity score
- Auto-populated Farcaster profile info

**Terms Acknowledgment (all required):**
- ☐ All information provided is truthful and accurate
- ☐ I understand this is a 0% interest loan with bi-weekly repayments
- ☐ I commit to repaying on time to maintain my reputation
- ☐ I understand loan details will be public on the blockchain

---

## Validation Summary

### Required Fields (8)
1. ✅ Loan amount
2. ✅ Repayment period
3. ✅ Loan title
4. ✅ About you
5. ✅ Loan use details
6. ✅ Expected impact
7. ✅ Repayment plan
8. ✅ Photo

### Optional Fields (1)
9. ⚠️ Monthly income (for smart warnings only, never displayed)

### Soft Minimums (Warnings, Not Blocks)

| Field | Suggested | Warning If |
|-------|-----------|------------|
| About you | 200-600 chars | <100 chars |
| Loan use | 150-500 chars | <75 chars |
| Impact | 100-400 chars | <50 chars |
| Repayment | 150-400 chars | <75 chars |

**Total suggested writing:** 600-1900 characters
**Warning threshold:** 300 characters total

---

## Smart Features

### 1. Auto-Save Draft
- Saves to localStorage every 10 seconds
- "Draft saved 5 seconds ago" indicator
- Recovers on page refresh
- "Continue your draft" banner if detected

### 2. Number Detection in Loan Use
- Parses dollar amounts from text: $1,200, $450, etc.
- Sums them automatically
- Compares to loan amount
- Shows ✅ if within 10%, ⚠️ if outside

**Example:**
```
User writes: "MacBook Pro $1,400 and Adobe $100"
Detected sum: $1,500
Loan amount: $1,500
Result: ✅ "Your breakdown matches your loan amount"
```

### 3. Repayment Calculator
Shows above "How will you repay" field:
```
💰 Your Repayment Schedule:
Loan amount: $1,500
Period: 8 weeks (4 payments)
Bi-weekly payment: $375

If you earn $2,000/month, this payment is 18.75% of your income.
```

### 4. Character Count Warnings
- 🟢 Above suggested minimum: No message
- 🟡 At 50-99% of suggested: "Consider adding more detail"
- 🔴 Below 50%: "Add more detail to help lenders trust your request"

### 5. Writing Quality Hints (Non-blocking)
- If story <200 chars: 💡 "Consider adding more detail to build trust"
- If no numbers in loan use: 💡 "Try including specific amounts"
- If no "I" or "we": 💡 "Stories in first person feel more personal"

### 6. Mobile Optimizations
- Single-column layout
- Large tap targets (48×48px min)
- Expandable guidance (collapsed by default on mobile)
- Sticky progress bar at top
- Sticky "Save Draft" button at bottom

---

## What Gets Displayed Publicly

### On Loan Card
✅ Loan title
✅ Loan amount & timeline
✅ Progress bar
✅ Photo (or Farcaster pfp)
✅ Borrower Farcaster profile (username, pfp)
✅ First ~200 chars of combined story
✅ Social proximity badge
✅ Payment warning badge (if applicable)
✅ Contributors count and avatars

❌ Monthly income (never shown)

### On Loan Details Page
✅ All of the above, plus:
✅ Full "About You" text
✅ Full "Loan Use" text
✅ Full "Impact" text
✅ Full "Repayment Plan" text
✅ Wallet activity score
✅ Social proximity details (mutual connections)
✅ Full contributor list

❌ Monthly income (never shown)

---

## What's Stored Off-Chain vs. On-Chain

### Off-Chain (Database)
- Loan title
- Story texts (About You, Loan Use, Impact, Repayment)
- Photo URL
- Monthly income range (encrypted, private)
- Application timestamp
- Draft data (localStorage)

### On-Chain (Blockchain)
- Borrower address
- Loan amount
- Repayment period
- Principal requested
- Total funded
- Contributors and amounts
- Repayment transactions
- Loan status (fundraising, active, completed)

---

## TypeScript Interface

```typescript
interface LoanFormData {
  // Section 1: Basics
  amount: number;              // $100 - $10,000
  repaymentWeeks: number;      // 4, 8, 12, 16, 24
  title: string;               // max 80 chars

  // Section 2: About You
  aboutYou: string;            // 200-600 chars suggested

  // Section 3: This Loan
  loanUse: string;             // 150-500 chars suggested
  expectedImpact: string;      // 100-400 chars suggested
  repaymentPlan: string;       // 150-400 chars suggested
  monthlyIncome?: IncomeRange; // optional, not displayed

  // Section 4: Photo
  imageUrl?: string;           // optional

  // Auto-populated
  borrowerAddress: `0x${string}`;
  farcasterFid?: number;
  createdAt: number;
  lastSavedAt: number;

  // Auto-calculated (don't ask user)
  biWeeklyPayment: number;     // calculated from amount + weeks
  estimatedRisk?: RiskLevel;   // from wallet + social + income (if provided)
}

enum IncomeRange {
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
  UNDER_1K = 'under_1k',
  ONE_TO_TWO_K = '1k_to_2k',
  TWO_TO_THREE_HALF_K = '2k_to_3.5k',
  THREE_HALF_TO_FIVE_K = '3.5k_to_5k',
  FIVE_TO_SEVEN_HALF_K = '5k_to_7.5k',
  OVER_SEVEN_HALF_K = 'over_7.5k'
}

enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

---

## Implementation Checklist

### Week 1: Core Form
- [ ] Build 5-section layout (Basics, About You, This Loan, Photo, Review)
- [ ] Implement all 8 input fields with proper validation
- [ ] Add character counters for textareas
- [ ] Image upload + crop tool (reuse ImageCropModal.tsx)
- [ ] Auto-save to localStorage every 10 seconds
- [ ] Preview card component

### Week 2: Smart Features
- [ ] Number detection in loan use field
- [ ] Sum validation (±10% warning)
- [ ] Repayment calculator above repayment field
- [ ] Monthly income smart warnings (if provided)
- [ ] Soft warnings for short responses (<50% suggested)
- [ ] Expandable guidance tips for each field

### Week 3: UX Polish
- [ ] Mobile responsive design (single column, large tap targets)
- [ ] Progressive disclosure on mobile
- [ ] Error handling and validation messages
- [ ] Accessibility (a11y) - keyboard nav, screen readers
- [ ] Success state after submission
- [ ] Edit loan after submission

### Week 4: Analytics & Testing
- [ ] Track completion rates per section
- [ ] Monitor dropout points
- [ ] A/B test income field presence
- [ ] Track income → repayment correlation
- [ ] Measure photo upload rate
- [ ] Iterate based on data

---

## Success Metrics

### Completion Rate
- **Target:** 75%
- **Measure:** % of users who start and complete form

### Time to Complete
- **Target:** 10-12 minutes average
- **Mobile:** 12-15 minutes acceptable

### Information Quality
- **Target avg characters:**
  - About You: 300 chars
  - Loan Use: 250 chars
  - Impact: 200 chars
  - Repayment: 250 chars
  - Total: ~1,000 chars (middle of range)

### Income Field Usage
- **Target:** 40-60% of users provide income
- **Measure:** % who select option other than "Prefer not to say"

### Photo Upload Rate
- **Target:** 60-70% of users upload photo
- **Measure:** % with custom photo vs. Farcaster pfp fallback

### Smart Warning Effectiveness
- **Measure:** % of users who adjust loan after warning
- **Target:** 30-50% adjustment rate when warned

### Funding Success Rate
- **Baseline:** To be established
- **Hypothesis:** Longer stories correlate with higher funding rates
- **Track:** Correlation between character count and % funded

---

## Conclusion

This form strikes the right balance:

✅ **Enough structure** to guide users and collect necessary info
✅ **Not overwhelming** - 4 story fields + 3 basics + 1 optional income
✅ **Works without rich profiles** - doesn't rely on Farcaster/wallet data
✅ **Mobile-friendly** - 10-12 minutes, progressive disclosure
✅ **Lenders get quality information** - specific use, repayment plan, context
✅ **Borrower protection** - Smart warnings prevent over-borrowing
✅ **Privacy respected** - Income never displayed publicly
✅ **Completion rate ~75%** - Balance between simplicity and thoroughness

**Philosophy:** Kiva's storytelling approach + crypto-native privacy + smart validation = optimal loan application experience.
