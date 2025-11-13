# 🎭 Farcaster Integration

## Overview

LendFriend integrates with **Farcaster** to provide users with a social identity layer on top of their CDP embedded wallet. This integration enhances the user experience by providing human-readable identities, social proof, and reputation while maintaining the security and programmability of CDP wallets.

## What is Farcaster?

Farcaster is a **decentralized social protocol** built on Optimism, not a separate wallet or blockchain. It provides:

- **FID (Farcaster ID)**: A unique numerical identifier on the Optimism blockchain
- **Username (fname)**: A free, human-readable handle (e.g., `alice.fcast.id` displayed as `@alice`)
- **Social Profile**: Bio, avatar, and social connections
- **Decentralized Social Graph**: Portable social relationships across applications

### Important Distinctions

**Farcaster is NOT:**
- ❌ A separate wallet
- ❌ A separate blockchain
- ❌ A token or cryptocurrency

**Farcaster IS:**
- ✅ A social identity layer
- ✅ Metadata linked to your existing wallet address
- ✅ A portable social profile and reputation system

## Architecture

### One Wallet, One Social Identity

When users sign up for LendFriend via CDP, they receive:

```
User Account
├── CDP Embedded Wallet (Primary)
│   ├── EVM Address (0x...)
│   ├── Session Keys (for auto-deduction)
│   └── Account Abstraction Features
│
└── Farcaster Profile (Social Layer)
    ├── FID (e.g., 12345)
    ├── Username (e.g., alice.fcast.id → @alice)
    ├── Profile (bio, avatar)
    └── Social Graph (followers, following)
```

### How It Works

1. **Single Address**: Users have ONE wallet address from CDP
2. **Linked FID**: Farcaster FID is registered and linked to that CDP address
3. **Social Identity**: Username and profile provide human-readable identity
4. **Financial Operations**: CDP wallet handles all transactions, payments, and auto-deduction
5. **Social Features**: Farcaster enables social discovery, reputation, and virality

## Registration & Costs

### Current State (October 2025+)

Farcaster registration is now **FREE**:

- **FID Registration**: Free (previously $5-10)
- **Free Username**: `username.fcast.id` at no cost
- **Gas Costs**: ~$0.10 per registration (Optimism L2)

### Username Options

1. **Free Username (fname)**
   - Format: `username.fcast.id`
   - Displayed as: `@username`
   - Off-chain registration
   - Can be changed
   - Owned by Farcaster protocol

2. **Paid ENS (.eth)**
   - Format: `username.eth`
   - On-chain ownership
   - Cannot be revoked
   - Annual renewal fees
   - User owns the ENS name

**Recommendation**: Start users with free fnames. They can optionally upgrade to .eth later.

## Benefits of Automatic Farcaster Integration

### For Users

1. **Human-Readable Identity**
   - `@alice` instead of `0x742d...`
   - Easier for friends to find and recognize

2. **Social Proof**
   - Profile photo and bio
   - Follower count and social connections
   - Reputation history

3. **Better UX**
   - No need to copy/paste addresses
   - Social discovery features
   - Familiar social media experience

4. **Portability**
   - Same identity across all Farcaster apps
   - Not locked to LendFriend
   - Ownership and control

### For LendFriend Platform

1. **Lower Friction**
   - One-step signup process
   - No separate Farcaster registration needed
   - Immediate social identity

2. **Network Effects**
   - Users discoverable across Farcaster ecosystem
   - Viral growth through social connections
   - Cross-platform user acquisition

3. **Trust & Reputation**
   - Social connections inform trust scoring
   - Profile history provides context
   - Anti-Sybil through social graph

4. **Minimal Cost**
   - ~$0.10 gas cost per user
   - Free FID and username
   - High ROI on user acquisition

## Implementation Recommendations

### Registration Flow

