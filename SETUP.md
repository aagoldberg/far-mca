# Setup Guide for FAR-MCA

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Configure .env.local (see below)

# 4. Start development server
npm run dev

# 5. Open http://localhost:3001
```

## Environment Configuration

Edit `.env.local` with your settings:

### Essential Configuration

```bash
# Blockchain (Base Sepolia Testnet)
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
# Or use Alchemy: https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Contract Addresses (from deployed contracts)
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0x0Eb3075cF3bAAB9715c8D3F423F1634571c4B312
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# Privy Authentication (get from https://privy.io)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret

# The Graph Subgraph (for querying campaign data)
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/113071/subgraph/version/latest

# IPFS/Pinata (for metadata storage)
PINATA_JWT=your_pinata_jwt_token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Optional Configuration

```bash
# Shopify Integration (for credit scoring - optional)
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret

# Chainlink Functions (for advanced credit scoring)
CHAINLINK_SUBSCRIPTION_ID=your_subscription_id
CHAINLINK_DON_ID=0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000
ENCRYPTED_SECRETS_REFERENCE=your_encrypted_secrets_reference

# Stripe (for card payments - optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Database (optional, for enhanced features)
DATABASE_URL=your_database_connection_string
```

## Getting API Keys

### 1. Privy (Authentication) - **Required**

1. Go to https://privy.io
2. Sign up for free account
3. Create new app
4. Copy App ID and Secret
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_PRIVY_APP_ID=cmf1knyqw...
   PRIVY_APP_SECRET=3rpCTVNobis...
   ```

### 2. Alchemy (RPC Provider) - **Recommended**

1. Go to https://alchemy.com
2. Create free account
3. Create new app for "Base Sepolia"
4. Copy HTTP URL
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
   ```

### 3. Pinata (IPFS Storage) - **Required**

1. Go to https://pinata.cloud
2. Sign up for free account
3. Generate API key (JWT)
4. Add to `.env.local`:
   ```
   PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Shopify (Credit Scoring) - **Optional**

Only needed if you want credit scoring features:

1. Go to https://partners.shopify.com
2. Create partner account
3. Create new app
4. Set redirect URL: `http://localhost:3001/api/shopify/callback`
5. Copy API credentials

## Smart Contract Setup

### Option 1: Use Existing Contracts (Easiest)

The `.env.example` includes deployed contract addresses on Base Sepolia:

```bash
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0x0Eb3075cF3bAAB9715c8D3F423F1634571c4B312
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

These contracts are already deployed and working.

### Option 2: Deploy Your Own Contracts

If you have the contract repository:

```bash
# In the contracts directory
forge script script/DeployFactory.s.sol:DeployFactory --rpc-url base_sepolia --broadcast

# Update .env.local with new addresses
```

## Testing the Platform

### 1. Get Test Funds

**Base Sepolia ETH** (for gas):
- Faucet: https://portal.cdp.coinbase.com/products/faucet
- Or: https://www.alchemy.com/faucets/base-sepolia

**Test USDC** (for funding):
- Built-in faucet in the app at `/api/faucet-usdc`
- Or use the platform's faucet UI

### 2. Connect Wallet

1. Start dev server: `npm run dev`
2. Open http://localhost:3001
3. Click "Connect Wallet"
4. Choose MetaMask, Coinbase Wallet, or other option
5. Approve connection

### 3. Create Test Campaign

1. Go to "Request Funding" or "Create Campaign"
2. Fill in details:
   - Business name
   - Funding goal (e.g., 1000 USDC)
   - Revenue share % (e.g., 5%)
   - Repayment cap (1.0 for zero-interest)
3. Upload image
4. Submit transaction

### 4. Fund a Campaign

1. Browse campaigns on homepage
2. Click campaign to view details
3. Click "Fund This Business"
4. Enter amount
5. Choose payment method:
   - **Wallet**: Direct from crypto wallet
   - **Coinbase**: One-click from Coinbase account
   - **Card**: Via Coinbase Pay (converts fiat to crypto)

## Common Issues

### "Chain not configured"

**Solution**: Make sure RPC URL is correct in `.env.local`

### "Contract not found"

**Solution**: Verify contract addresses match deployed contracts

### "Insufficient funds"

**Solution**: Get test ETH from faucet for gas fees

### "IPFS upload failed"

**Solution**: Check Pinata JWT token is valid

### Port 3001 already in use

**Solution**:
```bash
# Change port in package.json
"dev": "next dev -p 3002"
```

## Project Structure

```
far-mca/
├── src/
│   ├── app/                    # Next.js pages and routes
│   │   ├── page.tsx           # Homepage
│   │   ├── advance/[id]/      # Campaign detail pages
│   │   ├── request-funding/   # Create funding request
│   │   ├── create-campaign/   # Create campaign
│   │   ├── my-advances/       # Business dashboard
│   │   ├── portfolio/         # Funder dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── CampaignCard.tsx  # Campaign preview
│   │   ├── FundingForm.tsx   # Funding contribution form
│   │   ├── Navbar.tsx        # Navigation
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   ├── abi/                   # Smart contract ABIs
│   ├── config/                # Configuration
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── .env.example              # Environment template
├── README.md                 # Project overview
├── OVERVIEW.md               # Detailed platform explanation
└── SETUP.md                  # This file
```

## Development Workflow

### Making Changes

1. **Update Components**: Modify files in `src/components/`
2. **Add Pages**: Create new routes in `src/app/`
3. **Test Locally**: Changes hot-reload automatically
4. **Build**: `npm run build` to test production build

### Key Files

- `src/app/layout.tsx` - Root layout with providers
- `src/app/page.tsx` - Homepage
- `src/components/Navbar.tsx` - Navigation component
- `src/lib/wagmi.ts` - Web3 configuration
- `src/constants.ts` - Contract addresses and constants

## Customization

### Branding

- Logo: `public/raiseup-logo.png`
- Favicon: `src/app/favicon.ico`
- Colors: `tailwind.config.ts`

### Smart Contract Addresses

Update in `src/constants.ts`:

```typescript
export const CAMPAIGN_FACTORY_ADDRESS = "0x...";
export const USDC_ADDRESS = "0x...";
```

### Revenue Share Terms

Default terms can be modified in campaign creation forms:
- `src/app/request-funding/page.tsx`
- `src/app/create-campaign/page.tsx`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app is a standard Next.js 15 application and can be deployed anywhere that supports Node.js:

- Netlify
- Railway
- Render
- Self-hosted

## Need Help?

- Check [OVERVIEW.md](./OVERVIEW.md) for platform concepts
- Review [README.md](./README.md) for high-level info
- See `.env.example` for all configuration options

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment
3. ✅ Start dev server
4. 🔄 Create test campaign
5. 🔄 Test funding flow
6. 🔄 Customize for your use case
7. 🔄 Deploy to production

---

Happy building! 🚀
