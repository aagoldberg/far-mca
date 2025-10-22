# Quality Weighting for Social Scoring

## TL;DR

**You asked a BRILLIANT question:** Can we use Neynar's quality score to weight mutual connections?

**Answer**: YES! And it's **FREE** - you're already fetching it! ✅

## What Changed

### Before (Mutual Follows Only)
```
20 mutual connections = LOW RISK
regardless of account quality
```

**Problem:** Bots/spam accounts with 20 mutual bot friends = LOW RISK ❌

### After (Quality-Weighted)
```
20 mutual connections × 0.9 quality = 18 effective mutuals = LOW RISK ✅
20 mutual connections × 0.3 quality = 6 effective mutuals = MEDIUM RISK ✅
```

**Solution:** High-quality accounts weighted higher, spam filtered out ✅

## Cost Analysis

### API Calls Breakdown

**Before Quality Weighting:**
- 4 calls per check (2 followers + 2 following)
- User scores: Not used

**After Quality Weighting:**
- 4 calls per check (2 followers + 2 following)
- User scores: **Already included in profile data**
- Additional cost: **$0** ✅

**You're literally already paying for this data in every profile fetch!**

## How It Works

### Step 1: Fetch Profiles (Already Done)

```typescript
// You're already doing this via useFarcasterProfile
const borrowerProfile = await fetchProfile(borrowerAddress);
const viewerProfile = await fetchProfile(viewerAddress);

// Each profile includes (line 168 in useFarcasterProfile.ts):
borrowerProfile.score  // 0-1 quality score (FREE!)
viewerProfile.score    // 0-1 quality score (FREE!)
```

### Step 2: Calculate Quality-Adjusted Mutuals

```typescript
// Raw mutual connections
const mutualCount = 20;

// Average quality of both users
const avgQuality = (borrowerScore + viewerScore) / 2;
//  Example: (0.85 + 0.72) / 2 = 0.785

// Quality-weighted mutuals
const effectiveMutuals = mutualCount * avgQuality;
//  Example: 20 × 0.785 = 15.7 "effective" mutuals
```

### Step 3: Risk Assessment Using Effective Mutuals

```typescript
if (effectiveMutuals >= 9) {
  return 'LOW';     // High quality accounts with good connections
} else if (effectiveMutuals >= 2.5) {
  return 'MEDIUM';  // Average quality or moderate connections
} else {
  return 'HIGH';    // Low quality or few connections
}
```

## Real-World Examples

### Example 1: High-Quality Users

```
Borrower: 0.85 quality score (active, verified)
Lender: 0.72 quality score (regular user)
Mutual connections: 20

Calculation:
  avgQuality = (0.85 + 0.72) / 2 = 0.785
  effectiveMutuals = 20 × 0.785 = 15.7

Result: 15.7 effective mutuals → LOW RISK ✅
```

### Example 2: Bot Network

```
Borrower: 0.25 quality score (suspected bot)
Lender: 0.28 quality score (low engagement)
Mutual connections: 20

Calculation:
  avgQuality = (0.25 + 0.28) / 2 = 0.265
  effectiveMutuals = 20 × 0.265 = 5.3

Result: 5.3 effective mutuals → MEDIUM RISK ⚠️
(Was LOW RISK without quality weighting)
```

### Example 3: Spam Account

```
Borrower: 0.15 quality score (spam account)
Lender: 0.80 quality score (good account)
Mutual connections: 10

Calculation:
  avgQuality = (0.15 + 0.80) / 2 = 0.475
  effectiveMutuals = 10 × 0.475 = 4.75

Result: 4.75 effective mutuals → MEDIUM RISK ⚠️
(Prevents spam borrower from exploiting lender's good network)
```

## What Neynar Quality Score Measures

From Neynar documentation, the score (0-1) considers:

1. **Account Age** - Older accounts score higher
2. **Engagement Rate** - Active casters score higher
3. **Follower Quality** - Followed by quality accounts = higher score
4. **Content Quality** - Meaningful casts vs spam
5. **Reaction Patterns** - Natural engagement vs bot-like behavior

**Essentially: Active, trusted, real humans = high scores. Spam/bots = low scores.**

## Benefits of Quality Weighting

### 1. Sybil Resistance ✅
- Bots can create 100 fake accounts and follow each other
- But they can't fake high Neynar quality scores
- Quality weighting makes Sybil attacks much harder

### 2. Gaming Resistance ✅
- Follow-for-follow schemes get filtered out
- Low-quality accounts don't contribute much to trust score
- Must build real, quality network

### 3. Better Risk Assessment ✅
- 20 quality mutuals >> 20 bot mutuals
- Aligns with research (strong ties vs weak ties)
- More predictive of actual repayment

