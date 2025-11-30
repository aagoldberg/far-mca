/**
 * Credit Score Calculation Library
 *
 * Calculates a 0-100 credit score based on business revenue data
 * from connected platforms (Shopify, Stripe, Square, Plaid)
 */

export interface RevenueData {
  totalRevenue: number;
  orderCount: number;
  periodDays: number;
  currency: string;
  averageOrderValue?: number;
  growthRate?: number; // Percentage growth compared to previous period
}

export interface BusinessConnection {
  platform: 'shopify' | 'stripe' | 'square' | 'plaid';
  revenue_data: RevenueData;
  connected_at: Date;
  last_synced_at?: Date;
}

export interface CreditScoreResult {
  score: number; // 0-100
  breakdown: {
    revenueScore: number;
    consistencyScore: number;
    reliabilityScore: number;
    growthScore: number;
  };
  factors: string[];
  recommendations: string[];
}

/**
 * Calculate credit score based on multiple business connections
 */
export function calculateCreditScore(connections: BusinessConnection[]): CreditScoreResult {
  if (connections.length === 0) {
    return {
      score: 0,
      breakdown: { revenueScore: 0, consistencyScore: 0, reliabilityScore: 0, growthScore: 0 },
      factors: ['No business connections'],
      recommendations: ['Connect your Shopify, Stripe, Square, or bank account to get scored'],
    };
  }

  // Calculate component scores
  const revenueScore = calculateRevenueScore(connections);
  const consistencyScore = calculateConsistencyScore(connections);
  const reliabilityScore = calculateReliabilityScore(connections);
  const growthScore = calculateGrowthScore(connections);

  // Weighted average
  const score = Math.round(
    revenueScore * 0.4 +
    consistencyScore * 0.2 +
    reliabilityScore * 0.2 +
    growthScore * 0.2
  );

  const factors = buildFactors(connections, { revenueScore, consistencyScore, reliabilityScore, growthScore });
  const recommendations = buildRecommendations(connections, score);

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: { revenueScore, consistencyScore, reliabilityScore, growthScore },
    factors,
    recommendations,
  };
}

/**
 * Score based on total revenue (0-40 points)
 * Scales logarithmically to handle wide range
 */
function calculateRevenueScore(connections: BusinessConnection[]): number {
  const totalRevenue = connections.reduce((sum, conn) => sum + conn.revenue_data.totalRevenue, 0);

  // Normalize to 30-day period for fairness
  const avgPeriodDays = connections.reduce((sum, conn) => sum + conn.revenue_data.periodDays, 0) / connections.length;
  const normalizedRevenue = (totalRevenue / avgPeriodDays) * 30;

  // Logarithmic scale:
  // $0 = 0 points
  // $10k/month = 20 points
  // $50k/month = 30 points
  // $200k/month = 40 points
  if (normalizedRevenue <= 0) return 0;

  const score = 20 * Math.log10(normalizedRevenue / 1000);
  return Math.min(40, Math.max(0, score));
}

/**
 * Score based on multiple platforms showing consistent data (0-20 points)
 */
function calculateConsistencyScore(connections: BusinessConnection[]): number {
  if (connections.length === 1) return 10; // Baseline for single platform

  // Multiple platforms = higher trust
  const platformBonus = Math.min(10, connections.length * 5);

  // Check if revenues are consistent across platforms
  const revenues = connections.map(c => c.revenue_data.totalRevenue);
  const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length;
  const variance = revenues.reduce((sum, r) => sum + Math.pow(r - avgRevenue, 2), 0) / revenues.length;
  const coefficientOfVariation = Math.sqrt(variance) / avgRevenue;

  // Lower variation = more consistent = higher score
  const consistencyBonus = coefficientOfVariation < 0.2 ? 10 : coefficientOfVariation < 0.5 ? 5 : 0;

  return platformBonus + consistencyBonus;
}

/**
 * Score based on platform reliability (0-20 points)
 * Plaid (bank data) is most reliable, Shopify/Stripe also good
 */
function calculateReliabilityScore(connections: BusinessConnection[]): number {
  const platformScores: Record<string, number> = {
    plaid: 20,    // Bank data - highest trust
    stripe: 15,   // Payment processor - high trust
    square: 15,   // Payment processor - high trust
    shopify: 12,  // E-commerce platform - good trust
  };

  const scores = connections.map(c => platformScores[c.platform] || 0);
  return Math.max(...scores); // Take highest reliability platform
}

/**
 * Score based on revenue growth trend (0-20 points)
 */
function calculateGrowthScore(connections: BusinessConnection[]): number {
  // Find connections with growth rate data
  const growthRates = connections
    .map(c => c.revenue_data.growthRate)
    .filter((rate): rate is number => rate !== undefined);

  if (growthRates.length === 0) return 10; // Neutral score if no growth data

  const avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

  // Growth scoring:
  // < -20% = 0 points (declining badly)
  // -20% to 0% = 5 points (stable/slight decline)
  // 0% to 10% = 10 points (neutral)
  // 10% to 30% = 15 points (good growth)
  // > 30% = 20 points (strong growth)

  if (avgGrowthRate < -20) return 0;
  if (avgGrowthRate < 0) return 5;
  if (avgGrowthRate < 10) return 10;
  if (avgGrowthRate < 30) return 15;
  return 20;
}

/**
 * Build human-readable factors explaining the score
 */
function buildFactors(connections: BusinessConnection[], breakdown: any): string[] {
  const factors: string[] = [];

  // Revenue
  const totalRevenue = connections.reduce((sum, conn) => sum + conn.revenue_data.totalRevenue, 0);
  factors.push(`$${(totalRevenue / 1000).toFixed(1)}k revenue across ${connections.length} platform(s)`);

  // Platform variety
  if (connections.length > 1) {
    factors.push(`${connections.length} platforms connected increases trust`);
  }

  // High-reliability platforms
  if (connections.some(c => c.platform === 'plaid')) {
    factors.push('Bank account verified via Plaid');
  }

  // Growth
  const hasGrowth = connections.some(c => c.revenue_data.growthRate && c.revenue_data.growthRate > 10);
  if (hasGrowth) {
    factors.push('Showing positive revenue growth');
  }

  return factors;
}

/**
 * Build recommendations to improve credit score
 */
function buildRecommendations(connections: BusinessConnection[], score: number): string[] {
  const recommendations: string[] = [];

  // Low score - need more connections
  if (score < 40) {
    recommendations.push('Connect more business accounts to increase your score');
  }

  // No bank connection
  if (!connections.some(c => c.platform === 'plaid')) {
    recommendations.push('Connect your bank account via Plaid for highest trust score');
  }

  // Only one platform
  if (connections.length === 1) {
    recommendations.push('Connect a second platform to verify consistency');
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
