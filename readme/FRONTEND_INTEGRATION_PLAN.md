# Frontend Integration Plan: MicroLoan Contracts → Farcaster App

## Overview

Integrate the newly deployed MicroLoan smart contracts (Base Sepolia) with both the Farcaster Mini App and Web App frontends. This plan transitions from the old RBF Campaign contracts to the new zero-interest MicroLoan model.

---

## 📊 Current State Analysis

### Deployed Contracts (Base Sepolia)
- **TestUSDC**: `0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe`
- **MicroLoanFactory**: `0x747988d925e8eeC76CF1E143307630dD8BE4bFff`
- **Deployer**: `0x6F1e5BD44783327984f4723C87E0D2939524943B`

### Frontend Apps
1. **Farcaster Mini App** (`apps/farcaster/`) - Port 3002
   - Stack: Next.js 15, OnchainKit, Wagmi, Viem
   - Currently: Queries subgraph for "campaigns" with RBF model
   - Components: CampaignCard, CampaignDetails, FundingForm

2. **Web App** (`apps/web/`) - Port 3001
   - Stack: Next.js 15, Privy Auth, OnchainKit, Wagmi, Viem
   - Currently: Same RBF campaign structure
   - Has more features: credit scoring, Shopify integration

### Key Differences Between Old & New

| Feature | Old (RBF Campaign) | New (MicroLoan) |
|---------|-------------------|-----------------|
| Interest | Revenue-based (1.5x repayment) | Zero-interest (1.0x repayment) |
| Factory | RBFCampaignFactory | MicroLoanFactory |
| Model | Campaign with revenue share % | Loan with fixed periods |
| Repayment | Percentage of revenue | Fixed period payments |
| Terms | goalAmount, revenueShare, repaymentCap | principal, termPeriods, periodLength |
| State | isActive, goalReached, cancelled | fundraisingActive, active, completed |

---

## 🎯 Integration Plan

### Phase 1: Contract ABIs & Configuration (Day 1)

**1.1 Generate Contract ABIs**
```bash
cd contracts
forge build
# Copy ABIs from out/ directory
```

**Files to create:**
- `apps/farcaster/src/abi/MicroLoanFactory.json`
- `apps/farcaster/src/abi/MicroLoan.json`
- `apps/farcaster/src/abi/TestUSDC.json`
- `apps/web/src/abi/MicroLoanFactory.json`
- `apps/web/src/abi/MicroLoan.json`
- `apps/web/src/abi/TestUSDC.json`

**1.2 Update Configuration Files**

`apps/farcaster/.env.local`:
```bash
# Existing
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Add new contract addresses
NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS=0x747988d925e8eeC76CF1E143307630dD8BE4bFff
NEXT_PUBLIC_USDC_ADDRESS=0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe

# Optional: Keep old for backward compatibility
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=<old_address>
```

`apps/farcaster/src/lib/wagmi.ts`:
```typescript
export const MICROLOAN_FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_MICROLOAN_FACTORY_ADDRESS as `0x${string}`;
export const USDC_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;
```

**1.3 Update deployments.json**

Already done! File at `contracts/deployments.json` has the addresses.

---

### Phase 2: TypeScript Types (Day 1-2)

**2.1 Create Loan Types**

`apps/farcaster/src/types/loan.ts`:
```typescript
// Raw loan data from subgraph or contract
export type RawLoan = {
  id: string; // contract address
  loanId: string; // numeric ID
  borrower: string;
  metadataURI: string;
  principal: string; // bigint as string
  termPeriods: string;
  periodLength: string;
  firstDueDate: string;
  fundraisingDeadline: string;
  totalFunded: string;
  fundraisingActive: boolean;
  active: boolean;
  completed: boolean;
};

// Processed loan with metadata
export interface ProcessedLoan extends RawLoan {
  metadata: LoanMetadata | null;
}

// Metadata stored in IPFS
export interface LoanMetadata {
  title: string;
  description: string;
  image: string;
  borrowerName?: string;
  purpose?: string;
  businessDescription?: string;
}

// For display components
export interface LoanDetails {
  id: number;
  borrower: string;
  title: string;
  description: string;
  principal: bigint;
  termPeriods: number;
  periodLength: number;
  firstDueDate: bigint;
  fundraisingDeadline: bigint;
  totalFunded: bigint;
  fundraisingActive: boolean;
  active: boolean;
  completed: boolean;
  imageCID?: string;
  contributorCount?: bigint;
  metadata?: LoanMetadata;
}
```

