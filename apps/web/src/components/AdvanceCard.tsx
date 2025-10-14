'use client';

import { useLoanData, useDisburse, useRepay, useCancelFundraise } from '@/hooks/useMicroLoan';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface AdvanceCardProps {
  loanAddress: `0x${string}`;
}

const formatUSDC = (amount: bigint): string => {
  const value = parseFloat(formatUnits(amount, USDC_DECIMALS));
  return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const formatDate = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

interface LoanMetadata {
  name?: string;
  description?: string;
  image?: string;
}

export default function AdvanceCard({ loanAddress }: AdvanceCardProps) {
  const { loanData, isLoading, perPeriodPrincipal, currentDueDate, isDefaulted } = useLoanData(loanAddress);
  const [metadata, setMetadata] = useState<LoanMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  const { disburse, isPending: isDisbursing } = useDisburse();
  const { repay, isPending: isRepaying } = useRepay();
  const { cancelFundraise, isPending: isCancelling } = useCancelFundraise();

  // Fetch metadata
  useEffect(() => {
    if (loanData?.metadataURI) {
      setLoadingMetadata(true);
      const metadataUrl = loanData.metadataURI.startsWith('ipfs://')
        ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${loanData.metadataURI.replace('ipfs://', '')}`
        : loanData.metadataURI;

      fetch(metadataUrl)
        .then(res => res.json())
        .then(data => {
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${data.image.replace('ipfs://', '')}`;
          }
          setMetadata(data);
        })
        .catch(err => console.error('Error loading metadata:', err))
        .finally(() => setLoadingMetadata(false));
    }
  }, [loanData?.metadataURI]);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (!loanData) return null;

  const totalFundedNum = parseFloat(formatUnits(loanData.totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(loanData.principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;
  const isFunded = loanData.totalFunded >= loanData.principal;
  const canDisburse = isFunded && !loanData.disbursed && !loanData.active;
  const canCancelFundraise = loanData.fundraisingActive && !isFunded;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
          {/* Loan Image */}
          {metadata?.image && (
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={metadata.image}
                alt={metadata.name || 'Loan'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Status */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {metadata?.name || 'Loading...'}
              </h3>
              <div className="flex gap-2 ml-4">
                {loanData.completed && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
                    Completed
                  </span>
                )}
                {loanData.active && !loanData.completed && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                    Active
                  </span>
                )}
                {loanData.fundraisingActive && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium whitespace-nowrap">
                    Fundraising
                  </span>
                )}
                {isDefaulted && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium whitespace-nowrap">
                    Defaulted
                  </span>
                )}
              </div>
            </div>

            {/* Funding Progress */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  ${formatUSDC(loanData.totalFunded)} / ${formatUSDC(loanData.principal)} USDC
                </span>
                <span className="text-gray-600 font-medium">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#2E7D32] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Term</p>
                <p className="font-medium text-gray-900">
                  {loanData.termPeriods.toString()} periods
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contributors</p>
                <p className="font-medium text-gray-900">
                  {loanData.contributorsCount.toString()}
                </p>
              </div>
              {loanData.active && currentDueDate && (
                <div>
                  <p className="text-xs text-gray-500">Next Payment</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(currentDueDate as bigint)}
                  </p>
                </div>
              )}
              {loanData.fundraisingActive && (
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(loanData.fundraisingDeadline)}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {canDisburse && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    disburse(loanAddress);
                  }}
                  disabled={isDisbursing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-gray-300"
                >
                  {isDisbursing ? 'Disbursing...' : 'Disburse Funds'}
                </button>
              )}

              {loanData.active && perPeriodPrincipal && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    repay(loanAddress);
                  }}
                  disabled={isRepaying}
                  className="px-4 py-2 bg-[#2E7D32] hover:bg-[#4CAF50] text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-gray-300"
                >
                  {isRepaying ? 'Processing...' : `Pay ${formatUSDC(perPeriodPrincipal as bigint)} USDC`}
                </button>
              )}

              {canCancelFundraise && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to cancel fundraising? All contributions will be refunded.')) {
                      cancelFundraise(loanAddress);
                    }
                  }}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-gray-300"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Fundraise'}
                </button>
              )}

              <Link
                href={`/loan/${loanAddress}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
