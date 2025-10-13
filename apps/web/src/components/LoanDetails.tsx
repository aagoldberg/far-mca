'use client';

import { useLoanData } from '@/hooks/useMicroLoan';
import { useUSDCBalance } from '@/hooks/useUSDC';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useState, useEffect } from 'react';

interface LoanDetailsProps {
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
  businessType?: string;
  location?: string;
  image?: string;
  useOfFunds?: string;
  repaymentSource?: string;
}

export default function LoanDetails({ loanAddress }: LoanDetailsProps) {
  const { loanData, isLoading, perPeriodPrincipal, currentDueDate, isDefaulted } = useLoanData(loanAddress);
  const { address: userAddress } = useAccount();
  const { balance: usdcBalance } = useUSDCBalance(userAddress);
  const [metadata, setMetadata] = useState<LoanMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  // Fetch metadata from IPFS
  useEffect(() => {
    if (loanData?.metadataURI) {
      setLoadingMetadata(true);
      // Convert ipfs:// to HTTP gateway URL
      const metadataUrl = loanData.metadataURI.startsWith('ipfs://')
        ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${loanData.metadataURI.replace('ipfs://', '')}`
        : loanData.metadataURI;

      fetch(metadataUrl)
        .then(res => res.json())
        .then(data => {
          // Also convert image IPFS URI to gateway URL
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

  if (!loanData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Loan not found</p>
        <Link href="/" className="text-[#2E7D32] hover:underline">
          ← Back to loans
        </Link>
      </div>
    );
  }

  const totalFundedNum = parseFloat(formatUnits(loanData.totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(loanData.principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;
  const isFunded = loanData.totalFunded >= loanData.principal;
  const isBorrower = userAddress?.toLowerCase() === loanData.borrower.toLowerCase();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-[#2E7D32] hover:text-[#4CAF50] mb-4">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to loans
      </Link>

      {/* Loan Image */}
      {metadata?.image && (
        <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden mb-6">
          <img
            src={metadata.image}
            alt={metadata?.name || 'Loan'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {metadata?.name || 'Loading...'}
      </h1>

      {/* Borrower */}
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
        <span>
          {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
          {isBorrower && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>}
        </span>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 mb-6">
        {loanData.completed && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Completed
          </span>
        )}
        {loanData.active && !loanData.completed && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Active
          </span>
        )}
        {loanData.fundraisingActive && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Fundraising
          </span>
        )}
        {isDefaulted && (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            Defaulted
          </span>
        )}
      </div>

      {/* Funding Progress Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-3xl font-bold text-gray-900">
              ${formatUSDC(loanData.totalFunded)} USDC
            </span>
            <span className="text-sm text-gray-500">
              of ${formatUSDC(loanData.principal)} USDC
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#2E7D32] h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Zero-interest info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
            <p className="text-lg font-semibold text-green-600">
              0%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Repayment</p>
            <p className="text-lg font-semibold text-gray-900">
              1.0x
            </p>
          </div>
        </div>

        {/* Term info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Term Length</p>
            <p className="text-sm font-medium text-gray-900">
              {loanData.termPeriods.toString()} periods
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Period Length</p>
            <p className="text-sm font-medium text-gray-900">
              {Number(loanData.periodLength) / 86400} days
            </p>
          </div>
        </div>

        {/* Payment info */}
        {perPeriodPrincipal && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Payment Per Period</p>
            <p className="text-xl font-bold text-gray-900">
              ${formatUSDC(perPeriodPrincipal as bigint)} USDC
            </p>
          </div>
        )}

        {/* Important dates */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Fundraising Deadline</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(loanData.fundraisingDeadline)}
            </p>
          </div>
          {loanData.active && currentDueDate && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Next Payment Due</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(currentDueDate as bigint)}
              </p>
            </div>
          )}
        </div>

        {/* Fund button (only if fundraising) */}
        {loanData.fundraisingActive && !isFunded && (
          <Link
            href={`/loan/${loanAddress}/fund`}
            className="mt-6 w-full block text-center bg-[#2E7D32] hover:bg-[#4CAF50] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Fund this Loan
          </Link>
        )}

        {/* Disburse button (borrower only, if funded) */}
        {isBorrower && isFunded && !loanData.disbursed && (
          <button
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Disburse Funds
          </button>
        )}
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {metadata?.description || 'Loading description...'}
        </p>
      </div>

      {/* Use of Funds */}
      {metadata?.useOfFunds && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Use of Funds</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {metadata.useOfFunds}
          </p>
        </div>
      )}

      {/* Repayment Source */}
      {metadata?.repaymentSource && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Repayment Source</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {metadata.repaymentSource}
          </p>
        </div>
      )}

      {/* Business Details */}
      {metadata?.businessType && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Business Details</h2>
          <div className="space-y-3">
            {metadata.businessType && (
              <div>
                <p className="text-xs text-gray-500">Business Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {metadata.businessType}
                </p>
              </div>
            )}
            {metadata.location && (
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {metadata.location}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contributors section */}
      <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Community Support</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Contributors</p>
            <p className="text-2xl font-bold text-gray-900">
              {loanData.contributorsCount.toString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Zero-Interest Model</p>
            <p className="text-sm font-medium text-green-600">
              Community Support, Not Profit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
