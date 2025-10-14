'use client';

import { useCampaign } from '@/hooks/useCampaign';
import Link from 'next/link';

interface CampaignDetailsProps {
  campaignNumericId: string;
}

const formatUSDValue = (amount: string | undefined): string => {
  if (!amount) return '0';
  const value = parseInt(amount) / 1000000; // 6 decimals for USDC
  return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export default function CampaignDetails({ campaignNumericId }: CampaignDetailsProps) {
  const { campaign, loading, error } = useCampaign(campaignNumericId);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-3xl mb-6" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error || 'Campaign not found'}</p>
        <Link href="/" className="text-[#3B9B7F] hover:underline">
          ← Back to campaigns
        </Link>
      </div>
    );
  }

  const totalRaisedNum = parseFloat(formatUSDValue(campaign.totalRaised));
  const goalAmountNum = parseFloat(formatUSDValue(campaign.goalAmount));
  const progressPercentage = goalAmountNum > 0 ? (totalRaisedNum / goalAmountNum) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-4">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to campaigns
      </Link>

      {/* Campaign Image */}
      {campaign.metadata?.image && (
        <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden mb-6">
          <img
            src={campaign.metadata.image.startsWith('ipfs://')
              ? `https://gateway.pinata.cloud/ipfs/${campaign.metadata.image.replace('ipfs://', '')}`
              : campaign.metadata.image
            }
            alt={campaign.metadata?.title || 'Campaign'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {campaign.metadata?.title || 'Untitled Campaign'}
      </h1>

      {/* Creator */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
        <span>
          {campaign.creator.length > 12
            ? `${campaign.creator.substring(0, 6)}...${campaign.creator.substring(campaign.creator.length - 4)}`
            : campaign.creator}
        </span>
      </div>

      {/* Funding Progress Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-3xl font-bold text-gray-900">
              ${formatUSDValue(campaign.totalRaised)}
            </span>
            <span className="text-sm text-gray-500">
              of ${formatUSDValue(campaign.goalAmount)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#3B9B7F] h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Revenue share & Cap info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Revenue Share</p>
            <p className="text-lg font-semibold text-gray-900">
              {campaign.metadata?.revenueShare || 5}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Repayment Cap</p>
            <p className="text-lg font-semibold text-gray-900">
              {campaign.metadata?.repaymentCap || 1.5}x
            </p>
          </div>
        </div>

        {/* Credit Score */}
        {campaign.metadata?.creditScore && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">Credit Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${
                  campaign.metadata.creditScore.score >= 75 ? 'text-green-600' :
                  campaign.metadata.creditScore.score >= 55 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {campaign.metadata.creditScore.score}
                </span>
                <span className="text-xs text-gray-500">
                  {campaign.metadata.creditScore.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Fund button */}
        <Link
          href={`/campaign/${campaignNumericId}/fund`}
          className="mt-6 w-full block text-center bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
        >
          Fund this Campaign
        </Link>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {campaign.metadata?.description || 'No description available.'}
        </p>
      </div>

      {/* Business Details (if available) */}
      {campaign.metadata?.businessDetails && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Business Details</h2>
          <div className="space-y-3">
            {campaign.metadata.businessDetails.industry && (
              <div>
                <p className="text-xs text-gray-500">Industry</p>
                <p className="text-sm font-medium text-gray-900">
                  {campaign.metadata.businessDetails.industry}
                </p>
              </div>
            )}
            {campaign.metadata.businessDetails.monthlyRevenue && (
              <div>
                <p className="text-xs text-gray-500">Monthly Revenue</p>
                <p className="text-sm font-medium text-gray-900">
                  ${campaign.metadata.businessDetails.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            )}
            {campaign.metadata.businessDetails.yearsInBusiness && (
              <div>
                <p className="text-xs text-gray-500">Years in Business</p>
                <p className="text-sm font-medium text-gray-900">
                  {campaign.metadata.businessDetails.yearsInBusiness}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
