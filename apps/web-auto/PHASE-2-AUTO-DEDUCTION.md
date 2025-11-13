# Phase 2: Auto-Deduction Implementation Plans

This document outlines viable approaches for implementing automatic loan repayment deduction from merchant revenue sources (Stripe, Square, etc.).

---

## Current Architecture (Phase 1)

**Status**: Non-custodial with centralized triggers

```
Merchant Revenue → Backend Calculates → Bridge Converts → Smart Contract →
CDP Wallet Validates Session Key → Auto-Approves → Repayment Complete
```

### Trust Model
- ✅ **Non-Custodial**: User controls keys via CDP smart wallet
- ✅ **Session Limits**: On-chain enforcement of max amounts
- ⚠️ **Centralized Calculation**: Backend trusted for revenue data
- ⚠️ **Web2 Data Source**: Stripe/Square webhooks (off-chain)

---

## Phase 2: Viable Auto-Deduction Plans

### Plan A: Chainlink Automation (Recommended)

**Best for**: Production deployment with decentralized triggers

#### Architecture
Replace centralized backend with Chainlink Keeper network that automatically checks for repayment conditions.

```solidity
// contracts/LoanRepaymentAutomation.sol
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract LoanRepaymentAutomation is AutomationCompatibleInterface {

  struct Loan {
    address borrower;
    uint256 repaymentPercentage; // basis points (1000 = 10%)
    uint256 lastRepaymentTime;
    bool active;
  }

  mapping(address => Loan) public loans;
  IRevenueOracle public revenueOracle; // Oracle for Stripe data

  /**
   * @notice Chainlink Keeper calls this to check if repayment is due
   * @dev Runs off-chain, returns true if action needed
   */
  function checkUpkeep(bytes calldata checkData)
    external
    view
    override
    returns (bool upkeepNeeded, bytes memory performData)
  {
    address[] memory borrowers = getActiveBorrowers();

    for (uint i = 0; i < borrowers.length; i++) {
      address borrower = borrowers[i];
      Loan memory loan = loans[borrower];

      // Check oracle for merchant revenue since last repayment
      uint256 revenue = revenueOracle.getRevenueSince(
        borrower,
        loan.lastRepaymentTime
      );

      if (revenue > 0) {
        uint256 repayment = (revenue * loan.repaymentPercentage) / 10000;

        upkeepNeeded = true;
        performData = abi.encode(borrower, repayment, revenue);
        break; // Process one per upkeep
      }
    }
  }

  /**
   * @notice Chainlink Keeper executes this when upkeep is needed
   * @dev Runs on-chain, triggers actual repayment
   */
  function performUpkeep(bytes calldata performData)
    external
    override
  {
    (address borrower, uint256 amount, uint256 revenue) =
      abi.decode(performData, (address, uint256, uint256));

    // Log for transparency
    emit RepaymentCalculated(borrower, revenue, amount, block.timestamp);

    // Execute repayment using session key
    executeRepayment(borrower, amount);

    // Update last repayment time
    loans[borrower].lastRepaymentTime = block.timestamp;
  }

  function executeRepayment(address borrower, uint256 amount) internal {
    // Smart wallet validates via session key
    // No signature needed - auto-approved if within limits
    IERC20(USDC).transferFrom(borrower, address(this), amount);
    distributeFunds(amount);
  }
}
```

#### Revenue Oracle Integration
```solidity
// contracts/StripeRevenueOracle.sol
interface IRevenueOracle {
  function getRevenueSince(address merchant, uint256 timestamp)
    external view returns (uint256);
}

contract StripeRevenueOracle {
  // Off-chain worker submits signed revenue attestations
  struct RevenueAttestation {
    address merchant;
    uint256 revenue;
    uint256 fromTimestamp;
    uint256 toTimestamp;
    bytes signature; // Signed by oracle operator
  }

  mapping(address => mapping(uint256 => uint256)) public revenueData;

  function submitRevenue(RevenueAttestation calldata attestation) external {
    // Verify signature from trusted oracle operator
    require(verifyOracleSignature(attestation), "Invalid signature");

    // Store revenue data
    revenueData[attestation.merchant][attestation.toTimestamp] = attestation.revenue;

    emit RevenueSubmitted(
      attestation.merchant,
      attestation.revenue,
      attestation.fromTimestamp,
      attestation.toTimestamp
    );
  }

  function getRevenueSince(address merchant, uint256 timestamp)
    external view returns (uint256)
  {
    return revenueData[merchant][timestamp];
  }
}
```

