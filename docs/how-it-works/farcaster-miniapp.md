# Farcaster Mini App

LendFriend is available as a native Farcaster mini app, allowing users to create and fund loans directly within Warpcast and other Farcaster clients.

---

## Overview

**What it is:** A mini app that runs inside Farcaster clients (Warpcast mobile, Warpcast web)

**Key features:**
- Create loans without leaving Farcaster
- Fund loans with one tap
- Automatic Farcaster identity verification
- Trust scores calculated from your Farcaster network
- Share loans as casts with embedded mini app

**Technology:** Built with Next.js 15 + Farcaster Frame SDK

---

## User Experience

### For Borrowers

**Creating a loan:**

1. Open LendFriend mini app in Warpcast
2. Farcaster identity auto-detected (no signup needed)
3. Fill out loan form:
   - Title and description
   - Amount needed ($100-$5,000)
   - Loan duration (7-365 days)
   - Optional: Upload images, budget breakdown
4. Review and create
5. Loan deployed on-chain
6. Share as cast with embedded mini app

**Example cast:**
```
🚀 I'm raising $2,500 to buy a laptop for coding bootcamp

Help me out by contributing to my loan on @lendfriend

[Mini App Card shows: $2,500 goal, 0% funded, 30 days to maturity]
[Button: Contribute]
```

### For Lenders

**Funding a loan:**

1. See loan cast in Farcaster feed
2. Click "Contribute" button in mini app
3. View loan details + trust score
4. See mutual connections with borrower
5. Enter contribution amount
6. Approve transaction in wallet
7. Done! Contribution recorded

**Trust score displayed:**
- "🟢 High Trust - 8 mutual connections"
- "🟡 Medium Trust - 2 mutual connections"
- "🔴 Low Trust - No mutual connections"

---

## Technical Architecture

### Frame SDK Integration

**Setup:**

```typescript
import sdk from '@farcaster/frame-sdk';

export default function MiniApp() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext | null>(null);

  useEffect(() => {
    const load = async () => {
      // Initialize Farcaster SDK
      const ctx = await sdk.context;
      setContext(ctx);
      sdk.actions.ready();  // Signal ready to Farcaster client
      setIsSDKLoaded(true);
    };

    load();
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return <LoanApp context={context} />;
}
```

### Automatic Identity Verification

**Get user's Farcaster ID:**

```typescript
import sdk from '@farcaster/frame-sdk';

export function useF arcasterIdentity() {
  const [fid, setFid] = useState<number | null>(null);
  const [profile, setProfile] = useState<FarcasterProfile | null>(null);

  useEffect(() => {
    const getIdentity = async () => {
      const context = await sdk.context;
      const userFid = context.user.fid;
      setFid(userFid);

      // Fetch profile from Neynar
      const profileData = await neynar.fetchUserByFid(userFid);
      setProfile(profileData);
    };

    getIdentity();
  }, []);

  return { fid, profile };
}
```

**Auto-populate loan form:**

```typescript
export function CreateLoanForm() {
  const { fid, profile } = useFarcasterIdentity();

  const defaultValues = {
    borrowerFid: fid,
    borrowerUsername: profile?.username,
    borrowerDisplayName: profile?.displayName,
    borrowerPfp: profile?.pfp,
  };

  return <LoanForm defaultValues={defaultValues} />;
}
```

### Trust Score Calculation

**Trust scores use Farcaster social graph:**

```typescript
import sdk from '@farcaster/frame-sdk';

export async function calculateTrustScore(
  borrowerFid: number,
  lenderFid: number
) {
  // Fetch social graphs
  const borrowerFollowing = await neynar.fetchUserFollowing(borrowerFid);
  const lenderFollowing = await neynar.fetchUserFollowing(lenderFid);

  // Find mutual connections
  const mutuals = intersection(
    borrowerFollowing.map(u => u.fid),
    lenderFollowing.map(u => u.fid)
  );

  // Calculate Adamic-Adar weighted score
  const effectiveMutuals = await calculateAdamicAdar(mutuals);

  // Determine risk tier
  if (effectiveMutuals >= 9) return { tier: 'LOW', score: effectiveMutuals };
  if (effectiveMutuals >= 2.5) return { tier: 'MEDIUM', score: effectiveMutuals };
  return { tier: 'HIGH', score: effectiveMutuals };
}
```

