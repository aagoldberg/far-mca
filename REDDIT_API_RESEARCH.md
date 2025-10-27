# Reddit API Research for Social Trust Scoring

## Executive Summary: ❌ **NOT RECOMMENDED**

Reddit is **NOT suitable** for friendship intimacy variables or trust scoring due to fundamental limitations.

---

## The Verdict

| Criteria | Status | Rating |
|----------|--------|--------|
| **Friend/Follower Graph** | ❌ Private, not accessible | 0/5 |
| **Mutual Connections** | ❌ Cannot detect | 0/5 |
| **Interaction Data** | ⚠️ Manual parsing only | 1/5 |
| **Trust Signals** | ⚠️ Very weak (karma, age) | 1/5 |
| **API Cost** | ⚠️ $0.24 per 1K calls | 2/5 |
| **Overall Feasibility** | ❌ Poor | **1/5** |

**Bottom Line**: Reddit fundamentally lacks the social graph data needed for trust scoring.

---

## Why Reddit Doesn't Work

### 1. No Access to Social Graph ❌

**Critical Issue**: Reddit does NOT expose friend or follower relationships via API.

- Friend lists are **private**
- No way to get who follows a user
- No way to get who a user follows
- Cannot detect mutual connections
- "Friend" feature rarely used on Reddit

**Comparison**:
```
Farcaster: ✅ Full follower/following access
Bluesky:   ✅ Full follower/following + mutual endpoint
Twitter:   ✅ Follower/following (but expensive)
Reddit:    ❌ NOTHING - completely private
```

### 2. Content-Centric, Not User-Centric

Reddit's design philosophy:
- Users follow **subreddits**, not people
- Anonymous/pseudonymous culture
- Community-focused, not personal connections
- No concept of "friendship intimacy"

### 3. Available Data is Weak

What you CAN get:
- ✅ Karma scores (post karma, comment karma)
- ✅ Account age
- ✅ Post/comment history
- ✅ Subreddit activity

**Problem**: None of these measure trust or friendship!

- High karma ≠ trustworthy person
- Old account ≠ reliable borrower
- Shared subreddit ≠ friends

### 4. Interaction Analysis is Prohibitively Expensive

To find if two users interact:
- Must manually parse ALL comments from both users
- Look for reply chains
- Cross-reference user IDs
- Rate limit: 100 calls per minute

**Cost Example** (1,000 users):
- ~300 API calls per user analysis
- 1,000 users × 300 calls = 300,000 calls/month
- Cost: $72/month
- **Value**: Minimal (no actual trust data)

---

## What Reddit API Actually Provides

### Available Endpoints

#### User Profile Data
```
GET /user/{username}/about.json
```
Returns:
- Username
- Total karma (post + comment + award)
- Account creation date
- Profile bio
- Verified status
- Moderator status

#### Comment/Post History
```
GET /user/{username}/comments
```
Returns:
- Recent comments (max 100 per call)
- Comment text, score, timestamp
- Subreddit where posted
- Parent post info

### NOT Available

- ❌ Friend lists
- ❌ Follower counts
- ❌ Follower/following lists
- ❌ Mutual connections
- ❌ Direct user-to-user interaction API
- ❌ Private messages
- ❌ Real-time engagement metrics

---

## API Costs & Rate Limits

### Pricing (Post-July 2023)

**Free Tier**:
- 100 queries per minute (QPM) with OAuth
- 10 QPM without OAuth
- Only for non-commercial use

**Paid Tier**:
- **$0.24 per 1,000 API calls**
- ~$1 per user per month (typical usage)

### The 2023 API Controversy

- Reddit started charging for API access July 1, 2023
- Previously free since 2008
- Killed third-party apps:
  - Apollo shut down (would cost $20M/year)
  - Reddit is Fun shut down
  - Sync shut down
- Academic research severely impacted

### Rate Limits

- 100 QPM with OAuth (authenticated)
- 10 QPM without OAuth
- Averaged over 10-minute windows
- PRAW library handles automatically

---

## Comparison to Other Platforms

