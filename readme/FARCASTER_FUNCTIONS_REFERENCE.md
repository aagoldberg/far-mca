# Farcaster App - Complete Functions Reference

This document lists ALL accessible functions from the MicroLoan contracts that the Farcaster app can use, organized by user type and use case.

---

## 📋 Contract Functions Overview

### MicroLoanFactory Contract
**Address**: `0x747988d925e8eeC76CF1E143307630dD8BE4bFff`

### MicroLoan Contract
**Addresses**: Individual loans deployed by the factory

### TestUSDC Contract
**Address**: `0x2d04a1dF447A9265Bc936747f1CEe7126e99aaFe`

---

## 🎯 Functions by User Flow

### 1. BROWSING LOANS (All Users)

#### Get All Loans
```typescript
// MicroLoanFactory
getLoans(): address[]
```
**Purpose**: Get all loan contract addresses
**Returns**: Array of loan addresses
**Use in**: Homepage loan list

**Hook Example**:
```typescript
const { data: loanAddresses } = useReadContract({
  address: MICROLOAN_FACTORY_ADDRESS,
  abi: MicroLoanFactoryABI,
  functionName: 'getLoans',
});
```

---

#### Get Loans by Borrower
```typescript
// MicroLoanFactory
getBorrowerLoans(address borrower): address[]
```
**Purpose**: Get all loans for a specific borrower
**Returns**: Array of loan addresses
**Use in**: Borrower dashboard

---

#### Read Loan Details (Multiple Functions)
```typescript
// MicroLoan - Basic Info
borrower(): address
principal(): uint256
termPeriods(): uint256
periodLength(): uint256
firstDueDate(): uint256
fundraisingDeadline(): uint256
metadataURI(): string

// MicroLoan - State
fundraisingActive(): bool
active(): bool
completed(): bool
disbursed(): bool
totalFunded(): uint256

// MicroLoan - Calculations
perPeriodPrincipal(): uint256       // Amount per period
contributorsCount(): uint256         // Number of contributors
currentDueDate(): uint256           // Next payment due date
defaultDeadline(): uint256          // Default deadline with grace
isDefaulted(): bool                 // Is loan in default?
```

**Use in**: Loan detail pages, cards, dashboards

**Hook Example**:
```typescript
export const useLoanDetails = (loanAddress: `0x${string}`) => {
  const { data: borrower } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI,
    functionName: 'borrower',
  });

  const { data: principal } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI,
    functionName: 'principal',
  });

  const { data: totalFunded } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI,
    functionName: 'totalFunded',
  });

  const { data: fundraisingActive } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI,
    functionName: 'fundraisingActive',
  });

  // ... read all other fields

  return { borrower, principal, totalFunded, fundraisingActive, ... };
};
```

---

### 2. FUNDING A LOAN (Lenders/Contributors)

#### Check Contribution Amount
```typescript
// MicroLoan
contributions(address contributor): uint256
```
**Purpose**: Check how much a user has contributed
**Returns**: Contribution amount in USDC (6 decimals)
**Use in**: Profile, dashboard, before claiming

---

#### Check Claimable Amount
```typescript
// MicroLoan
claimableAmount(address contributor): uint256
```
**Purpose**: Calculate how much a contributor can claim
**Returns**: Claimable amount based on repayments
**Use in**: Claim button, dashboard

---

#### Contribute to Loan
```typescript
// MicroLoan
contribute(uint256 amount): void
```
**Purpose**: Fund a loan during fundraising
**Requires**:
- USDC approval first
- Loan fundraisingActive == true
- totalFunded + amount <= principal

**Use in**: Funding form

**Hook Example**:
```typescript
export const useContributeToLoan = () => {
  const { writeContract, data: hash } = useWriteContract();

  const contribute = async (
    loanAddress: `0x${string}`,
    amount: bigint
  ) => {
    writeContract({
      address: loanAddress,
      abi: MicroLoanABI,
      functionName: 'contribute',
      args: [amount],
    });
  };

  return { contribute, hash };
};
```

**Complete Flow**:
```typescript
// Step 1: Approve USDC
await writeContract({
  address: USDC_ADDRESS,
  abi: TestUSDCABI,
  functionName: 'approve',
  args: [loanAddress, amount],
});

// Step 2: Contribute
await writeContract({
  address: loanAddress,
  abi: MicroLoanABI,
  functionName: 'contribute',
  args: [amount],
});
```

---

#### Claim Returns
```typescript
// MicroLoan
claim(): void
```
**Purpose**: Claim your share of repayments
**Requires**:
- Has contributions > 0
- Repayments have been made

**Use in**: Lender dashboard, claim button

---

