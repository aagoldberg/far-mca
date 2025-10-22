'use client';

import React from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';

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
  disbursementTime,
  totalRepaid,
  businessWebsite,
}: LoanCardProps) {
  const totalFundedNum = parseFloat(formatUnits(totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;

  const statusInfo = getStatusInfo(fundraisingActive, active, completed, totalFunded, principal, fundraisingDeadline);

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
        {/* Header with borrower info on left and status on right */}
        <div className="px-3 sm:px-4 pt-3 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0 ring-2 ring-gray-100" />
              <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{shortAddress || 'Anonymous'}</span>
              {businessWebsite && (
                <a
                  href={businessWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                  <svg className="w-3.5 h-3.5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </a>
              )}
            </div>

            {/* Show days remaining if fundraising, otherwise show status badge */}
            {statusInfo.showDays && daysRemaining ? (
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-600 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-lg">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline font-medium">{daysRemaining}</span>
                <span className="sm:hidden font-medium">{daysRemaining.replace(' remaining', '')}</span>
              </div>
            ) : (
              <span className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap shadow-sm ${statusInfo.className}`}>
                {statusInfo.text}
              </span>
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
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-3 sm:p-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1 flex-1 min-w-0 group-hover:text-[#2E7D68] transition-colors duration-200">
            {name || 'Untitled Loan'}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.5rem] overflow-hidden leading-relaxed">
          {description || 'No description available'}
        </p>

        <div className="mb-3">
          {/* Enhanced progress bar with gradient */}
          <div className="relative w-full bg-gray-100 rounded-full h-2 sm:h-2.5 mb-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200" />
            <div
              className="relative h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] shadow-sm"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] sm:text-xs">
            <span className="font-bold text-gray-900 bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] bg-clip-text text-transparent">
              ${formatUSDC(totalFunded)} USDC
            </span>
            <span className="text-gray-500 font-medium">
              of ${formatUSDC(principal)} USDC
            </span>
          </div>
        </div>

        {/* Footer with contributor count */}
        {contributorsCount > 0n ? (
          <div className="pt-3 sm:pt-3.5 mt-3 border-t border-gray-100/80">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>
                  {contributorsCount.toString()} supporter{contributorsCount === 1n ? '' : 's'}
                </span>
              </div>
              {termPeriods && (
                <span className="text-gray-500 font-medium">
                  {termPeriods.toString()} period{termPeriods === 1n ? '' : 's'}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-3 sm:pt-3.5 mt-3 border-t border-gray-100/80 text-[11px] sm:text-xs text-gray-400 italic flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
