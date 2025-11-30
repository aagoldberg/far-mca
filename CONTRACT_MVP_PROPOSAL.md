# Contract & CDP Integration Review + MVP Proposal

**Date:** 2025-11-24
**Focus:** Simplify for MVP, add Splits integration, one-click transfers

---

## 1. Current Architecture Review

### ✅ **What's Working Well**

**MicroLoan.sol** (401 lines)
- **Excellent simplification** from installment-based to single-maturity model
- **Gas efficient**: ~18k gas per repayment (vs 32-37k in old system)
- **Accumulator pattern**: Pro-rata distribution is battle-tested and correct
- **Flexible repayment**: Any amount, anytime - great UX
- **Rich events**: `Repayment` event includes all metadata for off-chain tracking
- **Overpayment handling**: Distributes excess to lenders as bonus
- **Clean state machine**: fundraising → disbursed → active → completed/defaulted

**MicroLoanFactory.sol** (146 lines)
- **Minimal factory pattern**: Simple and secure
- **One active loan per borrower**: Prevents spam, good for MVP
- **Configurable bounds**: Duration, principal, disbursement window
- **Pausable**: Emergency stop mechanism

**CDP Integration**
- Using wagmi hooks for wallet management ✓
- CDP wallet detection (`isCdpWallet`) ✓
- External wallet support (MetaMask, etc.) ✓
- Signature verification ready for ownership proofs ✓

---

## 2. Identified Issues & Gaps

### 🟡 **Medium Priority Issues**

1. **Missing Grace Period**
   - Architecture doc mentions `gracePeriod` (line 43, 151, 179)
   - **Current contract has NO grace period**
   - Loans default instantly at `dueAt` timestamp
   - **Risk**: Too harsh for MVP, may increase default rate

2. **Manual Distribution Only**
   - Lenders must call `claim()` to withdraw their repayments
   - Gas cost on every contributor to claim
   - **UX friction**: Requires transaction signature, wallet interaction
   - No auto-forwarding or batch claims

3. **No Multi-Contributor Optimization**
   - If 50 contributors each put in $10, all 50 must call `claim()`
   - Total gas cost: ~50 * 21k gas = 1M gas for full distribution
   - **Problem at scale**: Expensive and slow for crowdfunded loans

4. **Borrower Can Update Metadata Anytime**
   - `updateMetadata()` callable during active loan
   - **Risk**: Borrower could change loan purpose mid-flight
   - Could mislead contributors about use of funds

### 🟢 **Low Priority / Non-Blocking**

5. **Factory allows `principal >= minPrincipal` with no max**
   - Someone could create $1B loan (would never fund, but clutters UI)
   - Recommend: `maxPrincipal = 100_000e6` ($100k for MVP)

6. **No Loan Discoverability Metadata**
   - Factory just tracks addresses, no tags/categories
   - Off-chain indexing required for "health loans", "education loans", etc.
   - **Not a blocker**: Can handle in backend/frontend

---

## 3. Splits Integration Proposal

### Why 0xSplits for MVP?

**Problem**: Current manual `claim()` model doesn't scale
- 50 contributors = 50 transactions to distribute funds
- Gas costs add up quickly
- Poor UX: Contributors must actively claim

**Solution**: Integrate 0xSplits V2 for automated distribution

### Architecture: Loan → Split Contract → Contributors

```
┌─────────────────┐
│   Borrower      │
│   Repays $500   │
└────────┬────────┘
         │ repay(500)
         ▼
┌─────────────────────────────────┐
│    MicroLoan Contract           │
│  - Tracks repayments            │
│  - Instead of accumulator...    │
│  - Forward to Split contract    │
└────────┬────────────────────────┘
         │ forward all repayments
         ▼
┌─────────────────────────────────┐
│   0xSplits Contract             │
│  - Splits[0]: Alice 20%         │
│  - Splits[1]: Bob 30%           │
│  - Splits[2]: Carol 50%         │
│  - Auto-distributes on receive  │
└────────┬────────────────────────┘
         │ (auto or manual trigger)
         ▼
    ┌────────────┐  ┌──────────┐  ┌────────────┐
    │   Alice    │  │   Bob    │  │   Carol    │
    │  Gets $100 │  │ Gets $150│  │  Gets $250 │
    └────────────┘  └──────────┘  └────────────┘
```

### Implementation Plan