#### Request Refund
```typescript
// MicroLoan
refund(): void
```
**Purpose**: Get refund if loan cancelled
**Requires**:
- Loan cancelled
- Has contributions > 0

**Use in**: Loan detail (if cancelled)

---

### 3. CREATING A LOAN (Borrowers)

#### Create New Loan
```typescript
// MicroLoanFactory
createLoan(
  address borrower,
  string metadataURI,
  uint256 principal,
  uint256 termPeriods,
  uint256 periodLength,
  uint256 firstDueDate,
  uint256 fundraisingDeadline
): address
```
**Purpose**: Deploy a new loan contract
**Returns**: Address of new loan
**Requires**: Factory not paused

**Use in**: Create loan form

**Hook Example**:
```typescript
export const useCreateLoan = () => {
  const { writeContract, data: hash } = useWriteContract();

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

  return { createLoan, hash };
};
```

---

### 4. MANAGING A LOAN (Borrowers Only)

#### Disburse Funds
```typescript
// MicroLoan
disburse(): void
```
**Purpose**: Withdraw funded amount after successful fundraising
**Requires**:
- caller == borrower
- totalFunded >= principal
- Not yet disbursed

**Use in**: Borrower dashboard

---

#### Make Repayment
```typescript
// MicroLoan
repay(uint256 amount): void
```
**Purpose**: Make a repayment on the loan
**Requires**:
- USDC approval
- Loan active

**Use in**: Borrower dashboard, repayment form

**Hook Example**:
```typescript
export const useRepayLoan = () => {
  const { writeContract } = useWriteContract();

  const repay = async (
    loanAddress: `0x${string}`,
    amount: bigint
  ) => {
    // Step 1: Approve USDC
    await writeContract({
      address: USDC_ADDRESS,
      abi: TestUSDCABI,
      functionName: 'approve',
      args: [loanAddress, amount],
    });

    // Step 2: Repay
    await writeContract({
      address: loanAddress,
      abi: MicroLoanABI,
      functionName: 'repay',
      args: [amount],
    });
  };

  return { repay };
};
```

---

#### Cancel Fundraising
```typescript
// MicroLoan
cancelFundraise(): void
```
**Purpose**: Cancel loan before reaching goal
**Requires**:
- caller == borrower
- fundraisingActive == true
- Not yet disbursed

**Use in**: Borrower dashboard (cancel button)

---

#### Cancel After Deadline
```typescript
// MicroLoan
cancelIfNoDisburse(): void
```
**Purpose**: Cancel if borrower didn't disburse in time
**Requires**:
- Past disbursement window
- Funded but not disbursed

**Use in**: Anyone can call (safety mechanism)

---

### 5. USDC OPERATIONS (All Users)

#### Check Balance
```typescript
// TestUSDC
balanceOf(address account): uint256
```
**Purpose**: Check USDC balance
**Returns**: Balance in base units (6 decimals)

**Hook Example**:
```typescript
export const useUSDCBalance = (address: `0x${string}` | undefined) => {
  const { data: balance } = useReadContract({
    address: USDC_ADDRESS,
    abi: TestUSDCABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return { balance };
};
```

---

#### Approve USDC
```typescript
// TestUSDC
approve(address spender, uint256 amount): bool
```
**Purpose**: Approve loan contract to spend USDC
**Required before**: contribute() or repay()

---

#### Mint Test USDC (Testnet Only)
```typescript
// TestUSDC
faucet(uint256 amount): void
```
**Purpose**: Mint test USDC (max 1000 USDC per call)
**Use in**: Navbar faucet button, testing

**Hook Example**:
```typescript
export const useUSDCFaucet = () => {
  const { writeContract } = useWriteContract();

  const faucet = async (amount: bigint = BigInt(1000e6)) => {
    writeContract({
      address: USDC_ADDRESS,
      abi: TestUSDCABI,
      functionName: 'faucet',
      args: [amount],
    });
  };

  return { faucet };
};
```

---

## 🔍 Read vs Write Functions

### Read Functions (Free - No Gas)
All `view` functions can be called for free:
- `getLoans()`
- `getBorrowerLoans()`
- `borrower()`, `principal()`, etc.
- `contributions()`
- `claimableAmount()`
- `balanceOf()`
- `isDefaulted()`
- `currentDueDate()`

### Write Functions (Require Gas)
These modify state and cost gas:
- `createLoan()`
- `contribute()`
- `disburse()`
- `repay()`
- `claim()`
- `refund()`
- `cancelFundraise()`
- `approve()`
- `faucet()`

---

## 📱 Farcaster App Implementation Checklist

