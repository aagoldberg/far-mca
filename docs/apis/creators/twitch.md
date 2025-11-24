# Twitch Integration

Connect Twitch Partner and Affiliate accounts to verify channel metrics and estimate monthly revenue for credit scoring.

## Overview

Twitch integration allows monetized streamers (Partners and Affiliates) to prove their audience size and engagement by connecting their Twitch channel through OAuth.

**IMPORTANT:** Twitch does NOT provide direct revenue data via their API. Revenue is **ESTIMATED** based on subscriber counts, tier distribution, and industry-standard revenue splits.

## Critical Limitation: Estimated Revenue

Unlike YouTube which provides actual AdSense earnings, Twitch's API does not expose:
- Subscription revenue amounts
- Bits revenue amounts
- Ad revenue
- Payout data

### What We CAN Access:
- Subscriber counts and tier levels (Tier 1, 2, 3)
- Bits leaderboard rankings (not dollar amounts)
- Follower counts
- Viewer counts and channel statistics
- Partner/Affiliate verification status

### Revenue Estimation Methodology:
```
Estimated Monthly Revenue =
  (Tier 1 subs × $2.50) +
  (Tier 2 subs × $5.00) +
  (Tier 3 subs × $12.50)
```

**Assumptions:**
- 50/50 revenue split (standard for most streamers)
- Partners with better contracts may have 60-70% splits (we use conservative 50%)
- Does NOT include bits, ads, or sponsorships
- Based on subscription data only

## Prerequisites

- Twitch Partner or Affiliate status (monetization enabled)
- Active subscriber base
- Twitch account with channel ownership

## Data Collected

### Subscriber Data
- **Total subscriber count**
- **Tier 1 subscribers** (typically $4.99/month → $2.50 to streamer)
- **Tier 2 subscribers** (typically $9.99/month → $5.00 to streamer)
- **Tier 3 subscribers** (typically $24.99/month → $12.50 to streamer)
- Subscriber points (weighted score for tier value)

### Channel Metrics
- **Follower Count**: Total channel followers
- **Total Views**: Lifetime channel views
- **Broadcaster Type**: "partner", "affiliate", or "" (none)
- **Channel Age**: Days since channel creation
- **Profile Data**: Display name, description, avatar

### Engagement Data (Estimated)
- **Bits Activity**: Leaderboard rankings (not revenue amounts)
- **Stream Consistency**: Requires tracking over time
- **Average Viewers**: Requires tracking during live streams

## Credit Score Impact

Twitch data contributes to all four credit scoring factors, but with lower confidence than YouTube due to estimated revenue:

### Revenue Score (40%)
- Based on ESTIMATED monthly subscription revenue
- Confidence level assigned: low/medium/high
- Factors:
  - Total subscriber count
  - Tier distribution (higher tiers = higher score)
  - Partner vs Affiliate status
  - Channel age

**Revenue Tiers:**
- $0-250/month: Base score
- $250-1,000/month: Mid-range score
- $1,000-5,000/month: High score
- $5,000+/month: Maximum score

### Consistency Score (20%)
- Partner/Affiliate status (verified monetization)
- Channel longevity (older accounts = more consistent)
- Subscriber retention (tracked over time)
- NOTE: Stream schedule consistency requires manual tracking

### Reliability Score (20%)
- Account standing (no suspensions)
- Partner vs Affiliate status
- Follower-to-subscriber ratio
- Channel completeness (profile, panels, etc.)

### Growth Score (20%)
- Follower growth (requires historical tracking)
- Subscriber growth (requires historical tracking)
- View count trajectory
- Engagement rate estimates

## Confidence Levels

Each Twitch connection is assigned a revenue confidence level:

**HIGH Confidence:**
- Partner or Affiliate verified
- 100+ subscribers with good tier distribution
- Channel age > 1 year
- High follower count

**MEDIUM Confidence:**
- Partner or Affiliate verified
- 10-100 subscribers
- Channel age > 3 months

**LOW Confidence:**
- No monetization status
- < 10 subscribers
- New channel (< 3 months)
- Incomplete data

