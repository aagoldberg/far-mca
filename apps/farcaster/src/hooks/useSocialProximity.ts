'use client';

import { useState, useEffect } from 'react';
import { calculateSocialProximity, SocialProximityScore } from '@/lib/socialProximity';
import { useFarcasterProfile } from './useFarcasterProfile';

/**
 * Hook to calculate social proximity between borrower and current user (viewer/lender)
 *
 * @param borrowerAddress - Ethereum address of the borrower
 * @param viewerAddress - Ethereum address of the current user (viewer/potential lender)
 * @returns Social proximity score and loading state
 *
 * @example
 * ```tsx
 * function LoanCard({ borrowerAddress }) {
 *   const { account } = useAccount(); // wagmi
 *   const { proximity, isLoading } = useSocialProximity(borrowerAddress, account.address);
 *
 *   return (
 *     <div>
 *       {proximity && (
 *         <div>
 *           {proximity.riskTier === 'LOW' && '🟢 Highly Trusted'}
 *           {proximity.riskTier === 'MEDIUM' && '🟡 Some Connections'}
 *           {proximity.riskTier === 'HIGH' && '🔴 Unknown'}
 *           <p>{proximity.mutualFollows} mutual connections</p>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSocialProximity(
  borrowerAddress: `0x${string}` | undefined,
  viewerAddress: `0x${string}` | undefined
) {
  const [proximity, setProximity] = useState<SocialProximityScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get Farcaster profiles for both users
  const { profile: borrowerProfile, isLoading: loadingBorrower } = useFarcasterProfile(borrowerAddress);
  const { profile: viewerProfile, isLoading: loadingViewer } = useFarcasterProfile(viewerAddress);

  useEffect(() => {
    // Reset if addresses are missing
    if (!borrowerAddress || !viewerAddress) {
      setProximity(null);
      setIsLoading(false);
      return;
    }

    // Don't calculate if profiles aren't loaded yet
    if (loadingBorrower || loadingViewer) {
      setIsLoading(true);
      return;
    }

    // Can't calculate if either user doesn't have a Farcaster profile
    if (!borrowerProfile || !viewerProfile) {
      setProximity(null);
      setIsLoading(false);
      return;
    }

    // Calculate social proximity
    const fetchProximity = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const score = await calculateSocialProximity(
          borrowerProfile.fid,
          viewerProfile.fid,
          borrowerProfile.score,  // Neynar quality score (0-1)
          viewerProfile.score     // Neynar quality score (0-1)
        );

        setProximity(score);
      } catch (err) {
        console.error('[Social Proximity Hook] Error:', err);
        setError(err as Error);
        setProximity(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProximity();
  }, [borrowerAddress, viewerAddress, borrowerProfile, viewerProfile, loadingBorrower, loadingViewer]);

  return {
    proximity,
    isLoading: isLoading || loadingBorrower || loadingViewer,
    error,
    hasBothProfiles: !!borrowerProfile && !!viewerProfile,
    borrowerProfile,
    viewerProfile,
  };
}
