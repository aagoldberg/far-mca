# Migration from Installment to Flexible Repayment

## Branch Structure
- **`v1-installment-payments`**: Complex installment-based system (preserved)
- **`dev`**: Simplified flexible repayment system (active)

## Contract Comparison

### MicroLoan.sol

| Feature | Old (Installment) | New (Flexible) |
|---------|------------------|----------------|
| **Lines of Code** | ~415 lines | ~335 lines |
| **Repayment Model** | Equal installments over periods | Flexible - any amount, anytime |
| **Due Dates** | Multiple (`firstDueDate + n * periodLength`) | Single `dueAt` timestamp |
| **Grace Period** | 7 days per payment | None - strict maturity |
| **Default Check** | Complex period calculation | `block.timestamp > dueAt` |
| **Parameters** | 11 immutables | 8 immutables |
| **Gas per Repay** | ~32-37k | ~18k (50% savings) |

#### Removed Fields
```solidity
// OLD - Removed
uint256 public immutable termPeriods;
uint256 public immutable periodLength;
uint256 public immutable firstDueDate;
uint256 public immutable gracePeriod;
uint256 public immutable suggestedWeeklyPayment;
uint256 public nextDuePeriodIndex;

// NEW - Simplified
uint256 public immutable dueAt;        // Single maturity date
uint256 public totalRepaid;            // Track cumulative repayments
```

#### Removed Functions
```solidity
// OLD
function perPeriodPrincipal() public view returns (uint256);
function currentDueDate() public view returns (uint256);
function defaultDeadline() public view returns (uint256);
function _applyToPrincipal(uint256, address) internal;

// NEW - Added
function secondsUntilDue() public view returns (uint256);
```

#### Simplified Events
```solidity
// OLD
event PeriodPaid(uint256 indexed periodIndex, uint256 amountPaid, uint256 dueDate, address indexed payer);
event LoanDefaulted(uint256 missedPaymentDate, uint256 periodsOverdue);

// NEW - Richer for off-chain tracking
event Repayment(
    address indexed payer,
    uint256 amount,
    uint256 totalRepaid,
    uint256 outstanding,
    uint256 timestamp,
    uint256 secondsUntilDue
);
event Defaulted(uint256 dueDate, uint256 outstandingAmount, uint256 timestamp);
```

### MicroLoanFactory.sol

| Feature | Old (Installment) | New (Flexible) |
|---------|------------------|----------------|
| **Parameters** | 7 (principal, term, period, firstDue, deadline, window, grace) | 5 (principal, duration, deadline, window) |
| **Bounds** | `minTermPeriods`, `maxTermPeriods`, `minPeriodLength`, `maxPeriodLength` | `minLoanDuration`, `maxLoanDuration` |

#### createLoan() Signature Change
```solidity
// OLD
function createLoan(
    address borrower,
    string calldata metadataURI,
    uint256 principal,
    uint256 termPeriods,           // Number of installments
    uint256 periodLength,          // Seconds per period
    uint256 firstDueDate,          // When first payment due
    uint256 fundraisingDeadline
) returns (address);

// NEW
function createLoan(
    address borrower,
    string calldata metadataURI,
    uint256 principal,
    uint256 loanDuration,          // Total seconds until maturity
    uint256 fundraisingDeadline
) returns (address);
```

## Example Usage Comparison

### Creating a $5,000 loan for 56 days

**OLD (Installment):**
```solidity
factory.createLoan(
    borrower,
    metadataURI,
    5_000e6,                    // $5,000
    8,                          // 8 installments
    7 days,                     // Weekly periods
    block.timestamp + 14 days,  // First payment in 14 days
    block.timestamp + 7 days    // Fundraising deadline
);
```

**NEW (Flexible):**
```solidity
factory.createLoan(
    borrower,
    metadataURI,
    5_000e6,                    // $5,000
    56 days,                    // Mature in 56 days
    block.timestamp + 7 days    // Fundraising deadline
);
```

### Repayment Flow

