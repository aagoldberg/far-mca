# MicroLoan Contracts

Zero-interest, crowdfunded microloans on Base.

## Features

- ✅ **Zero Interest** - Borrowers repay only the principal
- ✅ **Crowdfunded** - Multiple lenders can fund each loan
- ✅ **Grace Periods** - 7-day grace period before default
- ✅ **Emergency Pause** - Factory can be paused in emergencies
- ✅ **Gas Optimized** - IR compiler enabled for efficiency
- ✅ **Well Tested** - 11 comprehensive tests covering edge cases
- ✅ **Fully Documented** - Complete NatSpec documentation

## Quick Start

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your keys

# 2. Install & Test
make install
make test

# 3. Deploy to Base Sepolia
make deploy-sepolia
```

See [QUICKSTART.md](./QUICKSTART.md) for details.

## Contracts

### MicroLoanFactory
Factory contract for deploying individual microloans.

**Key Functions**:
- `createLoan()` - Deploy a new loan
- `pause()`/`unpause()` - Emergency controls
- `setBounds()` - Update loan parameters

**Address**: (Deploy to get address)

### MicroLoan
Individual loan contract.

**Lifecycle**: Fundraising → Disbursement → Repayment → Completion

**Key Functions**:
- `contribute()` - Fund a loan
- `disburse()` - Borrower claims funds
- `repay()` - Make repayments
- `claim()` - Lenders claim returns
- `refund()` - Get refund if loan cancelled

### TestUSDC
Test USDC token with unlimited minting.

**Key Functions**:
- `faucet(amount)` - Mint tokens to yourself
- `mint(to, amount)` - Mint to any address

## Architecture

```
┌─────────────────────────┐
│   MicroLoanFactory      │
│  - Creates loans        │
│  - Enforces bounds      │
│  - Emergency pause      │
└───────────┬─────────────┘
            │
            │ creates
            ↓
┌─────────────────────────┐
│      MicroLoan          │
│  - Fundraising          │
│  - Disbursement         │
│  - Repayment tracking   │
│  - Distribution         │
└─────────────────────────┘
```

## Configuration

Default factory settings:
- **Min Principal**: 100 USDC
- **Term Range**: 3-60 periods
- **Period Length**: 7-60 days
- **Disbursement Window**: 14 days
- **Grace Period**: 7 days

Modify in `.env` or call setter functions after deployment.

## Testing

```bash
# Run all tests
make test

# Run with gas reporting
make test-gas

# Generate coverage
make coverage

# Create gas snapshot
make snapshot
```

**Test Coverage**: 11/11 tests passing
- ✅ Happy path (fund → disburse → repay → claim)
- ✅ Refund scenarios
- ✅ Multiple contributors
- ✅ Partial repayments
- ✅ Grace period & defaults
- ✅ Factory bounds enforcement
- ✅ Pause/unpause
- ✅ Overpayment handling

## Deployment

### Base Sepolia (Testnet)
```bash
make deploy-sepolia
```

### Base Mainnet (Production)
```bash
make deploy-mainnet
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide.

## Security

- ✅ **ReentrancyGuard** on all external state-changing functions
- ✅ **SafeERC20** for token transfers
- ✅ **Ownable** for access control
- ✅ **Pausable** for emergency stops
- ✅ **Comprehensive input validation**
- ✅ **No upgradeability** (immutable by design)

## Events

All key actions emit events for indexing:

```solidity
// Fundraising
event Contributed(address indexed contributor, uint256 amount)
event FundraisingClosed(uint256 totalAmount)
event FundraisingCancelled()

// Disbursement
event Disbursed(address indexed borrower, uint256 amount)

// Repayment
event Repaid(uint256 amountApplied, uint256 outstandingPrincipal)
event PeriodPaid(uint256 indexed periodIndex, uint256 amountPaid, uint256 dueDate, address indexed payer)
event LoanDefaulted(uint256 missedPaymentDate, uint256 periodsOverdue)

// Claims & Refunds
event Claimed(address indexed contributor, uint256 amount)
event Refunded(address indexed contributor, uint256 amount)
event Completed(uint256 totalRepaid)

// Factory
event LoanCreated(address indexed loan, address indexed borrower, uint256 principal, uint256 termPeriods)
```

## License

MIT

## Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)
- **Issues**: File on GitHub

---

Built with ❤️ using [Foundry](https://getfoundry.sh)
