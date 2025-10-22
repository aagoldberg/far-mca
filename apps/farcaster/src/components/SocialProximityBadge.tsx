'use client';

import { useLoanSocialSupport } from '@/hooks/useLoanSocialSupport';
import { getSocialSupportEmoji, getSocialSupportDescription } from '@/lib/socialProximity';

interface SocialProximityBadgeProps {
  loanAddress: `0x${string}`;
  borrowerAddress: `0x${string}`;
  showDetails?: boolean; // Show full details or just badge
}

/**
 * Display social support for a loan
 * Shows how well-connected existing lenders are to the borrower
 *
 * Research-backed: Kiva found borrowers with 20+ friend/family lenders
 * have 98% repayment rate vs 88% with 0 connections (10% improvement!)
 *
 * This measures EXISTING lenders' connections to the borrower,
 * not the viewer's connection (universal signal, not personalized)
 */
export function SocialProximityBadge({
  loanAddress,
  borrowerAddress,
  showDetails = true,
}: SocialProximityBadgeProps) {
  const { support, isLoading, hasContributors } = useLoanSocialSupport(
    loanAddress,
    borrowerAddress
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        <span>Checking social support...</span>
      </div>
    );
  }

  if (!support) {
    return null;
  }

  // Don't show if no contributors yet
  if (!hasContributors) {
    return null;
  }

  const emoji = getSocialSupportEmoji(support.supportStrength);
  const description = getSocialSupportDescription(support);

  return (
    <div className="space-y-2">
      {/* Badge */}
      <div className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        ${support.supportStrength === 'STRONG' ? 'bg-green-100 text-green-800' : ''}
        ${support.supportStrength === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' : ''}
        ${support.supportStrength === 'WEAK' ? 'bg-orange-100 text-orange-800' : ''}
        ${support.supportStrength === 'NONE' ? 'bg-gray-100 text-gray-600' : ''}
      `}>
        <span className="text-base">{emoji}</span>
        <span>{description}</span>
      </div>

      {/* Details */}
      {showDetails && support.totalLenders > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <div>
            {support.lendersWithConnections} of {support.totalLenders} lenders connected to borrower
          </div>
          {support.averageMutualConnections > 0 && (
            <div>
              Average: {support.averageMutualConnections} mutual connections per lender
            </div>
          )}
          <div>
            Social support: {support.percentageFromNetwork}% from network
          </div>
        </div>
      )}
    </div>
  );
}
