'use client';

import React from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';

export interface LoanCardProps {
  address: `0x${string}`;
  borrower?: `0x${string}`;
  name: string;
  description: string;
  principal: bigint;
  totalFunded: bigint;
  fundraisingActive: boolean;
  active: boolean;
  completed: boolean;
  contributorsCount: bigint;
  termPeriods?: bigint;
  imageUrl?: string;
  imageAspectRatio?: number; // undefined means free aspect ratio
  fundraisingDeadline?: bigint;
  disbursementTime?: bigint;
  totalRepaid?: bigint;
  businessWebsite?: string;
}

const formatUSDC = (amount: bigint): string => {
  const formatted = formatUnits(amount, USDC_DECIMALS);
  return parseFloat(formatted).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const getStatusInfo = (
  fundraisingActive: boolean,
  active: boolean,
  completed: boolean,
  totalFunded: bigint,
  principal: bigint,
  fundraisingDeadline?: bigint
): { text: string; className: string; showDays: boolean } => {
  // Completed loan
  if (completed) {
    return {
      text: 'Completed',
      className: 'bg-green-100 text-green-800',
      showDays: false,
    };
  }

  // Active loan (being repaid)
  if (active) {
    return {
      text: 'Active',
      className: 'bg-blue-100 text-blue-800',
      showDays: false,
    };
  }

  // Check if fully funded
  if (totalFunded >= principal && principal > 0n) {
    return {
      text: 'Funded',
      className: 'bg-green-100 text-green-800',
      showDays: false,
    };
  }

  // Still fundraising
  if (fundraisingActive) {
    return {
      text: 'Fundraising',
      className: 'bg-yellow-100 text-yellow-800',
      showDays: true, // Show days remaining for fundraising
    };
  }

  // Inactive/cancelled
  return {
    text: 'Inactive',
    className: 'bg-gray-100 text-gray-800',
    showDays: false,
  };
};

const getDaysRemaining = (fundraisingDeadline?: bigint): string | null => {
  if (!fundraisingDeadline) return null;

  const now = Math.floor(Date.now() / 1000);
  const deadline = Number(fundraisingDeadline);
  const secondsRemaining = deadline - now;

  if (secondsRemaining <= 0) return null;

  const daysRemaining = Math.ceil(secondsRemaining / 86400);

  if (daysRemaining === 1) return '1 day';
  return `${daysRemaining} days`;
};

export function LoanCard({
  address,
  borrower,
  name,
  description,
  principal,
  totalFunded,
  fundraisingActive,
  active,
  completed,
  contributorsCount,
  termPeriods,
  imageUrl,
  imageAspectRatio,
  fundraisingDeadline,
  disbursementTime,
  totalRepaid,
  businessWebsite,
}: LoanCardProps) {
  const totalFundedNum = parseFloat(formatUnits(totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;

  const statusInfo = getStatusInfo(fundraisingActive, active, completed, totalFunded, principal, fundraisingDeadline);

  // Fetch Farcaster profile - gracefully falls back to wallet address if no profile exists
  const { profile, hasProfile } = useFarcasterProfile(borrower);

  const shortAddress = borrower ? `${borrower.slice(0, 6)}...${borrower.slice(-4)}` : '';

  const daysRemaining = getDaysRemaining(fundraisingDeadline);

  return (
    <Link
      href={`/loan/${address}`}
      className="group block relative bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B9B7F]/20 via-transparent to-[#2E7D68]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      {/* Card border */}
      <div className="absolute inset-0 border border-gray-300 group-hover:border-[#3B9B7F]/40 transition-colors duration-300 rounded-xl" />

      {/* Card content */}
      <div className="relative bg-white rounded-xl transition-shadow duration-300">
        {/* Header with borrower info - only show if has Farcaster profile */}
        {hasProfile && profile && (
          <div className="px-4 sm:px-5 pt-3 pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                  {profile.pfpUrl ? (
                    <img
                      src={profile.pfpUrl}
                      alt={profile.displayName}
                      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex-shrink-0 ring-2 ring-gray-100 group-hover:ring-[#3B9B7F]/30 transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex-shrink-0 ring-2 ring-gray-100 group-hover:ring-[#3B9B7F]/30 transition-all duration-300" />
                  )}
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {profile.displayName || `@${profile.username}`}
                </span>
                {businessWebsite && (
                  <a
                    href={businessWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                  >
                    <svg className="w-4 h-4 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Show days remaining if fundraising, otherwise show status badge */}
              {statusInfo.showDays && daysRemaining ? (
                <div className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-600 flex-shrink-0 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{daysRemaining}</span>
                </div>
              ) : (
                <span className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shadow-sm ${statusInfo.className}`}>
                  {statusInfo.text}
                </span>
              )}
            </div>
          </div>
        )}

      {imageUrl && (
        <div className="w-full bg-gray-100 relative" style={{ paddingBottom: '66%' }}>
          <img
            src={imageUrl}
            alt={name || 'Loan image'}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Status badge overlay when no profile */}
          {!hasProfile && !profile && (
            <div className="absolute top-3 right-3">
              {statusInfo.showDays && daysRemaining ? (
                <div className="flex items-center gap-1.5 text-xs text-gray-900 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-md">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">{daysRemaining}</span>
                </div>
              ) : (
                <span className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-md ${statusInfo.className}`}>
                  {statusInfo.text}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Title */}
        <h3 className="text-[15px] font-medium text-gray-900 line-clamp-2 mb-3 group-hover:text-[#2E7D68] transition-colors duration-200">
          {name || 'Untitled Loan'}
        </h3>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3B9B7F]"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Funding info */}
        <div className="flex items-baseline gap-1 text-[14px]">
          <span className="font-semibold text-gray-900">${formatUSDC(totalFunded)}</span>
          <span className="text-gray-500">raised of ${formatUSDC(principal)}</span>
        </div>
      </div>
      </div>
    </Link>
  );
}
