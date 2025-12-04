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

  // Fetch Farcaster profile for borrower - MUST be before early returns
  const { profile: borrowerProfile, isLoading: isProfileLoading } = useFarcasterProfile(
    loanData?.borrower as `0x${string}` | undefined
  );

  // Fetch metadata from IPFS with caching
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
          // Convert IPFS image URL if needed
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = `${IPFS_GATEWAY}${data.image.replace('ipfs://', '')}`;
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

  // Check if loan is defaulted (active, not completed, and past due date)
  const now = BigInt(Math.floor(Date.now() / 1000));
  const isLoanDefaulted = loanData.active && !loanData.completed && now > loanData.dueAt;

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
      <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
        {profile?.pfpUrl ? (
          <img
            src={profile.pfpUrl}
            alt={profile.displayName || 'Contributor'}
            className="w-10 h-10 rounded-full bg-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
            {contributorAddress.slice(2, 4).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-900 truncate">
            {profile?.displayName || profile?.username ? `@${profile.username}` : 'Anonymous'}
          </div>
          <div className="text-xs text-gray-500">
            ${contribData ? formatUSDC(contribData.amount) : '...'} USDC
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32 lg:pb-12">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center text-secondary-600 hover:text-secondary-800 mb-6 text-sm font-bold transition-colors">
        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Loans
      </Link>

      {/* Grid layout with main content and sticky sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">

          {/* Loan Image */}
          {(metadata?.imageUrl || metadata?.image) && (
            <div className="relative w-full rounded-3xl overflow-hidden mb-8 bg-gray-50 shadow-sm border border-gray-100" style={{ paddingBottom: '56.25%' }}>
              <img
                src={(() => {
                  const imageSource = metadata.imageUrl || metadata.image || '';
                  return imageSource.startsWith('ipfs://')
                    ? `${IPFS_GATEWAY}${imageSource.replace('ipfs://', '')}`
                    : imageSource;
                })()}
                alt={metadata?.name || 'Loan'}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          )}

          {/* Title and Borrower */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {loanData.completed ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wide">
                  Completed
                </span>
              ) : loanData.active && !loanData.completed ? (
                <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-xs font-bold uppercase tracking-wide">
                  Active Loan
                </span>
              ) : loanData.fundraisingActive ? (
                <span className="px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-bold uppercase tracking-wide animate-pulse">
                  Fundraising
                </span>
              ) : isLoanDefaulted ? (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-wide">
                  Defaulted
                </span>
              ) : null}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {metadata?.name || 'Loading...'}
            </h1>

            {/* Borrower Info */}
            <div className="flex items-center gap-4">
              {borrowerProfile?.pfp ? (
                <img
                  src={borrowerProfile.pfp}
                  alt={borrowerProfile.displayName || borrowerProfile.username || 'Borrower'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-500 font-bold text-sm">
                  {loanData.borrower.slice(2, 4).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm text-gray-500 font-medium">Organized by</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-lg">
                    {borrowerProfile?.displayName || borrowerProfile?.username || `${loanData.borrower.slice(0, 6)}...${loanData.borrower.slice(-4)}`}
                  </span>
                  {isBorrower && (
                    <span className="text-xs bg-secondary-100 text-secondary-800 px-2 py-0.5 rounded font-bold">You</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Borrower Actions (Repayment) */}
          {isBorrower && loanData.active && !loanData.completed && (
            <div className="bg-secondary-50 border border-secondary-100 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Make a Repayment
              </h3>
              
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-secondary-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Repaid so far</p>
                  <p className="text-xl font-bold text-brand-600">${formatUSDC(loanData.totalRepaid)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Remaining</p>
                  <p className="text-xl font-bold text-gray-900">${formatUSDC(loanData.principal - loanData.totalRepaid)}</p>
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
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
                {repaymentAmount && parseFloat(repaymentAmount) > 0 ? (
                  (!usdcAllowance || usdcAllowance < parseUnits(repaymentAmount, USDC_DECIMALS)) ? (
                    <button
                      onClick={handleApprove}
                      disabled={isApprovePending || isApproveConfirming}
                      className="bg-secondary-600 hover:bg-secondary-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                    >
                      {isApprovePending || isApproveConfirming ? '...' : 'Approve'}
                    </button>
                  ) : (
                    <button
                      onClick={handleRepay}
                      disabled={isRepayPending || isRepayConfirming}
                      className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                    >
                      {isRepayPending || isRepayConfirming ? '...' : 'Repay'}
                    </button>
                  )
                ) : null}
              </div>
            </div>
          )}

          {/* Borrower Actions (Disburse/Refund) */}
          {isFunded && !loanData.active && isBorrower && (
            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-900">Goal Reached!</h3>
                  <p className="text-brand-700">Your loan is fully funded. You can now claim your funds.</p>
                </div>
              </div>
              <button
                onClick={() => disburseLoan(loanAddress)}
                disabled={isDisbursePending || isDisburseConfirming}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-sm"
              >
                {isDisbursePending || isDisburseConfirming ? 'Processing...' : `Claim $${formatUSDC(loanData.principal)} USDC`}
              </button>
            </div>
          )}

          {/* Refund Action */}
          {refundAvailable && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-orange-900 mb-2">Refund Available</h3>
              <p className="text-orange-800 mb-4">This loan did not reach its goal. You can claim a full refund of your contribution.</p>
              <button
                onClick={handleRefund}
                disabled={isRefundPending || isRefundConfirming}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                {isRefundPending || isRefundConfirming ? 'Processing...' : `Claim $${formatUSDC(contribution!.amount)} Refund`}
              </button>
            </div>
          )}

          {/* Trust & Verification */}
          {loanData && (
            <div className="mb-8">
              <TrustSignals
                borrowerAddress={loanData.borrower}
                loanAddress={loanAddress}
                businessWebsite={metadata?.loanDetails?.businessWebsite}
                twitterHandle={metadata?.loanDetails?.twitterHandle}
              />
            </div>
          )}

          {/* About the Borrower */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About the Business</h2>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                {metadata?.loanDetails?.aboutYou || metadata?.description || (
                  <span className="text-gray-400 italic">No information provided</span>
                )}
              </p>
              {metadata?.loanDetails?.businessWebsite && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <a
                    href={metadata.loanDetails.businessWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-700 transition-colors border border-gray-200"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* How I'll Use This Loan */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Use of Funds</h2>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                {metadata?.loanDetails?.loanUseAndImpact || (
                  <span className="text-gray-400 italic">No plan provided</span>
                )}
              </p>
            </div>
          </div>

          {/* Loan Terms */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Repayment Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Interest</p>
                <p className="text-xl font-bold text-brand-600">0%</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Repayment</p>
                <p className="text-xl font-bold text-gray-900">1.0x</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Maturity</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(loanData.dueAt)}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(loanData.fundraisingDeadline)}</p>
              </div>
            </div>
          </div>

          {/* Loan Updates */}
          <div className="mb-8">
            <LoanUpdates loanAddress={loanAddress} />
          </div>

        </div>

        {/* Sticky Sidebar (Desktop Only) */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl shadow-gray-100">
              {/* Progress Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-gray-900">${formatUSDC(loanData.totalFunded)}</span>
                  <span className="text-gray-500 font-medium">raised of ${formatUSDC(loanData.principal)} goal</span>
                </div>
                
                <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="absolute top-0 left-0 h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>{loanData.contributorsCount.toString()} backers</span>
                  <span>{Math.round(progressPercentage)}% funded</span>
                </div>
              </div>

              {/* Donate Button */}
              <div className="space-y-3 mb-6">
                {loanData.fundraisingActive && !isFunded ? (
                  <Link
                    href={`/loan/${loanAddress}/fund`}
                    className="block w-full text-center px-6 py-4 bg-brand-600 hover:bg-brand-700 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Fund this Loan
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full text-center px-6 py-4 bg-gray-100 text-gray-400 text-lg font-bold rounded-xl cursor-not-allowed"
                  >
                    {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
                  </button>
                )}

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="block w-full text-center px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Share Request
                </button>
              </div>

              {/* Recent Contributors */}
              {contributors && contributors.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Recent Supporters</h3>
                  <div className="space-y-1 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                    {contributors.map((contributorAddress) => (
                      <ContributorItem key={contributorAddress} address={contributorAddress} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Menu (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] px-4 py-4 z-40">
        <div className="max-w-4xl mx-auto flex gap-3">
           <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl"
          >
            Share
          </button>

          {loanData.fundraisingActive && !isFunded ? (
            <Link
              href={`/loan/${loanAddress}/fund`}
              className="flex-[2] flex items-center justify-center px-4 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-md"
            >
              Fund Loan
            </Link>
          ) : (
            <button
              disabled
              className="flex-[2] px-4 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl"
            >
              {isFunded ? 'Funded' : 'Closed'}
            </button>
          )}
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
