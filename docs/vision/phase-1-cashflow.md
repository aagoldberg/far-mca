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

**Implementation:**

```typescript
interface PlaidVerification {
  userId: string;
  accessToken: string;  // OAuth access token (encrypted)
  verificationData: {
    monthlyIncome: number;
    incomeStability: number;  // 0-100 score
    accountAge: number;  // months
    debtToIncomeRatio: number;
  };
  attestationCID?: string;  // IPFS hash of attestation
  expiresAt: number;  // timestamp
}

async function verifyBankAccount(
  userId: string,
  plaidPublicToken: string
): Promise<PlaidVerification> {
  // Exchange public token for access token
  const accessToken = await plaid.exchangePublicToken(plaidPublicToken);

  // Fetch transactions (last 6 months)
  const transactions = await plaid.getTransactions(accessToken, 180);

  // Calculate income metrics
  const monthlyIncome = calculateMonthlyIncome(transactions);
  const incomeStability = calculateStability(transactions);

  // Create privacy-preserving attestation
  const attestation = {
    income_range: getBucket(monthlyIncome),  // e.g., "$3K-$5K/month"
    verified_at: Date.now(),
    method: "plaid_bank"
  };

  // Upload to IPFS
  const attestationCID = await uploadToIPFS(attestation);

  return {
    userId,
    accessToken: encrypt(accessToken),
    verificationData: { monthlyIncome, incomeStability, ... },
    attestationCID,
    expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000  // 90 days
  };
}
```

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

**Implementation:**

```typescript
interface SquareVerification {
  userId: string;
  merchantId: string;
  accessToken: string;  // OAuth access token (encrypted)
  verificationData: {
    avgMonthlyRevenue: number;
    revenueGrowth: number;  // % growth last 3 months
    transactionVolume: number;
    avgTicketSize: number;
    refundRate: number;  // % of transactions refunded
  };
  attestationCID: string;
  expiresAt: number;
}

async function verifySquareMerchant(
  userId: string,
  squareAuthCode: string
): Promise<SquareVerification> {
  // Exchange auth code for access token
  const { access_token, merchant_id } = await square.obtainToken(squareAuthCode);

  // Fetch payments (last 6 months)
  const payments = await square.listPayments({
    begin_time: sixMonthsAgo(),
    end_time: now()
  });

  // Calculate revenue metrics
  const avgMonthlyRevenue = calculateMonthlyAverage(payments);
  const revenueGrowth = calculateGrowthRate(payments);

  // Create attestation
  const attestation = {
    revenue_range: getBucket(avgMonthlyRevenue),
    merchant_type: "square",
    verified_at: Date.now()
  };

  const attestationCID = await uploadToIPFS(attestation);

  return {
    userId,
    merchantId: merchant_id,
    accessToken: encrypt(access_token),
    verificationData: { avgMonthlyRevenue, revenueGrowth, ... },
    attestationCID,
    expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000
  };
}
```

**OAuth flow:**
1. User clicks "Verify Square Account"
2. Redirected to Square authorization page
3. User grants read-only payment data access
4. Redirected back with auth code
5. Exchange auth code for access token
6. Fetch payment data and create attestation

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
**Implementation:** Already available via wallet connection

**Data analyzed:**
- Transaction history (incoming transfers, frequencies)
- Token receipts (USDC, ETH, other ERC-20s)
- DeFi protocol interactions (yield farming, staking rewards)
- NFT sales and creator royalties
- DAO treasury payments

**Analysis algorithm:**

```typescript
interface OnChainIncomeAnalysis {
  walletAddress: string;
  recurringIncome: {
    frequency: 'daily' | 'weekly' | 'monthly';
    avgAmount: number;
    sources: string[];  // DAO treasuries, protocol addresses
  }[];
  oneTimeIncome: {
    type: 'nft_sale' | 'defi_yield' | 'other';
    amount: number;
    timestamp: number;
  }[];
  totalMonthlyIncome: number;
  incomeStability: number;  // 0-100 score
}

async function analyzeOnChainIncome(
  walletAddress: string,
  chainId: number = 8453  // Base
): Promise<OnChainIncomeAnalysis> {
  // Fetch last 6 months of transactions
  const transactions = await fetchTransactions(walletAddress, chainId, 180);

  // Classify income sources
  const recurring = identifyRecurringPayments(transactions);
  const oneTime = transactions.filter(tx => !isRecurring(tx));

  // Calculate stability score (higher for consistent recurring income)
  const stability = calculateStabilityScore(recurring);

  return {
    walletAddress,
    recurringIncome: recurring,
    oneTimeIncome: oneTime,
    totalMonthlyIncome: sumMonthlyIncome(recurring, oneTime),
    incomeStability: stability
  };
}
```

**Weighting logic:**
- Recurring income (DAO salaries, protocol fees): 100% weight
- DeFi yield (consistent for 3+ months): 75% weight
- NFT sales and one-time payments: 25% weight

**Enhanced signals:**
- ENS domain ownership (identity verification)
- POAP attendance (community participation)
- DAO governance participation (reputation)
- On-chain transaction history (account age, activity level)

---

## Liquidity Pool Architecture

Phase 1 introduces liquidity pools for passive capital deployment, enabled by standardized cashflow verification and risk scoring.

### Smart Contract Design

**Pool tiers:**

| Pool | Risk Levels Accepted | Target APY | Reserve Ratio |
|------|---------------------|-----------|---------------|
| Conservative | LOW only (score 75+) | 4-6% | 10% |
| Balanced | LOW + MEDIUM (50+) | 6-8% | 15% |
| Aggressive | All tiers (40+) | 8-12% | 20% |