#### Backend (Off-Chain Oracle Worker)
```typescript
// backend/oracle-worker.ts
import { ethers } from 'ethers'
import Stripe from 'stripe'

class StripeOracleWorker {
  async submitRevenueToChain() {
    // 1. Fetch revenue from Stripe
    const merchants = await getActiveMerchants()

    for (const merchant of merchants) {
      const revenue = await this.getStripeRevenue(merchant)

      // 2. Sign attestation
      const attestation = {
        merchant: merchant.address,
        revenue: revenue.total,
        fromTimestamp: revenue.from,
        toTimestamp: revenue.to,
      }

      const signature = await this.signer.signMessage(
        ethers.utils.solidityKeccak256(
          ['address', 'uint256', 'uint256', 'uint256'],
          [attestation.merchant, attestation.revenue, attestation.fromTimestamp, attestation.toTimestamp]
        )
      )

      // 3. Submit to oracle contract
      await oracleContract.submitRevenue({
        ...attestation,
        signature
      })

      console.log(`Submitted revenue for ${merchant.address}: $${revenue.total}`)
    }
  }

  async getStripeRevenue(merchant) {
    const stripe = new Stripe(merchant.stripeApiKey)

    const charges = await stripe.charges.list({
      created: {
        gte: merchant.lastRevenueCheck,
      }
    })

    const total = charges.data.reduce((sum, charge) => sum + charge.amount, 0)

    return {
      total: total / 100, // Convert cents to dollars
      from: merchant.lastRevenueCheck,
      to: Date.now() / 1000
    }
  }
}

// Run every hour
setInterval(() => worker.submitRevenueToChain(), 60 * 60 * 1000)
```

#### Benefits
✅ Decentralized trigger mechanism (Chainlink Keeper network)
✅ Transparent revenue data on-chain
✅ Multiple oracle operators can submit data (reduces single point of failure)
✅ Auto-executes when conditions met

#### Drawbacks
⚠️ Still requires trusted oracle for Stripe data
⚠️ Oracle operator can submit false revenue data
⚠️ Gas costs for Chainlink upkeep

#### Cost Estimate
- Chainlink Automation: ~$5-20/month depending on check frequency
- Oracle submissions: ~$1-5 per submission (hourly = ~$150/month)

---

### Plan B: Multi-Signature Backend Control

**Best for**: MVP with enhanced security and transparency

#### Architecture
Backend proposes repayments, but requires multiple signatures to execute.

