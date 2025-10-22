# Neynar Integration - User Profiles & Reputation

## Overview

We've integrated Neynar SDK to display Farcaster user profiles and reputation scores for loan borrowers. This adds social credibility and trust signals to the lending platform.

## Features Implemented

### 1. User Profile Display
- Profile pictures (pfp)
- Display names and usernames
- Bio text
- Follower/following counts

### 2. Reputation System
- **Power Badge**: Official Farcaster verification badge
- **Trust Score**: 0-100 algorithmic score based on multiple factors
- **Follower Tier**: Categorizes users by social influence
  - 🐋 Whale (10,000+ followers)
  - ⭐ Influential (1,000+ followers)
  - ✨ Active (100+ followers)
  - 🌱 Growing (10+ followers)
  - 🆕 New (<10 followers)
- **Account Age Category**: Indicates experience on Farcaster
  - 👑 Veteran (2+ years)
  - ⚡ Established (1+ year)
  - 🔰 Growing (3+ months)
  - 🎯 New (<3 months)

### 3. Trust Score Algorithm

The trust score (0-100) is calculated using:

```
- Power Badge: 40 points (verified by Farcaster)
- Follower Count: up to 30 points (scaled by 1000)
- Account Age: up to 20 points (scaled by years)
- Engagement Ratio: up to 10 points (healthy following/follower ratio)
```

## Files Created/Modified

### New Files:
- `/src/lib/neynar.ts` - Neynar API client configuration
- `/src/hooks/useFarcasterProfile.ts` - React hook for fetching profiles and calculating reputation

### Modified Files:
- `/src/components/LoanCard.tsx` - Added borrower profile display with badges
- `/src/components/LoanList.tsx` - Passes borrower address to cards
- `/src/components/LoanDetails.tsx` - Enhanced borrower section with full profile and reputation
- `.env.local` - Added `NEXT_PUBLIC_NEYNAR_API_KEY` configuration

## Setup Instructions

### 1. Get Neynar API Key

1. Visit https://neynar.com
2. Sign up for a free account
3. Navigate to your dashboard and create an API key
4. Copy the API key

### 2. Configure Environment

Add your Neynar API key to `.env.local`:

```bash
NEXT_PUBLIC_NEYNAR_API_KEY=your_actual_api_key_here
```

### 3. Restart Development Server

```bash
npm run dev
```

The integration will automatically:
- Fetch profiles for borrowers when loans are displayed
- Calculate reputation scores
- Show badges and social proof

## Usage

### In Components

```tsx
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';

function MyComponent({ borrowerAddress }) {
  const { profile, reputation, hasProfile, isLoading } = useFarcasterProfile(borrowerAddress);

  if (!hasProfile) {
    return <div>No Farcaster profile found</div>;
  }

  return (
    <div>
      <img src={profile.pfpUrl} alt={profile.displayName} />
      <h3>@{profile.username}</h3>
      {profile.powerBadge && <PowerBadgeIcon />}
      <p>Trust Score: {reputation.overall}/100</p>
      <p>Tier: {reputation.followerTier}</p>
    </div>
  );
}
```

## Profile Data Structure

```typescript
interface FarcasterProfile {
  fid: number;                    // Farcaster ID
  username: string;               // @username
  displayName: string;            // Display name
  pfpUrl: string;                 // Profile picture URL
  bio: string;                    // Bio text
  followerCount: number;          // Number of followers
  followingCount: number;         // Number following
  verifications: string[];        // Verified addresses
  powerBadge: boolean;            // Has Power Badge
  accountAgeInDays: number;       // Account age
  activeStatus: string;           // Activity level
}

interface ReputationScore {
  overall: number;                // 0-100 trust score
  powerBadge: boolean;            // Verified status
  followerTier: string;           // Social tier
  accountAge: string;             // Age category
  socialRank: number;             // 0-100 social ranking
}
```

## Benefits

1. **Social Proof**: Users can see real Farcaster profiles of borrowers
2. **Trust Signals**: Power badges and reputation scores provide credibility
3. **Risk Assessment**: Lenders can evaluate borrower history and social standing
4. **Community Building**: Connects the lending platform to the Farcaster social graph
5. **Transparency**: Shows verified identities and social connections

## Future Enhancements

Potential additions to the reputation system:

1. **Channel Memberships**: Show which Farcaster channels the user is active in
2. **Mutual Connections**: Display shared followers/connections with the viewer
3. **Cast Analysis**: Analyze content quality and engagement
4. **Lending History**: Track on-chain loan performance
5. **Social Vouching**: Allow users to vouch for borrowers
6. **Dynamic Reputation**: Update scores based on loan repayment behavior

## API Limitations

- Neynar free tier: Check your plan limits at https://neynar.com/pricing
- Rate limits apply - the hook includes basic caching via React's dependency array
- Profile data is fetched client-side and cached per component instance

## Testing

To test the integration:

1. Ensure a borrower address has a Farcaster account with verified eth address
2. View a loan card or detail page
3. Profile and badges should appear automatically
4. Check browser console for any API errors

## Troubleshooting

**Profiles not loading?**
- Check that `NEXT_PUBLIC_NEYNAR_API_KEY` is set correctly
- Verify the borrower has a Farcaster account with verified addresses
- Check browser console for API errors

**Power badges not showing?**
- Only users with official Farcaster Power Badges will display the badge
- The badge data comes directly from Neynar's API

**Trust scores seem off?**
- The algorithm can be adjusted in `/src/hooks/useFarcasterProfile.ts`
- Weights can be tuned based on your community's preferences
