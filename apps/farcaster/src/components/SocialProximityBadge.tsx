'use client';

import { useSocialProximity } from '@/hooks/useSocialProximity';
import { getRiskEmoji, getSocialRiskDescription } from '@/lib/socialProximity';
import { useAccount } from 'wagmi';

interface SocialProximityBadgeProps {
  borrowerAddress: `0x${string}`;
  showDetails?: boolean; // Show full details or just badge
}

/**
 * Display social proximity between borrower and current user
 * Shows trust level based on mutual Farcaster connections
 *
 * Research-backed: Kiva found borrowers with 20+ friend/family lenders
 * have 98% repayment rate vs 88% with 0 connections (10% improvement!)
 */
export function SocialProximityBadge({
  borrowerAddress,
  showDetails = true,
}: SocialProximityBadgeProps) {
  const { address: viewerAddress } = useAccount();
  const { proximity, isLoading, hasBothProfiles } = useSocialProximity(
    borrowerAddress,
    viewerAddress
  );

  // Don't show anything if viewer isn't connected or no Farcaster profiles
  if (!viewerAddress || !hasBothProfiles) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        <span>Checking social connections...</span>
      </div>
    );
  }

  if (!proximity) {
    return null;
  }

  const emoji = getRiskEmoji(proximity.riskTier);
  const description = getSocialRiskDescription(proximity);

  return (
    <div className="space-y-2">
      {/* Badge */}
      <div className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        ${proximity.riskTier === 'LOW' ? 'bg-green-100 text-green-800' : ''}
        ${proximity.riskTier === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : ''}
        ${proximity.riskTier === 'HIGH' ? 'bg-gray-100 text-gray-600' : ''}
      `}>
        <span className="text-base">{emoji}</span>
        <span>{description}</span>
      </div>

      {/* Details */}
      {showDetails && proximity.mutualFollows > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <div>
            {proximity.mutualFollows} mutual connections
            {proximity.effectiveMutuals !== proximity.mutualFollows && (
              <span className="ml-1">
                ({proximity.effectiveMutuals.toFixed(1)} quality-weighted)
              </span>
            )}
          </div>
          <div>Social Distance: {proximity.socialDistance}/100</div>
          {proximity.userQuality && proximity.qualityTier && (
            <div className={`
              ${proximity.qualityTier === 'HIGH' ? 'text-green-600' : ''}
              ${proximity.qualityTier === 'MEDIUM' ? 'text-yellow-600' : ''}
              ${proximity.qualityTier === 'LOW' ? 'text-red-600' : ''}
            `}>
              Account Quality: {proximity.qualityTier} ({(proximity.userQuality * 100).toFixed(0)}%)
            </div>
          )}
          {proximity.percentOverlap > 0 && (
            <div>Network Overlap: {proximity.percentOverlap.toFixed(1)}%</div>
          )}
        </div>
      )}

      {/* Research Note for HIGH risk */}
      {showDetails && proximity.riskTier === 'HIGH' && (
        <div className="text-xs text-gray-500 italic">
          ℹ️ Research shows loans with mutual connections have 10% better repayment rates
        </div>
      )}
    </div>
  );
}