```typescript
// When user signs up via CDP OAuth/Email/SMS
async function handleUserSignup(cdpAddress: string, email: string) {
  // 1. Create CDP embedded wallet (existing)
  const wallet = await createCDPWallet(email);

  // 2. Auto-register Farcaster account
  const farcasterAccount = await registerFarcasterAccount({
    custodyAddress: cdpAddress,
    username: generateUsername(email), // e.g., alice123
    requestSponsor: true, // Optional: sponsor gas costs
  });

  // 3. Store FID and username in database
  await db.users.update({
    address: cdpAddress,
    fid: farcasterAccount.fid,
    username: farcasterAccount.username,
  });

  // 4. Continue with normal onboarding
  return { wallet, farcasterAccount };
}
```

### Username Generation Strategy

```typescript
function generateUsername(email: string): string {
  // Extract name from email
  const localPart = email.split('@')[0];

  // Sanitize (alphanumeric + hyphens)
  const sanitized = localPart.replace(/[^a-zA-Z0-9-]/g, '');

  // Add random suffix if needed for uniqueness
  const username = `${sanitized}${Math.floor(Math.random() * 1000)}`;

  return username.toLowerCase();
}
```

### User Customization

After initial signup, allow users to:

1. **Change Username**: Switch to a preferred fname
2. **Update Profile**: Add bio, avatar, links
3. **Upgrade to ENS**: Purchase .eth name (optional)
4. **Connect Existing**: Link existing Farcaster account instead of creating new

## Technical Details

### CDP + Farcaster Integration

| Feature | Handled By |
|---------|------------|
| Wallet Address | CDP Embedded Wallet |
| Private Keys | CDP (MPC custody) |
| Transactions | CDP Wallet |
| Session Keys | CDP (auto-deduction) |
| Social Identity | Farcaster |
| Username | Farcaster |
| Profile | Farcaster |
| Social Graph | Farcaster |

### Security Considerations

1. **Custody**: CDP maintains custody of private keys via MPC
2. **Farcaster Keys**: Separate signer keys for Farcaster operations
3. **Permissions**: Farcaster cannot move funds (no transaction signing)
4. **Recovery**: CDP account recovery also maintains Farcaster link

## Cost Analysis

### Per-User Costs

- **FID Registration**: $0 (now free)
- **Gas on Optimism**: ~$0.10
- **CDP Account**: Free (included in platform)
- **Total per user**: ~$0.10

### ROI Calculation

For a 10,000 user base:
- **Total cost**: $1,000 (10K users × $0.10)
- **Benefits**:
  - Social discovery across Farcaster ecosystem
  - Reduced friction in signup
  - Better trust scoring via social graph
  - Viral growth through social connections
  - User retention through portable identity

**Expected ROI**: High - minimal cost for significant UX and growth benefits

## Migration Path

### For Existing Users

Users who already have accounts before Farcaster integration:

1. **Prompt during login**: "Add social identity to your account?"
2. **Optional registration**: Let users opt-in to create Farcaster profile
3. **Link existing**: Allow linking of existing Farcaster accounts
4. **Incentivize**: Consider rewards for completing profile

### For New Users

- **Automatic**: Create Farcaster account during CDP signup
- **Seamless**: No additional steps required
- **Transparent**: Explain benefits in onboarding

## Related Documentation

- [👤 Borrower Profiles & Identity](borrower-profiles.md)
- [🤝 Social Trust Scoring](social-trust-scoring/README.md)
- [🛡️ Anti-Gaming & Sybil Resistance](anti-gaming.md)
- [📱 Farcaster Mini App](farcaster-miniapp.md)
- [🔐 CDP Auto-Repayment](cdp-auto-repayment.md)

## Conclusion

**Recommendation**: Implement automatic Farcaster account creation during CDP signup.

The benefits far outweigh the minimal costs (~$0.10/user), and the integration provides:
- Better UX with human-readable identities
- Social discovery and viral growth
- Enhanced trust scoring through social connections
- Portable reputation across the Farcaster ecosystem

Farcaster complements CDP's wallet infrastructure by adding a social identity layer without compromising security or introducing wallet fragmentation.