**Display in mini app:**

```typescript
export function TrustScoreDisplay({ borrowerFid }: Props) {
  const { fid: lenderFid } = useFarcasterIdentity();
  const { data: trustScore } = useTrustScore(borrowerFid, lenderFid);

  return (
    <div className={`trust-badge ${trustScore.tier}`}>
      {trustScore.tier === 'LOW' && '🟢 High Trust'}
      {trustScore.tier === 'MEDIUM' && '🟡 Medium Trust'}
      {trustScore.tier === 'HIGH' && '🔴 Low Trust'}
      <span>{trustScore.score} effective mutuals</span>
    </div>
  );
}
```

### Wallet Connection

**Privy embedded wallet for Farcaster users:**

```typescript
import { usePrivy } from '@privy-io/react-auth';
import sdk from '@farcaster/frame-sdk';

export function ConnectWallet() {
  const { login, authenticated, user } = usePrivy();
  const { fid } = useFarcasterIdentity();

  const handleConnect = async () => {
    await login({
      // Use Farcaster FID as Privy user ID
      loginMethods: ['farcaster'],
      farcasterFid: fid,
    });

    // Embedded wallet created automatically
    console.log('Wallet address:', user.wallet.address);
  };

  return (
    <button onClick={handleConnect}>
      {authenticated ? 'Wallet Connected' : 'Connect Wallet to Contribute'}
    </button>
  );
}
```

### Transaction Signing

**Sign transactions within mini app:**

```typescript
export function ContributeButton({ loanAddress, amount }: Props) {
  const { user } = usePrivy();

  const handleContribute = async () => {
    // Prepare transaction
    const tx = await prepareLoanContribution(loanAddress, amount);

    // Sign with embedded wallet (Privy handles signing)
    const signedTx = await user.wallet.signTransaction(tx);

    // Send to network
    const txHash = await sendTransaction(signedTx);

    // Show success
    sdk.actions.openUrl(`https://basescan.org/tx/${txHash}`);
  };

  return <button onClick={handleContribute}>Contribute ${amount}</button>;
}
```

---

## Cast Actions

**One-tap contributions via Cast Actions:**

### Register Cast Action

```typescript
// POST /api/cast-actions/contribute
export async function POST(req: Request) {
  const { castHash } = await req.json();

  // Extract loan address from cast
  const cast = await neynar.fetchCastByHash(castHash);
  const loanAddress = extractLoanAddress(cast.text);

  return Response.json({
    type: 'form',
    title: 'Contribute to Loan',
    fields: [
      {
        type: 'number',
        name: 'amount',
        label: 'Amount (USDC)',
        placeholder: '10',
        min: 1,
        max: 5000,
      },
    ],
  });
}
```

### Handle Action Submission

```typescript
// POST /api/cast-actions/contribute/submit
export async function POST(req: Request) {
  const { fid, castHash, amount } = await req.json();

  // Get user's wallet
  const wallet = await getUserWallet(fid);

  // Execute contribution
  const txHash = await contributeToLoan(loanAddress, amount, wallet);

  return Response.json({
    message: `Successfully contributed $${amount}! Transaction: ${txHash}`,
  });
}
```

**User experience:**
1. User sees loan cast in feed
2. Clicks "Contribute" cast action
3. Enters amount in modal
4. Clicks submit
5. Transaction signed and sent
6. Success message displayed

---

## Embedded Loan Cards

**Mini app cards embedded in casts:**

```typescript
export function LoanCastCard({ loanAddress }: Props) {
  const { data: loan } = useLoan(loanAddress);
  const { fid } = useFarcasterIdentity();
  const { data: trustScore } = useTrustScore(loan.borrowerFid, fid);

  return (
    <div className="loan-card">
      <div className="header">
        <img src={loan.borrowerPfp} />
        <div>
          <h3>{loan.borrowerDisplayName}</h3>
          <span>@{loan.borrowerUsername}</span>
        </div>
        <TrustBadge tier={trustScore.tier} />
      </div>

      <h2>{loan.title}</h2>
      <p>{loan.description.slice(0, 100)}...</p>

      <div className="stats">
        <div>
          <span className="label">Goal</span>
          <span className="value">${formatUSD(loan.principal)}</span>
        </div>
        <div>
          <span className="label">Raised</span>
          <span className="value">${formatUSD(loan.totalRaised)}</span>
        </div>
        <div>
          <span className="label">Progress</span>
          <ProgressBar percent={loan.fundingProgress} />
        </div>
      </div>

      <button onClick={() => openContributeModal(loanAddress)}>
        Contribute
      </button>
    </div>
  );
}
```

---

## Deployment

**Hosting:** Vercel edge functions
**Domain:** `miniapp.lendfriend.org`
**Network:** Base Sepolia (testnet), Base Mainnet (production)

**Manifest configuration:**

```json
{
  "name": "LendFriend",
  "icon": "https://lendfriend.org/icon.png",
  "splashImage": "https://lendfriend.org/splash.png",
  "splashBackgroundColor": "#3B9B7F",
  "homeUrl": "https://miniapp.lendfriend.org",
  "version": "1.0.0"
}
```

**Frame metadata:**

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://miniapp.lendfriend.org/og-image.png" />
<meta property="fc:frame:button:1" content="Create Loan" />
<meta property="fc:frame:button:2" content="Browse Loans" />
<meta property="fc:frame:post_url" content="https://miniapp.lendfriend.org/api/frame" />
```