### 4. Transparency ✅
```tsx
// Users can see both metrics
<Badge>
  20 mutual connections
  (15.7 quality-weighted)
  Account Quality: HIGH (79%)
</Badge>
```

## Research Support

### Facebook/Twitter Quality Weighting

Both platforms weight user quality when scoring content:
- High-quality users → content shown to more people
- Low-quality users → content filtered/demoted
- Prevents spam from dominating feeds

**Same principle applies to trust scoring:**
- High-quality mutual connections → stronger trust signal
- Low-quality mutual connections → weaker trust signal

### Academic: Weighted Graph Theory

Research on weighted social graphs shows:
- Unweighted graphs susceptible to spam (quantity over quality)
- Weighted graphs more robust (quality matters)
- Trust propagation better in weighted networks

## UI/UX Considerations

### Option 1: Show Both Metrics (Recommended)

```tsx
<div>
  <div className="font-semibold">
    20 mutual connections
  </div>
  <div className="text-sm text-gray-500">
    15.7 quality-weighted · Account Quality: HIGH
  </div>
</div>
```

**Pros:**
- ✅ Transparent
- ✅ Educational
- ✅ Users understand the adjustment

**Cons:**
- ❌ Slightly more complex

### Option 2: Show Only Effective Mutuals

```tsx
<div>
  16 high-quality mutual connections
</div>
```

**Pros:**
- ✅ Simple
- ✅ Clean UI

**Cons:**
- ❌ Less transparent
- ❌ Users might not understand rounding

### Option 3: Show Quality Tier Only

```tsx
<div>
  20 mutual connections
  <Badge color="green">HIGH QUALITY</Badge>
</div>
```

**Pros:**
- ✅ Very simple
- ✅ Clear signal

**Cons:**
- ❌ Less educational

## Tuning Parameters

You can adjust these thresholds based on your data:

```typescript
// Quality tier thresholds
const QUALITY_TIERS = {
  HIGH: 0.7,    // Trusted accounts
  MEDIUM: 0.4,  // Average accounts
  LOW: 0.0,     // Potential spam
};

// Risk tier thresholds (quality-adjusted)
const RISK_TIERS = {
  LOW: 9.0,      // 9+ effective mutuals
  MEDIUM: 2.5,   // 2.5-9 effective mutuals
  HIGH: 0.0,     // <2.5 effective mutuals
};
```

After collecting real default data, you can optimize:
- If HIGH quality users never default → increase threshold
- If LOW quality users default often → filter them out
- If MEDIUM quality ambiguous → collect more data

## Edge Cases

### Case 1: One User Has No Score

```typescript
// Default to neutral 0.7 if score missing
const avgQuality = borrowerScore !== undefined && lenderScore !== undefined
  ? (borrowerScore + lenderScore) / 2
  : 0.7; // Neutral assumption
```

### Case 2: Both Users Low Quality

```typescript
Borrower: 0.3 quality
Lender: 0.25 quality
Mutuals: 15

Result: 15 × 0.275 = 4.1 effective → MEDIUM RISK
(Correctly identifies mutual spam network)
```

### Case 3: Asymmetric Quality

```typescript
Borrower: 0.2 quality (potential spam)
Lender: 0.9 quality (high quality)
Mutuals: 10

Result: 10 × 0.55 = 5.5 effective → MEDIUM RISK
(Protects lender from spam borrower)
```

## Implementation Status

✅ **DONE** - Quality weighting is now active in your code!

Files updated:
1. `/src/lib/socialProximity.ts` - Core calculation with quality weighting
2. `/src/hooks/useSocialProximity.ts` - Passes quality scores
3. `/src/components/SocialProximityBadge.tsx` - Displays quality info

## Next Steps

### Immediate (This Week)
1. ✅ Quality weighting is live (no additional work needed!)
2. 📊 Track metrics: Default rate by quality tier
3. 📊 Compare: HIGH quality vs LOW quality default rates

### After 1 Month of Data
```sql
-- Example analysis query
SELECT
  proximity.qualityTier,
  COUNT(*) as loans,
  AVG(CASE WHEN defaulted THEN 1 ELSE 0 END) as default_rate
FROM loans
GROUP BY proximity.qualityTier;

-- Expected results:
-- HIGH quality:   2-3% default rate
-- MEDIUM quality: 8-10% default rate
-- LOW quality:    20-30% default rate
```

### If Data Validates Quality Matters

Consider adding:
1. **Minimum quality threshold** - Don't allow borrowers below 0.3
2. **Quality-based limits** - Low quality = lower max loan amount
3. **Dynamic pricing** - Higher interest (or tip suggestion) for low quality

## FAQ

