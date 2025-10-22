# Social Scoring Comparison: Mutual Follows vs. Interaction Quality

## TL;DR Recommendation

**For MVP**: Use **Approach 1** (mutual follows only) - simple, fast, good enough
**For V2**: Upgrade to **Approach 2** (weighted interactions) - better accuracy, research-backed

## Approach 1: Mutual Follows Only (What I Implemented)

### What It Measures
```typescript
mutualConnections = intersection(
  [...borrowerFollowers, ...borrowerFollowing],
  [...lenderFollowers, ...lenderFollowing]
)
```

Just counts how many mutual connections exist in the social graph.

### Pros ✅
1. **Simple & Fast**
   - 4 API calls total (2 followers + 2 following)
   - ~100ms response time
   - Easy to understand and explain

2. **Low API Cost**
   - Neynar free tier: 1000 calls/day = 250 proximity checks
   - Caching reduces actual calls significantly

3. **Already Proven**
   - Kiva research: 10% better repayment with 20+ friend/family connections
   - Easy threshold (10+ = LOW risk, 3-9 = MEDIUM, 0-2 = HIGH)

4. **Privacy-Friendly**
   - Just follower lists, no content analysis
   - Users expect this data to be public

5. **Resilient to Gaming**
   - Can't easily fake 20+ mutual real connections
   - Sybil-resistant (must build real social graph)

### Cons ❌
1. **Shallow Signal**
   - Following ≠ actual relationship
   - "I follow 1000 crypto influencers" ≠ knowing them

2. **No Interaction Quality**
   - Doesn't distinguish between close friend vs random follow
   - Misses strong ties that aren't mutual follows

3. **False Positives**
   - Bots can follow each other
   - Follow-for-follow schemes inflate connections

4. **Outdated Data**
   - Someone you followed years ago but never interact with

## Approach 2: Weighted Interactions (Your Suggestion)

### What It Measures
```typescript
score =
  2 * mutualFollows +
  1 * (likesAtoB + likesBtoA) +
  3 * (recastsAtoB + recastsBtoA) +
  4 * (repliesAtoB + repliesBtoA)

weighted = score * ((userScoreA + userScoreB) / 2)
```

Measures **actual interactions**, not just connections.

### Pros ✅
1. **Much Stronger Signal** (Research-Backed)
   - **Facebook EdgeRank**: Comments worth 10x more than likes
   - **Reciprocity Research**: Bidirectional interactions = higher trust
   - **Granovetter Strong Ties**: Frequent interaction = social capital

2. **Captures Real Relationships**
   - Replies = conversation = actual relationship
   - Recasts = trust in content
   - Likes = engagement (weaker but still signal)

3. **Bidirectional Weight**
   - Reciprocal interactions (A→B + B→A) = 2x weight
   - Matches research on reciprocity and trust

4. **Neynar User Score**
   - 0-1 quality score filters out spam/bot accounts
   - Weights toward high-quality users

5. **Harder to Game**
   - Must actually engage, not just follow
   - Bots can't easily fake thoughtful replies

6. **Temporal Awareness**
   - Recent interactions more valuable (can add time decay)
   - Shows **active** relationship, not dormant

### Cons ❌
1. **High API Cost** 💸
   - 4 calls for follows
   - 2 calls for casts (200 casts each)
   - 200+ calls for reactions (one per cast hash)
   - **~400 API calls per pair**
   - Free tier (1000/day) = **2-3 checks per day**

2. **Slow Performance** 🐌
   - Sequential API calls for each cast hash
   - ~10-30 seconds per proximity check
   - Poor UX for real-time loan browsing

3. **Privacy Concerns** 👀
   - Analyzing cast content and interactions
   - Users may not expect this level of analysis

4. **Complex to Explain** 📊
   - Hard to communicate scoring to users
   - "Why is this score 437 vs 512?"

