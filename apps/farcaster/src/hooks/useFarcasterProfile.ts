'use client';

import { useState, useEffect } from 'react';
import { neynarClient, isNeynarEnabled } from '@/lib/neynar';

export interface FarcasterProfile {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  verifications: string[]; // Verified wallet addresses
  powerBadge: boolean;
  accountAgeInDays: number;
  activeStatus: 'very_active' | 'active' | 'moderate' | 'low';
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

export function useFarcasterProfile(address: `0x${string}` | undefined) {
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
        // Fetch user by verified address using the new API
        const response = await neynarClient.fetchBulkUsers([address]);

        // Gracefully handle cases where no profile exists - this is expected for most users
        if (!response || !response[address] || response[address].length === 0) {
          setProfile(null);
          setReputation(null);
          setError(null); // Clear any previous errors
          return;
        }

        // Get the first user associated with this address
        const user = response[address][0];

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
          bio: user.profile?.bio?.text || '',
          followerCount: user.follower_count || 0,
          followingCount: user.following_count || 0,
          verifications: user.verified_addresses?.eth_addresses || [],
          powerBadge: user.power_badge || false,
          accountAgeInDays,
          activeStatus: user.active_status || 'low',
        };

        setProfile(farcasterProfile);

        // Calculate reputation
        const reputationScore = calculateReputationScore(farcasterProfile);
        setReputation(reputationScore);
      } catch (err) {
        // Silently handle errors - most addresses won't have Farcaster profiles
        // Only log in development, not production
        if (process.env.NODE_ENV === 'development') {
          console.debug('Farcaster profile not found or API error:', err);
        }
        setError(null); // Don't expose errors to the component
        setProfile(null);
        setReputation(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [address]);

  return {
    profile,
    reputation,
    isLoading,
    error,
    hasProfile: !!profile,
  };
}
