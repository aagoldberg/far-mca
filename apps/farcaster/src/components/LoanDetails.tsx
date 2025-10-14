'use client';

import { useLoanData } from '@/hooks/useMicroLoan';
import { useUSDCBalance } from '@/hooks/useUSDC';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
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
  imageUrl?: string;
  useOfFunds?: string;
  repaymentSource?: string;
}

export default function LoanDetails({ loanAddress }: LoanDetailsProps) {
  const { loanData, isLoading, perPeriodPrincipal, currentDueDate, isDefaulted } = useLoanData(loanAddress);
  const { address: userAddress } = useAccount();
  const { balance: usdcBalance } = useUSDCBalance(userAddress);
  const [metadata, setMetadata] = useState<LoanMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  // Temporarily disable Neynar profile fetching until API key is configured
  // const { profile, reputation, hasProfile } = useFarcasterProfile(loanData?.borrower);
  const hasProfile = false;
  const profile = null;
  const reputation = null;

  // Fetch metadata from IPFS
  useEffect(() => {
    if (loanData?.metadataURI) {
      setLoadingMetadata(true);

      // Add timeout for metadata fetch
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      // Convert ipfs:// to gateway URL
      const metadataUrl = loanData.metadataURI.startsWith('ipfs://')
        ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${loanData.metadataURI.replace('ipfs://', '')}`
        : loanData.metadataURI;

      fetch(metadataUrl, { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch metadata');
          return res.json();
        })
        .then(data => {
          // Convert IPFS image URL if needed
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${data.image.replace('ipfs://', '')}`;
          }
          setMetadata(data);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error('Error loading metadata:', err);
          }
          // Set fallback metadata so we don't block rendering
          setMetadata({ name: 'Community Loan', description: 'Metadata not available' });
        })
        .finally(() => {
          clearTimeout(timeout);
          setLoadingMetadata(false);
        });

      return () => {
        clearTimeout(timeout);
        controller.abort();
      };
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
        <Link href="/" className="text-[#3B9B7F] hover:underline">
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
      <Link href="/" className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-4">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to loans
      </Link>

      {/* Loan Image */}
      {metadata?.imageUrl && (
        <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden mb-6">
          <img
            src={metadata.imageUrl.startsWith('ipfs://')
              ? `https://gateway.pinata.cloud/ipfs/${metadata.imageUrl.replace('ipfs://', '')}`
              : metadata.imageUrl
            }
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
      <div className="mb-4">
        {hasProfile && profile ? (
          <div className="flex items-start gap-3">
            <img
              src={profile.pfpUrl}
              alt={profile.displayName}
              className="w-12 h-12 rounded-full bg-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-semibold text-gray-900">
                  {profile.displayName}
                </span>
                {profile.powerBadge && (
                  <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11.75A2.25 2.25 0 1111.25 9.5 2.25 2.25 0 019 11.75zm0 9.5l-3-6.75h6l-3 6.75zM15 11.75a2.25 2.25 0 112.25-2.25A2.25 2.25 0 0115 11.75zm0 9.5l-3-6.75h6l-3 6.75z"/>
                  </svg>
                )}
                {isBorrower && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-2">@{profile.username}</div>
              {profile.bio && (
                <p className="text-sm text-gray-700 mb-2">{profile.bio}</p>
              )}
              {reputation && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">{profile.followerCount.toLocaleString()}</span>
                    <span className="text-gray-500">followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">{reputation.overall}/100</span>
                    <span className="text-gray-500">trust score</span>
                  </div>
                  <div className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                    {reputation.followerTier === 'whale' ? '🐋 Whale' :
                     reputation.followerTier === 'influential' ? '⭐ Influential' :
                     reputation.followerTier === 'active' ? '✨ Active' :
                     reputation.followerTier === 'growing' ? '🌱 Growing' : '🆕 New'}
                  </div>
                  <div className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                    {reputation.accountAge === 'veteran' ? '👑 Veteran' :
                     reputation.accountAge === 'established' ? '⚡ Established' :
                     reputation.accountAge === 'growing' ? '🔰 Growing' : '🎯 New'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
            <span>
              {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
              {isBorrower && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>}
            </span>
          </div>
        )}
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
              className="bg-[#3B9B7F] h-3 rounded-full transition-all duration-500"
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
            className="mt-6 w-full block text-center bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Lend Support
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
