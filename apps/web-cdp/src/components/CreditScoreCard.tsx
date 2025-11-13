'use client';

import { useState } from 'react';
import { 
  TrophyIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { UnderwritingEngine } from '@/lib/credit-scoring/index';

interface CreditScore {
  score: number;
  revenueInCents: number;
  revenueInDollars: number;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  shop: string;
  verifiable: boolean;
}

interface CreditScoreCardProps {
  creditScore: CreditScore;
  requestedAmount: number;
  onTermsAccepted?: (terms: any) => void;
  className?: string;
}

export default function CreditScoreCard({
  creditScore,
  requestedAmount,
  onTermsAccepted,
  className = ''
}: CreditScoreCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate underwriting results
  const underwritingResult = UnderwritingEngine.evaluateFundingRequest(
    creditScore.score,
    creditScore.revenueInDollars,
    requestedAmount
  );

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-600';
    if (score >= 55) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <ShieldCheckIcon className="h-5 w-5 text-green-600" />;
      case 'medium':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrophyIcon className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Credit Assessment
              </h3>
              <p className="text-sm text-gray-600">
                Based on Shopify store: {creditScore.shop}
              </p>
            </div>
          </div>
          {underwritingResult.approved ? (
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          ) : (
            <XCircleIcon className="h-8 w-8 text-red-600" />
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="px-6 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Credit Score */}
          <div>
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(creditScore.score)}`}>
                {creditScore.score}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getScoreBgColor(creditScore.score)}`}
                  style={{ width: `${creditScore.score}%` }}
                />
              </div>
              <div className="flex items-center justify-center space-x-2">
                {getRiskIcon(creditScore.riskLevel)}
                <span className={`font-medium capitalize ${
                  creditScore.riskLevel === 'low' ? 'text-green-600' :
                  creditScore.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {creditScore.riskLevel} Risk
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Revenue:</span>
                <span className="font-medium">${creditScore.revenueInDollars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified Revenue:</span>
                <div className="flex items-center space-x-1">
                  <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Shopify Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Underwriting Results */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Funding Terms</h4>
            
            {underwritingResult.approved ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Pre-Approved</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Funding:</span>
                      <span className="font-medium">${underwritingResult.maxFundingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue Share:</span>
                      <span className="font-medium">{(underwritingResult.paybackPercentage * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-medium">{(underwritingResult.interestRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {onTermsAccepted && (
                  <button
                    onClick={() => onTermsAccepted(underwritingResult)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Accept These Terms
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Not Approved</span>
                </div>
                <div className="text-sm text-red-700">
                  {underwritingResult.conditions?.[0] || 'Unable to approve funding at this time.'}
                </div>
              </div>
            )}

            {underwritingResult.conditions && underwritingResult.conditions.length > 1 && (
              <div className="mt-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showDetails ? 'Hide' : 'View'} Additional Conditions
                </button>
                {showDetails && (
                  <ul className="mt-2 text-xs text-gray-600 space-y-1">
                    {underwritingResult.conditions.slice(1).map((condition, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}