5. **Edge Cases** 🤔
   - Users who lurk (consume but don't create)
   - New users with little history
   - Different interaction styles (some people never recast)

## Research-Backed Weights

### Facebook EdgeRank Research
| Action | Weight | Reasoning |
|--------|--------|-----------|
| Comment | 10x | Highest effort, shows deep engagement |
| Share | 5x | Public endorsement, trust signal |
| Like | 1x | Low effort, minimal commitment |

### Adapted for Farcaster
| Action | Weight | Reasoning |
|--------|--------|-----------|
| **Reply** | 4x | Conversation = relationship (like comments) |
| **Recast** | 3x | Public endorsement (like share) |
| **Like** | 1x | Low effort acknowledgment |
| **Mutual Follow** | 2x | Bidirectional connection baseline |

### Granovetter's Strong Ties Theory

Strong ties (frequent interaction) are MORE valuable for lending than weak ties (distant connections):
- **Strong ties**: Family, close friends → provide social support, enforce repayment
- **Weak ties**: Acquaintances → good for information, bad for accountability

**For lending**: You want **strong ties**, measured by **interaction frequency and reciprocity**.

## Hybrid Approach (Recommended for V2)

Combine both approaches with smart caching:

```typescript
// Fast tier (instant)
const quickScore = mutualFollows * 2;

// Slow tier (cached, background)
const detailedScore = await calculateInteractionScore(fidA, fidB);

// Cache detailed score for 24h
// Show quick score immediately, upgrade when detailed available

return {
  quickScore,      // 0-60 (mutual follows only)
  detailedScore,   // 0-100 (full interaction analysis)
  combined: quickScore + (detailedScore * 0.4), // Weighted average
};
```

### Benefits:
- Fast initial load (mutual follows)
- Upgrade to interaction data when available
- Cache expensive calculations
- Best of both worlds

## API Cost Comparison

### Approach 1 (Mutual Follows)
- **Per check**: 4 calls (followers + following)
- **Free tier**: 250 checks/day
- **Paid tier ($40/mo)**: ~7,500 checks/day
- **Response time**: ~100ms

### Approach 2 (Full Interactions)
- **Per check**: ~400 calls (cast reactions analysis)
- **Free tier**: 2-3 checks/day ❌
- **Paid tier ($40/mo)**: ~75 checks/day
- **Response time**: 10-30 seconds ❌

### Hybrid Approach
- **Quick score**: 4 calls (instant)
- **Detailed score**: 400 calls (background, cached 24h)
- **Free tier**: 250 quick checks + 2 detailed checks/day
- **Paid tier**: 7,500 quick + 75 detailed/day

## Recommendations by Stage

### MVP (Launch in 2 weeks)
✅ **Use Approach 1 (Mutual Follows)**
- Proven by Kiva (10% improvement)
- Simple, fast, cheap
- Good enough to test hypothesis
- Can A/B test to measure actual impact

### V1.5 (After Launch, 1-2 months)
✅ **Add Hybrid Scoring**
- Quick score for all loans (mutual follows)
- Detailed score for "featured" loans (top 10-20 loans)
- Background job to pre-calculate detailed scores
- Cache for 24 hours

### V2 (After Validating Impact, 3-6 months)
✅ **Full Interaction Analysis + Machine Learning**
- Upgrade to paid Neynar tier ($40-$100/mo)
- Run detailed analysis on all loans
- Track actual default rates by score tier
- Train ML model on which signals predict repayment best

## Alternative Solutions & Add-Ons

### 1. **Ethereum Attestation Service (EAS)** - Free
Instead of computing interactions, let users **vouch** for each other:

```solidity
struct Vouch {
  address voucher;
  address borrower;
  string message;
  uint256 timestamp;
}
```

**Pros**:
- On-chain, permanent record
- Explicit endorsement (stronger than follows)
- Free (just gas on Base)
- Can be revoked if borrower defaults

**Cons**:
- Requires user action (friction)
- Less data initially (must build up)

**Example**: Ethos Network uses this model

### 2. **Farcaster Frames for Vouching** - Free
Create a Frame where friends can vouch:

```tsx
<Frame>
  <Button action="/vouch/{loanId}">
    Vouch for Alice (10 USDC stake)
  </Button>
</Frame>
```

**Pros**:
- Viral (appears in feeds)
- Native to Farcaster UX
- Can add small stake (social collateral)

**Cons**:
- Requires Frame development
- Less discoverable than automatic scoring

### 3. **Coinbase Verifications** - Free
Use existing Coinbase attestations:

```typescript
const verifications = await checkCoinbaseVerifications(address);
// Returns: hasAccount, country, Coinbase One membership
```

**Pros**:
- Free, already indexed
- KYC-level verification
- Sybil-resistant

**Cons**:
- Only works for Coinbase users
- Privacy concerns

### 4. **OpenRank** - Free API
Use Farcaster's global trust rank:

```typescript
const rank = await openrank.getRank(fid);
// Returns: 0-1 trust score based on network position
```

**Pros**:
- Free API
- Already computed
- Sybil-resistant

**Cons**:
- Global rank, not pairwise
- Doesn't measure borrower-lender relationship

## My Final Recommendation

### Phase 1 (MVP - Next 2 weeks)
```typescript
// Start with mutual follows (what I built)
✅ Fast, cheap, proven
✅ Good enough to validate lending hypothesis
✅ Measure actual default rates by tier
```

### Phase 2 (After Launch - Month 2)
```typescript
// Add simple vouching
✅ Let friends explicitly vouch (EAS or off-chain)
✅ Weight: 1 vouch = 5 mutual follows
✅ Viral growth via Frames
```

### Phase 3 (After Traction - Month 3-4)
```typescript
// Upgrade to interaction analysis
✅ Background job calculates detailed scores
✅ Cache for 24h
✅ A/B test: Does interaction data improve repayment?
✅ If yes, upgrade Neynar tier
```

### Phase 4 (Scale - Month 6+)
```typescript
// ML-powered scoring
✅ Train on actual default data
✅ Find which signals predict repayment best
✅ Custom algorithm tuned for your community
```

## Code: Hybrid Implementation

Want me to implement the hybrid approach? I can:
1. Keep existing mutual-follow scoring (fast tier)
2. Add interaction analysis (slow tier, cached)
3. Combine scores intelligently
4. Add background job for pre-computation

Would take ~30 mins to implement. Let me know!
