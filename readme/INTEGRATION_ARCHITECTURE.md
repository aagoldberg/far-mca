# MicroLoan Frontend Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BASE SEPOLIA TESTNET                            │
│                                                                         │
│  ┌──────────────────┐   ┌──────────────────┐   ┌─────────────────┐   │
│  │   TestUSDC       │   │ MicroLoanFactory │   │  MicroLoan      │   │
│  │  0x2d04...aaFe   │───│  0x747988...bFff │───│  (deployed)     │   │
│  │                  │   │                  │   │  instances      │   │
│  │  • faucet()      │   │  • createLoan()  │   │  • contribute() │   │
│  │  • approve()     │   │  • pause()       │   │  • disburse()   │   │
│  │  • transfer()    │   │  • getAllLoans() │   │  • repay()      │   │
│  └──────────────────┘   └──────────────────┘   └─────────────────┘   │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    │ Events
                                    ↓
                    ┌───────────────────────────────┐
                    │       The Graph Subgraph      │
                    │   (Optional - Recommended)    │
                    │                               │
                    │  • Indexes LoanCreated        │
                    │  • Indexes Contributed        │
                    │  • Indexes Disbursed          │
                    │  • Indexes Repaid             │
                    │  • Query API for frontend     │
                    └───────────────┬───────────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                        ↓                       ↓
        ┌───────────────────────┐   ┌───────────────────────┐
        │   Farcaster Mini App  │   │      Web App          │
        │   (Port 3002)         │   │   (Port 3001)         │
        │                       │   │                       │
        │  • Mobile-first       │   │  • Desktop-first      │
        │  • OnchainKit         │   │  • Privy Auth         │
        │  • Wagmi + Viem       │   │  • Full features      │
        │  • Frame SDK          │   │  • Create loans       │
        │  • Browse & fund      │   │  • Manage loans       │
        └───────────────────────┘   └───────────────────────┘
                    │                           │
                    └───────────┬───────────────┘
                                │
                                ↓
                    ┌───────────────────────┐
                    │    User Wallets       │
                    │                       │
                    │  • Coinbase Wallet    │
                    │  • MetaMask           │
                    │  • WalletConnect      │
                    └───────────────────────┘
```

---

## Frontend Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       LOAN BROWSING FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

User Opens App
      │
      ↓
┌─────────────────────┐
│  Homepage Component │
│  (page.tsx)         │
└──────────┬──────────┘
           │
           │ calls useLoans()
           ↓
┌─────────────────────┐
│   useLoans Hook     │  ──→  Query Subgraph OR useReadContract
└──────────┬──────────┘        (getAllLoans from Factory)
           │
           │ returns RawLoan[]
           ↓
┌─────────────────────┐
│  Fetch IPFS         │  ──→  Load metadata from IPFS gateway
│  Metadata           │        (title, description, image)
└──────────┬──────────┘
           │
           │ returns ProcessedLoan[]
           ↓
┌─────────────────────┐
│   LoanList          │  ──→  Maps over loans
│   Component         │
└──────────┬──────────┘
           │
           ↓
    ┌──────────────┐
    │  LoanCard    │  (x N loans)
    │  Component   │
    └──────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                     LOAN FUNDING FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

User Clicks Loan
      │
      ↓
┌─────────────────────┐
│  Loan Detail Page   │
│  /loan/[id]         │
└──────────┬──────────┘
           │
           │ calls useLoanDetails(loanAddress)
           ↓
┌─────────────────────┐
│ useLoanDetails Hook │  ──→  Multiple useReadContract calls
└──────────┬──────────┘        • borrower()
           │                    • principal()
           │                    • totalFunded()
           │                    • termPeriods()
           │                    • periodLength()
           ↓
┌─────────────────────┐
│  LoanDetails        │
│  Component          │
└──────────┬──────────┘
           │
           ↓
    User Clicks "Fund Loan"
           │
           ↓
┌─────────────────────┐
│  FundingForm        │
│  Component          │
└──────────┬──────────┘
           │
           │ 1. User enters amount
           │ 2. Calls useUSDCBalance()
           │ 3. Validates balance
           ↓
┌─────────────────────┐
│  Funding Flow       │
│                     │
│  Step 1:            │  ──→  useUSDCApprove()
│   Approve USDC      │        approve(loanAddress, amount)
│                     │
│  Step 2:            │  ──→  useContributeToLoan()
│   Contribute        │        contribute(loanAddress, amount)
└──────────┬──────────┘
           │
           │ Wait for transaction
           ↓
┌─────────────────────┐
│  Success State      │  ──→  Show success message
│                     │        Refetch loan details
└─────────────────────┘        Update UI


┌─────────────────────────────────────────────────────────────────────┐
│                     LOAN CREATION FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

User Clicks "Create Loan"
      │
      ↓
┌─────────────────────┐
│  CreateLoanForm     │
│  Component          │
└──────────┬──────────┘
           │
           │ User fills form:
           │  • Title, description
           │  • Principal amount
           │  • Term periods
           │  • Period length
           │  • Upload image
           ↓
┌─────────────────────┐
│  Upload to IPFS     │  ──→  Upload metadata JSON
│                     │        Returns: ipfs://QmXxx...
└──────────┬──────────┘
           │
           │ metadataURI ready
           ↓
┌─────────────────────┐
│  useCreateLoan()    │  ──→  MicroLoanFactory.createLoan()
│                     │        Args: borrower, metadataURI,
└──────────┬──────────┘              principal, termPeriods, etc.
           │
           │ Wait for transaction
           ↓
┌─────────────────────┐
│  LoanCreated Event  │  ──→  Extract loan address from event
│                     │        Navigate to new loan page
└─────────────────────┘
```

