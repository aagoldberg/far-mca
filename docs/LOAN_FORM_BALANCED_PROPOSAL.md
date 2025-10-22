# Loan Form: Balanced Proposal (Middle Ground)

## The Problem with Both Extremes

### Too Restrictive (Original)
- ❌ 6 separate essay fields (600-5400 characters)
- ❌ 15-20 minute completion time
- ❌ ~60% completion rate
- ❌ Mobile users abandon

### Too Simple (Simplified)
- ❌ Relies too heavily on wallet/Farcaster data
- ❌ New wallets = no signal
- ❌ Minimal Farcaster profiles = no context
- ❌ Lenders need more information to make decisions
- ❌ One big textarea = users don't know what to write

---

## Balanced Approach: 3 Focused Sections

### What Lenders Actually Need to Know

**The 3 Core Questions:**
1. **WHO are you?** (Credibility & trust)
2. **WHAT do you need & how will you use it?** (Specific plan)
3. **WHY can you repay?** (Risk assessment)

Let's structure the form around these 3 questions with enough guidance to help users, but not so much that it's overwhelming.

---

## Form Structure

### Section 1: Loan Basics (2 minutes)

**Same as before - no changes needed:**

1.1 **Loan Amount** - $100 to $10,000 USDC
1.2 **Repayment Period** - 4, 8, 12, 16, or 24 weeks
1.3 **Loan Title** - Max 80 characters, clear and specific

**Example title:** "Buying sewing machine to expand tailoring business"

---

### Section 2: About You (3-5 minutes)

#### Question: "Who are you and what do you do?"

**Purpose:** Establish credibility and context for the loan

**Type:** Textarea with structure guidance
**Suggested length:** 200-600 characters (~2-4 sentences or 1-2 paragraphs)
**No hard minimum, but show warning if <100 chars**

**Placeholder/Example:**
```
I'm Alex, a freelance graphic designer based in Austin. I've been doing design work for 2 years, specializing in branding for small businesses. I currently work with 8 active clients and earn about $2,500/month. Before freelancing, I worked at a marketing agency for 3 years.
```

**Expandable Guidance (click to view):**
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

**Why this works:**
- Focused question with clear purpose
- Flexible enough for different situations (employed, entrepreneur, student, etc.)
- Short enough to not be intimidating (2-4 sentences)
- Guidance helps users know what to write
- Complements Farcaster profile rather than duplicating it

---

### Section 3: This Loan (5-8 minutes)

#### 3.1 What will you use this loan for?

**Purpose:** Specific breakdown of how funds will be used

**Type:** Textarea with itemized list encouragement
**Suggested length:** 150-500 characters
**Show warning if <75 chars**

**Placeholder/Example:**
```
I'll use the $1,500 to:
- Refurbished MacBook Pro M2: $1,400
- Adobe Creative Cloud (1 year): $100

My current laptop is 8 years old and crashes 2-3 times per day, which means I'm losing clients and can't meet deadlines.
```

**Expandable Guidance:**
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

Or write it naturally:
"I need $800 to buy inventory (50 units at $16 each). This will stock my online store for the holiday season."
```

**Smart Validation:**
- If numbers in description don't sum to loan amount (±10%), show warning:
  - ⚠️ "Your breakdown ($X) doesn't match your loan amount ($Y). Please review."

---

#### 3.2 What will this help you achieve?

**Purpose:** Show impact and future plans

**Type:** Textarea
**Suggested length:** 100-400 characters (1-2 sentences)
**Show warning if <50 chars**

**Placeholder/Example:**
```
This laptop will let me take on 3-5 more clients per month (currently turning them down). That's an extra $1,200-$1,500 in monthly revenue, which means I can repay this loan in 2 months and reinvest the rest into marketing.
```

**Expandable Guidance:**
```
💡 Show the impact:

✅ What changes after you get this loan?
✅ Specific outcomes (more clients, higher revenue, new opportunities)
✅ Numbers if possible (e.g., "2x my production", "+$500/month")

