'use client';

import { useState, useEffect } from 'react';
import { neynarClient, isNeynarEnabled } from '@/lib/neynar';
import { profileCache } from '@/lib/cache';

// Request deduplication: track in-flight profile fetches
const pendingProfileFetches = new Map<string, Promise<{ profile: FarcasterProfile | null; reputation: ReputationScore | null }>>();

export interface FarcasterProfile {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  pfp?: string; // Alias for compatibility
  bio: string;
  followerCount: number;
  followingCount: number;
  verifications: string[]; // Verified Ethereum wallet addresses
  custodyAddress?: string; // Farcaster custody address
  solanaAddresses?: string[]; // Verified Solana addresses
  powerBadge: boolean;
  accountAgeInDays: number;
  activeStatus: 'very_active' | 'active' | 'moderate' | 'low';
  score?: number; // Neynar user score (0-1), higher is better, lower indicates spam
}

export interface ReputationScore {
  overall: number; // 0-100
  powerBadge: boolean;
  followerTier: 'whale' | 'influential' | 'active' | 'growing' | 'new';
  accountAge: 'veteran' | 'established' | 'growing' | 'new';
  socialRank: number; // 0-100 based on followers + engagement
}

// Determine follower tier
const getFollowerTier = (count: number): ReputationScore['followerTier'] => {
  if (count >= 10000) return 'whale';
  if (count >= 1000) return 'influential';
  if (count >= 100) return 'active';
  if (count >= 10) return 'growing';
  return 'new';
};

// Determine account age category
const getAccountAgeCategory = (days: number): ReputationScore['accountAge'] => {
  if (days >= 730) return 'veteran'; // 2+ years
  if (days >= 365) return 'established'; // 1+ year
  if (days >= 90) return 'growing'; // 3+ months
  return 'new';
};

// Calculate overall reputation score
const calculateReputationScore = (profile: FarcasterProfile): ReputationScore => {
  let score = 0;

  // Power Badge (40 points)
  if (profile.powerBadge) {
    score += 40;
  }

  // Follower count (30 points max)
  const followerScore = Math.min((profile.followerCount / 1000) * 10, 30);
  score += followerScore;

  // Account age (20 points max)
  const ageScore = Math.min((profile.accountAgeInDays / 365) * 20, 20);
  score += ageScore;

  // Following/follower ratio - healthy engagement (10 points max)
  if (profile.followerCount > 0) {
    const ratio = profile.followingCount / profile.followerCount;
    // Ideal ratio is between 0.1 and 2.0
    if (ratio >= 0.1 && ratio <= 2.0) {
      score += 10;
    } else if (ratio >= 0.05 && ratio <= 5.0) {
      score += 5;
    }
  }

  // Social rank (normalized)
  const socialRank = Math.min(
    (profile.followerCount / 100) + (profile.powerBadge ? 50 : 0),
    100
  );

  return {
    overall: Math.round(Math.min(score, 100)),
    powerBadge: profile.powerBadge,
    followerTier: getFollowerTier(profile.followerCount),
    accountAge: getAccountAgeCategory(profile.accountAgeInDays),
    socialRank: Math.round(socialRank),
  };
};

