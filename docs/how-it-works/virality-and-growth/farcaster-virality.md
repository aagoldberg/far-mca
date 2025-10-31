# Farcaster Virality

Farcaster's architecture enables apps to run inside posts, eliminating the friction that kills conversion on traditional platforms.

---

## Why Farcaster Architecture Enables Virality

**Traditional platforms:** See post → Click link → Leave app → View content → Act
- Each step loses 50-70% of users

**Farcaster:** See post → Tap → Act
- Everything happens in-feed

---

## Mini Apps (formerly Frames v2)

**What they are:** Full web applications that run inside Farcaster posts via iframe.

**When launched (January 2024):** DAU jumped from <2,000 → 20,000+ in weeks [[13]](../../references.md#farcaster-frames-2024). Now >61,500 DAU.

**Key capabilities:**
- **Context-aware** - Access user identity, cast origins, wallet data
- **Persistent** - Users can save apps and return to progress
- **Direct wallet integration** - No manual wallet connecting
- **Notifications** - Users can enable push notifications

**For LendFriend:**
Users see loan details, Trust Score, funding progress, and contribute—all without leaving Farcaster.

**Conversion improvement:** Estimated 2-4× higher than traditional flows.

---

## Cast Actions

Right-click any loan cast to access actions:
- "Fund this loan" → Opens contribution modal
- "Check Trust Score" → Shows social proximity to borrower
- "See who funded" → Displays mutual friend lenders

Funding becomes as easy as liking a post.

---

## Composer Actions

Borrowers create loan requests directly from Farcaster's compose box:
1. Click compose
2. Select "LendFriend: Request Loan"
3. Fill form
4. Publish as mini app

No external website needed.

---

## Social Graph API (Neynar)

Calculate Trust Scores instantly when users interact:

```typescript
user_clicks_contribute(loan) {
  trust_score = calculate_adamic_adar(lender_fid, borrower_fid)
  mutual_friends = get_mutual_connections(lender_fid, borrower_fid)

  display_modal({
    trust_score,
    mutual_friends,
    suggested_amount: smart_default(trust_score)
  })
}
```

Neynar filters bots and fake accounts, ensuring Trust Scores reflect real relationships.

---

## The Viral Loop

Borrower creates loan → Posts as mini app → Friends contribute → Activity appears in feeds → Extended network discovers → Lenders share success → New users join

**Estimated K-Factor:** Each loan introduces ~3-5 new users.

---

## Why Twitter/X Can't Replicate This

| Feature | Farcaster | Twitter/X |
|---------|-----------|-----------|
| **In-feed apps** | ✅ Mini apps | ❌ Static cards |
| **Custom actions** | ✅ Cast Actions | ❌ Limited |
| **Compose tools** | ✅ Composer Actions | ❌ Text only |
| **Social graph API** | ✅ Open | ❌ Restricted |
| **Wallet integration** | ✅ Native | ❌ Not built-in |

---

## Key Takeaways

1. **Mini apps eliminate friction** - Full web apps inside posts
2. **Cast Actions = one-tap funding** - Easier than liking
3. **Composer Actions = instant creation** - No website needed
4. **Open social graph** - Real-time Trust Scores
5. **In-feed discovery** - Passive browsing → Active contributions

---

## Related Pages

- [Viral Funding Mechanics](viral-funding-mechanics.md)
- [Cross-Platform Growth](cross-platform-growth.md)
- [Platform Scaling](platform-scaling.md)
