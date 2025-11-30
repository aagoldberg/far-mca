"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ShareIcon, HeartIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useMiniAppWallet } from "@/hooks/useMiniAppWallet";
import { useLoanWithMetadata } from "@/hooks/useLoansWithMetadata";
import { useLoanContributors } from "@/hooks/useLoanContributors";
import ShareModal from "@/components/ShareModal";
import LoanUpdates from "@/components/LoanUpdates";
import PostUpdateModal from "@/components/PostUpdateModal";
import type { LoanShareData } from "@/utils/shareUtils";

interface MobileLoanDetailsProps {
  loanAddress: `0x${string}`;
}

export default function MobileLoanDetails({ loanAddress }: MobileLoanDetailsProps) {
  const router = useRouter();
  const { isConnected, connect, address } = useMiniAppWallet();
  const [isLiked, setIsLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPostUpdateModalOpen, setIsPostUpdateModalOpen] = useState(false);

  // ✅ REAL DATA: Fetch loan from blockchain + IPFS
  const { loan, isLoading } = useLoanWithMetadata(loanAddress);
  const { contributors, isLoading: isLoadingContributors } = useLoanContributors(loanAddress);

  // Loading state
  if (isLoading || !loan) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C7A7B] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading loan details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate values from real loan data
  const progress = loan.progress || 0;

  // Prepare loan data for ShareModal
  const loanShareData: LoanShareData = {
    id: loan.address,
    title: loan.title || loan.name || 'Community Loan',
    borrower: loan.creator || loan.borrower,
    description: loan.description || '',
    image: loan.imageUrl || loan.image,
    principal: loan.goal || 0,
    totalFunded: loan.raised || 0,
    progressPercentage: progress,
  };

  const handleFund = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    router.push(`/loan/${loanAddress}/fund`);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handlePostUpdate = async (update: {
    title: string;
    content: string;
    updateType: string;
    images: File[];
  }) => {
    // TODO: Implement IPFS upload and smart contract call
    console.log('Posting update:', update);

    // This would:
    // 1. Upload images to IPFS
    // 2. Create metadata JSON with all update info
    // 3. Upload metadata to IPFS
    // 4. Call smart contract postUpdate(metadataURI)
    // 5. Wait for transaction confirmation
    // 6. Refresh updates list

    alert('Update posting is not yet implemented. Requires smart contract deployment.');
  };

  // Check if current user is the borrower
  const isBorrower = address && loan && address.toLowerCase() === (loan.borrower || loan.creator)?.toLowerCase();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Like"
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Share"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Hero Image */}
        {loan.imageUrl && (
          <div className="relative h-48 bg-gray-200">
            <img
              src={loan.imageUrl}
              alt={loan.title || loan.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Title and Creator */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {loan.title || loan.name || 'Community Loan'}
            </h1>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] flex items-center justify-center text-white font-semibold text-sm">
                {(loan.creator || loan.borrower)?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  @{loan.creator || loan.borrower?.slice(0, 8)}
                </p>
                <p className="text-xs text-gray-500">Verified member</p>
              </div>
            </div>
          </div>

          {/* Progress Card - Redesigned */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            {/* Amount Raised */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-[#2C7A7B] to-[#3B9B7F] bg-clip-text text-transparent">
                  ${loan.raised?.toLocaleString() || '0'}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  raised
                </span>
              </div>
              <p className="text-sm text-gray-600">
                of <span className="font-semibold">${loan.goal?.toLocaleString() || '0'}</span> goal
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-4 relative overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#2C7A7B] to-[#3B9B7F] relative overflow-hidden transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              {/* Progress percentage badge */}
              {progress > 0 && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <span className="text-xs font-bold text-white/90 px-1.5 py-0.5 bg-black/20 rounded-full">
                    {Math.round(progress)}%
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2C7A7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-lg font-bold text-gray-900">{loan.contributorsCount || 0}</p>
                  <p className="text-xs text-gray-500 -mt-0.5">
                    {loan.contributorsCount === 1 ? 'supporter' : 'supporters'}
                  </p>
                </div>
              </div>

              {loan.daysLeft !== undefined && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#2C7A7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{loan.daysLeft}</p>
                    <p className="text-xs text-gray-500 -mt-0.5">
                      {loan.daysLeft === 1 ? 'day left' : 'days left'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About Me Section */}
          {loan.fullDescription && (() => {
            // Parse fullDescription to extract the "About You" part
            const parts = loan.fullDescription.split('\n\n**What I\'ll achieve');
            const aboutMe = parts[0] || loan.fullDescription;

            return (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">About Me</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {aboutMe}
                </p>
              </div>
            );
          })()}

          {/* Loan Use & Impact Section */}
          {loan.fullDescription && (() => {
            // Parse fullDescription to extract the "What I'll achieve" part
            const parts = loan.fullDescription.split('\n\n**What I\'ll achieve and how I\'ll pay it back:**\n');
            if (parts.length > 1) {
              const loanUse = parts[1];
              return (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">
                    What I'll Achieve & How I'll Pay It Back
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {loanUse}
                  </p>
                </div>
              );
            }
            return null;
          })()}

          {/* Loan Updates */}
          <LoanUpdates loanAddress={loanAddress} borrowerAddress={loan.borrower} />

          {/* Post Update Button - Only visible to borrower */}
          {isBorrower && (
            <button
              onClick={() => setIsPostUpdateModalOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-[#2C7A7B] to-[#3B9B7F] text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post Update for Supporters
            </button>
          )}

          {/* Contributors Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Contributors ({contributors.length})
            </h2>

            {isLoadingContributors ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                      <div className="h-3 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : contributors.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No contributors yet</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to support this loan!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contributors.map((contributor) => {
                  const displayName = contributor.username || 'anonymous';
                  const isAnonymous = !contributor.username;
                  const amount = Number(contributor.amount) / 1e6; // Convert from USDC wei to dollars

                  return (
                    <div key={contributor.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        isAnonymous
                          ? 'bg-gray-400'
                          : 'bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68]'
                      }`}>
                        {isAnonymous ? '?' : displayName.slice(0, 2).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isAnonymous ? 'text-gray-500 italic' : 'text-gray-900'}`}>
                          {isAnonymous ? displayName : `@${displayName}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(contributor.timestamp * 1000).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#2C7A7B]">
                          ${amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe z-10">
        <div className="flex gap-3">
          <button
            onClick={handleFund}
            className="py-3 bg-[#2C7A7B] text-white rounded-lg font-medium"
            style={{ flex: '0 0 75%' }}
          >
            {isConnected ? "Fund this loan" : "Sign in to Fund"}
          </button>
          <button
            onClick={handleShare}
            className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-200 transition-colors"
            style={{ flex: '0 0 calc(25% - 12px)' }}
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          Min. contribution $5 · Max. ${(loan.goal - loan.raised).toLocaleString()}
        </p>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        loan={loanShareData}
      />

      {/* Post Update Modal */}
      <PostUpdateModal
        isOpen={isPostUpdateModalOpen}
        onClose={() => setIsPostUpdateModalOpen(false)}
        onSubmit={handlePostUpdate}
      />
    </div>
  );
}