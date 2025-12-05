'use client';

import Link from "next/link";
import { useLoanWithMetadata } from "@/hooks/useLoansWithMetadata";
import { useFarcasterProfile } from "@/hooks/useFarcasterProfile";
import { useContributorsWithAmounts } from "@/hooks/useMicroLoan";

// Loading skeleton for loan cards
export function LoanCardSkeleton() {
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
        alt={profile.username || 'Supporter'}
        className="w-5 h-5 rounded-full border border-white object-cover"
      />
    );
  }

  // Default avatar for non-Farcaster users - show generic icon, no address
  return (
    <div className="w-5 h-5 rounded-full border border-white bg-gradient-to-br from-[#2C7A7B] to-[#234E52] flex items-center justify-center">
      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

// Component to show funder username
function FunderName({ address, isFirst }: { address: `0x${string}`; isFirst: boolean }) {
  const { profile } = useFarcasterProfile(address);

  // Only show name if they have a Farcaster profile, otherwise skip
  if (!profile?.username) {
    return null;
  }

  return (
    <span className="font-medium text-gray-700">
      {!isFirst && ', '}@{profile.username}
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

// Borrower header component with status
function BorrowerHeader({ address, loan }: { address: `0x${string}`; loan: any }) {
  const { profile } = useFarcasterProfile(address);

  // Determine status badge - smart badge that shows most relevant info
  const getStatusBadge = () => {
    if (loan.completed) {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-600' };
    }
    if (loan.active) {
      return { label: 'Repaying', color: 'bg-blue-100 text-blue-700' };
    }
    if (loan.fundraisingActive) {
      // Show days left during fundraising (more useful than "Fundraising" label)
      if (loan.daysLeft !== undefined) {
        return { label: `${loan.daysLeft}d left`, color: 'bg-amber-50 text-amber-700 border border-amber-200' };
      }
      return { label: 'Fundraising', color: 'bg-amber-50 text-amber-700 border border-amber-200' };
    }
    return { label: 'Closed', color: 'bg-gray-100 text-gray-600' };
  };

  const badge = getStatusBadge();

  // Get display name - prefer username, never show address
  const displayName = profile?.displayName || profile?.username || 'Community Member';

  return (
    <div className="flex items-center gap-1.5 mb-2">
      {profile?.pfpUrl ? (
        <img src={profile.pfpUrl} alt={displayName} className="w-5 h-5 rounded-full object-cover" />
      ) : (
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2C7A7B] to-[#234E52] flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <span className="text-sm font-medium text-gray-700">
        {displayName}
      </span>
      <span className={`ml-auto text-[11px] font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    </div>
  );
}

// Clean mobile loan card
export function LoanCard({ loan }: { loan: any }) {
  const progress = loan.progress || 0;
  const contributorsCount = Number(loan.contributorsCount) || 0;
  const borrowerAddress = loan.borrower || loan.creator;

  return (
    <Link href={`/loan/${loan.address}`} className="block">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4">
        {/* Borrower header with status */}
        <BorrowerHeader address={borrowerAddress} loan={loan} />

        {/* Loan image */}
        {loan.imageUrl && (
          <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden mb-3" style={{ paddingBottom: '56.25%' }}>
            <img
              src={loan.imageUrl}
              alt={loan.title || loan.name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-3">
          {loan.title || loan.name || 'Community Loan'}
        </h3>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2C7A7B]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Funding amounts */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm">
            <span className="font-bold text-[#2C7A7B]">${loan.raised?.toLocaleString() || '0'} raised</span>
          </span>
          <span className="text-sm text-gray-500">
            of ${loan.goal?.toLocaleString() || '0'}
          </span>
        </div>

        {/* Funded by section */}
        <FundedBySection loanAddress={loan.address} totalCount={contributorsCount} />
      </div>
    </Link>
  );
}

// Wrapper component to fetch individual loan data
export function LoanCardWrapper({ loanAddress }: { loanAddress: `0x${string}` }) {
  const { loan, isLoading } = useLoanWithMetadata(loanAddress);

  if (isLoading || !loan) {
    return <LoanCardSkeleton />;
  }

  return <LoanCard loan={loan} />;
}