### Essential Functions (MVP)
- [x] ✅ `getLoans()` - Browse loans
- [x] ✅ `borrower()`, `principal()`, `totalFunded()` - Display loan info
- [x] ✅ `fundraisingActive()` - Check if can fund
- [x] ✅ `contribute()` - Fund a loan
- [x] ✅ `balanceOf()` - Show USDC balance
- [x] ✅ `approve()` - Approve USDC spending
- [x] ✅ `faucet()` - Get test USDC

### Important Functions (Post-MVP)
- [ ] ⏳ `createLoan()` - Create new loan
- [ ] ⏳ `claimableAmount()` - Check returns
- [ ] ⏳ `claim()` - Claim returns
- [ ] ⏳ `getBorrowerLoans()` - Borrower dashboard
- [ ] ⏳ `disburse()` - Withdraw funds
- [ ] ⏳ `repay()` - Make repayments

### Advanced Functions
- [ ] 🔮 `currentDueDate()` - Payment schedule
- [ ] 🔮 `isDefaulted()` - Default status
- [ ] 🔮 `defaultDeadline()` - Grace period
- [ ] 🔮 `cancelFundraise()` - Cancel loan
- [ ] 🔮 `refund()` - Get refund
- [ ] 🔮 `contributorsCount()` - Stats

---

## 🎯 User Role Matrix

| Function | Lender | Borrower | Anyone |
|----------|--------|----------|--------|
| `getLoans()` | ✅ | ✅ | ✅ |
| `contribute()` | ✅ | ✅ | ✅ |
| `claim()` | ✅ | ❌ | ❌ |
| `createLoan()` | ❌ | ✅ | ❌ |
| `disburse()` | ❌ | ✅ | ❌ |
| `repay()` | ❌ | ✅ | ❌ |
| `cancelFundraise()` | ❌ | ✅ | ❌ |
| `cancelIfNoDisburse()` | ✅ | ✅ | ✅ |
| `faucet()` | ✅ | ✅ | ✅ |

---

## 💡 Common Patterns

### Pattern 1: Approve-Then-Execute
Many operations require USDC approval first:
```typescript
// Always approve before contribute/repay
await approve(loanAddress, amount);
await contribute(amount);  // or repay(amount)
```

### Pattern 2: Check-Before-Write
Always read state before writing:
```typescript
// Check if loan is fundraising
const fundraisingActive = await readContract({
  functionName: 'fundraisingActive'
});

if (fundraisingActive) {
  // Then contribute
  await contribute(amount);
}
```

### Pattern 3: Calculate-Then-Display
Use view functions for UI:
```typescript
// Get claimable amount
const claimable = await claimableAmount(userAddress);

// Display button only if claimable > 0
{claimable > 0n && <ClaimButton />}
```

---

## 🚨 Important Notes

### Gas Requirements
- All write functions need ETH for gas
- Read functions are free
- Approve + Contribute = 2 transactions

### USDC Decimals
- USDC has 6 decimals (not 18!)
- 1 USDC = 1,000,000 (1e6)
- Always multiply by 1e6 when sending amounts

### Function Access
- Some functions restricted to borrower only
- Factory functions available to all
- Loan functions check caller permissions

### State Transitions
```
Fundraising → Funded → Disbursed → Repaying → Completed
     ↓
  Cancelled
```

---

## 📚 Complete Hook Library

All hooks you need to implement:

### Read Hooks
```typescript
useLoans()              // Get all loans
useLoanDetails()        // Get loan info
useUSDCBalance()        // Get USDC balance
useContributions()      // Get user contributions
useClaimable()          // Get claimable amount
```

### Write Hooks
```typescript
useCreateLoan()         // Create new loan
useContribute()         // Fund a loan
useDisburse()          // Withdraw funds
useRepay()             // Make repayment
useClaim()             // Claim returns
useRefund()            // Get refund
useUSDCApprove()       // Approve USDC
useUSDCFaucet()        // Mint test USDC
```

---

## ✅ Verification Checklist

Before deploying, verify:
- [ ] All essential read functions accessible
- [ ] All essential write functions accessible
- [ ] USDC approval flow implemented
- [ ] Proper error handling for reverts
- [ ] Gas estimation for transactions
- [ ] Loading states during transactions
- [ ] Success/failure notifications
- [ ] Contract addresses configured
- [ ] ABIs copied to project
- [ ] Types match Solidity signatures

---

**All functions are accessible! ✅**

The Farcaster app has full access to all necessary contract functions for:
- Browsing loans
- Funding loans
- Creating loans
- Managing loans
- Claiming returns
- USDC operations

Refer to Phase 3 in [FRONTEND_INTEGRATION_PLAN.md](./FRONTEND_INTEGRATION_PLAN.md) for implementation details.
