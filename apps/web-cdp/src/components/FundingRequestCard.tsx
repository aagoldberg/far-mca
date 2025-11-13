'use client';

import { useState } from 'react';
import { 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
// import CreditScoreCard from './CreditScoreCard'; // Temporarily disabled

interface CreditScore {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  revenueVerified: boolean;
  timestamp: string;
  shopifyStore?: string;
}

interface UnderwritingResult {
  approved: boolean;
  maxFundingAmount: number;
  interestRate: number;
  paybackPercentage: number;
  conditions?: string[];
}

interface FundingRequest {
  id: string;
  businessName: string;
  description: string;
  fundingAmount: number;
  monthlyRevenue: number;
  revenueShare: number;
  repaymentCap: number;
  useOfFunds: string;
  image?: string;
  creator: string;
  createdAt: string;
  creditScore?: CreditScore;
  underwriting?: UnderwritingResult;
}

interface FundingRequestCardProps {
  request: FundingRequest;
  onInvest?: (request: FundingRequest) => void;
  showCreditInfo?: boolean;
}

export default function FundingRequestCard({
  request,
  onInvest,
  showCreditInfo = true
}: FundingRequestCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getApprovalBadge = () => {
    if (!request.underwriting) return null;

    const { approved } = request.underwriting;
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        approved 
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      }`}>
        {approved ? (
          <>
            <ShieldCheckIcon className="h-3 w-3 mr-1" />
            PRE-APPROVED
          </>
        ) : (
          'UNDER REVIEW'
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {request.image ? (
              <img 
                src={request.image} 
                alt={request.businessName}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {request.businessName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {getApprovalBadge()}
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">
                ${request.fundingAmount.toLocaleString()}
              </span>
              <div className="text-sm text-gray-600">requested</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 mb-4 line-clamp-3">
          {request.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Monthly Revenue</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              ${request.monthlyRevenue.toLocaleString()}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Revenue Share</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {request.revenueShare}%
            </span>
          </div>
        </div>

        {/* Credit Score Section */}
        {/* Credit scoring temporarily disabled for deployment
        {showCreditInfo && request.creditScore && (
          <div className="mb-4">
            <CreditScoreCard
              score={request.creditScore.score}
              riskLevel={request.creditScore.riskLevel}
              revenue={request.monthlyRevenue}
              verified={request.creditScore.revenueVerified}
              compact={true}
            />
          </div>
        )}
        */}

        {/* Use of Funds */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Use of Funds</h4>
          <p className="text-sm text-gray-600">{request.useOfFunds}</p>
        </div>

        {/* Underwriting Details */}
        {showDetails && request.underwriting && request.underwriting.approved && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Funding Terms</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Max Amount:</span>
                <div className="font-semibold">
                  ${request.underwriting.maxFundingAmount.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Interest Rate:</span>
                <div className="font-semibold">
                  {(request.underwriting.interestRate * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Revenue Share:</span>
                <div className="font-semibold">
                  {(request.underwriting.paybackPercentage * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Repayment Cap:</span>
                <div className="font-semibold">{request.repaymentCap}x</div>
              </div>
            </div>
            
            {request.underwriting.conditions && request.underwriting.conditions.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Conditions:</span>
                <ul className="mt-1 text-sm text-gray-700">
                  {request.underwriting.conditions.map((condition, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <span>•</span>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          {onInvest && (
            <button
              onClick={() => onInvest(request)}
              disabled={request.underwriting && !request.underwriting.approved}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {request.underwriting?.approved ? 'Invest Now' : 'Under Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}