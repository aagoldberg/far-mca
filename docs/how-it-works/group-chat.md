# 💬 Group Chat

## Overview

Every loan has a **private, encrypted XMTP group chat** where the borrower and all contributors can communicate in real-time. This creates a dedicated space for loan-specific discussions, updates, and community building.

### Key Features

* **🔒 Private & Encrypted**: End-to-end encrypted using XMTP protocol
* **⚡ Auto-Created**: Group automatically created when loan is deployed
* **🎯 Auto-Join**: Contributors automatically added when they fund
* **💬 Real-Time**: Live message streaming with instant updates
* **👥 Contributor-Only**: Only users who have contributed can participate
* **📝 Persistent**: Full message history stored on XMTP network

## How It Works

### For Borrowers

1. **Create Loan** → XMTP group automatically created
2. **View Loan Page** → See "Contributor Chat" section
3. **Send Updates** → Message all contributors instantly
4. **Answer Questions** → Respond to contributor inquiries in real-time

### For Contributors

1. **Fund Loan** → Automatically joined to XMTP group
2. **View Loan Page** → See "Contributor Chat (Private)" section
3. **Send Messages** → Chat with borrower and other contributors
4. **Receive Updates** → Get real-time notifications from borrower

## Architecture

### Message Flow

```
Borrower Creates Loan
        ↓
Loan Contract Deployed → XMTP Group Created → Stored in Database
        ↓
User Contributes to Loan → Contributor Added to XMTP Group
        ↓
Contributors + Borrower → Real-Time Private Chat
```

### Technical Stack