**2.2 Update Existing Types**

Modify `apps/farcaster/src/hooks/useCampaign.ts`:
- Rename to `useLoan.ts`
- Update types to match new loan structure
- Keep backward compatibility with campaigns if needed

---

### Phase 3: Contract Interaction Hooks (Day 2-3)

**3.1 Create useMicroLoan Hook**

`apps/farcaster/src/hooks/useMicroLoan.ts`:
```typescript
'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MICROLOAN_FACTORY_ADDRESS } from '@/lib/wagmi';
import MicroLoanFactoryABI from '@/abi/MicroLoanFactory.json';
import MicroLoanABI from '@/abi/MicroLoan.json';

// Read loan details from factory
export const useFactoryLoans = () => {
  const { data, isLoading, error } = useReadContract({
    address: MICROLOAN_FACTORY_ADDRESS,
    abi: MicroLoanFactoryABI,
    functionName: 'getAllLoans',
  });

  return { loans: data, isLoading, error };
};

// Read specific loan details
export const useLoanDetails = (loanAddress: `0x${string}`) => {
  // Get borrower
  const { data: borrower } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI,
    functionName: 'borrower',
  });

  // Get principal
  const { data: principal } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI,
    functionName: 'principal',
  });

  // Get term periods
  const { data: termPeriods } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI,
    functionName: 'termPeriods',
  });

  // ... more reads

  return {
    borrower,
    principal,
    termPeriods,
    // ... more fields
  };
};

// Contribute to a loan
export const useContributeToLoan = () => {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const contribute = async (loanAddress: `0x${string}`, amount: bigint) => {
    writeContract({
      address: loanAddress,
      abi: MicroLoanABI,
      functionName: 'contribute',
      args: [amount],
    });
  };

  return { contribute, isLoading, isSuccess, hash };
};

// Create a new loan
export const useCreateLoan = () => {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createLoan = async (params: {
    borrower: `0x${string}`;
    metadataURI: string;
    principal: bigint;
    termPeriods: number;
    periodLength: number;
    firstDueDate: number;
    fundraisingDeadline: number;
  }) => {
    writeContract({
      address: MICROLOAN_FACTORY_ADDRESS,
      abi: MicroLoanFactoryABI,
      functionName: 'createLoan',
      args: [
        params.borrower,
        params.metadataURI,
        params.principal,
        params.termPeriods,
        params.periodLength,
        params.firstDueDate,
        params.fundraisingDeadline,
      ],
    });
  };

  return { createLoan, isLoading, isSuccess, hash };
};
```

**3.2 Create useUSDC Hook**

`apps/farcaster/src/hooks/useUSDC.ts`:
```typescript
'use client';

import { useReadContract, useWriteContract } from 'wagmi';
import { USDC_CONTRACT_ADDRESS } from '@/lib/wagmi';
import TestUSDCABI from '@/abi/TestUSDC.json';

export const useUSDCBalance = (address: `0x${string}` | undefined) => {
  const { data: balance, isLoading } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: TestUSDCABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return { balance, isLoading };
};

export const useUSDCApprove = () => {
  const { writeContract, data: hash } = useWriteContract();

  const approve = async (spender: `0x${string}`, amount: bigint) => {
    writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: TestUSDCABI,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  return { approve, hash };
};

export const useUSDCFaucet = () => {
  const { writeContract, data: hash } = useWriteContract();

  const faucet = async (amount: bigint = BigInt(1000e6)) => {
    writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: TestUSDCABI,
      functionName: 'faucet',
      args: [amount],
    });
  };

  return { faucet, hash };
};
```

---

### Phase 4: Update Components (Day 3-5)

**4.1 Update LoanCard (formerly CampaignCard)**

