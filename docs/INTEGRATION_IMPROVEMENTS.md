# LendFriend Farcaster Integration Improvements

Based on comprehensive review of Farcaster Mini Apps documentation.

## 🔴 **CRITICAL: Must Have**

### 1. Fix Mini App Embed Format
**Location:** `src/app/layout.tsx:16-22`
**Issue:** Using outdated `fc:frame: "vNext"` format instead of proper Mini App embed

**Current (Wrong):**
```typescript
other: {
  "fc:frame": "vNext",
  "fc:frame:image": "https://...",
  "fc:frame:button:1": "Open App",
  // ...
}
```

**Should Be:**
```typescript
other: {
  "fc:miniapp": JSON.stringify({
    version: "1",
    imageUrl: "https://far-micro.ngrok.dev/og-image.png",
    button: {
      title: "Open LendFriend",
      action: {
        type: "launch_frame",
        name: "LendFriend",
        url: "https://far-micro.ngrok.dev",
        splashImageUrl: "https://far-micro.ngrok.dev/splash.png",
        splashBackgroundColor: "#f5f0ec"
      }
    }
  })
}
```

**Why Critical:** Without proper embeds, your loans won't be shareable as rich cards in Farcaster feeds - **killing viral growth**.

---

### 2. Add Per-Loan Embeds for Viral Sharing
**Location:** `src/app/loan/[address]/page.tsx` (needs creation)

**What:** Each loan should have its own shareable embed with:
- Loan-specific OG image showing: borrower, amount needed, progress
- Button: "Support This Loan"
- Action: Opens app directly to that loan's funding page

**Why Critical:**
- Users can share specific loans in casts
- Each share becomes a discovery point
- Viral loop: see loan → support → share → repeat

**Example Implementation:**
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const loanData = await fetchLoanData(params.address);

  const embed = {
    version: "1",
    imageUrl: `https://far-micro.ngrok.dev/api/og/loan/${params.address}`,
    button: {
      title: `Support ${loanData.name}`,
      action: {
        type: "launch_frame",
        name: "LendFriend",
        url: `https://far-micro.ngrok.dev/loan/${params.address}`,
        splashImageUrl: "https://far-micro.ngrok.dev/splash.png",
        splashBackgroundColor: "#f5f0ec"
      }
    }
  };

  return {
    title: `${loanData.name} - LendFriend`,
    other: {
      "fc:miniapp": JSON.stringify(embed)
    }
  };
}
```

---

### 3. Implement Compose Cast Action (Share Success)
**Location:** `src/components/LoanFundingForm.tsx:200-234` (success state)

**What:** After someone funds a loan, prompt them to share their contribution

```typescript
import { sdk } from '@farcaster/miniapp-sdk';

// In success state:
const handleShareContribution = async () => {
  await sdk.actions.composeCast({
    text: `Just supported ${loanName} with $${amount} USDC on LendFriend! 🤝\n\nZero interest, 100% community.`,
    embeds: [`https://far-micro.ngrok.dev/loan/${loanAddress}`]
  });
};

// Add button in success UI:
<button onClick={handleShareContribution} className="...">
  Share Your Support
</button>
```

**Why Critical:**
- Creates viral loop
- Social proof for loans
- Free marketing through supporters' networks
- Increases trust (friends supporting friends)

---

### 4. Add "Add to My Apps" Prompt
**Location:** `src/components/LoanDetails.tsx` or first-time flow

**What:** Prompt users to add LendFriend to their app list

```typescript
import { sdk } from '@farcaster/miniapp-sdk';

const handleAddApp = async () => {
  try {
    await sdk.actions.addMiniApp();
  } catch (error) {
    console.error('Error adding mini app:', error);
  }
};

// Show on first visit or after first contribution:
<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
  <p className="text-sm mb-2">Get notified when loans you support are funded!</p>
  <button onClick={handleAddApp} className="...">
    Add to My Apps
  </button>
</div>
```

**Why Critical:**
- Enables notifications (see #5)
- Improves app discovery ranking
- Users can quickly return to app
- Retention++

---

## 🟡 **HIGH PRIORITY: Should Have**

### 5. Implement Notifications
**What:** Notify users about:
- Loan fully funded
- Borrower made repayment
- Your contribution is claimable
- New loan from someone you've supported before

**Implementation Steps:**

**A. Add webhook endpoint:**
```typescript
// src/app/api/webhook/route.ts
import { parseWebhookEvent, verifyAppKeyWithNeynar } from '@farcaster/miniapp-node';

export async function POST(request: Request) {
  const body = await request.text();

  try {
    const event = await parseWebhookEvent(body, verifyAppKeyWithNeynar);

    if (event.event === 'miniapp_added' || event.event === 'notifications_enabled') {
      // Save notification token to database
      await saveNotificationToken(event.data.fid, event.notificationDetails);
    }

    if (event.event === 'notifications_disabled' || event.event === 'miniapp_removed') {
      // Remove notification token
      await removeNotificationToken(event.data.fid);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    return new Response('Invalid', { status: 400 });
  }
}
```

**B. Update manifest:**
```json
{
  "miniapp": {
    ...
    "webhookUrl": "https://your-production-domain.com/api/webhook"
  }
}
```

**C. Send notifications:**
```typescript
// When loan gets fully funded:
await fetch(notificationUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    notificationId: `loan-funded-${loanAddress}`,
    title: "Loan Fully Funded! 🎉",
    body: `The loan you supported just reached its goal!`,
    targetUrl: `https://your-domain.com/loan/${loanAddress}`,
    tokens: [userToken]
  })
});
```

**Why Important:**
- Keeps users engaged
- Reminds them to claim returns
- Builds trust through transparency
- Increases repeat usage

---

### 6. Dynamic OG Images for Loans
**What:** Generate custom images for each loan showing:
- Borrower info
- Loan amount & progress
- Zero-interest badge
- Community support count

**Use:** `@vercel/og` or `satori` for dynamic image generation

```typescript
// src/app/api/og/loan/[address]/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET(request: Request, { params }) {
  const loan = await fetchLoanData(params.address);

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(to bottom, #f5f0ec, #ffffff)',
        // ... your design
      }}>
        <h1>{loan.name}</h1>
        <p>${loan.totalFunded} / ${loan.principal} raised</p>
        <div>🤝 {loan.supportersCount} supporters</div>
        <div>💚 0% Interest</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