```solidity
// contracts/MultiSigRepayment.sol
pragma solidity ^0.8.19;

contract MultiSigRepayment {

  struct RepaymentProposal {
    address borrower;
    uint256 amount;
    uint256 stripeRevenue;
    bytes32 webhookHash;
    uint256 proposedAt;
    uint256 executedAt;
    bool executed;
    mapping(address => bool) signatures;
    uint256 signatureCount;
  }

  mapping(bytes32 => RepaymentProposal) public proposals;

  address public backend;
  address public auditor;
  uint256 public constant REQUIRED_SIGNATURES = 2; // 2-of-3
  uint256 public constant PROPOSAL_TIMEOUT = 24 hours;

  event RepaymentProposed(
    bytes32 indexed proposalId,
    address borrower,
    uint256 amount,
    uint256 revenue
  );

  event RepaymentSigned(
    bytes32 indexed proposalId,
    address signer
  );

  event RepaymentExecuted(
    bytes32 indexed proposalId,
    address borrower,
    uint256 amount
  );

  /**
   * @notice Backend proposes a repayment
   */
  function proposeRepayment(
    address borrower,
    uint256 amount,
    uint256 stripeRevenue,
    bytes32 webhookHash
  ) external onlyBackend returns (bytes32 proposalId) {

    proposalId = keccak256(abi.encodePacked(
      borrower,
      amount,
      stripeRevenue,
      webhookHash,
      block.timestamp
    ));

    RepaymentProposal storage proposal = proposals[proposalId];
    proposal.borrower = borrower;
    proposal.amount = amount;
    proposal.stripeRevenue = stripeRevenue;
    proposal.webhookHash = webhookHash;
    proposal.proposedAt = block.timestamp;

    // Backend signature counts as first signature
    proposal.signatures[msg.sender] = true;
    proposal.signatureCount = 1;

    emit RepaymentProposed(proposalId, borrower, amount, stripeRevenue);
  }

  /**
   * @notice Auditor or borrower signs the proposal
   */
  function signProposal(bytes32 proposalId) external {
    RepaymentProposal storage proposal = proposals[proposalId];

    require(!proposal.executed, "Already executed");
    require(
      msg.sender == auditor || msg.sender == proposal.borrower,
      "Not authorized"
    );
    require(!proposal.signatures[msg.sender], "Already signed");
    require(
      block.timestamp < proposal.proposedAt + PROPOSAL_TIMEOUT,
      "Proposal expired"
    );

    proposal.signatures[msg.sender] = true;
    proposal.signatureCount++;

    emit RepaymentSigned(proposalId, msg.sender);

    // Auto-execute if threshold reached
    if (proposal.signatureCount >= REQUIRED_SIGNATURES) {
      _executeRepayment(proposalId);
    }
  }

  function _executeRepayment(bytes32 proposalId) internal {
    RepaymentProposal storage proposal = proposals[proposalId];

    require(!proposal.executed, "Already executed");
    require(proposal.signatureCount >= REQUIRED_SIGNATURES, "Not enough signatures");

    proposal.executed = true;
    proposal.executedAt = block.timestamp;

    // Execute repayment using session key
    IERC20(USDC).transferFrom(
      proposal.borrower,
      address(this),
      proposal.amount
    );

    distributeFunds(proposal.amount);

    emit RepaymentExecuted(proposalId, proposal.borrower, proposal.amount);
  }
}
```

#### Backend Integration
```typescript
// backend/multi-sig-repayment.ts
app.post('/webhooks/stripe/payment', async (req) => {
  const payment = req.body

  // Calculate repayment
  const merchant = await getMerchant(payment.metadata.merchantId)
  const repayment = payment.amount * merchant.repaymentPercentage / 100
  const webhookHash = ethers.utils.keccak256(JSON.stringify(payment))

  // Propose to multi-sig contract
  const tx = await repaymentContract.proposeRepayment(
    merchant.walletAddress,
    parseUnits(repayment.toString(), 6),
    parseUnits(payment.amount.toString(), 6),
    webhookHash
  )

  const receipt = await tx.wait()
  const proposalId = receipt.events[0].args.proposalId

  // Notify auditor and borrower
  await notifyAuditor(proposalId, {
    borrower: merchant.walletAddress,
    amount: repayment,
    revenue: payment.amount,
    webhookData: payment
  })

  await notifyBorrower(merchant.email, {
    proposalId,
    amount: repayment,
    revenue: payment.amount
  })
})
```

#### Auditor Dashboard
```typescript
// frontend/AuditorDashboard.tsx
function AuditorDashboard() {
  const { data: proposals } = useQuery('pending-proposals',
    () => contract.getPendingProposals()
  )

  return (
    <div>
      <h1>Pending Repayment Proposals</h1>
      {proposals.map(proposal => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          onSign={async () => {
            await contract.signProposal(proposal.id)
          }}
        />
      ))}
    </div>
  )
}
```

#### Benefits
✅ Transparent on-chain proposal system
✅ Multiple parties verify calculations
✅ Borrower can approve/reject
✅ Auditor adds independent verification
✅ All data logged on-chain

#### Drawbacks
⚠️ Slower (requires multiple signatures)
⚠️ Still requires trusted backend and auditor
⚠️ More gas costs (multiple transactions)

---

### Plan C: On-Chain Revenue Attestations

**Best for**: High-trust merchants willing to self-report

#### Architecture
Merchants submit signed revenue statements directly on-chain.