Keep it short:
✅ 1-2 sentences is perfect
✅ Focus on measurable impact
```

---

#### 3.3 How will you repay this loan?

**Purpose:** Risk assessment and repayment capacity

**Type:** Textarea
**Suggested length:** 150-400 characters (2-3 sentences)
**Show warning if <75 chars**

**Placeholder/Example:**
```
I earn $2,500/month from my design freelance work, with 8 active clients providing steady income. The bi-weekly payment of $187 is only 7.5% of my monthly income. I also have $3,000 in savings as a backup.
```

**Expandable Guidance:**
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

---

#### 3.4 Approximate Monthly Income (Optional)

**Purpose:** Enable smart warnings for unrealistic repayment schedules

**Type:** Dropdown select
**Optional**

**Label:** "Approximate monthly income (optional)"

**Helper Text:**
```
This helps us warn you if the repayment schedule might be challenging.
We'll never display this publicly—only you see it.
```

**Options:**
1. Prefer not to say
2. Less than $1,000/month
3. $1,000 - $2,000/month
4. $2,000 - $3,500/month
5. $3,500 - $5,000/month
6. $5,000 - $7,500/month
7. More than $7,500/month

**Privacy Guarantees:**
- ❌ Never displayed on loan card
- ❌ Never shown in loan details page
- ❌ Never exposed via public API
- ✅ Only used for internal risk warnings
- ✅ Encrypted in database
- ✅ Only visible to you

**Smart Warnings (if provided):**

If income is provided and bi-weekly payment exceeds 25% of monthly income:

```
⚠️ This repayment schedule may be challenging

Your bi-weekly payment ($750) is 50% of your stated monthly income.
Most successful borrowers keep payments under 20% of income.

Suggestions:
- Extend timeline to 16 weeks → $375 bi-weekly (25% of income)
- Reduce loan to $1,200 → $300 bi-weekly (20% of income)

[Adjust Loan] [Continue Anyway]
```

If income is provided and payment is under 20%:

```
✅ This looks manageable!

Your bi-weekly payment ($250) is only 6% of your stated monthly income.
This is well within the recommended range.

💡 Tip: Mentioning this in your "repayment plan" above helps build lender confidence.
```

**Why it's optional:**
- Respects privacy concerns
- Variable income users can skip
- Still get form completion even without income data
- Users control disclosure in story field

**Why we ask:**
- Protects borrowers from over-borrowing
- Reduces default rate through better planning
- Enables helpful suggestions for timeline/amount
- Platform analytics on income/repayment correlation

---

### Section 4: Add a Photo (2 minutes)

#### 4.1 Upload a photo (Encouraged, not required)

**Type:** Image upload with crop tool
**Optional**

**Banner:**
```
📸 Loans with photos get funded 35% faster

