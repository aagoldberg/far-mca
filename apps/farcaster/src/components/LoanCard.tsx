'use client';

import React from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';

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
}: LoanCardProps) {
  const totalFundedNum = parseFloat(formatUnits(totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;

  const status = getStatusBadge(fundraisingActive, active, completed);

  // Fetch Farcaster profile - gracefully falls back to wallet address if no profile exists
  const { profile, reputation, hasProfile } = useFarcasterProfile(borrower);

  const shortAddress = `${borrower.slice(0, 6)}...${borrower.slice(-4)}`;

  const daysRemaining = getDaysRemaining(fundraisingDeadline);

  return (
    <Link
      href={`/loan/${address}`}
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Header with borrower info on left and days remaining on right */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasProfile && profile ? (
              <>
                <img
                  src={profile.pfpUrl}
                  alt={profile.displayName}
                  className="w-7 h-7 rounded-full bg-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xs font-semibold text-gray-900">
                  {profile.displayName || `@${profile.username}`}
                </span>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-gray-300" />
                <span className="text-xs font-semibold text-gray-900">{shortAddress}</span>
              </>
            )}
          </div>

          {daysRemaining && fundraisingActive && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{daysRemaining}</span>
            </div>
          )}
        </div>
      </div>

      {imageUrl && (
        <div className="w-full h-48 bg-gray-100">
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

      <div className="p-4">
        {/* Title and status badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1">
            {name || 'Untitled Loan'}
          </h3>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.className}`}>
            {status.text}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10 overflow-hidden">
          {description || 'No description available'}
        </p>

        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-[#3B9B7F] h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-900">
              ${formatUSDC(totalFunded)} USDC
            </span>
            <span className="text-gray-500">
              of ${formatUSDC(principal)} USDC
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            {contributorsCount.toString()} supporter{contributorsCount === 1n ? '' : 's'}
          </span>
          {termPeriods && (
            <span>
              {termPeriods.toString()} period{termPeriods === 1n ? '' : 's'}
            </span>
          )}
          <span className="text-[#3B9B7F] font-medium hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
