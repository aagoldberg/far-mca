# LendFriend: Zero-Interest Community Lending

A decentralized, zero-interest financing platform built on the Base blockchain. It allows businesses and individuals to raise funds from their community, who are then repaid as revenue comes in. This is a model for community support, not financial return.

## 📁 Monorepo Structure

This is a monorepo containing multiple applications managed with npm workspaces:

- **`apps/base/`** - The primary, full-featured Farcaster Mini App for creating, managing, and contributing to loans.
- **`apps/farcaster/`** - A lightweight, read-only Farcaster Mini App for discovering and viewing existing loans.
- **`contracts/`** - The core Solidity smart contracts managed with Foundry.
- **`subgraph/`** - The Graph protocol subgraph for indexing and querying on-chain data.
- **`docs/`** - Project documentation and whitepaper.

## 🌟 Overview

LendFriend enables anyone to raise funds from a community with a simple, revenue-based repayment model:

- **Zero-Interest & Zero-Equity**: Funders are repaid exactly what they put in (1.0x cap). This is about support, not profit.
- **Flexible Repayment**: The borrower can repay at any pace before the loan's due date.
- **Transparent & On-Chain**: All contributions and repayments are recorded on the Base blockchain.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19 and App Router (`apps/base`).
- **Blockchain**: Base (Ethereum Layer 2) for low transaction costs.
- **Authentication**: Implicitly handled by the Farcaster Mini App environment. The application trusts the wallet address provided by the host Farcaster client (e.g., Warpcast).
- **Smart Contracts**: A factory pattern (`MicroLoanFactory.sol`) deploys individual `MicroLoan.sol` contracts that manage the entire lifecycle of a loan.
- **Gasless Transactions**: Powered by Coinbase Developer Platform's (CDP) Smart Wallets and a Paymaster service, allowing users to perform actions without paying for gas directly.
- **Data Fetching (Hybrid Model)**:
    - **On-Chain Data**: Wagmi is used for real-time contract reads and all write transactions.
    - **Indexed Data**: An Apollo Client connects to a custom subgraph to efficiently query lists of loans and historical data.
    - **Metadata**: Loan details (title, description, image) are stored on IPFS.
- **Styling**: TailwindCSS for responsive design.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Farcaster account with a connected wallet in a client like Warpcast.

### Installation

```bash
# Install all dependencies from the root directory
npm install
```

### Development

```bash
# Start the main interactive app (runs on port 3005)
npm run dev:base

# Start the read-only viewer app (runs on port 3002)
npm run dev:farcaster

# Build both apps
npm run build
```

### Environment Setup

Each application uses its own `.env.local` file.

**Main App (`apps/base/.env.local`):**
- Copy from the provided `.env.example` file.
- Configure environment variables for the Base Sepolia RPC URL, contract addresses, Subgraph URL, and Paymaster URL.

## 🔧 Technical Details

### Project Structure (`apps/base`)

```
apps/base/
└── src/
    ├── app/              # Next.js app router pages and layouts
    ├── components/       # Reusable React components
    ├── hooks/            # Custom React hooks for contract interaction (e.g., useMicroLoan.ts)
    ├── lib/              # Core libraries (e.g., wagmi.ts, constants.ts)
    ├── providers/        # React context providers
    ├── abi/              # Smart contract ABIs (e.g., MicroLoan.json)
    └── ...
```

### Smart Contract Integration

The application's logic is built around two core contracts:

- **`MicroLoanFactory.sol`**: A factory that deploys new loan contracts and keeps a registry of them.
- **`MicroLoan.sol`**: The contract for an individual loan. It manages the entire lifecycle: fundraising, disbursement, repayments, and claims.

### Key Difference from Traditional RBF

**Traditional RBF**:
- An investor contributes $10,000 expecting a 1.5x return, or $15,000. The investor profits $5,000.

**LendFriend (Zero-Interest Model)**:
- A community member contributes $10,000.
- The borrower repays exactly $10,000 over time.
- The funder gets their original contribution back with zero profit. This is a pure community support model.

## 🔐 Security

- Core contract logic is built using OpenZeppelin's audited contract library.
- Reentrancy guards are used on critical functions.
- All funds are managed non-custodially by the smart contracts.
- Transactions are transparent and verifiable on-chain.

## 📄 Environment Variables

See the `.env.example` file in `apps/base` for all required environment variables, including:

- `NEXT_PUBLIC_RPC_URL`: RPC URL for Base Sepolia.
- `NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS`: The address of the deployed factory contract.
- `NEXT_PUBLIC_USDC_ADDRESS`: The address of the USDC token contract.
- `NEXT_PUBLIC_SUBGRAPH_URL`: The endpoint for the project's subgraph.
- `NEXT_PUBLIC_PAYMASTER_URL`: The URL for the gas-sponsoring paymaster service.

## 🤝 Contributing

This is a community-driven platform. Contributions focused on improving the zero-interest crowdfunding model are welcome.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

