# Simplified Loan Architecture - v1 MVP

## Overview

This document outlines the simplified loan contract architecture that replaces the complex installment-based system with a flexible maturity-based repayment model.

**Branch History:**
- **`v1-installment-payments`**: Original complex installment system (preserved)
- **`dev`**: New simplified system (current work)

## Key Changes

### Removed Complexity
- ❌ `termPeriods` - No more installment count
- ❌ `periodLength` - No more period duration
- ❌ `firstDueDate` - No more first payment date
- ❌ `nextDuePeriodIndex` - No more period tracking
- ❌ `_applyToPrincipal()` loop - No more complex payment application logic
- ❌ `PeriodPaid` events - No more per-period tracking
- ❌ `currentDueDate()` - No more next-period calculations

### Simplified Model
- ✅ Single `dueAt` timestamp (loan maturity)
- ✅ Flexible `repay(uint256 amount)` - any amount, anytime
- ✅ Simple default check: `block.timestamp > dueAt + gracePeriod`
- ✅ Rich events for off-chain reputation tracking
- ✅ UI suggests payments, contract doesn't enforce

## Contract Architecture

### MicroLoan.sol (Simplified)

```solidity
contract MicroLoan {
    // Immutable Config
    IERC20 public immutable fundingToken;
    IMicroLoanFactory public immutable factory;
    address public immutable borrower;
    string public metadataURI;

    uint256 public immutable principal;
    uint256 public immutable dueAt;              // Single maturity date
    uint256 public immutable gracePeriod;        // e.g., 7 days
    uint256 public immutable fundraisingDeadline;
    uint256 public immutable disbursementWindow;

    // Optional: Suggested repayment schedule (not enforced)
    uint256 public immutable suggestedWeeklyPayment;  // For UI hints only

    // State
    bool public fundraisingActive;
    bool public active;                          // Loan disbursed
    bool public completed;                       // Fully repaid
    bool public cancelled;

    uint256 public totalFunded;
    uint256 public totalRepaid;                  // Cumulative repayments
    uint256 public outstandingPrincipal;
    uint256 public fundedAt;

    // Same accumulator-based distribution (keep this - it's good)
    mapping(address => uint256) public contributions;
    address[] public contributors;
    uint256 public accRepaidPerShare;
    mapping(address => uint256) public userRewardDebt;

    // Events (Rich for off-chain tracking)
    event Contributed(address indexed contributor, uint256 amount);
    event FundraisingClosed(uint256 totalAmount);
    event Disbursed(address indexed borrower, uint256 amount);
    event Repayment(
        address indexed payer,
        uint256 amount,
        uint256 totalRepaid,
        uint256 outstanding,
        uint256 timestamp,
        uint256 daysUntilDue
    );
    event Claimed(address indexed contributor, uint256 amount);
    event Completed(uint256 totalRepaid, uint256 timestamp);
    event Defaulted(uint256 dueDate, uint256 outstandingAmount);
    event Refunded(address indexed contributor, uint256 amount);
    event FundraisingCancelled();

    // Simplified repay function
    function repay(uint256 amount) external nonReentrant {
        require(active, "not active");
        require(!completed, "already completed");
        require(amount > 0, "invalid amount");

        fundingToken.safeTransferFrom(msg.sender, address(this), amount);

        // Simple math: apply to outstanding, cap at outstanding
        uint256 applied = amount > outstandingPrincipal
            ? outstandingPrincipal
            : amount;

        outstandingPrincipal -= applied;
        totalRepaid += applied;

        // Update accumulator for pro-rata distribution
        accRepaidPerShare += (applied * ACC_PRECISION) / principal;

        // Rich event emission
        uint256 daysUntilDue = dueAt > block.timestamp
            ? (dueAt - block.timestamp) / 1 days
            : 0;

        emit Repayment(
            msg.sender,
            applied,
            totalRepaid,
            outstandingPrincipal,
            block.timestamp,
            daysUntilDue
        );

        // Refund overpayment
        if (amount > applied) {
            fundingToken.safeTransfer(msg.sender, amount - applied);
        }

        // Check completion
        if (outstandingPrincipal == 0) {
            completed = true;
            if (accRepaidPerShare < ACC_PRECISION) {
                accRepaidPerShare = ACC_PRECISION;
            }
            emit Completed(totalRepaid, block.timestamp);
            factory.notifyLoanClosed();
        }
    }

    // Simple default check
    function isDefaulted() public view returns (bool) {
        if (!active || completed) return false;
        return block.timestamp > dueAt + gracePeriod && outstandingPrincipal > 0;
    }
}
```

