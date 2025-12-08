# Cashflow-Based Risk Scoring

This document outlines industry-researched risk scoring models for borrowers with connected Shopify, Stripe, and Square accounts. Phase 1+ will incorporate these cashflow-based signals alongside social trust scoring.

---

## Why Cashflow Data?

Traditional credit scores exclude millions of small businesses. Platform data from Shopify, Stripe, and Square provides real-time visibility into business health that traditional lenders lack.

**Key advantages:**
- **Real revenue verification** vs. self-reported financials
- **Continuous monitoring** vs. point-in-time snapshots
- **Behavioral signals** like refund rates, chargebacks, seasonality
- **Lower cost** than manual underwriting

> "Shopify has proprietary transaction data allowing for pre-qualification of merchants, high visibility into cash flows for underwriting." [[80]](../../references.md#ref80)

---

## Industry Models We're Learning From

### 1. FICO SBSS (Small Business Scoring Service)

The industry standard for SBA loans, scoring 0-300.

**Score Components:**
- Personal credit (most predictive factor)
- Business credit bureau data (D&B, Experian)
- Revenue trends and profitability
- Cash flow and debt-to-income ratio
- Business age and payment history
- Liens and judgments

**Thresholds:**
| Score | Risk Level | SBA Eligibility |
|-------|------------|-----------------|
| 211-300 | Excellent | Preferred |
| 191-210 | Good | Eligible |
| 161-190 | Fair | May qualify |
| 0-160 | Poor | Usually rejected |

> SBA requires minimum 160 SBSS, most lenders want 180+. [[Source: Nav FICO SBSS Guide]](https://www.nav.com/business-credit-scores/fico-sbss/)

---

### 2. Kabbage / OnDeck Model

Fintech pioneers using alternative data for instant underwriting.

**Kabbage examines 300+ data points including:**
- Monthly revenue cycles
- Customer review scores (Yelp, etc.)
- Shipping volumes and patterns
- Accounting software data
- E-commerce sales trends
- Social media activity

**OnDeck's proprietary OnDeck Score:**
- Real-time bank transaction analysis
- Accounting software integration
- 24-hour lending decisions
- Lines up to $250K

> "SMBs provide information including accounting records, bank accounts, e-commerce revenues, shipping data to enable Kabbage to produce a lending decision." [[Source: Business Model Zoo]](https://www.businessmodelzoo.com/exemplars/kabbage/)

---

### 3. E-Commerce RBF Model (Clearco/Wayflyer)

Revenue-based financing specifically for e-commerce.

**Core Underwriting Dimensions:**

| Dimension | What They Measure | Why It Matters |
|-----------|-------------------|----------------|
| **Revenue Quality** | Stability, predictability, recurring % | Stable revenue = reliable repayment |
| **Growth Trajectory** | Month-over-month trends | Sustainable growth vs. unsustainable |
| **Margins** | Gross and net profit margins | Higher margins = more resilient |
| **Customer Base** | Concentration, repeat rates | Diversified = less risky |
| **Industry** | Vertical-specific benchmarks | Context for metrics |

**Typical Terms:**
- Funding: $10K - $20M
- Fee: 6-19% flat (based on risk)
- Payback: % of daily/weekly revenue

> Clearco charges 6.5% to 19% depending on amount and repayment timeline. Wayflyer charges 2-8% based on funding amount and business performance.

---

### 4. Academic ML Models

Research shows machine learning significantly outperforms traditional scoring.

**Best Performing Features (from PMC research):**
1. Loan annuity-to-credit ratio
2. External credit scores
3. Social network default status (peers who defaulted)
4. Regional economic ratings
5. Address consistency across records

**Model Performance:**
| Model | AUC Score |
|-------|-----------|
| LightGBM | 0.7936 |
| XGBoost | 0.7892 |
| CatBoost | 0.7890 |

> "Alternative data consistently achieved higher AUC scores across all tested algorithms." Removing alternative variables degraded performance by 4-5 percentage points. [[Source: PMC Research]](https://pmc.ncbi.nlm.nih.gov/articles/PMC11108212/)

---

## Risk Signals from Platform Data

### Data Currently Available

| Platform | Metrics Available |
|----------|-------------------|
| **Stripe** | Total revenue, charge count, success rate, MRR (subscriptions), average charge |
| **Square** | Total revenue, payment count, refund rate, success rate, average payment |
| **Shopify** | Total revenue, order count, average order value, shop metadata |

### Tier 1: Direct Risk Signals

These metrics directly indicate risk and are already collectible:

| Signal | Source | Healthy Range | Risk Threshold |
|--------|--------|---------------|----------------|
| **Chargeback Rate** | Stripe | <0.5% | >1% high risk, >1.5% reject |
| **Refund Rate** | Square | <3% | >5% elevated risk |
| **Payment Success Rate** | Stripe/Square | >97% | <95% payment issues |
| **MRR % of Revenue** | Stripe | Higher = better | <10% = volatile |
| **AOV Consistency** | Shopify | Low variance | High variance = unstable |

> "For most industries, any chargeback rate above 1% means a business might be deemed high-risk. Mastercard fines businesses with chargeback rate of 1.5% or higher." [[Source: Stripe]](https://stripe.com/resources/more/what-is-an-average-chargeback-rate-a-guide-for-ecommerce-businesses)

### Tier 2: Derived Metrics

Calculated from raw data for deeper insight:

| Metric | Calculation | Risk Signal |
|--------|-------------|-------------|
| **Revenue Concentration** | Top 10% customers / total revenue | >50% = high customer risk |
| **Seasonality Index** | StdDev of monthly revenue / mean | High = harder to predict |
| **Customer Retention** | Repeat orders / total orders | Low = churn issues |
| **Revenue Velocity** | Week-over-week % change | Declining = warning |
| **Days Since Sale** | Gap from last transaction | Growing gap = trouble |
| **Gross Margin Proxy** | (Revenue - Refunds) / Revenue | Low = tight margins |

### Tier 3: Behavioral Signals

Patterns that indicate operational health:

| Signal | What It Indicates |
|--------|-------------------|
| **Transaction Regularity** | Consistent daily/weekly patterns = stable operations |
| **Growth Sustainability** | >50% month-over-month may be unsustainable |
| **Platform Tenure** | Longer history = more reliable data |
| **Multi-Platform Consistency** | Similar revenue across platforms = trustworthy |

---

## Implemented Business Health Score Model

Based on FinRegLab research findings, we've implemented a four-component scoring model that prioritizes cash flow stability over absolute revenue amounts. This aligns with research showing volatility is the strongest predictor of default.

### Weighted Formula

```
Business Health Score (0-100) =
    Revenue Stability (35%)
  + Order Consistency (25%)
  + Business Tenure (20%)
  + Growth Trend (20%)
```

**Why these weights?** See [FinRegLab Research](finreglab-research.md) for the research basis.

### Component Breakdown

#### 1. Revenue Stability (35% weight)

**The strongest predictor per FinRegLab research.** Measures month-over-month revenue consistency using Coefficient of Variation (CV).

**How It Works:**
1. Group all orders by calendar month
2. Sum revenue per month to create a time series: `[$8,200, $9,100, $7,800, ...]`
3. Calculate CV: `(standard deviation / mean) × 100`
4. Lower CV = more stable = higher score

**Example Calculation:**
```
Monthly revenue: [$8,200, $9,100, $7,800, $8,500, $8,900]
Mean: $8,500/month
Standard Deviation: $456
CV = (456 / 8,500) × 100 = 5.4%
→ Score: 100 (Excellent - very stable)
```

**What It Measures:**
- Predictability of cash flow for repayment planning
- Resilience to seasonal/market fluctuations
- Business model sustainability

| CV Range | Score | Tier | Interpretation |
|----------|-------|------|----------------|
| < 15% | 100 | Excellent | Very predictable revenue |
| 15-25% | 85 | Strong | Minor month-to-month variation |
| 25-40% | 70 | Good | Normal business fluctuations |
| 40-60% | 50 | Fair | Noticeable revenue swings |
| 60-80% | 30 | Weak | Volatile cash flow |
| ≥ 80% | 15 | Poor | Highly unpredictable |

*Requires 3+ months of data. Limited data defaults to 40 pts (Fair).*

**Why This Is Weighted Highest (35%):** FinRegLab's study of 38,000+ small business loans found balance volatility (a cash flow stability measure) was the single strongest predictor of loan default.

#### 2. Order Consistency (25% weight)

**Transaction frequency and regularity.** JPMorgan Chase Institute research shows businesses with steady transaction patterns have higher survival rates.

**How It Works:**
1. Group all orders by week (Sunday-Saturday boundaries)
2. Count orders per week to create a time series: `[12, 15, 11, 14, 13, ...]`
3. Calculate CV of weekly order counts

**Example Calculation:**
```
Weekly order counts: [12, 15, 11, 14, 13, 10, 16, 12]
Mean: 12.875 orders/week
Standard Deviation: 1.96
CV = (1.96 / 12.875) × 100 = 15.2%
→ Score: 100 (Excellent - very consistent)
```

**What It Measures:**
- Regular customer demand vs. sporadic sales
- Operational consistency (fulfillment capacity)
- Business model predictability

| CV Range | Score | Tier | Interpretation |
|----------|-------|------|----------------|
| < 20% | 100 | Excellent | Very predictable weekly volume |
| 20-35% | 85 | Strong | Minor week-to-week variation |
| 35-50% | 70 | Good | Normal seasonal/promotional effects |
| 50-70% | 50 | Fair | Noticeable demand swings |
| 70-90% | 30 | Weak | Unpredictable order flow |
| ≥ 90% | 15 | Poor | Highly irregular (feast or famine) |

*Requires 4+ weeks of data. Limited data defaults to 40 pts (Fair).*

**Why This Matters:** A business with 50 orders one week and 5 the next is harder to underwrite than one with steady 25-30 orders weekly, even if total volume is similar.

#### 3. Business Tenure (20% weight)

**Track record matters, but less than combined cash flow metrics.** Calculated from the date of first verified order.

| Months Active | Score | Display |
|---------------|-------|---------|
| 36+ | 100 | 3+ years |
| 24-35 | 85 | 2+ years |
| 12-23 | 70 | 1+ year |
| 6-11 | 50 | 6+ months |
| 3-5 | 30 | < 6 months |
| < 3 | 15 | Very New |

#### 4. Growth Trend (20% weight)

**Future capacity indicator.** Measures momentum by comparing the first half of the data period to the second half.

**How It Works:**
1. Find the actual data span (first order date to last order date)
2. Split at the midpoint of the actual data range
3. Sum revenue in each half
4. Calculate growth rate: `((recent - prior) / prior) × 100`

**Example Calculation:**
```
First order: March 1 | Last order: May 30 (90 days of data)
Midpoint: April 15

First half (Mar 1 - Apr 14) revenue: $12,000
Second half (Apr 15 - May 30) revenue: $14,400
Growth Rate = ((14,400 - 12,000) / 12,000) × 100 = +20%
→ Score: 100 (Healthy Growth)
```

**Why We Use Actual Data Midpoint:**
The comparison is based on when orders actually exist, not an arbitrary time window. This ensures both halves contain meaningful data even if the business is new.

**Why Moderate Growth Scores Highest:**
- 10-30% growth is sustainable and indicates healthy demand
- 50%+ growth may be unsustainable (flash sales, one-time orders)
- Extreme growth often precedes corrections

**Edge Cases:**
- Less than 45 days of order history: Score 40 (Fair - insufficient data)
- Zero prior revenue but has recent sales: Score 60 (new business with traction)
- Zero revenue in both periods: Score 40 (Fair - insufficient data)

| Growth Rate | Score | Classification | Interpretation |
|-------------|-------|----------------|----------------|
| +10% to +30% | 100 | Healthy Growth | Sustainable momentum |
| +30% to +50% | 85 | Fast Growth | Good but watch for volatility |
| 0% to +10% | 75 | Stable | Mature, predictable business |
| +50% or more | 60 | May be volatile | Could be unsustainable spike |
| 0% to -10% | 50 | Minor Decline | Seasonal or temporary dip |
| -10% to -25% | 30 | Declining | Concerning trend |
| Below -25% | 15 | Significant Decline | Business may be struggling |

*Requires 45+ days of order history. Limited data defaults to 40 pts (Fair).*

**Privacy-Safe Display Labels:**
| Growth Rate | Display |
|-------------|---------|
| ≥30% | "Accelerating" |
| 10-30% | "Growing" |
| 0-10% | "Stable" |
| -10% to 0% | "Slight decline" |
| <-10% | "Declining" |

### Privacy-First Display

We show qualitative tiers instead of exact numbers:

| Internal Data | Public Display | Why |
|---------------|----------------|-----|
| $8,500/month revenue | "Revenue: Strong" | Exact figures are sensitive |
| 180 orders/month | "Orders: Steady" | Protects competitive info |
| +12% growth | "Trend: Growing" | Qualitative is sufficient |
| 36 months active | "Tenure: 3+ years" | Ranges work equally well |

### Component Tier Labels

| Score Range | Tier Label |
|-------------|------------|
| 85-100 | Excellent |
| 70-84 | Strong |
| 55-69 | Good |
| 40-54 | Fair |
| 25-39 | Weak |
| 0-24 | Poor |

---

## Loan Affordability (Second Indicator)

The Business Health Score measures how healthy a business is, but it doesn't answer a critical question: **Can this business afford this specific loan?**

A business with excellent stability could still be requesting 10x their monthly revenue—that's risky regardless of their health score. Rather than combining these into a single score (where good health could mask dangerous loan size), we display them as **two separate indicators**.

### Why Two Indicators?

**The Problem with Additive Scoring:**
If we combined health and affordability into one score, a business with:
- Excellent stability (35 pts)
- Great order consistency (25 pts)
- Long tenure (20 pts)
- Healthy growth (20 pts)

...would score 100/100 even if requesting a loan equal to 6 months of revenue. That's misleading.

**The Solution:**
Display two independent signals, similar to how Kiva shows both "borrower trustworthiness" and "field partner risk" separately.

### Loan Affordability Tiers

Based on Loan-to-Revenue Ratio = Loan Amount ÷ Average Monthly Revenue

| Tier | Ratio | Description |
|------|-------|-------------|
| **Comfortable** | < 0.5x | Loan is less than 2 weeks of revenue |
| **Manageable** | 0.5x - 1x | Loan is less than 1 month of revenue |
| **Stretched** | 1x - 2x | Loan equals 1-2 months of revenue |
| **High Burden** | > 2x | Loan exceeds 2 months of revenue |

### Privacy-Safe Display

We show relative sizing, not exact revenue:

| Ratio | Display |
|-------|---------|
| < 0.25x | "< 1 week revenue" |
| 0.25x - 0.5x | "~1-2 weeks revenue" |
| 0.5x - 1x | "~2-4 weeks revenue" |
| 1x - 2x | "~1-2 months revenue" |
| > 2x | "> 2 months revenue" |

### Example Displays

**Scenario 1: Healthy business, reasonable loan**
```
Business Health: A (Score: 82)
Loan Affordability: Comfortable (~1-2 weeks revenue)
```

**Scenario 2: Healthy business, large loan**
```
Business Health: A (Score: 85)
Loan Affordability: High Burden (> 2 months revenue)
```

**Scenario 3: Newer business, small loan**
```
Business Health: C (Score: 58)
Loan Affordability: Comfortable (< 1 week revenue)
```

This allows lenders to make informed decisions. A Grade A business with "High Burden" affordability is a different risk profile than a Grade A business with "Comfortable" affordability.

---

## Risk Grades and Funding Terms

### Grade Mapping

| Score | Grade | Risk Level | Description |
|-------|-------|------------|-------------|
| 80-100 | A | Low | Strong revenue, stable, quality metrics |
| 65-79 | B | Moderate-Low | Good fundamentals, minor concerns |
| 50-64 | C | Moderate | Acceptable with conditions |
| 40-49 | D | Elevated | Requires monitoring |
| <40 | E/HR | High/Reject | Insufficient data or high risk |

### Funding Parameters by Grade

| Grade | Revenue Multiplier | Fee Range | Payback % |
|-------|-------------------|-----------|-----------|
| A | 5-6x monthly | 6-8% | 8-10% |
| B | 4-5x monthly | 8-10% | 10-12% |
| C | 3-4x monthly | 10-14% | 12-15% |
| D | 2-3x monthly | 14-18% | 15-18% |
| E/HR | Not eligible | - | - |

### Conditions by Grade

| Grade | Conditions |
|-------|------------|
| A | Standard terms |
| B | Quarterly data refresh |
| C | Monthly data refresh, revenue verification |
| D | Weekly monitoring, personal guarantee may be required |

---

## Implementation Phases

### Phase 0 (Current)
- Social trust scoring only
- Gather baseline repayment data
- No cashflow scoring required

### Phase 1 (Next)
- Add optional platform connections
- Display credit scores to borrowers
- Show scores to lenders (informational)
- Continue gathering repayment correlation data

### Phase 2 (Future)
- Mandatory platform connection for larger loans
- Risk-adjusted funding limits
- Automated underwriting decisions
- Blend social trust + cashflow scores

---

## Key Sources

### Industry & Platform Models
- [FICO SBSS Guide (Nav)](https://www.nav.com/business-credit-scores/fico-sbss/)
- [Kabbage Business Model](https://www.businessmodelzoo.com/exemplars/kabbage/)
- [Forward Financing RBF Underwriting](https://www.forwardfinancing.com/revenue-based-financing-underwriting-balancing-growth-and-risk/)
- [Rutter: Future of MCA Underwriting](https://www.rutter.com/blog/the-future-of-merchant-cash-advance-mca-underwriting-with-alternative-data)

### Academic Research
- [PMC: Alternative Data Credit Scoring](https://pmc.ncbi.nlm.nih.gov/articles/PMC11108212/)
- [ScienceDirect: ML and SMB Credit Risk](https://www.sciencedirect.com/science/article/pii/S0038012123002586)
- [ScienceDirect: Alternative Data Enhancement](https://www.sciencedirect.com/science/article/abs/pii/S095741742030590X)

### Risk Thresholds
- [Stripe: Chargeback Rates Guide](https://stripe.com/resources/more/what-is-an-average-chargeback-rate-a-guide-for-ecommerce-businesses)
- [Chargeback Statistics 2025](https://www.chargeback.io/blog/chargeback-statistics)

### Fintech Cost & Performance
- [Shopify Capital Terms](../../references.md#ref6)
- [Stripe Capital Terms](../../references.md#ref7)
- [Clearco/Wayflyer Performance](../../references.md#ref76)

---

**Next:** [Social Trust Scoring](../social-trust-scoring/README.md) | [Risk & Defaults](../risk-and-defaults.md) | [Lender Warnings](lender-warnings.md)