```solidity
// contracts/SelfReportedRevenue.sol
pragma solidity ^0.8.19;

contract SelfReportedRevenue {

  struct RevenueReport {
    uint256 amount;
    uint256 periodStart;
    uint256 periodEnd;
    string source; // "stripe", "square", etc.
    bytes stripeSignature; // Signature from Stripe API
    uint256 submittedAt;
  }

  mapping(address => RevenueReport[]) public reports;
  mapping(address => uint256) public lastRepayment;

  // Stripe's public key for signature verification
  address public stripeVerifier;

  event RevenueReported(
    address indexed merchant,
    uint256 amount,
    uint256 periodStart,
    uint256 periodEnd,
    string source
  );

  /**
   * @notice Merchant submits revenue report with Stripe signature
   * @dev Automatically triggers repayment if valid
   */
  function submitRevenueAndRepay(
    uint256 revenue,
    uint256 periodStart,
    uint256 periodEnd,
    bytes calldata stripeSignature
  ) external {

    // Verify Stripe signed this revenue data
    require(
      verifyStripeSignature(
        msg.sender,
        revenue,
        periodStart,
        periodEnd,
        stripeSignature
      ),
      "Invalid Stripe signature"
    );

    // Store report
    reports[msg.sender].push(RevenueReport({
      amount: revenue,
      periodStart: periodStart,
      periodEnd: periodEnd,
      source: "stripe",
      stripeSignature: stripeSignature,
      submittedAt: block.timestamp
    }));

    emit RevenueReported(msg.sender, revenue, periodStart, periodEnd, "stripe");

    // Calculate repayment
    Loan memory loan = loans[msg.sender];
    uint256 repayment = (revenue * loan.repaymentPercentage) / 10000;

    // Execute repayment using session key
    executeRepayment(msg.sender, repayment);

    lastRepayment[msg.sender] = block.timestamp;
  }

  function verifyStripeSignature(
    address merchant,
    uint256 revenue,
    uint256 periodStart,
    uint256 periodEnd,
    bytes calldata signature
  ) internal view returns (bool) {

    bytes32 message = keccak256(abi.encodePacked(
      merchant,
      revenue,
      periodStart,
      periodEnd
    ));

    bytes32 ethSignedMessage = keccak256(abi.encodePacked(
      "\x19Ethereum Signed Message:\n32",
      message
    ));

    address signer = recoverSigner(ethSignedMessage, signature);

    return signer == stripeVerifier;
  }
}
```

#### Stripe Integration (Hypothetical)
```typescript
// This would require Stripe to support signing revenue data
// Currently NOT supported by Stripe API

// Hypothetical API endpoint
const revenueAttestation = await stripe.attestations.create({
  merchant_id: merchantId,
  period_start: startTimestamp,
  period_end: endTimestamp,
  chain: 'base',
  merchant_address: '0x...'
})

// Returns signed attestation
{
  revenue: 150000, // $1,500.00
  period_start: 1234567890,
  period_end: 1234654290,
  signature: '0xabc123...' // Stripe's signature
}
```

#### Benefits
✅ Fully on-chain revenue data
✅ Cryptographically verified by Stripe
✅ No backend needed
✅ Maximum transparency

#### Drawbacks
❌ **Stripe doesn't support this** (deal-breaker for now)
❌ Would require partnership with Stripe/Square
❌ Merchants must manually submit (friction)

---

### Plan D: Crypto-Native Revenue (Full Decentralization)

**Best for**: Merchants accepting crypto payments only

#### Architecture
Merchant's smart wallet automatically splits incoming payments.

```solidity
// contracts/AutoSplitWallet.sol
pragma solidity ^0.8.19;

contract AutoSplitMerchantWallet {

  address public merchant;
  address public loanContract;
  uint256 public repaymentPercentage; // basis points (1000 = 10%)

  event PaymentReceived(
    address indexed from,
    uint256 amount,
    uint256 repaymentAmount,
    uint256 merchantAmount
  );

  /**
   * @notice Automatically splits incoming USDC payments
   * @dev 10% to loan repayment, 90% to merchant
   */
  function receivePayment(uint256 amount) external {
    // Transfer USDC from customer to this wallet
    IERC20(USDC).transferFrom(msg.sender, address(this), amount);

    // Calculate split
    uint256 repayment = (amount * repaymentPercentage) / 10000;
    uint256 merchantAmount = amount - repayment;

    // Send repayment to loan contract
    IERC20(USDC).transfer(loanContract, repayment);

    // Send remainder to merchant
    IERC20(USDC).transfer(merchant, merchantAmount);

    emit PaymentReceived(msg.sender, amount, repayment, merchantAmount);
  }
}
```