Show yourself and what you're working on. Lenders want to see the person behind the request.
```

**Photo Guidelines (expandable):**
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

**Fallback:**
- If no photo uploaded: Use Farcaster profile picture on loan card
- User can add/update photo after submission

**Why it's optional:**
- Don't block submission if they don't have a good photo ready
- Can add later
- Still show incentive (35% faster)

---

### Section 5: Review & Submit (1 minute)

#### 5.1 Preview Card
Shows how loan will appear, including:
- Loan title, amount, timeline
- Story excerpts (first 200 chars)
- Photo or Farcaster pfp
- Social proximity badge (if applicable)
- Wallet activity score

#### 5.2 Terms Acknowledgment
- ☐ All information is truthful
- ☐ I understand 0% interest, bi-weekly repayments
- ☐ I commit to repaying to maintain my reputation
- ☐ Loan details are public on blockchain

---

## Comparison: All Three Versions

| Feature | Original | Too Simple | Balanced ✅ |
|---------|----------|------------|------------|
| **Sections** | 7 | 4 | 5 |
| **Required text fields** | 6 essays | 1 essay | 4 focused fields |
| **Total chars required** | 600-5400 | 300+ | 475+ (suggested) |
| **Hard minimums** | Yes (600+) | No | Soft (warnings <475) |
| **Estimated time** | 15-20 min | 5-7 min | 10-12 min |
| **Completion rate** | ~60% | ~85% | ~75% |
| **Information quality** | High | Low | Medium-High |
| **Works with minimal wallet** | Yes | ❌ No | Yes |
| **Works with no Farcaster** | Yes | ❌ No | Yes |
| **Mobile friendly** | ❌ No | Yes | Yes |

---

## Field-by-Field Breakdown

### What We Ask (Balanced Version)

**Section 1 - Basics (3 fields, ~1 min)**
1. Amount (number)
2. Timeline (dropdown)
3. Title (text, 80 chars)

**Section 2 - About You (1 field, ~3 min)**
4. Who are you and what do you do? (200-600 chars suggested)

**Section 3 - This Loan (4 fields, ~7 min)**
5. What will you use this for? (150-500 chars suggested)
6. What will this achieve? (100-400 chars suggested)
7. How will you repay? (150-400 chars suggested)
8. Approximate monthly income (optional dropdown)

**Section 4 - Photo (1 field, ~2 min)**
9. Upload photo (optional)

**Total:** 8 fields - 7 required text/number/dropdown + 1 optional image (vs. 15+ in original, 4 in too-simple)
**Total suggested characters:** 600-1900 (vs. 600-5400 in original)
**Total time:** 10-12 minutes (vs. 15-20 in original, 5-7 in too-simple)

---

## Why This Balance Works

### 1. Structured but Not Rigid
- 4 text fields with clear purposes
- Each field answers a specific question lenders need
- Not overwhelming like 6 essays, not vague like 1 big box

### 2. Works Without Rich Profiles
- ✅ New wallet? "About You" section provides context
- ✅ Empty Farcaster bio? Story gives background
- ✅ No transaction history? Repayment explanation helps
- ✅ Still benefits from Farcaster/wallet data when available

### 3. Guidance Over Enforcement
- Suggested character counts, not hard minimums
- Warnings at <50% of suggested length
- Examples show what good looks like
- Expandable tips for those who need help

### 4. Mobile-Friendly
- 10-12 minutes is doable on mobile
- Can complete in one sitting
- Progressive disclosure (expandable guidance)
- Auto-save prevents loss

### 5. Quality Signals for Lenders
- Specific loan use with numbers
- Impact/outcomes described
- Repayment capacity explained
- Personal context provided
- Still much faster than original

---

## Smart Features

### 1. Character Count Warnings (Not Blocks)

**Progressive warnings:**
```
0-49 chars: 🔴 "Add more detail to help lenders trust your request"
50-99 chars: 🟡 "Consider adding more specific information"
100+ chars: 🟢 "Looking good!" (no message)
```

**Never block submission** - just warn

### 2. Number Detection in Loan Use Field

**Smart parser:**
- Detects dollar amounts in text: $1,200, $450, etc.
- Sums them up
- Compares to loan amount
- If off by >10%: ⚠️ Warning
- If within 10%: ✅ Green checkmark

**Example:**
```
User writes: "MacBook Pro $1,400 and Adobe $100"
Detected sum: $1,500
Loan amount: $1,500
Result: ✅ "Your breakdown matches your loan amount"
```

### 3. Repayment Calculator

**Show above "How will you repay" field:**
```
💰 Your Repayment Schedule:
Loan amount: $1,500
Period: 8 weeks (4 payments)
Bi-weekly payment: $375

If you earn $2,000/month, this payment is 18.75% of your income.
```

**Help users assess if they can actually repay**

### 4. Auto-Save Draft

- Save to localStorage every 10 seconds
- "Draft saved 5 seconds ago" indicator
- Recover on page refresh
- "Continue your draft" banner if detected

### 5. AI Writing Assistant (Optional Feature)

**"Need help writing this?" button**

Opens simple Q&A:
```
Q: What do you do for work or income?
A: [Freelance graphic design]