**Core contract:**

```solidity
contract LiquidityPool {
    IERC20 public immutable usdc;
    uint256 public totalDeposits;
    uint256 public totalLent;
    uint256 public totalRepaid;
    uint256 public reserveRatio;  // e.g., 10% = 1000 (basis points)

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public shares;  // LP tokens

    address[] public activeLoans;
    mapping(address => bool) public approvedLoans;

    // Lender actions
    function deposit(uint256 amount) external;
    function withdraw(uint256 shares) external;
    function claimYield() external;

    // Protocol actions (off-chain risk engine approval required)
    function fundLoan(address loanAddress, uint256 amount) external onlyApproved;
    function recordRepayment(address loanAddress, uint256 amount) external;
    function recordDefault(address loanAddress, uint256 amount) external;

    // View functions
    function availableLiquidity() public view returns (uint256);
    function poolAPY() public view returns (uint256);
    function lenderYield(address lender) public view returns (uint256);
}
```

**Lender flow:**
1. `deposit(amount)` → Receive LP tokens proportional to share
2. Yield accrues as loans are repaid with interest
3. `withdraw(shares)` → Burn LP tokens, receive USDC (if liquidity available)
4. Defaults reduce pool value, spread across all LP holders

**Borrower flow:**
1. Complete verification (social trust + cashflow)
2. Off-chain risk engine calculates score and loan offer
3. Accept offer → `fundLoan()` called by protocol
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

```typescript
interface RiskScoreInputs {
  repaymentHistory: {
    completedLoans: number;
    onTimeRate: number;  // % of payments made on time
    avgTipRate: number;  // % tip on past loans
    defaults: number;
  };
  socialTrust: {
    effectiveMutuals: number;
    socialDistance: number;  // 0-100
    platformQuality: number;  // Neynar score, Power Badge, etc.
  };
  cashflowVerification: {
    monthlyIncome: number;
    incomeStability: number;  // 0-100
    debtToIncomeRatio?: number;
    verificationMethod: 'plaid' | 'square' | 'shopify' | 'onchain';
  };
  loanAmount: number;
}

interface RiskScore {
  totalScore: number;  // 0-100
  tier: 'AAA' | 'AA' | 'A' | 'BBB' | 'DECLINE';
  interestRate: number;  // APR %
  maxLoanAmount: number;
  components: {
    repaymentScore: number;
    socialScore: number;
    cashflowScore: number;
    loanSizeScore: number;
  };
}

function calculateRiskScore(inputs: RiskScoreInputs): RiskScore {
  // Calculate component scores (0-100 each)
  const repaymentScore = calculateRepaymentScore(inputs.repaymentHistory);
  const socialScore = calculateSocialScore(inputs.socialTrust);
  const cashflowScore = calculateCashflowScore(inputs.cashflowVerification);
  const loanSizeScore = calculateLoanSizeRisk(inputs.loanAmount);

  // Get weights based on loan amount
  const weights = getWeights(inputs.loanAmount);

  // Weighted average
  const totalScore =
    repaymentScore * weights.repayment +
    socialScore * weights.social +
    cashflowScore * weights.cashflow -
    loanSizeScore * weights.loanSize;

  // Determine tier and interest rate
  const tier = getTier(totalScore);
  const interestRate = getInterestRate(tier, inputs.loanAmount);
  const maxLoanAmount = getMaxLoan(totalScore, inputs.cashflowVerification.monthlyIncome);

  return {
    totalScore,
    tier,
    interestRate,
    maxLoanAmount,
    components: { repaymentScore, socialScore, cashflowScore, loanSizeScore }
  };
}
```

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

**Viral mechanics:**
```typescript
// Shareable loan links
const loanURL = `https://lendfriend.org/loan/${loanAddress}`;

// Generate social share with Open Graph metadata
const shareData = {
  title: `Help ${borrower.name} fund their ${loanTitle}`,
  text: `${borrower.name} needs $${principal} for ${purpose}. They're ${trustScore}% connected to your network.`,
  url: loanURL
};

await navigator.share(shareData);  // Native share on mobile
```

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

**Implementation:**
```typescript
interface BlueskyIdentity {
  did: string;  // AT Protocol DID
  handle: string;
  displayName: string;
  domainVerified: boolean;  // handle === owned domain
  followers: number;
  following: number;
  posts: number;
  accountAge: number;  // days since creation
}

async function verifyBlueskyIdentity(handle: string): Promise<BlueskyIdentity> {
  // Resolve AT Protocol DID
  const did = await atproto.resolveDID(handle);

  // Fetch profile data
  const profile = await bluesky.getProfile(did);

  // Check domain verification
  const domainVerified = await checkDomainOwnership(handle);

  return { did, handle, domainVerified, ...profile };
}
```

**Twitter/X:** Delayed to Phase 2+ due to bot prevalence and low signal quality

---

## Technical Implementation Challenges

### Cashflow Attestation Architecture

**Phase 1a (MVP):** Direct API integration with off-chain attestation storage

```typescript
interface CashflowAttestation {
  userId: string;
  verificationMethod: 'plaid' | 'square' | 'shopify' | 'onchain';
  incomeRange: string;  // e.g., "$3K-$5K/month"
  verifiedAt: number;
  expiresAt: number;
  attestationHash: string;  // IPFS CID
  signature: string;  // Protocol signature
}
```

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