`apps/farcaster/src/components/LoanCard.tsx`:
```typescript
// Changes needed:
// 1. Replace goalAmount → principal
// 2. Replace totalRaised → totalFunded
// 3. Replace revenueShare% → "Zero Interest"
// 4. Replace repaymentCap (1.5x) → "1.0x repayment"
// 5. Update progress calculation
// 6. Show term length (e.g., "12 months")

export function LoanCard({ loanDetails }: LoanCardProps) {
  const progressPercentage =
    (Number(loanDetails.totalFunded) / Number(loanDetails.principal)) * 100;

  return (
    <Link href={`/loan/${loanDetails.id}`}>
      {/* ... */}
      <div className="flex items-center justify-between">
        <span className="text-green-600 font-semibold">Zero Interest</span>
        <span>{loanDetails.termPeriods} periods</span>
        <span>1.0x cap</span>
      </div>
    </Link>
  );
}
```

**4.2 Update LoanDetails (formerly CampaignDetails)**

`apps/farcaster/src/components/LoanDetails.tsx`:
```typescript
// New fields to display:
// - Term: "12 periods × 30 days = 12 months"
// - First due date: formatDate(firstDueDate)
// - Fundraising deadline: formatDate(fundraisingDeadline)
// - Period length: "30 days per period"
// - Zero interest badge
// - Repayment schedule visualization

export function LoanDetails({ loan }: { loan: LoanDetails }) {
  return (
    <div>
      {/* Hero section with image */}

      {/* Loan stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Principal" value={formatUSDC(loan.principal)} />
        <StatCard label="Funded" value={formatUSDC(loan.totalFunded)} />
        <StatCard label="Term" value={`${loan.termPeriods} periods`} />
        <StatCard label="Interest" value="0%" className="text-green-600" />
      </div>

      {/* Repayment schedule */}
      <RepaymentSchedule
        principal={loan.principal}
        termPeriods={loan.termPeriods}
        periodLength={loan.periodLength}
        firstDueDate={loan.firstDueDate}
      />

      {/* Contribute button */}
      <ContributeButton loanAddress={loan.id} />
    </div>
  );
}
```

**4.3 Create FundingForm Component**

`apps/farcaster/src/components/FundingForm.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useContributeToLoan } from '@/hooks/useMicroLoan';
import { useUSDCApprove, useUSDCBalance } from '@/hooks/useUSDC';

export function FundingForm({ loanAddress }: { loanAddress: `0x${string}` }) {
  const { address } = useAccount();
  const { balance } = useUSDCBalance(address);
  const { approve } = useUSDCApprove();
  const { contribute, isLoading } = useContributeToLoan();

  const [amount, setAmount] = useState('');

  const handleFund = async () => {
    const amountInWei = BigInt(parseFloat(amount) * 1e6);

    // Step 1: Approve USDC
    await approve(loanAddress, amountInWei);

    // Step 2: Contribute to loan
    await contribute(loanAddress, amountInWei);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Fund This Loan</h3>

      {/* Amount input */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in USDC"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Balance display */}
      <p className="text-sm text-gray-600 mb-4">
        Your balance: {balance ? (Number(balance) / 1e6).toFixed(2) : '0'} USDC
      </p>

      {/* Fund button */}
      <button
        onClick={handleFund}
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {isLoading ? 'Processing...' : 'Fund Loan'}
      </button>

      {/* Zero interest badge */}
      <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-center">
        <p className="text-sm text-green-800 font-medium">
          Zero Interest - You'll receive exactly what you contribute
        </p>
      </div>
    </div>
  );
}
```

**4.4 Create RepaymentSchedule Component**

`apps/farcaster/src/components/RepaymentSchedule.tsx`:
```typescript
export function RepaymentSchedule({
  principal,
  termPeriods,
  periodLength,
  firstDueDate
}: {
  principal: bigint;
  termPeriods: number;
  periodLength: number;
  firstDueDate: bigint;
}) {
  const periodAmount = principal / BigInt(termPeriods);
  const periods = Array.from({ length: termPeriods }, (_, i) => {
    const dueDate = Number(firstDueDate) + (i * periodLength);
    return {
      period: i + 1,
      amount: periodAmount,
      dueDate: new Date(dueDate * 1000),
    };
  });

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-3">Repayment Schedule</h4>
      <div className="space-y-2">
        {periods.slice(0, 3).map((period) => (
          <div key={period.period} className="flex justify-between p-2 bg-gray-50 rounded">
            <span>Period {period.period}</span>
            <span>{formatUSDC(period.amount)}</span>
            <span className="text-sm text-gray-600">
              {period.dueDate.toLocaleDateString()}
            </span>
          </div>
        ))}
        {periods.length > 3 && (
          <p className="text-sm text-gray-600 text-center">
            +{periods.length - 3} more periods
          </p>
        )}
      </div>
    </div>
  );
}
```