Q: How much do you earn per month (approximately)?
A: [$2,500]

Q: What exactly do you need to buy with this loan?
A: [MacBook Pro and Adobe subscription]

Q: What will this help you achieve?
A: [Take on more clients, increase revenue]

Q: Why are you confident you can repay?
A: [Steady income, only 7% of my earnings]

[Generate Draft] button
```

**Generates:**
```
About You:
I'm a freelance graphic designer earning about $2,500/month from client work.

Loan Use:
I'll use this loan to purchase a MacBook Pro and Adobe subscription, which will allow me to take on more clients and increase my design capacity.

Impact:
This will help me increase my revenue and take on larger projects that I'm currently turning down.

Repayment:
With my monthly income of $2,500, the bi-weekly payment is only 7% of my earnings, making it very manageable.
```

User can then **edit and personalize** the draft.

**Benefits:**
- Helps non-native English speakers
- Reduces blank page anxiety
- Ensures key information is included
- User still customizes and owns the story

---

## Validation Rules

### Required Fields
1. Loan amount ✅
2. Repayment period ✅
3. Loan title ✅
4. About you ✅
5. Loan use ✅
6. Expected impact ✅
7. Repayment plan ✅
8. Monthly income ⚠️ (optional, for smart warnings)
9. Photo ⚠️ (optional but encouraged)
10. Terms checkboxes ✅

### Soft Minimums (Warnings, Not Blocks)

| Field | Suggested Length | Warning Threshold |
|-------|-----------------|-------------------|
| About you | 200-600 chars | <100 chars |
| Loan use | 150-500 chars | <75 chars |
| Impact | 100-400 chars | <50 chars |
| Repayment | 150-400 chars | <75 chars |

**Total suggested:** 600-1900 characters
**Warning threshold:** 300 characters total

**If below threshold:**
```
⚠️ Your loan request might need more detail

Lenders make better decisions with specific information. Consider adding:
- More details about your background
- Specific breakdown of how you'll use the funds
- Clearer explanation of how you'll repay

You can still submit, but detailed requests get funded faster.