### MicroLoanFactory.sol (Simplified)

```solidity
contract MicroLoanFactory {
    // Remove installment-related bounds
    uint256 public minPrincipal = 100e6;
    uint256 public minLoanDuration = 7 days;      // Minimum time to maturity
    uint256 public maxLoanDuration = 365 days;    // Maximum time to maturity
    uint256 public disbursementWindow = 14 days;
    uint256 public gracePeriod = 7 days;

    function createLoan(
        address borrower,
        string calldata metadataURI,
        uint256 principal,
        uint256 loanDuration,               // Seconds until maturity (e.g., 56 days)
        uint256 fundraisingDeadline,
        uint256 suggestedWeeklyPayment      // Optional UI hint (not enforced)
    ) external whenNotPaused returns (address) {
        require(principal >= minPrincipal, "principal too low");
        require(
            loanDuration >= minLoanDuration && loanDuration <= maxLoanDuration,
            "duration out of bounds"
        );
        require(!hasActiveLoan[borrower], "has active loan");

        uint256 dueAt = block.timestamp + loanDuration;

        MicroLoan loan = new MicroLoan(
            address(this),
            usdc,
            borrower,
            metadataURI,
            principal,
            dueAt,
            fundraisingDeadline,
            disbursementWindow,
            gracePeriod,
            suggestedWeeklyPayment
        );

        // ... tracking logic ...

        return address(loan);
    }
}
```

## Off-Chain Reputation Tracking

Listen to `Repayment` events and calculate metrics:

### Metrics to Track (Off-Chain)

```typescript
interface OffChainReputation {
  // Basic completion
  loansCompleted: number;
  loansDefaulted: number;
  totalBorrowed: number;
  totalRepaid: number;

  // Payment behavior (from Repayment events)
  avgDaysUntilFullRepayment: number;
  paymentsOnSchedule: number;     // Compare totalRepaid to expected based on suggested schedule
  paymentsMissed: number;         // Behind suggested schedule

  // Velocity signals
  daysToFirstPayment: number;     // Time from disburse to first repay
  repaymentFrequency: number;     // Avg days between payments
  paymentConsistency: number;     // Std dev of payment amounts

  // Risk signals
  everDefaulted: boolean;
  daysSinceLastDefault: number;
  maxDaysOverdue: number;

  // Tier (calculated)
  tier: 0 | 1 | 2 | 3;           // Calculated from above metrics
}
```

### Calculation Logic (Backend)

```typescript
// Listen to Repayment events
eventListener.on('Repayment', async (event) => {
  const {
    payer,
    amount,
    totalRepaid,
    outstanding,
    timestamp,
    daysUntilDue
  } = event.args;

  const loan = await getLoanDetails(event.address);
  const borrower = loan.borrower;

  // Calculate suggested schedule progress
  const elapsed = timestamp - loan.fundedAt;
  const totalDuration = loan.dueAt - loan.fundedAt;
  const expectedProgress = (elapsed / totalDuration) * loan.principal;
  const actualProgress = totalRepaid;

  // Update reputation
  await db.reputation.update({
    where: { borrower },
    data: {
      totalRepaid: { increment: amount },
      paymentsOnSchedule: actualProgress >= expectedProgress
        ? { increment: 1 }
        : undefined,
      paymentsMissed: actualProgress < expectedProgress
        ? { increment: 1 }
        : undefined,
      lastPaymentAt: timestamp,
    }
  });
});
```

## Migration Path

### Phase 1: Implement & Test (Week 1)
- ✅ Write simplified contracts
- ✅ Comprehensive Foundry tests
- ✅ Deploy to Base Sepolia testnet
- ✅ Update frontend to new contract interface

### Phase 2: Off-Chain Infrastructure (Week 2)
- ✅ Event listener service (Alchemy webhooks or TheGraph)
- ✅ Postgres schema for reputation metrics
- ✅ API endpoints for reputation queries
- ✅ UI displays reputation but doesn't gate loans (v1)

