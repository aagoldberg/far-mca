export interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  foundedDate: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  taxId?: string;
  legalStructure: 'sole_proprietorship' | 'llc' | 'corporation' | 'partnership';
}

export interface FinancialData {
  monthlyRevenue: number;
  averageOrderValue: number;
  customerCount: number;
  repeatCustomerRate: number;
  seasonality: {
    month: number;
    revenueMultiplier: number;
  }[];
  cashFlow: {
    date: Date;
    amount: number;
    type: 'inflow' | 'outflow';
  }[];
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'very_high';
  riskFactors: {
    industryRisk: number;
    financialStability: number;
    creditHistory: number;
    businessAge: number;
    marketConditions: number;
  };
  mitigatingFactors: string[];
  concerningFactors: string[];
  recommendedActions: string[];
}

export interface FundingTerms {
  principalAmount: number;
  paybackAmount: number;
  paybackPercentage: number; // Percentage of daily/weekly revenue
  estimatedTerm: number; // Days to full payback
  maxTerm: number; // Maximum days allowed
  gracePeriod: number; // Days before default
  fees: {
    originationFee: number;
    latePaymentFee: number;
    defaultFee: number;
  };
}

export interface CreditDecision {
  approved: boolean;
  fundingTerms?: FundingTerms;
  conditions: string[];
  expiresAt: Date;
  reviewerId: string;
  notes?: string;
}