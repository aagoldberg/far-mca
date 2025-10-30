# Implementation

## Technical Details for Risk Scoring MVP

How we calculate risk grades, display warnings, and track metrics on-chain and off-chain.

---

## Phase 1: Basic Risk Grading (Launch)

### Smart Contract Tracking

Add borrower stats tracking to `MicroLoanFactory.sol`:

```solidity
// Borrower reputation tracking
mapping(address => uint256) public borrowerTotalLoans;
mapping(address => uint256) public borrowerCompletedLoans;
mapping(address => uint256) public borrowerDefaultedLoans;
mapping(address => uint256) public borrowerTotalBorrowed;
mapping(address => uint256) public borrowerTotalRepaid;

function getBorrowerStats(address borrower)
    external
    view
    returns (
        uint256 totalLoans,
        uint256 completed,
        uint256 defaulted,
        uint256 totalBorrowed,
        uint256 totalRepaid
    )
{
    return (
        borrowerTotalLoans[borrower],
        borrowerCompletedLoans[borrower],
        borrowerDefaultedLoans[borrower],
        borrowerTotalBorrowed[borrower],
        borrowerTotalRepaid[borrower]
    );
}
```

### API Route: Calculate Risk Grade

```typescript
// /api/risk-grade/calculate
export async function POST(request: Request) {
  const { borrowerFid, lenderFid, loanAmount } = await request.json();

  // 1. Fetch borrower stats from contract
  const borrowerStats = await getBorrowerStats(borrowerAddress);

  // 2. Calculate social trust score
  const socialScore = await calculateSocialProximity(
    borrowerFid,
    lenderFid
  );

  // 3. Calculate risk grade
  const grade = calculateGrade({
    stats: borrowerStats,
    socialScore,
    loanAmount,
    farcasterQuality: await getFarcasterQuality(borrowerFid)
  });

  return Response.json({
    grade,  // "A" | "B" | "C" | "D" | "E" | "HR"
    score: grade.totalPoints,  // 0-100
    factors: {
      historyPoints: grade.historyPoints,
      socialPoints: grade.socialPoints,
      sizeRiskPoints: grade.sizeRiskPoints,
      qualityPoints: grade.qualityPoints
    },
    warnings: grade.warnings,
    riskFlags: grade.riskFlags
  });
}
```

### Grade Calculation Logic

```typescript
function calculateGrade(params: {
  stats: BorrowerStats;
  socialScore: number;
  loanAmount: number;
  farcasterQuality: number;
}): RiskGrade {
  // 1. Repayment History (40 points)
  const historyPoints = calculateHistoryPoints(params.stats);

  // 2. Social Trust (30 points)
  const socialPoints = Math.round((params.socialScore / 100) * 30);

  // 3. Loan Size Risk (20 points)
  const sizeRiskPoints = calculateSizeRiskPoints(
    params.loanAmount,
    params.stats
  );

  // 4. Account Quality (10 points)
  const qualityPoints = Math.round(params.farcasterQuality * 10);

  // Total and map to grade
  const totalPoints = historyPoints + socialPoints + sizeRiskPoints + qualityPoints;

  const gradeLevel =
    totalPoints >= 80 ? "A" :
    totalPoints >= 65 ? "B" :
    totalPoints >= 50 ? "C" :
    totalPoints >= 35 ? "D" :
    totalPoints >= 20 ? "E" : "HR";

  return {
    grade: gradeLevel,
    totalPoints,
    historyPoints,
    socialPoints,
    sizeRiskPoints,
    qualityPoints,
    warnings: generateWarnings(gradeLevel, params),
    riskFlags: generateRiskFlags(params)
  };
}
```

### Frontend Display

Loan detail page shows:

```tsx
<LoanCard>
  {/* Risk Grade Badge */}
  <RiskBadge grade={riskGrade.grade} />
  
  {/* Warning based on grade */}
  {riskGrade.grade === "HR" && (
    <Alert variant="error">
      🚨 High Risk - Lend with Caution
      <ul>
        {riskGrade.warnings.map(w => <li>{w}</li>)}
      </ul>
    </Alert>
  )}
  
  {/* Risk flags */}
  <RiskFlags flags={riskGrade.riskFlags} />
  
  {/* Contribute button */}
  <Button onClick={handleContribute}>
    Contribute
  </Button>
</LoanCard>
```

---

## Phase 2: Lender Tools (Month 2)

### Risk Tolerance Filtering

```tsx
// Loan list page with filters
function LoanList() {
  const [showGrades, setShowGrades] = useState(["A", "B"]);

  const filteredLoans = loans.filter(loan =>
    showGrades.includes(loan.riskGrade)
  );

  return (
    <>
      <FilterPanel>
        <Checkbox checked={showGrades.includes("A")}>
          Grade A (Minimal risk)
        </Checkbox>
        <Checkbox checked={showGrades.includes("B")}>
          Grade B (Low risk)
        </Checkbox>
        {/* ... more grade filters */}
      </FilterPanel>

      <LoanGrid loans={filteredLoans} />
    </>
  );
}
```