### Phase 3: Production Deploy (Week 3)
- ✅ Audit simplified contracts (much smaller surface = faster audit)
- ✅ Deploy to Base mainnet
- ✅ Update frontend to mainnet contracts
- ✅ Monitor first 50 loans closely

### Phase 4: Reputation Gating (v1.5 - Q1 2026)
- ✅ Use off-chain reputation to suggest loan amounts
- ✅ "You're approved for up to $500 based on your tier"
- ✅ Still manual override available

### Phase 5: On-Chain Scoring (v2 - Q2 2026)
- ✅ Deploy simple CreditScore contract
- ✅ Tracks tier (0-3) and completion count only
- ✅ Used for interest rate determination (0-5%)
- ✅ Off-chain ML model still handles detailed risk

## Gas Savings Comparison

### Old System (Per Repayment)
```
- paid += amt                    ~5k gas
- Loop through periods           ~15-20k gas (variable)
- nextDuePeriodIndex++           ~5k gas
- PeriodPaid event               ~2k gas
- Accumulator update             ~5k gas
Total: ~32-37k gas per repayment
```

### New System (Per Repayment)
```
- outstandingPrincipal -= amt   ~5k gas
- totalRepaid += amt             ~5k gas
- Accumulator update             ~5k gas
- Repayment event (rich)         ~3k gas
Total: ~18k gas per repayment
```

**Savings: ~40-50% gas per repayment**

## Security Considerations

### Maintained from Old System
- ✅ ReentrancyGuard on all external functions
- ✅ SafeERC20 for all token transfers
- ✅ Accumulator pattern (proven secure)
- ✅ Factory pattern (borrower tracking)

### Simplified Attack Surface
- ✅ No period loop logic (removes loop-based attacks)
- ✅ No complex state transitions between periods
- ✅ Single maturity check (easier to audit)
- ✅ Smaller contract size (easier to verify)

### New Considerations
- ⚠️ Overpayment refund (already handled correctly)
- ⚠️ Spam small payments (same as old - gas cost discourages)
- ⚠️ Default detection (now simpler - single timestamp check)

## Testing Strategy

### Unit Tests (Foundry)
```bash
# Core functionality
testContribute()
testDisburse()
testRepayFullAmount()
testRepayPartialAmounts()
testRepayOverpayment()
testClaim()
testRefund()

# Edge cases
testRepayAfterMaturity()
testRepayAfterDefault()
testMultipleSmallRepayments()
testZeroOutstanding()

# Security
testReentrancyProtection()
testOverpaymentRefund()
testAccumulatorAccuracy()
```

### Integration Tests (Frontend)
```typescript
// Happy path
testCreateLoanFlow()
testContributionFlow()
testDisbursementFlow()
testFlexibleRepaymentFlow()
testClaimFlow()

// UI hints
testSuggestedPaymentDisplay()
testProgressBarAccuracy()
testOnTrackIndicator()
```

## Success Metrics (v1)

Track these off-chain to validate the simplified model:

### Completion Rates
- Target: >90% of loans fully repaid within grace period
- Measure: `completed / (completed + defaulted)`

### Payment Patterns
- Avg payments per loan: Track to understand borrower behavior
- Median time to first payment: Expect 3-7 days
- Payment frequency: Weekly? Bi-weekly? Lump sum?

### Default Signals
- Early warning: Track % behind suggested schedule
- Correlation: Does "behind schedule" predict default?
- Intervention: Can we message borrowers who are falling behind?

## Questions for User

1. **Suggested weekly payment**: Should this be stored in contract or calculated off-chain?
   - Pro on-chain: Available to any interface
   - Pro off-chain: More flexible, can adjust formula

2. **Grace period**: Keep 7 days or make it longer/shorter?
   - Current: 7 days after maturity
   - Alternative: 14 days for v1 (more forgiving during bootstrap)

3. **Loan duration**: What's reasonable range?
   - Current thinking: 7-365 days
   - Common case: 56 days (8 weeks) for ~$5k loan

4. **Events richness**: Are these events sufficient for off-chain tracking?
   - Could add more fields to Repayment event
   - Could add LoanStatusUpdate event for major state changes
