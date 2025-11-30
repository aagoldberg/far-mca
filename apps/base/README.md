# LendFriend Web App

The main web application for LendFriend's revenue-based financing platform.

## Overview

A full-featured Next.js application that enables businesses to request revenue-based financing and allows funders to support growing businesses with zero-equity capital.

## Features

### For Businesses
- **Request Funding**: Create campaigns with business details and credit scoring
- **Analytics Dashboard**: Track funding progress, revenue share, and repayment status
- **Payment Integration**: Accept funds via crypto (USDC) and fiat (Stripe, Coinbase Pay)

### For Funders
- **Browse Campaigns**: Discover active funding requests with detailed business metrics
- **Portfolio Management**: Track your funding impact and expected returns
- **Multiple Payment Methods**: Fund campaigns using USDC, credit cards, or Coinbase Pay

### Platform Features
- **Credit Scoring**: Chainlink-powered credit verification
- **Revenue-Based Financing**: 0% interest loans with revenue share repayment
- **Smart Contracts**: Automated funding and repayment on Base blockchain
- **The Graph Integration**: Real-time on-chain data indexing

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19.1.0
- **Authentication**: Privy (wallet + social login)
- **Web3**: wagmi, viem
- **Data**: Apollo Client, The Graph Protocol
- **Payments**:
  - Crypto: USDC on Base
  - Fiat: Stripe, Coinbase Pay, Ramp
- **Storage**: IPFS via Pinata
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file (see `.env.example` for template):

```bash
# Blockchain
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...

# The Graph
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/...

# Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret

# IPFS
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
PINATA_JWT=your_pinata_jwt

# Optional: Payment Integrations
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Homepage
│   │   ├── campaign/     # Campaign pages
│   │   ├── advance/      # RBF advance pages
│   │   ├── request-funding/
│   │   ├── portfolio/
│   │   └── ...
│   ├── components/       # React components
│   │   ├── CampaignCard.tsx
│   │   ├── FundingRequestList.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and config
│   ├── providers/       # Context providers
│   └── abi/            # Smart contract ABIs
├── public/             # Static assets
└── contracts/          # Solidity contracts (shared)
```

## Key Pages

- `/` - Homepage with active campaigns
- `/campaign/[id]` - Campaign details
- `/campaign/[id]/donate` - Funding flow
- `/advance/[id]` - RBF advance details
- `/request-funding` - Create new campaign
- `/portfolio` - User's funding portfolio
- `/my-fundraisers` - User's campaigns

## Smart Contracts

See `/contracts` directory for:
- Campaign Factory
- RBF Campaign contracts
- Revenue Splitter
- Lender Vault

Network: **Base Sepolia Testnet**

## Deployment

Deploy to Vercel:

```bash
vercel
```

Or any Next.js compatible hosting platform.

## Related Apps

- **Farcaster Mini App**: `../farcaster/` - Mobile-optimized Farcaster integration
- **Smart Contracts**: `../../contracts/` - Solidity contracts

## License

See LICENSE file in repository root.