#### Benefits
✅ **Fully trustless** - no backend, no oracle
✅ **Instant** - repayment on every sale
✅ **Transparent** - all on-chain
✅ **No gas for borrower** - customer pays gas

#### Drawbacks
❌ Only works for crypto-native merchants
❌ Doesn't integrate with Stripe/Square
❌ Customers must have crypto wallets

---

## Comparison Matrix

| Plan | Decentralization | Stripe Integration | Gas Costs | Implementation Complexity | Best For |
|------|------------------|-------------------|-----------|--------------------------|----------|
| **A: Chainlink** | ⭐⭐⭐⭐ | ✅ Via Oracle | Medium | High | Production |
| **B: Multi-Sig** | ⭐⭐⭐ | ✅ Direct | Medium | Medium | MVP with security |
| **C: Attestations** | ⭐⭐⭐⭐⭐ | ❌ Not supported | Low | Blocked | Future (if Stripe adds) |
| **D: Crypto-Native** | ⭐⭐⭐⭐⭐ | ❌ N/A | Low | Low | Crypto-only merchants |

---

## Recommended Implementation Path

### Phase 2A: Multi-Sig Backend (Months 1-3)
**Why**: Quick to implement, adds transparency and security

1. Deploy multi-sig contract
2. Onboard independent auditor
3. Build auditor dashboard
4. Enable borrower approval/rejection

### Phase 2B: Chainlink Integration (Months 4-6)
**Why**: Decentralized triggers, production-ready

1. Build Stripe Oracle contract
2. Set up Chainlink Automation
3. Deploy oracle worker (off-chain)
4. Migrate from multi-sig to Chainlink

### Phase 2C: Hybrid Approach (Months 7+)
**Why**: Best of both worlds

1. Chainlink for automatic triggers
2. Multi-sig for large repayments (>$1K)
3. Crypto-native option for crypto merchants
4. Dispute mechanism for borrowers

---

## Trust Minimization Strategy

Even with centralized components, you can minimize trust:

### 1. Transparent Logging
```solidity
event RepaymentCalculated(
  address indexed borrower,
  uint256 stripeRevenue,
  uint256 calculatedRepayment,
  bytes32 stripeWebhookHash,
  uint256 timestamp
);

// Anyone can verify calculations off-chain
```

### 2. Dispute Mechanism
```solidity
function disputeRepayment(bytes32 repaymentId, string calldata reason) external {
  require(msg.sender == borrower, "Not borrower");

  disputes[repaymentId] = Dispute({
    status: PENDING,
    reason: reason,
    createdAt: block.timestamp
  });

  // Pause future repayments until resolved
  pauseRepayments(msg.sender);

  emit DisputeCreated(repaymentId, reason);
}
```

### 3. Rate Limiting
```solidity
// Prevent backend from draining wallet
mapping(address => uint256) public monthlyRepayments;

function executeRepayment(address borrower, uint256 amount) internal {
  uint256 thisMonth = block.timestamp / 30 days;

  require(
    monthlyRepayments[borrower] + amount <= sessionKey.maxPerMonth,
    "Monthly limit exceeded"
  );

  monthlyRepayments[borrower] += amount;
  // ... continue execution
}
```

### 4. Emergency Stop
```solidity
function emergencyPause() external onlyBorrower {
  paused[msg.sender] = true;

  emit EmergencyPause(msg.sender, block.timestamp);
}
```

---

## Conclusion

**For Phase 2, we recommend**:
1. Start with **Plan B (Multi-Sig)** for immediate security improvements
2. Transition to **Plan A (Chainlink)** for decentralized triggers
3. Keep **Plan D (Crypto-Native)** as option for crypto merchants
4. Monitor **Plan C (Attestations)** in case Stripe adds support

All plans maintain **non-custodial** architecture while improving decentralization of revenue verification and repayment triggers.