| Feature | Farcaster | Bluesky | Twitter/X | Reddit |
|---------|-----------|---------|-----------|--------|
| **Social Graph** | ✅ Full | ✅ Full | ✅ Yes* | ❌ No |
| **Mutual Connections** | ✅ Easy | ✅ Built-in API | ⚠️ Calculate | ❌ Impossible |
| **Engagement Data** | ✅ Rich | ✅ Rich | ✅ Good | ⚠️ Limited |
| **Trust Scoring** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **API Cost** | $49-99/mo | Free | $200+/mo* | $0-72/mo |
| **Feasibility** | ✅ Excellent | ✅ Excellent | ⚠️ Good | ❌ Poor |

*Twitter official API is $42K/mo for social graph; third-party alternatives available

---

## Why Farcaster is Superior

### Farcaster Far Scores

Farcaster has **built-in reputation scoring** called "Far Scores":

**What Far Scores Measure**:
- Social capital and influence
- Network position
- Engagement quality
- Relative reputation

**API Access**:
```typescript
// Get user's Far Score
const score = await getFarScore(fid)

// Get mutual connections
const mutuals = await getMutualFollows(fid1, fid2)

// Social graph fully accessible
const followers = await getFollowers(fid)
const following = await getFollowing(fid)
```

**Comparison**:
| Metric | Reddit | Farcaster |
|--------|--------|-----------|
| Reputation Score | Karma (gameable) | Far Scores (dynamic) |
| Social Graph | ❌ Private | ✅ Public |
| Mutual Connections | ❌ No | ✅ Yes |
| Trust Signals | ⭐ Weak | ⭐⭐⭐⭐⭐ Strong |
| API Quality | ⭐⭐ Limited | ⭐⭐⭐⭐ Good |

---

## Theoretical Reddit Use Cases (Not Recommended)

If you absolutely must use Reddit data, limit it to:

### 1. Basic Fraud Detection (Defensive Only)

```python
def reddit_fraud_check(username):
    user = reddit.redditor(username)

    # Red flags
    if account_age_days < 30:
        return "REJECT: Account too new"
    if total_karma < 100:
        return "REJECT: Suspicious low karma"
    if user.is_suspended:
        return "REJECT: Suspended"

    return "PASS"
```

**Use**: Filter out obvious spam/bot accounts
**Don't use**: As a trust score or lending decision

### 2. Community Reputation (Informational)

- Check if active in r/borrow or lending subreddits
- See if posts in financial/crypto communities
- Review comment history for red flags

**Use**: Background context only
**Don't use**: As primary trust metric

### 3. Market Research (Not Scoring)

- Study loan discussions on r/borrow
- Analyze lending request patterns
- Understand borrower needs

**Use**: Product development insights
**Don't use**: Individual user scoring

---

## Recommendation for LendFriend

### DO NOT INTEGRATE Reddit API ❌

**Reasons**:
1. No social graph access (dealbreaker)
2. Cannot measure friendship intimacy
3. Weak trust signals unrelated to creditworthiness
4. API costs not justified by value
5. Rate limits make comprehensive analysis impractical

### INSTEAD: Focus on These Platforms

**Priority 1: Farcaster** (Already Implemented) ✅
- Built-in Far Scores
- Full social graph
- Web3-native
- Good for crypto lending

**Priority 2: Bluesky** (Recommended Next) ✅
- Free/low cost
- Excellent API access
- Mutual connections endpoint
- Growing user base

**Priority 3: Twitter/X** (Optional) ⚠️
- Via TwitterAPI.io ($2-500/mo)
- Large user base
- Good engagement data
- More expensive but viable

**Priority 4: On-Chain Data** (Complementary) ✅
- Gitcoin Passport
- ENS profiles
- Wallet transaction history
- Proof of Humanity

**Priority 5: Reddit** (Skip) ❌
- Only if needed for basic fraud detection
- Not for trust scoring
- Not worth the investment

---

## Cost-Benefit Analysis

### Reddit (NOT Worth It)

**Monthly Cost**: $72 for 1,000 users
**Value Received**:
- ❌ No social graph
- ❌ No friendship data
- ⚠️ Weak proxy signals (karma, age)
- ❌ Cannot measure trust

**ROI**: **Negative** ❌

