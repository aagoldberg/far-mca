# Creditworthiness Scoring

## Building On-Chain Credit Through Repayment Behavior

LendFriend tracks borrower creditworthiness through on-chain repayment history, enabling progressive lending and reputation building.

---

## MVP Approach: Progressive Lending

Based on microfinance research (Grameen Bank, progressive lending theory), LendFriend uses **step lending** - borrowers start small and earn larger loan limits through successful repayment.

---

## Core Metrics Tracked (On-Chain)

Every borrower has a public, verifiable on-chain reputation based on:

| Metric | Description |
|--------|-------------|
| **Total Loans** | Number of loans taken |
| **Completed Loans** | Successfully repaid in full |
| **Defaulted Loans** | Failed to repay by maturity |
| **Active Loans** | Currently outstanding |
| **On-Time Rate** | % repaid before/on maturity date |
| **Total Borrowed** | Cumulative principal borrowed (USDC) |
| **Total Repaid** | Cumulative principal repaid (USDC) |
| **Loan Cycle** | Number of completed loan cycles |
| **Current Tier** | Credit tier (Starter/Builder/Established/Premium) |

All metrics are **queryable on-chain** via smart contract view functions and subgraph indexing.

---

## Creditworthiness Tiers

### Tier 1: **Starter** (No History)
**Who:** First-time borrowers with zero loan history

**Loan Limits:**
- Max loan: **$100**
- Max duration: **30 days**
- Max 1 active loan

**Qualification:**
- Farcaster account with quality score ≥ 0.5
- No previous defaults across protocol

**Purpose:** Build initial reputation with low-risk exposure

---

### Tier 2: **Builder** (1-3 Successful Loans)
**Who:** Borrowers with 1-3 successfully repaid loans, no defaults

**Loan Limits:**
- Max loan: **$500**
- Max duration: **90 days**
- Max 2 active loans

**Qualification:**
- At least 1 completed loan (repaid in full)
- Zero defaults
- On-time repayment rate ≥ 80%

**Purpose:** Establish consistent repayment behavior

---

### Tier 3: **Established** (4+ Successful Loans)
**Who:** Borrowers with 4+ successfully repaid loans, strong history

**Loan Limits:**
- Max loan: **$2,500**
- Max duration: **180 days**
- Max 3 active loans

**Qualification:**
- At least 4 completed loans (repaid in full)
- ≤ 1 default (if default exists, must have 6+ successful loans after)
- On-time repayment rate ≥ 75%
- Total repaid ≥ $1,000

**Purpose:** Reward proven borrowers with flexibility

---

### Tier 4: **Premium** (10+ Loans, Stellar Record)
**Who:** Power users with extensive, excellent repayment history

**Loan Limits:**
- Max loan: **$5,000**
- Max duration: **365 days**
- Max 5 active loans

**Qualification:**
- At least 10 completed loans
- ≤ 1 default across entire history
- On-time repayment rate ≥ 90%
- Total repaid ≥ $5,000

**Purpose:** Maximum flexibility for most trusted borrowers

---

## Reputation Score (0-100)

A single number summarizing creditworthiness, displayed to lenders:

```
Reputation Score = (
  Completion Rate × 40 +        // % of loans successfully repaid
  On-Time Rate × 30 +            // % of loans repaid on-time
  Loan Cycle Bonus × 20 +        // Points for # of completed cycles (capped at 20)
  Default Penalty × 10           // Penalty for defaults (negative points)
)

Where:
- Completion Rate = (Completed Loans / Total Loans) × 40
- On-Time Rate = (On-Time Loans / Total Loans) × 30
- Loan Cycle Bonus = min(Loan Cycle × 2, 20)
- Default Penalty = -(Defaulted Loans × 10)

Final Score = max(min(Score, 100), 0)
```

### Score Interpretation:

| Score | Rating | Meaning |
|-------|--------|---------|
| **90-100** | ⭐⭐⭐⭐⭐ Excellent | Stellar repayment history, minimal risk |
| **75-89** | ⭐⭐⭐⭐ Good | Strong track record, reliable borrower |
| **60-74** | ⭐⭐⭐ Fair | Moderate history, some risk |
| **40-59** | ⭐⭐ Poor | Limited history or missed payments |
| **0-39** | ⭐ High Risk | Defaults or very limited history |

---

## Default Handling

### What Happens When a Borrower Defaults?

1. **On-chain record permanent**: Default timestamp recorded in MicroLoan contract
2. **Reputation score drops**: -10 points per default
3. **Tier downgrade**: Borrower moves down 1-2 tiers depending on severity
4. **Loan limits reduced**: New loans capped at lower amount
5. **Recovery path available**: Can rebuild through smaller successful loans

### Recovery from Default

Borrowers can recover from a single default through:
- **Immediate:** Manually repay defaulted loan (even after maturity) to reduce penalty
- **Progressive:** Complete 3 successful smaller loans to rebuild trust
- **Long-term:** Strong repayment history (6+ successful loans) can overcome 1 default

Multiple defaults (2+) result in:
- Permanent downgrade to **Starter tier**
- Max loan reduced to $100 until extensive rebuild (10+ successful loans)

---

## MVP Implementation

### Phase 1: Basic On-Chain Tracking (Launch)

**Smart Contract Changes:**
```solidity
// In MicroLoanFactory.sol
mapping(address => uint256) public borrowerLoanCount;
mapping(address => uint256) public borrowerDefaultCount;
mapping(address => uint256) public borrowerCompletedCount;

function getBorrowerStats(address borrower)
    external
    view
    returns (
        uint256 totalLoans,
        uint256 completed,
        uint256 defaulted,
        uint256 active
    );
```

**Frontend:**
- Display borrower reputation score on loan detail page
- Show tier badge next to borrower address
- Color-code reputation (green/yellow/red)

**API Route:**
```typescript
// /api/reputation/[address]
export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const stats = await fetchBorrowerStats(params.address);
  const score = calculateReputationScore(stats);
  const tier = determineTier(stats);

  return Response.json({
    address: params.address,
    score,
    tier,
    stats,
    history: await fetchLoanHistory(params.address)
  });
}
```

### Phase 2: Tier-Based Limits (Month 2)

**Enforcement:**
- Check borrower tier before loan creation
- Revert if loan amount exceeds tier limit
- Update `MicroLoanFactory.createLoan()` to enforce limits

**UI:**
- Show borrower's current tier and next tier requirements
- Display "You can borrow up to $X based on your history"
- Progress bar showing path to next tier

### Phase 3: Reputation Dashboard (Month 3)

**Borrower Dashboard:**
- Credit score visualization
- Loan history timeline
- Path to next tier (requirements)
- Default recovery progress (if applicable)

**Lender Dashboard:**
- Filter loans by borrower reputation score
- See detailed repayment history before contributing
- Notification if borrower is in recovery from default

---

## Data Structure (Subgraph)

Index all loan events for fast querying:

```graphql
type Borrower @entity {
  id: ID!  # Address
  totalLoans: Int!
  completedLoans: Int!
  defaultedLoans: Int!
  activeLoans: Int!
  totalBorrowed: BigInt!
  totalRepaid: BigInt!
  reputationScore: Int!
  tier: String!
  loans: [Loan!]! @derivedFrom(field: "borrower")
}

type Loan @entity {
  id: ID!  # Contract address
  borrower: Borrower!
  principal: BigInt!
  maturityDate: BigInt!
  disbursementDate: BigInt
  repaidDate: BigInt
  status: String!  # FUNDING, ACTIVE, COMPLETED, DEFAULTED
  onTime: Boolean
}
```

---

## Example Scenarios

### Scenario 1: First-Time Borrower (Alice)
1. **Start:** Alice creates $50 loan for 14 days
2. **Status:** Tier 1 (Starter), Score: 0, Max loan: $100
3. **Repays on-time:** Score increases to 70
4. **Next loan:** Can now borrow up to $100, eligible for Tier 2 after 1 more successful loan