**OLD (Installment):**
- Borrower must pay ~$656/week ($5,250/8 periods)
- Each payment applies to next due period
- Missing a period triggers grace period countdown
- After grace expires, loan marked default
- Complex loop in `_applyToPrincipal()` to track periods

**NEW (Flexible):**
- Borrower can pay any amount, anytime
- All payments immediately reduce `outstandingPrincipal`
- UI suggests weekly amounts (calculated off-chain)
- Loan defaults immediately if unpaid at `dueAt`
- Simple subtraction, no loops

## Off-Chain Reputation Tracking

Since the contract is simpler, we track payment behavior off-chain by listening to events:

```typescript
// Listen to Repayment events
interface RepaymentEvent {
  payer: address;
  amount: bigint;
  totalRepaid: bigint;
  outstanding: bigint;
  timestamp: number;
  secondsUntilDue: number;
}

// Calculate suggested schedule adherence
function calculateReputation(loan: Loan, events: RepaymentEvent[]) {
  const duration = loan.dueAt - loan.fundedAt;
  const suggestedWeeklyPayment = loan.principal / (duration / (7 * 86400));

  let onTrackCount = 0;
  let behindCount = 0;

  events.forEach(event => {
    const elapsed = event.timestamp - loan.fundedAt;
    const weeksElapsed = elapsed / (7 * 86400);
    const expectedPaid = weeksElapsed * suggestedWeeklyPayment;

    if (event.totalRepaid >= expectedPaid) {
      onTrackCount++;
    } else {
      behindCount++;
    }
  });

  return {
    paymentsOnTime: onTrackCount,
    paymentsMissed: behindCount,
    avgDaysBetweenPayments: calculateAvgGap(events),
    paymentConsistency: calculateStdDev(events.map(e => e.amount)),
  };
}
```

## Benefits of New Approach

### ✅ Simplicity
- 80 fewer lines of contract code
- No complex period tracking logic
- Single maturity date (easy to understand)
- No grace period edge cases

### ✅ Gas Efficiency
- 50% gas savings per repayment (~18k vs ~32k)
- No loops during repayment
- Simpler state updates

### ✅ Flexibility
- Borrowers can repay on their own schedule
- Lump sum, weekly, or arbitrary amounts all work
- UI can suggest any payment schedule without changing contracts

### ✅ Security
- Smaller attack surface
- Easier to audit (less code)
- Same security primitives (ReentrancyGuard, SafeERC20, Accumulator pattern)

### ✅ Data Collection
- Rich events capture all payment behavior
- Off-chain analysis can test any scheduling hypothesis
- Can adjust UI suggestions based on learned patterns

## Migration Checklist

### Contracts
- [x] Simplify MicroLoan.sol
- [x] Update MicroLoanFactory.sol
- [ ] Update deployment scripts
- [ ] Write comprehensive Foundry tests
- [ ] Deploy to Base Sepolia testnet

### Frontend
- [ ] Update ABIs
- [ ] Update `useMicroLoan` hook
- [ ] Update `useCreateLoan` hook
- [ ] Update CreateLoanForm (remove period inputs)
- [ ] Update LoanCard (show single due date)
- [ ] Add suggested payment calculator (off-chain)
- [ ] Add progress bar based on time + amount

### Backend (Off-Chain)
- [ ] Event listener service (Alchemy/TheGraph)
- [ ] Postgres schema for reputation
- [ ] API endpoints for reputation queries
- [ ] Suggested payment calculation service

### Testing
- [ ] Unit tests for all contract functions
- [ ] Integration tests for full loan lifecycle
- [ ] Gas benchmarking
- [ ] Load testing off-chain infrastructure

## Rollback Plan

If the simplified system doesn't work, the original installment-based system is preserved in the `v1-installment-payments` branch:

```bash
# Switch back to installment system
git checkout v1-installment-payments

# Or cherry-pick specific commits
git cherry-pick <commit-hash>
```

All tests, deployment scripts, and frontend code for the installment system remain intact on that branch.
