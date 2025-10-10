'use client';

import React from 'react';
import Link from 'next/link';

export interface CampaignDetails {
  id: number;
  creator: string;
  title: string;
  description: string;
  goalAmount: bigint;
  deadline: bigint;
  model: number;
  totalRaised: bigint;
  isActive: boolean;
  goalReached: boolean;
  cancelled: boolean;
  imageCID?: string;
  contributorCount: bigint;
  revenueShare?: number;
  repaymentCap?: number;
  creditScore?: {
    score: number;
    riskLevel: string;
  };
}

interface CampaignCardProps {
  campaignDetails: CampaignDetails;
}

const formatUSDValueForDisplay = (amount: bigint | undefined): string => {
  if (amount === undefined) return '0';
  const sixDecimals = BigInt("1000000");
  const units = amount / sixDecimals;
  return units.toLocaleString();
};

const formatNumberShort = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export function CampaignCard({ campaignDetails }: CampaignCardProps) {
  if (!campaignDetails) {
    return <div className="p-4 bg-white rounded-lg shadow-md"><p>Campaign data not available.</p></div>;
  }

  const {
    id,
    creator,
    title,
    description,
    goalAmount,
    totalRaised,
    imageCID,
    revenueShare,
    repaymentCap,
    creditScore,
  } = campaignDetails;

  const totalRaisedNum = parseFloat(formatUSDValueForDisplay(totalRaised).replace(/,/g, ''));
  const goalAmountNum = parseFloat(formatUSDValueForDisplay(goalAmount).replace(/,/g, ''));
  const progressPercentage = goalAmountNum > 0 ? (totalRaisedNum / goalAmountNum) * 100 : 0;

  const creatorDisplayName = creator.length > 12 ? `${creator.substring(0, 6)}...${creator.substring(creator.length - 4)}` : creator;

  return (
    <Link
      href={`/campaign/${id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
        {title || 'Untitled Campaign'}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10 overflow-hidden">
        {description || 'No description available'}
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-[#2E7D32] h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-gray-900">
            ${parseFloat(formatUSDValueForDisplay(totalRaised)).toLocaleString()}
          </span>
          <span className="text-gray-500">
            of ${parseFloat(formatUSDValueForDisplay(goalAmount)).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Credit Score Badge (if available) */}
      {creditScore && (
        <div className="mb-3">
          <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-xs font-medium text-gray-700">Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-sm font-bold ${
                creditScore.score >= 75 ? 'text-green-600' :
                creditScore.score >= 55 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {creditScore.score}
              </span>
              <span className="text-xs text-gray-500">
                {creditScore.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Business info */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span>{revenueShare || 5}% share</span>
        <span>{repaymentCap || 1.5}x cap</span>
        <span className="text-[#2E7D32] font-medium hover:underline">View Details →</span>
      </div>
    </Link>
  );
}