### Scenario 2: Established Borrower (Bob)
1. **History:** 5 completed loans, all on-time, total repaid $800
2. **Status:** Tier 3 (Established), Score: 95, Max loan: $2,500
3. **Requests $1,500 loan:** Approved based on tier
4. **Repays:** Score increases to 98, progressing toward Tier 4

### Scenario 3: Default Recovery (Carol)
1. **History:** 2 completed loans, 1 default
2. **Status:** Tier 1 (downgraded), Score: 30, Max loan: $100
3. **Recovery:** Completes 3 small loans ($50-100) successfully
4. **Result:** Upgraded to Tier 2, Score: 65, can borrow $500

---

## Research Foundation

This system combines proven methodologies:

| Principle | Source | Application |
|-----------|--------|-------------|
| **Progressive lending** | Grameen Bank | Start small ($100), increase with success |
| **Step lending** | Progressive Lending Theory | Backloaded loans of growing size |
| **Loan cycle tracking** | Microfinance Credit Scoring | Repeat customers have different risk profiles |
| **On-chain reputation** | Aave, Cred Protocol | Public, verifiable transaction history |
| **Letter grade system** | Prosper, LendingClub | Simple 5-tier system (Starter → Premium) |

---

## Key Design Decisions

### Why Progressive Lending?
Research shows borrowers who start small and build up have **significantly better repayment rates** than those given large loans immediately. Creates natural screening mechanism.

### Why On-Chain Only (No Off-Chain Data)?
- **Transparent**: Anyone can verify reputation
- **Portable**: Credit history follows ENS/address across platforms
- **Sybil-resistant**: Can't fake on-chain repayment history
- **Privacy-preserving**: No KYC required for basic lending

### Why Simple Tiers (Not Continuous Scoring)?
- **Easy to understand**: Clear requirements for each tier
- **Implementation simplicity**: Boolean checks vs. complex math
- **Gas efficient**: Store tier as enum, calculate score off-chain

### Why Allow Recovery from Default?
- **Second chances**: Single mistake shouldn't be permanent
- **Data collection**: Learn what leads to recovery vs. repeat default
- **Social accountability**: Defaulters who repay signal genuine intent

---

## Future Enhancements (Post-MVP)

### Time-Weighted Reputation Decay
- Recent repayments weighted higher than old ones
- Defaults older than 1 year have reduced penalty
- Inactivity (no loans for 6+ months) slowly decays score

### Social Trust Integration
- Combine reputation score with social proximity
- Loans to close friends get "social boost" (lower perceived risk)
- Lenders see both metrics: Reputation + Social Distance

### Cross-Platform Credit
- Pull Aave/Compound repayment history
- Integrate with other on-chain credit protocols (Cred Protocol)
- Build universal DeFi credit score

### Interest Rate Pricing
- When Phase 2 introduces interest, use reputation score
- Tier 4 borrowers get 3-5% APR
- Tier 1 borrowers get 15-20% APR
- Market-driven rates based on lender demand

---

## Monitoring & Iteration

**Track these metrics:**
- Default rate by tier (expect: Tier 1 > Tier 4)
- Time to tier advancement (expect: 2-4 months Starter → Builder)
- Recovery success rate (target: 30-40% of defaulters recover)
- Loan size growth correlation with repayment (validate progressive lending hypothesis)

**Quarterly reviews:**
- Adjust tier thresholds based on actual default rates
- Recalibrate reputation score formula
- Add/remove tiers based on user distribution

---

## Next Steps

- **Technical:** [Smart Contract Flow](smart-contract-flow.md)
- **Social:** [Social Trust Scoring](social-trust-scoring/README.md)
- **Risk:** [Risk & Default Handling](risk-and-defaults.md)

**Questions?** Join our [Discord](https://discord.gg/lendfriend) or file an issue on [GitHub](https://github.com/aagoldberg/far-mca).
