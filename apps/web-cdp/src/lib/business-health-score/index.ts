/**
 * Business Health Score - Privacy-First Risk Assessment
 *
 * This module calculates a composite business health score based on Shopify order data.
 * It displays qualitative tiers (Strong, Good, Fair, etc.) instead of exact numbers
 * to protect merchant privacy while providing meaningful trust signals to supporters.
 *
 * Inspired by:
 * - Kiva: 0.5-5 star ratings for field partner institutional risk
 * - Prosper/Lending Club: Letter grades (AA to HR) for peer lending
 * - Stripe Radar: Numeric scores (0-99) with risk thresholds
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface OrderData {
  id: string;
  createdAt: Date;
  totalPrice: number;
  currency: string;
  financialStatus: string;
  fulfillmentStatus: string | null;
}

export interface DetailedRevenueData {
  orders: OrderData[];
  totalRevenue: number;
  orderCount: number;
  periodDays: number;
  currency: string;
  firstOrderDate: Date | null;
  lastOrderDate: Date | null;
}

export type HealthGrade = 'A' | 'B' | 'C' | 'D';
export type ComponentTier = 'Excellent' | 'Strong' | 'Good' | 'Fair' | 'Weak' | 'Poor';
export type AffordabilityTier = 'Comfortable' | 'Manageable' | 'Stretched' | 'High Burden';

/**
 * Loan Affordability - Separate from Business Health Score
 *
 * This measures whether a specific loan amount is reasonable relative to
 * the business's monthly revenue. It's calculated per-loan, not per-business.
 *
 * Display separately from Business Health Score so lenders can see both:
 * - Business Health: Is this a stable, established business?
 * - Loan Affordability: Can they realistically repay THIS specific amount?
 */
export interface LoanAffordability {
  tier: AffordabilityTier;
  ratio: number;              // Loan amount / monthly revenue
  monthlyRevenue: number;     // Average monthly revenue
  loanAmount: number;
  description: string;
  privacySafeDisplay: string; // e.g., "~0.4x monthly revenue"
}

export interface ComponentScore {
  score: number;        // 0-100 internal score
  tier: ComponentTier;  // Privacy-safe display label
  rawValue?: number;    // Optional: internal use only, never displayed publicly
}

export interface BusinessHealthScore {
  overall: {
    grade: HealthGrade;
    score: number;      // 0-100
    description: string;
  };
  components: {
    revenueStability: ComponentScore;
    businessTenure: ComponentScore;
    growthTrend: ComponentScore;
    orderConsistency: ComponentScore;
  };
  weights: {
    revenueStability: number;
    businessTenure: number;
    growthTrend: number;
    orderConsistency: number;
  };
  metadata: {
    dataSource: string;
    periodAnalyzed: number; // days
    lastUpdated: Date;
    orderCount: number;
  };
}

// ============================================================================
// SCORING CONFIGURATION
// ============================================================================

/**
 * Component weights derived from FinRegLab research on cash flow-based credit scoring.
 *
 * Key findings from "Sharpening the Focus" (2025) and NBER Working Paper 33367:
 * - Cash flow stability (balance volatility) is the strongest predictor of default
 * - Revenue consistency matters more than absolute amounts
 * - Business tenure is important but cash flow metrics collectively outweigh it
 * - For constrained businesses (<5 years, low credit), cash flow is even MORE predictive
 *
 * These weights are initial estimates and should be calibrated with actual outcome data.
 *
 * Sources:
 * - FinRegLab: "The Use of Cash-Flow Data in Underwriting Credit" (2024)
 * - FinRegLab: "Sharpening the Focus" (June 2025) - 38,000+ small business loans
 * - NBER Working Paper 33367: "Modernizing Access to Credit for Younger Entrepreneurs"
 * - JPMorgan Chase Institute: "A Cash Flow Perspective on the Small Business Sector"
 */
const WEIGHTS = {
  revenueStability: 0.35,   // 35% - Strongest predictor per FinRegLab (balance volatility)
  orderConsistency: 0.25,   // 25% - Transaction frequency/regularity (JPMorgan research)
  businessTenure: 0.20,     // 20% - Important but less than combined cash flow metrics
  growthTrend: 0.20,        // 20% - Future capacity indicator
};

