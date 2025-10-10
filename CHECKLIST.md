# FAR-MCA Setup Checklist

Use this checklist to get your zero-interest crowdfunding platform up and running.

## ✅ Initial Setup

- [ ] **Install Node.js 18+** (if not already installed)
- [ ] **Clone/verify repository** is in place
- [ ] **Run `npm install`** to install dependencies
- [ ] **Copy `.env.example` to `.env.local`**

## ✅ Essential Configuration

### Required API Keys

- [ ] **Privy** (Authentication)
  - [ ] Create account at https://privy.io
  - [ ] Create new app
  - [ ] Copy `NEXT_PUBLIC_PRIVY_APP_ID`
  - [ ] Copy `PRIVY_APP_SECRET`
  - [ ] Add to `.env.local`

- [ ] **Alchemy** (RPC Provider)
  - [ ] Create account at https://alchemy.com
  - [ ] Create app for "Base Sepolia"
  - [ ] Copy HTTP URL as `NEXT_PUBLIC_RPC_URL`
  - [ ] Add to `.env.local`

- [ ] **Pinata** (IPFS Storage)
  - [ ] Create account at https://pinata.cloud
  - [ ] Generate API Key (JWT)
  - [ ] Copy as `PINATA_JWT`
  - [ ] Add to `.env.local`

### Smart Contract Addresses

- [ ] **Use existing contracts** (recommended for testing)
  ```
  NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0x0Eb3075cF3bAAB9715c8D3F423F1634571c4B312
  NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
  ```
  - [ ] Or deploy your own contracts
  - [ ] Update addresses in `.env.local`

### The Graph Subgraph

- [ ] **Use existing subgraph**
  ```
  NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/113071/subgraph/version/latest
  ```
  - [ ] Or deploy your own subgraph
  - [ ] Update URL in `.env.local`

### App URL

- [ ] **Set app URL** in `.env.local`
  ```
  NEXT_PUBLIC_APP_URL=http://localhost:3001
  ```

## ✅ Optional Configuration

### Shopify Integration (Credit Scoring)

- [ ] Create Shopify Partner account
- [ ] Create new app
- [ ] Set redirect URL: `http://localhost:3001/api/shopify/callback`
- [ ] Add `SHOPIFY_API_KEY` to `.env.local`
- [ ] Add `SHOPIFY_API_SECRET` to `.env.local`

### Stripe (Card Payments)

