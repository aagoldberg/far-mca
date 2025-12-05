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
import LoanUpdates from '@/components/LoanUpdates';
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

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

interface LoanMetadata {
  name?: string;
  description?: string;
  fullDescription?: string;
  businessWebsite?: string;
  imageUrl?: string;
  image?: string;
  loanDetails?: {
    aboutYou?: string;
    businessWebsite?: string;
    twitterHandle?: string;
    loanUseAndImpact?: string;
    repaymentPlan?: string;
  };
}

// Expandable text component
function ExpandableText({ text, maxLines = 4 }: { text: string; maxLines?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > 300;

  if (!shouldTruncate) {
    return <p className="text-gray-700 whitespace-pre-wrap leading-normal text-[15px]">{text}</p>;
  }

  return (
    <div>
      <p className={`text-gray-700 whitespace-pre-wrap leading-normal text-[15px] ${!isExpanded ? 'line-clamp-4' : ''}`}>
        {text}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-gray-900 font-medium underline underline-offset-4 hover:text-gray-600 transition-colors text-[15px] inline-flex items-center gap-1"
      >
        {isExpanded ? 'Show less' : 'Show more'}
        <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
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

  // Fetch Farcaster profile for borrower
  const { profile: borrowerProfile, isLoading: isProfileLoading } = useFarcasterProfile(
    loanData?.borrower as `0x${string}` | undefined
  );

  // Fetch metadata from IPFS
  useEffect(() => {
    if (loanData?.metadataURI) {
      setLoadingMetadata(true);

      const metadataUrl = loanData.metadataURI.startsWith('ipfs://')
        ? `${IPFS_GATEWAY}${loanData.metadataURI.replace('ipfs://', '')}`
        : loanData.metadataURI;

      fetch(metadataUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch metadata');
          return res.json();
        })
        .then(data => {
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = `${IPFS_GATEWAY}${data.image.replace('ipfs://', '')}`;
          }
          setMetadata(data);
        })
        .catch(err => {
          console.error('Error loading metadata:', err);
          setMetadata({ name: 'Community Loan', description: 'Metadata not available' });
        })
        .finally(() => {
          setLoadingMetadata(false);
        });
    }
  }, [loanData?.metadataURI]);

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        <div className="animate-pulse">
          <div className="h-[400px] bg-gray-100 rounded-xl mb-8" />
          <div className="h-8 bg-gray-100 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-full mb-2" />
          <div className="h-4 bg-gray-100 rounded w-5/6 mb-6" />
          <div className="h-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!loanData) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-8 text-center">
        <p className="text-red-500 mb-4">Loan not found</p>
        <Link href="/" className="text-brand-600 hover:underline">
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

  // Check if loan is defaulted
  const now = BigInt(Math.floor(Date.now() / 1000));
  const isLoanDefaulted = loanData.active && !loanData.completed && now > loanData.dueAt;

  // Calculate days left
  const daysLeft = loanData.fundraisingActive
    ? Math.max(0, Math.ceil((Number(loanData.fundraisingDeadline) - Date.now() / 1000) / 86400))
    : 0;

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
      setRepaymentAmount('');
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

  // Get image URL
  const imageUrl = (() => {
    const imageSource = metadata?.imageUrl || metadata?.image || '';
    return imageSource.startsWith('ipfs://')
      ? `${IPFS_GATEWAY}${imageSource.replace('ipfs://', '')}`
      : imageSource;
  })();

  // Contributor item component
  const ContributorItem = ({ address: contributorAddress }: { address: `0x${string}` }) => {
    const { profile } = useFarcasterProfile(contributorAddress);
    const { contribution: contribData } = useContribution(loanAddress, contributorAddress);

    return (
      <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
        {profile?.pfpUrl ? (
          <img
            src={profile.pfpUrl}
            alt={profile.displayName || 'Contributor'}
            className="w-10 h-10 rounded-full bg-gray-100 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
            {contributorAddress.slice(2, 4).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-gray-900 truncate">
            {profile?.displayName || profile?.username ? `@${profile.username}` : 'Anonymous'}
          </div>
          <div className="text-[12px] text-gray-500">
            ${contribData ? formatUSDC(contribData.amount) : '...'} USDC
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image - Full Bleed */}
      {imageUrl && (
        <div className="w-full">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20">
            <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] overflow-hidden md:rounded-xl md:mt-4 md:mb-0">
              <img
                src={imageUrl}
                alt={metadata?.name || 'Loan'}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 pt-4 pb-32 lg:pb-12">
        {/* Two Column Layout - 60/40 split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-3">
            {/* Title Section */}
            <div className="pb-6 border-b border-gray-200">
              <h1 className="text-[26px] md:text-[32px] font-semibold text-gray-900 leading-tight">
                {metadata?.name || 'Loading...'}
              </h1>
            </div>

            {/* Borrower Card */}
            <div className="py-6 border-b border-gray-200">
              <div className="flex items-start gap-4">
                {borrowerProfile?.pfp ? (
                  <img
                    src={borrowerProfile.pfp}
                    alt={borrowerProfile.displayName || borrowerProfile.username || 'Borrower'}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl flex-shrink-0">
                    {loanData.borrower.slice(2, 4).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-[16px] font-semibold text-gray-900 mb-1">
                    Organized by {borrowerProfile?.displayName || borrowerProfile?.username || `${loanData.borrower.slice(0, 6)}...${loanData.borrower.slice(-4)}`}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-500">
                    {isBorrower && <span className="text-brand-600 font-medium">You</span>}
                    {!isBorrower && <span>Borrower on LendFriend</span>}
                  </div>
                  {/* Verification badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {borrowerProfile && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[12px]">
                        <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified identity
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            {loanData && (
              <div className="py-6 border-b border-gray-200">
                <TrustSignals
                  borrowerAddress={loanData.borrower}
                  loanAddress={loanAddress}
                  businessWebsite={metadata?.loanDetails?.businessWebsite}
                  twitterHandle={metadata?.loanDetails?.twitterHandle}
                />
              </div>
            )}

            {/* Borrower Actions (Repayment) */}
            {isBorrower && loanData.active && !loanData.completed && (
              <div className="py-6 border-b border-gray-200">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <h3 className="text-[18px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Make a Repayment
                  </h3>

                  <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg">
                    <div>
                      <p className="text-[12px] text-gray-500 uppercase tracking-wide mb-1">Repaid</p>
                      <p className="text-[20px] font-bold text-brand-600">${formatUSDC(loanData.totalRepaid)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-gray-500 uppercase tracking-wide mb-1">Remaining</p>
                      <p className="text-[20px] font-bold text-gray-900">${formatUSDC(loanData.principal - loanData.totalRepaid)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Amount to repay"
                      value={repaymentAmount}
                      onChange={(e) => setRepaymentAmount(e.target.value)}
                      className="flex-1 px-4 py-3 text-[16px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {repaymentAmount && parseFloat(repaymentAmount) > 0 ? (
                      (!usdcAllowance || usdcAllowance < parseUnits(repaymentAmount, USDC_DECIMALS)) ? (
                        <button
                          onClick={handleApprove}
                          disabled={isApprovePending || isApproveConfirming}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all active:scale-[0.98]"
                        >
                          {isApprovePending || isApproveConfirming ? '...' : 'Approve'}
                        </button>
                      ) : (
                        <button
                          onClick={handleRepay}
                          disabled={isRepayPending || isRepayConfirming}
                          className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all active:scale-[0.98]"
                        >
                          {isRepayPending || isRepayConfirming ? '...' : 'Repay'}
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* Borrower Actions (Disburse) */}
            {isFunded && !loanData.active && isBorrower && (
              <div className="py-6 border-b border-gray-200">
                <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold text-gray-900">Goal Reached!</h3>
                      <p className="text-[14px] text-gray-600">Your loan is fully funded. Claim your funds below.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => disburseLoan(loanAddress)}
                    disabled={isDisbursePending || isDisburseConfirming}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-lg transition-all active:scale-[0.98] text-[16px]"
                  >
                    {isDisbursePending || isDisburseConfirming ? 'Processing...' : `Claim $${formatUSDC(loanData.principal)} USDC`}
                  </button>
                </div>
              </div>
            )}

            {/* Refund Action */}
            {refundAvailable && (
              <div className="py-6 border-b border-gray-200">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                  <h3 className="text-[18px] font-semibold text-gray-900 mb-2">Refund Available</h3>
                  <p className="text-[14px] text-gray-600 mb-4">This loan did not reach its goal. You can claim a full refund.</p>
                  <button
                    onClick={handleRefund}
                    disabled={isRefundPending || isRefundConfirming}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all active:scale-[0.98]"
                  >
                    {isRefundPending || isRefundConfirming ? 'Processing...' : `Claim $${formatUSDC(contribution!.amount)} Refund`}
                  </button>
                </div>
              </div>
            )}

            {/* About the Business */}
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-[16px] font-medium text-gray-900 mb-3">About the Business</h2>
              {metadata?.loanDetails?.aboutYou || metadata?.description ? (
                <ExpandableText text={metadata?.loanDetails?.aboutYou || metadata?.description || ''} />
              ) : (
                <p className="text-gray-400 italic text-[16px]">No information provided</p>
              )}
              {metadata?.loanDetails?.businessWebsite && (
                <a
                  href={metadata.loanDetails.businessWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-gray-900 font-semibold underline underline-offset-2 hover:text-gray-700 transition-colors text-[14px]"
                >
                  Visit Website
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Use of Funds */}
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-[16px] font-medium text-gray-900 mb-3">Use of Funds</h2>
              {metadata?.loanDetails?.loanUseAndImpact ? (
                <ExpandableText text={metadata.loanDetails.loanUseAndImpact} />
              ) : (
                <p className="text-gray-400 italic text-[16px]">No plan provided</p>
              )}
            </div>

            {/* Loan Updates */}
            <div className="py-6 border-b border-gray-200">
              <LoanUpdates loanAddress={loanAddress} />
            </div>

            {/* Loan Terms - Airbnb Style */}
            <div className="py-6">
              <h2 className="text-[16px] font-medium text-gray-900 mb-4">Loan Details</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">0% interest rate</div>
                    <div className="text-[14px] text-gray-500">Pay back exactly what you borrow</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">1.0x repayment</div>
                    <div className="text-[14px] text-gray-500">Full principal returned to lenders</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">Due {formatDate(loanData.dueAt)}</div>
                    <div className="text-[14px] text-gray-500">Repayment deadline for this loan</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">Fundraising ends {formatDate(loanData.fundraisingDeadline)}</div>
                    <div className="text-[14px] text-gray-500">Last day to contribute to this loan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar - Right Column */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-[22px] font-semibold text-gray-900">${formatUSDC(loanData.totalFunded)}</span>
                    <span className="text-[15px] text-gray-500 font-normal">of ${formatUSDC(loanData.principal)} goal</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-brand-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-5">
                  {loanData.fundraisingActive && !isFunded ? (
                    <Link
                      href={`/loan/${loanAddress}/fund`}
                      className="block w-full text-center px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-[16px] font-semibold rounded-full transition-all active:scale-[0.98]"
                    >
                      Fund this Loan
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center px-6 py-3.5 bg-gray-100 text-gray-400 text-[16px] font-semibold rounded-full cursor-not-allowed"
                    >
                      {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
                    </button>
                  )}

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="block w-full text-center px-6 py-3.5 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-full transition-all active:scale-[0.98]"
                  >
                    Share
                  </button>
                </div>

                {/* Stats below buttons */}
                <div className="text-[13px] text-gray-500 text-center mb-4">
                  <span className="font-medium text-gray-700">{loanData.contributorsCount.toString()}</span> {Number(loanData.contributorsCount) === 1 ? 'backer' : 'backers'}
                  {loanData.fundraisingActive && daysLeft > 0 && (
                    <span className="mx-2">·</span>
                  )}
                  {loanData.fundraisingActive && daysLeft > 0 && (
                    <><span className="font-medium text-gray-700">{daysLeft}</span> days left</>
                  )}
                </div>

                {/* Recent Contributors */}
                {contributors && contributors.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Supporters</h3>
                    <div className="space-y-0 max-h-48 overflow-y-auto">
                      {contributors.map((contributorAddress) => (
                        <ContributorItem key={contributorAddress} address={contributorAddress} />
                      ))}
                    </div>
                    {totalCount > 10 && (
                      <button className="w-full mt-3 text-[13px] font-semibold text-gray-600 hover:text-gray-900">
                        See all {totalCount} supporters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-3 z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-between gap-4">
          {/* Price Summary */}
          <div className="flex-shrink-0">
            <div className="text-[16px] font-bold text-gray-900">${formatUSDC(loanData.totalFunded)}</div>
            <div className="text-[12px] text-gray-500">of ${formatUSDC(loanData.principal)}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full active:scale-[0.98]"
            >
              Share
            </button>

            {loanData.fundraisingActive && !isFunded ? (
              <Link
                href={`/loan/${loanAddress}/fund`}
                className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-full active:scale-[0.98]"
              >
                Fund
              </Link>
            ) : (
              <button
                disabled
                className="px-6 py-3 bg-gray-100 text-gray-400 font-semibold rounded-full"
              >
                {isFunded ? 'Funded' : 'Closed'}
              </button>
            )}
          </div>
        </div>
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