---

## Mobile Optimization

**Tab-based navigation for mobile:**

```typescript
export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<'create' | 'browse' | 'portfolio'>('browse');

  return (
    <div className="mobile-layout">
      <div className="content">
        {activeTab === 'create' && <CreateLoanTab />}
        {activeTab === 'browse' && <BrowseLoansTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
      </div>

      <nav className="bottom-nav">
        <button onClick={() => setActiveTab('browse')}>Browse</button>
        <button onClick={() => setActiveTab('create')}>Create</button>
        <button onClick={() => setActiveTab('portfolio')}>Portfolio</button>
      </nav>
    </div>
  );
}
```

**Mobile-first design:**
- Large touch targets (min 44x44px)
- Bottom navigation for easy thumb access
- Swipe gestures for loan cards
- Optimized images (WebP, lazy loading)
- Minimal text input (use dropdowns/sliders)

---

## Analytics

**Track mini app usage:**

```typescript
import sdk from '@farcaster/frame-sdk';

export function trackEvent(event: string, properties: any) {
  // Send to analytics (PostHog, Amplitude, etc.)
  analytics.track(event, {
    ...properties,
    source: 'farcaster-miniapp',
    fid: sdk.context.user.fid,
  });
}

// Example events
trackEvent('loan_created', { loanAddress, principal, duration });
trackEvent('contribution_made', { loanAddress, amount, trustScore });
trackEvent('loan_shared', { loanAddress, platform: 'farcaster' });
```

---

## Limitations

**Current limitations:**
- Mobile-only (no desktop Farcaster mini apps yet)
- Warpcast-specific features (may not work in other Farcaster clients)
- Limited to Farcaster users (can't onboard non-Farcaster users)

**Workarounds:**
- Direct users to web app for desktop experience
- Provide web fallback link in casts
- Use Farcaster as one channel, not the only channel

---

## Related Documentation

- [Borrower Profiles](borrower-profiles.md) — How Farcaster identity is used
- [Social Trust Scoring](social-trust-scoring/README.md) — Trust score algorithm
- [Virality & Growth](virality-and-growth/farcaster-virality.md) — How mini app drives growth
- [Payment Methods](payment-methods.md) — How contributions work
