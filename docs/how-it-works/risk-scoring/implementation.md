# Implementation

## How Risk Grades Are Calculated

Technical overview of the risk scoring system.

---

## Smart Contract Tracking

Track borrower stats on-chain:

```solidity
// In MicroLoanFactory.sol
mapping(address => uint256) public borrowerTotalLoans;
mapping(address => uint256) public borrowerCompletedLoans;
mapping(address => uint256) public borrowerDefaultedLoans;

function getBorrowerStats(address borrower)
    external
    view
    returns (uint256 total, uint256 completed, uint256 defaulted);
```

---

## API: Calculate Risk Grade

```typescript
// POST /api/risk-grade/calculate
{
  borrowerFid: number,
  lenderFid: number,
  loanAmount: number
}

// Response
{
  grade: "A" | "B" | "C" | "D" | "E" | "HR",
  score: 0-100,
  warnings: string[],
  riskFlags: string[]
}
```

---

## Grade Calculation

```typescript
function calculateGrade(params) {
  // 1. Repayment History (40 points)
  const historyPoints = calculateHistoryPoints(params.stats);

  // 2. Social Trust (30 points)
  const socialPoints = (params.socialScore / 100) * 30;

  // 3. Loan Size Risk (20 points)
  const sizePoints = calculateSizeRisk(params.amount, params.stats);

  // 4. Account Quality (10 points)
  const qualityPoints = params.farcasterQuality * 10;

  // Map total to grade
  const total = historyPoints + socialPoints + sizePoints + qualityPoints;

  return total >= 80 ? "A" :
         total >= 65 ? "B" :
         total >= 50 ? "C" :
         total >= 35 ? "D" :
         total >= 20 ? "E" : "HR";
}
```

---

## Frontend Display

```tsx
<LoanCard>
  <RiskBadge grade={grade} />

  {grade === "HR" && (
    <Alert variant="error">
      🚨 High Risk - Lend with Caution
    </Alert>
  )}

  <RiskFlags flags={riskFlags} />
</LoanCard>
```

---

## Phase Rollout

**Phase 1 (Launch):**
- Basic risk grade calculation
- Warnings on loan pages

**Phase 2 (Month 2):**
- Lender filtering by grade
- Portfolio risk dashboard

**Phase 3 (Month 3):**
- Pre-loan grade estimator
- Funding speed data

---

## Monitoring

Track actual default rates by grade quarterly:

**Targets:**
- Grade A: <5%
- Grade B: 5-10%
- Grade C: 10-20%
- Grade D: 20-35%
- Grade E: 35-50%
- Grade HR: >50%

Adjust formula if actual rates diverge.

---

**Back to:** [Risk Scoring](README.md)
