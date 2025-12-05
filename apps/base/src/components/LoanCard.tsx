'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
import { useContributorsWithAmounts } from '@/hooks/useMicroLoan';

export interface LoanCardProps {
  address: `0x${string}`;
  borrower?: `0x${string}`;
  name: string;
  description: string;
  principal: bigint;
  totalFunded: bigint;
  fundraisingActive: boolean;
  active: boolean;
  completed: boolean;
  contributorsCount: bigint;
  termPeriods?: bigint;
  imageUrl?: string;
  imageAspectRatio?: number; // undefined means free aspect ratio
  fundraisingDeadline?: bigint;
  disbursementTime?: bigint;
  totalRepaid?: bigint;
  businessWebsite?: string;
}

const formatUSDC = (amount: bigint): string => {
  const formatted = formatUnits(amount, USDC_DECIMALS);
  return parseFloat(formatted).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const getStatusInfo = (
  fundraisingActive: boolean,
  active: boolean,
  completed: boolean,
  totalFunded: bigint,
  principal: bigint,
  fundraisingDeadline?: bigint
): { text: string; className: string; showDays: boolean } => {
  // Completed loan
  if (completed) {
    return {
      text: 'Completed',
      className: 'bg-green-100 text-green-800',
      showDays: false,
    };
  }

  // Active loan (being repaid)
  if (active) {
    return {
      text: 'Active',
      className: 'bg-blue-100 text-blue-800',
      showDays: false,
    };
  }

  // Check if fully funded
  if (totalFunded >= principal && principal > 0n) {
    return {
      text: 'Funded',
      className: 'bg-green-100 text-green-800',
      showDays: false,
    };
  }

  // Still fundraising
  if (fundraisingActive) {
    return {
      text: 'Fundraising',
      className: 'bg-yellow-100 text-yellow-800',
      showDays: true, // Show days remaining for fundraising
    };
  }

  // Inactive/cancelled
  return {
    text: 'Inactive',
    className: 'bg-gray-100 text-gray-800',
    showDays: false,
  };
};

const getDaysRemaining = (fundraisingDeadline?: bigint): string | null => {
  if (!fundraisingDeadline) return null;

  const now = Math.floor(Date.now() / 1000);
  const deadline = Number(fundraisingDeadline);
  const secondsRemaining = deadline - now;

  if (secondsRemaining <= 0) return null;

  const daysRemaining = Math.ceil(secondsRemaining / 86400);

  if (daysRemaining === 1) return '1 day';
  return `${daysRemaining} days`;
};

// Component for individual contributor avatar
function ContributorAvatar({ address: contributorAddress, index, total }: { address: `0x${string}`; index: number; total: number }) {
  const { profile } = useFarcasterProfile(contributorAddress);

  return (
    <div
      className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:scale-110 transition-all duration-200"
      style={{ zIndex: total - index }}
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
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] text-white text-[10px] sm:text-xs font-bold">
          {contributorAddress.slice(2, 4).toUpperCase()}
        </div>
      )}
    </div>
  );
}

// Component for contributor name in text
function ContributorName({ address: contributorAddress }: { address: `0x${string}` }) {
  const { profile } = useFarcasterProfile(contributorAddress);

  return (
    <span className="font-medium text-gray-900">
      {profile?.username ? `@${profile.username}` : `${contributorAddress.slice(0, 6)}...${contributorAddress.slice(-4)}`}
    </span>
  );
}

function ContributorsDisplay({ contributors, totalCount, hasMore }: { contributors: `0x${string}`[], totalCount: number, hasMore: boolean }) {
  // Always call hooks at the top level - fetch profiles for up to 2 contributors
  const profile1 = useFarcasterProfile(contributors[0]);
  const profile2 = useFarcasterProfile(contributors.length > 1 ? contributors[1] : undefined);

  // Check if any of the displayed contributors has a profile
  const anyHaveProfiles = profile1.profile !== null || (contributors.length > 1 && profile2.profile !== null);

  // If no one has a profile, show generic message
  if (!anyHaveProfiles) {
    return (
      <span className="text-gray-500">
        {totalCount === 1 ? '1 lender' : `${totalCount} lenders`}
      </span>
    );
  }

  // Calculate how many others there are
  const othersCount = totalCount - contributors.length;

  // Show up to 2 named contributors
  return (
    <>
      {contributors.slice(0, 2).map((addr, idx) => (
        <span key={addr}>
          <ContributorName address={addr} />
          {idx === 0 && contributors.length > 1 && ', '}
        </span>
      ))}
      {othersCount > 0 && (
        <span className="text-gray-500">
          {' and '}
          {othersCount} {othersCount === 1 ? 'other' : 'others'}
        </span>
      )}
    </>
  );
}

