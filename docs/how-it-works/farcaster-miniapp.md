# Farcaster Mini App

LendFriend runs natively inside Farcaster, letting you create and fund loans without leaving your feed.

---

## What It Is

A mini app that runs inside Farcaster clients. No separate signup, no context switching - everything happens where you already spend time.

**Key features:**
- Create loans directly in Farcaster
- Fund loans with one tap
- Automatic identity verification (uses your Farcaster profile)
- Trust scores based on your Farcaster network
- Share loans as casts with embedded preview

---

## For Borrowers

**Creating a loan:**

1. Open LendFriend mini app in Farcaster
2. Your Farcaster identity is automatically verified
3. Fill out loan details (amount, duration, description)
4. Add images or budget breakdown (optional)
5. Create loan - it's deployed on-chain
6. Share as cast to your network

**Example cast:**
```
🚀 Raising $2,500 for a laptop for coding bootcamp

Help me out by contributing to my loan on @lendfriend

[Card shows: $2,500 goal, 0% funded, 30 days]
[Button: Contribute]
```

Your loan appears in your followers' feeds with an embedded card showing progress, trust scores, and a contribute button.

---

## For Lenders

**Funding a loan:**

1. See loan in your Farcaster feed
2. Click embedded card to view details
3. See trust score based on mutual connections
   - 🟢 High Trust: 8+ mutual connections
   - 🟡 Medium Trust: 2-8 mutual connections
   - 🔴 Low Trust: <2 mutual connections
4. Enter contribution amount
5. Approve transaction
6. Done

---

## Why Farcaster?

**Built-in trust:** Your social graph is already on Farcaster. We use your real connections to calculate trust scores - no need to rebuild your network.

**Seamless sharing:** Loans spread through your feed naturally. When friends contribute, their followers see it too.

**Verified identity:** Your Farcaster profile proves you're real. No KYC, no separate identity verification.

**Native experience:** Everything happens in-app. No clicking out to external sites.

---

## How Trust Scores Work

Trust scores are calculated in real-time based on:
- Mutual followers between you and the borrower
- Quality of those connections (active users weighted higher)
- Network overlap

The mini app shows your personalized trust score for each loan, so you can make informed decisions.

→ [Learn more about trust scoring](social-trust-scoring/README.md)

---

## Limitations

**Current constraints:**
- Mobile-only (no desktop Farcaster mini apps yet)
- Optimized for Farcaster mobile clients
- Requires Farcaster account

**For desktop users:** Visit [lendfriend.org](https://lendfriend.org) for full web experience.

---

**Next:** [Social Trust Scoring](social-trust-scoring/README.md) · [Payment Methods](payment-methods.md) · [Virality & Growth](virality-and-growth/README.md)
