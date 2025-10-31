# Cross-Platform Growth

## Reaching Beyond Farcaster to Onboard the World

Farcaster has 61K+ DAU [[13]](../../references.md#farcaster-frames-2024). The world has 5.3 billion internet users. Cross-platform sharing enables mainstream adoption.

---

## The Challenge: Crypto Onboarding is Broken

**Web3 adoption barriers** [[14]](../../references.md#web3-adoption-2024):
- 42% of respondents own or have owned cryptocurrency
- 40% abandon wallet setup due to complexity
- $930M lost to key management issues in 2024
- Seed phrases and private keys confuse users

**Solution:** Social login (Google, Twitter, email) with custodial wallets for new users.

---

## Shareable Web Pages

Every loan gets a public webpage: `lendfriend.org/loan/[loan-id]`

**Anyone can view without:**
- Creating account
- Installing wallet
- Connecting to Web3

**To contribute:**
- Social login (Google/Twitter/email)
- Wallet created automatically in background
- Pay via credit card (Stripe → USDC) or crypto
- User never sees blockchain complexity

---

## Conversion Optimization

Research shows 12% average conversion, 15-25% for optimized pages [[12]](../../references.md#gofundme-conversion-2024).

### Mobile-First

**62% of web traffic is mobile** [[12]](../../references.md#gofundme-conversion-2024)
- Mobile users: 25% higher conversion on optimized pages
- Single-column layout, large fonts (16px min)
- Sticky "Contribute" button

### Form Field Reduction

**Reducing form fields from 11 → 4 = 120% increase in conversions** [[12]](../../references.md#gofundme-conversion-2024)

**Our 4-field form:**
1. Amount (preset buttons: $25, $50, $100, Custom)
2. Email
3. Payment method (Credit card / Crypto wallet)
4. Submit

We don't ask: name (from OAuth), address (not needed), phone, account creation.

### Intelligent Ask Amounts

**Intelligent Ask Amounts = 4-7% more donations** [[12]](../../references.md#gofundme-conversion-2024)

Calculation based on:
- Remaining amount needed
- User's Trust Score to borrower
- Number of existing lenders

### Remove Distractions

**Distractions kill conversions** [[12]](../../references.md#gofundme-conversion-2024)

Loan pages have:
- No navigation header (only logo + back)
- No sidebar or footer
- No external links
- Single focus: contribute

---

## Cross-Platform Sharing Flow

1. Borrower creates loan on Farcaster
2. LendFriend generates public webpage
3. Borrower shares to: Twitter, Telegram, WhatsApp, Discord, Email
4. Non-crypto friends click link
5. See mobile-optimized loan page
6. Contribute via social login
7. New lenders onboarded and discover other loans
8. Some new lenders become borrowers (K-factor > 1)

**Pre-written share text provided** for each platform.

---

## Progressive Onboarding

**Step 1:** Contribute first (via social login + credit card)
- User successfully lends without understanding wallets, keys, blockchain, gas, or crypto

**Step 2:** Post-contribution education
- "What happens next" summary
- Optional "Learn More" for technical details (wallet, blockchain, export keys)

Most users never need technical details. They lend, get repaid, and lend again.

---

## Platform-Specific Strategies

### Twitter/X
- Rich Open Graph preview cards
- Clear CTA in share text
- Tag friends in replies (not original post)

### Telegram / WhatsApp
- Rich embeds with inline images
- Personal message (not automated)
- Share in group chats, not broadcast channels

### Discord
- Embed with role mentions
- Post in relevant channels
- Engage with replies

### Email
- HTML template with big "View Loan" button
- Personal message, not marketing copy
- BCC recipients (protect privacy)

---

## Measuring Success

| Metric | Target |
|--------|--------|
| **Non-Farcaster traffic** | 50%+ of total |
| **Social login conversion** | 15-25% |
| **Mobile vs. desktop** | 60/40 split |
| **Avg. time to contribute** | <60 seconds |
| **Repeat lenders** | 30%+ |

UTM parameters track: which platform drives traffic, which message variant converts best, which borrowers spread effectively.

---

## Key Takeaways

**Cross-Platform Growth Principles:**

1. **Remove wallet friction** - Social login > seed phrases
2. **Mobile-first** - 62% of traffic, 25% higher conversion
3. **Reduce form fields** - 4 fields = 120% higher conversion
4. **Intelligent defaults** - Smart ask amounts = 4-7% boost
5. **Remove distractions** - Single-focus pages convert better
6. **Progressive disclosure** - Contribute first, learn crypto later

**Result:** Non-crypto users can lend in <60 seconds without understanding blockchain.

---

## Related Pages

- [Viral Funding Mechanics](viral-funding-mechanics.md) - How individual loans spread
- [Farcaster Virality](farcaster-virality.md) - Platform-native viral features
- [Platform Scaling](platform-scaling.md) - Network effects and growth metrics