---

## Component Hierarchy

```
apps/farcaster/src/
│
├── app/
│   ├── layout.tsx                    (Root layout + Providers)
│   ├── providers.tsx                 (Wagmi, OnchainKit providers)
│   │
│   ├── page.tsx                      (Homepage)
│   │   └── uses: LoanList
│   │
│   ├── loan/
│   │   └── [id]/
│   │       ├── page.tsx              (Loan detail page)
│   │       │   └── uses: LoanDetails
│   │       │
│   │       └── fund/
│   │           └── page.tsx          (Funding page)
│   │               └── uses: FundingForm
│   │
│   └── create-loan/
│       └── page.tsx                  (Create loan page)
│           └── uses: CreateLoanForm
│
├── components/
│   ├── Navbar.tsx                    (Navigation + Faucet button)
│   │   └── uses: useUSDCFaucet, ConnectButton
│   │
│   ├── LoanList.tsx                  (Grid of loans)
│   │   └── uses: LoanCard (x N)
│   │
│   ├── LoanCard.tsx                  (Individual loan preview)
│   │   └── Props: ProcessedLoan
│   │
│   ├── LoanDetails.tsx               (Full loan information)
│   │   └── uses: RepaymentSchedule, FundingForm
│   │
│   ├── RepaymentSchedule.tsx         (Period breakdown)
│   │
│   ├── FundingForm.tsx               (Contribution UI)
│   │   └── uses: useUSDCApprove, useContributeToLoan
│   │
│   └── CreateLoanForm.tsx            (New loan form)
│       └── uses: useCreateLoan
│
├── hooks/
│   ├── useMicroLoan.ts               (Contract interactions)
│   │   ├── useFactoryLoans()         → Read all loans
│   │   ├── useLoanDetails()          → Read specific loan
│   │   ├── useContributeToLoan()     → Write: contribute
│   │   └── useCreateLoan()           → Write: create loan
│   │
│   ├── useUSDC.ts                    (USDC operations)
│   │   ├── useUSDCBalance()          → Read balance
│   │   ├── useUSDCApprove()          → Write: approve
│   │   └── useUSDCFaucet()           → Write: faucet
│   │
│   └── useLoans.ts                   (Subgraph queries)
│       └── useLoans()                → Query loans from subgraph
│           useProcessedLoans()       → With IPFS metadata
│
├── lib/
│   ├── wagmi.ts                      (Wagmi config + addresses)
│   ├── apollo.ts                     (GraphQL client)
│   └── utils.ts                      (Helper functions)
│
├── types/
│   └── loan.ts                       (TypeScript interfaces)
│       ├── RawLoan
│       ├── ProcessedLoan
│       ├── LoanMetadata
│       └── LoanDetails
│
└── abi/
    ├── MicroLoanFactory.json
    ├── MicroLoan.json
    └── TestUSDC.json
```

---

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    GLOBAL STATE (Wagmi)                     │
│                                                             │
│  • Connected wallet address                                │
│  • Chain ID (Base Sepolia: 84532)                         │
│  • Account balance                                         │
│  • Transaction states                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ↓                     ↓                     ↓
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Loan State    │   │  USDC State   │   │  UI State     │
│               │   │               │   │               │
│ • loans[]     │   │ • balance     │   │ • loading     │
│ • selected    │   │ • allowance   │   │ • error       │
│ • loading     │   │               │   │ • modals      │
└───────────────┘   └───────────────┘   └───────────────┘