export function useFarcasterProfile(address: `0x${string}` | undefined, skipCache = false) {
  const [profile, setProfile] = useState<FarcasterProfile | null>(null);
  const [reputation, setReputation] = useState<ReputationScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address || !isNeynarEnabled()) {
      setProfile(null);
      setReputation(null);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cacheKey = address.toLowerCase();

        // Check cache first (including negative results) unless skipCache is true
        const cached = !skipCache ? profileCache.get(cacheKey) : null;

        if (cached !== null) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Profile Cache HIT] ${address.slice(0, 6)}...${address.slice(-4)}`, cached.profile ? '✓ Profile' : '✗ No Profile');
          }
          setProfile(cached.profile);
          setReputation(cached.reputation);
          setIsLoading(false);
          return;
        }

        // Check if there's already a pending fetch for this address
        if (pendingProfileFetches.has(cacheKey)) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Profile] Deduplicating fetch for ${address.slice(0, 6)}...${address.slice(-4)}`);
          }
          const result = await pendingProfileFetches.get(cacheKey)!;
          setProfile(result.profile);
          setReputation(result.reputation);
          setIsLoading(false);
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Profile Cache MISS] ${address.slice(0, 6)}...${address.slice(-4)} - Fetching from API`);
        }

        // Create a promise for this fetch
        const fetchPromise = (async () => {
          try {

            // Fetch user by verified address using the new API
            const response = await neynarClient.fetchBulkUsers([address]);

            if (process.env.NODE_ENV === 'development') {
              console.log(`[Profile] Response for ${address.slice(0, 6)}...${address.slice(-4)}:`, response);
              console.log(`[Profile] Response keys:`, Object.keys(response || {}));
            }

            // Try both original case and lowercase
            const lowerAddress = address.toLowerCase();
            const user = response?.[address]?.[0] || response?.[lowerAddress]?.[0];

            // Gracefully handle cases where no profile exists - this is expected for most users
            if (!user) {
              if (process.env.NODE_ENV === 'development') {
                console.log(`[Profile] ${address.slice(0, 6)}...${address.slice(-4)} - No Farcaster profile found, caching negative result`);
                console.log(`[Profile] This means the wallet address is not verified on any Farcaster account`);
              }
              // Cache negative result to avoid repeated API calls
              const result = { profile: null, reputation: null };
              profileCache.set(cacheKey, result);
              return result;
            }

            // Log all user fields to see what's available
            if (process.env.NODE_ENV === 'development') {
              console.log('[Neynar User Object Keys]:', Object.keys(user));
              console.log('[Neynar Full User Object]:', user);
              console.log('[Neynar Experimental Fields]:', user.experimental);
            }

            // Calculate account age
            const registeredAt = new Date(user.timestamp);
            const now = new Date();
            const accountAgeInDays = Math.floor(
              (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60 * 24)
            );

            // Build profile
            const farcasterProfile: FarcasterProfile = {
              fid: user.fid,
              username: user.username,
              displayName: user.display_name || user.username,
              pfpUrl: user.pfp_url || '',
              pfp: user.pfp_url || '', // Alias for compatibility
              bio: user.profile?.bio?.text || '',
              followerCount: user.follower_count || 0,
              followingCount: user.following_count || 0,
              verifications: user.verified_addresses?.eth_addresses || [],
              custodyAddress: user.custody_address,
              solanaAddresses: user.verified_addresses?.sol_addresses || [],
              powerBadge: user.power_badge || false,
              accountAgeInDays,
              activeStatus: user.active_status || 'low',
              score: user.score, // Neynar user score (0-1)
            };

            if (process.env.NODE_ENV === 'development') {
              console.log(`[Profile] Found profile for ${address.slice(0, 6)}...${address.slice(-4)}:`, {
                username: farcasterProfile.username,
                fid: farcasterProfile.fid,
                verifiedAddresses: farcasterProfile.verifications,
              });
            }

            // Calculate reputation
            const reputationScore = calculateReputationScore(farcasterProfile);

            // Store in cache
            const result = { profile: farcasterProfile, reputation: reputationScore };
            profileCache.set(cacheKey, result);
            return result;
          } catch (err) {
            // Silently handle errors - most addresses won't have Farcaster profiles
            // Only log in development, not production
            if (process.env.NODE_ENV === 'development') {
              console.debug('Farcaster profile not found or API error:', err);
            }

            // Cache negative result to prevent repeated failed API calls
            const result = { profile: null, reputation: null };
            profileCache.set(cacheKey, result);
            return result;
          } finally {
            // Remove from pending fetches
            pendingProfileFetches.delete(cacheKey);
          }
        })();

        // Store the pending fetch
        pendingProfileFetches.set(cacheKey, fetchPromise);

        // Await the result
        const result = await fetchPromise;
        setProfile(result.profile);
        setReputation(result.reputation);
        setError(null);
      } catch (err) {
        // This catch is for errors in the deduplication logic itself
        console.error('Error in profile fetch coordination:', err);
        setError(null);
        setProfile(null);
        setReputation(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [address, skipCache]);

  return {
    profile,
    reputation,
    isLoading,
    error,
    hasProfile: !!profile,
  };
}

/**
 * Clear profile cache for a specific address or all addresses
 * Useful for debugging or when you know a profile was just created/updated
 */
export function clearProfileCache(address?: `0x${string}`) {
  if (address) {
    const cacheKey = address.toLowerCase();
    profileCache.delete(cacheKey);
    console.log(`[Profile Cache] Cleared cache for ${address.slice(0, 6)}...${address.slice(-4)}`);
  } else {
    profileCache.clear();
    console.log('[Profile Cache] Cleared all profile cache');
  }
}

/**
 * Debug utility to check what's in the cache for an address
 */
export function debugProfileCache(address: `0x${string}`) {
  const cacheKey = address.toLowerCase();
  const cached = profileCache.get(cacheKey);
  console.log(`[Profile Cache Debug] ${address}:`, {
    cached: !!cached,
    hasProfile: !!cached?.profile,
    username: cached?.profile?.username,
    verifiedAddresses: cached?.profile?.verifications,
  });
  return cached;
}
