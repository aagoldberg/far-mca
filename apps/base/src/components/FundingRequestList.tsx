'use client';

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useCampaigns, ProcessedCampaign } from '@/hooks/useCampaign';
import { formatUnits } from 'viem';

const USDC_DECIMALS = 6;

// Define the GraphQL query to fetch funding requests with enhanced data
const GET_FUNDING_REQUESTS = gql`
  query GetFundingRequests {
    campaigns(orderBy: createdAt, orderDirection: desc) {
      id
      campaignId
      creator
      metadataURI
      goalAmount
      totalRaised
      totalDirectTransfers
      actualBalance
      contributions(orderBy: timestamp, orderDirection: desc, first: 5) {
        id
        contributor
        amount
        timestamp
      }
      directTransfers(orderBy: timestamp, orderDirection: desc, first: 5) {
        id
        from
        amount
        timestamp
      }
    }
  }
`;

const FundingRequestList = () => {
  const { loading, error, data } = useQuery(GET_FUNDING_REQUESTS, {
    fetchPolicy: 'network-only',
  });
  
  const { campaigns: processedRequests, loading: processingLoading, error: processingError } = useCampaigns(data?.campaigns);

  if (loading || processingLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
        {[...Array(6)].map((_, i) => <FundingRequestCardSkeleton key={i} />)}
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">Error loading funding requests: {error.message}</p>;
  if (processingError) return <p className="text-center text-red-500">Error processing funding requests: {processingError}</p>;
  if (!processedRequests || processedRequests.length === 0) return <p className="text-center">No funding requests found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
      {processedRequests.map((request: ProcessedCampaign) => (
        <FundingRequestCard key={request.campaignNumericId} request={request} />
      ))}
    </div>
  );
};

// Funding Request Card Component
const FundingRequestCard = ({ request }: { request: ProcessedCampaign }) => {
  const formattedTotal = formatUnits(BigInt(request.totalRaised || '0'), USDC_DECIMALS);
  const formattedGoal = formatUnits(BigInt(request.goalAmount || '0'), USDC_DECIMALS);
  const progressPercentage = request.goalAmount && Number(request.goalAmount) > 0 
    ? (Number(request.totalRaised || '0') / Number(request.goalAmount)) * 100 
    : 0;

  return (
    <Link 
      href={`/advance/${request.campaignNumericId}`}
      className="block bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 p-0"
    >
      {/* Image */}
      {request.metadata?.image && (
        <div className="relative h-48 w-full">
          <img 
            src={request.metadata.image.startsWith('ipfs://') 
              ? `https://gateway.pinata.cloud/ipfs/${request.metadata.image.replace('ipfs://', '')}`
              : request.metadata.image
            } 
            alt={request.metadata?.title || 'Business'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {request.metadata?.title || 'Untitled Business'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {request.metadata?.description || 'No description available'}
        </p>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-[#3B9B7F] h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">
              ${parseFloat(formattedTotal).toLocaleString()} funded
            </span>
            <span className="text-sm text-gray-500">
              of ${parseFloat(formattedGoal).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Credit Score Badge (if available) */}
        {request.metadata?.creditScore && (
          <div className="mb-3">
            <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-gray-700">Credit Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-bold ${
                  request.metadata.creditScore.score >= 75 ? 'text-green-600' :
                  request.metadata.creditScore.score >= 55 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {request.metadata.creditScore.score}
                </span>
                <span className="text-xs text-gray-500">
                  {request.metadata.creditScore.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Business info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Revenue share: {request.metadata?.revenueShare || 5}%</span>
          <span>Cap: {request.metadata?.repaymentCap || 1.5}x</span>
        </div>
      </div>
    </Link>
  );
};

// Skeleton loading component
const FundingRequestCardSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5">
      <div className="h-6 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
      <div className="h-2 bg-gray-200 rounded-full mb-2" />
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

export default FundingRequestList;