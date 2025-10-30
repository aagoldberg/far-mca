# Smart Contract Flow

Trust scores are calculated **off-chain** using the algorithm in the previous section. The smart contracts handle money movement, not social graph analysis. This keeps gas costs low (Base L2 fees are ~$0.01 per transaction).

## Contract Interfaces

### IMicroLoanFactory.sol
```solidity
interface IMicroLoanFactory {
    function createLoan(
        address borrower,
        string calldata metadataURI,
        uint256 principal,
        uint256 loanDuration,
        uint256 fundraisingDeadline
    ) external returns (address loanAddress);
}
```
*Deploys individual loan contracts with validation constraints*

### IMicroLoan.sol
```solidity
interface IMicroLoan {
    function contribute(uint256 amount) external;
    function disburse() external;
    function repay(uint256 amount) external;
    function claimableAmount(address contributor)
        external view returns (uint256);
    function claim() external;
}
```
*Core loan lifecycle: fundraising → disbursement → repayment → claims*

## Loan Lifecycle

### 1. Loan Deployed via Factory

```solidity
function createLoan(
    address borrower,
    string calldata metadataURI,
    uint256 principal,
    uint256 loanDuration,
    uint256 fundraisingDeadline
) external returns (address loanAddress)
```

**Constraints:**
- **Minimum principal**: P_min = $100
- **Loan duration**: 7 days ≤ D ≤ 365 days
- **Disbursement window**: 14 days after funding
- **Restriction**: One active loan per borrower

Each loan gets its own smart contract with parameters: principal P, maturity date T_maturity, borrower address, and verified Farcaster ID.

### 2. Lenders Contribute

```solidity
function contribute(uint256 amount) external
```

Lenders send funds to the contract. Each contribution updates:

```
C_lender ← C_lender + amount
R_total ← R_total + amount
```

Where:
- C_lender = cumulative contribution from this lender
- R_total = total raised across all lenders

Trust scores are calculated off-chain and displayed in the UI. The contract only tracks capital flow.

### 3. Funds Disbursed to Borrower

```solidity
function disburse() external
```

Once fully funded, borrower can claim funds within the disbursement window:

**Conditions:**
1. R_total ≥ P (fully funded)
2. T_current ≤ T_deadline + 14 days
3. Funds not yet disbursed

**Action:** Transfer R_total to borrower

### 4. Repayment & Claims

```solidity
function repay(uint256 amount) external

function claimableAmount(address contributor)
    external view returns (uint256)

function claim() external
```

Borrower repays flexibly. Lenders claim their pro-rata share using an **accumulator pattern** for gas efficiency.

#### On Each Repayment:

```
A ← A + (r × k) / P
```

Where:
- A = accumulator (tracks total repaid per $1 of principal)
- r = repayment amount
- k = precision constant (10^18)
- P = original principal

#### Claimable Amount per Lender:

```
Claimable = (C_lender × A) / k − D_lender
```

Where:
- C_lender = lender's contribution
- D_lender = amount already claimed by lender
- Result is proportional to contribution share

This approach calculates pro-rata shares in **O(1) time per lender**, rather than iterating over all lenders. Overpayments automatically distribute as bonuses.

## Gas Optimization

The accumulator pattern is crucial for scalability:

| Approach | Gas Cost per Lender | Gas for 100 Lenders |
|----------|---------------------|---------------------|
| **Accumulator (Our Method)** | ~40,000 gas | ~40,000 gas |
| **Iterate All Lenders** | ~40,000 gas | ~4,000,000 gas |

With Base L2 gas at ~$0.01 per 40,000 gas, our method keeps costs constant regardless of lender count.

## Security Considerations

- **Reentrancy Protection**: All external calls use `nonReentrant` modifier
- **Access Control**: Only borrower can disburse funds
- **Overflow Protection**: Solidity 0.8.20 has built-in overflow checks
- **Fixed-Point Math**: 10^18 precision prevents rounding errors

## Contract Addresses

### Base Mainnet
- **MicroLoanFactory**: `[TO BE DEPLOYED]`
- **USDC Token**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### Base Sepolia (Testnet)
- **MicroLoanFactory**: `[CHECK REPO]`
- **Test USDC**: `[CHECK REPO]`

---

**Next**: Learn how [Social Trust Scoring](social-trust-scoring/README.md) enables uncollateralized lending
