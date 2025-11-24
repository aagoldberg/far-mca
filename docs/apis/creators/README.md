# Creator Platform APIs

This section covers integrations with creator platforms for revenue verification and credit scoring.

## Overview

LendFriend integrates with major creator platforms to verify income streams and calculate credit scores for influencers, content creators, and digital entrepreneurs. These integrations enable creators to access financing based on their proven earnings across platforms.

## Supported Platforms

### Active Integrations

- **[YouTube Integration](youtube.md)** - AdSense revenue, subscriber counts, and analytics
- **[Twitch Integration](twitch.md)** - Estimated revenue from subscribers, Partner/Affiliate verification
- **[TikTok Shop Integration](tiktokshop.md)** - Verified sales revenue and affiliate commissions

### Coming Soon

- **Patreon** - Recurring patron revenue and subscription data

### Planned Integrations

- TikTok Creator Marketplace - Brand deals and Creator Fund earnings
- Instagram Business - Engagement metrics and sponsored content estimates
- Substack - Newsletter subscriber counts and revenue

## How It Works

1. **OAuth Connection**: Creators authorize LendFriend to access their platform data
2. **Revenue Verification**: We fetch historical earnings data (typically 90 days)
3. **Credit Scoring**: Revenue data feeds into our multi-factor credit algorithm
4. **Ongoing Sync**: Connections can be refreshed to keep credit scores current

## Credit Score Factors

Creator platform data contributes to four scoring components:

- **Revenue Score** (40%): Total verified earnings across platforms
- **Consistency Score** (20%): Regularity and predictability of income
- **Reliability Score** (20%): Platform diversity and account standing
- **Growth Score** (20%): Trajectory of earnings and audience growth

## Security & Privacy

- All OAuth tokens are encrypted at rest
- We never post content or access private data
- Creators can disconnect platforms at any time
- Data is used solely for credit assessment
