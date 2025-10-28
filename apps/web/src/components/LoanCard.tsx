'use client';

import React from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useContributors } from '@/hooks/useMicroLoan';

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

// Component for individual contributor avatar
function ContributorAvatar({ address: contributorAddress, index, total }: { address: `0x${string}`; index: number; total: number }) {
  const { profile } = useFarcasterProfile(contributorAddress);

  return (
    <div
      className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:scale-110 transition-all duration-200"
      style={{ zIndex: total - index }}
    >
      {profile?.pfpUrl ? (
        <img
          src={profile.pfpUrl}
          alt={profile.displayName || 'Contributor'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] text-white text-[10px] sm:text-xs font-bold">
          {contributorAddress.slice(2, 4).toUpperCase()}
        </div>
      )}
    </div>
  );
}

// Component for contributor name in text
function ContributorName({ address: contributorAddress }: { address: `0x${string}` }) {
  const { profile } = useFarcasterProfile(contributorAddress);

  return (
    <span className="font-medium text-gray-900">
      {profile?.username ? `@${profile.username}` : `${contributorAddress.slice(0, 6)}...${contributorAddress.slice(-4)}`}
    </span>
  );
}

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

  // Fetch first 3 contributors for display
  const { contributors, totalCount, hasMore } = useContributors(address, 3);

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
                  <img
                    src={profile.pfpUrl}
                    alt={profile.displayName}
                    className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex-shrink-0 ring-2 ring-gray-100 group-hover:ring-[#3B9B7F]/30 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
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
        <div className="w-full bg-gray-100 relative" style={{ paddingBottom: '75%' }}>
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

      <div className="p-4 sm:p-5">
        {/* Title */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-3 flex-1 min-w-0 group-hover:text-[#2E7D68] transition-colors duration-200">
            {name || 'Untitled Loan'}
          </h3>
        </div>

        <div className="mb-3">
          {/* Enhanced progress bar with gradient */}
          <div className="relative w-full bg-gray-100 rounded-full h-2.5 sm:h-3 mb-2.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200" />
            <div
              className="relative h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] shadow-sm"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="font-bold text-gray-900 bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] bg-clip-text text-transparent">
              ${formatUSDC(totalFunded)} USDC
            </span>
            <span className="text-gray-500 font-medium">
              of ${formatUSDC(principal)} USDC
            </span>
          </div>
        </div>

        {/* Contributor avatars footer */}
        {totalCount > 0 ? (
          <div className="pt-3 mt-3 border-t border-gray-100/80">
            <div className="flex items-center gap-3">
              {/* Avatar stack */}
              <div className="flex -space-x-3 flex-shrink-0">
                {contributors.map((contributorAddress, index) => (
                  <ContributorAvatar
                    key={contributorAddress}
                    address={contributorAddress}
                    index={index}
                    total={contributors.length}
                  />
                ))}
              </div>

              {/* Text description */}
              <div className="flex-1 text-xs sm:text-sm text-gray-600 truncate">
                <span className="text-gray-500">Supported by </span>
                {contributors.slice(0, 2).map((addr, idx) => (
                  <span key={addr}>
                    <ContributorName address={addr} />
                    {idx === 0 && contributors.length > 1 && ', '}
                  </span>
                ))}
                {hasMore && (
                  <span className="text-gray-500">
                    {' '}and {totalCount - contributors.length} other{totalCount - contributors.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-3 mt-3 border-t border-gray-100/80 text-xs sm:text-sm text-gray-400 italic flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Be the first supporter</span>
          </div>
        )}
      </div>
      </div>
    </Link>
  );
}