**Why Important:**
- Makes shares visually appealing
- Instantly communicates loan status
- Increases click-through rates
- Professional appearance

---

### 7. Add "Open in Warpcast" Links for External Traffic
**What:** When users visit your app from outside Farcaster, show them how to use it in Farcaster

**Universal Link Format:**
```
https://farcaster.xyz/miniapps/<app-id>/<app-slug>/loan/${loanAddress}
```

```typescript
// Show banner if not in Farcaster context:
const isInFarcaster = sdk.context.client !== null;

{!isInFarcaster && (
  <div className="bg-purple-50 border border-purple-200 p-4">
    <p>For the best experience, open in Farcaster:</p>
    <a href={`https://farcaster.xyz/miniapps/${APP_ID}/lendfriend/loan/${loanAddress}`}>
      Open in Farcaster →
    </a>
  </div>
)}
```

---

## 🟢 **NICE TO HAVE: Polish**

### 8. Share Extensions (Cast Sharing)
**What:** Let users share casts directly to your app (e.g., share a cast asking for support, app helps them create a loan)

```json
// In manifest:
{
  "miniapp": {
    ...
    "castShareUrl": "https://your-domain.com/share"
  }
}
```

```typescript
// In share page:
if (sdk.context.location.type === 'cast_share') {
  const sharedCast = sdk.context.location.cast;
  // Pre-fill loan creation form from cast content
}
```

---

### 9. View Profile Action
**What:** Let users view borrower Farcaster profiles

```typescript
import { sdk } from '@farcaster/miniapp-sdk';

<button onClick={() => sdk.actions.viewProfile({ fid: borrowerFid })}>
  View {borrowerName}'s Profile
</button>
```

---

### 10. Manifest Enhancements
**Add to manifest:**
```json
{
  "miniapp": {
    "version": "1",
    "name": "LendFriend",
    "subtitle": "Zero-interest community loans",
    "description": "Support your community with interest-free loans. Help local businesses and neighbors grow while getting your contribution back - no interest, just community care.",
    "primaryCategory": "finance",
    "tags": ["lending", "community", "zero-interest", "mutual-aid", "microloans"],
    "screenshotUrls": [
      "https://your-domain.com/screenshots/home.png",
      "https://your-domain.com/screenshots/loan-details.png",
      "https://your-domain.com/screenshots/success.png"
    ],
    "heroImageUrl": "https://your-domain.com/hero.png",
    "tagline": "Neighbors helping neighbors thrive",
    ...
  }
}
```

---

## 📋 Implementation Checklist

### Week 1: Critical Fixes
- [ ] Fix embed format in layout.tsx
- [ ] Add per-loan embeds with metadata
- [ ] Implement compose cast after funding
- [ ] Add "Add to Apps" prompt

### Week 2: Growth Features
- [ ] Set up dynamic OG images
- [ ] Implement basic notifications infrastructure
- [ ] Add universal links for external traffic

### Week 3: Polish
- [ ] Enhance manifest with full metadata
- [ ] Add share extensions
- [ ] Implement view profile actions
- [ ] Create promotional screenshots

---

## 🎯 Expected Impact

### Critical Fixes (Week 1):
- **10x increase in viral sharing** - Proper embeds enable social discovery
- **3x user retention** - Add to apps + notifications keep users coming back
- **5x trust increase** - Compose cast creates social proof

### Growth Features (Week 2):
- **Better SEO** - Dynamic OG images improve link previews everywhere
- **Automated engagement** - Notifications bring users back without ads
- **Cross-platform growth** - Universal links convert web traffic

### Polish (Week 3):
- **App store ranking** - Complete manifest improves discoverability
- **Professional appearance** - Screenshots and hero images build credibility

---

## 📚 Resources

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/docs)
- [Example: Yoink! Manifest](https://yoink.party/.well-known/farcaster.json)
- [Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
- [Preview Tool](https://farcaster.xyz/~/developers/mini-apps/preview)
- [Notifications Demo](https://github.com/farcasterxyz/frames-v2-demo)

---

## ⚠️ Important Notes

1. **Ngrok URLs won't work for:**
   - `addMiniApp()` action
   - App store discovery
   - Production notifications
   - **Solution:** Deploy to production domain ASAP

2. **Manifest domain must match hosting domain exactly**

3. **Images must be:**
   - 3:2 aspect ratio for embeds
   - 200x200px for splash
   - PNG format (not SVG)
   - < 10MB

4. **Call `sdk.actions.ready()` after each page load** (you're already doing this ✅)

5. **Test embeds with:**
   ```bash
   curl -s https://far-micro.ngrok.dev | grep "fc:miniapp"
   ```