**Step 1: Update MicroLoanFactory**
```solidity
// Add 0xSplits imports
import {SplitMain} from "0xsplits/contracts/SplitMain.sol";

contract MicroLoanFactory {
    SplitMain public immutable splitMain;

    constructor(address _usdc, address _splitMain) {
        usdc = _usdc;
        splitMain = SplitMain(_splitMain);
    }

    function createLoan(...) external returns (address loanAddr, address splitAddr) {
        // Deploy loan
        MicroLoan loan = new MicroLoan(...);

        // Create split for contributors (will be populated after fundraising)
        // For now, set borrower as 100% to allow creation
        address[] memory accounts = new address[](1);
        accounts[0] = borrower;
        uint32[] memory percentAllocations = new uint32[](1);
        percentAllocations[0] = 1000000; // 100% in basis points

        address split = splitMain.createSplit(
            accounts,
            percentAllocations,
            0, // no distributor fee
            address(loan) // loan is controller
        );

        loan.setSplitAddress(split);

        return (address(loan), split);
    }
}
```

**Step 2: Update MicroLoan Contract**
```solidity
contract MicroLoan {
    address public splitAddress;
    bool private splitFinalized;

    function setSplitAddress(address _split) external {
        require(msg.sender == address(factory), "only factory");
        require(splitAddress == address(0), "already set");
        splitAddress = _split;
    }

    // Called once after fundraising completes
    function finalizeSplit() external onlyBorrower {
        require(!fundraisingActive && totalFunded == principal, "not ready");
        require(!splitFinalized, "already finalized");
        require(contributors.length > 0, "no contributors");

        // Build split recipients based on contributions
        address[] memory accounts = new address[](contributors.length);
        uint32[] memory percentAllocations = new uint32[](contributors.length);

        for (uint i = 0; i < contributors.length; i++) {
            accounts[i] = contributors[i];
            // Convert contribution to basis points (10000 = 100%)
            percentAllocations[i] = uint32((contributions[contributors[i]] * 1000000) / principal);
        }

        // Update split with actual contributor allocations
        IMutableSplit(splitAddress).updateSplit(
            accounts,
            percentAllocations,
            0
        );

        splitFinalized = true;
    }

    // Simplified repay - just forward to split
    function repay(uint256 amount) external nonReentrant {
        require(active, "not active");
        require(!completed, "already completed");
        require(amount > 0, "invalid amount");
        require(splitFinalized, "split not finalized");

        fundingToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 applied = amount > outstandingPrincipal ? outstandingPrincipal : amount;
        outstandingPrincipal -= applied;
        totalRepaid += applied;

        // Forward to split contract for distribution
        fundingToken.approve(splitAddress, applied);
        ISplit(splitAddress).distributeERC20(
            fundingToken,
            accounts, // all contributors
            percentAllocations,
            0,
            address(0)
        );

        emit Repayment(msg.sender, applied, totalRepaid, outstandingPrincipal, block.timestamp, secondsUntilDue());

        // Refund overpayment
        if (amount > applied) {
            fundingToken.safeTransfer(msg.sender, amount - applied);
        }

        if (outstandingPrincipal == 0) {
            completed = true;
            emit Completed(totalRepaid, block.timestamp);
            factory.notifyLoanClosed();
        }
    }

    // Remove claim() function entirely - splits handles distribution
}
```

### Benefits of Splits Integration

✅ **One transaction per repayment**: Borrower pays once, all contributors get funds
✅ **Gas efficient**: Splits V2 uses pull-based distribution with waterfall optimization
✅ **Battle-tested**: 0xSplits has $100M+ TVL, audited by Trail of Bits
✅ **Composable**: Contributors can use their split balance in other DeFi protocols
✅ **Immutable**: Once finalized, split percentages can't change (security)

### Trade-offs

