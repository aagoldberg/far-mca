'use client';

import { useFarcasterProfile } from './useFarcasterProfile';
import { useWalletActivity } from './useWalletActivity';
import { useENSProfile } from './useENSProfile';

export interface EnhancedReputationScore {
  overall: number; // 0-100
  farcasterScore: number; // 0-60 (weighted from original 0-100)
  walletScore: number; // 0-40 (from wallet activity)
  breakdown: {
    // Farcaster components (60 points total)
    powerBadge: number; // 0-24
    followers: number; // 0-18
    accountAge: number; // 0-12
    engagement: number; // 0-6

    // Wallet components (40 points total)
    walletAge: number; // 0-12
    walletActivity: number; // 0-12
    recentActivity: number; // 0-8
    balance: number; // 0-8
  };
  badges: {
    hasPowerBadge: boolean;
    hasENS: boolean;
    isVerified: boolean;
  };
}

/**
 * Comprehensive reputation score combining Farcaster social reputation
 * and on-chain wallet activity
 */
export function useReputationScore(address: `0x${string}` | undefined) {
  const { profile, reputation: farcasterRep, isLoading: farcasterLoading } = useFarcasterProfile(address);
  const { activityScore, isLoading: walletLoading } = useWalletActivity(address);
  const { hasENS } = useENSProfile(address);

  const isLoading = farcasterLoading || walletLoading;

  // Calculate enhanced reputation score
  if (!address) {
    return {
      score: null,
      isLoading: false,
      hasFarcaster: false,
      hasWalletActivity: false,
    };
  }

  // Calculate Farcaster score (weighted to 60 points)
  let farcasterScore = 0;
  let breakdown = {
    powerBadge: 0,
    followers: 0,
    accountAge: 0,
    engagement: 0,
    walletAge: 0,
    walletActivity: 0,
    recentActivity: 0,
    balance: 0,
  };

  if (farcasterRep) {
    // Power Badge: 24 points (40% of original 60)
    breakdown.powerBadge = farcasterRep.powerBadge ? 24 : 0;

    // Followers: 18 points max (30% of original 60)
    breakdown.followers = Math.min((profile!.followerCount / 1000) * 10 * 0.6, 18);

    // Account Age: 12 points max (20% of original 60)
    breakdown.accountAge = Math.min((profile!.accountAgeInDays / 365) * 20 * 0.6, 12);

    // Engagement: 6 points max (10% of original 60)
    if (profile!.followerCount > 0) {
      const ratio = profile!.followingCount / profile!.followerCount;
      if (ratio >= 0.1 && ratio <= 2.0) {
        breakdown.engagement = 6;
      } else if (ratio >= 0.05 && ratio <= 5.0) {
        breakdown.engagement = 3;
      }
    }

    farcasterScore = breakdown.powerBadge + breakdown.followers + breakdown.accountAge + breakdown.engagement;
  }

  // Calculate wallet score (40 points)
  let walletScore = 0;
  if (activityScore) {
    // Use the wallet activity breakdown to distribute 40 points
    breakdown.walletAge = activityScore.breakdown.ageScore * 0.4; // 30 * 0.4 = 12 max
    breakdown.walletActivity = activityScore.breakdown.activityScore * 0.4; // 30 * 0.4 = 12 max
    breakdown.recentActivity = activityScore.breakdown.recentScore * 0.4; // 20 * 0.4 = 8 max
    breakdown.balance = activityScore.breakdown.balanceScore * 0.4; // 20 * 0.4 = 8 max

    walletScore = breakdown.walletAge + breakdown.walletActivity + breakdown.recentActivity + breakdown.balance;
  }

  const overallScore = Math.round(farcasterScore + walletScore);

  const enhancedScore: EnhancedReputationScore = {
    overall: overallScore,
    farcasterScore: Math.round(farcasterScore),
    walletScore: Math.round(walletScore),
    breakdown: {
      powerBadge: Math.round(breakdown.powerBadge),
      followers: Math.round(breakdown.followers),
      accountAge: Math.round(breakdown.accountAge),
      engagement: Math.round(breakdown.engagement),
      walletAge: Math.round(breakdown.walletAge),
      walletActivity: Math.round(breakdown.walletActivity),
      recentActivity: Math.round(breakdown.recentActivity),
      balance: Math.round(breakdown.balance),
    },
    badges: {
      hasPowerBadge: !!farcasterRep?.powerBadge,
      hasENS: hasENS,
      isVerified: !!profile,
    },
  };

  return {
    score: enhancedScore,
    isLoading,
    hasFarcaster: !!profile,
    hasWalletActivity: !!activityScore,
  };
}