// Component to handle contributor footer with profile checks
// Note: contributors passed here are already filtered to those with Farcaster profiles
function ContributorFooter({ contributors, totalCount, hasMore }: { contributors: `0x${string}`[], totalCount: number, hasMore: boolean }) {
  // If no contributors with profiles, show nothing (parent will show "Be the first supporter")
  if (contributors.length === 0) {
    return null;
  }

  return (
    <div className="pt-3 mt-3 border-t border-gray-100/80">
      {/* Label */}
      <div className="text-xs text-gray-500 mb-2">
        Supported by
      </div>

      {/* Avatars + Names */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3 flex-shrink-0">
          {contributors.map((contributorAddress, index) => (
            <ContributorAvatar
              key={contributorAddress}
              address={contributorAddress}
              index={index}
              total={contributors.length}
            />
          ))}
        </div>

        <div className="flex-1 text-xs sm:text-sm text-gray-600">
          <ContributorsDisplay
            contributors={contributors}
            totalCount={totalCount}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  );
}

export function LoanCard({
  address,
  borrower,
  name,
  description,
  principal,
  totalFunded,
  fundraisingActive,
  active,
  completed,
  contributorsCount,
  termPeriods,
  imageUrl,
  imageAspectRatio,
  fundraisingDeadline,
  disbursementTime,
  totalRepaid,
  businessWebsite,
}: LoanCardProps) {
  const totalFundedNum = parseFloat(formatUnits(totalFunded, USDC_DECIMALS));
  const principalNum = parseFloat(formatUnits(principal, USDC_DECIMALS));
  const progressPercentage = principalNum > 0 ? (totalFundedNum / principalNum) * 100 : 0;

  const statusInfo = getStatusInfo(fundraisingActive, active, completed, totalFunded, principal, fundraisingDeadline);

  // Fetch Farcaster profile - gracefully falls back to wallet address if no profile exists
  const { profile, hasProfile } = useFarcasterProfile(borrower);

  // Fetch top 10 contributors sorted by amount
  const { contributors: allContributors, totalCount, hasMore: hasMoreContributors } = useContributorsWithAmounts(address, 10);

  // Fetch Farcaster profiles for top 10 contributors (always call hooks at top level)
  const profile0 = useFarcasterProfile(allContributors[0]?.address);
  const profile1 = useFarcasterProfile(allContributors[1]?.address);
  const profile2 = useFarcasterProfile(allContributors[2]?.address);
  const profile3 = useFarcasterProfile(allContributors[3]?.address);
  const profile4 = useFarcasterProfile(allContributors[4]?.address);
  const profile5 = useFarcasterProfile(allContributors[5]?.address);
  const profile6 = useFarcasterProfile(allContributors[6]?.address);
  const profile7 = useFarcasterProfile(allContributors[7]?.address);
  const profile8 = useFarcasterProfile(allContributors[8]?.address);
  const profile9 = useFarcasterProfile(allContributors[9]?.address);

  // Filter to contributors with Farcaster profiles and take top 3 by amount
  const contributorsWithProfiles = useMemo(() => {
    const profiles = [profile0, profile1, profile2, profile3, profile4, profile5, profile6, profile7, profile8, profile9];

    // Only filter if profiles have finished loading (not all are isLoading)
    const allProfilesLoaded = profiles.every((p, idx) =>
      !allContributors[idx] || !p.isLoading
    );

    if (!allProfilesLoaded) {
      // Profiles still loading, return empty for now
      return [];
    }

    const filtered = allContributors
      .map((contributor, index) => ({
        ...contributor,
        hasProfile: profiles[index]?.hasProfile || false,
        username: profiles[index]?.profile?.username,
      }))
      .filter(c => c.hasProfile)
      .slice(0, 3);

    return filtered;
  }, [allContributors, profile0, profile1, profile2, profile3, profile4, profile5, profile6, profile7, profile8, profile9]);

  const contributors = contributorsWithProfiles.map(c => c.address);
  const hasMore = contributorsWithProfiles.length < totalCount;

  const shortAddress = borrower ? `${borrower.slice(0, 6)}...${borrower.slice(-4)}` : '';

  const daysRemaining = getDaysRemaining(fundraisingDeadline);

  // Debug: Log borrower and contributor status
  if (process.env.NODE_ENV === 'development') {
    if (borrower) {
      console.log(`[LoanCard ${address.slice(0, 6)}] Borrower: ${borrower}`, {
        hasProfile,
        username: profile?.username,
        verifiedAddresses: profile?.verifications,
        pfpUrl: profile?.pfpUrl,
      });
    }
    if (allContributors.length > 0) {
      const profiles = [profile0, profile1, profile2, profile3, profile4, profile5, profile6, profile7, profile8, profile9];

      console.log(`[LoanCard ${address.slice(0, 6)}] Top contributors by amount:`,
        allContributors.slice(0, 5).map((c, i) => ({
          address: `${c.address.slice(0, 6)}...${c.address.slice(-4)}`,
          amount: Number(c.amount) / 1e6,
          isLoading: profiles[i]?.isLoading,
          hasProfile: profiles[i]?.hasProfile,
          username: profiles[i]?.profile?.username,
        }))
      );
      console.log(`[LoanCard ${address.slice(0, 6)}] Final display:`, {
        showing: contributors.length,
        totalWithProfiles: contributorsWithProfiles.length,
        totalCount,
        profilesStillLoading: profiles.some((p, idx) => allContributors[idx] && p.isLoading),
      });
    }
  }

  return (
    <Link
      href={`/loan/${address}`}
      className="group block relative bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all active:scale-[0.99] hover:border-base-blue/30 shadow-none hover:shadow-none"
    >
      {/* Card content */}
      <div className="relative bg-white transition-shadow duration-300">
        {/* Header with borrower info - only show if has Farcaster profile */}
        {hasProfile && profile && (
          <div className="px-4 sm:px-5 pt-3 pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative">
                  {profile.pfpUrl ? (
                    <img
                      src={profile.pfpUrl}
                      alt={profile.displayName}
                      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-200 flex-shrink-0 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                  )}
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {profile.displayName || `@${profile.username}`}
                </span>
                {businessWebsite && (
                  <a
                    href={businessWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                  >
                    <svg className="w-4 h-4 text-base-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Show days remaining if fundraising, otherwise show status badge */}
              {statusInfo.showDays && daysRemaining ? (
                <div className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-600 flex-shrink-0 bg-base-gray px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{daysRemaining}</span>
                </div>
              ) : (
                <span className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${statusInfo.className}`}>
                  {statusInfo.text}
                </span>
              )}
            </div>
          </div>
        )}

      {imageUrl && (
        <div className="w-full bg-base-gray relative" style={{ paddingBottom: '75%' }}>
          <img
            src={imageUrl}
            alt={name || 'Loan image'}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Status badge overlay when no profile */}
          {!hasProfile && !profile && (
            <div className="absolute top-3 right-3">
              {statusInfo.showDays && daysRemaining ? (
                <div className="flex items-center gap-1.5 text-xs text-gray-900 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">{daysRemaining}</span>
                </div>
              ) : (
                <span className={`px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-sm ${statusInfo.className}`}>
                  {statusInfo.text}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Title */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-base-black line-clamp-3 flex-1 min-w-0 group-hover:text-base-blue transition-colors duration-200">
            {name || 'Untitled Loan'}
          </h3>
        </div>

        <div className="mb-3">
          {/* Enhanced progress bar */}
          <div className="relative w-full bg-base-gray rounded-full h-2 mb-2.5 overflow-hidden">
            <div
              className="relative h-full rounded-full transition-all duration-500 bg-base-blue"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="font-bold text-base-black">
              ${formatUSDC(totalFunded)} raised
            </span>
            <span className="text-gray-500 font-medium">
              of ${formatUSDC(principal)}
            </span>
          </div>
        </div>

        {/* Contributor avatars footer */}
        {contributors.length > 0 ? (
          // Show contributors with Farcaster profiles
          <ContributorFooter
            contributors={contributors}
            totalCount={totalCount}
            hasMore={hasMore}
          />
        ) : totalCount > 0 ? (
          // Has contributors but none with Farcaster profiles - show generic message
          <div className="pt-3 mt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">
              Supported by
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {totalCount} {totalCount === 1 ? 'other' : 'others'}
            </div>
          </div>
        ) : (
          // No contributors yet
          <div className="pt-3 mt-3 border-t border-gray-100 text-xs sm:text-sm text-gray-400 italic flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Be the first supporter</span>
          </div>
        )}

        {/* View details link */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-base-blue group-hover:underline transition-colors">
            View details
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
      </div>
    </Link>
  );
}
