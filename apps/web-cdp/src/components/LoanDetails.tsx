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
import ShareModal from '@/components/ShareModal';
import type { LoanShareData } from '@/utils/shareUtils';

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
    twitterHandle?: string;
    loanUseAndImpact?: string;
    repaymentPlan?: string;
  };
}

export default function LoanDetails({ loanAddress }: LoanDetailsProps) {
  const { loanData, isLoading } = useLoanData(loanAddress);
  const { address: userAddress } = useAccount();
  const { balance: usdcBalance } = useUSDCBalance(userAddress);
  const [metadata, setMetadata] = useState<LoanMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  // Check if loan is defaulted (active, not completed, and past due date)
  const now = BigInt(Math.floor(Date.now() / 1000));
  const isLoanDefaulted = loanData.active && !loanData.completed && now > loanData.dueAt;

  // Fetch Farcaster profile for borrower
  const { profile: borrowerProfile, isLoading: isProfileLoading } = useFarcasterProfile(loanData.borrower);

  // Check if refund is available
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
      <div className="flex items-center gap-3 py-2.5">
        {profile?.pfpUrl ? (
          <img
            src={profile.pfpUrl}
            alt={profile.displayName || 'Contributor'}
            className="w-12 h-12 rounded-full bg-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] flex items-center justify-center text-white text-sm font-bold">
            {contributorAddress.slice(2, 4).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-gray-900 truncate">
            {profile?.displayName || profile?.username ? `@${profile.username}` : 'Anonymous'}
          </div>
          <div className="text-sm text-gray-600">
            ${contribData ? formatUSDC(contribData.amount) : '...'} USDC
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 lg:pb-8">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-5 text-base font-medium">
        <svg className="w-6 h-6 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="relative w-full rounded-2xl overflow-hidden mb-5 bg-gray-100" style={{ paddingBottom: '75%' }}>
          <img
            src={(() => {
              const imageSource = metadata.imageUrl || metadata.image || '';
              return imageSource.startsWith('ipfs://')
                ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${imageSource.replace('ipfs://', '')}`
                : imageSource;
            })()}
            alt={metadata?.name || 'Loan'}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      )}

      {/* Title and Borrower */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          {metadata?.name || 'Loading...'}
        </h1>

        {/* Borrower Info */}
        <div className="flex items-center gap-3 text-base">
          {borrowerProfile?.pfp ? (
            <img
              src={borrowerProfile.pfp}
              alt={borrowerProfile.displayName || borrowerProfile.username || 'Borrower'}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {loanData.borrower.slice(2, 4).toUpperCase()}
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {borrowerProfile?.displayName || borrowerProfile?.username || `${loanData.borrower.slice(0, 6)}...${loanData.borrower.slice(-4)}`}
            </span>
            {isBorrower && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2.5 py-1 rounded">You</span>
            )}
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 mb-5">
        {loanData.completed && (
          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            Completed
          </span>
        )}
        {loanData.active && !loanData.completed && (
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            Active
          </span>
        )}
        {loanData.fundraisingActive && (
          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            Fundraising
          </span>
        )}
        {isLoanDefaulted && (
          <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            Defaulted
          </span>
        )}
      </div>

      {/* Borrower Actions */}
      {isBorrower && loanData.active && !loanData.completed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 sm:p-6 mb-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Repaid</p>
              <p className="text-base font-bold text-gray-900">${formatUSDC(loanData.totalRepaid)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Outstanding</p>
              <p className="text-base font-bold text-gray-900">${formatUSDC(loanData.principal - loanData.totalRepaid)}</p>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount"
              value={repaymentAmount}
              onChange={(e) => setRepaymentAmount(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {repaymentAmount && parseFloat(repaymentAmount) > 0 ? (
            <>
              {(!usdcAllowance || usdcAllowance < parseUnits(repaymentAmount, USDC_DECIMALS)) ? (
                <button
                  onClick={handleApprove}
                  disabled={isApprovePending || isApproveConfirming}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-5 rounded-lg transition-colors text-base mb-2"
                >
                  {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve USDC'}
                </button>
              ) : (
                <button
                  onClick={handleRepay}
                  disabled={isRepayPending || isRepayConfirming}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-5 rounded-lg transition-colors text-base"
                >
                  {isRepayPending || isRepayConfirming ? 'Processing...' : 'Submit Repayment'}
                </button>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Disburse */}
      {isFunded && !loanData.active && isBorrower && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 sm:p-6 mb-5">
          <p className="text-base text-green-800 mb-3">Loan fully funded! Claim ${formatUSDC(loanData.principal)} USDC</p>
          <button
            onClick={() => disburseLoan(loanAddress)}
            disabled={isDisbursePending || isDisburseConfirming}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-5 rounded-lg transition-colors text-base"
          >
            {isDisbursePending || isDisburseConfirming ? 'Processing...' : 'Claim Funds'}
          </button>
        </div>
      )}

      {/* Refund */}
      {refundAvailable && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 sm:p-6 mb-5">
          <p className="text-base text-orange-800 mb-3">Refund available: ${formatUSDC(contribution!.amount)} USDC</p>
          <button
            onClick={handleRefund}
            disabled={isRefundPending || isRefundConfirming}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-3 px-5 rounded-lg transition-colors text-base"
          >
            {isRefundPending || isRefundConfirming ? 'Processing...' : 'Claim Refund'}
          </button>
        </div>
      )}

      {/* Trust & Verification */}
      {loanData && (
        <div className="mb-5">
          <TrustSignals
            borrowerAddress={loanData.borrower}
            loanAddress={loanAddress}
            businessWebsite={metadata?.loanDetails?.businessWebsite}
            twitterHandle={metadata?.loanDetails?.twitterHandle}
          />
        </div>
      )}

      {/* About the Borrower */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-5">
        <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2.5">
          <svg className="w-5 h-5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          About the Borrower
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
          {metadata?.loanDetails?.aboutYou || metadata?.description || (
            <span className="text-gray-400 italic">No information provided</span>
          )}
        </p>
        {metadata?.loanDetails?.businessWebsite && (
          <a
            href={metadata.loanDetails.businessWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-base text-[#3B9B7F] hover:text-[#2E7D68] font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Visit Website
          </a>
        )}
      </div>

      {/* How I'll Use This Loan */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-5">
        <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2.5">
          <svg className="w-5 h-5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          How I'll Use This Loan
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
          {metadata?.loanDetails?.loanUseAndImpact || (
            <span className="text-gray-400 italic">No plan provided</span>
          )}
        </p>
      </div>

      {/* Loan Terms */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-5">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2.5">
          <svg className="w-5 h-5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Loan Terms
        </h2>

        {/* All 4 data points in one row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-green-50 rounded-lg p-3.5">
            <p className="text-sm text-gray-500 mb-1">Interest</p>
            <p className="text-base font-bold text-green-600">0%</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3.5">
            <p className="text-sm text-gray-500 mb-1">Repayment</p>
            <p className="text-base font-bold text-gray-900">1.0x</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3.5">
            <p className="text-sm text-gray-500 mb-1">Maturity Date</p>
            <p className="text-base font-bold text-gray-900">{formatDate(loanData.dueAt)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3.5">
            <p className="text-sm text-gray-500 mb-1">Funding Deadline</p>
            <p className="text-base font-bold text-gray-900">{formatDate(loanData.fundraisingDeadline)}</p>
          </div>
        </div>
      </div>

      {/* Contributors - Simple Count (Mobile Only) */}
      {loanData.contributorsCount > 0n && (
        <div className="lg:hidden bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
          <h3 className="text-base font-bold text-gray-700 mb-3">Supporters</h3>
          <div className="flex items-center gap-3 text-base text-gray-600">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-sm">
              {/* Circular Progress */}
              <div className="flex items-center gap-5 mb-7">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="#3B9B7F"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${formatUSDC(loanData.totalFunded)} raised
                  </div>
                  <div className="text-base text-gray-600 mt-1">
                    ${formatUSDC(loanData.principal)} goal · {loanData.contributorsCount.toString()} donations
                  </div>
                </div>
              </div>

              {/* Share Button - White background with gradient border and text */}
              <div className="relative p-[6px] bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] rounded-xl mb-3">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-white hover:bg-gray-50 font-bold rounded-[10px] transition-colors text-base"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="shareGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2C7DA0" />
                        <stop offset="50%" stopColor="#2E8B8B" />
                        <stop offset="100%" stopColor="#3B9B7F" />
                      </linearGradient>
                    </defs>
                    <path stroke="url(#shareGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] bg-clip-text text-transparent">Share</span>
                </button>
              </div>

              {/* Donate Button - Full gradient background */}
              {loanData.fundraisingActive && !isFunded ? (
                <Link
                  href={`/loan/${loanAddress}/fund`}
                  className="w-full flex items-center justify-center px-5 py-3.5 bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] hover:from-[#236382] hover:via-[#26706F] hover:to-[#2E7D68] text-white font-bold rounded-xl transition-all text-base shadow-sm"
                >
                  Donate now
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center px-5 py-3.5 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed text-base"
                >
                  {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
                </button>
              )}

              {/* Recent Contributors */}
              {contributors && contributors.length > 0 && (
                <div className="mt-7 pt-7 border-t border-gray-200">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {contributors.map((contributorAddress) => (
                      <ContributorItem key={contributorAddress} address={contributorAddress} />
                    ))}
                  </div>

                  {/* See all / See top buttons */}
                  {totalCount > contributors.length && (
                    <div className="flex gap-3 mt-5">
                      <button className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                        See all
                      </button>
                      <button className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg px-5 py-3.5 flex gap-3 max-w-4xl mx-auto">
        {/* Share Button - White background with gradient border and text */}
        <div className="flex-1 relative p-[6px] bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] rounded-lg">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 font-semibold rounded-[4px] transition-colors text-base"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="shareGradientMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2C7DA0" />
                  <stop offset="50%" stopColor="#2E8B8B" />
                  <stop offset="100%" stopColor="#3B9B7F" />
                </linearGradient>
              </defs>
              <path stroke="url(#shareGradientMobile)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] bg-clip-text text-transparent">Share</span>
          </button>
        </div>

        {loanData.fundraisingActive && !isFunded ? (
          <Link
            href={`/loan/${loanAddress}/fund`}
            className="flex-[2] flex items-center justify-center px-5 py-3 bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] hover:from-[#236382] hover:via-[#26706F] hover:to-[#2E7D68] text-white font-bold rounded-lg transition-all text-base shadow-sm"
          >
            Donate now
          </Link>
        ) : (
          <button
            disabled
            className="flex-[2] flex items-center justify-center px-5 py-3 bg-gray-300 text-gray-500 font-bold rounded-lg cursor-not-allowed text-base"
          >
            {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
          </button>
        )}
      </div>

      {/* Share Modal */}
      {loanData && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          loan={{
            id: loanAddress,
            title: metadata?.name || 'Community Loan',
            borrower: loanData.borrower,
            description: metadata?.description,
            image: metadata?.image || metadata?.imageUrl,
            principal: parseFloat(formatUnits(loanData.principal, USDC_DECIMALS)),
            totalFunded: parseFloat(formatUnits(loanData.totalFunded, USDC_DECIMALS)),
            progressPercentage: loanData.principal > 0n
              ? (parseFloat(formatUnits(loanData.totalFunded, USDC_DECIMALS)) / parseFloat(formatUnits(loanData.principal, USDC_DECIMALS))) * 100
              : 0
          }}
        />
      )}
    </div>
  );
}
