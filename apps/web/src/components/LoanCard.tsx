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
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      {imageUrl && (
        <div className="relative w-full h-48 bg-gray-100">
          <img
            src={imageUrl}
            alt={name || 'Loan image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image on error
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-4">
        {/* Header with status badge */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1">
            {name || 'Untitled Loan'}
          </h3>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.className}`}>
            {status.text}
          </span>
        </div>

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
            ${formatUSDC(totalFunded)} USDC
          </span>
          <span className="text-gray-500">
            of ${formatUSDC(principal)} USDC
          </span>
        </div>
      </div>

      {/* Loan info */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span>
          {contributorsCount.toString()} funder{contributorsCount === 1n ? '' : 's'}
        </span>
        {termPeriods && (
          <span>
            {termPeriods.toString()} period{termPeriods === 1n ? '' : 's'}
          </span>
        )}
        <span className="text-[#2E7D32] font-medium hover:underline">
          View Details →
        </span>
      </div>
      </div>
    </Link>
  );
}