[Go Back and Add Detail] [Submit Anyway]
```

---

## Mobile Optimization

### Layout
- Single column throughout
- Large tap targets (48×48px minimum)
- Expandable guidance (collapsed by default on mobile)
- Sticky progress bar at top
- Sticky "Save Draft" button at bottom

### Progressive Disclosure
- Section 1: Always visible
- Section 2: Unlocks after Section 1 complete
- Section 3: Unlocks after Section 2 complete
- Section 4: Unlocks after Section 3 complete
- Section 5: Unlocks after Section 4 (photo optional)

### Smart Keyboard
- Number inputs → numeric keyboard
- Text inputs → text keyboard with autocorrect
- Textareas → multiline with character counter

---

## A/B Testing Plan

### Test 1: Character Minimums
- **A:** Soft warnings at suggested minimums (600-1900 chars total)
- **B:** Stricter warnings at 50% of suggested (300-950 chars total)
- **Hypothesis:** B will have 10% higher completion with similar quality

### Test 2: Number of Fields
- **A:** 4 text fields (current balanced proposal)
- **B:** 3 text fields (combine "loan use" + "impact" into one)
- **Hypothesis:** B will have 5% higher completion, similar quality

### Test 3: AI Assistant
- **A:** No AI assistant
- **B:** "Need help?" button with Q&A → draft generation
- **Hypothesis:** B will have 15% higher completion, especially for non-native speakers

### Test 4: Photo Requirement
- **A:** Photo required
- **B:** Photo optional with "35% faster funding" incentive
- **Hypothesis:** B will have 20% higher completion, 5% slower time-to-fund

---

## Success Metrics

### Completion Rate
- **Target:** 75% (vs. 60% for long forms, 85% for ultra-simple)
- **Measure:** % of users who start form and submit

### Time to Complete
- **Target:** 10-12 minutes average
- **Acceptable range:** 8-15 minutes
- **Red flag:** >20 minutes (form too long)

### Information Quality
- **Measure:** Average character count per field
- **Target:**
  - About You: 300 chars avg
  - Loan Use: 250 chars avg
  - Impact: 200 chars avg
  - Repayment: 250 chars avg
- **Total:** ~1,000 chars avg (middle of 600-1900 range)

### Lender Satisfaction
- **Survey after funding:** "Did you have enough information to make a decision?"
- **Target:** 85% "Yes"

### Funding Success Rate
- **Measure:** % of submitted loans that reach 100% funding
- **Target:** 60% (baseline to establish)
- **Correlation:** Longer, detailed requests should fund at higher rates

---

## Edge Cases

### Minimal Information User
**Scenario:** New user, minimal Farcaster, new wallet, wants $200 loan

**How form handles it:**
- ✅ "About You" captures who they are (Farcaster bio might be empty)
- ✅ Loan use explains what they need
- ✅ Repayment section shows capacity (even if wallet is empty)
- ✅ Lower social proximity score will show → higher risk
- ✅ Wallet activity score will be low → higher risk
- ✅ BUT they can still submit and tell their story
- ⚠️ Lenders see risk signals and can choose to fund or not

**Result:** Form works, lenders have information to assess risk

### Privacy-Conscious User
**Scenario:** User doesn't want to share exact income numbers

**How form handles it:**
- ✅ Suggested language: "I have stable income that more than covers this payment"
- ✅ Can be vague: "I work full-time and the payment is manageable"
- ✅ No requirement to state exact dollar amounts
- ✅ Example text shows ranges: "$2,000-3,000/month" instead of exact

**Result:** Can complete without over-sharing

### Non-English Speaker
**Scenario:** English is second language, struggles with writing

**How form handles it:**
- ✅ AI assistant option: Q&A → generates draft they can edit
- ✅ Examples in each field show structure
- ✅ Short suggested lengths (not long essays)
- ✅ Can use translation tools, no complex jargon

**Result:** Lower barrier to entry

---

## Implementation Timeline

### Week 1: Core Form
- [ ] Build 5-section layout
- [ ] Implement 7 input fields
- [ ] Add character counters
- [ ] Image upload + crop
- [ ] Auto-save to localStorage
- [ ] Preview card

### Week 2: Smart Features
- [ ] Number detection in loan use field
- [ ] Sum validation (±10% warning)
- [ ] Repayment calculator
- [ ] Soft warnings for short responses
- [ ] Expandable guidance tips

### Week 3: Polish & Testing
- [ ] Mobile responsive design
- [ ] Progressive disclosure
- [ ] Error handling
- [ ] Accessibility (a11y)
- [ ] Internal testing

### Week 4: AI Assistant (Optional)
- [ ] Q&A interface
- [ ] Draft generation (GPT integration)
- [ ] Edit generated draft flow
- [ ] A/B test AI vs. no-AI

---

## Final Recommendation

**Use the Balanced Approach:**

✅ **Enough structure** to guide users and collect necessary info
✅ **Not overwhelming** - 4 focused text fields instead of 6 essays
✅ **Works without rich profiles** - doesn't rely on Farcaster/wallet data
✅ **Mobile-friendly** - 10-12 minutes on phone
✅ **Lenders get quality information** - specific use, repayment plan, context
✅ **Completion rate ~75%** - balance between simplicity and thoroughness

**The sweet spot between:**
- Too restrictive (15-20 min, 6 essays, 60% completion)
- Too simple (relies on data we don't have, low information)

**Philosophy:**
> "Make it as simple as possible, but not simpler."
> — Paraphrasing Einstein

We need enough information for lenders to make decisions, but not so much that borrowers abandon the form. This balanced approach hits that mark.