---

### Phase 5: Update Pages (Day 5-6)

**5.1 Update Homepage**

`apps/farcaster/src/app/page.tsx`:
```typescript
'use client';

import { LoanList } from '@/components/LoanList';
import { useFactoryLoans } from '@/hooks/useMicroLoan';

export default function HomePage() {
  const { loans, isLoading } = useFactoryLoans();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Active Loans</h1>
      {isLoading ? (
        <p>Loading loans...</p>
      ) : (
        <LoanList loans={loans} />
      )}
    </div>
  );
}
```

**5.2 Update Loan Detail Page**

`apps/farcaster/src/app/loan/[id]/page.tsx`:
```typescript
'use client';

import { useParams } from 'next/navigation';
import { LoanDetails } from '@/components/LoanDetails';
import { useLoanDetails } from '@/hooks/useMicroLoan';

export default function LoanDetailPage() {
  const params = useParams();
  const loanId = params.id as string;

  const { loan, isLoading } = useLoanDetails(loanId);

  if (isLoading) return <div>Loading...</div>;
  if (!loan) return <div>Loan not found</div>;

  return (
    <div className="container mx-auto p-4">
      <LoanDetails loan={loan} />
    </div>
  );
}
```

**5.3 Create Loan Funding Page**

`apps/farcaster/src/app/loan/[id]/fund/page.tsx`:
```typescript
'use client';

import { useParams } from 'next/navigation';
import { FundingForm } from '@/components/FundingForm';
import { useLoanDetails } from '@/hooks/useMicroLoan';

export default function LoanFundingPage() {
  const params = useParams();
  const loanAddress = params.id as `0x${string}`;

  const { loan } = useLoanDetails(loanAddress);

  return (
    <div className="container mx-auto p-4">
      {loan && (
        <>
          <h1 className="text-2xl font-bold mb-4">{loan.metadata?.title}</h1>
          <FundingForm loanAddress={loanAddress} />
        </>
      )}
    </div>
  );
}
```

---

### Phase 6: Testing & Faucet Integration (Day 6-7)

**6.1 Add Faucet Button to Navbar**

`apps/farcaster/src/components/Navbar.tsx`:
```typescript
import { useUSDCFaucet } from '@/hooks/useUSDC';

export function Navbar() {
  const { faucet } = useUSDCFaucet();

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b">
      <Link href="/">LendFriend</Link>

      <div className="flex gap-4">
        <button
          onClick={() => faucet()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Test USDC
        </button>
        <ConnectButton />
      </div>
    </nav>
  );
}
```

**6.2 Add Testing Instructions**

Create `apps/farcaster/TESTING.md`:
```markdown
# Testing MicroLoan Integration on Base Sepolia

## Setup
1. Connect wallet to Base Sepolia
2. Get test ETH from Base Sepolia faucet
3. Click "Get Test USDC" in navbar (mints 1000 USDC)

## Test Flow
1. Browse loans on homepage
2. Click a loan to see details
3. Click "Fund Loan" button
4. Enter amount (max 1000 USDC from faucet)
5. Approve USDC (first transaction)
6. Contribute to loan (second transaction)
7. Verify contribution shows in loan details

## Contract Addresses
- Factory: 0x747988d925e8eeC76CF1E143307630dD8BE4bFff
- TestUSDC: 0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe
```

---

### Phase 7: Subgraph Integration (Day 7-8)

**7.1 Create or Update Subgraph**

If you have an existing subgraph, update it to index MicroLoan events:

`subgraph/schema.graphql`:
```graphql
type Loan @entity {
  id: ID! # loan contract address
  loanId: String! # numeric ID
  borrower: Bytes!
  metadataURI: String!
  principal: BigInt!
  termPeriods: Int!
  periodLength: Int!
  firstDueDate: BigInt!
  fundraisingDeadline: BigInt!
  totalFunded: BigInt!
  fundraisingActive: Boolean!
  active: Boolean!
  completed: Boolean!
  contributions: [Contribution!]! @derivedFrom(field: "loan")
  createdAt: BigInt!
}

type Contribution @entity {
  id: ID!
  loan: Loan!
  contributor: Bytes!
  amount: BigInt!
  timestamp: BigInt!
}
```

