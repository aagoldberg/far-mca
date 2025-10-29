# Technical Stack

## Overview

LendFriend is built on modern web3 infrastructure, prioritizing low costs, transparency, and developer experience.

## Blockchain Layer

### Base L2 (Ethereum)
**Why Base?**
- 🚀 **Low fees**: ~$0.01 per transaction
- ⚡ **Fast finality**: 2-second block times
- 🔒 **Ethereum security**: Inherits Ethereum's security guarantees
- 🌐 **EVM compatible**: Standard Solidity tooling works
- 👥 **Growing ecosystem**: Coinbase backing, active community

**Network Details:**
- Mainnet: `base-mainnet` (Chain ID: 8453)
- Testnet: `base-sepolia` (Chain ID: 84532)
- Block explorer: [basescan.org](https://basescan.org)

## Smart Contracts

### Solidity 0.8.20
**Architecture**: Factory Pattern

```
MicroLoanFactory.sol
├── Deploys individual MicroLoan.sol contracts
├── Enforces constraints (min $100, max 365 days)
├── Tracks one active loan per borrower
└── Upgradeable via proxy pattern (future)

MicroLoan.sol (per loan)
├── Handles contributions (ERC-20 transfers)
├── Disburses to borrower when fully funded
├── Tracks repayments with accumulator pattern
└── Enables pro-rata claims for lenders
```

**Key Features:**
- ✅ Reentrancy protection (OpenZeppelin ReentrancyGuard)
- ✅ Access control (Ownable, role-based)
- ✅ Overflow protection (Solidity 0.8+ built-in)
- ✅ Gas optimized (O(1) repayment distribution)

**Testing:**
- Unit tests: Foundry + Hardhat
- Integration tests: Full loan lifecycle simulations
- Fuzz testing: Property-based testing for edge cases

## Currency

### USDC on Base
**Token Details:**
- Contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Decimals: 6
- Standard: ERC-20
- Issuer: Circle

**Why USDC?**
- 💵 Dollar-pegged stablecoin (minimizes volatility)
- 🏦 Widely adopted, trusted issuer
- 🔄 Easy on/off ramps via Coinbase, exchanges
- 📊 Native Base support (official Circle deployment)

## Identity & Social Graph

### Farcaster Protocol
**What is Farcaster?**
- Decentralized social network
- On-chain identities (FIDs)
- Censorship-resistant
- Cryptographic proof of connections

**Why Farcaster?**
- ✅ Verifiable social graphs (can't fake connections)
- ✅ Quality scores (Neynar filters spam/bots)
- ✅ Decentralized (no platform risk)
- ✅ Growing community (150k+ users, high-quality)

### Neynar API
**Data Fetched:**
- Follower/following lists
- User profiles and metadata
- Quality scores (0-1 scale)
- Cast history (for context)

**Caching Strategy:**
- 30-minute TTL for trust scores
- Incremental updates for user profiles
- React Query for client-side caching

## Frontend

### Next.js 14
**Features Used:**
- App Router (React Server Components)
- Server Actions for mutations
- Image optimization
- Static + Dynamic rendering mix

### Wallet Integration
**Stack:**
- **Wagmi v2**: React hooks for Ethereum
- **Viem**: TypeScript Ethereum library
- **Privy**: Embedded wallets + social login

**Wallet Options:**
- MetaMask, Coinbase Wallet, WalletConnect
- Email/SMS embedded wallets (via Privy)
- Passkey support for mobile

### State Management
- **React Query**: Server state + caching
- **Zustand**: Client state (UI preferences)
- **Wagmi**: Blockchain state

### Styling
- **Tailwind CSS**: Utility-first styling
- **Headless UI**: Accessible components
- **Heroicons**: Icon library

## Off-Chain Computation

### Trust Score Service
**Technology:**
- Runtime: Node.js 20+
- Language: TypeScript
- Algorithm: Set intersection (custom)

**Performance:**
- Typical calculation: <100ms
- Cached for 30 minutes
- Batched for multiple lenders

**Data Flow:**
```
Client Request
  ↓
React Query (check cache)
  ↓
API Route (/api/trust-score)
  ↓
Fetch Farcaster data (Neynar)
  ↓
Calculate intersection
  ↓
Apply quality weighting
  ↓
Return score + metadata
```

## Infrastructure

### Hosting
- **Vercel**: Frontend (Next.js)
- **Railway**: Backend services (future)
- **IPFS**: Loan metadata storage

### Database
**Current**: None (fully on-chain)

**Future**: PostgreSQL for:
- Cached social graph data
- User preferences
- Analytics

### Monitoring
- **Sentry**: Error tracking
- **Vercel Analytics**: Performance
- **Etherscan API**: Contract events
- **Custom dashboards**: Loan metrics

## API Architecture

### Public Endpoints
```
GET /api/loans              # List all loans
GET /api/loans/:id          # Get loan details
GET /api/trust-score        # Calculate trust score
GET /api/social-support     # Get loan-level support
```

### Authenticated Endpoints (Future)
```
POST /api/loans             # Create loan (requires signature)
POST /api/contribute        # Contribute to loan
POST /api/repay             # Repay loan
```

## Development Tools

### Smart Contracts
- **Foundry**: Testing framework
- **Hardhat**: Deployment scripts
- **Slither**: Security analysis
- **Mythril**: Formal verification

### Frontend
- **TypeScript**: Type safety
- **ESLint**: Linting
- **Prettier**: Code formatting
- **Husky**: Git hooks

### Testing
- **Vitest**: Unit tests
- **Playwright**: E2E tests
- **Foundry**: Contract tests

## Security

### Audits
- 🔄 Internal review (completed)
- 📅 External audit (planned Q2 2025)

### Best Practices
- ✅ OpenZeppelin contracts
- ✅ Reentrancy guards
- ✅ Access control
- ✅ Input validation
- ✅ Rate limiting (API)

### Bug Bounty
- 💰 Up to $10,000 for critical vulnerabilities
- 📧 Report to: security@lendfriend.org

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| **Page Load** | <2s | ~1.5s |
| **Trust Score Calc** | <200ms | ~100ms |
| **Transaction Fee** | <$0.02 | ~$0.01 |
| **Contract Gas** | <100k | ~60k |

## Open Source

All code is open source:
- **Contracts**: [github.com/your-org/far-mca/contracts](https://github.com)
- **Frontend**: [github.com/your-org/far-mca/apps/web](https://github.com)
- **Docs**: [github.com/your-org/far-mca/docs](https://github.com)

**License**: MIT

---

**Questions?** Join our [Discord](https://discord.gg/lendfriend) or file an issue on GitHub.
