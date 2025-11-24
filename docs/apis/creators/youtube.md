# YouTube Integration

Connect YouTube Partner Program accounts to verify AdSense revenue and channel performance for credit scoring.

## Overview

YouTube integration allows monetized creators to prove their income by connecting their YouTube channel through Google OAuth. We fetch AdSense earnings, subscriber counts, total views, and engagement metrics to assess creditworthiness.

## Prerequisites

- YouTube Partner Program membership (monetization enabled)
- Linked AdSense account with active earnings
- Google account with channel ownership

## Data Collected

### Revenue Data
- **AdSense Earnings**: Total estimated revenue over 90 days
- **Revenue Per Mille (RPM)**: Average earnings per 1000 views
- **Monetized Playbacks**: Views that generated ad revenue
- **Currency**: Primary payout currency (USD, EUR, etc.)

### Channel Metrics
- **Subscriber Count**: Total channel subscribers
- **Total Views**: Lifetime channel views
- **Video Count**: Total uploaded videos
- **Average Views**: Recent video performance (30 days)

### Engagement Data
- **Watch Time**: Total hours watched (90 days)
- **Engagement Rate**: Likes, comments, shares per view
- **Upload Consistency**: Videos published per month
- **Audience Retention**: Average view duration percentage

## Credit Score Impact

YouTube data contributes to all four credit scoring factors:

### Revenue Score (40%)
- Higher AdSense earnings → higher score
- Threshold tiers:
  - $0-500/month: Base score
  - $500-2,000/month: Mid-range score
  - $2,000-10,000/month: High score
  - $10,000+/month: Maximum score

### Consistency Score (20%)
- Regular upload schedule → higher score
- Stable monthly earnings → higher score
- Low revenue volatility → higher score

### Reliability Score (20%)
- Channel age and standing
- Monetization status (active vs. suspended)
- Copyright strikes and community guidelines status
- Multiple revenue streams (members, Super Chat, etc.)

### Growth Score (20%)
- Subscriber growth rate (30/60/90 day trends)
- View count trajectory
- Engagement rate improvements
- Revenue growth percentage

## Technical Implementation

### OAuth Flow

```
User clicks "Connect YouTube"
    ↓
Redirect to Google OAuth consent screen
    ↓
User grants permissions (read-only)
    ↓
Callback receives authorization code
    ↓
Exchange code for access token + refresh token
    ↓
Fetch YouTube Analytics & AdSense data
    ↓
Store connection in business_connections table
    ↓
Redirect to dashboard with updated credit score
```

### Required OAuth Scopes

```
https://www.googleapis.com/auth/youtube.readonly
https://www.googleapis.com/auth/yt-analytics.readonly
https://www.googleapis.com/auth/adsense.readonly
```

### API Endpoints Used

**YouTube Data API v3**
- `channels.list`: Get channel statistics
- `videos.list`: Fetch recent videos

**YouTube Analytics API**
- `reports.query`: Get views, watch time, revenue data

**AdSense Host API**
- `reports.generate`: Fetch earnings by date range

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable APIs:
   - YouTube Data API v3
   - YouTube Analytics API
   - AdSense Host API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://yourdomain.com/api/youtube/callback`

### 2. Environment Variables

Add to `.env.local`:

```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. OAuth Consent Screen

Configure consent screen with:
- App name: LendFriend
- User support email
- Developer contact email
- Scopes: youtube.readonly, yt-analytics.readonly, adsense.readonly
- Add test users (for testing before verification)

### 4. Submit for Verification

For production, submit OAuth app for Google verification:
- Provide privacy policy
- Explain data usage
- Add YouTube branding guidelines
- Complete security assessment

## Implementation Plan

### Phase 1: YouTube OAuth Client Library
**File**: `apps/web-cdp/src/lib/youtube-client/index.ts`

Create TypeScript client with methods:
- `getAuthUrl(state: string)`: Generate OAuth consent URL
- `exchangeCodeForToken(code: string)`: Exchange auth code for tokens
- `getChannelData(session: YouTubeSession)`: Fetch channel statistics
- `getAnalyticsData(session: YouTubeSession, days: number)`: Fetch revenue & views
- `getAdSenseData(session: YouTubeSession, days: number)`: Fetch earnings data

**Types**:
```typescript
interface YouTubeSession {
  access_token: string;
  refresh_token: string;
  channel_id: string;
  channel_name: string;
  expires_at: number;
}

