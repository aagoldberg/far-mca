'use client';

import { useLoanData, useContribution, useContributors, useRefund, useRepay, calculateRepaymentProgress } from '@/hooks/useMicroLoan';
import { useUSDCBalance, useUSDCAllowance, useUSDCApprove } from '@/hooks/useUSDC';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { formatUnits, parseUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useState, useEffect } from 'react';
import { fetchFromIPFS } from '@/lib/ipfs';

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

  // Check if refund is available
  // Refunds available if: loan not active AND (fundraising deadline passed without full funding OR cancelled)
  const now = BigInt(Math.floor(Date.now() / 1000));
  const fundraisingExpired = now > loanData.fundraisingDeadline;
  const refundAvailable = !loanData.active && contribution && contribution.amount > 0n &&
    ((!isFunded && fundraisingExpired) || (!loanData.fundraisingActive && !isFunded));

  const handleRefund = async () => {
    if (!loanAddress) return;
    try {
      await requestRefund(loanAddress);
    } catch (error) {
      console.error('Error requesting refund:', error);
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
    }
  };

  const handleRepay = async () => {
    if (!loanAddress || !repaymentAmount) return;
    try {
      const amount = parseUnits(repaymentAmount, USDC_DECIMALS);
      await repay(loanAddress, amount);
    } catch (error) {
      console.error('Error making repayment:', error);
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
              {currentDueDate && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Next Payment Due:</span>
                    <span className="font-medium text-gray-900">{formatDate(currentDueDate as bigint)}</span>
                  </div>
                  {perPeriodPrincipal && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-700">Payment Amount:</span>
                      <span className="font-medium text-gray-900">${formatUSDC(perPeriodPrincipal as bigint)} USDC</span>
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
        <button
          onClick={() => {
            // Share functionality using Web Share API if available
            if (navigator.share) {
              navigator.share({
                title: metadata?.name || 'Support a Community Loan',
                text: `Help support this community loan on LendFriend`,
                url: window.location.href,
              }).catch(err => console.log('Share cancelled', err));
            } else {
              // Fallback: copy to clipboard
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>

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
