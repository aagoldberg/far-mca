# Phase 1: Technical Implementation

**Status:** Planned
**Timeline:** 2025-2026
**Prerequisites:** Phase 0 success (100+ loans, 3-6 months repayment data, 85%+ repayment rate)

---

{% hint style="info" %}
**For High-Level Overview**

This page contains technical implementation details for Phase 1.

For vision, goals, and roadmap → [lendfriend.org/vision](https://lendfriend.org/vision)
{% endhint %}

---

## Overview

Phase 1 adds cashflow verification to the social trust foundation from Phase 0, enabling larger loans ($5K-$50K+) funded by liquidity pools.

**Technical focus:** API integrations for income verification, liquidity pool smart contracts, hybrid risk scoring, and cross-platform expansion.

---

## System Architecture

**Technical parameters:**
- Loan sizes: $5,000 - $50,000+
- Interest: 0-8% APR (market-determined via pool supply/demand)
- Repayment: Installment-based (monthly) or single maturity
- Verification methods: Plaid (bank accounts), Square/Shopify (merchant revenue), on-chain wallet analysis

**Loan flow:**
1. User completes social trust verification (Phase 0) + cashflow verification (new)
2. Hybrid risk score calculated (social + financial signals)
3. Loan offer generated (amount, rate, terms) based on score
4. User accepts → funds disbursed from liquidity pool
5. Repayment tracked on-chain, builds credit history

---

## Cashflow Verification Methods

### Bank Account Verification (Plaid)

**API:** Plaid REST API
**Data accessed:**
- Transaction history (90-730 days)
- Account balances and balance trends
- Direct deposit patterns (employment verification)
- Debt service coverage ratio calculation

**Proposed flow:**
1. User initiates Plaid Link OAuth flow
2. Grant read-only access to transaction history (90-730 days)
3. Backend fetches transactions via Plaid API
4. Calculate income metrics:
   - Monthly average income from deposits
   - Income stability score (consistency over time)
   - Debt-to-income ratio estimation
5. Create privacy-preserving attestation with income range buckets
6. Store attestation hash on IPFS
7. Expire verification after 90 days (requires renewal)

**Data structure (proposed):**
- User ID + encrypted Plaid access token
- Verification data: monthly income, stability score, account age, DTI ratio
- Attestation: Income range (e.g., "$3K-$5K/month"), verification timestamp, method
- IPFS CID for attestation
- Expiration timestamp

**Privacy model:**
- OAuth grants read-only access (user controls scope)
- Attestations store income ranges, not exact amounts
- Raw transaction data never stored on-chain
- Time-limited tokens (90-day expiry, revocable)

### Merchant Revenue Verification (Square)

**API:** Square REST API (v2)
**Data accessed:**
- Payment history (sales transactions)
- Transaction count and average ticket size
- Refund and chargeback rates
- Daily/weekly/monthly revenue aggregates

**Proposed OAuth flow:**
1. User clicks "Verify Square Account"
2. Redirected to Square authorization page
3. User grants read-only payment data access
4. Redirected back with auth code
5. Backend exchanges auth code for access token
6. Fetch payment data (last 6 months) via Square Payments API
7. Calculate revenue metrics and create attestation

**Metrics calculated:**
- Average monthly revenue
- Revenue growth rate (last 3 months)
- Transaction volume and average ticket size
- Refund rate (percentage of transactions refunded)

**Data structure (proposed):**
- User ID + merchant ID + encrypted Square access token
- Verification data: avg monthly revenue, revenue growth, transaction volume, ticket size, refund rate
- Attestation: Revenue range bucket, merchant type, verification timestamp
- IPFS CID for attestation
- Expiration (90 days)

---

### Merchant Revenue Verification (Shopify)

**API:** Shopify Admin API (GraphQL)
**Status:** Planned (more complex integration than Square)
**Data accessed:**
- Order history and revenue
- Inventory turnover
- Customer lifetime value
- Gross margins

**Implementation approach:**

**Phase 1a (Initial):** Manual verification
- Merchants upload sales reports (CSV export)
- Manual review and attestation creation
- Validates demand before building full integration

**Phase 1b (API Integration):**
- OAuth connection to Shopify Admin API
- GraphQL queries for order data
- Automated attestation generation
- Similar flow to Square implementation

**Challenges:**
- Requires Shopify app approval process
- API access restrictions for financial data
- ACH rails needed for fiat repayment (Phase 2)

**Opportunity:**
- Shopify expanding crypto wallet support
- Potential partnership as early crypto lending integration
- Future: USDC-based revenue → direct loan repayment

### On-Chain Income Verification

**Data source:** Base L2 blockchain (primary), Ethereum mainnet (secondary)
**Implementation:** Wallet connection (already available in Phase 0)

**Data analyzed:**
- Transaction history (incoming transfers, frequencies)
- Token receipts (USDC, ETH, other ERC-20s)
- DeFi protocol interactions (yield farming, staking rewards)
- NFT sales and creator royalties
- DAO treasury payments

**Proposed analysis flow:**
1. Fetch wallet transaction history (last 6 months)
2. Classify transactions by type (recurring vs. one-time)
3. Identify recurring payment sources (DAO treasuries, protocol addresses)
4. Calculate income stability score based on consistency
5. Sum total monthly income with weighted categories

**Income classification:**
- Recurring income (DAO salaries, protocol fees): 100% weight
- DeFi yield (consistent for 3+ months): 75% weight
- NFT sales and one-time payments: 25% weight

**Data structure (proposed):**
- Wallet address
- Recurring income streams: frequency (daily/weekly/monthly), average amount, source addresses
- One-time income events: type, amount, timestamp
- Total monthly income (weighted)
- Income stability score (0-100)

**Enhanced signals:**
- ENS domain ownership (identity verification)
- POAP attendance (community participation)
- DAO governance participation (reputation)
- On-chain transaction history (account age, activity level)

---

## Liquidity Pool Architecture

Phase 1 introduces liquidity pools for passive capital deployment, enabled by standardized cashflow verification and risk scoring.

### Smart Contract Design

**Proposed pool tiers:**

| Pool | Risk Levels Accepted | Target APY | Reserve Ratio |
|------|---------------------|-----------|---------------|
| Conservative | LOW only (score 75+) | 4-6% | 10% |
| Balanced | LOW + MEDIUM (50+) | 6-8% | 15% |
| Aggressive | All tiers (40+) | 8-12% | 20% |

**Smart contract architecture (proposed):**

**State variables:**
- USDC token address (immutable)
- Total deposits, total lent, total repaid
- Reserve ratio (basis points)
- Lender deposits and LP share mappings
- Active loans list and approval mapping

**Core functions:**
- `deposit()` - Lenders deposit USDC, receive LP tokens
- `withdraw()` - Burn LP tokens, receive USDC (if liquidity available)
- `claimYield()` - Claim accrued interest
- `fundLoan()` - Protocol-only, disburse to approved loan
- `recordRepayment()` - Record loan repayment to pool
- `recordDefault()` - Handle defaults, spread losses

**Lender flow:**
1. Deposit USDC → Receive LP tokens proportional to pool share
2. Yield accrues as loans are repaid with interest
3. Withdraw LP tokens → Burn tokens, receive USDC (if liquidity available)
4. Defaults reduce pool value, spread across all LP holders

**Borrower flow:**
1. Complete verification (social trust + cashflow)
2. Off-chain risk engine calculates score and loan offer
3. Accept offer → Protocol calls `fundLoan()`
4. USDC disbursed from pool to loan contract
5. Repayments flow back to pool

**Economics:**
- Interest rate = f(utilization rate, pool risk tier, market demand)
- Utilization rate = totalLent / totalDeposits
- Target: 70-80% utilization (balance yield vs. liquidity)
- Platform fee: 1-2% of interest paid (funds protocol treasury)
- LP yield = (interest + tips - defaults - fee) / totalDeposits

---

## Hybrid Risk Scoring

Phase 1 combines social trust (Phase 0) with cashflow data for multi-signal risk assessment.

### Component Weighting by Loan Size

| Loan Amount | Social Trust | Cashflow | Repayment History | Loan Size Risk |
|-------------|--------------|----------|-------------------|----------------|
| $100-$5K | 50% | 20% | 20% | 10% |
| $5K-$25K | 30% | 40% | 20% | 10% |
| $25K-$50K+ | 15% | 50% | 30% | 5% |

**Rationale:** Small loans weight social trust higher; large loans require stronger cashflow verification.

### Risk Score Calculation

**Input signals:**

1. **Repayment History:**
   - Completed loans count
   - On-time payment rate (%)
   - Average tip rate (%) on past loans
   - Number of defaults

2. **Social Trust:**
   - Effective mutual connections (Adamic-Adar weighted)
   - Social distance score (0-100)
   - Platform quality (Neynar score, Power Badge, account age)

3. **Cashflow Verification:**
   - Monthly income amount
   - Income stability score (0-100)
   - Debt-to-income ratio (if available)
   - Verification method (plaid/square/shopify/onchain)

4. **Loan Size:**
   - Requested loan amount

**Proposed calculation algorithm:**
1. Calculate component scores (0-100 for each signal category)
2. Get weights based on loan amount (see table above)
3. Compute weighted average: `score = (repayment × wR) + (social × wS) + (cashflow × wC) - (loanSize × wL)`
4. Determine risk tier based on total score
5. Calculate interest rate based on tier and loan amount
6. Calculate max loan amount based on score and monthly income

**Output:**
- Total risk score (0-100)
- Risk tier (AAA/AA/A/BBB/DECLINE)
- Interest rate (APR %)
- Maximum approved loan amount
- Component breakdown (repayment, social, cashflow, loan size scores)

### Risk Tiers

| Tier | Score Range | Interest Rate | Pool Access |
|------|-------------|---------------|-------------|
| AAA | 90-100 | 0-4% APR | All pools |
| AA | 75-89 | 4-6% APR | All pools |
| A | 60-74 | 6-8% APR | Balanced, Aggressive |
| BBB | 40-59 | 8-12% APR | Aggressive only |
| DECLINE | Below 40 | N/A | Not funded |

### Model Evolution

**Phase 1 launch:** Conservative weighting, prioritize social trust + cashflow equally

**After 100+ loans:** Increase repayment history weight to 30-40%, refine cashflow thresholds

**Continuous:** A/B test weighting schemes, track default correlation with signals, adjust model quarterly

---

## Platform Expansion

### Web Application Enhancements

**Existing:** Next.js web app at lendfriend.org (Phase 0)

**Phase 1 additions:**
- Social login expansion (Google, Twitter, email via Privy)
- Fiat onramps (Coinbase Pay, Privy fiat-to-crypto)
- Cross-platform sharing (12+ platforms via Web Share API)
- Liquidity pool dashboard for lenders
- Advanced loan filtering and discovery

**Proposed viral mechanics:**
- Shareable loan links: `lendfriend.org/loan/{loanAddress}`
- Open Graph metadata with borrower name, loan amount, trust score
- Native Web Share API for mobile sharing
- Social share targets: WhatsApp, Twitter, Telegram, Facebook, etc.

**User acquisition flow:**
1. Borrower creates loan, shares link to non-crypto network
2. Friends click link → loan page with trust score displayed
3. Contribute via credit card (Privy converts to USDC)
4. Embedded wallet created automatically (progressive onboarding)

---

### Social Platform Integration

**Phase 1 scope:** Farcaster (primary), Bluesky (planned Q4 2025)

**Bluesky integration:**

| Feature | Implementation | Timeline |
|---------|---------------|----------|
| Identity verification | AT Protocol DID resolution | Q4 2025 |
| Social graph | Mutual connections via API | Q4 2025 |
| Domain verification | Check handle = domain ownership | Q4 2025 |
| Quality scoring | Account age, engagement, verification | Q4 2025 |

**Trust model weights (Bluesky):**
- Social trust: 10% lower than Farcaster (40% → 30% for small loans)
- Cashflow verification: 10% higher weight required
- Domain verification bonus: +5 points to social score
- Cross-platform: +10 points if same user verified on Farcaster + Bluesky

**Proposed implementation flow:**
1. User connects Bluesky account
2. Resolve AT Protocol DID from handle
3. Fetch profile data (followers, following, posts, account age)
4. Check domain verification (handle === owned domain)
5. Calculate social trust score (similar to Farcaster, adjusted weights)
6. Store identity verification

**Data structure (proposed):**
- AT Protocol DID
- Handle and display name
- Domain verification status
- Follower/following counts
- Post count and account age
- Social graph (mutual connections)

**Twitter/X:** Delayed to Phase 2+ due to bot prevalence and low signal quality

---

## Technical Implementation Challenges

### Cashflow Attestation Architecture

**Phase 1a (MVP):** Direct API integration with off-chain attestation storage

**Attestation data structure (proposed):**
- User ID
- Verification method (plaid/square/shopify/onchain)
- Income range bucket (e.g., "$3K-$5K/month")
- Verification timestamp
- Expiration timestamp
- IPFS hash of attestation
- Protocol signature

**Phase 1b (Future):** Decentralized attestations via Chainlink or zkTLS

- Chainlink Functions: Trigger off-chain API calls, return data on-chain
- zkTLS (Reclaim Protocol): Prove API responses cryptographically without revealing data
- Trade-off: Complexity vs. decentralization

**Approach:** Ship Phase 1a (centralized attestations), evaluate demand for Phase 1b

---

### Smart Contract Migration

**Phase 0 contracts:** MicroLoan.sol (single maturity, 0% interest)

**Phase 1 requirements:**
- Interest calculation (APR-based accrual)
- Installment schedules (monthly repayments)
- Variable rates (tier-based pricing)
- Liquidity pool integration

**New contracts:**

| Contract | Purpose | Complexity |
|----------|---------|-----------|
| LoanV2.sol | Installment loans with interest | Medium |
| LiquidityPool.sol | Pool management and LP tokens | High |
| RiskOracle.sol | Off-chain risk score integration | Low |
| InterestRateModel.sol | Dynamic rate calculation | Medium |

**Migration strategy:**
- Deploy new factory for Phase 1 loans
- Phase 0 loans continue on existing contracts
- No migration of existing loans required
- Borrowers with Phase 0 history get preferential Phase 1 terms

---

### Wallet UX for Non-Crypto Users

**Challenge:** Web users need wallets but lack crypto knowledge

**Solution (Privy embedded wallets):**
- Social login (Google, Twitter, email) creates wallet automatically
- Seed phrase hidden by default (optional export)
- Gas abstraction via Pimlico (ERC-4337 account abstraction)
- Progressive onboarding (use → learn → own)

**Export path:**
1. User clicks "Export Wallet"
2. Warning: "You'll be responsible for securing your keys"
3. Display seed phrase + instructions
4. Link to MetaMask, Coinbase Wallet, etc.

**Long-term:** Account abstraction (ERC-4337) with social recovery reduces seed phrase burden

---

## Success Metrics

**Quantitative targets:**
- 10,000+ active users (10x Phase 0)
- $1M+ in loans originated
- $500K+ TVL in liquidity pools
- 70%+ pool utilization rate
- 85%+ repayment rate
- 50%+ lenders from outside Farcaster

**Technical validation:**
- Cashflow verification correlates with repayment (statistical significance)
- Hybrid model default rate < pure social trust model for loans >$5K
- Pool LPs earn 4-8% net APY (after defaults and fees)
- <5% of loans require manual review (automated underwriting scales)

**Key milestone:** $500K+ TVL in pools with 70%+ utilization and <15% annualized default rate validates market demand for uncollateralized crypto lending infrastructure.

---

## Next Phase

→ [Phase 2: Automate Repayment](phase-2-automation.md)

**Prerequisites:** Phase 1 validated (pools active, cashflow underwriting proven, 85%+ repayment)

**New capabilities:**
- Account abstraction for auto-deduction from wallets
- Merchant revenue-based repayment (Square/Shopify integration)
- Payment streams for frictionless repayment

---

## Related Documentation

**High-level context:**
- [Vision & roadmap](https://lendfriend.org/vision) — The future we're building
- [Phase 0 implementation](phase-0-social-trust.md) — Social trust foundation

**Technical deep dives:**
- [Risk Scoring](../how-it-works/risk-scoring/README.md) — Complete risk model
- [Smart Contract Reference](../developers/contract-api.md) — API documentation
