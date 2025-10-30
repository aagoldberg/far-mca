# Grade Calculation

## How Grades Are Calculated

Grades are calculated using four weighted factors:
- **Repayment History (40%)** - Past loan performance
- **Social Trust Score (30%)** - Connection strength to lender
- **Loan Size Risk (20%)** - Amount relative to history
- **Account Quality (10%)** - Farcaster account health

Points from each factor are combined into a total score (0-100), which maps to a letter grade (see [Grade Thresholds](#grade-thresholds) below).

---

## How the 4 Factors Work

Each factor contributes points totaling 100 points maximum.

---

## Factor 1: Repayment History (40%)

**Most important predictor** - past behavior predicts future behavior.

| History | Points |
|---------|--------|
| 10+ loans, 0 defaults, 90%+ on-time | 40 |
| 4-9 loans, 0 defaults, 80%+ on-time | 32 |
| 1-3 loans, 0 defaults | 24 |
| 0 loans (first-time) | 12 |
| 1+ defaults | 0-8 |

---

## Factor 2: Social Trust (30%)

Based on [Social Trust Scoring](../social-trust-scoring/README.md) - Adamic-Adar algorithm measuring mutual Farcaster connections.

| Social Distance | Points |
|----------------|--------|
| 80-100 (Very close) | 30 |
| 60-79 (Close) | 24 |
| 40-59 (Moderate) | 18 |
| 20-39 (Weak) | 12 |
| 0-19 (Minimal) | 6 |

**Why it matters:** Close friends provide social accountability - research shows friend endorsements significantly reduce default rates in P2P lending.

---

## Factor 3: Loan Size Risk (20%)

Evaluates if amount is appropriate for history.

**For first-time borrowers:**

| Loan Amount | Points | Risk Level |
|------------|--------|-----------|
| ≤ $200 | 16 | Starter-friendly |
| $201-500 | 10 | Moderate |
| > $500 | 2 | High risk |

**For borrowers with history:**

| Size vs History | Points |
|----------------|--------|
| < 2× largest previous | 20 |
| 2-5× largest previous | 12 |
| > 5× largest previous | 4 |

---

## Factor 4: Account Quality (10%)

Farcaster account health (Neynar quality score).

| Quality Score | Points |
|--------------|--------|
| 0.9-1.0 | 10 |
| 0.7-0.89 | 7 |
| 0.5-0.69 | 4 |
| < 0.5 | 0 |

**Measures:** Account age, activity patterns, bot detection.

---

## Why These Weights?

These are our initial design choices informed by P2P lending research:

- **History = 40%**: Research shows repayment history is the strongest predictor
- **Social = 30%**: Social ties reduce defaults and compensate for no history
- **Size = 20%**: Progressive lending reduces risk
- **Quality = 10%**: Sybil resistance, though legitimate users vary widely

**Note:** We'll continually refine these weights as we collect repayment data.

---

## Grade Thresholds

After calculating points from all four factors, the total score (0-100) maps to a letter grade:

| Total Points | Grade | Risk Level |
|--------------|-------|------------|
| 80-100 | **A** 🟢 | Minimal |
| 65-79 | **B** 🟢 | Low |
| 50-64 | **C** 🟡 | Moderate |
| 35-49 | **D** 🟡 | Elevated |
| 20-34 | **E** 🔴 | High |
| 0-19 | **HR** 🔴 | Very High |

**Note:** These thresholds are initial design choices that we'll adjust as we collect repayment data and observe actual default patterns by grade.

---

**See examples:** [Calculation Examples](examples.md) | **Back to:** [Risk Grades](risk-grades.md)
