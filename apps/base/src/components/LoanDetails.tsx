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
function ExpandableText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > 200;

  if (!shouldTruncate) {
    return <p className="text-gray-700 whitespace-pre-wrap leading-normal text-[15px]">{text}</p>;
  }

  return (
    <div>
      <p className={`text-gray-700 whitespace-pre-wrap leading-normal text-[15px] ${!isExpanded ? 'line-clamp-3' : ''}`}>
        {text}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-gray-900 font-medium underline underline-offset-4 hover:text-gray-600 transition-colors text-[14px] inline-flex items-center gap-1"
      >
        {isExpanded ? 'Show less' : 'Show more'}
        <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

// Updated status badges
const getStatusBadge = (loanData: any) => {
  if (loanData.completed) {
    return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Completed</span>;
  }
  if (loanData.active) {
    return <span className="px-2.5 py-0.5 bg-blue-50 text-base-blue rounded-full text-xs font-medium">Repaying</span>;
  }
  if (loanData.fundraisingActive) {
    return <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-full text-xs font-medium">Fundraising</span>;
  }
  return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Closed</span>;
};

export default function LoanDetails({ loanAddress }: LoanDetailsProps) {
  const { loanData, isLoading } = useLoanData(loanAddress);
  const { address: userAddress } = useAccount();
  const [metadata, setMetadata] = useState<LoanMetadata | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Hooks for interactions
  const { contribution } = useContribution(loanAddress, userAddress);
  const { contributors, totalCount } = useContributors(loanAddress, 10);

  // Farcaster profile
  const { profile: borrowerProfile } = useFarcasterProfile(loanData?.borrower as `0x${string}` | undefined);

  useEffect(() => {
    if (loanData?.metadataURI) {
      const metadataUrl = loanData.metadataURI.startsWith('ipfs://')
        ? `${IPFS_GATEWAY}${loanData.metadataURI.replace('ipfs://', '')}`
        : loanData.metadataURI;

      fetch(metadataUrl)
        .then(res => res.json())
        .then(data => {
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = `${IPFS_GATEWAY}${data.image.replace('ipfs://', '')}`;
          }
          setMetadata(data);
        })
        .catch(err => console.error('Error loading metadata:', err));
    }
  }, [loanData?.metadataURI]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-64 bg-gray-100 rounded-2xl" />
        <div className="h-8 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
      </div>
    );
  }

  if (!loanData) return <div className="text-center py-12">Loan not found</div>;

  const totalFundedNum = parseFloat(formatUnits(loanData.totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(loanData.principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;
  const isFunded = loanData.totalFunded >= loanData.principal;

  // Calculate days left
  const daysLeft = Math.max(0, Math.ceil((Number(loanData.fundraisingDeadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-base-black mb-4 transition-colors text-sm font-medium">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-0">
          {/* Image */}
          {(metadata?.imageUrl || metadata?.image) && (
            <div className="rounded-xl overflow-hidden bg-gray-50 aspect-[16/9] relative mb-5">
              <img
                src={metadata.imageUrl || metadata.image}
                alt={metadata?.name || 'Loan'}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
          )}

          {/* Header */}
          <div className="pb-5 border-b border-gray-200/60">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(loanData)}
            </div>
            <h1 className="text-xl font-semibold text-base-black leading-tight mb-3">
              {metadata?.name || 'Community Loan'}
            </h1>
            <div className="flex items-center gap-3">
              {borrowerProfile?.pfp ? (
                <img
                  src={borrowerProfile.pfp}
                  alt={borrowerProfile.displayName || 'Borrower'}
                  className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <span className="text-sm font-bold">{loanData.borrower.slice(2, 4).toUpperCase()}</span>
                </div>
              )}
              <div>
                <div className="text-[15px] font-medium text-base-black">
                  {borrowerProfile?.displayName || borrowerProfile?.username || `${loanData.borrower.slice(0, 6)}...${loanData.borrower.slice(-4)}`}
                </div>
                <div className="text-[13px] text-gray-500">Borrower</div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="py-5 border-b border-gray-200/60">
            <h2 className="text-[16px] font-medium text-base-black mb-3">About</h2>
            <ExpandableText text={metadata?.description || metadata?.loanDetails?.aboutYou || 'No description provided.'} />
          </div>

          {/* Use of Funds */}
          {metadata?.loanDetails?.loanUseAndImpact && (
            <div className="py-5 border-b border-gray-200/60">
              <h2 className="text-[16px] font-medium text-base-black mb-3">Use of Funds</h2>
              <ExpandableText text={metadata.loanDetails.loanUseAndImpact} />
            </div>
          )}

          {/* Trust Signals */}
          <div className="py-5 border-b border-gray-200/60">
            <TrustSignals
              borrowerAddress={loanData.borrower}
              loanAddress={loanAddress}
              businessWebsite={metadata?.loanDetails?.businessWebsite}
              twitterHandle={metadata?.loanDetails?.twitterHandle}
            />
          </div>

          {/* Loan Details - Airbnb Style */}
          <div className="py-5">
            <h2 className="text-[16px] font-medium text-base-black mb-4">Loan Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                <div>
                  <div className="text-[14px] font-medium text-base-black">0% interest rate</div>
                  <div className="text-[13px] text-gray-500">Pay back exactly what you borrow</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-[14px] font-medium text-base-black">1.0x repayment</div>
                  <div className="text-[13px] text-gray-500">Full principal returned to lenders</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-[14px] font-medium text-base-black">{Math.round(Number(loanData.loanDuration) / (86400 * 7))} week term</div>
                  <div className="text-[13px] text-gray-500">Duration of the loan</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <div>
                  <div className="text-[14px] font-medium text-base-black">Fundraising ends {new Date(Number(loanData.fundraisingDeadline) * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                  <div className="text-[13px] text-gray-500">Last day to contribute</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Funding Card */}
        <div className="md:col-span-1 hidden md:block">
          <div className="sticky top-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[24px] font-bold text-base-black">${formatUSDC(loanData.totalFunded)}</span>
                  <span className="text-gray-500 text-[13px]">of ${formatUSDC(loanData.principal)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-base-blue transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 mb-3">
                {loanData.fundraisingActive && !isFunded ? (
                  <Link
                    href={`/loan/${loanAddress}/fund`}
                    className="block w-full py-3 px-4 bg-base-blue hover:opacity-90 text-white text-center font-semibold rounded-lg transition-all active:scale-[0.98]"
                  >
                    Fund this Loan
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full py-3 px-4 bg-gray-100 text-gray-400 text-center font-semibold rounded-lg cursor-not-allowed"
                  >
                    {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
                  </button>
                )}

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="block w-full py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-center font-semibold rounded-lg transition-colors"
                >
                  Share
                </button>
              </div>

              {/* Stats below buttons */}
              <div className="text-[13px] text-gray-500 text-center">
                <span className="font-medium text-gray-700">{loanData.contributorsCount.toString()}</span> {Number(loanData.contributorsCount) === 1 ? 'backer' : 'backers'}
                {loanData.fundraisingActive && daysLeft > 0 && (
                  <>
                    <span className="mx-2">·</span>
                    <span className="font-medium text-gray-700">{daysLeft}</span> days left
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 md:hidden safe-area-bottom z-10">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="text-[15px] font-bold text-base-black">${formatUSDC(loanData.totalFunded)}</div>
            <div className="text-[11px] text-gray-500">of ${formatUSDC(loanData.principal)}</div>
          </div>
          <div className="flex flex-1 gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-base-black font-semibold rounded-lg transition-colors"
            >
              Share
            </button>
            {loanData.fundraisingActive && !isFunded ? (
              <Link
                href={`/loan/${loanAddress}/fund`}
                className="flex-1 py-2.5 px-4 bg-base-blue hover:opacity-90 text-white text-center font-semibold rounded-lg transition-colors"
              >
                Fund
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-400 font-semibold rounded-lg cursor-not-allowed"
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
