"use client";

import { useCampaign } from '@/hooks/useCampaign';
import { formatUnits } from 'viem';
import { RevenueShareDashboard } from './RevenueShareDashboard';
import { useAccount } from 'wagmi';

const USDC_DECIMALS = 6;

function AdvanceDetails({ advanceId }: { advanceId: string }) {
  const { campaign, loading, error } = useCampaign(advanceId);
  const { address } = useAccount();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800 font-medium">Error loading advance details</p>
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-800 font-medium">Advance not found</p>
        <p className="text-sm text-gray-600 mt-1">This advance may not exist or has been removed.</p>
      </div>
    );
  }

  const fundedAmount = formatUnits(BigInt(campaign.totalRaised || '0'), USDC_DECIMALS);
  const goalAmount = formatUnits(BigInt(campaign.goalAmount || '0'), USDC_DECIMALS);
  const progressPercentage = Number(goalAmount) > 0 
    ? (Number(fundedAmount) / Number(goalAmount)) * 100 
    : 0;

  const isBusinessOwner = address && campaign.creator && 
    address.toLowerCase() === campaign.creator.toLowerCase();

  return (
    <div className="space-y-6">
      {/* Main Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {campaign.metadata?.image && (
          <div className="relative h-96 w-full">
            <img 
              src={campaign.metadata.image}
              alt={campaign.metadata?.title || 'Business'}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {campaign.metadata?.title || 'Untitled Business'}
          </h1>
          
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">
            {campaign.metadata?.description || 'No description available'}
          </p>
          
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-gray-900">
                ${Number(fundedAmount).toLocaleString()}
              </span>
              <span className="text-lg text-gray-500">
                of ${Number(goalAmount).toLocaleString()} goal
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {progressPercentage.toFixed(1)}% funded
            </p>
          </div>

          {/* Business Owner Only Section */}
          {isBusinessOwner && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Business Owner Dashboard</h3>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Owner
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Share Dashboard for Business Owner */}
      {isBusinessOwner && (
        <RevenueShareDashboard 
          campaignId={advanceId}
          businessOwner={campaign.creator}
          currentUserAddress={address}
        />
      )}
    </div>
  );
}

export default AdvanceDetails;