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

## Proposed Scoring Model

### Enhanced Weighted Formula

```
Credit Score (0-100) =
    Revenue Score (25%)
  + Stability Score (20%)
  + Quality Score (20%)
  + Growth Score (15%)
  + Platform Reliability (10%)
  + Tenure Score (10%)
```

### Component Breakdown

#### 1. Revenue Score (25 points max)

Logarithmic scale to handle wide range:

| Monthly Revenue | Points |
|-----------------|--------|
| $0 - $5K | 0-10 |
| $5K - $20K | 10-15 |
| $20K - $50K | 15-20 |
| $50K - $200K | 20-23 |
| $200K+ | 23-25 |

#### 2. Stability Score (20 points max)

Based on revenue variance and predictability:

| Coefficient of Variation | Points |
|--------------------------|--------|
| <15% (very stable) | 18-20 |
| 15-30% (stable) | 14-17 |
| 30-50% (moderate) | 8-13 |
| >50% (volatile) | 0-7 |

**Bonuses:**
- +2 for MRR >30% of total revenue
- +2 for consistent weekly transaction patterns

#### 3. Quality Score (20 points max)

Operational health metrics:

| Metric | Good | Points |
|--------|------|--------|
| Chargeback rate <0.5% | Yes | +5 |
| Refund rate <3% | Yes | +5 |
| Success rate >97% | Yes | +5 |
| No recent declined payments | Yes | +3 |
| Positive review signals | Yes | +2 |

**Penalties:**
- Chargeback >1%: -5 points
- Refund rate >5%: -3 points
- Success rate <95%: -3 points

#### 4. Growth Score (15 points max)

Revenue trajectory analysis:

| 90-Day Growth Rate | Points |
|--------------------|--------|
| > +30% | 15 (strong growth) |
| +10% to +30% | 12 (healthy growth) |
| 0% to +10% | 9 (stable) |
| -10% to 0% | 5 (slight decline) |
| < -10% | 0 (concerning decline) |

#### 5. Platform Reliability (10 points max)

Trust hierarchy based on data source:

| Platform | Points | Rationale |
|----------|--------|-----------|
| Plaid (bank) | 10 | Most authoritative |
| Stripe | 8 | High trust, regulated |
| Square | 8 | High trust, regulated |
| Shopify | 6 | E-commerce only |
| Multi-platform | +2 bonus | Cross-validation |

#### 6. Tenure Score (10 points max)

Business maturity signals:

| Factor | Points |
|--------|--------|
| 2+ years on platform | 4 |
| 1-2 years | 3 |
| 6-12 months | 2 |
| <6 months | 1 |
| 90+ days data history | 3 |
| Consistent activity | 3 |

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
