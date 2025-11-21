# 🔐 Social Verification

## Overview

Social verification lets borrowers prove they're connected to lenders. Research shows loans with verified friend connections have 10% better repayment rates (Grameen Bank).

**Current Status:** Not yet implemented. Requires OAuth provider setup (CDP or Privy) and database configuration.

## What Works Today

### Farcaster
✅ **Fully Integrated**
- Check mutual follows via Neynar API
- Display Farcaster profiles on borrower pages
- Social proximity scoring (Adamic-Adar algorithm)

See: [Farcaster Integration](farcaster-integration.md) for details

## What's Been Built

### Database Schema
- `supabase/social_connections.sql` - Table to store verified connections
- Tracks who attested whom on which platform
- Ready to use once you run the SQL

### API Endpoint
- `POST /api/social/verify-friendship` - Verifies connections
- Supports Farcaster and Facebook (limited)
- Stores verification in Supabase

### React Components (Built but Not Integrated)
- `<VerifyFriendshipButton>` - Button to verify a friendship
- `<SocialConnectionBadge>` - Display verified connections
- `useSocialVerification()` - Hook for verification logic

**Note:** These components currently use Privy for OAuth, but the app uses CDP. Need to rewrite for CDP OAuth system before integrating.

## Platform Support Reality

| Platform | Status | Why |
|----------|--------|-----|
| **Farcaster** | ✅ Working | Open API, already integrated |
| **Facebook** | ⚠️ Built but limited | API only shows friends who also use your app |
| **Instagram** | ❌ Not possible | No API for friend connections |
| **Twitter** | ❌ Not possible | API restrictions + ToS prohibits |
| **LinkedIn** | ❌ Not possible | API restrictions + ToS prohibits |

**Reality Check:** After Facebook's 2018 Cambridge Analytica restrictions, most social platforms locked down friend data. Only open protocols (Farcaster, Bluesky) give full access.

## Research Foundation

**Grameen Bank findings:**
- Loans with 20+ friend lenders: 98% repayment
- Loans with 0 friend lenders: 88% repayment
- +10% improvement from social connections

## Implementation To-Do List

### 🔧 Phase 0: Prerequisites (Blocked)

- [ ] **Choose OAuth Provider**
  - Current app uses CDP (Coinbase Developer Platform)
  - Built components use Privy
  - Decision: Rewrite for CDP OAuth OR add Privy to app

- [ ] **Rewrite Components for CDP**
  - Update `useSocialVerification` hook to use CDP instead of Privy
  - Update `VerifyFriendshipButton` to use CDP's `linkAccount` methods
  - Test CDP OAuth flow with Google/Twitter/Discord

### ✅ Phase 1: Database Setup

- [ ] **Add Supabase Anon Key to .env.local**
  - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
  - Copy "anon public" key
  - Add to `.env.local`: `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here`

- [ ] **Run SQL Schema in Supabase**
  - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/editor/sql
  - Click "New Query"
  - Copy/paste contents of `supabase/social_connections.sql`
  - Click "Run"

### ✅ Phase 2: Integration

- [ ] **Add components to loan detail page**
  - Add `<SocialConnectionBadge>` under borrower name
  - Add "Verify Your Connection" section for lenders
  - Test the full flow

### ⏭️ Phase 3: Facebook Verification (Optional)

- [ ] **Create Facebook App**
  - Go to: https://developers.facebook.com/
  - Click "My Apps" → "Create App"
  - Choose "Business" type
  - Add "Facebook Login" product

- [ ] **Get App Access Token**
  - Go to Settings → Basic
  - Copy App ID and App Secret
  - Format: `{app-id}|{app-secret}`

- [ ] **Add to .env.local**
  ```bash
  FACEBOOK_APP_ACCESS_TOKEN=123456789|abc123def456
  ```

- [ ] **Configure OAuth URLs**
  - In Facebook App Settings
  - Add OAuth redirect: `http://localhost:3004/api/auth/callback`
  - Add domain: `localhost`

**Note:** Facebook only shows friends who also use your app (post-2018 API restrictions)

### 📊 Phase 4: Measurement

- [ ] **Track Verification Rates**
  - Monitor how many lenders verify friendships
  - Query: `SELECT COUNT(*) FROM social_connections WHERE platform='farcaster'`

- [ ] **Compare Repayment Rates**
  - Loans with verified friends vs. no verification
  - Hypothesis: +10% better repayment (based on Grameen Bank research)

- [ ] **Identify Top Platforms**
  - Which platforms do users prefer to verify?
  - Query: `SELECT platform, COUNT(*) FROM social_connections GROUP BY platform`

## Future: On-Chain Attestations

Eventually migrate from Supabase to Ethereum Attestation Service (EAS) on Base for:
- Decentralization
- Composability (other apps can read)
- Permanence

But for now, Supabase lets us iterate quickly.

## See Also

- [🤝 Social Trust Scoring](social-trust-scoring/README.md) - Farcaster social graph scoring (live)
- [🎭 Farcaster Integration](farcaster-integration.md) - What's actually working