## Technical Implementation

### OAuth Flow

```
User clicks "Connect Twitch"
    ↓
Redirect to Twitch OAuth consent screen
    ↓
User grants permissions (read-only)
    ↓
Callback receives authorization code
    ↓
Exchange code for access token + refresh token
    ↓
Fetch channel data and subscriber counts
    ↓
Calculate estimated monthly revenue
    ↓
Store connection in business_connections table
    ↓
Redirect to dashboard with updated credit score
```

### Required OAuth Scopes

```
channel:read:subscriptions    # Access subscriber counts and tiers
bits:read                     # Access bits leaderboard
moderator:read:followers      # Access follower information
user:read:email              # User identification
```

### API Endpoints Used

**Twitch Helix API** (api.twitch.tv/helix)

- `GET /users` - Get channel information and broadcaster type
- `GET /subscriptions?broadcaster_id={id}` - Get subscriber list and counts
- `GET /channels/followers?broadcaster_id={id}` - Get follower count
- `GET /bits/leaderboard` - Get top bits contributors (optional)

**All requests require:**
- `Authorization: Bearer {access_token}` header
- `Client-Id: {client_id}` header

## Setup Instructions

### 1. Twitch Developer Console Setup

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Register your application:
   - **Name**: LendFriend
   - **OAuth Redirect URLs**: `https://yourdomain.com/api/twitch/callback`
   - **Category**: Website Integration
3. Save your **Client ID** and **Client Secret**

### 2. Environment Variables

Add to `.env.local`:

```bash
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Verify Monetization Status

For testing, ensure your test account is either:
- A Twitch Partner (verified checkmark)
- A Twitch Affiliate (monetization enabled)

Non-monetized accounts will be rejected during connection.

## Implementation Plan

### Phase 1: Twitch OAuth Client Library
**File**: `apps/web-cdp/src/lib/twitch-client/index.ts`

Methods implemented:
- `getAuthUrl(state: string)`: Generate OAuth consent URL
- `exchangeCodeForToken(code: string)`: Exchange auth code for tokens
- `getUserData(accessToken: string)`: Fetch channel statistics
- `getSubscriberData(broadcasterId, accessToken)`: Fetch subscriber counts and tiers
- `getFollowerCount(broadcasterId, accessToken)`: Fetch total followers
- `estimateMonthlyRevenue(subscriberData, broadcasterType)`: Calculate estimated revenue

**Types:**
```typescript
interface TwitchSession {
  access_token: string;
  refresh_token?: string;
  user_id?: string;
  login?: string;
}

