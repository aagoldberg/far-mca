"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ShareIcon, HeartIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useMiniAppWallet } from "@/hooks/useMiniAppWallet";
import { useLoanWithMetadata } from "@/hooks/useLoansWithMetadata";
import ShareModal from "@/components/ShareModal";
import type { LoanShareData } from "@/utils/shareUtils";

interface MobileLoanDetailsProps {
  loanAddress: `0x${string}`;
}

export default function MobileLoanDetails({ loanAddress }: MobileLoanDetailsProps) {
  const router = useRouter();
  const { isConnected, connect } = useMiniAppWallet();
  const [isLiked, setIsLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // ✅ REAL DATA: Fetch loan from blockchain + IPFS
  const { loan, isLoading } = useLoanWithMetadata(loanAddress);

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
  const weeklyPayment = loan.principal ? (Number(loan.principal) / 1e6 / 12).toFixed(2) : '0'; // Assuming 12 weeks

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
              className="w-full h-full object-cover"
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

          {/* Progress Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-2xl font-bold text-[#2C7A7B]">
                ${loan.raised?.toLocaleString() || '0'}
              </span>
              <span className="text-sm text-gray-500">
                of ${loan.goal?.toLocaleString() || '0'}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-[#2C7A7B] to-[#3B9B7F] relative overflow-hidden"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold">{loan.contributorsCount || 0}</p>
                <p className="text-xs text-gray-500">backers</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{loan.daysLeft || 0}</p>
                <p className="text-xs text-gray-500">days left</p>
              </div>
              <div>
                <p className="text-lg font-semibold">${weeklyPayment}</p>
                <p className="text-xs text-gray-500">weekly</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {loan.description && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-3">About This Loan</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {loan.description}
              </p>
            </div>
          )}

          {/* Repayment Plan */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Repayment Plan</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weekly Payment</span>
                <span className="text-sm font-semibold">${weeklyPayment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-semibold">12 weeks</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total to Repay</span>
                <span className="text-sm font-semibold">${loan.goal?.toLocaleString() || '0'}</span>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">0% Interest</p>
                    <p className="text-xs text-blue-700 mt-1">
                      This is a community loan with no interest or hidden fees
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe z-10">
        <div className="flex gap-3">
          <button
            onClick={handleFund}
            className="flex-1 py-3 bg-[#2C7A7B] text-white rounded-lg font-medium"
          >
            {isConnected ? "Fund this loan" : "Sign in to Fund"}
          </button>
          <button
            onClick={handleShare}
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          Min. contribution $5 · Max. ${mockLoan.goal - mockLoan.raised}
        </p>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        loan={loanShareData}
      />
    </div>
  );
}