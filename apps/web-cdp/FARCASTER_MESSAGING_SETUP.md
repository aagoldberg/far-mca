# Farcaster Messaging Setup Guide

## Overview

This system allows contributors to leave messages when funding loans. Messages are:
- Saved to the database for reliable display
- Posted to Farcaster channels via a bot for viral reach
- Displayed on loan pages with contributor profiles

## Setup Instructions

### 1. Run Database Migration

Execute the SQL in `supabase/schema.sql` in your Supabase SQL Editor:
- Creates `loan_channels` table
- Creates `contribution_messages` table

### 2. Create Farcaster Bot Account

You need a dedicated Farcaster account for the bot to post anonymous messages.

**Option A: Use existing account**
```bash
# If you already have a Farcaster account you want to use
# Just get the signer UUID from your database
```

**Option B: Create new bot account**

1. Go to https://warpcast.com and create a new account
2. Username suggestion: `lendfriend` or `lendfriend-bot`
3. Bio: "Official LendFriend bot posting contribution updates"

### 3. Get Bot Signer UUID

Use your existing Neynar integration to create a signer for the bot account:

```typescript
// One-time setup script (you can run this in a Node.js script)
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});
const neynarClient = new NeynarAPIClient(config);

async function setupBot() {
  // Create signer for bot account
  const signer = await neynarClient.createSigner({
    // Add bot wallet address here
  });

  console.log('Bot Signer UUID:', signer.signer_uuid);
  console.log('Approval URL:', signer.signer_approval_url);

  // Visit the approval URL to authorize the signer
}

setupBot();
```

### 4. Add Environment Variable

Add to `.env.local`:

```bash
LENDFRIEND_BOT_SIGNER_UUID=your-bot-signer-uuid-here
```

### 5. Test the System

1. Navigate to a loan's funding page
2. Enter an amount and a message
3. Complete the contribution
4. Check:
   - Message appears in database (`contribution_messages` table)
   - Message appears on loan page
   - Bot posted to Farcaster channel (check Warpcast)

## Architecture

### Message Flow

```
User contributes with message
        ↓
LoanFundingForm.tsx → saveContributionMessage()
        ↓
POST /api/contributions/add-message
        ↓
1. Save to database (contribution_messages)
2. Post to Farcaster via bot (if configured)
        ↓
Success → Message visible on loan page
```

### Files Created/Modified

**New Files:**
- `src/lib/farcaster-bot.ts` - Bot utilities
- `src/app/api/contributions/add-message/route.ts` - Save messages
- `src/app/api/contributions/messages/route.ts` - Fetch messages
- `src/components/ContributionMessages.tsx` - Display component
- `supabase/schema.sql` - Database tables (appended)

**Modified Files:**
- `src/components/LoanFundingForm.tsx` - Added message textarea & API call
- `src/components/LoanDetails.tsx` - Added ContributionMessages display

## Features

### Message Input
- 280 character limit (Twitter-style)
- Character counter
- Optional (users can skip)
- Placeholder: "Good luck! You got this! 🙏"

### Message Display
- Shows Farcaster profile if contributor has one
- Fallback to wallet address
- Generated avatar for non-Farcaster users
- Timestamp ("2 hours ago")
- Amount contributed
- Link to Farcaster cast (if posted)

### Bot Posting
- Posts anonymously for non-Farcaster users
- Attributes to @username for Farcaster users
- Includes amount and message
- Links back to loan page
- Handles errors gracefully (doesn't fail contribution)

## Future Enhancements

### Phase 2: Farcaster Channels
- Create channel per loan on launch
- Post milestones (25%, 50%, 75%, 100% funded)
- Display channel feed on loan page

### Phase 3: XMTP Integration
- Private contributor group chat
- Borrower updates to contributors only
- Two-way messaging

## Troubleshooting

### Messages not posting to Farcaster
- Check `LENDFRIEND_BOT_SIGNER_UUID` is set
- Check bot signer status is "approved"
- Check Neynar API key is valid
- Look for errors in console/logs

### Messages not displaying
- Check database has records
- Check API route `/api/contributions/messages` works
- Check loan address matches (case-sensitive)
- Check `is_hidden` flag is false

### Contributor profiles not showing
- Farcaster profile lookup is async
- May take a moment to load
- Check `useFarcasterProfile` hook
- Fallback to wallet address is automatic

## Database Schema

### contribution_messages
```sql
- id (UUID)
- loan_address (TEXT)
- contributor_address (TEXT)
- amount (NUMERIC)
- message (TEXT, max 280 chars)
- transaction_hash (TEXT, unique)
- farcaster_cast_hash (TEXT, optional)
- posted_to_farcaster (BOOLEAN)
- created_at (TIMESTAMPTZ)
- is_hidden (BOOLEAN, for moderation)
```

### loan_channels
```sql
- loan_address (TEXT, primary key)
- farcaster_channel_id (TEXT)
- created_at (TIMESTAMPTZ)
- last_bot_post_at (TIMESTAMPTZ)
- total_bot_posts (INTEGER)
```

## Support

For issues or questions, check:
1. Browser console for frontend errors
2. Server logs for API errors
3. Supabase logs for database errors
4. Neynar API response in logs