### Farcaster (Already Have)

**Monthly Cost**: $49-99 (Neynar API)
**Value Received**:
- ✅ Far Scores (built-in reputation)
- ✅ Full social graph
- ✅ Mutual connections
- ✅ Engagement metrics

**ROI**: **Excellent** ✅

### Bluesky (Recommended)

**Monthly Cost**: $0-10
**Value Received**:
- ✅ Full social graph
- ✅ Mutual connections API
- ✅ Engagement metrics
- ✅ Growing user base

**ROI**: **Outstanding** ✅✅

---

## Technical Implementation (If Proceeding Anyway)

### Setup

```bash
pip install praw
```

### Basic Code Example

```python
import praw

reddit = praw.Reddit(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    user_agent="LendFriend/1.0"
)

def analyze_reddit_user(username):
    user = reddit.redditor(username)

    return {
        "username": username,
        "account_age_days": (time.time() - user.created_utc) / 86400,
        "total_karma": user.link_karma + user.comment_karma,
        "post_karma": user.link_karma,
        "comment_karma": user.comment_karma,
        "is_verified": user.verified,
        "is_mod": user.is_mod
    }
```

### What NOT to Do

```python
# ❌ DON'T: Try to calculate trust scores
reddit_trust_score = karma * 0.5 + account_age * 0.5  # Meaningless!

# ❌ DON'T: Try to find mutual friends
mutuals = find_mutual_friends(user1, user2)  # Impossible!

# ❌ DON'T: Use karma as creditworthiness
if karma > 10000:
    approve_loan()  # No correlation!
```

---

## Alternative: Enhance Existing Farcaster Implementation

Instead of Reddit, improve what you already have:

### 1. Optimize Farcaster Integration
- Implement Far Scores more prominently
- Add OpenRank engagement reputation
- Enhance social proximity scoring
- Cache more aggressively

### 2. Add Bluesky (High ROI)
- Free/low cost
- Similar capabilities to Farcaster
- Expands user reach
- Easy integration

### 3. Strengthen On-Chain Signals
- Gitcoin Passport scoring
- ENS domain age
- Wallet transaction patterns
- DeFi reputation (Aave, Compound credit delegation)

### 4. Add Twitter (Optional)
- Via TwitterAPI.io
- More expensive but viable
- Mainstream user base

**Result**: Comprehensive multi-platform trust scoring WITHOUT Reddit's limitations

---

## Conclusion

### Reddit: ❌ NOT RECOMMENDED

**Key Findings**:
1. No friend/follower graph access (fundamental flaw)
2. Cannot measure friendship intimacy
3. Weak, irrelevant trust signals
4. High cost for low value
5. Better alternatives exist

### Recommended Action

**SKIP Reddit integration entirely.**

Focus development effort on:
1. ✅ Enhance Farcaster (already have)
2. ✅ Add Bluesky (high ROI, low cost)
3. ⚠️ Consider Twitter/X (via third-party)
4. ✅ Strengthen on-chain reputation

### Final Recommendation

**DO NOT SPEND TIME ON REDDIT API**

The development time, API costs, and maintenance are not justified by the minimal (essentially zero) trust-scoring value Reddit data provides.

Your existing Farcaster implementation with Far Scores is **infinitely more valuable** than anything Reddit can offer for social trust assessment.

---

## Quick Reference

**Can Reddit API do X?**

| Feature | Available? | Useful for Trust? |
|---------|-----------|-------------------|
| Get followers | ❌ No | N/A |
| Get following | ❌ No | N/A |
| Mutual connections | ❌ No | N/A |
| Karma scores | ✅ Yes | ❌ No (gameable) |
| Account age | ✅ Yes | ⚠️ Weak signal |
| Comment history | ✅ Yes | ⚠️ Labor intensive |
| Subreddit overlap | ⚠️ Infer only | ❌ No correlation |
| Direct interactions | ⚠️ Manual parse | ❌ Too expensive |

**Summary**: Reddit has data, but not the RIGHT data for trust scoring.

---

**Document prepared for**: LendFriend (far-mca)
**Date**: October 26, 2024
**Recommendation**: Skip Reddit, focus on Bluesky integration
