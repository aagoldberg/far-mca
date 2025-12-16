/**
 * Business Health Score Calculation Library
 *
 * Calculates a 0-100 health score based on business stability metrics:
 * - Revenue Stability (35%): Coefficient of variation of monthly revenue
 * - Order Consistency (25%): Coefficient of variation of weekly orders
 * - Business Tenure (20%): Months since first order
 * - Growth Trend (20%): Recent vs prior period revenue comparison
 *
 * See /risk-scoring page for full methodology documentation.
 */

export interface OrderData {
  id: string;
  createdAt: Date;
  totalPrice: number;
  currency: string;
}

export interface RevenueData {
  totalRevenue: number;
  orderCount: number;
  periodDays: number;
  currency: string;
  averageOrderValue?: number;
  growthRate?: number;
  // New: detailed order data for Business Health Score
  orders?: OrderData[];
  firstOrderDate?: string;
  lastOrderDate?: string;
}

export interface BusinessConnection {
  platform: 'shopify' | 'stripe' | 'square' | 'plaid';
  revenue_data: RevenueData;
  connected_at: Date;
  last_synced_at?: Date;
}

export interface CreditScoreResult {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D';
  gradeLabel: string;
  breakdown: {
    revenueStability: number;
    orderConsistency: number;
    businessTenure: number;
    growthTrend: number;
  };
  factors: string[];
  recommendations: string[];
}

/**
 * Calculate Business Health Score based on connected platforms
 */
export function calculateCreditScore(connections: BusinessConnection[]): CreditScoreResult {
  if (connections.length === 0) {
    return {
      score: 0,
      grade: 'D',
      gradeLabel: 'Emerging',
      breakdown: { revenueStability: 0, orderConsistency: 0, businessTenure: 0, growthTrend: 0 },
      factors: ['No business connections'],
      recommendations: ['Connect your Shopify, Stripe, Square, or bank account to get scored'],
    };
  }

  // Aggregate all orders from all connections
  const allOrders = aggregateOrders(connections);

  // If no detailed order data, fall back to basic scoring
  if (allOrders.length === 0) {
    return calculateBasicScore(connections);
  }

  // Get the earliest stored firstOrderDate from connections (allows for manual backdating)
  const storedFirstOrderDate = getEarliestFirstOrderDate(connections);

  // Calculate component scores (each returns 0-100)
  const revenueStability = calculateRevenueStability(allOrders);
  const orderConsistency = calculateOrderConsistency(allOrders);
  const businessTenure = calculateBusinessTenure(allOrders, storedFirstOrderDate);
  const growthTrend = calculateGrowthTrend(allOrders);

  // Weighted average per /risk-scoring spec
  const score = Math.round(
    revenueStability * 0.35 +
    orderConsistency * 0.25 +
    businessTenure * 0.20 +
    growthTrend * 0.20
  );

  const clampedScore = Math.min(100, Math.max(0, score));
  const { grade, gradeLabel } = getGrade(clampedScore);

  const factors = buildFactors(connections, allOrders, { revenueStability, orderConsistency, businessTenure, growthTrend });
  const recommendations = buildRecommendations(connections, clampedScore, { revenueStability, orderConsistency, businessTenure, growthTrend });

  return {
    score: clampedScore,
    grade,
    gradeLabel,
    breakdown: { revenueStability, orderConsistency, businessTenure, growthTrend },
    factors,
    recommendations,
  };
}

/**
 * Aggregate orders from all connections into a single sorted array
 */
function aggregateOrders(connections: BusinessConnection[]): OrderData[] {
  const allOrders: OrderData[] = [];

  for (const conn of connections) {
    if (conn.revenue_data.orders && Array.isArray(conn.revenue_data.orders)) {
      for (const order of conn.revenue_data.orders) {
        allOrders.push({
          id: order.id,
          createdAt: new Date(order.createdAt),
          totalPrice: order.totalPrice,
          currency: order.currency,
        });
      }
    }
  }

  // Sort by date ascending
  allOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return allOrders;
}

/**
 * Revenue Stability (35% weight)
 * Uses coefficient of variation (CV) of monthly revenue
 * Lower CV = more stable = higher score
 */
function calculateRevenueStability(orders: OrderData[]): number {
  const monthlyRevenue = getMonthlyRevenue(orders);

  if (monthlyRevenue.length < 2) {
    // Not enough data for CV calculation - give neutral score
    return 50;
  }

  const cv = calculateCV(monthlyRevenue);

  // CV thresholds per /risk-scoring spec
  if (cv < 15) return 100;
  if (cv < 25) return 85;
  if (cv < 40) return 70;
  if (cv < 60) return 50;
  if (cv < 80) return 30;
  return 15;
}

