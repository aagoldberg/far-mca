# Farcaster Virality

## Platform-Native Features That Make Lending Go Viral

Farcaster isn't just a social network—it's a platform **designed** for interactive apps to spread. LendFriend leverages Frames, Cast Actions, and Composer Actions to turn loan discovery from a chore into a natural part of social browsing.

---

## Why Farcaster's Architecture Enables Virality

Traditional social platforms treat external links as **friction**:
- User clicks link → Leaves the app → Views content → Decides whether to act
- Each step loses 50-70% of users

**Farcaster eliminates this friction** by running apps **inside posts**.

---

## 1. Frames: Apps Inside Casts

### What Are Frames?

Frames turn any Farcaster post (cast) into an **interactive mini-app**. Instead of clicking a link to view a loan, users can:

- See loan details directly in their feed
- View Trust Score and funding progress
- Contribute with one tap
- Share to their network instantly

**All without leaving Farcaster.**

### The Frame Launch Impact

{% hint style="success" %}
**Real-World Viral Growth**

When Farcaster released Frames on **January 26, 2024** [[13]](../../references.md#farcaster-frames-2024):
- Daily active users **jumped from <2,000 → 20,000+** in weeks
- DAU now **>61,500** thanks to Frame-driven adoption
- Eliminated friction of leaving the app
- Made content discovery passive (scrolling feed vs. visiting sites)
{% endhint %}

### How LendFriend Uses Frames

**Loan Request Frame:**

```
┌─────────────────────────────────────────────┐
│  @borrower is requesting a loan             │
│                                             │
│  💰 Amount: $2,500                          │
│  📅 Duration: 3 months                      │
│  🎯 Purpose: Cover bootcamp tuition         │
│  🤝 Trust Score: 78 (🟢 Low Risk)          │
│                                             │
│  ████████████░░░░░░ 65% funded ($1,625)    │
│  👥 12 lenders • ⏰ 18 days left            │
│                                             │
│  [ View Full Details ]  [ Contribute ]      │
└─────────────────────────────────────────────┘
```

**When a user clicks "Contribute":**
1. Modal opens **inside Farcaster**
2. Pre-filled with smart defaults ($50, $100, $250)
3. One-tap wallet confirmation
4. Instant social proof ("You and 5 friends funded this")

**When a user clicks "View Full Details":**
- Expands to show borrower profile
- Displays all lenders + Trust Scores
- Shows repayment plan
- Still inside the Frame (no external navigation)

### Why This Makes Lending Viral

| Traditional Flow | Frame Flow | Improvement |
|------------------|------------|-------------|
| 1. See post → 2. Click link → 3. Load website → 4. Read loan → 5. Create account → 6. Contribute | 1. See Frame → 2. Tap contribute | **5 steps eliminated** |
| Estimated 5-10% conversion | Estimated 20-30% conversion | **Estimated 2-4× higher** |
| Must return to social app to share | One-tap share from Frame | **Instant virality** |

---

## 2. Cast Actions

### What Are Cast Actions?

**Cast Actions** = Right-click menu for any cast

When you see a loan request, right-click the cast to:
- **"Fund this loan"** → Opens contribution modal
- **"View Trust Score"** → Shows your social proximity to borrower
- **"Share with friends"** → Pre-composed cast with Frame embed

### How It Works

```
User scrolling feed
  │
  ▼
Sees friend's loan request
  │
  ▼
Right-clicks cast
  │
  ▼
Selects "Fund this loan"
  │
  ▼
Frame opens with contribution UI
  │
  ▼
One-tap wallet confirmation
  │
  ▼
Cast updates: "You funded this loan! 🎉"
```

**Result:** Funding becomes as easy as liking a post.

### LendFriend Cast Actions

We'll implement custom Cast Actions for:

| Action | What It Does |
|--------|-------------|
| **"Check Trust Score"** | Calculates your social proximity to borrower |
| **"Fund this loan"** | Opens contribution modal with smart defaults |
| **"See who funded"** | Displays lenders you know |
| **"Share with friends"** | Composes cast with your endorsement |
| **"Track repayment"** | Subscribe to repayment notifications |

---

## 3. Composer Actions

### What Are Composer Actions?

**Composer Actions** = Tools built into the Farcaster compose box

Instead of visiting LendFriend's website to create a loan request, borrowers can:
1. Click the compose button
2. Select "Request Loan" from Composer Actions
3. Fill out loan details (amount, duration, purpose)
4. Publish directly to feed as a Frame

### The Loan Request Flow

```
Borrower clicks compose button
  │
  ▼
Selects "LendFriend: Request Loan"
  │
  ▼
Modal opens with loan form:
  • Amount ($100 - $10,000)
  • Duration (1-12 months)
  • Purpose (text + optional image)
  • Repayment plan
  │
  ▼
LendFriend generates Frame
  │
  ▼
Borrower publishes cast
  │
  ▼
Loan request appears in followers' feeds as interactive Frame
```

**Why this matters:** Creating a loan request is as easy as writing a post. No external website, no complex navigation—just click, fill, share.

---

## 4. Social Graph API (Neynar)

### Real-Time Trust Score Calculation

Farcaster's open social graph lets us calculate Trust Scores **instantly**:

```typescript
// Pseudocode for Frame interaction
user_clicks_contribute(loan_frame) {
  lender_fid = get_user_farcaster_id()
  borrower_fid = loan_frame.borrower_id

  trust_score = calculate_adamic_adar(lender_fid, borrower_fid)
  mutual_friends = get_mutual_connections(lender_fid, borrower_fid)

  display_contribution_modal({
    trust_score: trust_score,
    mutual_friends: mutual_friends,
    suggested_amount: smart_default(trust_score)
  })
}
```

**Result:** Lenders see their Trust Score **before** contributing, creating confidence in unfamiliar borrowers.

### Quality Filtering

Neynar provides **quality scores** for Farcaster accounts:
- Filters out spam/bot accounts
- Weights high-engagement users higher
- Removes fake/purchased followers from Trust Score calculations

This means Trust Scores reflect **real relationships**, not inflated follower counts.

→ [Learn more about Trust Score implementation](../social-trust-scoring/implementation.md)

---

## Case Study: Degen's Viral Moment

### How a Memecoin Used Farcaster Features to Explode

In early 2024, **Degen** ($DEGEN) created Farcaster's first viral moment:

**The Mechanism:**
1. Users received daily $DEGEN token allocations
2. Could only use tokens to **tip other users** (not sell)
3. Tipping happened via cast comments: `/degen 100 @username`
4. Recipients felt gratitude → Tipped others → Network effect

**The Result:**
- Triggered Farcaster's first viral wave
- Onboarded thousands of new users
- Proved that **tip-to-share mechanics** drive engagement

### LendFriend's Parallel

**Degen's model:**
- Receive tokens → Tip friends → Spread virally

**LendFriend's model:**
- Receive loan → Repay with tip → Lenders feel rewarded → Fund more loans

Both leverage **reciprocity** and **social reward mechanisms** built into Farcaster.

→ [Learn about tipping on repayment](../risk-and-defaults.md)

---

## The In-Feed Discovery Advantage

### Passive vs. Active Discovery

**Traditional P2P lending:**
- Users visit website → Browse loans → Filter by criteria → Click loan → Read details
- **Active effort required**

**Farcaster Frames:**
- Users scroll social feed → See loan Frames from network → Read inline → Contribute
- **Passive discovery, active contribution**

### Why This Matters for Growth

| Metric | Traditional Platform | Farcaster Frames |
|--------|---------------------|------------------|
| **Discovery friction** | High (must visit site) | Low (appears in feed) |
| **Conversion rate** | Estimated 5-10% | Estimated 20-30% |
| **Sharing rate** | Estimated <5% | Estimated 15-25% |
| **Time to contribution** | Estimated 3-5 minutes | Estimated 10-30 seconds |

**Result:** Loans spread faster, fund quicker, and reach more potential lenders.

---

## The Viral Loop

### How Frames Create Compounding Growth

```
1. Borrower creates loan request (Composer Action)
      │
      ▼
2. Posts as Frame to Farcaster feed
      │
      ▼
3. Close friends see Frame → Contribute (Cast Action)
      │
      ▼
4. Contribution activity appears in friends' feeds
      │
      ▼
5. Extended network discovers loan → Contributes
      │
      ▼
6. Lenders share success stories (new Frames)
      │
      ▼
7. Non-lenders discover LendFriend → Create loans
      │
      ▼
   [Loop repeats with new borrowers]
```

**Estimated K-Factor:** Each loan request could introduce **approximately 3-5 new users** to the platform.

When K > 1, growth becomes exponential.

→ [Learn more about platform scaling](platform-scaling.md)

---

## Comparison to Other Platforms

### Why Twitter/X Can't Replicate This

| Feature | Farcaster | Twitter/X | Why Farcaster Wins |
|---------|-----------|-----------|-------------------|
| **Interactive embeds** | ✅ Frames | ❌ Static cards | Can't transact in-feed |
| **Custom actions** | ✅ Cast Actions | ❌ Limited | No right-click menus |
| **Compose tools** | ✅ Composer Actions | ❌ Text only | No form builders |
| **Social graph API** | ✅ Open | ❌ Restricted | Can't calculate Trust Scores |
| **Wallet integration** | ✅ Native | ❌ Not built-in | Must leave to transact |

**Result:** Farcaster is **architecturally designed** for financial social apps. Twitter is not.

---

## Future Enhancements

### Planned Features (Phase 2-3)

**Advanced Frames:**
- Multi-step contribution flows (pledge → confirm → receipt)
- Loan repayment tracking (progress bars update live)
- Lender leaderboards (gamification)

**Notification System:**
- Push notifications when friends create loans
- Alerts when loans reach 70% funded (FOMO)
- Repayment confirmations (builds trust)

**Social Incentives:**
- "First 5 lenders get 2× rewards"
- Lending streaks (badges for consistency)
- Team competitions (who funds most loans)

→ [See full roadmap in Vision](../../vision.md)

---

## Key Takeaways

{% hint style="success" %}
**Why Farcaster Enables Viral Lending**

1. **Frames eliminate friction** - Contribute without leaving the app
2. **Cast Actions = one-tap funding** - Easier than liking a post
3. **Composer Actions = instant loan creation** - No website needed
4. **Open social graph** - Calculate Trust Scores in real-time
5. **Proven viral mechanics** - Degen case study shows it works
6. **In-feed discovery** - Passive browsing → Active contributions

**Farcaster's architecture is uniquely suited for social lending. No other platform offers this combination of features.**
{% endhint %}

---

## Related Pages

- [Viral Funding Mechanics](viral-funding-mechanics.md) - How individual loans spread
- [Cross-Platform Growth](cross-platform-growth.md) - Reaching beyond Farcaster
- [Platform Scaling](platform-scaling.md) - Network effects and growth metrics
- [Social Trust Scoring](../social-trust-scoring/README.md) - How we calculate Trust Scores
- [Vision & Roadmap](../../vision.md) - Long-term platform expansion