`subgraph/src/microloan-factory.ts`:
```typescript
export function handleLoanCreated(event: LoanCreatedEvent): void {
  let loan = new Loan(event.params.loan.toHexString());
  loan.loanId = event.params.loanId.toString();
  loan.borrower = event.params.borrower;
  loan.principal = event.params.principal;
  loan.termPeriods = event.params.termPeriods;
  // ... set other fields
  loan.save();
}

export function handleContributed(event: ContributedEvent): void {
  let loan = Loan.load(event.address.toHexString());
  if (loan) {
    loan.totalFunded = loan.totalFunded.plus(event.params.amount);
    loan.save();
  }

  let contribution = new Contribution(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  contribution.loan = event.address.toHexString();
  contribution.contributor = event.params.contributor;
  contribution.amount = event.params.amount;
  contribution.timestamp = event.block.timestamp;
  contribution.save();
}
```

**7.2 Update Frontend to Query Subgraph**

`apps/farcaster/src/hooks/useLoans.ts`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { gql } from 'graphql-tag';
import { getClient } from '@/lib/apollo';

const GET_LOANS = gql`
  query GetLoans {
    loans(where: { fundraisingActive: true }, orderBy: createdAt, orderDirection: desc) {
      id
      loanId
      borrower
      metadataURI
      principal
      termPeriods
      periodLength
      totalFunded
      fundraisingActive
    }
  }
`;

export const useLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoans() {
      const { data } = await getClient().query({
        query: GET_LOANS,
        fetchPolicy: 'network-only',
      });
      setLoans(data.loans);
      setLoading(false);
    }
    fetchLoans();
  }, []);

  return { loans, loading };
};
```

---

### Phase 8: Web App Integration (Day 8-10)

**8.1 Replicate Farcaster Changes**

The Web app (`apps/web/`) should follow the same pattern as Farcaster app:
- Copy all ABIs
- Update `.env.local`
- Copy hooks from `apps/farcaster/src/hooks/`
- Copy components from `apps/farcaster/src/components/`
- Update pages

**8.2 Additional Web App Features**

Since the web app has more features, also integrate:
- Privy authentication with MicroLoan
- Create loan flow (form to deploy new loan)
- Borrower dashboard (manage loan, disburse funds, make repayments)
- Lender dashboard (track contributions, claim returns)

---

## 📝 Detailed Task Checklist

### Contracts & ABIs
- [ ] Generate ABIs from compiled contracts
- [ ] Copy ABIs to both `apps/farcaster/src/abi/` and `apps/web/src/abi/`
- [ ] Verify ABI compatibility with frontend hooks

### Configuration
- [ ] Update `apps/farcaster/.env.local` with new addresses
- [ ] Update `apps/web/.env.local` with new addresses
- [ ] Update `apps/farcaster/src/lib/wagmi.ts`
- [ ] Update `apps/web/src/lib/wagmi.ts`

### Types & Interfaces
- [ ] Create `apps/farcaster/src/types/loan.ts`
- [ ] Create `apps/web/src/types/loan.ts`
- [ ] Update all existing campaign types to loan types

### Hooks
- [ ] Create `useMicroLoan.ts` hook
- [ ] Create `useUSDC.ts` hook
- [ ] Create `useLoans.ts` hook (subgraph)
- [ ] Update/create `useLoanDetails.ts` hook
- [ ] Test all hooks with Base Sepolia

### Components (Farcaster App)
- [ ] Update `CampaignCard.tsx` → `LoanCard.tsx`
- [ ] Update `CampaignDetails.tsx` → `LoanDetails.tsx`
- [ ] Update `CampaignList.tsx` → `LoanList.tsx`
- [ ] Update `FundingForm.tsx`
- [ ] Create `RepaymentSchedule.tsx`
- [ ] Update `Navbar.tsx` with faucet button

### Components (Web App)
- [ ] Copy all components from Farcaster app
- [ ] Add `CreateLoanForm.tsx`
- [ ] Add `BorrowerDashboard.tsx`
- [ ] Add `LenderDashboard.tsx`
- [ ] Add `DisburseButton.tsx`
- [ ] Add `RepayButton.tsx`

### Pages (Farcaster App)
- [ ] Update `app/page.tsx` (homepage)
- [ ] Update `app/campaign/[id]/page.tsx` → `app/loan/[id]/page.tsx`
- [ ] Update `app/campaign/[id]/fund/page.tsx` → `app/loan/[id]/fund/page.tsx`

### Pages (Web App)
- [ ] Update homepage
- [ ] Update loan detail page
- [ ] Update loan funding page
- [ ] Create `app/create-loan/page.tsx`
- [ ] Create `app/dashboard/borrower/page.tsx`
- [ ] Create `app/dashboard/lender/page.tsx`

### Testing
- [ ] Test faucet minting TestUSDC
- [ ] Test creating a loan via factory
- [ ] Test contributing to a loan
- [ ] Test USDC approval flow
- [ ] Test loan detail display
- [ ] Test repayment schedule rendering
- [ ] Test all responsive layouts (mobile/desktop)

### Subgraph (Optional but Recommended)
- [ ] Update subgraph schema
- [ ] Update subgraph mappings
- [ ] Deploy subgraph to The Graph
- [ ] Update frontend to query new subgraph

### Documentation
- [ ] Update README with new contract addresses
- [ ] Create TESTING.md for testers
- [ ] Update API documentation
- [ ] Create user guide for zero-interest loans

### Deployment
- [ ] Deploy Farcaster app to Vercel
- [ ] Deploy Web app to Vercel
- [ ] Test on production
- [ ] Monitor for errors

---

## 🚀 Quick Start Commands

```bash
# 1. Copy contract ABIs
cd contracts
forge build
cp out/MicroLoanFactory.sol/MicroLoanFactory.json ../apps/farcaster/src/abi/
cp out/MicroLoan.sol/MicroLoan.json ../apps/farcaster/src/abi/
cp out/TestUSDC.sol/TestUSDC.json ../apps/farcaster/src/abi/