/**
 * Order Consistency (25% weight)
 * Uses coefficient of variation (CV) of weekly order counts
 * Lower CV = more consistent = higher score
 */
function calculateOrderConsistency(orders: OrderData[]): number {
  const weeklyOrders = getWeeklyOrderCounts(orders);

  if (weeklyOrders.length < 2) {
    // Not enough data - give neutral score
    return 50;
  }

  const cv = calculateCV(weeklyOrders);

  // CV thresholds per /risk-scoring spec
  if (cv < 20) return 100;
  if (cv < 35) return 85;
  if (cv < 50) return 70;
  if (cv < 70) return 50;
  if (cv < 90) return 30;
  return 15;
}

/**
 * Get the earliest firstOrderDate from stored connection data
 * This allows for manually backdated dates (for testing/demos)
 */
function getEarliestFirstOrderDate(connections: BusinessConnection[]): Date | null {
  let earliest: Date | null = null;

  for (const conn of connections) {
    if (conn.revenue_data?.firstOrderDate) {
      const date = new Date(conn.revenue_data.firstOrderDate);
      if (!earliest || date < earliest) {
        earliest = date;
      }
    }
  }

  return earliest;
}

/**
 * Business Tenure (20% weight)
 * Months since first order
 * Uses stored firstOrderDate if available (allows for backdating), otherwise falls back to orders
 */
