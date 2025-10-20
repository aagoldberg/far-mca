'use client';

import React from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useContributors } from '@/hooks/useMicroLoan';
import { calculateLoanStatus } from '@/utils/loanStatus';
import { PaymentWarningBadgeCompact } from '@/components/PaymentWarningBadge';

export interface LoanCardProps {
  address: `0x${string}`;
  borrower: `0x${string}`;
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
  fundraisingDeadline?: bigint;
  disbursementTime?: bigint;
  totalRepaid?: bigint;
}

const formatUSDC = (amount: bigint): string => {
  const formatted = formatUnits(amount, USDC_DECIMALS);
  return parseFloat(formatted).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const getStatusBadge = (
  fundraisingActive: boolean,
  active: boolean,
  completed: boolean
) => {
  if (completed) {
    return {
      text: 'Completed',
      className: 'bg-green-100 text-green-800',
    };
  }
  if (active) {
    return {
      text: 'Active',
      className: 'bg-blue-100 text-blue-800',
    };
  }
  if (fundraisingActive) {
    return {
      text: 'Fundraising',
      className: 'bg-yellow-100 text-yellow-800',
    };
  }
  return {
    text: 'Inactive',
    className: 'bg-gray-100 text-gray-800',
  };
};

const getDaysRemaining = (fundraisingDeadline?: bigint): string | null => {
  if (!fundraisingDeadline) return null;

  const now = Math.floor(Date.now() / 1000);
  const deadline = Number(fundraisingDeadline);
  const secondsRemaining = deadline - now;

  if (secondsRemaining <= 0) return null;

  const daysRemaining = Math.ceil(secondsRemaining / 86400);

  if (daysRemaining === 1) return '1 day remaining';
  return `${daysRemaining} days remaining`;
};

// Component for individual contributor avatar
function ContributorAvatar({ address, index, total }: { address: `0x${string}`; index: number; total: number }) {
  const { profile } = useFarcasterProfile(address);

  return (
    <div
      className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
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
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] text-white text-[9px] sm:text-[10px] font-bold">
          {address.slice(2, 4).toUpperCase()}
        </div>
      )}
    </div>
  );
}

// Component for contributor name in text
function ContributorName({ address }: { address: `0x${string}` }) {
  const { profile } = useFarcasterProfile(address);

  return (
    <span className="font-medium text-gray-900">
      {profile?.username ? `@${profile.username}` : `${address.slice(0, 6)}...${address.slice(-4)}`}
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
  fundraisingDeadline,
  disbursementTime,
  totalRepaid,
}: LoanCardProps) {
  const totalFundedNum = parseFloat(formatUnits(totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;

  const status = getStatusBadge(fundraisingActive, active, completed);

  // Fetch Farcaster profile - gracefully falls back to wallet address if no profile exists
  const { profile, reputation, hasProfile } = useFarcasterProfile(borrower);

  // Fetch first 3 contributors for display
  const { contributors, totalCount, hasMore } = useContributors(address, 3);

  const shortAddress = `${borrower.slice(0, 6)}...${borrower.slice(-4)}`;

  const daysRemaining = getDaysRemaining(fundraisingDeadline);

  // Calculate payment status if loan is active
  const loanStatusInfo =
    active && disbursementTime && termPeriods && totalRepaid !== undefined
      ? calculateLoanStatus(
          disbursementTime,
          Number(termPeriods),
          principal,
          totalRepaid
        )
      : null;

  return (
    <Link
      href={`/loan/${address}`}
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Header with borrower info on left and days remaining on right */}
      <div className="px-3 sm:px-4 pt-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasProfile && profile ? (
              <>
                <img
                  src={profile.pfpUrl}
                  alt={profile.displayName}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xs font-semibold text-gray-900 truncate">
                  {profile.displayName || `@${profile.username}`}
                </span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-900 truncate">{shortAddress}</span>
              </>
            )}
          </div>

          {daysRemaining && fundraisingActive && (
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-500 flex-shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">{daysRemaining}</span>
              <span className="sm:hidden">{daysRemaining.replace(' remaining', '')}</span>
            </div>
          )}
        </div>
      </div>

      {imageUrl && (
        <div className="w-full h-40 sm:h-48 bg-gray-100">
          <img
            src={imageUrl}
            alt={name || 'Loan image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-3 sm:p-4">
        {/* Title and badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1 flex-1 min-w-0">
            {name || 'Untitled Loan'}
          </h3>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Payment warning badge (if applicable) */}
            {loanStatusInfo && (
              <PaymentWarningBadgeCompact statusInfo={loanStatusInfo} />
            )}
            {/* Status badge */}
            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${status.className}`}>
              {status.text}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.5rem] overflow-hidden">
          {description || 'No description available'}
        </p>

        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-2">
            <div
              className="bg-[#3B9B7F] h-1.5 sm:h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] sm:text-xs">
            <span className="font-semibold text-gray-900">
              ${formatUSDC(totalFunded)} USDC
            </span>
            <span className="text-gray-500">
              of ${formatUSDC(principal)} USDC
            </span>
          </div>
        </div>

        {/* Contributor avatars footer */}
        {totalCount > 0 ? (
          <div className="pt-2.5 sm:pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {/* Avatar stack */}
              <div className="flex -space-x-2 flex-shrink-0">
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
              <div className="flex-1 text-[11px] sm:text-xs text-gray-600 truncate">
                <span>Supported by </span>
                {contributors.slice(0, 2).map((addr, idx) => (
                  <span key={addr}>
                    <ContributorName address={addr} />
                    {idx === 0 && contributors.length > 1 && ', '}
                  </span>
                ))}
                {hasMore && (
                  <span>
                    {' '}and {totalCount - contributors.length} other{totalCount - contributors.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-2.5 sm:pt-3 border-t border-gray-100 text-[11px] sm:text-xs text-gray-500">
            No supporters yet
          </div>
        )}
      </div>
    </Link>
  );
}