- [ ] Create Stripe account
- [ ] Get API keys
- [ ] Add `STRIPE_SECRET_KEY` to `.env.local`
- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`

### Chainlink Functions (Advanced Credit Scoring)

- [ ] Get LINK tokens on Base Sepolia
- [ ] Create Chainlink Functions subscription
- [ ] Add `CHAINLINK_SUBSCRIPTION_ID` to `.env.local`
- [ ] Add `ENCRYPTED_SECRETS_REFERENCE` to `.env.local`

## ✅ Development

- [ ] **Start dev server**: `npm run dev`
- [ ] **Verify server starts** on http://localhost:3001
- [ ] **Check for errors** in terminal

## ✅ Testing

### Get Test Funds

- [ ] **Base Sepolia ETH** (for gas)
  - [ ] Visit https://portal.cdp.coinbase.com/products/faucet
  - [ ] Request test ETH
  - [ ] Verify receipt in wallet

- [ ] **Test USDC** (for funding)
  - [ ] Use app's built-in faucet at `/api/faucet-usdc`
  - [ ] Or request via UI
  - [ ] Verify USDC balance

### Wallet Connection

- [ ] **Install MetaMask** or other wallet
- [ ] **Add Base Sepolia network**
  - Network: Base Sepolia
  - RPC: https://sepolia.base.org
  - Chain ID: 84532
  - Symbol: ETH
- [ ] **Connect wallet** to app
- [ ] **Verify connection** shows address

### Create Test Campaign

- [ ] **Navigate to** "Request Funding" or "Create Campaign"
- [ ] **Fill in campaign details**:
  - [ ] Business name
  - [ ] Description
  - [ ] Funding goal (start small, e.g., 100 USDC)
  - [ ] Revenue share % (e.g., 5%)
  - [ ] Repayment cap (1.0 for zero-interest)
- [ ] **Upload image**
- [ ] **Submit transaction**
- [ ] **Verify campaign** appears on homepage

### Test Funding

- [ ] **Browse campaigns** on homepage
- [ ] **Click campaign** to view details
- [ ] **Click "Fund This Business"**
- [ ] **Enter amount** (e.g., 10 USDC)
- [ ] **Choose payment method**: Wallet
- [ ] **Approve** if needed
- [ ] **Submit contribution**
- [ ] **Verify** contribution appears in campaign

### Test Dashboard

- [ ] **View business dashboard** at `/my-advances`
- [ ] **Verify campaign** appears
- [ ] **View funder portfolio** at `/portfolio`
- [ ] **Verify contribution** appears

## ✅ Customization

### Branding

- [ ] **Replace logo** in `public/raiseup-logo.png`
- [ ] **Update favicon** in `src/app/favicon.ico`
- [ ] **Modify colors** in `tailwind.config.ts`
- [ ] **Update app name** throughout UI

### Content

- [ ] **Homepage copy** in `src/app/page.tsx`
- [ ] **Navigation links** in `src/components/Navbar.tsx`
- [ ] **Footer content** (if applicable)
- [ ] **About page** (create if needed)

### Terms & Settings

- [ ] **Default revenue share** in campaign forms
- [ ] **Repayment cap** (ensure 1.0 for zero-interest)
- [ ] **Minimum funding** amounts
- [ ] **Campaign duration** settings

## ✅ Production Deployment

### Pre-Deployment

- [ ] **Test all features** locally
- [ ] **Build for production**: `npm run build`
- [ ] **Fix any build errors**
- [ ] **Test production build**: `npm start`

### Deploy to Vercel

- [ ] **Push code** to GitHub
- [ ] **Import project** in Vercel
- [ ] **Add environment variables** (all from `.env.local`)
- [ ] **Deploy**
- [ ] **Verify deployment** works

### Post-Deployment

- [ ] **Update app URL** in `.env` (production URL)
- [ ] **Update Privy** redirect URLs
- [ ] **Update Shopify** redirect URLs (if using)
- [ ] **Test wallet connection** on live site
- [ ] **Test campaign creation** on live site
- [ ] **Test funding flow** on live site

### Mainnet Deployment (Optional)

- [ ] **Deploy contracts** to Base Mainnet
- [ ] **Update contract addresses** in `.env`
- [ ] **Update RPC URL** to Base Mainnet
- [ ] **Use real USDC** contract address
- [ ] **Deploy subgraph** to mainnet
- [ ] **Update subgraph URL**
- [ ] **Test thoroughly** with small amounts first

## ✅ Documentation

- [ ] **Read** [README.md](./README.md) for overview
- [ ] **Read** [OVERVIEW.md](./OVERVIEW.md) for concepts
- [ ] **Read** [SETUP.md](./SETUP.md) for detailed setup
- [ ] **Read** [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for what was copied

## ✅ Monitoring & Maintenance

### After Launch

- [ ] **Monitor** error logs
- [ ] **Track** campaign creation
- [ ] **Monitor** funding transactions
- [ ] **Collect** user feedback
- [ ] **Update** dependencies regularly: `npm update`
- [ ] **Security** updates: `npm audit`

### Regular Tasks

- [ ] **Backup** environment variables
- [ ] **Monitor** smart contract events
- [ ] **Check** IPFS pinning
- [ ] **Review** analytics
- [ ] **Update** documentation as needed

## 🚀 Quick Start Summary

**Minimal steps to get running:**

1. `npm install`
2. `cp .env.example .env.local`
3. Add Privy, Alchemy, Pinata keys to `.env.local`
4. `npm run dev`
5. Open http://localhost:3001
6. Connect wallet
7. Create test campaign
8. Test funding

**Time estimate**: 30-60 minutes for full setup

## 📋 Verification

**How to know it's working:**

✅ Server starts without errors
✅ Homepage loads
✅ Can connect wallet
✅ Can create campaign
✅ Campaign appears on homepage
✅ Can contribute to campaign
✅ Contribution shows in dashboard

**If something doesn't work:**

1. Check console for errors
2. Verify `.env.local` configuration
3. Ensure test funds in wallet
4. Check network (Base Sepolia)
5. Review [SETUP.md](./SETUP.md) for troubleshooting

---

**Need help?** Review the documentation files or check error messages carefully.

**Ready to launch?** Complete this checklist and you're good to go! ✨
