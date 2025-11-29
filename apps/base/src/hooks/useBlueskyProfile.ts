'use client';

import { useState, useEffect } from 'react';
import { fetchBlueskyProfile, BlueskyProfile } from '@/lib/bluesky';
import {
  calculateBlueskyQualityScore,
  BlueskyQualityScore,
} from '@/lib/blueskyQuality';
import { SimpleCache } from '@/lib/cache';

// Create dedicated cache for Bluesky profiles
// TTL: 10 minutes (profiles don't change often)
// Max: 500 profiles
const blueskyProfileCache = new SimpleCache<{
  profile: BlueskyProfile;
  quality: BlueskyQualityScore;
}>(10 * 60 * 1000, 500);

export interface UseBlueskyProfileResult {
  profile: BlueskyProfile | null;
  quality: BlueskyQualityScore | null;
  isLoading: boolean;
  error: Error | null;
  hasProfile: boolean;
}

/**
 * React hook to fetch and cache a Bluesky user profile
 *
 * @param identifier - Bluesky handle (e.g., "alice.bsky.social") or DID (e.g., "did:plc:...")
 * @returns Profile data, quality score, loading state, and error
 *
 * @example
 * ```tsx
 * const { profile, quality, isLoading } = useBlueskyProfile("alice.bsky.social");
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (!profile) return <div>No Bluesky profile found</div>;
 *
 * return (
 *   <div>
 *     <h3>{profile.displayName}</h3>
 *     <p>Followers: {profile.followersCount}</p>
 *     <p>Quality Score: {quality?.overall}/100</p>
 *   </div>
 * );
 * ```
 */
export function useBlueskyProfile(
  identifier: string | undefined
): UseBlueskyProfileResult {
  const [profile, setProfile] = useState<BlueskyProfile | null>(null);
  const [quality, setQuality] = useState<BlueskyQualityScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!identifier) {
      setProfile(null);
      setQuality(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Normalize identifier (lowercase for cache key)
        const cacheKey = identifier.toLowerCase();

        // Check cache first
        const cached = blueskyProfileCache.get(cacheKey);

        if (cached) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Bluesky Cache HIT] ${identifier}`);
          }
          setProfile(cached.profile);
          setQuality(cached.quality);
          setIsLoading(false);
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Bluesky Cache MISS] ${identifier}`);
        }

        // Fetch profile from Bluesky API
        const blueskyProfile = await fetchBlueskyProfile(identifier);

        if (!blueskyProfile) {
          // No profile found - this is expected for users without Bluesky accounts
          setProfile(null);
          setQuality(null);
          setError(null); // Don't treat as error
          return;
        }

        // Calculate quality score
        const qualityScore = await calculateBlueskyQualityScore(
          blueskyProfile.did
        );

        setProfile(blueskyProfile);
        setQuality(qualityScore);

        // Store in cache
        if (qualityScore) {
          blueskyProfileCache.set(cacheKey, {
            profile: blueskyProfile,
            quality: qualityScore,
          });
        }
      } catch (err) {
        // Silently handle errors - most addresses won't have Bluesky profiles
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.debug('Bluesky profile not found or API error:', err);
        }
        setError(null); // Don't expose errors to the component
        setProfile(null);
        setQuality(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [identifier]);

  return {
    profile,
    quality,
    isLoading,
    error,
    hasProfile: !!profile,
  };
}
