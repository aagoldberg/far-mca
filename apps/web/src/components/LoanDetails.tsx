'use client';

import { useLoanData, useContribution, useRefund, useRepay, useDisburse, useContributors } from '@/hooks/useMicroLoan';
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove } from '@/hooks/useUSDC';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { formatUnits, parseUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useState, useEffect } from 'react';
import { TrustSignals } from '@/components/TrustSignals';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';

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
  fullDescription?: string;
  businessWebsite?: string;
  imageUrl?: string; // Legacy field
  image?: string; // Current field used in CreateLoanForm
  loanDetails?: {
    aboutYou?: string;
    businessWebsite?: string;
    loanUseAndImpact?: string;
    repaymentPlan?: string;
  };
}

export default function LoanDetails({ loanAddress }: LoanDetailsProps) {
  const { loanData, isLoading, perPeriodPrincipal, currentDueDate, isDefaulted } = useLoanData(loanAddress);
  const isLoanDefaulted = Boolean(isDefaulted);
  const paymentPerPeriod = perPeriodPrincipal as bigint | undefined;
  const nextDueDate = currentDueDate as bigint | undefined;
  const { address: userAddress } = useAccount();
  const { balance: usdcBalance } = useUSDCBalance(userAddress);
  const [metadata, setMetadata] = useState<LoanMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Fetch user's contribution (if any)
  const { contribution } = useContribution(loanAddress, userAddress);

  // Fetch contributors for sidebar
  const { contributors, totalCount } = useContributors(loanAddress, 10);

  // Refund hook
  const {
    refund: requestRefund,
    isPending: isRefundPending,
    isConfirming: isRefundConfirming,
    isSuccess: isRefundSuccess
  } = useRefund();

  // Disbursement hook
  const {
    disburse: disburseLoan,
    isPending: isDisbursePending,
    isConfirming: isDisburseConfirming,
    isSuccess: isDisburseSuccess
  } = useDisburse();

  // Repayment state and hooks
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const { allowance: usdcAllowance } = useUSDCAllowance(userAddress, loanAddress);
  const {
    approve: approveUSDC,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isSuccess: isApproveSuccess
  } = useUSDCApprove();
  const {
    repay,
    isPending: isRepayPending,
    isConfirming: isRepayConfirming,
    isSuccess: isRepaySuccess
  } = useRepay();

  // Fetch metadata from IPFS with caching
  useEffect(() => {
    if (loanData?.metadataURI) {
      setLoadingMetadata(true);

      const metadataUrl = loanData.metadataURI.startsWith('ipfs://')
        ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${loanData.metadataURI.replace('ipfs://', '')}`
        : loanData.metadataURI;

      fetch(metadataUrl)
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
          console.error('Error loading metadata:', err);
          // Set fallback metadata so we don't block rendering
          setMetadata({ name: 'Community Loan', description: 'Metadata not available' });
        })
        .finally(() => {
          setLoadingMetadata(false);
        });
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

  // Check if refund is available
  const now = BigInt(Math.floor(Date.now() / 1000));
  const fundraisingExpired = now > loanData.fundraisingDeadline;
  const refundAvailable = !loanData.active && contribution && contribution.amount > BigInt(0) &&
    ((!isFunded && fundraisingExpired) || (!loanData.fundraisingActive && !isFunded));

  const handleRefund = async () => {
    if (!loanAddress) return;
    try {
      await requestRefund(loanAddress);
      alert('Refund claimed successfully!');
    } catch (error) {
      console.error('Error requesting refund:', error);
      alert('Failed to request refund. Please try again.');
    }
  };

  // Repayment handlers
  const handleApprove = async () => {
    if (!loanAddress || !repaymentAmount) return;
    try {
      const amount = parseUnits(repaymentAmount, USDC_DECIMALS);
      await approveUSDC(loanAddress, amount);
    } catch (error) {
      console.error('Error approving USDC:', error);
      alert('Failed to approve USDC. Please try again.');
    }
  };

  const handleRepay = async () => {
    if (!loanAddress || !repaymentAmount) return;
    try {
      const amount = parseUnits(repaymentAmount, USDC_DECIMALS);
      await repay(loanAddress, amount);
      setRepaymentAmount(''); // Clear the input
      alert('Repayment submitted successfully!');
    } catch (error) {
      console.error('Error making repayment:', error);
      alert('Failed to submit repayment. Please try again.');
    }
  };

  const setMaxRepayment = () => {
    if (!loanData) return;
    const outstandingPrincipal = loanData.principal - loanData.totalRepaid;
    const maxAmount = parseFloat(formatUnits(outstandingPrincipal, USDC_DECIMALS));
    setRepaymentAmount(maxAmount.toString());
  };

  // Component for individual contributor in sidebar
  const ContributorItem = ({ address: contributorAddress }: { address: `0x${string}` }) => {
    const { profile } = useFarcasterProfile(contributorAddress);
    const { contribution: contribData } = useContribution(loanAddress, contributorAddress);

    return (
      <div className="flex items-center gap-2 py-2">
        {profile?.pfpUrl ? (
          <img
            src={profile.pfpUrl}
            alt={profile.displayName || 'Contributor'}
            className="w-10 h-10 rounded-full bg-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] flex items-center justify-center text-white text-xs font-bold">
            {contributorAddress.slice(2, 4).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {profile?.displayName || profile?.username ? `@${profile.username}` : 'Anonymous'}
          </div>
          <div className="text-xs text-gray-600">
            ${contribData ? formatUSDC(contribData.amount) : '...'} USDC
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-4">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to loans
      </Link>

      {/* Grid layout with main content and sticky sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">

      {/* Loan Image */}
      {(metadata?.imageUrl || metadata?.image) && (
        <div className="relative h-48 md:h-56 w-full rounded-2xl overflow-hidden mb-4">
          <img
            src={(() => {
              const imageSource = metadata.imageUrl || metadata.image || '';
              return imageSource.startsWith('ipfs://')
                ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${imageSource.replace('ipfs://', '')}`
                : imageSource;
            })()}
            alt={metadata?.name || 'Loan'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title and Borrower - Compact */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {metadata?.name || 'Loading...'}
        </h1>

        {/* Borrower Info */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {loanData.borrower.slice(2, 4).toUpperCase()}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(loanData.borrower);
              alert('Address copied to clipboard!');
            }}
            className="font-medium text-gray-900 hover:text-gray-700 font-mono transition-colors"
          >
            {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
          </button>
          {isBorrower && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>
          )}
        </div>
      </div>

      {/* Status badges - Compact */}
      <div className="flex gap-1.5 mb-3">
        {loanData.completed && (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Completed
          </span>
        )}
        {loanData.active && !loanData.completed && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Active
          </span>
        )}
        {loanData.fundraisingActive && (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Fundraising
          </span>
        )}
        {isLoanDefaulted && (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Defaulted
          </span>
        )}
      </div>

      {/* Compact Funding Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="font-semibold text-gray-900">
            ${formatUSDC(loanData.totalFunded)} USDC
          </span>
          <span className="text-gray-500">
            of ${formatUSDC(loanData.principal)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#3B9B7F] h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Borrower Actions - Compact */}
      {isBorrower && loanData.active && !loanData.completed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-gray-600">Repaid</p>
              <p className="text-sm font-semibold text-gray-900">${formatUSDC(loanData.totalRepaid)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Outstanding</p>
              <p className="text-sm font-semibold text-gray-900">${formatUSDC(loanData.principal - loanData.totalRepaid)}</p>
            </div>
          </div>
          <div className="mb-3">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount"
              value={repaymentAmount}
              onChange={(e) => setRepaymentAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {repaymentAmount && parseFloat(repaymentAmount) > 0 ? (
            <>
              {(!usdcAllowance || usdcAllowance < parseUnits(repaymentAmount, USDC_DECIMALS)) ? (
                <button
                  onClick={handleApprove}
                  disabled={isApprovePending || isApproveConfirming}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm mb-2"
                >
                  {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve USDC'}
                </button>
              ) : (
                <button
                  onClick={handleRepay}
                  disabled={isRepayPending || isRepayConfirming}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  {isRepayPending || isRepayConfirming ? 'Processing...' : 'Submit Repayment'}
                </button>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Disburse - Compact */}
      {isFunded && !loanData.active && isBorrower && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-green-800 mb-2">Loan fully funded! Claim ${formatUSDC(loanData.principal)} USDC</p>
          <button
            onClick={() => disburseLoan(loanAddress)}
            disabled={isDisbursePending || isDisburseConfirming}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            {isDisbursePending || isDisburseConfirming ? 'Processing...' : 'Claim Funds'}
          </button>
        </div>
      )}

      {/* Refund - Compact */}
      {refundAvailable && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-orange-800 mb-2">Refund available: ${formatUSDC(contribution!.amount)} USDC</p>
          <button
            onClick={handleRefund}
            disabled={isRefundPending || isRefundConfirming}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            {isRefundPending || isRefundConfirming ? 'Processing...' : 'Claim Refund'}
          </button>
        </div>
      )}

      {/* Trust & Verification */}
      {loanData && (
        <div className="mb-4">
          <TrustSignals
            borrowerAddress={loanData.borrower}
            loanAddress={loanAddress}
            businessWebsite={metadata?.loanDetails?.businessWebsite}
          />
        </div>
      )}

      {/* About the Borrower */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          About the Borrower
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
          {metadata?.loanDetails?.aboutYou || metadata?.description || (
            <span className="text-gray-400 italic">No information provided</span>
          )}
        </p>
        {metadata?.loanDetails?.businessWebsite && (
          <a
            href={metadata.loanDetails.businessWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#3B9B7F] hover:text-[#2E7D68] font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Visit Website
          </a>
        )}
      </div>

      {/* How I'll Use This Loan */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          How I'll Use This Loan
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
          {metadata?.loanDetails?.loanUseAndImpact || (
            <span className="text-gray-400 italic">No plan provided</span>
          )}
        </p>
      </div>

      {/* Repayment Plan */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Repayment Plan
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
          {metadata?.loanDetails?.repaymentPlan || (
            <span className="text-gray-400 italic">No repayment plan provided</span>
          )}
        </p>
      </div>

      {/* Loan Terms */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Loan Terms
        </h2>

        <div className="space-y-3">
          {/* Key Highlights - Compact */}
          <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Interest</p>
                <p className="text-sm font-semibold text-green-600">0%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Repayment</p>
                <p className="text-sm font-semibold text-gray-900">1.0x</p>
              </div>
            </div>
          </div>

          {/* Details Grid - Simplified */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-xs text-gray-500 mb-0.5">Term Length</p>
              <p className="text-sm font-semibold text-gray-900">{loanData.termPeriods.toString()} weeks</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-xs text-gray-500 mb-0.5">Deadline</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(loanData.fundraisingDeadline)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contributors - Simple Count (Mobile Only) */}
      {loanData.contributorsCount > 0n && (
        <div className="lg:hidden bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Supporters</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{loanData.contributorsCount.toString()} supporter{loanData.contributorsCount === 1n ? '' : 's'}</span>
          </div>
        </div>
      )}
        </div>

        {/* Sticky Sidebar (Desktop Only) */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {/* Circular Progress */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#3B9B7F"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    ${formatUSDC(loanData.totalFunded)} raised
                  </div>
                  <div className="text-sm text-gray-600">
                    ${formatUSDC(loanData.principal)} goal · {loanData.contributorsCount.toString()} donations
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: metadata?.name || 'Support a Community Loan',
                      text: `Help support this community loan on LendFriend`,
                      url: window.location.href,
                    }).catch(err => console.log('Share cancelled', err));
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2E7D68] hover:bg-[#256655] text-white font-semibold rounded-xl transition-colors mb-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>

              {/* Donate Button */}
              {loanData.fundraisingActive && !isFunded ? (
                <Link
                  href={`/loan/${loanAddress}/fund`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#9FE870] hover:bg-[#8DD65E] text-gray-900 font-semibold rounded-xl transition-colors"
                >
                  Donate now
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed"
                >
                  {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
                </button>
              )}

              {/* Recent Contributors */}
              {contributors && contributors.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {contributors.map((contributorAddress) => (
                      <ContributorItem key={contributorAddress} address={contributorAddress} />
                    ))}
                  </div>

                  {/* See all / See top buttons */}
                  {totalCount > contributors.length && (
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        See all
                      </button>
                      <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        See top
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Menu (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg px-4 py-2.5 flex gap-2 max-w-4xl mx-auto">
        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: metadata?.name || 'Support a Community Loan',
                text: `Help support this community loan on LendFriend`,
                url: window.location.href,
              }).catch(err => console.log('Share cancelled', err));
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>

        {loanData.fundraisingActive && !isFunded ? (
          <Link
            href={`/loan/${loanAddress}/fund`}
            className="flex-[2] flex items-center justify-center px-4 py-2.5 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold rounded-lg transition-colors text-sm shadow-sm"
          >
            Donate
          </Link>
        ) : (
          <button
            disabled
            className="flex-[2] flex items-center justify-center px-4 py-2.5 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed text-sm"
          >
            {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
          </button>
        )}
      </div>
    </div>
  );
}