function calculateBusinessTenure(orders: OrderData[], storedFirstOrderDate?: Date | null): number {
  if (orders.length === 0) return 15;

  // Use stored firstOrderDate if available (allows for manual backdating)
  // Otherwise fall back to the earliest order date from the orders array
  const firstOrderDate = storedFirstOrderDate || orders[0].createdAt;
  const now = new Date();
  const monthsActive = (now.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  // Tenure thresholds per /risk-scoring spec
  if (monthsActive >= 36) return 100;
  if (monthsActive >= 24) return 85;
  if (monthsActive >= 12) return 70;
  if (monthsActive >= 6) return 50;
  if (monthsActive >= 3) return 30;
  return 15;
}

/**
 * Growth Trend (20% weight)
 * Compares revenue in second half vs first half of data period
 * Sustainable growth (10-30%) scores highest
 */
function calculateGrowthTrend(orders: OrderData[]): number {
  if (orders.length < 10) {
    // Not enough orders for meaningful trend - give neutral score
    return 50;
  }

  // Split orders at midpoint
  const midpoint = Math.floor(orders.length / 2);
  const firstHalf = orders.slice(0, midpoint);
  const secondHalf = orders.slice(midpoint);

  const firstHalfRevenue = firstHalf.reduce((sum, o) => sum + o.totalPrice, 0);
  const secondHalfRevenue = secondHalf.reduce((sum, o) => sum + o.totalPrice, 0);

  if (firstHalfRevenue === 0) {
    // Can't calculate growth from zero - check if second half has revenue
    return secondHalfRevenue > 0 ? 75 : 50;
  }

  const growthRate = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;

  // Growth thresholds per /risk-scoring spec
  // Sustainable growth (10-30%) scores highest
  if (growthRate >= 10 && growthRate <= 30) return 100;
  if (growthRate > 30 && growthRate <= 50) return 85;
  if (growthRate >= 0 && growthRate < 10) return 75;
  if (growthRate > 50) return 60; // Hyper-growth can be risky
  if (growthRate >= -10 && growthRate < 0) return 50;
  if (growthRate >= -20 && growthRate < -10) return 30;
  return 15; // Severe decline
}

/**
 * Calculate coefficient of variation (CV)
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
 * Group orders by month and return array of monthly revenue totals
 */
function getMonthlyRevenue(orders: OrderData[]): number[] {
  if (orders.length === 0) return [];

  const monthlyTotals = new Map<string, number>();

  for (const order of orders) {
    const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
    monthlyTotals.set(key, (monthlyTotals.get(key) || 0) + order.totalPrice);
  }

  // Return values in chronological order
  return Array.from(monthlyTotals.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([_, revenue]) => revenue);
}

/**
 * Group orders by week and return array of weekly order counts
 */
function getWeeklyOrderCounts(orders: OrderData[]): number[] {
  if (orders.length === 0) return [];

  const weeklyCounts = new Map<string, number>();

  for (const order of orders) {
    // Get ISO week number
    const date = order.createdAt;
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    const key = `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    weeklyCounts.set(key, (weeklyCounts.get(key) || 0) + 1);
  }

  // Return values in chronological order
  return Array.from(weeklyCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([_, count]) => count);
}

/**
 * Get grade and label from score
 */
function getGrade(score: number): { grade: 'A' | 'B' | 'C' | 'D'; gradeLabel: string } {
  if (score >= 75) return { grade: 'A', gradeLabel: 'Established' };
  if (score >= 55) return { grade: 'B', gradeLabel: 'Growing' };
  if (score >= 40) return { grade: 'C', gradeLabel: 'Building' };
  return { grade: 'D', gradeLabel: 'Emerging' };
}

/**
 * Fallback scoring for connections without detailed order data
 */
function calculateBasicScore(connections: BusinessConnection[]): CreditScoreResult {
  // Use simple revenue-based scoring as fallback
  const totalRevenue = connections.reduce((sum, conn) => sum + (conn.revenue_data.totalRevenue || 0), 0);
  const totalOrders = connections.reduce((sum, conn) => sum + (conn.revenue_data.orderCount || 0), 0);

  // Simple score based on revenue (more generous than before)
  let score = 40; // Base score for having any connection

  if (totalRevenue >= 100000) score = 85;
  else if (totalRevenue >= 50000) score = 75;
  else if (totalRevenue >= 20000) score = 65;
  else if (totalRevenue >= 10000) score = 55;
  else if (totalRevenue >= 5000) score = 50;
  else if (totalRevenue >= 1000) score = 45;

  const { grade, gradeLabel } = getGrade(score);

  return {
    score,
    grade,
    gradeLabel,
    breakdown: {
      revenueStability: score,
      orderConsistency: score,
      businessTenure: score,
      growthTrend: score,
    },
    factors: [
      `$${(totalRevenue / 1000).toFixed(1)}k revenue across ${connections.length} platform(s)`,
      `${totalOrders} total orders`,
      'Detailed order data not available - using basic scoring',
    ],
    recommendations: [
      'Sync your platform to get detailed order history for a more accurate score',
    ],
  };
}

/**
 * Build human-readable factors explaining the score
 */
function buildFactors(
  connections: BusinessConnection[],
  orders: OrderData[],
  breakdown: { revenueStability: number; orderConsistency: number; businessTenure: number; growthTrend: number }
): string[] {
  const factors: string[] = [];

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  factors.push(`$${(totalRevenue / 1000).toFixed(1)}k revenue from ${orders.length} orders`);

  // Revenue stability
  if (breakdown.revenueStability >= 85) {
    factors.push('Very consistent month-over-month revenue');
  } else if (breakdown.revenueStability >= 70) {
    factors.push('Good revenue consistency');
  } else if (breakdown.revenueStability < 50) {
    factors.push('Revenue varies significantly month-to-month');
  }

  // Order consistency
  if (breakdown.orderConsistency >= 85) {
    factors.push('Steady order flow week-over-week');
  } else if (breakdown.orderConsistency < 50) {
    factors.push('Order volume fluctuates week-to-week');
  }

  // Tenure
  if (orders.length > 0) {
    const firstOrderDate = orders[0].createdAt;
    const monthsActive = Math.floor((Date.now() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (monthsActive >= 24) {
      factors.push(`${monthsActive}+ months of sales history`);
    } else if (monthsActive >= 12) {
      factors.push(`${monthsActive} months of track record`);
    } else {
      factors.push(`${monthsActive} months since first sale`);
    }
  }

  // Growth
  if (breakdown.growthTrend >= 85) {
    factors.push('Strong, sustainable growth trend');
  } else if (breakdown.growthTrend >= 60) {
    factors.push('Positive revenue trajectory');
  } else if (breakdown.growthTrend < 50) {
    factors.push('Revenue trend is flat or declining');
  }

  return factors;
}

/**
 * Build recommendations to improve score
 */
function buildRecommendations(
  connections: BusinessConnection[],
  score: number,
  breakdown: { revenueStability: number; orderConsistency: number; businessTenure: number; growthTrend: number }
): string[] {
  const recommendations: string[] = [];

  // Low revenue stability
  if (breakdown.revenueStability < 70) {
    recommendations.push('Focus on recurring revenue or subscriptions to improve stability');
  }

  // Low order consistency
  if (breakdown.orderConsistency < 70) {
    recommendations.push('Regular marketing campaigns can help smooth out order flow');
  }

  // New business
  if (breakdown.businessTenure < 50) {
    recommendations.push('Your score will improve as you build more sales history');
  }

  // Declining growth
  if (breakdown.growthTrend < 50) {
    recommendations.push('Focus on customer retention and acquisition to improve growth trend');
  }

  // Only one platform
  if (connections.length === 1) {
    recommendations.push('Connect additional sales channels for a more complete picture');
  }

  // Old data
  const hasOldData = connections.some(c => {
    if (!c.last_synced_at) return false;
    const daysSince = (Date.now() - c.last_synced_at.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 7;
  });
  if (hasOldData) {
    recommendations.push('Refresh your data - some connections are over a week old');
  }

  return recommendations;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