⚠️ **Additional deployment cost**: Splits contract deployment adds ~200k gas per loan
⚠️ **Complexity**: Extra contract call in repayment flow
⚠️ **Dependency**: Relies on 0xSplits infrastructure (mitigated: it's immutable)

---

## 4. One-Click Transfers (EOAs only)

### What You're Thinking About

**Use Case**: Borrower wants to send repayment in one click without approve() + repay() pattern

**Current Flow** (2 transactions):
1. `USDC.approve(loanAddress, amount)` - set allowance
2. `Loan.repay(amount)` - transfer funds

**Desired Flow** (1 transaction):
```typescript
// User clicks "Pay $100"
await loan.repayWithPermit(
  amount,
  deadline,
  v, r, s  // EIP-2612 signature
)
```

### Implementation: EIP-2612 Permit Pattern

```solidity
// Add to MicroLoan.sol
function repayWithPermit(
    uint256 amount,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) external nonReentrant {
    require(active, "not active");
    require(!completed, "already completed");
    require(amount > 0, "invalid amount");

    // Use permit to avoid separate approve transaction
    IERC20Permit(address(fundingToken)).permit(
        msg.sender,
        address(this),
        amount,
        deadline,
        v, r, s
    );

    // Now execute repay logic
    fundingToken.safeTransferFrom(msg.sender, address(this), amount);

    // ... rest of repay() logic ...
}
```

### Frontend Integration

```typescript
import { signTypedData } from 'viem/actions';

async function repayWithOneClick(amount: bigint) {
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour

  // Sign permit (no gas, just signature)
  const signature = await signTypedData({
    domain: {
      name: 'USD Coin',
      version: '2',
      chainId,
      verifyingContract: usdcAddress,
    },
    types: {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'Permit',
    message: {
      owner: userAddress,
      spender: loanAddress,
      value: amount,
      nonce: await usdc.nonces(userAddress),
      deadline,
    },
  });

  const { v, r, s } = splitSignature(signature);

  // Submit single transaction
  await loan.repayWithPermit(amount, deadline, v, r, s);
}
```

### ⚠️ **IMPORTANT LIMITATION: EOAs Only**

**Does NOT work with Smart Wallets** (including CDP Smart Wallets):
- EIP-2612 `permit()` requires ECDSA signature
- Smart wallets (ERC-4337, Safe, CDP) use `isValidSignature()` (EIP-1271)
- **CDP embedded wallets are smart wallets** (ERC-4337 account abstraction)

**Solution**: Detect wallet type and show appropriate flow

```typescript
function getRepaymentFlow(connector: string) {
  if (connector === 'coinbaseWalletSDK' && isCDP) {
    // CDP Smart Wallet: Use approve() + repay() (2 txs)
    return 'TWO_TX_FLOW';
  } else {
    // EOA (MetaMask, WalletConnect, etc.): Use permit
    return 'PERMIT_FLOW';
  }
}
```

### Recommendation: **Add Permit, But Don't Rely On It**

**Pros**:
- Nice UX for MetaMask/WalletConnect users
- Standard pattern, minimal code (~40 lines)
- No security risk

**Cons**:
- Doesn't work with CDP wallets (your main integration!)
- Adds complexity for marginal benefit
- USDC on Base Sepolia may not support permit (check first)

**My take**: **Skip permit for MVP**. CDP wallets don't support it anyway, and 2 transactions isn't terrible UX. Add in v1.1 if you see demand from EOA users.

---

## 5. What to REMOVE for MVP

### 🗑️ **Remove These Features**

1. **Metadata Updates During Active Loan**
   ```solidity
   // REMOVE this function
   function updateMetadata(string calldata newMetadataURI) external onlyBorrower {
       require(active || completed, "loan not active or completed");
       ...
   }
   ```
   **Reason**: Risk of misleading contributors. Lock metadata at fundraising close.
   **Keep**: Metadata updates post-completion for "thank you" messages

2. **Token Recovery**
   ```solidity
   // REMOVE this function - too risky for MVP
   function recoverTokens(address token, address to) external nonReentrant {
       ...
   }
   ```
   **Reason**: Attack vector. If loan is "completed" but dust remains, attacker could drain. Better to let funds sit than risk exploit.

3. **Overpayment to Lenders**
   ```solidity
   // Current: Line 261
   totalRepaid += amount; // Includes overpayments
   ```
   **Change to**:
   ```solidity
   totalRepaid += principalPortion; // Only count toward principal
   // Refund anything over principal immediately
   ```
   **Reason**: Overpayments as "bonus" to lenders is confusing. Better UX: reject overpayments or refund them.

4. **Suggested Weekly Payment** (From architecture doc)
   - Don't store this in contract
   - Calculate off-chain in frontend
   - **Reason**: Not enforceable, just UI hint, wastes gas

---

## 6. What to ADD for MVP

### ✅ **High Priority Additions**

1. **Add Grace Period**
   ```solidity
   uint256 public immutable gracePeriod = 7 days; // or make configurable

   function isDefaulted() public view returns (bool) {
       if (!active || completed) return false;
       return block.timestamp > dueAt + gracePeriod && outstandingPrincipal > 0;
   }
   ```
   **Why**: Essential for fair default detection. Instant default is too harsh.

2. **Add Max Principal Bound**
   ```solidity
   uint256 public maxPrincipal = 100_000e6; // $100k max

   function createLoan(...) external {
       require(principal >= minPrincipal && principal <= maxPrincipal, "principal out of bounds");
       ...
   }
   ```
   **Why**: Prevents spam loans, sets realistic expectations

3. **Add Split Integration** (See Section 3)
   **Why**: Makes distribution automatic, much better UX at scale

4. **Lock Metadata After Fundraising**
   ```solidity
   function lockMetadata() external onlyBorrower {
       require(!fundraisingActive && totalFunded == principal, "not ready");
       metadataLocked = true;
   }

   function updateMetadata(...) external {
       require(!metadataLocked || completed, "metadata locked during active loan");
       ...
   }
   ```
   **Why**: Prevents bait-and-switch. Borrower can update after completion for "thank you" notes.

### 🟡 **Nice-to-Have Additions**

5. **Batch Operations for Contributors**
   ```solidity
   function contributeBatch(address[] calldata loans, uint256[] calldata amounts) external {
       require(loans.length == amounts.length, "length mismatch");
       for (uint i = 0; i < loans.length; i++) {
           MicroLoan(loans[i]).contribute(amounts[i]);
       }
   }
   ```
   **Why**: Users can fund multiple loans in one transaction
   **Trade-off**: Adds complexity, maybe not MVP critical

6. **Emergency Pause Per Loan**
   - Currently only factory can pause (affects all new loans)
   - Consider: Borrower or factory can pause individual loan
   **Trade-off**: More centralization, but useful for handling exploits

---

## 7. Final MVP Contract Architecture

### Recommended Minimal Changes

**MicroLoan.sol Changes**:
1. ✅ Add `gracePeriod` immutable (7 days)
2. ✅ Update `isDefaulted()` to use grace period
3. ✅ Add `splitAddress` and integration (Section 3)
4. ✅ Add `metadataLocked` flag
5. ✅ Remove `recoverTokens()` function
6. ✅ Change overpayment handling to refund, not bonus
7. ❌ Skip `repayWithPermit()` (doesn't work with CDP wallets)

**MicroLoanFactory.sol Changes**:
1. ✅ Add `maxPrincipal = 100_000e6`
2. ✅ Validate principal is within bounds
3. ✅ Integrate with 0xSplits (Section 3)
4. ❌ Skip `suggestedWeeklyPayment` storage

### Deployment Checklist

**Contracts to deploy on Base Mainnet**:
1. TestUSDC (skip, use real USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
2. MicroLoanFactory (with splits support)
3. (0xSplits already deployed on Base - just import)

**Environment Variables** (update `.env`):
```bash
# Base Mainnet
USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
SPLITS_MAIN_ADDRESS=0x... # Get from 0xSplits docs for Base
BASESCAN_API_KEY=your_key_here

# For verification
forge verify-contract <address> src/MicroLoanFactory.sol:MicroLoanFactory \
  --chain base \
  --constructor-args $(cast abi-encode "constructor(address,address)" $USDC_ADDRESS $SPLITS_MAIN_ADDRESS)
```

---

## 8. Gas Cost Estimates (With Splits)

### Current System (Manual Claims)
| Operation | Gas Cost | Who Pays |
|-----------|----------|----------|
| Create Loan | ~500k | Factory/Relayer |
| Contribute | ~50k | Contributor |
| Disburse | ~50k | Borrower |
| Repay | ~18k | Borrower |
| Claim (per contributor) | ~21k | Each contributor |

**Example**: Loan with 50 contributors, 8 repayments
- Borrower: 8 * 18k = 144k gas
- Contributors: 50 * 21k = 1,050k gas
- **Total: 1,194k gas for full distribution**

### With Splits Integration
| Operation | Gas Cost | Who Pays |
|-----------|----------|----------|
| Create Loan + Split | ~700k (+200k) | Factory/Relayer |
| Finalize Split | ~50k per contributor | Borrower (one-time) |
| Repay + Distribute | ~50k (+32k) | Borrower |
| Claim from Split (optional) | ~21k | Contributor (if needed) |

**Example**: Same loan with 50 contributors, 8 repayments
- Factory: 700k (one-time)
- Borrower: 50 * 1k (finalize) + 8 * 50k (repay) = 450k
- Contributors: 0 gas (auto-forwarded) or opt-in claim later
- **Total: 1,150k gas (~4% savings)**

**But**: Much better UX - contributors don't need to do anything!

---

## 9. CDP Integration Recommendations

### Current Integration Status

✅ **Working Well**:
- wagmi hooks for wallet detection
- Separate flows for CDP vs external wallets
- Signature verification for loan creation

⚠️ **Needs Attention**:
1. **Gasless Transactions**: You have a relayer for loan creation, but not for contributions/repayments
2. **Smart Wallet UX**: CDP wallets will always do 2-tx flow (approve + repay), make this clear in UI
3. **Onramp Integration**: Check if you're using Coinbase Pay for fiat→USDC before contributions

### Recommendations

**1. Keep Relayer for Loan Creation Only**
- Borrowers shouldn't pay gas to create loans (good for onboarding)
- Contributors/repayers should pay their own gas (prevents spam)

**2. Clear Wallet Type Messaging**
```typescript
// In UI
{isCDPWallet && (
  <Alert>
    You're using a Coinbase Smart Wallet. Repayments require two steps:
    1. Approve USDC
    2. Send payment
    This is normal for smart wallets and keeps your funds secure.
  </Alert>
)}
```

**3. Optimize for CDP Wallet UX**
- Use batch calls where possible (CDP wallets support this)
- Example: `approve() + contribute()` in single UserOp
- Saves one confirmation click

---

## 10. Summary & Recommendation

### ✅ **Do This for MVP**

1. **Add Splits Integration** (Section 3)
   - Automatic distribution to contributors
   - Better UX at scale
   - ~200k gas overhead per loan (worth it)

2. **Add Grace Period** (7 days)
   - `gracePeriod = 7 days` immutable
   - Update `isDefaulted()` check

3. **Add Max Principal** ($100k)
   - Prevents spam
   - Sets realistic expectations

4. **Lock Metadata After Fundraising**
   - Prevents bait-and-switch
   - Allow updates post-completion

5. **Remove Token Recovery**
   - Security risk
   - Not needed for MVP

### ❌ **Skip for MVP**

1. **EIP-2612 Permit** (one-click transfers)
   - Doesn't work with CDP wallets
   - Adds complexity
   - 2-tx flow is acceptable UX

2. **Suggested Weekly Payment in Contract**
   - Calculate off-chain
   - Saves gas, more flexible

3. **Batch Contribution Operations**
   - Nice-to-have, not critical
   - Add in v1.1 if users request it

### 📊 **Impact Summary**

| Change | Gas Impact | UX Impact | Security Impact | Priority |
|--------|------------|-----------|-----------------|----------|
| Add Splits | +200k per loan | +++ (auto-distribution) | ✓ (audited) | **HIGH** |
| Add Grace Period | +5k per loan | ++ (fair defaults) | ✓ (standard) | **HIGH** |
| Add Max Principal | 0 | + (prevents spam) | ✓ (bounds check) | **MEDIUM** |
| Lock Metadata | +5k per loan | + (trust) | ✓ (prevents scam) | **MEDIUM** |
| Remove Token Recovery | -10k | 0 | ++ (removes attack vector) | **HIGH** |
| Skip Permit | 0 | 0 (CDP doesn't support anyway) | 0 | **LOW** |

### 🚀 **Next Steps**

1. Review this proposal and decide on splits integration
2. If yes to splits:
   - Install 0xSplits dependencies: `forge install 0xsplits/splits-contracts`
   - Update contracts per Section 3
   - Deploy to Base Sepolia for testing
3. If no to splits:
   - Just add grace period, max principal, metadata lock
   - Keep current accumulator-based claiming
4. Write integration tests for chosen path
5. Get contracts audited (splits version = larger surface area)
6. Deploy to Base Mainnet

---

**Questions to Answer**:

1. Are you comfortable with the 0xSplits dependency for MVP?
2. Should we batch all these changes or do them incrementally?
3. Do you want to keep accumulator pattern as fallback if splits integration fails?
4. What's your timeline for mainnet deployment?
