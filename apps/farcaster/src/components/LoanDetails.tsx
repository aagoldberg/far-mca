'use client';

import { useLoanData, useContribution, useContributors, useRefund, useRepay, calculateRepaymentProgress } from '@/hooks/useMicroLoan';
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove } from '@/hooks/useUSDC';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useENSProfile } from '@/hooks/useENSProfile';
import { useReputationScore } from '@/hooks/useReputationScore';
import { useWalletActivity } from '@/hooks/useWalletActivity';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { formatUnits, parseUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useState, useEffect } from 'react';
import { fetchFromIPFS } from '@/lib/ipfs';
import { calculateLoanStatus } from '@/utils/loanStatus';
import { PaymentWarningAlert } from '@/components/PaymentWarningBadge';
import { useToast } from '@/contexts/ToastContext';

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
  businessType?: string;
  location?: string;
  imageUrl?: string; // Legacy field
  image?: string; // Current field used in CreateLoanForm
  useOfFunds?: string;
  repaymentSource?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-4">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to loans
      </Link>

      {/* Loan Image */}
      {(metadata?.imageUrl || metadata?.image) && (
        <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden mb-6">
          <img
            src={(() => {
              const imageSource = metadata.imageUrl || metadata.image || '';
              return imageSource.startsWith('ipfs://')
                ? `https://gateway.pinata.cloud/ipfs/${imageSource.replace('ipfs://', '')}`
                : imageSource;
            })()}
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
            {/* Avatar - clickable to Warpcast */}
            <a
              href={`https://warpcast.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <img
                src={profile.pfpUrl}
                alt={profile.displayName}
                className="w-14 h-14 rounded-full object-cover bg-gray-200 border-2 border-gray-100"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg';
                  fallback.textContent = profile.displayName.charAt(0).toUpperCase();
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </a>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {/* Display Name - clickable to Warpcast */}
                <a
                  href={`https://warpcast.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-gray-900 hover:text-[#3B9B7F] transition-colors"
                >
                  {profile.displayName}
                </a>
                {profile.powerBadge && (
                  <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11.75A2.25 2.25 0 1111.25 9.5 2.25 2.25 0 019 11.75zm0 9.5l-3-6.75h6l-3 6.75zM15 11.75a2.25 2.25 0 112.25-2.25A2.25 2.25 0 0115 11.75zm0 9.5l-3-6.75h6l-3 6.75z"/>
                  </svg>
                )}
                {isBorrower && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>
                )}
              </div>
              {/* Username - clickable to Warpcast */}
              <div className="flex items-center gap-2 mb-2">
                <a
                  href={`https://warpcast.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#3B9B7F] transition-colors"
                >
                  @{profile.username}
                </a>
                {/* Wallet address with dropdown */}
                <div className="relative group">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(loanData.borrower);
                      showToast('Address copied to clipboard!', 'success');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 font-mono flex items-center gap-1 transition-colors"
                    title="Click to copy address"
                  >
                    {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {/* Dropdown menu */}
                  <div className="absolute left-0 top-full mt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                      <a
                        href={`https://basescan.org/address/${loanData.borrower}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        View on Basescan
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(loanData.borrower);
                          showToast('Full address copied!', 'success');
                        }}
                        className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Copy full address
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {profile.bio && (
                <p className="text-sm text-gray-700">{profile.bio}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            {/* Fallback avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {loanData.borrower.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-medium text-gray-900">
                  {loanData.borrower.slice(0, 6)}...{loanData.borrower.slice(-4)}
                </span>
                {isBorrower && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>
                )}
              </div>
              {/* Wallet address actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`https://basescan.org/address/${loanData.borrower}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View on Basescan
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(loanData.borrower);
                    showToast('Address copied to clipboard!', 'success');
                  }}
                  className="text-xs text-gray-600 hover:text-gray-700 transition-colors flex items-center gap-1"
                >
                  Copy address
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ENS Profile */}
      {hasENS && ensProfile && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔷</span>
            <span className="font-semibold text-blue-900">
              {ensProfile.name}
            </span>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-medium">
              ENS Verified
            </span>
          </div>

          {ensProfile.description && (
            <p className="text-sm text-gray-700 mb-3">{ensProfile.description}</p>
          )}

          {/* Verified Links from ENS */}
          {(ensProfile.website || ensProfile.twitter || ensProfile.github) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-blue-900 mb-2">Verified Links (via ENS):</p>
              {ensProfile.website && (
                <a
                  href={ensProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  {ensProfile.website}
                  <span className="text-xs text-green-600">✓</span>
                </a>
              )}
              {ensProfile.twitter && (
                <a
                  href={`https://twitter.com/${ensProfile.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  @{ensProfile.twitter}
                  <span className="text-xs text-green-600">✓</span>
                </a>
              )}
              {ensProfile.github && (
                <a
                  href={`https://github.com/${ensProfile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  {ensProfile.github}
                  <span className="text-xs text-green-600">✓</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}

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
        {isLoanDefaulted && (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            Defaulted
          </span>
        )}
      </div>

      {/* Payment Warning Alert */}
      {loanStatusInfo && (
        <div className="mb-6">
          <PaymentWarningAlert statusInfo={loanStatusInfo} />
        </div>
      )}

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

        {/* Disburse button (borrower only, if funded) */}
        {isBorrower && isFunded && !loanData.disbursed && (
          <button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Disburse Funds
          </button>
        )}

        {/* Repayment section (borrower only, if active loan) */}
        {isBorrower && loanData.active && !loanData.completed && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            {/* Repayment Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900">Repayment Progress</h3>
                <span className="text-sm text-gray-500">
                  {calculateRepaymentProgress(loanData.totalRepaid, loanData.principal).toFixed(0)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(calculateRepaymentProgress(loanData.totalRepaid, loanData.principal), 100)}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Repaid</p>
                  <p className="font-semibold text-gray-900">
                    ${formatUSDC(loanData.totalRepaid)} USDC
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 mb-1">Outstanding</p>
                  <p className="font-semibold text-gray-900">
                    ${formatUSDC(loanData.principal - loanData.totalRepaid)} USDC
                  </p>
                </div>
              </div>
            </div>

            {/* Repayment Form */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                Make a Repayment
              </h3>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="repayAmount" className="text-sm text-gray-700">
                    Amount (USDC)
                  </label>
                  <button
                    onClick={setMaxRepayment}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Pay Full Amount
                  </button>
                </div>
                <input
                  id="repayAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Balance info */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Your USDC Balance:</span>
                  <span className="font-medium text-gray-900">${formatUSDC(usdcBalance)} USDC</span>
                </div>
              </div>

              {/* Two-step approval flow */}
              {repaymentAmount && parseFloat(repaymentAmount) > 0 ? (
                <>
                  {/* Step 1: Approve USDC */}
                  {(!usdcAllowance || usdcAllowance < parseUnits(repaymentAmount, USDC_DECIMALS)) ? (
                    <button
                      onClick={handleApprove}
                      disabled={isApprovePending || isApproveConfirming || isApproveSuccess}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mb-2"
                    >
                      {isApprovePending || isApproveConfirming
                        ? 'Approving...'
                        : isApproveSuccess
                        ? 'Approved! Now Submit Repayment'
                        : 'Step 1: Approve USDC'}
                    </button>
                  ) : null}

                  {/* Step 2: Make Repayment (only if approved) */}
                  {usdcAllowance && usdcAllowance >= parseUnits(repaymentAmount, USDC_DECIMALS) && (
                    <button
                      onClick={handleRepay}
                      disabled={isRepayPending || isRepayConfirming || isRepaySuccess}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                    >
                      {isRepayPending || isRepayConfirming
                        ? 'Processing...'
                        : isRepaySuccess
                        ? 'Repayment Successful!'
                        : 'Submit Repayment'}
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-3 text-sm text-gray-500">
                  Enter an amount to make a repayment
                </div>
              )}

              {/* Next due date info */}
              {nextDueDate && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Next Payment Due:</span>
                    <span className="font-medium text-gray-900">{formatDate(nextDueDate)}</span>
                  </div>
                  {paymentPerPeriod && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-700">Payment Amount:</span>
                      <span className="font-medium text-gray-900">${formatUSDC(paymentPerPeriod)} USDC</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Refund button (contributors only, if eligible) */}
        {refundAvailable && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-orange-900 mb-1">
                    Refund Available
                  </h3>
                  <p className="text-sm text-orange-800 mb-3">
                    {fundraisingExpired && !isFunded
                      ? 'This loan did not reach its funding goal by the deadline. You can claim a refund of your contribution.'
                      : 'This loan fundraising was cancelled. You can claim a refund of your contribution.'}
                  </p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xs text-orange-700">Your contribution:</span>
                    <span className="text-lg font-bold text-orange-900">
                      ${formatUSDC(contribution!.amount)} USDC
                    </span>
                  </div>
                  <button
                    onClick={handleRefund}
                    disabled={isRefundPending || isRefundConfirming || isRefundSuccess}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                  >
                    {isRefundPending || isRefundConfirming
                      ? 'Processing Refund...'
                      : isRefundSuccess
                      ? 'Refund Claimed!'
                      : 'Claim Refund'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {metadata?.fullDescription || metadata?.description || 'Loading description...'}
        </p>
      </div>

      {/* Loan Terms - Condensed */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Loan Terms</h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
            <p className="font-semibold text-green-600">0%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Repayment</p>
            <p className="font-semibold text-gray-900">1.0x</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Term Length</p>
            <p className="font-semibold text-gray-900">{loanData.termPeriods.toString()} periods</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Period Length</p>
            <p className="font-semibold text-gray-900">{Number(loanData.periodLength) / 86400} days</p>
          </div>

          {paymentPerPeriod && (
            <>
              <div>
                <p className="text-xs text-gray-500 mb-1">Payment Per Period</p>
                <p className="font-semibold text-gray-900">${formatUSDC(paymentPerPeriod)} USDC</p>
              </div>
              {loanData.active && nextDueDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Next Payment Due</p>
                  <p className="font-semibold text-gray-900">{formatDate(nextDueDate)}</p>
                </div>
              )}
            </>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-1">Fundraising Deadline</p>
            <p className="font-semibold text-gray-900">{formatDate(loanData.fundraisingDeadline)}</p>
          </div>
        </div>
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

      {/* Borrower Identity */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Borrower Identity</h2>
        <div className="space-y-3">
          {/* Farcaster */}
          {hasProfile && profile ? (
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 text-lg">✓</span>
              <div className="flex-1">
                <span className="font-medium text-gray-900">Farcaster:</span>{' '}
                <span className="text-gray-700">
                  @{profile.username} ({profile.followerCount.toLocaleString()} followers
                  {reputation && (
                    <>, {
                      reputation.followerTier === 'whale' ? 'Whale' :
                      reputation.followerTier === 'influential' ? 'Influential' :
                      reputation.followerTier === 'active' ? 'Active' :
                      reputation.followerTier === 'growing' ? 'Growing' : 'New'
                    }</>
                  )}
                  )
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5 text-lg">✗</span>
              <div className="flex-1">
                <span className="font-medium text-gray-500">Farcaster:</span>{' '}
                <span className="text-gray-500">No Profile Found</span>
              </div>
            </div>
          )}

          {/* ENS */}
          {hasENS && ensProfile ? (
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 text-lg">✓</span>
              <div className="flex-1">
                <span className="font-medium text-gray-900">ENS:</span>{' '}
                <span className="text-gray-700">{ensProfile.name}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5 text-lg">✗</span>
              <div className="flex-1">
                <span className="font-medium text-gray-500">ENS:</span>{' '}
                <span className="text-gray-500">Not Set</span>
              </div>
            </div>
          )}

          {/* Wallet Activity */}
          {walletMetrics && walletMetrics.hasTransactions ? (
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 text-lg">✓</span>
              <div className="flex-1">
                <span className="font-medium text-gray-900">Wallet:</span>{' '}
                <span className="text-gray-700">
                  Active ({walletMetrics.transactionCount} transaction{walletMetrics.transactionCount !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5 text-lg">✗</span>
              <div className="flex-1">
                <span className="font-medium text-gray-500">Wallet:</span>{' '}
                <span className="text-gray-500">No On-Chain Activity</span>
              </div>
            </div>
          )}

          {/* Pro User (formerly Power Badge) */}
          {hasProfile && reputation?.powerBadge ? (
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 text-lg">✓</span>
              <div className="flex-1">
                <span className="font-medium text-gray-900">Pro User:</span>{' '}
                <span className="text-gray-700">Active Subscriber</span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">✗</span>
              <div className="flex-1">
                <span className="font-medium text-gray-500">Pro User:</span>{' '}
                <span className="text-gray-500">{hasProfile ? 'No Subscription' : 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Risk Assessment */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Lending Risk:</span>
            <span className={`font-semibold px-3 py-1.5 rounded-lg ${
              (hasENS && reputation?.powerBadge) || (reputation?.followerTier === 'whale' || reputation?.followerTier === 'influential')
                ? 'bg-green-100 text-green-800'
                : walletMetrics?.hasTransactions || (profile && profile.followerCount > 100)
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {(hasENS && reputation?.powerBadge) || (reputation?.followerTier === 'whale' || reputation?.followerTier === 'influential')
                ? 'Low Risk'
                : walletMetrics?.hasTransactions || (profile && profile.followerCount > 100)
                ? 'Medium Risk'
                : 'Higher Risk'}
            </span>
          </div>
        </div>
      </div>

      {/* Business Details */}
      {metadata?.businessType && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
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

      {/* Social Links */}
      {metadata?.socialLinks && (metadata.socialLinks.website || metadata.socialLinks.twitter || metadata.socialLinks.instagram || metadata.socialLinks.linkedin) && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Connect</h2>
          <div className="space-y-3">
            {metadata.socialLinks.website && (
              <a
                href={metadata.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-[#3B9B7F] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-green-50 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-xs text-gray-500">{metadata.socialLinks.website}</p>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {metadata.socialLinks.twitter && (
              <a
                href={`https://twitter.com/${metadata.socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-[#1DA1F2] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Twitter</p>
                  <p className="text-xs text-gray-500">@{metadata.socialLinks.twitter}</p>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {metadata.socialLinks.instagram && (
              <a
                href={`https://instagram.com/${metadata.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-[#E4405F] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-pink-50 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Instagram</p>
                  <p className="text-xs text-gray-500">@{metadata.socialLinks.instagram}</p>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {metadata.socialLinks.linkedin && (
              <a
                href={metadata.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-[#0A66C2] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">LinkedIn</p>
                  <p className="text-xs text-gray-500 truncate">{metadata.socialLinks.linkedin}</p>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Contributors section */}
      <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 mb-24">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Community Support</h2>

        {/* Contributor avatars */}
        {totalCount > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {contributors.map((contributorAddress, index) => {
                  const { profile } = useFarcasterProfile(contributorAddress);
                  return (
                    <div
                      key={contributorAddress}
                      className="relative w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
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
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  {contributors.length > 0 ? (
                    <>
                      Backed by{' '}
                      {contributors.slice(0, 2).map((addr, idx) => {
                        const { profile } = useFarcasterProfile(addr);
                        return (
                          <span key={addr}>
                            <span className="font-semibold text-gray-900">
                              {profile?.username ? `@${profile.username}` : `${addr.slice(0, 6)}...${addr.slice(-4)}`}
                            </span>
                            {idx === 0 && contributors.length > 1 && ', '}
                          </span>
                        );
                      })}
                      {hasMore && (
                        <span className="text-gray-600">
                          {' '}and {totalCount - contributors.length} other{totalCount - contributors.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-500">No contributors yet</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

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

      {/* Fixed Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-l-xl transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 1000 1000" fill="currentColor">
                <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z"/>
                <path d="M128.889 253.333L128.889 746.667H184.444V253.333H128.889Z"/>
                <path d="M815.556 253.333L815.556 746.667H871.111V253.333H815.556Z"/>
              </svg>
              Cast
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="px-3 py-3 bg-white border-2 border-l-0 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-r-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Link copied to clipboard!', 'success');
                    setShowShareMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="flex-[2] flex items-center justify-center px-4 py-3 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold rounded-xl transition-colors"
          >
            Donate
          </Link>
        ) : (
          <button
            disabled
            className="flex-[2] flex items-center justify-center px-4 py-3 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed"
          >
            {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
          </button>
        )}
      </div>
    </div>
  );
}
