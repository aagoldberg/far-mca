'use client';

import { useState, useEffect } from 'react';
import {
  calculateBlueskyProximity,
  quickBlueskyProximityCheck,
  BlueskyProximityScore,
} from '@/lib/blueskyProximity';
import { SimpleCache } from '@/lib/cache';

// Create dedicated cache for Bluesky proximity scores
// TTL: 30 minutes (social graphs change slowly)
// Max: 200 proximity calculations
const blueskyProximityCache = new SimpleCache<BlueskyProximityScore>(
  30 * 60 * 1000,
  200
);

export interface UseBlueskyProximityResult {
  proximityScore: BlueskyProximityScore | null;
  isLoading: boolean;
  error: Error | null;
  hasScore: boolean;
}

/**
 * React hook to calculate social proximity between two Bluesky users
 *
 * @param lenderIdentifier - Lender's Bluesky handle or DID
 * @param borrowerIdentifier - Borrower's Bluesky handle or DID
 * @param options.quick - Use quick check (fewer API calls, less detailed)
 * @returns Proximity score, loading state, and error
 *
 * @example
 * ```tsx
 * const { proximityScore, isLoading } = useBlueskyProximity(
 *   "lender.bsky.social",
 *   "borrower.bsky.social"
 * );
 *
 * if (isLoading) return <div>Calculating trust...</div>;
 * if (!proximityScore) return null;
 *
 * return (
 *   <div>
 *     <p>Mutual Connections: {proximityScore.mutualConnections}</p>
 *     <p>Social Distance: {proximityScore.socialDistance}/100</p>
 *     <p>Risk Tier: {proximityScore.riskTier}</p>
 *     <p>Trust Level: {proximityScore.recommendation.trustLevel}</p>
 *   </div>
 * );
 * ```
 */
export function useBlueskyProximity(
  lenderIdentifier: string | undefined,
  borrowerIdentifier: string | undefined,
  options?: { quick?: boolean }
): UseBlueskyProximityResult {
  const [proximityScore, setProximityScore] =
    useState<BlueskyProximityScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lenderIdentifier || !borrowerIdentifier) {
      setProximityScore(null);
      return;
    }

    const calculateProximity = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Create cache key (normalized)
        const cacheKey = `${lenderIdentifier.toLowerCase()}:${borrowerIdentifier.toLowerCase()}`;

        // Check cache first (only for full calculations)
        if (!options?.quick) {
          const cached = blueskyProximityCache.get(cacheKey);

          if (cached) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Bluesky Proximity Cache HIT] ${cacheKey}`);
            }
            setProximityScore(cached);
            setIsLoading(false);
            return;
          }

          if (process.env.NODE_ENV === 'development') {
            console.log(`[Bluesky Proximity Cache MISS] ${cacheKey}`);
          }
        }

        // Calculate proximity
        let score: BlueskyProximityScore | null;

        if (options?.quick) {
          // Quick check - lighter computation
          const quickResult = await quickBlueskyProximityCheck(
            lenderIdentifier,
            borrowerIdentifier
          );

          if (!quickResult) {
            setProximityScore(null);
            return;
          }

          // Create minimal proximity score for quick check
          score = {
            lenderDid: '',
            lenderHandle: lenderIdentifier,
            borrowerDid: '',
            borrowerHandle: borrowerIdentifier,
            mutualConnections: quickResult.mutualConnections,
            effectiveMutuals: quickResult.mutualConnections, // Assume 1:1 for quick check
            socialDistance: quickResult.mutualConnections >= 10 ? 60 : 30,
            networkOverlap: 0,
            riskTier: quickResult.riskTier,
            qualityBreakdown: {
              lender: null,
              borrower: null,
              mutuals: { high: 0, medium: 0, low: 0 },
            },
            recommendation: {
              trustLevel: 'MEDIUM',
              reasoning: [`Quick check: ${quickResult.mutualConnections} mutual connections`],
            },
          };
        } else {
          // Full proximity calculation
          score = await calculateBlueskyProximity(
            lenderIdentifier,
            borrowerIdentifier
          );
        }

        if (!score) {
          setProximityScore(null);
          return;
        }

        setProximityScore(score);

        // Store in cache (only full calculations)
        if (!options?.quick) {
          blueskyProximityCache.set(cacheKey, score);
        }
      } catch (err) {
        console.error('Error calculating Bluesky proximity:', err);
        setError(
          err instanceof Error ? err : new Error('Unknown error occurred')
        );
        setProximityScore(null);
      } finally {
        setIsLoading(false);
      }
    };

    calculateProximity();
  }, [lenderIdentifier, borrowerIdentifier, options?.quick]);

  return {
    proximityScore,
    isLoading,
    error,
    hasScore: !!proximityScore,
  };
}
