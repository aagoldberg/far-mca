# Base Mini App - LendFriend

This is the Base mini app version of LendFriend, optimized to run inside the Base App (Coinbase's consumer app) and Farcaster clients.

## 📱 Mini App vs Web App

| Directory | Purpose | URL | Features |
|-----------|---------|-----|----------|
| `/apps/web-cdp` | Full web application | lendfriend.org | Complete desktop/mobile experience |
| `/apps/base` | **Mini app (this)** | lendfriend-base.vercel.app | Embedded in Base App/Farcaster |
| `/apps/farcaster` | Legacy Farcaster-only | - | Deprecated |

## 🎯 What Makes This a Mini App

### 1. **Runs Inside Host Apps**
- Base App (Coinbase's consumer mobile app)
- Farcaster clients (Warpcast, Supercast, etc.)
- Not meant to be accessed as a standalone website

### 2. **Mini App-Specific Features**
- ✅ Simplified navigation (`MiniAppNavbar.tsx`)
- ✅ SDK wallet connection (`useMiniAppWallet.ts`)
- ✅ Farcaster MiniApp SDK integration
- ✅ CDP Smart Wallet for gasless transactions
- ✅ Mobile-first, compact UI
- ✅ Close button to return to host app

### 3. **Configuration Files**
```
public/
└── .well-known/
    └── farcaster.json    # Mini app manifest

src/
├── components/
│   └── MiniAppNavbar.tsx # Simplified navigation
├── hooks/
│   └── useMiniAppWallet.ts # SDK wallet connection
└── app/
    ├── providers.tsx     # SDK initialization
    └── layout.tsx        # fc:miniapp meta tag
```

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3005
```

### Testing as a Mini App

**Option 1: Base App Developer Mode**
1. Deploy to Vercel
2. In Base App, enable developer mode
3. Add your mini app URL
4. Test mini app features

**Option 2: Farcaster Frame Debugger**
1. Deploy to public URL
2. Use Warpcast's frame debugger
3. Input your deployed URL

## 📦 Key Dependencies

```json
{
  "@farcaster/miniapp-sdk": "^0.2.1",  // Mini app SDK
  "@coinbase/cdp-react": "^0.0.60",    // Smart Wallets
  "@coinbase/onchainkit": "^0.38.19",  // On-chain components
  "wagmi": "^2.16.1",                   // Ethereum interactions
  "viem": "latest"                      // Type-safe Ethereum
}
```

## 🔧 SDK Features

### Available SDK Methods
```javascript
import { sdk } from "@farcaster/miniapp-sdk";

// Core Actions
sdk.actions.ready()        // Hide splash screen (in providers.tsx)
sdk.actions.close()        // Close mini app (in MiniAppNavbar.tsx)
sdk.actions.openUrl(url)   // Open external links

// Wallet Connection
sdk.wallet.connect()       // Connect wallet (in useMiniAppWallet.ts)
sdk.wallet.disconnect()    // Disconnect wallet
sdk.wallet.sendTransaction() // Send transactions

// User Context
sdk.context.get()          // Get Farcaster user data
```

## 🎨 Mini App Optimizations

### What We Changed from Web Version:
1. **Removed complex navigation** - Host app provides back button
2. **Simplified wallet connection** - Uses SDK instead of RainbowKit
3. **Mobile-first design** - Optimized for phone screens
4. **Removed footer** - Not needed in mini apps
5. **Added close button** - Return to host app

### What We Kept:
- CDP Smart Wallet integration (gasless transactions)
- Core lending functionality
- Supabase backend
- GraphQL queries

## 📝 Manifest Configuration

The manifest at `/public/.well-known/farcaster.json` defines:
- App metadata (name, description, icons)
- Mini app version (`"next"` for latest features)
- Category (`"defi"`)
- URLs for production deployment

## 🚢 Deployment

### 1. Deploy to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Base mini app setup"
git push

# Deploy via Vercel CLI or dashboard
vercel --prod
```

### 2. Update Production URLs
Edit `/public/.well-known/farcaster.json`:
```json
{
  "miniapp": {
    "homeUrl": "https://your-production-url.vercel.app",
    "iconUrl": "https://your-production-url.vercel.app/icon.png"
  }
}
```

### 3. Register with Base Build
1. Visit [Base Build](https://build.base.org)
2. Submit your mini app
3. Get account association credentials
4. Update manifest with credentials

## 🧪 Testing Checklist

### In Browser (Basic Testing)
- [ ] App loads at http://localhost:3005
- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] Meta tag present: `<meta name="fc:miniapp">`
- [ ] Simplified navbar displays
- [ ] Close button visible

### In Base App/Farcaster (Real Testing)
- [ ] SDK `ready()` hides splash screen
- [ ] Wallet connects via SDK
- [ ] User profile data loads
- [ ] Close button returns to host app
- [ ] Transactions work with Smart Wallet

## 🔍 Debugging

### Check Console Logs
```javascript
// In providers.tsx
console.log('[Base Mini App] Ready signal sent');

// In useMiniAppWallet.ts
console.log('Not running in mini app context');
```

### Common Issues
1. **"SDK not available"** - Normal in browser, only works in host apps
2. **Wallet won't connect** - Falls back to CDP Smart Wallet in browser
3. **Close button doesn't work** - Only functions in mini app context

## 📊 Architecture

```
Base Mini App
├── Farcaster MiniApp SDK    # Primary SDK
├── CDP Smart Wallet          # Gasless transactions
├── Wagmi + Viem             # Blockchain interaction
├── Supabase                 # Backend database
└── GraphQL                  # On-chain data queries
```

## 🛠️ Next Steps

- [ ] Add spend permissions for better UX
- [ ] Implement cast actions (share to Farcaster)
- [ ] Add analytics for mini app usage
- [ ] Optimize bundle size for faster loading
- [ ] Add offline support with service workers

## 📚 Resources

- [Base Mini Apps Documentation](https://docs.base.org/mini-apps)
- [Farcaster MiniApp SDK](https://github.com/farcaster/miniapp-sdk)
- [CDP Documentation](https://docs.cdp.coinbase.com)
- [Base Build Portal](https://build.base.org)

## 🤝 Support

- Report issues: https://github.com/your-repo/issues
- Documentation: https://docs.lendfriend.org
- Discord: https://discord.gg/lendfriend

---

**Note**: This app appears as a normal webpage when viewed in a browser but unlocks full mini app capabilities when accessed through the Base App or compatible Farcaster clients.