interface YouTubeRevenueData {
  totalRevenue: number;
  estimatedMinutesWatched: number;
  views: number;
  subscriberCount: number;
  videoCount: number;
  averageViewDuration: number;
  rpm: number; // Revenue per 1000 views
  periodDays: number;
  currency: string;
  uploadConsistency: number; // Videos per month
  growthRate: number; // Subscriber growth percentage
}
```

### Phase 2: API Routes

**Auth Endpoint**: `apps/web-cdp/src/app/api/youtube/auth/route.ts`
- Accept `wallet` query parameter
- Generate OAuth URL with Google client
- Include state for CSRF protection
- Return `{ authUrl }` JSON

**Callback Endpoint**: `apps/web-cdp/src/app/api/youtube/callback/route.ts`
- Receive authorization code from Google
- Exchange for access & refresh tokens
- Fetch channel data and 90-day analytics
- Calculate revenue metrics (RPM, consistency, growth)
- Store in `business_connections` table:
  ```sql
  {
    wallet_address: string,
    platform: 'youtube',
    platform_user_id: channel_id,
    access_token: encrypted_token,
    refresh_token: encrypted_token,
    revenue_data: {
      totalRevenue: number,
      subscriberCount: number,
      totalViews: number,
      averageViews: number,
      estimatedMinutesWatched: number,
      rpm: number,
      videoCount: number,
      periodDays: 90,
      currency: string,
      uploadConsistency: number,
      growthRate: number
    },
    metadata: {
      channel_name: string,
      channel_url: string,
      monetization_enabled: boolean
    },
    last_synced_at: ISO_timestamp
  }
  ```
- Redirect to dashboard with `?youtube_connected=true`

### Phase 3: UI Components

**YouTubeConnectButton**: `apps/web-cdp/src/components/YouTubeConnectButton.tsx`
```typescript
interface YouTubeConnectButtonProps {
  onConnectionSuccess?: () => void;
  onConnectionError?: (error: string) => void;
  size?: 'sm' | 'md' | 'lg';
}
```

Features:
- Red branding (YouTube colors)
- YouTube icon from Heroicons
- Loading state during OAuth
- Error handling for API failures
- Disabled if no wallet connected

**BusinessConnectionManager Update**: Add YouTube to platform list
```typescript
const PLATFORM_CONFIG = {
  // ... existing platforms
  youtube: {
    name: 'YouTube',
    icon: VideoCameraIcon,
    color: 'bg-red-600',
    hoverColor: 'hover:bg-red-700',
  },
};
```

### Phase 4: Testing

**Local Testing Checklist**:
- [ ] OAuth flow initiates correctly
- [ ] Google consent screen shows correct scopes
- [ ] Authorization code exchange succeeds
- [ ] Channel data fetches successfully
- [ ] AdSense revenue data accessible
- [ ] Data stores in Supabase correctly
- [ ] Credit score recalculates with YouTube data
- [ ] UI updates with connection status
- [ ] Error states handle gracefully
- [ ] Refresh token workflow works

**Test Data Requirements**:
- Test YouTube channel with monetization
- Active AdSense account with earnings
- 90+ days of revenue history

## Rate Limits & Quotas

**YouTube Data API v3**
- 10,000 quota units/day (default)
- channels.list: 1 unit
- videos.list: 1 unit

**YouTube Analytics API**
- 50,000 queries/day
- Each report query: 1 request

**AdSense API**
- 10 requests/second
- 10,000 requests/day

**Best Practices**:
- Cache channel data (update daily)
- Batch video requests
- Use refresh tokens for long-term access
- Implement exponential backoff for rate limit errors

## Error Handling

### Common Errors

**Insufficient Permissions**
- Error: `insufficientPermissions`
- Cause: User denied one or more scopes
- Resolution: Re-initiate OAuth with all required scopes

**Monetization Not Enabled**
- Error: `monetizationDisabled`
- Cause: Channel not in YouTube Partner Program
- Resolution: Display message to enable monetization first

**AdSense Not Linked**
- Error: `adsenseNotLinked`
- Cause: No AdSense account connected to channel
- Resolution: Guide user to link AdSense in YouTube Studio

**Quota Exceeded**
- Error: `quotaExceeded`
- Cause: Daily API quota exhausted
- Resolution: Retry after 24 hours, upgrade quota if persistent

**Invalid Grant**
- Error: `invalid_grant`
- Cause: Refresh token expired or revoked
- Resolution: Re-authenticate user, refresh connection

## Security Considerations

### Token Storage
- Encrypt access tokens using AES-256
- Store refresh tokens separately with additional encryption layer
- Implement token rotation policy (refresh before expiry)
- Use Supabase Row Level Security (RLS) for access control

### Data Privacy
- Only request minimum required scopes
- Never expose raw tokens in client-side code
- Log token access for audit trails
- Implement token revocation on user request

### API Security
- Validate wallet ownership before OAuth redirect
- Use CSRF tokens (state parameter) in OAuth flow
- Rate limit API endpoints (10 requests/minute per user)
- Sanitize all API responses before storing

## Maintenance

### Regular Tasks
- Monitor API quota usage
- Check for deprecated API endpoints
- Update OAuth scopes if new data needed
- Refresh long-lived connections (90 days)

### Monitoring Alerts
- OAuth failure rate > 5%
- API error rate > 2%
- Token refresh failures
- Quota warnings (>80% usage)

## Support Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [YouTube Analytics API Guide](https://developers.google.com/youtube/analytics)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [AdSense Management API](https://developers.google.com/adsense/management/)

## Roadmap

**Future Enhancements**:
- YouTube Memberships revenue tracking
- Super Chat/Super Stickers earnings
- Merchandise shelf integration
- YouTube Premium revenue share
- Multi-channel support (for networks)
- Historical trend analysis (12+ months)
