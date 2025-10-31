# Farcaster Virality

## Platform-Native Features That Make Lending Go Viral

Farcaster's architecture enables interactive apps to run inside posts, eliminating friction that kills conversion on traditional platforms.

---

## Why Farcaster's Architecture Enables Virality

Traditional social platforms: See post → Click link → Leave app → View content → Decide → Act
- Each step loses 50-70% of users

**Farcaster:** See post → Tap button → Act
- Everything happens in-feed

---

## Frames: Interactive Apps Inside Posts

### Impact

When Frames launched January 26, 2024 [[13]](../../references.md#farcaster-frames-2024):
- DAU jumped from <2,000 → 20,000+ in weeks
- Now >61,500 DAU

### How Loan Frames Work

Users can see loan details, Trust Score, funding progress, and contribute—all without leaving Farcaster.

**Conversion improvement:**

| Traditional Flow | Frame Flow | Improvement |
|------------------|------------|-------------|
| 5 steps, estimated 5-10% conversion | 2 taps, estimated 20-30% conversion | **Estimated 2-4× higher** |

---

## Cast Actions

Right-click any loan cast to:
- **"Fund this loan"** → Opens contribution modal
- **"Check Trust Score"** → Shows your social proximity to borrower
- **"See who funded"** → Displays lenders you know
- **"Share with friends"** → Pre-composed cast with Frame

Funding becomes as easy as liking a post.

---

## Composer Actions

Borrowers create loan requests directly from Farcaster's compose box:
1. Click compose
2. Select "LendFriend: Request Loan"
3. Fill form (amount, duration, purpose)
4. Publish as Frame

No external website needed.

---

## Social Graph API (Neynar)

Calculate Trust Scores instantly when users interact with Frames:

```typescript
user_clicks_contribute(loan_frame) {
  trust_score = calculate_adamic_adar(lender_fid, borrower_fid)
  mutual_friends = get_mutual_connections(lender_fid, borrower_fid)

  display_contribution_modal({
    trust_score,
    mutual_friends,
    suggested_amount: smart_default(trust_score)
  })
}
```

Neynar's quality scores filter bots and fake accounts, ensuring Trust Scores reflect real relationships.

---

## The Viral Loop

1. Borrower creates loan via Composer Action
2. Posts as Frame to feed
3. Close friends see Frame → Contribute via Cast Action
4. Contribution activity appears in friends' feeds
5. Extended network discovers loan → Contributes
6. Lenders share success stories
7. New users discover platform

**Estimated K-Factor:** Each loan request introduces approximately 3-5 new users.

→ [Learn more about K-factors](platform-scaling.md)

---

## Why Twitter/X Can't Replicate This

| Feature | Farcaster | Twitter/X |
|---------|-----------|-----------|
| **Interactive embeds** | ✅ Frames | ❌ Static cards |
| **Custom actions** | ✅ Cast Actions | ❌ Limited |
| **Compose tools** | ✅ Composer Actions | ❌ Text only |
| **Social graph API** | ✅ Open | ❌ Restricted |
| **Wallet integration** | ✅ Native | ❌ Not built-in |

Farcaster is architecturally designed for financial social apps.

---

## Key Takeaways

**Why Farcaster Enables Viral Lending:**

1. **Frames eliminate friction** - Contribute without leaving the app
2. **Cast Actions = one-tap funding** - Easier than liking a post
3. **Composer Actions = instant loan creation** - No website needed
4. **Open social graph** - Calculate Trust Scores in real-time
5. **In-feed discovery** - Passive browsing → Active contributions

---

## Related Pages

- [Viral Funding Mechanics](viral-funding-mechanics.md) - How individual loans spread
- [Cross-Platform Growth](cross-platform-growth.md) - Reaching beyond Farcaster
- [Platform Scaling](platform-scaling.md) - Network effects and growth metrics