interface TwitchRevenueData {
  estimatedRevenue: number; // ESTIMATED monthly revenue
  subscriberCount: number;
  subscriberTier1: number;
  subscriberTier2: number;
  subscriberTier3: number;
  followerCount: number;
  broadcasterType: 'partner' | 'affiliate' | '';
  revenueConfidence: 'low' | 'medium' | 'high';
  periodDays: number;
  currency: string;
}
```

### Phase 2: API Routes

**Auth Endpoint**: `apps/web-cdp/src/app/api/twitch/auth/route.ts`
- Accept `wallet` query parameter
- Generate OAuth URL with Twitch client
- Include state for CSRF protection
- Return `{ authUrl }` JSON

**Callback Endpoint**: `apps/web-cdp/src/app/api/twitch/callback/route.ts`
- Receive authorization code from Twitch
- Exchange for access & refresh tokens
- Fetch channel data and subscriber counts
- Calculate estimated revenue with confidence level
- Verify Partner/Affiliate status (reject if not monetized)
- Store in `business_connections` table:
  ```sql
  {
    wallet_address: string,
    platform: 'twitch',
    platform_user_id: user_id,
    access_token: encrypted_token,
    refresh_token: encrypted_token,
    revenue_data: {
      totalRevenue: estimated_amount,
      isEstimated: true, // CRITICAL FLAG
      revenueConfidence: 'low' | 'medium' | 'high',
      subscriberCount: number,
      subscriberTier1: number,
      subscriberTier2: number,
      subscriberTier3: number,
      followerCount: number,
      broadcasterType: string,
      periodDays: 30,
      currency: 'USD'
    },
    metadata: {
      username: string,
      display_name: string,
      channel_url: string,
      broadcaster_type: string,
      profile_image_url: string
    },
    last_synced_at: ISO_timestamp
  }
  ```
- Redirect to dashboard with `?twitch_connected=true`

### Phase 3: UI Components

**TwitchConnectButton**: `apps/web-cdp/src/components/TwitchConnectButton.tsx`
```typescript
interface TwitchConnectButtonProps {
  onConnectionSuccess?: () => void;
  onConnectionError?: (error: string) => void;
  size?: 'sm' | 'md' | 'lg';
}
```

Features:
- Purple branding (Twitch colors: #9146FF)
- Play icon from Heroicons
- Loading state during OAuth
- Error handling for non-monetized accounts
- Disabled if no wallet connected

**BusinessConnectionManager Update**: Add Twitch to platform list
```typescript
const PLATFORM_CONFIG = {
  // ... existing platforms
  twitch: {
    name: 'Twitch',
    icon: PlayIcon,
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
  },
};
```

### Phase 4: Testing

**Local Testing Checklist**:
- [ ] OAuth flow initiates correctly
- [ ] Twitch consent screen shows correct scopes
- [ ] Authorization code exchange succeeds
- [ ] Channel data fetches successfully
- [ ] Subscriber counts retrieve correctly
- [ ] Revenue estimation calculates properly
- [ ] Confidence level assigns correctly
- [ ] Non-monetized accounts are rejected
- [ ] Data stores in Supabase correctly
- [ ] Credit score recalculates with Twitch data
- [ ] UI shows "Estimated Revenue" label
- [ ] Refresh token workflow works

**Test Data Requirements**:
- Test Twitch account with Partner or Affiliate status
- Active subscriber base (ideally 10+ subs)
- Mix of subscription tiers

## Rate Limits & Quotas

**Twitch Helix API**
- **Rate Limit**: 800 points per minute (token bucket system)
- **Headers**: `Ratelimit-Limit`, `Ratelimit-Remaining`, `Ratelimit-Reset`
- **429 Response**: Rate limit exceeded
- **Best Practice**: Monitor headers and implement exponential backoff

**Endpoint Costs:**
- `GET /users`: 1 point
- `GET /subscriptions`: 1 point per request (paginated)
- `GET /channels/followers`: 1 point

**Recommendations:**
- Cache channel data (update daily)
- Limit subscriber pagination to 1000 subs max (10 pages)
- Implement exponential backoff for rate limit errors

## Error Handling

### Common Errors

**Not Monetized**
- Error: User is not Partner or Affiliate
- Resolution: Display message requiring monetization status
- UI: "Your Twitch channel must be a Partner or Affiliate to connect"

**Insufficient Permissions**
- Error: `Missing scope: channel:read:subscriptions`
- Cause: User denied required scope
- Resolution: Re-initiate OAuth with all scopes

**Invalid Grant**
- Error: `invalid_grant`
- Cause: Authorization code expired or already used
- Resolution: Re-authenticate user

**Rate Limit Exceeded**
- Error: HTTP 429
- Headers: `Ratelimit-Reset` timestamp
- Resolution: Wait until reset time, retry with backoff

**No Subscribers**
- Warning: Channel has 0 subscribers
- Behavior: Accept connection with $0 estimated revenue
- Score: Low confidence, minimal credit impact

## Security Considerations

### Token Storage
- Encrypt access tokens using AES-256
- Store refresh tokens separately
- Implement token rotation (tokens expire after 4 hours)
- Use Supabase Row Level Security (RLS)

### Data Privacy
- Only request minimum required scopes
- Never expose tokens in client-side code
- Log token access for audit trails
- Implement token revocation on disconnect

### API Security
- Validate wallet ownership before OAuth redirect
- Use CSRF tokens (state parameter) in OAuth flow
- Rate limit API endpoints (10 requests/minute per user)
- Sanitize all API responses

## Limitations & Disclaimers

### What This Integration CAN Do:
✅ Verify account ownership via OAuth
✅ Confirm Partner/Affiliate monetization status
✅ Access subscriber counts and tier distribution
✅ Estimate monthly subscription revenue
✅ Track follower count and channel metrics
✅ Provide confidence level for estimates

### What This Integration CANNOT Do:
❌ Access actual revenue/payout data
❌ See bits revenue in dollars
❌ View ad revenue
❌ Access sponsorship or donation income
❌ Guarantee revenue accuracy (estimates only)
❌ Detect revenue split variations (assumes 50%)

### Disclaimer for Users:
"Twitch revenue is ESTIMATED based on your subscriber counts and standard revenue splits (50%). Actual earnings may vary based on your individual contract, bits revenue, ad revenue, and other factors not accessible via Twitch's API. For more accurate credit lines, consider providing additional verification."

## Comparison to YouTube Integration

| Feature | YouTube | Twitch |
|---------|---------|--------|
| **Actual Revenue Data** | ✅ YES (estimatedRevenue metric) | ❌ NO (estimated only) |
| **Subscriber Counts** | ✅ YES | ✅ YES (with tiers) |
| **Monetization Verification** | ✅ Partner status | ✅ Partner/Affiliate status |
| **Revenue Confidence** | HIGH (actual data) | MEDIUM-LOW (estimates) |
| **API Simplicity** | Complex (Google OAuth) | Simple (Twitch OAuth) |
| **Historical Data** | ✅ 90+ days available | ❌ Must track manually |
| **Rate Limits** | 10K quota/day | 800 points/minute |
| **Best For** | Primary income verification | Supplementary verification |

## Recommended Usage

**Twitch integration is best used as:**
1. **Supplementary verification** alongside YouTube or Shopify
2. **Audience size indicator** more than revenue proof
3. **Initial screening** for gaming/streaming creators
4. **Tier indicator** (Partner > Affiliate > None)

**For higher credit lines, recommend:**
- Combining Twitch with YouTube (better revenue data)
- Manual verification via Twitch Dashboard screenshots
- Third-party verification services (e.g., Phyllo)
- Bank statement verification for large amounts

## Future Enhancements

**Planned Features:**
- Historical tracking (store snapshots monthly)
- Stream consistency scoring (track live streams)
- Average viewer count tracking
- Bits leaderboard integration
- Multi-platform score (Twitch + YouTube combined)
- Manual revenue verification flow

**Potential Integrations:**
- Streamlabs/StreamElements for donation data
- Patreon for membership revenue
- Third-party APIs (Phyllo, Streamer.Tools)

## Support Resources

- [Twitch API Documentation](https://dev.twitch.tv/docs/api/)
- [Twitch OAuth Guide](https://dev.twitch.tv/docs/authentication)
- [Twitch Partner Program](https://www.twitch.tv/p/partners/)
- [Twitch Affiliate Program](https://www.twitch.tv/creatorcamp/en/monetization/)

## Appendix: Revenue Split Details

### Standard Revenue Splits:

**Subscriptions:**
- Tier 1 ($4.99): Streamer gets $2.50 (50%)
- Tier 2 ($9.99): Streamer gets $5.00 (50%)
- Tier 3 ($24.99): Streamer gets $12.50 (50%)

**Partner Plus (70% split):**
- Available to select Partners
- Requires maintaining 350+ paid subs
- Our estimates use conservative 50% split

**Bits:**
- Streamers receive 100% of bit value ($0.01 per bit)
- NOT included in our revenue estimates (data unavailable)

**Ads:**
- Revenue varies widely ($3-6 CPM typical)
- Streamers get 30-55% of ad revenue
- NOT included in our estimates (data unavailable)

**Why We Use 50% Split:**
- Most streamers have standard 50/50 contract
- Conservative estimate = better risk assessment
- Prevents over-crediting unverifiable income