* **Protocol**: [XMTP (Extensible Message Transport Protocol)](https://xmtp.org)
* **Encryption**: End-to-end encrypted
* **Network**: Decentralized XMTP network
* **Storage**: Messages stored on XMTP infrastructure
* **Wallet Support**: Any viem-compatible external wallet (MetaMask, Coinbase Wallet, etc.)

## Use Cases

### Borrower Communication

* **Progress Updates**: "Just received the equipment! Starting work next week 🚀"
* **Milestone Celebrations**: "We hit $5K in sales this month - thank you all!"
* **Transparency**: Share real-time business metrics with supporters
* **Build Relationships**: Get to know your supporters personally

### Contributor Engagement

* **Ask Questions**: "How's the business going? Any challenges?"
* **Offer Support**: "I have experience in marketing, happy to help!"
* **Community Building**: Connect with other supporters who believe in this loan
* **Stay Updated**: Get insider updates directly from the borrower

### Group Dynamics

* **Peer Accountability**: Public commitment to the group motivates repayment
* **Social Proof**: Active discussion signals a healthy, engaged community
* **Collective Intelligence**: Contributors can share advice and resources
* **Network Effects**: Group members may become customers or partners

## Privacy & Security

### Data Protection

* ✅ **End-to-End Encrypted**: All messages encrypted via XMTP protocol
* ✅ **Private by Default**: Only contributors and borrower can access chat
* ✅ **Not On-Chain**: Chat messages NOT stored on blockchain
* ✅ **Decentralized**: Messages stored on XMTP network, not centralized server

### Access Control

* **Contributor Verification**: System checks on-chain contribution amount
* **Wallet Authentication**: User must sign with contributing wallet
* **Automatic Membership**: No manual invitation process needed
* **Group Size**: Up to 250 members per loan

## Comparison with Farcaster Messages

LendFriend uses **both** XMTP group chat AND Farcaster public messages - they serve different purposes:

| Feature                 | XMTP Group Chat          | Farcaster Public Messages  |
| ----------------------- | ------------------------ | -------------------------- |
| **Privacy**             | Private, encrypted       | Public, visible to all     |
| **Members**             | Contributors only        | Anyone can view            |
| **Real-Time**           | Yes, live messaging      | No, post-based             |
| **Threading**           | Conversation thread      | Individual casts           |
| **Discovery**           | Invite-only              | Discoverable via social    |
| **Use Case**            | Private group discussion | Public social proof        |
| **Platform Integration** | XMTP chat widget         | Farcaster feed             |

**Together they provide:**

* **XMTP**: Private contributor discussions and updates
* **Farcaster**: Public contribution messages for social proof and virality

## Setup & Configuration

### Environment Variables

```bash
# XMTP Environment: 'dev' for testing, 'production' for live
NEXT_PUBLIC_XMTP_ENV=dev
```

### Database Tables

**loan\_channels** - Tracks XMTP groups for each loan

```sql
- loan_address (TEXT, primary key)
- xmtp_group_id (TEXT, XMTP group identifier)
- xmtp_created_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
```

**xmtp\_inbox\_ids** - Maps wallet addresses to XMTP inbox IDs

```sql
- wallet_address (TEXT, primary key)
- inbox_id (TEXT, unique)
- created_at (TIMESTAMPTZ)
- last_used_at (TIMESTAMPTZ)
```

## User Interface

### Chat Display

* **Sender Identification**: Wallet address (truncated): `0x1234...5678`
* **Message Content**: Word-wrapped text with proper formatting
* **Timestamps**: Relative time ("2 hours ago")
* **Visual Distinction**:
  * Your messages: Right-aligned, green background
  * Others' messages: Left-aligned, white background

### Message Composition

* **Multiline Input**: Textarea for longer messages
* **Keyboard Shortcuts**:
  * `Enter` - Send message
  * `Shift + Enter` - New line
* **Send Button**: Disabled when input is empty
* **Character Limit**: No hard limit (reasonable message sizes)

### Chat Container

* **Fixed Height**: Scrollable container with clean design
* **Auto-Scroll**: Automatically scrolls to latest messages
* **Loading State**: Skeleton UI while initializing
* **Empty State**: "No messages yet. Start the conversation!"
* **Error Handling**: Graceful fallback if XMTP unavailable

## Future Enhancements

### Phase 2: Enhanced Chat Experience

* Typing indicators
* Read receipts
* Rich text formatting (bold, italic, links)
* File and image attachments
* Emoji reactions to messages
* Message threading and replies

### Phase 3: Notifications

* Browser push notifications for new messages
* Email notifications for important updates
* In-app notification badge with unread count
* Configurable notification preferences

### Phase 4: Group Management

* Borrower can pin important messages
* Search message history
* Export chat transcript
* Mute/unmute notifications per loan
* Archive old loan chats

### Phase 5: CDP Wallet Support

* XMTP support for Coinbase embedded wallets
* Seamless experience for all wallet types
* No wallet switching required

## Best Practices

### For Borrowers

✅ **Do:**

* Post regular updates on loan progress
* Respond to contributor questions promptly
* Share both wins and challenges transparently
* Thank contributors for their support
* Use chat to build long-term relationships

❌ **Don't:**

* Spam the chat with promotional messages
* Share sensitive personal information
* Make promises you can't keep
* Ignore contributor concerns
* Use chat for unrelated business promotion

### For Contributors

✅ **Do:**

* Ask thoughtful questions about the business
* Offer helpful advice when relevant
* Encourage and support the borrower
* Share relevant resources or connections
* Respect other contributors' perspectives

❌ **Don't:**

* Harass or pressure the borrower
* Share others' private information
* Spam the chat with off-topic messages
* Make investment demands
* Criticize publicly without constructive feedback

## Troubleshooting

### Chat Not Visible

**Problem**: "Contributor Chat" section not showing

**Solutions**:

* Verify you have contributed to the loan (`contribution > 0`)
* Check if XMTP group exists for this loan
* Refresh the page
* Check browser console for errors
* Ensure you're using an external wallet (not CDP embedded)

### Can't Send Messages

**Problem**: Messages not sending or showing errors

**Solutions**:

* Check your wallet connection
* Verify XMTP client is initialized (check console)
* Refresh the page to reconnect
* Check internet connection
* Try switching to a different wallet

### Messages Not Appearing

**Problem**: Messages sent but not visible to others

**Solutions**:

* Check real-time streaming connection
* Verify group ID matches between users
* Check XMTP network status at [status.xmtp.org](https://status.xmtp.org)
* Refresh page to reload messages
* Check browser console for XMTP errors

### Group Not Created

**Problem**: No XMTP group after creating loan

**Solutions**:

* Check browser console for XMTP errors
* Verify `NEXT_PUBLIC_XMTP_ENV` is set in environment
* Ensure using external wallet (not CDP)
* Check database for loan\_channels entry
* Verify transaction succeeded and loan address was captured

## Technical Implementation

### Key Files

**XMTP Client Utilities** - `src/lib/xmtp-client.ts`

* `createXmtpClient()` - Initialize XMTP client with viem wallet
* `createLoanGroup()` - Create new XMTP group
* `sendGroupMessage()` - Send message to group
* `getGroupMessages()` - Fetch message history
* `streamGroupMessages()` - Real-time message streaming

**UI Components** - `src/components/LoanChat.tsx`

* Full-featured chat interface
* Real-time message display
* Message composition
* Auto-scroll functionality

**API Routes**

* `POST /api/xmtp/create-group` - Store group ID
* `POST /api/xmtp/add-contributor` - Store contributor inbox ID
* `GET /api/xmtp/create-group?loanAddress=X` - Get group ID
* `GET /api/xmtp/add-contributor?walletAddress=X` - Get inbox ID

### Integration Points

* **Loan Creation**: CreateLoanForm.tsx automatically creates XMTP group
* **Contribution**: LoanFundingForm.tsx adds contributor to group
* **Display**: LoanDetails.tsx shows chat for contributors only

## Learn More

* [XMTP Documentation](https://docs.xmtp.org)
* [XMTP Protocol Specification](https://github.com/xmtp/xmtp-dot-org)
* [XMTP Browser SDK](https://github.com/xmtp/xmtp-js)
* [Setup Guide](../SETUP.md) - Developer setup instructions
