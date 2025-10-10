'use client';

import { useState } from 'react';
import { 
  TrophyIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface CreditScore {
  score: number;
  revenueInCents: number;
  revenueInDollars: number;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  shop: string;
  verifiable: boolean;
  verification?: {
    contract: string;
    network: string;
    chainId: number;
    blockchainVerified: boolean;
  };
}

interface CreditScoreDisplayProps {
  creditScore: CreditScore | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  showRefresh?: boolean;
}

export default function CreditScoreDisplay({
  creditScore,
  isLoading = false,
  onRefresh,
  showRefresh = false
}: CreditScoreDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Calculating Credit Score</p>
          <p className="text-sm text-gray-500 mt-1">
            Fetching revenue data via Chainlink Functions...
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This may take 2-5 minutes
          </p>
        </div>
      </div>
    );
  }

  if (!creditScore) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="text-center">
          <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Credit Score Not Available
          </h3>
          <p className="text-gray-600">
            Connect your Shopify store to get a verified credit score.
          </p>
        </div>
      </div>
    );
  }

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
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrophyIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Credit Score
            </h3>
          </div>
          {showRefresh && onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-white px-6 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Score Section */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Credit Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(creditScore.score)}`}>
                  {creditScore.score}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getScoreBgColor(creditScore.score)}`}
                  style={{ width: `${creditScore.score}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Risk Level</span>
                <div className="flex items-center space-x-2">
                  {getRiskIcon(creditScore.riskLevel)}
                  <span className={`font-semibold capitalize ${
                    creditScore.riskLevel === 'low' ? 'text-green-600' :
                    creditScore.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {creditScore.riskLevel}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">30-Day Revenue</span>
                <span className="font-semibold">
                  ${creditScore.revenueInDollars.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-500">
                  {formatDate(creditScore.timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Blockchain Verification</h4>
            
            {creditScore.verifiable && creditScore.verification ? (
              <div className="space-y-3">
                <div className="flex items-center text-green-600">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">Verified on Blockchain</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Network:</span> {creditScore.verification.network}
                  </div>
                  <div>
                    <span className="font-medium">Contract:</span>
                    <span className="ml-1 font-mono text-xs">
                      {creditScore.verification.contract.substring(0, 10)}...{creditScore.verification.contract.substring(-8)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Data Source:</span> Shopify API via Chainlink Functions
                  </div>
                </div>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showDetails ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            ) : (
              <div className="text-amber-600">
                <ExclamationTriangleIcon className="h-5 w-5 inline mr-2" />
                <span className="text-sm">Verification pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && creditScore.verification && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-medium text-gray-900 mb-3">Technical Details</h5>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-600">Chain ID</dt>
                  <dd className="text-gray-900">{creditScore.verification.chainId}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Store</dt>
                  <dd className="text-gray-900">{creditScore.shop}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Revenue (Cents)</dt>
                  <dd className="text-gray-900">{creditScore.revenueInCents.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Blockchain Verified</dt>
                  <dd className="text-gray-900">
                    {creditScore.verification.blockchainVerified ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-600">Contract Address</dt>
                  <dd className="text-gray-900 font-mono text-xs break-all">
                    {creditScore.verification.contract}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}