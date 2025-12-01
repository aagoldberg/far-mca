"use client";

import { useState } from "react";
import Link from "next/link";
import { useMiniAppWallet } from "@/hooks/useMiniAppWallet";
import { useLoansWithMetadata, useLoanWithMetadata } from "@/hooks/useLoansWithMetadata";
import { useFarcasterProfile } from "@/hooks/useFarcasterProfile";
import { useContributorsWithAmounts } from "@/hooks/useMicroLoan";

// Loading skeleton for loan cards
function LoanCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="relative w-full bg-gray-200" style={{ paddingBottom: '56.25%' }} />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-2.5 bg-gray-200 rounded-full" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// Component to show a single funder's avatar
function FunderAvatar({ address }: { address: `0x${string}` }) {
  const { profile } = useFarcasterProfile(address);

  if (profile?.pfpUrl) {
    return (
      <img
        src={profile.pfpUrl}
        alt={profile.username}
        className="w-5 h-5 rounded-full border border-white object-cover"
      />
    );
  }

  // Default avatar for non-Farcaster users
  return (
    <div className="w-5 h-5 rounded-full border border-white bg-gray-300 flex items-center justify-center">
      <span className="text-[8px] text-gray-600">
        {address.slice(2, 4).toUpperCase()}
      </span>
    </div>
  );
}

// Component to show funder username
function FunderName({ address, isFirst }: { address: `0x${string}`; isFirst: boolean }) {
  const { profile } = useFarcasterProfile(address);

  const name = profile?.username
    ? `@${profile.username}`
    : `${address.slice(0, 6)}...`;

  return (
    <span className="font-medium text-gray-700">
      {!isFirst && ', '}{name}
    </span>
  );
}

// Component to show "Funded by @user, @user2 and X others"
function FundedBySection({ loanAddress, totalCount }: { loanAddress: `0x${string}`; totalCount: number }) {
  const { contributors } = useContributorsWithAmounts(loanAddress, 3);

  if (totalCount === 0 || contributors.length === 0) {
    return null;
  }

  const displayedContributors = contributors.slice(0, 2);
  const remainingCount = totalCount - displayedContributors.length;

  return (
    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100">
      {/* Stacked avatars */}
      <div className="flex -space-x-1.5">
        {displayedContributors.map((contributor, idx) => (
          <FunderAvatar key={contributor.address} address={contributor.address} />
        ))}
        {remainingCount > 0 && (
          <div className="w-5 h-5 rounded-full border border-white bg-gray-200 flex items-center justify-center">
            <span className="text-[8px] font-medium text-gray-600">+{remainingCount}</span>
          </div>
        )}
      </div>

      {/* Text */}
      <p className="text-xs text-gray-500 flex-1 truncate">
        <span className="text-gray-400">Funded by </span>
        {displayedContributors.map((contributor, idx) => (
          <FunderName
            key={contributor.address}
            address={contributor.address}
            isFirst={idx === 0}
          />
        ))}
        {remainingCount > 0 && (
          <span className="text-gray-500"> and {remainingCount} other{remainingCount > 1 ? 's' : ''}</span>
        )}
      </p>
    </div>
  );
}

// Wrapper component to fetch individual loan data
function MiniLoanCardWrapper({ loanAddress }: { loanAddress: `0x${string}` }) {
  const { loan, isLoading } = useLoanWithMetadata(loanAddress);

  if (isLoading || !loan) {
    return <LoanCardSkeleton />;
  }

  return <MiniLoanCard loan={loan} />;
}

// Borrower inline component
function BorrowerInline({ address }: { address: `0x${string}` }) {
  const { profile } = useFarcasterProfile(address);

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {profile?.pfpUrl ? (
        <img src={profile.pfpUrl} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-[10px] font-medium flex-shrink-0">
          {address.slice(2, 4).toUpperCase()}
        </div>
      )}
      <span className="text-sm text-gray-600 truncate">
        {profile?.username ? `@${profile.username}` : `${address.slice(0, 6)}...`}
      </span>
    </div>
  );
}

// Clean mobile loan card
function MiniLoanCard({ loan }: { loan: any }) {
  const progress = loan.progress || 0;
  const contributorsCount = Number(loan.contributorsCount) || 0;
  const borrowerAddress = loan.borrower || loan.creator;

  return (
    <Link href={`/loan/${loan.address}`} className="block">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Loan image */}
        {loan.imageUrl && (
          <div className="relative w-full bg-gray-100" style={{ paddingBottom: '56.25%' }}>
            <img
              src={loan.imageUrl}
              alt={loan.title || loan.name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Days left badge */}
            {loan.daysLeft !== undefined && (
              <div className="absolute top-3 right-3 text-xs bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full font-medium">
                {loan.daysLeft}d left
              </div>
            )}
          </div>
        )}

        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-base leading-snug mb-3">
            {loan.title || loan.name || 'Community Loan'}
          </h3>

          {/* Borrower + Amount + Progress bar */}
          <div className="flex items-center gap-3 mb-1">
            <BorrowerInline address={borrowerAddress} />
            <div className="flex items-center gap-2 ml-auto">
              <div className="text-sm whitespace-nowrap">
                <span className="font-bold text-[#2C7A7B]">${loan.raised?.toLocaleString() || '0'}</span>
                <span className="text-gray-400"> / ${loan.goal?.toLocaleString() || '0'}</span>
              </div>
              <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                <div
                  className="h-full rounded-full bg-[#2C7A7B]"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Funded by section */}
          <FundedBySection loanAddress={loan.address} totalCount={contributorsCount} />
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { isConnected, connect } = useMiniAppWallet();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-loans'>('browse');

  // Fetch loans from blockchain + IPFS
  const { loanAddresses, isLoading } = useLoansWithMetadata();

  return (
    <main className="flex flex-col min-h-[calc(100vh-48px)]">
      {/* Tab Navigation - Clean, minimal */}
      <div className="bg-white px-4 border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'text-[#2C7A7B] border-[#2C7A7B]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('my-loans')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my-loans'
                ? 'text-[#2C7A7B] border-[#2C7A7B]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            My Activity
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 bg-gray-50">
        {activeTab === 'browse' ? (
          <>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <LoanCardSkeleton key={i} />
                ))}
              </div>
            ) : loanAddresses.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-[#2C7A7B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#2C7A7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Active Loans
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                  Be the first to request community funding with 0% interest
                </p>
                <Link
                  href="/create-loan"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C7A7B] text-white rounded-xl font-medium text-sm shadow-sm hover:bg-[#234E52] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Request Funding
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {loanAddresses.map(address => (
                  <MiniLoanCardWrapper key={address} loanAddress={address} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            {isConnected ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Start by funding a loan or creating your own
                </p>
                <Link
                  href="/create-loan"
                  className="text-[#2C7A7B] font-medium text-sm hover:underline"
                >
                  Create your first loan →
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to View</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Connect your wallet to see your activity
                </p>
                <button
                  onClick={connect}
                  className="px-5 py-2.5 bg-[#2C7A7B] text-white rounded-xl font-medium text-sm shadow-sm hover:bg-[#234E52] transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link
        href="/create-loan"
        className="fixed bottom-6 right-4 w-14 h-14 bg-[#2C7A7B] rounded-full shadow-lg flex items-center justify-center hover:bg-[#234E52] active:scale-95 transition-all z-10"
        aria-label="Create loan"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </main>
  );
}