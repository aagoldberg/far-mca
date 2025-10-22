'use client';

import React from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';

export interface LoanCardProps {
  address: `0x${string}`;
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

export function LoanCard({
  address,
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
}: LoanCardProps) {
  const totalFundedNum = parseFloat(formatUnits(totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;

  const status = getStatusBadge(fundraisingActive, active, completed);

  // Truncate address for display
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

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
      <div className="relative bg-white rounded-xl">
        {/* Image */}
        {imageUrl && (
          <div className="relative w-full h-48 bg-gray-100">
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

        <div className="p-5">
          {/* Header with status badge */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1 group-hover:text-[#2E7D68] transition-colors duration-200">
              {name || 'Untitled Loan'}
            </h3>
            <span className={`ml-2 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shadow-sm ${status.className}`}>
              {status.text}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem] overflow-hidden leading-relaxed">
            {description || 'No description available'}
          </p>

          {/* Enhanced progress bar with gradient */}
          <div className="mb-4">
            <div className="relative w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200" />
              <div
                className="relative h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] shadow-sm"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-900 bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] bg-clip-text text-transparent">
                ${formatUSDC(totalFunded)} USDC
              </span>
              <span className="text-gray-500 font-medium">
                of ${formatUSDC(principal)} USDC
              </span>
            </div>
          </div>

          {/* Loan info */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span className="font-medium">
              {contributorsCount.toString()} supporter{contributorsCount === 1n ? '' : 's'}
            </span>
            {termPeriods && (
              <span className="font-medium">
                {termPeriods.toString()} period{termPeriods === 1n ? '' : 's'}
              </span>
            )}
            <span className="text-[#3B9B7F] font-semibold group-hover:text-[#2E7D68] transition-colors">
              Learn More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
