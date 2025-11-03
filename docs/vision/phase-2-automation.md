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

**Proposed smart contract architecture:**

**Configuration parameters:**
- Loan contract address
- Wallet address
- Deduction percentage (e.g., 10%)
- Minimum transaction amount (threshold)
- Whitelisted source addresses (optional)
- Maximum monthly deduction cap (optional)
- Pausable flag

**Plugin logic (ERC-4337 hook):**
- Triggered on every incoming USDC transfer to wallet
- Check if config enabled and transfer qualifies
- Verify minimum transaction amount threshold
- Verify source is whitelisted (if whitelist configured)
- Calculate deduction amount (percentage of transfer)
- Check monthly cap, adjust if needed
- Execute transfer from wallet to loan contract
- Emit repayment event

**Core functions (proposed):**
- `afterTransfer()` - Hook executed on incoming transfers
- `pause()` - User pauses auto-repayment
- `resume()` - User resumes auto-repayment
- `updateConfig()` - Modify deduction percentage, caps, whitelist

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

**Proposed configuration:**
- Loan contract address
- Merchant ID and encrypted Square OAuth token
- Repayment percentage (e.g., 5% of daily sales)
- Minimum and maximum daily deduction caps
- Refund buffer percentage (e.g., 10%)

**Proposed daily automation process:**
1. Cron job runs daily at 2am (after sales settle)
2. Query Square API for previous day's settled sales
3. Fetch refund data for the same period
4. Calculate net revenue: `sales - refunds`
5. Calculate repayment: `netRevenue × repaymentPercentage × (1 - refundBuffer)`
6. Apply min/max caps to repayment amount
7. Execute transfer:
   - **Option A (Phase 2 launch):** ACH from Square → protocol bank → convert to USDC → record on-chain
   - **Option B (future):** Square crypto balance → direct USDC transfer (if Square adds crypto)
8. Record repayment on loan contract

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

**Proposed payment stream plugin interface:**

**Stream configuration:**
- Recipient address (loan contract)
- Deduction percentage (basis points, e.g., 1000 = 10%)
- Minimum transaction amount
- Maximum monthly deduction cap
- Whitelisted source addresses
- Active/paused status

**Core functions:**
- `createStream()` - Configure new payment stream
- `pauseStream()` - Temporarily pause stream
- `resumeStream()` - Resume paused stream
- `closeStream()` - Terminate stream permanently
- `afterTransfer()` - Hook called on every incoming transfer

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

**Proposed implementation phases:**

**Phase 2a (Launch):** ACH-based repayment
- Daily cron job processes all merchants with active loans
- For each merchant:
  1. Fetch settled sales from Square API (yesterday's transactions, status = COMPLETED)
  2. Calculate net sales (sales - refunds)
  3. Calculate repayment: `netSales × repaymentRate × 0.9` (10% refund buffer)
  4. Initiate ACH transfer via Stripe Connect (Square balance → protocol bank account)
  5. Convert fiat to USDC (via Coinbase Commerce or Circle)
  6. Record repayment on loan contract

**Phase 2b (Future):** Direct crypto transfer (if Square adds crypto balance support)
- Square enables USDC balance for merchants
- Direct transfer from Square crypto balance to loan contract address
- No ACH conversion needed
- Instant settlement on Base L2

### Shopify API Integration

**API:** Shopify Admin API (GraphQL)
**Access level:** Shopify App + merchant authorization
**Status:** More complex than Square (requires app approval process)

**Current challenges:**
- App review process (2-4 weeks)
- Limited financial data access without Shopify Payments
- No direct transfer API (ACH fallback required)
- Crypto wallet features experimental

**Proposed integration approach:**

**Phase 2a (2026):** Manual verification + ACH
- Use Shopify Admin GraphQL API to query order data
- Fetch orders created after last repayment date
- Extract: order ID, total price, financial status, refunds
- Calculate net revenue: `sum(orders.totalPrice) - sum(refunds.totalRefunded)`
- Calculate weekly repayment: `netRevenue × repaymentRate`
- Send email to merchant to approve ACH transfer
- Manual ACH initiation (less automated than Square)

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
