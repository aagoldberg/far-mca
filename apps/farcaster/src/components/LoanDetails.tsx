'use client';

import { useLoanData, useContribution, useContributors, useRefund, useRepay, useDisburse, calculateRepaymentProgress } from '@/hooks/useMicroLoan';
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove } from '@/hooks/useUSDC';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useENSProfile } from '@/hooks/useENSProfile';
import { useReputationScore } from '@/hooks/useReputationScore';
import { useWalletActivity } from '@/hooks/useWalletActivity';
import { useOpenRank } from '@/hooks/useOpenRank';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { formatUnits, parseUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useState, useEffect } from 'react';
import { fetchFromIPFS } from '@/lib/ipfs';
import { calculateLoanStatus } from '@/utils/loanStatus';
import { PaymentWarningAlert } from '@/components/PaymentWarningBadge';
import { useToast } from '@/contexts/ToastContext';
import { TrustSignals } from '@/components/TrustSignals';

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
  const { loanData, isLoading } = useLoanData(loanAddress);
  const { address: userAddress } = useAccount();
  const { balance: usdcBalance } = useUSDCBalance(userAddress);
  const [metadata, setMetadata] = useState<LoanMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { showToast } = useToast();

  // Fetch user's contribution (if any)
  const { contribution } = useContribution(loanAddress, userAddress);

  // Fetch first 3 contributors for display
  const { contributors, totalCount, hasMore } = useContributors(loanAddress, 3);

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

  // Fetch Farcaster profile - gracefully falls back to wallet address if no profile exists
  const { profile, reputation, hasProfile } = useFarcasterProfile(loanData?.borrower);

  // Fetch ENS profile
  const { profile: ensProfile, hasENS } = useENSProfile(loanData?.borrower);

  // Fetch enhanced reputation score (combines Farcaster + wallet activity)
  const { score: enhancedReputation, isLoading: reputationLoading } = useReputationScore(loanData?.borrower);

  // Fetch wallet activity for credentials display
  const { activityScore, metrics: walletMetrics } = useWalletActivity(loanData?.borrower);

  // Fetch OpenRank score (Farcaster reputation)
  const { data: openRankData } = useOpenRank(profile?.fid);

  // Fetch Gitcoin Passport score (human verification)
  const { score: gitcoinScore } = useGitcoinPassport(loanData?.borrower);

  // Toast notifications for transaction success
  useEffect(() => {
    if (isApproveSuccess) {
      showToast('USDC approved successfully!', 'success');
    }
  }, [isApproveSuccess, showToast]);

  useEffect(() => {
    if (isRepaySuccess) {
      showToast('Repayment submitted successfully!', 'success');
      setRepaymentAmount(''); // Clear the input
    }
  }, [isRepaySuccess, showToast]);

  useEffect(() => {
    if (isRefundSuccess) {
      showToast('Refund claimed successfully!', 'success');
    }
  }, [isRefundSuccess, showToast]);

  useEffect(() => {
    if (isDisburseSuccess) {
      showToast('Funds disbursed successfully!', 'success');
    }
  }, [isDisburseSuccess, showToast]);

  // Fetch metadata from IPFS with caching
  useEffect(() => {
    if (loanData?.metadataURI) {
      setLoadingMetadata(true);

      fetchFromIPFS(loanData.metadataURI)
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

  // Calculate payment status if loan is active
  // TODO: Re-enable once we have disbursementTime from contract
  const loanStatusInfo = null;

  // Check if refund is available
  // Refunds available if: loan not active AND (fundraising deadline passed without full funding OR cancelled)
  const now = BigInt(Math.floor(Date.now() / 1000));
  const fundraisingExpired = now > loanData.fundraisingDeadline;
  const refundAvailable = !loanData.active && contribution && contribution.amount > BigInt(0) &&
    ((!isFunded && fundraisingExpired) || (!loanData.fundraisingActive && !isFunded));

  const handleRefund = async () => {
    if (!loanAddress) return;
    try {
      await requestRefund(loanAddress);
    } catch (error) {
      console.error('Error requesting refund:', error);
      showToast('Failed to request refund. Please try again.', 'error');
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
      showToast('Failed to approve USDC. Please try again.', 'error');
    }
  };

  const handleRepay = async () => {
    if (!loanAddress || !repaymentAmount) return;
    try {
      const amount = parseUnits(repaymentAmount, USDC_DECIMALS);
      await repay(loanAddress, amount);
    } catch (error) {
      console.error('Error making repayment:', error);
      showToast('Failed to submit repayment. Please try again.', 'error');
    }
  };

  const setMaxRepayment = () => {
    if (!loanData) return;
    const outstandingPrincipal = loanData.principal - loanData.totalRepaid;
    const maxAmount = parseFloat(formatUnits(outstandingPrincipal, USDC_DECIMALS));
    setRepaymentAmount(maxAmount.toString());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-4">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to loans
      </Link>

      {/* Loan Image */}
      {(metadata?.imageUrl || metadata?.image) && (
        <div className="relative w-full rounded-2xl overflow-hidden mb-4 bg-gray-100" style={{ paddingBottom: '75%' }}>
          <img
            src={(() => {
              const imageSource = metadata.imageUrl || metadata.image || '';
              return imageSource.startsWith('ipfs://')
                ? `https://gateway.pinata.cloud/ipfs/${imageSource.replace('ipfs://', '')}`
                : imageSource;
            })()}
            alt={metadata?.name || 'Loan'}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      )}

      {/* Title and Borrower - Compact */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {metadata?.name || 'Loading...'}
        </h1>

        {/* Borrower Info */}
        {hasProfile && profile ? (
          <div className="flex items-center gap-2">
            <a
              href={`https://warpcast.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <img
                src={profile.pfpUrl}
                alt={profile.displayName}
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs';
                  fallback.textContent = profile.displayName.charAt(0).toUpperCase();
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </a>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              {hasENS && ensProfile ? (
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  {ensProfile.name}
                  <span className="text-xs text-blue-600">✓</span>
                </span>
              ) : (
                <a
                  href={`https://warpcast.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 hover:text-[#3B9B7F] transition-colors"
                >
                  {profile.displayName}
                </a>
              )}
              {profile.powerBadge && (
                <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11.75A2.25 2.25 0 1111.25 9.5 2.25 2.25 0 019 11.75zm0 9.5l-3-6.75h6l-3 6.75zM15 11.75a2.25 2.25 0 112.25-2.25A2.25 2.25 0 0115 11.75zm0 9.5l-3-6.75h6l-3 6.75z"/>
                </svg>
              )}
              <span className="text-gray-500">•</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(loanData.borrower);
                  showToast('Address copied!', 'success');
                }}
                className="text-xs text-gray-500 hover:text-gray-700 font-mono transition-colors"
                title="Click to copy address"
              >
                {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
              </button>
              {isBorrower && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>
              )}
            </div>
          </div>
        ) : hasENS && ensProfile && ensProfile.name ? (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {ensProfile.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-900 flex items-center gap-1">
              {ensProfile.name}
              <span className="text-xs text-blue-600">✓</span>
            </span>
            <span className="text-gray-500">•</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(loanData.borrower);
                showToast('Address copied!', 'success');
              }}
              className="text-xs text-gray-500 hover:text-gray-700 font-mono transition-colors"
            >
              {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
            </button>
            {isBorrower && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {loanData.borrower.slice(2, 4).toUpperCase()}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(loanData.borrower);
                showToast('Address copied!', 'success');
              }}
              className="font-medium text-gray-900 hover:text-gray-700 font-mono transition-colors"
            >
              {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
            </button>
            {isBorrower && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>
            )}
          </div>
        )}
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
      </div>

      {/* Payment Warning Alert */}
      {loanStatusInfo && (
        <div className="mb-6">
          <PaymentWarningAlert statusInfo={loanStatusInfo} />
        </div>
      )}

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

      {/* Trust & Verification */}
      <div className="mb-4">
        <TrustSignals
          borrowerAddress={loanData.borrower}
          loanAddress={loanAddress}
          businessWebsite={metadata?.businessWebsite}
        />
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
              <p className="text-xs text-gray-500 mb-0.5">Due Date</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(loanData.dueAt)}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-xs text-gray-500 mb-0.5">Fundraising Deadline</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(loanData.fundraisingDeadline)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contributors - Compact */}
      {totalCount > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Supporters</h3>
          <div className="flex items-center gap-3">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {contributors.map((contributorAddress, index) => {
                const { profile } = useFarcasterProfile(contributorAddress);
                return (
                  <div
                    key={contributorAddress}
                    className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                    style={{ zIndex: contributors.length - index }}
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
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] text-white text-xs font-bold">
                        {contributorAddress.slice(2, 4).toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Text description */}
            <div className="flex-1 text-sm text-gray-600">
              {contributors.slice(0, 2).map((addr, idx) => {
                const { profile } = useFarcasterProfile(addr);
                return (
                  <span key={addr}>
                    <span className="font-medium text-gray-900">
                      {profile?.username ? `@${profile.username}` : `${addr.slice(0, 6)}...${addr.slice(-4)}`}
                    </span>
                    {idx === 0 && contributors.length > 1 && ', '}
                  </span>
                );
              })}
              {hasMore && (
                <span>
                  {' '}and {totalCount - contributors.length} other{totalCount - contributors.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg px-4 py-2.5 flex gap-2 max-w-4xl mx-auto">
        {/* Split Share Button */}
        <div className="flex-1 relative">
          <div className="flex gap-0.5">
            {/* Cast to Farcaster - Primary Action */}
            <button
              onClick={() => {
                const castUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
                  `Check out this community loan on LendFriend!\n\n${metadata?.name || 'Community Loan'}\n\n${window.location.href}`
                )}`;
                window.open(castUrl, '_blank');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-l-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 1000 1000" fill="currentColor">
                <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z"/>
                <path d="M128.889 253.333L128.889 746.667H184.444V253.333H128.889Z"/>
                <path d="M815.556 253.333L815.556 746.667H871.111V253.333H815.556Z"/>
              </svg>
              Cast
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="px-2.5 py-2.5 bg-white border border-l-0 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-r-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* Share Menu Dropdown */}
          {showShareMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowShareMenu(false)}
              />

              {/* Menu */}
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Link copied to clipboard!', 'success');
                    setShowShareMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Copy Link</span>
                </button>

                {navigator.share && (
                  <button
                    onClick={() => {
                      navigator.share({
                        title: metadata?.name || 'Support a Community Loan',
                        text: `Help support this community loan on LendFriend`,
                        url: window.location.href,
                      }).catch(err => console.log('Share cancelled', err));
                      setShowShareMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">More Options</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

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
