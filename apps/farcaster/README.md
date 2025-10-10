# LendFriend Farcaster App

A Farcaster Frame mini-app for LendFriend's revenue-based financing platform.

## Overview

This is a lightweight Farcaster Frame application that allows users to browse and support revenue-based financing campaigns directly within the Farcaster ecosystem. Built with Next.js 15 and the Farcaster Frame SDK.

## Features

- 🎯 Browse active RBF campaigns
- 💰 View campaign details and funding progress
- 🔗 Integrated with The Graph for on-chain data
- 📱 Optimized for Farcaster Frame display
- 🎨 LendFriend branding and styling

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19.1.0
- **Farcaster SDK**: @farcaster/frame-sdk
- **Web3**: wagmi, viem
- **Data**: Apollo Client (The Graph)
- **Styling**: Tailwind CSS
- **Chain**: Base Sepolia Testnet

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0x0Eb3075cF3bAAB9715c8D3F423F1634571c4B312
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/113071/subgraph/version/latest
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

### Development

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) to view the app.

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
apps/farcaster/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Home page with campaign list
│   │   ├── providers.tsx # React context providers
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── CampaignCard.tsx
│   │   ├── CampaignList.tsx
│   │   └── Navbar.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useCampaign.ts
│   └── lib/             # Utilities and config
│       ├── apollo.ts    # GraphQL client
│       ├── wagmi.ts     # Web3 config
│       └── utils.ts     # Helper functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Key Components

### CampaignList
Fetches and displays all active campaigns from The Graph subgraph.

### CampaignCard
Displays individual campaign details with:
- Campaign image
- Title and description
- Funding progress (circular progress indicator)
- Goal amount and donations count
- Creator information

### useCampaign Hook
Custom hook that:
- Fetches campaign data from The Graph
- Retrieves metadata from IPFS
- Handles loading and error states

## Farcaster Frame Integration

The app uses `@farcaster/frame-sdk` to:
- Signal readiness to the Farcaster Frame (`sdk.actions.ready()`)
- Optimize for display within Farcaster clients
- Provide seamless integration with the Farcaster ecosystem

## Smart Contracts

- **Campaign Factory**: `0x0Eb3075cF3bAAB9715c8D3F423F1634571c4B312`
- **USDC (Test)**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Network**: Base Sepolia Testnet

## Notes

- The `@farcaster/frame-sdk` package is deprecated. Consider migrating to `@farcaster/miniapp-sdk` in future updates.
- ESLint warnings during build are non-breaking and don't affect functionality.
- IPFS metadata fetching may be slow; the app handles timeouts gracefully.

## Related Projects

- Main LendFriend app: `../` (parent directory)
- Smart contracts: `../../contracts/`

## License

Private - Revenue-Based Financing Platform
