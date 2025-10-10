# FAR-MCA: Crowdsourced Revenue-Based Financing

A decentralized revenue-based financing platform where funders provide capital with **0% interest or profit** - purely crowdsourced support for businesses.

## 🌟 Overview

This platform enables businesses to receive funding from the community with flexible revenue-based repayment terms. Unlike traditional RBF platforms:

- **Zero Interest/Profit for Funders**: Funders receive exactly what they contribute back - no more, no less
- **Community-Driven**: Built on the principle of collective support rather than profit
- **Flexible Repayment**: Businesses pay a percentage of revenue, making payments sustainable
- **Transparent & On-Chain**: All transactions recorded on Base blockchain for full transparency

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19 and App Router
- **Blockchain**: Base (Ethereum Layer 2) for low transaction costs
- **Authentication**: Privy for wallet and social login
- **Smart Contracts**: Revenue-based financing campaigns with automated repayment
- **Styling**: TailwindCSS for responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A wallet (MetaMask, Coinbase Wallet, etc.)
- Base Sepolia testnet access for testing

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your .env.local with:
# - NEXT_PUBLIC_RPC_URL (Base RPC endpoint)
# - NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS
# - NEXT_PUBLIC_USDC_CONTRACT_ADDRESS
# - NEXT_PUBLIC_PRIVY_APP_ID
# - And other required variables
```

### Development

```bash
# Start development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 Key Features

### For Businesses (Fund Seekers)
- **Create Funding Requests**: Set funding goals and revenue share percentages
- **Flexible Terms**: Define repayment caps (1.0x = exactly what was funded)
- **Multiple Payment Methods**: Accept crypto via various payment rails
- **Dashboard**: Track funding progress and manage repayments

### For Funders (Community Supporters)
- **Browse Campaigns**: Discover businesses seeking community support
- **Contribute Easily**: Multiple payment methods including card, Coinbase, or wallet
- **Track Contributions**: Monitor repayment progress in real-time
- **Zero Profit Model**: Receive your contribution back as the business grows

### Three User Personas

**1. Crypto Novices**
- Use Coinbase Pay for card-to-crypto conversion
- Simple payment flow with crypto abstracted

**2. Crypto Middle Ground**
- Connect Coinbase account for one-click funding
- Use existing USDC balance

**3. Crypto Natives**
- Direct wallet connection (MetaMask, etc.)
- Support for EIP-2612 permit signatures for gasless approvals

## 🔧 Technical Details

### Project Structure

```
far-mca/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── advance/      # Campaign detail pages
│   │   ├── api/          # API routes
│   │   ├── create-campaign/
│   │   ├── request-funding/
│   │   └── ...
│   ├── components/       # React components
│   ├── lib/             # Utility libraries
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   ├── abi/             # Smart contract ABIs
│   ├── config/          # Configuration files
│   └── providers/       # Context providers
├── public/              # Static assets
└── ...config files
```

### Smart Contract Integration

The platform uses a factory pattern for deploying revenue-based financing campaigns:

- **RBFCampaignFactory**: Deploys individual campaign contracts
- **RBFCampaign**: Manages contributions and revenue-based repayments
- **TestUSDC**: ERC-20 token for funding (USDC on mainnet)

### Key Difference from Traditional RBF

**Traditional RBF**:
- Investor contributes $10,000
- Business repays 1.5x = $15,000 over time
- Investor profits $5,000

**FAR-MCA (Zero-Interest Model)**:
- Funder contributes $10,000
- Business repays 1.0x = $10,000 over time
- Funder receives their contribution back, zero profit
- Pure community support model

## 🔐 Security

- Built on audited OpenZeppelin contracts
- All funds managed via smart contracts
- Transparent on-chain transaction history
- No custodial risk - direct wallet-to-contract interactions

## 📊 Use Cases

### Ideal for:
- **Mission-Driven Businesses**: Community wants to support the mission, not profit from it
- **Local Businesses**: Community members supporting local economy
- **Social Enterprises**: Funding aligned with values rather than returns
- **Early-Stage Startups**: Friends and family rounds without dilution or debt burden

## 🛠️ Development Workflow

### Adding New Features

1. **Smart Contract Changes**: Update contracts in separate contract repository
2. **Frontend Updates**: Modify components in `src/components/`
3. **New Pages**: Add routes in `src/app/`
4. **API Endpoints**: Create in `src/app/api/`

### Testing

```bash
# Run linting
npm run lint

# Test locally
npm run dev
```

## 📄 Environment Variables

See `.env.example` for all required environment variables:

- **Blockchain Configuration**: RPC URL, contract addresses
- **Authentication**: Privy app credentials
- **APIs**: Subgraph endpoints, storage APIs
- **Optional**: Shopify integration for credit scoring (advanced feature)

## 🤝 Contributing

This is a community-driven platform. Contributions focused on improving the zero-interest crowdfunding model are welcome!

## 📝 License

MIT License - see LICENSE file for details.

---

**Built on**: Next.js 15, React 19, Viem, Wagmi, Privy, Base Blockchain

**Philosophy**: Community support over profit - enabling businesses to access capital through collective action without the burden of interest or equity dilution.