### Portfolio Risk Dashboard

```typescript
// /api/lender/portfolio/[address]
export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const contributions = await getContributions(params.address);

  // Calculate risk distribution
  const distribution = {
    gradeA: contributions.filter(c => c.grade === "A"),
    gradeB: contributions.filter(c => c.grade === "B"),
    // ... etc
  };

  return Response.json({
    totalContributed: sum(contributions.map(c => c.amount)),
    loanCount: contributions.length,
    riskDistribution: {
      "A-B": percentage(distribution.gradeA.length + distribution.gradeB.length),
      "C-D": percentage(distribution.gradeC.length + distribution.gradeD.length),
      "E-HR": percentage(distribution.gradeE.length + distribution.gradeHR.length)
    }
  });
}
```

---

## Phase 3: Advanced Features (Month 3)

### Pre-Loan Risk Estimator

```tsx
// Borrower creates loan page
function CreateLoan() {
  const [amount, setAmount] = useState(100);
  const estimatedGrade = useEstimatedGrade(amount);

  return (
    <>
      <Input
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <GradeEstimate grade={estimatedGrade}>
        Estimated Risk Grade: {estimatedGrade.grade}
        <FundingSpeed grade={estimatedGrade.grade} />
      </GradeEstimate>

      {estimatedGrade.suggestions.length > 0 && (
        <ImprovementSuggestions>
          Want to improve your grade?
          {estimatedGrade.suggestions.map(s => <li>{s}</li>)}
        </ImprovementSuggestions>
      )}
    </>
  );
}
```

### Historical Funding Speed Data

Track and display average funding time by grade:

```typescript
// Subgraph query
{
  loansByGrade(grade: "A") {
    fundingDuration  // time from creation to full funding
  }
}

// Calculate averages
Grade A: avg 18 hours
Grade B: avg 36 hours
Grade C: avg 4.5 days
Grade D: avg 8 days
Grade E: 50% never fund
Grade HR: 80% never fund
```

---

## Data Structure (Subgraph)

Index all loan and borrower events:

```graphql
type Borrower @entity {
  id: ID!  # Address
  totalLoans: Int!
  completedLoans: Int!
  defaultedLoans: Int!
  activeLoans: Int!
  totalBorrowed: BigInt!
  totalRepaid: BigInt!
  onTimeRate: BigDecimal!
  loans: [Loan!]! @derivedFrom(field: "borrower")
}

type Loan @entity {
  id: ID!  # Contract address
  borrower: Borrower!
  principal: BigInt!
  maturityDate: BigInt!
  disbursementDate: BigInt
  repaidDate: BigInt
  status: LoanStatus!
  riskGrade: String  # Calculated off-chain, stored for analytics
  fundingDuration: BigInt  # Time to full funding
  contributions: [Contribution!]! @derivedFrom(field: "loan")
}

type Contribution @entity {
  id: ID!
  loan: Loan!
  lender: Lender!
  amount: BigInt!
  socialScore: Int  # Social distance at time of contribution
  timestamp: BigInt!
}

type Lender @entity {
  id: ID!  # Address
  totalContributed: BigInt!
  contributions: [Contribution!]! @derivedFrom(field: "lender")
}

enum LoanStatus {
  FUNDING
  ACTIVE
  COMPLETED
  DEFAULTED
}
```

---

## Monitoring & Analytics

### Quarterly Review Metrics

```sql
-- Default rate by grade
SELECT
  risk_grade,
  COUNT(*) as total_loans,
  COUNT(*) FILTER (WHERE status = 'DEFAULTED') as defaults,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'DEFAULTED') / COUNT(*), 2) as default_rate
FROM loans
WHERE disbursement_date >= NOW() - INTERVAL '90 days'
GROUP BY risk_grade;

-- Target validation
-- Grade A target: <5%
-- Grade B target: 5-10%
-- etc.
```

### Adjust Grading Formula

If actual default rates diverge from targets:

```typescript
// Adjust point weights
const WEIGHTS = {
  history: 0.40,  // Increase to 0.45 if history most predictive
  social: 0.30,   // Decrease to 0.25 if less predictive
  sizeRisk: 0.20,
  quality: 0.10   // Decrease to 0.05 if not significant
};

// Adjust grade boundaries
const GRADE_THRESHOLDS = {
  A: 80,  // Increase to 85 if Grade A defaults > 5%
  B: 65,
  C: 50,
  D: 35,
  E: 20
};
```

---

## Security & Privacy

### No PII Stored

- All scoring based on on-chain data + public Farcaster profiles
- No KYC required
- Borrower stats queryable by anyone (transparent)

### Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m')
});

export async function POST(request: Request) {
  const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  // Continue with calculation...
}
```

---

## Next Steps

- **Understand the system:** [Risk Scoring Overview](README.md)
- **See the grades:** [Risk Grades](risk-grades.md)
- **View warnings:** [Lender Warnings](lender-warnings.md)
- **Learn constraints:** [Loan Constraints](loan-constraints.md)

**Back to:** [Risk Scoring Overview](README.md)