Each managed by respective hooks:
useMicroLoan()      useUSDC()         useState()
```

---

## Transaction Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│           USER CONTRIBUTION TRANSACTION FLOW                │
└─────────────────────────────────────────────────────────────┘

State: IDLE
      │
      │ User clicks "Fund Loan"
      ↓
State: PREPARING
      │
      │ Validate inputs
      │ Check USDC balance
      ↓
State: APPROVING
      │
      │ Call: USDC.approve(loanAddress, amount)
      │ Show: "Approve USDC in wallet..."
      ↓
State: APPROVAL_PENDING
      │
      │ Wait for transaction confirmation
      ↓
State: APPROVED
      │
      │ Call: MicroLoan.contribute(amount)
      │ Show: "Confirm contribution in wallet..."
      ↓
State: CONTRIBUTING
      │
      │ Wait for transaction confirmation
      ↓
State: SUCCESS
      │
      │ Refetch loan data
      │ Show: "✓ Successfully funded!"
      │ Update UI with new totalFunded
      ↓
State: IDLE


Error Handling:
├── User rejects → State: IDLE
├── Insufficient balance → State: ERROR
├── Network error → State: ERROR (retry button)
└── Contract revert → State: ERROR (show reason)
```

---

## Integration Checklist by Priority

### 🔴 Critical Path (MVP - Days 1-5)
1. ✅ Deploy contracts to Base Sepolia
2. ⬜ Generate and copy ABIs
3. ⬜ Update environment variables
4. ⬜ Create type definitions
5. ⬜ Implement useMicroLoan hook
6. ⬜ Implement useUSDC hook
7. ⬜ Update LoanCard component
8. ⬜ Update LoanDetails component
9. ⬜ Update FundingForm component
10. ⬜ Test end-to-end funding flow

### 🟡 Important (Post-MVP - Days 6-8)
11. ⬜ Implement useLoans hook (subgraph)
12. ⬜ Create RepaymentSchedule component
13. ⬜ Add faucet button to navbar
14. ⬜ Create CreateLoanForm component
15. ⬜ Add loan creation flow
16. ⬜ Deploy and test subgraph

### 🟢 Nice-to-Have (Future)
17. ⬜ Borrower dashboard
18. ⬜ Lender dashboard
19. ⬜ Loan analytics
20. ⬜ Email notifications
21. ⬜ Social sharing
22. ⬜ Mobile app (React Native)

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                       │
└─────────────────────────────────────────────────────────────┘

Frontend Framework
├── Next.js 15 (App Router)
├── React 19
└── TypeScript 5

Blockchain Interaction
├── Wagmi 2.x (React hooks for Ethereum)
├── Viem (TypeScript Ethereum library)
└── OnchainKit (Coinbase components)

Wallet Connection
├── Farcaster App: OnchainKit Wallet
└── Web App: Privy Auth (social + wallet)

State Management
├── React hooks (useState, useEffect)
├── Wagmi cache (automatic)
└── TanStack Query (for API calls)

Data Sources
├── Smart Contracts (direct reads via Wagmi)
├── The Graph Subgraph (indexed data)
└── IPFS (Pinata gateway for metadata)

Styling
├── TailwindCSS 3.x
├── Heroicons
└── Custom components

Testing & Development
├── Forge (contract testing)
├── Base Sepolia (testnet)
├── Next.js dev server
└── Browser DevTools
```

---

## API Reference

### MicroLoanFactory Contract

```solidity
// Read Methods
function userLoans(address user) external view returns (address[] memory)
function getAllLoans() external view returns (address[] memory)

// Write Methods
function createLoan(
    address borrower,
    string memory metadataURI,
    uint256 principal,
    uint256 termPeriods,
    uint256 periodLength,
    uint256 firstDueDate,
    uint256 fundraisingDeadline
) external returns (address loanAddr)

function pause() external onlyOwner
function unpause() external onlyOwner
```

### MicroLoan Contract

```solidity
// Read Methods
function borrower() external view returns (address)
function principal() external view returns (uint256)
function termPeriods() external view returns (uint256)
function periodLength() external view returns (uint256)
function totalFunded() external view returns (uint256)
function fundraisingActive() external view returns (bool)
function active() external view returns (bool)
function completed() external view returns (bool)
function contributions(address) external view returns (uint256)
function isDefaulted() external view returns (bool)
function currentDueDate() external view returns (uint256)

// Write Methods
function contribute(uint256 amount) external
function closeFundraising() external
function cancelLoan() external
function disburse() external
function repay(uint256 amount) external
function claim() external
function refund() external
```

### TestUSDC Contract

```solidity
// Standard ERC20
function balanceOf(address) external view returns (uint256)
function allowance(address, address) external view returns (uint256)
function approve(address, uint256) external returns (bool)
function transfer(address, uint256) external returns (bool)

// Test-specific
function faucet(uint256 amount) external  // Max 1000 USDC
function mint(address, uint256) external
```

---

**Status**: Ready for implementation
**Next Step**: Start with Phase 1 - Contract ABIs & Configuration
**Support**: See FRONTEND_INTEGRATION_PLAN.md for detailed steps