# 2. Update environment
cd ../apps/farcaster
cp .env.local .env.local.backup
# Edit .env.local with new addresses

# 3. Install dependencies (if needed)
npm install

# 4. Start development
npm run dev

# 5. Test in browser
open http://localhost:3002
```

---

## 📊 Migration Strategy

### Option A: Hard Cutover (Recommended for MVP)
- Remove all old RBF campaign code
- Replace with new MicroLoan contracts
- Update all components at once
- Faster, cleaner codebase

### Option B: Gradual Migration
- Keep old RBF code
- Add new MicroLoan code alongside
- Feature flag to switch between models
- Allows testing both systems
- More complex codebase

**Recommendation**: Use Option A (Hard Cutover) since this is an MVP and you're on testnet.

---

## 🔍 Key Changes Summary

### Data Model Changes
- `campaign` → `loan`
- `goalAmount` → `principal`
- `totalRaised` → `totalFunded`
- `revenueShare` → N/A (zero interest)
- `repaymentCap` → Always 1.0x
- `deadline` → `fundraisingDeadline`
- Added: `termPeriods`, `periodLength`, `firstDueDate`

### State Management Changes
- `isActive` → `fundraisingActive` + `active`
- `goalReached` → Check if `totalFunded >= principal`
- `cancelled` → Check `!fundraisingActive && totalFunded < principal`

### User Flow Changes
1. **Old**: Browse campaigns → Fund → Receive revenue share payments
2. **New**: Browse loans → Fund → Borrower repays in fixed periods → Receive exact contribution back

---

## 🎨 UI/UX Updates

### Visual Identity
- Emphasize "Zero Interest" throughout
- Green color scheme for trust/sustainability
- Clear repayment schedule visualization
- Simple language: "loan" not "campaign"

### Copy Changes
- "Fund a Loan" not "Back a Campaign"
- "Zero Interest Lending" not "Revenue-Based Financing"
- "Support a Business" not "Invest in Growth"
- "Community Support" not "Returns Expected"

### New UI Elements
- Zero interest badge (green)
- Repayment schedule table/chart
- Funding progress with clear 1.0x cap
- Period countdown (e.g., "12 months")

---

## 📞 Support & Next Steps

After completing this plan:
1. Test thoroughly on Base Sepolia
2. Get feedback from beta users
3. Fix bugs and iterate
4. Deploy subgraph for better data queries
5. Consider mainnet deployment
6. Add analytics tracking

---

**Estimated Time**: 8-10 days for full integration (both apps)
**Priority**: Start with Farcaster app (simpler), then Web app
**Testing**: Allocate 20% of time for thorough testing