// Grade thresholds
const GRADE_THRESHOLDS = {
  A: 75,  // 75-100: Excellent
  B: 55,  // 55-74: Good
  C: 40,  // 40-54: Fair
  D: 0,   // 0-39: Elevated Risk
};

// Tier thresholds for components
const TIER_THRESHOLDS: Record<ComponentTier, number> = {
  Excellent: 85,
  Strong: 70,
  Good: 55,
  Fair: 40,
  Weak: 25,
  Poor: 0,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate Coefficient of Variation (CV) - lower is more stable
 * CV = (standard deviation / mean) * 100
 */
function calculateCV(values: number[]): number {
  if (values.length === 0) return 100;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 100;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  return (stdDev / mean) * 100;
}

/**
 * Group orders by month and calculate monthly totals
 */
function getMonthlyRevenue(orders: OrderData[]): number[] {
  const monthlyTotals: Record<string, number> = {};

  for (const order of orders) {
    const monthKey = `${order.createdAt.getFullYear()}-${order.createdAt.getMonth()}`;
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + order.totalPrice;
  }

  // Return sorted by date
  const sortedKeys = Object.keys(monthlyTotals).sort();
  return sortedKeys.map(k => monthlyTotals[k]);
}

/**
 * Group orders by week and count orders per week
 */
function getWeeklyOrderCounts(orders: OrderData[]): number[] {
  const weeklyCounts: Record<string, number> = {};

  for (const order of orders) {
    const weekStart = new Date(order.createdAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    weeklyCounts[weekKey] = (weeklyCounts[weekKey] || 0) + 1;
  }

  const sortedKeys = Object.keys(weeklyCounts).sort();
  return sortedKeys.map(k => weeklyCounts[k]);
}

/**
 * Convert score to tier label
 */
function scoreToTier(score: number): ComponentTier {
  if (score >= TIER_THRESHOLDS.Excellent) return 'Excellent';
  if (score >= TIER_THRESHOLDS.Strong) return 'Strong';
  if (score >= TIER_THRESHOLDS.Good) return 'Good';
  if (score >= TIER_THRESHOLDS.Fair) return 'Fair';
  if (score >= TIER_THRESHOLDS.Weak) return 'Weak';
  return 'Poor';
}

/**
 * Convert score to grade
 */
function scoreToGrade(score: number): HealthGrade {
  if (score >= GRADE_THRESHOLDS.A) return 'A';
  if (score >= GRADE_THRESHOLDS.B) return 'B';
  if (score >= GRADE_THRESHOLDS.C) return 'C';
  return 'D';
}

/**
 * Get grade description
 */
function getGradeDescription(grade: HealthGrade): string {
  switch (grade) {
    case 'A': return 'Excellent business health with strong stability and growth';
    case 'B': return 'Good business health with solid fundamentals';
    case 'C': return 'Fair business health with some areas for improvement';
    case 'D': return 'Elevated risk profile - limited data or concerning patterns';
  }
}

// ============================================================================
// COMPONENT SCORING FUNCTIONS
// ============================================================================

/**
 * REVENUE STABILITY (30%)
 * Measures month-over-month consistency in revenue
 * Lower coefficient of variation = higher score
 *
 * Scoring:
 * - CV < 15%: 100 (Excellent - very stable)
 * - CV < 25%: 85 (Strong)
 * - CV < 40%: 70 (Good)
 * - CV < 60%: 50 (Fair)
 * - CV < 80%: 30 (Weak)
 * - CV >= 80%: 15 (Poor - highly volatile)
 */
function calculateRevenueStability(orders: OrderData[]): ComponentScore {
  const monthlyRevenue = getMonthlyRevenue(orders);

  // Need at least 3 months of data for meaningful stability analysis
  if (monthlyRevenue.length < 3) {
    return {
      score: 40, // Fair by default for limited data
      tier: 'Fair',
      rawValue: undefined,
    };
  }

  const cv = calculateCV(monthlyRevenue);

  let score: number;
  if (cv < 15) score = 100;
  else if (cv < 25) score = 85;
  else if (cv < 40) score = 70;
  else if (cv < 60) score = 50;
  else if (cv < 80) score = 30;
  else score = 15;

  return {
    score,
    tier: scoreToTier(score),
    rawValue: cv,
  };
}

/**
 * BUSINESS TENURE (25%)
 * Measures how long the business has been operating with verified sales
 *
 * Scoring:
 * - 36+ months: 100 (Excellent - established)
 * - 24-35 months: 85 (Strong)
 * - 12-23 months: 70 (Good)
 * - 6-11 months: 50 (Fair)
 * - 3-5 months: 30 (Weak)
 * - < 3 months: 15 (Poor - very new)
 */
function calculateBusinessTenure(firstOrderDate: Date | null): ComponentScore {
  if (!firstOrderDate) {
    return {
      score: 15,
      tier: 'Poor',
      rawValue: 0,
    };
  }

  const now = new Date();
  const monthsActive = Math.floor(
    (now.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  let score: number;
  if (monthsActive >= 36) score = 100;
  else if (monthsActive >= 24) score = 85;
  else if (monthsActive >= 12) score = 70;
  else if (monthsActive >= 6) score = 50;
  else if (monthsActive >= 3) score = 30;
  else score = 15;

  return {
    score,
    tier: scoreToTier(score),
    rawValue: monthsActive,
  };
}

/**
 * GROWTH TREND (20%)
 * Compares recent revenue (last 30 days) to previous period
 * Positive growth is good, but extreme growth can indicate volatility
 *
 * Scoring:
 * - Growth 10-30%: 100 (Excellent - healthy growth)
 * - Growth 30-50%: 85 (Strong - fast growth)
 * - Growth 0-10%: 75 (Good - stable)
 * - Growth 50%+: 60 (Fair - possibly unsustainable)
 * - Decline 0-10%: 50 (Fair - minor decline)
 * - Decline 10-25%: 30 (Weak)
 * - Decline 25%+: 15 (Poor - significant decline)
 */
function calculateGrowthTrend(orders: OrderData[], periodDays: number): ComponentScore {
  // Need at least 2 months of data for meaningful growth analysis
  if (orders.length === 0) {
    return { score: 40, tier: 'Fair', rawValue: undefined };
  }

  // Check actual data span (not just periodDays parameter)
  const sortedOrders = [...orders].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const firstOrderDate = sortedOrders[0].createdAt;
  const lastOrderDate = sortedOrders[sortedOrders.length - 1].createdAt;
  const actualDataSpanDays = Math.floor((lastOrderDate.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24));

  // Require at least 45 days (~1.5 months) of actual data to calculate trend
  if (actualDataSpanDays < 45) {
    return { score: 40, tier: 'Fair', rawValue: undefined };
  }

  // Split based on actual data midpoint, not arbitrary period
  const midPointTime = firstOrderDate.getTime() + (lastOrderDate.getTime() - firstOrderDate.getTime()) / 2;
  const midPoint = new Date(midPointTime);

  const recentOrders = orders.filter(o => o.createdAt >= midPoint);
  const olderOrders = orders.filter(o => o.createdAt < midPoint);

  const recentRevenue = recentOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const olderRevenue = olderOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  // Handle edge cases
  if (olderRevenue === 0 && recentRevenue === 0) {
    return { score: 40, tier: 'Fair', rawValue: 0 };
  }
  if (olderRevenue === 0) {
    return { score: 60, tier: 'Good', rawValue: 100 }; // New business with sales
  }

  const growthRate = ((recentRevenue - olderRevenue) / olderRevenue) * 100;

  let score: number;
  if (growthRate >= 10 && growthRate < 30) score = 100;
  else if (growthRate >= 30 && growthRate < 50) score = 85;
  else if (growthRate >= 0 && growthRate < 10) score = 75;
  else if (growthRate >= 50) score = 60;
  else if (growthRate >= -10) score = 50;
  else if (growthRate >= -25) score = 30;
  else score = 15;

  return {
    score,
    tier: scoreToTier(score),
    rawValue: growthRate,
  };
}

/**
 * ORDER CONSISTENCY (25%)
 * Measures regularity of order flow week-over-week
 * Steady orders indicate reliable demand
 *
 * Scoring based on CV of weekly order counts:
 * - CV < 20%: 100 (Excellent - very consistent)
 * - CV < 35%: 85 (Strong)
 * - CV < 50%: 70 (Good)
 * - CV < 70%: 50 (Fair)
 * - CV < 90%: 30 (Weak)
 * - CV >= 90%: 15 (Poor - highly irregular)
 */
function calculateOrderConsistency(orders: OrderData[]): ComponentScore {
  const weeklyOrderCounts = getWeeklyOrderCounts(orders);

  // Need at least 4 weeks of data
  if (weeklyOrderCounts.length < 4) {
    return {
      score: 40,
      tier: 'Fair',
      rawValue: undefined,
    };
  }

  const cv = calculateCV(weeklyOrderCounts);

  let score: number;
  if (cv < 20) score = 100;
  else if (cv < 35) score = 85;
  else if (cv < 50) score = 70;
  else if (cv < 70) score = 50;
  else if (cv < 90) score = 30;
  else score = 15;

  return {
    score,
    tier: scoreToTier(score),
    rawValue: cv,
  };
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

/**
 * Calculate the complete Business Health Score from order data
 */
export function calculateBusinessHealthScore(
  data: DetailedRevenueData,
  dataSource: string = 'Shopify'
): BusinessHealthScore {
  // Calculate individual components
  const revenueStability = calculateRevenueStability(data.orders);
  const businessTenure = calculateBusinessTenure(data.firstOrderDate);
  const growthTrend = calculateGrowthTrend(data.orders, data.periodDays);
  const orderConsistency = calculateOrderConsistency(data.orders);

  // Calculate weighted overall score
  const overallScore = Math.round(
    revenueStability.score * WEIGHTS.revenueStability +
    businessTenure.score * WEIGHTS.businessTenure +
    growthTrend.score * WEIGHTS.growthTrend +
    orderConsistency.score * WEIGHTS.orderConsistency
  );

  const grade = scoreToGrade(overallScore);

  return {
    overall: {
      grade,
      score: overallScore,
      description: getGradeDescription(grade),
    },
    components: {
      revenueStability,
      businessTenure,
      growthTrend,
      orderConsistency,
    },
    weights: WEIGHTS,
    metadata: {
      dataSource,
      periodAnalyzed: data.periodDays,
      lastUpdated: new Date(),
      orderCount: data.orderCount,
    },
  };
}

// ============================================================================
// PRIVACY-SAFE DISPLAY HELPERS
// ============================================================================

/**
 * Get tenure display string (privacy-safe)
 */
export function getTenureDisplay(score: ComponentScore): string {
  const months = score.rawValue as number | undefined;
  if (!months) return 'New';
  if (months >= 36) return '3+ years';
  if (months >= 24) return '2+ years';
  if (months >= 12) return '1+ year';
  if (months >= 6) return '6+ months';
  return '< 6 months';
}

/**
 * Get growth trend display string (privacy-safe)
 */
export function getGrowthDisplay(score: ComponentScore): string {
  const rate = score.rawValue as number | undefined;
  if (rate === undefined) return 'Insufficient data';
  if (rate >= 30) return 'Accelerating';
  if (rate >= 10) return 'Growing';
  if (rate >= 0) return 'Stable';
  if (rate >= -10) return 'Slight decline';
  return 'Declining';
}

/**
 * Format score for public display (removes exact numbers)
 */
export function getPublicScore(healthScore: BusinessHealthScore): {
  grade: HealthGrade;
  score: number;
  components: {
    revenueStability: { tier: ComponentTier };
    businessTenure: { tier: ComponentTier; display: string };
    growthTrend: { tier: ComponentTier; display: string };
    orderConsistency: { tier: ComponentTier };
  };
  verified: boolean;
  source: string;
  lastUpdated: Date;
} {
  return {
    grade: healthScore.overall.grade,
    score: healthScore.overall.score,
    components: {
      revenueStability: { tier: healthScore.components.revenueStability.tier },
      businessTenure: {
        tier: healthScore.components.businessTenure.tier,
        display: getTenureDisplay(healthScore.components.businessTenure),
      },
      growthTrend: {
        tier: healthScore.components.growthTrend.tier,
        display: getGrowthDisplay(healthScore.components.growthTrend),
      },
      orderConsistency: { tier: healthScore.components.orderConsistency.tier },
    },
    verified: true,
    source: healthScore.metadata.dataSource,
    lastUpdated: healthScore.metadata.lastUpdated,
  };
}

// ============================================================================
// LOAN AFFORDABILITY - SEPARATE INDICATOR
// ============================================================================

/**
 * Affordability tier thresholds based on loan-to-monthly-revenue ratio
 *
 * These thresholds are informed by revenue-based financing industry standards:
 * - Clearco/Wayflyer typically cap at 1-2x monthly revenue
 * - MCA lenders often go up to 1.5x monthly revenue
 * - Traditional RBF: repayment = 10-20% of revenue over 3-12 months
 */
const AFFORDABILITY_THRESHOLDS = {
  comfortable: 0.5,   // Loan < 2 weeks revenue
  manageable: 1.0,    // Loan < 1 month revenue
  stretched: 2.0,     // Loan = 1-2 months revenue
  // > 2.0 = High Burden
};

/**
 * Calculate Loan Affordability - A separate indicator from Business Health Score
 *
 * This answers: "Can this business realistically repay THIS specific loan amount?"
 *
 * Unlike Business Health Score (which measures business quality), this is
 * loan-specific and should be displayed separately so lenders see both dimensions.
 *
 * @param monthlyRevenue - Average monthly revenue (can be calculated from DetailedRevenueData)
 * @param loanAmount - The specific loan amount being requested
 */
export function calculateLoanAffordability(
  monthlyRevenue: number,
  loanAmount: number
): LoanAffordability {
  // Handle edge cases
  if (monthlyRevenue <= 0) {
    return {
      tier: 'High Burden',
      ratio: Infinity,
      monthlyRevenue: 0,
      loanAmount,
      description: 'No verified revenue data available',
      privacySafeDisplay: 'Unable to assess',
    };
  }

  const ratio = loanAmount / monthlyRevenue;

  let tier: AffordabilityTier;
  let description: string;

  if (ratio < AFFORDABILITY_THRESHOLDS.comfortable) {
    tier = 'Comfortable';
    description = 'Loan is less than 2 weeks of revenue - very manageable repayment';
  } else if (ratio < AFFORDABILITY_THRESHOLDS.manageable) {
    tier = 'Manageable';
    description = 'Loan is less than 1 month of revenue - reasonable repayment burden';
  } else if (ratio < AFFORDABILITY_THRESHOLDS.stretched) {
    tier = 'Stretched';
    description = 'Loan equals 1-2 months of revenue - significant but possible';
  } else {
    tier = 'High Burden';
    description = 'Loan exceeds 2 months of revenue - may be difficult to repay';
  }

  // Privacy-safe display: show ratio range, not exact revenue
  let privacySafeDisplay: string;
  if (ratio < 0.25) {
    privacySafeDisplay = '< 1 week revenue';
  } else if (ratio < 0.5) {
    privacySafeDisplay = '~1-2 weeks revenue';
  } else if (ratio < 1.0) {
    privacySafeDisplay = '~2-4 weeks revenue';
  } else if (ratio < 2.0) {
    privacySafeDisplay = '~1-2 months revenue';
  } else {
    privacySafeDisplay = '> 2 months revenue';
  }

  return {
    tier,
    ratio,
    monthlyRevenue,
    loanAmount,
    description,
    privacySafeDisplay,
  };
}

/**
 * Calculate average monthly revenue from order data
 */
export function calculateMonthlyRevenue(data: DetailedRevenueData): number {
  if (data.periodDays <= 0 || data.totalRevenue <= 0) {
    return 0;
  }
  // Convert period revenue to monthly
  return (data.totalRevenue / data.periodDays) * 30;
}

/**
 * Get affordability tier color for UI
 */
export function getAffordabilityColor(tier: AffordabilityTier): string {
  switch (tier) {
    case 'Comfortable': return 'green';
    case 'Manageable': return 'blue';
    case 'Stretched': return 'amber';
    case 'High Burden': return 'red';
  }
}
