export interface CreditScoreData {
  score: number;
  revenueInCents: number;
  timestamp: Date;
  shop: string;
  riskLevel: 'low' | 'medium' | 'high';
  factors: CreditFactor[];
}

export interface CreditFactor {
  name: string;
  value: number;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface UnderwritingResult {
  approved: boolean;
  maxFundingAmount: number;
  interestRate: number;
  paybackPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  conditions?: string[];
  creditScore: number;
  monthlyRevenue: number;
}

export class CreditScoringEngine {
  // Calculate credit score from revenue data
  static calculateScore(revenueInCents: number, additionalFactors?: Partial<CreditFactor>[]): number {
    const baseScore = this.calculateBaseScore(revenueInCents);
    
    // Apply additional factors if provided
    if (additionalFactors && additionalFactors.length > 0) {
      const adjustedScore = this.applyFactors(baseScore, additionalFactors as CreditFactor[]);
      return Math.max(30, Math.min(100, adjustedScore)); // Clamp between 30-100
    }
    
    return baseScore;
  }

  // Base score calculation from revenue
  private static calculateBaseScore(revenueInCents: number): number {
    const revenueInDollars = revenueInCents / 100;
    
    if (revenueInDollars >= 2000) return 85;
    if (revenueInDollars >= 1000) return 75;
    if (revenueInDollars >= 500) return 65;
    if (revenueInDollars >= 200) return 55;
    if (revenueInDollars >= 100) return 45;
    return 30;
  }

  // Apply additional scoring factors
  private static applyFactors(baseScore: number, factors: CreditFactor[]): number {
    let adjustedScore = baseScore;
    
    for (const factor of factors) {
      const adjustment = factor.value * factor.weight;
      if (factor.impact === 'positive') {
        adjustedScore += adjustment;
      } else if (factor.impact === 'negative') {
        adjustedScore -= adjustment;
      }
    }
    
    return adjustedScore;
  }

  // Determine risk level from credit score
  static getRiskLevel(creditScore: number): 'low' | 'medium' | 'high' {
    if (creditScore >= 75) return 'low';
    if (creditScore >= 55) return 'medium';
    return 'high';
  }
}

export class UnderwritingEngine {
  // Evaluate funding request based on credit score and revenue
  static evaluateFundingRequest(
    creditScore: number,
    monthlyRevenue: number,
    requestedAmount: number,
    businessAge?: number, // in months
    industry?: string
  ): UnderwritingResult {
    const riskLevel = CreditScoringEngine.getRiskLevel(creditScore);
    
    // Base approval logic
    const minScore = 45;
    const approved = creditScore >= minScore && monthlyRevenue > 0;
    
    if (!approved) {
      return {
        approved: false,
        maxFundingAmount: 0,
        interestRate: 0,
        paybackPercentage: 0,
        riskLevel,
        creditScore,
        monthlyRevenue,
        conditions: ['Credit score below minimum threshold']
      };
    }

    // Calculate max funding amount (typically 3-6x monthly revenue)
    const revenueMultiplier = this.getRevenueMultiplier(riskLevel, businessAge);
    const maxFundingAmount = Math.floor(monthlyRevenue * revenueMultiplier);
    const actualFundingAmount = Math.min(requestedAmount, maxFundingAmount);

    // Calculate interest rate and payback percentage
    const interestRate = this.calculateInterestRate(riskLevel, creditScore);
    const paybackPercentage = this.calculatePaybackPercentage(riskLevel, actualFundingAmount, monthlyRevenue);

    // Generate conditions if any
    const conditions = this.generateConditions(riskLevel, creditScore, monthlyRevenue, requestedAmount);

    return {
      approved: true,
      maxFundingAmount: actualFundingAmount,
      interestRate,
      paybackPercentage,
      riskLevel,
      creditScore,
      monthlyRevenue,
      conditions: conditions.length > 0 ? conditions : undefined
    };
  }

  private static getRevenueMultiplier(riskLevel: 'low' | 'medium' | 'high', businessAge?: number): number {
    let baseMultiplier: number;
    
    switch (riskLevel) {
      case 'low': baseMultiplier = 6; break;
      case 'medium': baseMultiplier = 4; break;
      case 'high': baseMultiplier = 2.5; break;
    }

    // Adjust for business age
    if (businessAge) {
      if (businessAge >= 24) baseMultiplier *= 1.2; // 2+ years
      else if (businessAge >= 12) baseMultiplier *= 1.1; // 1+ year
      else if (businessAge < 6) baseMultiplier *= 0.8; // Less than 6 months
    }

    return baseMultiplier;
  }

  private static calculateInterestRate(riskLevel: 'low' | 'medium' | 'high', creditScore: number): number {
    let baseRate: number;
    
    switch (riskLevel) {
      case 'low': baseRate = 0.08; break; // 8%
      case 'medium': baseRate = 0.12; break; // 12%
      case 'high': baseRate = 0.18; break; // 18%
    }

    // Fine-tune based on exact credit score
    const scoreAdjustment = (75 - creditScore) * 0.001; // 0.1% per point below 75
    return Math.max(0.06, baseRate + scoreAdjustment); // Minimum 6%
  }

  private static calculatePaybackPercentage(
    riskLevel: 'low' | 'medium' | 'high', 
    fundingAmount: number, 
    monthlyRevenue: number
  ): number {
    // Base payback percentage of revenue
    let basePercentage: number;
    
    switch (riskLevel) {
      case 'low': basePercentage = 0.08; break; // 8% of revenue
      case 'medium': basePercentage = 0.12; break; // 12% of revenue  
      case 'high': basePercentage = 0.15; break; // 15% of revenue
    }

    // Adjust based on funding amount relative to revenue
    const fundingToRevenueRatio = fundingAmount / monthlyRevenue;
    if (fundingToRevenueRatio > 4) {
      basePercentage *= 1.2; // Higher percentage for larger advances
    } else if (fundingToRevenueRatio < 2) {
      basePercentage *= 0.9; // Lower percentage for smaller advances
    }

    return Math.min(0.20, Math.max(0.06, basePercentage)); // Clamp between 6-20%
  }

  private static generateConditions(
    riskLevel: 'low' | 'medium' | 'high',
    creditScore: number,
    monthlyRevenue: number,
    requestedAmount: number
  ): string[] {
    const conditions: string[] = [];

    if (riskLevel === 'high') {
      conditions.push('Daily sales monitoring required');
      conditions.push('Quarterly revenue verification');
    }

    if (creditScore < 60) {
      conditions.push('Personal guarantee may be required');
    }

    if (requestedAmount > monthlyRevenue * 5) {
      conditions.push('Additional financial documentation required');
    }

    if (monthlyRevenue < 5000) {
      conditions.push('Minimum 6 months revenue history verification');
    }

    return conditions;
  }
}

// Types exported directly in this file