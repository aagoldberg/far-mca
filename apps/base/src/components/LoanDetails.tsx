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

// Updated status badges using Base design system
const getStatusBadge = (loanData: any) => {
  if (loanData.completed) {
    return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">Completed</span>;
  }
  if (loanData.active) {
    return <span className="px-3 py-1 bg-blue-50 text-base-blue rounded-full text-sm font-medium border border-blue-100">Repaying</span>;
  }
  if (loanData.fundraisingActive) {
    return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium border border-green-100">Fundraising</span>;
  }
  return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">Closed</span>;
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-base-black mb-6 transition-colors font-medium">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
               {borrowerProfile?.pfp ? (
                <img
                  src={borrowerProfile.pfp}
                  alt={borrowerProfile.displayName || 'Borrower'}
                  className="w-12 h-12 rounded-xl bg-gray-200 object-cover border border-gray-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                  <span className="text-lg font-bold">{loanData.borrower.slice(2, 4).toUpperCase()}</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-base-black leading-tight">
                  {metadata?.name || 'Community Loan'}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>by</span>
                  <span className="font-medium text-base-black">
                    {borrowerProfile?.displayName || borrowerProfile?.username || `${loanData.borrower.slice(0, 6)}...`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {getStatusBadge(loanData)}
            </div>
          </div>

          {/* Image */}
          {(metadata?.imageUrl || metadata?.image) && (
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video relative">
              <img
                src={metadata.imageUrl || metadata.image}
                alt={metadata?.name || 'Loan'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-blue max-w-none">
            <h3 className="text-lg font-semibold text-base-black mb-2">About</h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {metadata?.description || metadata?.loanDetails?.aboutYou || 'No description provided.'}
            </p>
            
            {metadata?.loanDetails?.loanUseAndImpact && (
              <>
                <h3 className="text-lg font-semibold text-base-black mt-6 mb-2">Impact</h3>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {metadata.loanDetails.loanUseAndImpact}
                </p>
              </>
            )}
          </div>

          {/* Trust Signals */}
          <div className="border-t border-gray-200 pt-6">
             <TrustSignals
                borrowerAddress={loanData.borrower}
                loanAddress={loanAddress}
                businessWebsite={metadata?.loanDetails?.businessWebsite}
                twitterHandle={metadata?.loanDetails?.twitterHandle}
              />
          </div>
        </div>

        {/* Sidebar / Funding Card */}
        <div className="md:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold text-base-black">${formatUSDC(loanData.totalFunded)}</span>
                  <span className="text-gray-500 text-sm font-medium">of ${formatUSDC(loanData.principal)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-base-blue transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{Math.round(progressPercentage)}% funded</span>
                  <span>{loanData.contributorsCount.toString()} backers</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {loanData.fundraisingActive && !isFunded ? (
                  <Link
                    href={`/loan/${loanAddress}/fund`}
                    className="block w-full py-3.5 px-4 bg-base-blue hover:opacity-90 text-white text-center font-bold rounded-xl transition-all active:scale-[0.98]"
                  >
                    Fund this Loan
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full py-3.5 px-4 bg-gray-100 text-gray-400 text-center font-bold rounded-xl cursor-not-allowed"
                  >
                    {isFunded ? 'Fully Funded' : 'Fundraising Closed'}
                  </button>
                )}
                
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="block w-full py-3.5 px-4 bg-white border border-gray-200 hover:bg-blue-50 text-base-blue text-center font-semibold rounded-xl transition-colors"
                >
                  Share
                </button>
              </div>

              {/* Terms Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Interest</p>
                  <p className="text-lg font-bold text-base-black">0%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Repayment</p>
                  <p className="text-lg font-bold text-base-black">1.0x</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Term</p>
                  <p className="text-lg font-bold text-base-black">{Math.round(Number(loanData.loanDuration) / (86400 * 7))} weeks</p>
                </div>
                 <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Deadline</p>
                  <p className="text-lg font-bold text-base-black">{new Date(Number(loanData.fundraisingDeadline) * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden safe-area-bottom z-10">
         <div className="flex gap-3">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-base-black font-bold rounded-xl transition-colors"
            >
              Share
            </button>
            {loanData.fundraisingActive && !isFunded ? (
              <Link
                href={`/loan/${loanAddress}/fund`}
                className="flex-[2] py-3 px-4 bg-base-blue hover:opacity-90 text-white text-center font-bold rounded-xl transition-colors"
              >
                Fund
              </Link>
            ) : (
               <button
                disabled
                className="flex-[2] py-3 px-4 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed"
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