**Q: Is this over-engineering?**
A: No! You're already fetching the data. Using it costs $0 and filters spam. Win-win.

**Q: What if Neynar's score is wrong?**
A: Combine with other signals (mutual follows, vouching). No single metric is perfect.

**Q: Should we reject low-quality borrowers?**
A: No (too harsh). Just weight their connections less. Let lenders decide.

**Q: Can borrowers game their quality score?**
A: Very hard. Requires genuine engagement over time. Easier to just be a good user.

**Q: Will this reduce available loans?**
A: No. Low-quality borrowers can still get loans, just need more mutual connections or vouches.

## Future Enhancement: Contribution-Weighted Proximity

### Overview

Currently, proximity scores are **1:1 (viewer → borrower)**. Each potential lender sees their personal social connection to the borrower.

**Future enhancement**: Weight proximity scores by contribution sizes to show **aggregate loan-level trust**.

### Research Support

**Kiva Research** (Empirical):
- Overall repayment rate: 98.78% across 29,304 transactions (ScienceDirect, 2015)
- Loan size and term significantly affect repayment performance
- Social connections between lender-borrower improve outcomes
- **Note**: Specific effect of contribution amount in P2P lending is untested

**Grameen Bank Research** (World Bank, Khandker):
- Joint liability in group lending: 98% recovery rate
- Group pressure and accountability drive repayment
- Women less credit risk than men; women's groups more homogeneous
- Group lending structure increases repayment rates vs. individual loans

**Reciprocity Theory** (Nature Communications, 2023):
- Receiving favors induces "indebtedness" - obligation to reciprocate
- Delayed reciprocity creates "social debt" proportional to favor size
- Larger favors → stronger feelings of guilt and obligation
- Reciprocity is fundamental cognitive substrate of financial behavior

**Loss Aversion** (Kahneman & Tversky, Prospect Theory):
- Losses are psychologically 2x more powerful than equivalent gains
- Loss aversion extends beyond money to social status and reputation
- Recent research: Loss aversion increases with stake size
- Risk of losing trust/reputation scales with amount borrowed

**Hypothesis** (Supported but Untested in Crypto P2P):
- $1000 from close friend → stronger social pressure than $10
- Borrower reputation at stake proportional to creditor relationship + amount
- Social collateral effectiveness should scale with financial exposure

### Example: Contribution-Weighted Scoring

**Scenario**: Loan for $1000

```
Lender A: $800 (80%), proximity 90 (HIGH) → Close friend, large stake
Lender B: $150 (15%), proximity 50 (MEDIUM) → Acquaintance, moderate stake
Lender C: $50 (5%), proximity 20 (LOW) → Stranger, small stake

Weighted Score: (0.80 × 90) + (0.15 × 50) + (0.05 × 20) = 80.5 → LOW RISK

Breakdown:
🟢 HIGH proximity: $800 (80% of funding)
🟡 MEDIUM proximity: $150 (15% of funding)
🔴 LOW proximity: $50 (5% of funding)

Result: "80% funded by borrower's close network - Strong accountability"
```

### Why Not Implemented Now (MVP)

**Reasons to wait**:

1. ✅ **Validate basic signals first**: Need to prove 1:1 proximity matters before adding complexity
2. ✅ **Low lender count initially**: Most early loans will have 1-5 lenders (too few to weight meaningfully)
3. ✅ **API cost**: Requires fetching proximity for ALL lenders (20 lenders × 4 calls = 80 calls per loan)
4. ✅ **Compute overhead**: Need background job + caching for good UX (can't compute 80 calls on-demand)
5. ✅ **MVP simplicity**: Add features incrementally based on data

**When to implement**:

Only after **Month 1 data shows**:
- LOW proximity loans default >5% more than HIGH proximity ✅
- Proves social signals matter for your community ✅
- Average loan has 10+ lenders (enough to weight) ✅

### Implementation Approach (V2)

**Cost-Efficient Strategy**:

```typescript
// Background job (runs every 6 hours)
async function computeWeightedProximityForActiveLoans() {
  const activeLoans = await getActiveLoans();

  for (const loan of activeLoans) {
    if (loan.lenders.length < 3) continue; // Skip small loans

    // Fetch proximity for all lenders
    const weightedScore = await calculateWeightedLoanProximity(
      loan.borrowerFid,
      loan.lenders, // Array of { fid, contribution }
      loan.totalFunded
    );

    // Cache result for 6 hours
    await redis.set(
      `loan:${loan.id}:weighted_proximity`,
      JSON.stringify(weightedScore),
      'EX', 21600
    );
  }
}

// API endpoint (returns cached value)
app.get('/api/loans/:id/weighted-proximity', async (req, res) => {
  const cached = await redis.get(`loan:${req.params.id}:weighted_proximity`);
  if (cached) return res.json(JSON.parse(cached));
  return res.json(null); // Not yet computed
});
```

**API Cost** (100 active loans, average 20 lenders each):
- 100 loans × 20 lenders × 4 calls = 8,000 calls per run
- Every 6 hours = 32,000 calls/day
- Neynar Standard tier: 10k/day limit → Need Scale tier ($500/mo)
- **Wait until revenue justifies this cost**

### UI Display (V2)

**Individual Proximity** (Current - MVP):
```tsx
<SocialProximityBadge borrowerAddress={loan.borrower} />
// Shows: "🟢 15 mutual connections - Highly trusted in your network"
```

**Weighted Loan Proximity** (Future - V2):
```tsx
{loan.lenders.length >= 3 && weightedProximity && (
  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
    <div className="font-semibold text-sm">Overall Loan Trust</div>
    <div className="text-2xl font-bold text-green-600">
      {weightedProximity.weightedScore}/100
    </div>

    <div className="mt-2 space-y-1 text-xs">
      <div className="flex justify-between">
        <span>🟢 HIGH proximity funding:</span>
        <span className="font-medium">
          {weightedProximity.fundingByTier.LOW.percent.toFixed(0)}%
        </span>
      </div>
      <div className="flex justify-between">
        <span>🟡 MEDIUM proximity funding:</span>
        <span className="font-medium">
          {weightedProximity.fundingByTier.MEDIUM.percent.toFixed(0)}%
        </span>
      </div>
      <div className="flex justify-between">
        <span>🔴 LOW proximity funding:</span>
        <span className="font-medium">
          {weightedProximity.fundingByTier.HIGH.percent.toFixed(0)}%
        </span>
      </div>
    </div>

    <div className="mt-2 text-xs text-gray-600 italic">
      Mostly funded by borrower's close network - stronger accountability
    </div>
  </div>
)}
```

### Analytics to Track (Now)

Even without implementing weighted scoring yet, **track contribution size with proximity**:

```typescript
track('loan_funded', {
  loanId: loan.id,
  lenderProximity: proximity?.riskTier,
  contributionAmount: contribution,
  percentOfLoan: (contribution / loan.principal) * 100,
});

track('loan_repaid', {
  loanId: loan.id,
  // Later analyze: Did loans with large HIGH-proximity contributions repay better?
});

track('loan_defaulted', {
  loanId: loan.id,
  // Later analyze: Default rate by funding composition
});
```

**After 2-3 months, analyze**:

```sql
-- Do larger contributions from HIGH proximity lenders correlate with repayment?
SELECT
  CASE
    WHEN high_prox_percent > 70 THEN 'Mostly Close Network'
    WHEN high_prox_percent > 40 THEN 'Mixed Network'
    ELSE 'Mostly Strangers'
  END as funding_composition,
  COUNT(*) as loans,
  AVG(CASE WHEN defaulted THEN 1 ELSE 0 END) as default_rate
FROM (
  SELECT
    loan_id,
    SUM(CASE WHEN proximity = 'LOW' THEN contribution ELSE 0 END) / total_funded * 100 as high_prox_percent,
    MAX(defaulted) as defaulted
  FROM loan_contributions
  GROUP BY loan_id
) subquery
GROUP BY funding_composition;

-- Expected results (if contribution weighting matters):
-- Mostly Close Network:   2-3% default rate ✅
-- Mixed Network:          7-10% default rate
-- Mostly Strangers:       15-20% default rate ❌
```

**If data shows contribution weighting matters** → Implement V2
**If data shows no correlation** → Skip feature, keep MVP simple

### Decision Framework

**Implement Contribution Weighting IF**:
- ✅ Month 1-2 data validates basic proximity reduces defaults
- ✅ Average loan has 10+ lenders (enough to weight)
- ✅ Data shows larger HIGH-proximity contributions → better repayment
- ✅ Revenue supports $500/mo Neynar Scale tier

**Keep MVP Simple IF**:
- ❌ Haven't validated basic proximity matters yet
- ❌ Most loans have <5 lenders
- ❌ No correlation between contribution size + proximity + repayment
- ❌ Limited budget for API costs

## Conclusion

Adding quality weighting is a **no-brainer**:

- ✅ Free (data already fetched)
- ✅ Better risk assessment
- ✅ Spam/bot resistant
- ✅ Research-backed
- ✅ Already implemented!

**Contribution weighting** is a **strong V2 enhancement**:

- 📊 Track metrics first
- 📊 Validate basic signals work
- 📊 Implement only if data justifies cost
- 📊 Always iterate based on real default data
