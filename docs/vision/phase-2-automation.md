# Phase 2: Technical Implementation

**Status:** Future
**Timeline:** 2026-2027
**Prerequisites:** Phase 1 validated (pools active, cashflow underwriting proven, 85%+ repayment)

---

{% hint style="info" %}
**For High-Level Overview**

This page contains technical implementation details for Phase 2.

For vision, goals, and roadmap → [lendfriend.org/vision](https://lendfriend.org/vision)
{% endhint %}

---

## Overview

Phase 2 automates loan repayment using account abstraction (smart wallets) and merchant revenue integrations, removing manual repayment friction.

**Technical focus:** ERC-4337 payment stream plugins, Square/Shopify API integrations for revenue-based repayment, automated deduction logic.

---

## Automated Repayment Architecture

### Wallet-Based Auto-Repayment

**Target users:** Crypto-native earners (DAO contributors, protocol developers, NFT creators)

**Mechanism:** Smart wallet plugin automatically deducts percentage of incoming USDC/stablecoin transfers and routes to loan contract.

**Technical implementation:**

```typescript
interface AutoRepaymentConfig {
  loanAddress: string;
  walletAddress: string;
  deductionPercentage: number;  // e.g., 10 = 10%
  minTransactionAmount: number;  // Don't deduct from transfers < $X
  whitelistedSources?: string[];  // Only deduct from these addresses
  maxMonthlyDeduction?: number;  // Cap monthly auto-deduction
  pausable: boolean;
}

// ERC-4337 UserOperation plugin
contract AutoRepaymentPlugin {
  mapping(address => AutoRepaymentConfig) public configs;

  // Executes on every incoming USDC transfer
  function afterTransfer(
    address from,
    address to,
    uint256 amount
  ) external {
    AutoRepaymentConfig memory config = configs[to];
    if (!config.enabled) return;

    // Check if transfer qualifies for deduction
    if (amount < config.minTransactionAmount) return;
    if (config.whitelistedSources.length > 0 && !isWhitelisted(from)) return;

    // Calculate deduction
    uint256 deductionAmount = (amount * config.deductionPercentage) / 100;

    // Check monthly cap
    if (config.maxMonthlyDeduction > 0) {
      uint256 thisMonthDeducted = getMonthlyDeducted(to);
      if (thisMonthDeducted + deductionAmount > config.maxMonthlyDeduction) {
        deductionAmount = config.maxMonthlyDeduction - thisMonthDeducted;
      }
    }

    // Execute repayment
    if (deductionAmount > 0) {
      USDC.transfer(config.loanAddress, deductionAmount);
      emit AutoRepayment(to, config.loanAddress, deductionAmount);
    }
  }

  function pause() external;
  function resume() external;
  function updateConfig(AutoRepaymentConfig calldata newConfig) external;
}
```

**Setup flow:**
1. User approves loan with auto-repayment option
2. Smart wallet plugin installed (one-time approval)
3. Configure: deduction %, sources, caps
4. Plugin activates upon loan disbursement
5. Automatic deduction on each qualifying income transfer

**Safety features:**
- Minimum transaction threshold (don't deduct from small transfers)
- Monthly deduction cap (prevent over-deduction)
- Source whitelist (only deduct from known income sources)
- Pause/resume controls (user can stop anytime)
- Emergency circuit breaker (protocol can disable if bug detected)

### Merchant Revenue-Based Repayment

**Target users:** Small merchants (Square, Shopify, physical retail)

**Mechanism:** Daily automated deduction of percentage of merchant sales revenue, transferred to loan contract.

**Technical implementation (Square):**

```typescript
interface MerchantRepaymentConfig {
  loanAddress: string;
  merchantId: string;
  squareAccessToken: string;  // Encrypted OAuth token
  repaymentPercentage: number;  // e.g., 5 = 5% of daily sales
  minDailyDeduction: number;  // Minimum deduction per day
  maxDailyDeduction: number;  // Cap daily deduction
  refundBuffer: number;  // Reserve % for potential refunds (e.g., 10%)
}

// Off-chain service (runs daily)
async function processSquareMerchantRepayment(config: MerchantRepaymentConfig) {
  // Fetch yesterday's settled sales
  const sales = await square.listPayments({
    begin_time: yesterday(),
    end_time: today(),
    status: 'COMPLETED'
  });

  // Calculate total revenue (minus refunds)
  const totalRevenue = sales.reduce((sum, payment) => sum + payment.amount, 0);
  const refunds = await square.listRefunds({ date: yesterday() });
  const netRevenue = totalRevenue - refunds.total;

  // Calculate repayment amount
  let repaymentAmount = (netRevenue * config.repaymentPercentage) / 100;

  // Apply refund buffer
  repaymentAmount = repaymentAmount * (1 - config.refundBuffer / 100);

  // Apply min/max caps
  repaymentAmount = Math.max(config.minDailyDeduction, repaymentAmount);
  repaymentAmount = Math.min(config.maxDailyDeduction, repaymentAmount);

  // Execute transfer
  if (repaymentAmount > 0) {
    // Option A: ACH from Square balance to protocol bank account → convert to USDC → repay loan
    await initiateACH(config.merchantId, repaymentAmount);

    // Option B (future): Square crypto balance → direct USDC transfer
    // await square.transferCrypto(config.merchantId, config.loanAddress, repaymentAmount);

    // Record on-chain
    await loanContract.recordRepayment(config.loanAddress, repaymentAmount);
  }
}
```

**Daily process:**
1. Cron job runs at 2am (after sales settle)
2. Query Square API for previous day's sales
3. Calculate net revenue (sales - refunds)
4. Apply repayment % with refund buffer
5. Initiate ACH transfer from Square balance
6. Convert fiat to USDC (if needed)
7. Record repayment on-chain

**Challenges and mitigations:**

| Challenge | Mitigation |
|-----------|------------|
| Sales take 1-2 days to settle | Use settled funds only, not pending |
| Refunds reverse revenue after deduction | Apply 10% refund buffer to calculations |
| Chargebacks claw back funds | Reserve final 10% of loan, manual settlement |
| ACH delays (2-3 days) | Acceptable; repayment timing not critical |
| Square API limits | Rate limiting, retry logic, error handling |

**Economics vs. Merchant Cash Advances:**
- MCA factor rate: 1.4x = $14K repaid on $10K borrowed = 140% in 6 months = ~280% APR
- LendFriend: 12% APR = $10,600 repaid on $10K over 6 months
- Savings: ~268% APR reduction for merchants

---

## Infrastructure Requirements

### ERC-4337 Account Abstraction

**Current state (2024-2025):**
- ERC-4337 live on mainnet and L2s
- Smart wallets: Safe, Argent, Coinbase Smart Wallet, Privy
- Payment stream plugins: Conceptual, not standardized
- Adoption: <5% of wallets are smart accounts

**Technical requirements for Phase 2:**

```solidity
// IPaymentStreamPlugin interface (to be standardized)
interface IPaymentStreamPlugin {
  struct StreamConfig {
    address recipient;
    uint256 percentage;  // Basis points (e.g., 1000 = 10%)
    uint256 minAmount;
    uint256 maxMonthly;
    address[] whitelistedSources;
    bool active;
  }

  function createStream(StreamConfig calldata config) external;
  function pauseStream(uint256 streamId) external;
  function resumeStream(uint256 streamId) external;
  function closeStream(uint256 streamId) external;

  // Called by smart wallet on every incoming transfer
  function afterTransfer(address from, uint256 amount) external;
}
```

**Maturity timeline:**
- **2026 Q1-Q2:** Partner with one wallet (likely Safe or Privy) for POC
- **2026 Q3-Q4:** Propose ERC for payment stream standard
- **2027:** Multi-wallet support as standard gains adoption

**Fallback:** ERC-20 recurring approvals (user approves, contract pulls monthly). Less seamless but works today.

### Square API Integration

**API:** Square REST API v2 (Payments, Merchants, OAuth)
**Access level:** Read-only sales data + transfer permissions

**Integration components:**

| Component | Implementation | Status |
|-----------|---------------|--------|
| OAuth authorization | Square Connect OAuth 2.0 | Documented, stable |
| Payment data | GET /v2/payments (read sales) | Available |
| Transfer capability | POST /v2/transfers (future) | Not yet available |
| ACH fallback | Stripe Connect → ACH → convert to USDC | Available today |

**Implementation phases:**

**Phase 2a (Launch):** ACH-based repayment
```typescript
// Daily cron job
async function processMerchantRepayments() {
  const merchants = await getMerchantsWithActiveLoans();

  for (const merchant of merchants) {
    // Fetch settled sales
    const sales = await square.listPayments({
      merchant_id: merchant.squareId,
      begin_time: yesterday(),
      status: 'COMPLETED'
    });

    // Calculate repayment
    const netSales = calculateNetSales(sales);  // Sales - refunds
    const repayment = netSales * merchant.repaymentRate * 0.9;  // 10% refund buffer

    // Initiate ACH transfer
    await stripe.createTransfer({
      amount: repayment,
      destination: protocolBankAccount,
      metadata: { merchant_id: merchant.id, loan_address: merchant.loanAddress }
    });

    // Convert fiat → USDC (Coinbase Commerce or Circle)
    const usdc = await convertToUSDC(repayment);

    // Record on-chain
    await loanContract.recordRepayment(merchant.loanAddress, usdc);
  }
}
```

**Phase 2b (Future):** Direct crypto transfer (if Square adds crypto balance support)
```typescript
// If Square enables USDC balance
const transfer = await square.createCryptoTransfer({
  merchant_id: merchant.squareId,
  amount_usdc: repaymentAmount,
  destination_address: merchant.loanAddress,
  chain: 'base'
});
```

### Shopify API Integration

**API:** Shopify Admin API (GraphQL)
**Access level:** Shopify App + merchant authorization
**Status:** More complex than Square (requires app approval process)

**Current challenges:**
- App review process (2-4 weeks)
- Limited financial data access without Shopify Payments
- No direct transfer API (ACH fallback required)
- Crypto wallet features experimental

**Integration approach:**

**Phase 2a (2026):** Manual verification + ACH
```typescript
// GraphQL query for order data
const ORDERS_QUERY = `
  query($startDate: DateTime!) {
    orders(query: "created_at:>$startDate") {
      edges {
        node {
          id
          totalPriceSet { shopMoney { amount } }
          displayFinancialStatus
          refunds { id, totalRefunded }
        }
      }
    }
  }
`;

// Weekly calculation (manual ACH initiation)
async function calculateShopifyRepayment(merchant: Merchant) {
  const orders = await shopify.graphql(ORDERS_QUERY, { startDate: lastWeek() });

  const netRevenue = orders.reduce((sum, order) => {
    const refunded = order.refunds.reduce((r, refund) => r + refund.totalRefunded, 0);
    return sum + (order.totalPrice - refunded);
  }, 0);

  const repayment = netRevenue * merchant.repaymentRate;

  // Send email to merchant: "Approve ACH transfer of $X"
  await sendRepaymentRequest(merchant, repayment);
}
```

**Phase 2b (2027+):** Crypto-native (if Shopify ships wallet features)
- Shopify Payments settles in USDC
- Direct on-chain transfer to loan contract
- Same mechanism as wallet auto-repayment

**Monitoring:** Shopify's crypto roadmap (Tobi Lütke publicly crypto-positive, likely to ship wallet features)

### Payment Rails Convergence

**Current:** Crypto (instant, on-chain) vs. Fiat (ACH, slow, off-chain)

**Trend:** Stablecoin merchant payment adoption (Stripe crypto, Coinbase Commerce, Shopify crypto wallets)

**Impact on Phase 2:**
- If merchants accept USDC: Direct on-chain repayment (no ACH conversion)
- Unified repayment mechanism for all income types (crypto + merchant)
- Reduced friction and cost

**Timeline bet:** Significant stablecoin ecommerce adoption by 2027-2028

---

## Technical Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| ERC-4337 adoption insufficient | Medium | Fallback to ERC-20 recurring approvals (user approves, contract pulls monthly) |
| Square/Shopify API restrictions | Medium | Start with manual merchant verification; pivot to crypto-native merchants only if needed |
| Low borrower auto-repay adoption | Low | Make optional; incentivize with 0.5% rate discount; provide pause/control features |
| Payment stream standard not adopted | High | Build custom plugin for POC; propose ERC standard; expand as wallets adopt |
| Merchant API changes break integration | Medium | Version API calls; monitor changelogs; maintain ACH fallback path |

---

## Success Metrics

**Quantitative targets:**
- 50%+ of new loans opt into auto-repayment
- 30% reduction in default rate (auto-repay vs. manual)
- $5M+ in merchant loans originated
- 100,000+ active users
- $10M+ TVL in liquidity pools
- <2% auto-repay system failures (bugs, missed deductions)

**Technical validation:**
- Payment stream plugin successfully deployed on 2+ wallet providers
- Merchant integration processes 90%+ of repayments automatically (minimal manual intervention)
- Auto-repay borrowers complete loans 20%+ faster than manual borrowers
- Smart contract gas costs <$5 per auto-repay transaction on Base L2

**Key milestone:** 50%+ auto-repay adoption with 30%+ default reduction proves automated repayment creates superior lending infrastructure.

---

## Related Documentation

**High-level context:**
- [Vision & roadmap](https://lendfriend.org/vision) — The future we're building
- [Phase 0 implementation](phase-0-social-trust.md) — Social trust foundation
- [Phase 1 implementation](phase-1-cashflow.md) — Cashflow verification and pools

**Technical deep dives:**
- [Smart Contract Reference](../developers/contract-api.md) — API documentation
- [Risk Scoring](../how-it-works/risk-scoring/README.md) — Complete risk model
