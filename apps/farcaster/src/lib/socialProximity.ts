/**
 * Social Proximity Scoring for Micro-Lending Risk Assessment
 *
 * Based on research from Kiva and Grameen Bank:
 * - Borrowers with 20+ friend/family lenders: 98% repayment rate
 * - Borrowers with 0 friend/family lenders: 88% repayment rate
 * - 10% improvement just from social proximity!
 */

import { neynarClient } from './neynar';

export interface SocialProximityScore {
  mutualFollows: number;           // Count of mutual connections (raw)
  effectiveMutuals: number;        // Quality-weighted mutual connections
  socialDistance: number;           // 0-100 score (higher = closer)
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  borrowerFollowers: number;
  lenderFollowers: number;
  percentOverlap: number;           // Percentage of overlap in networks
  userQuality?: number;             // Average Neynar quality score (0-1)
  qualityTier?: 'HIGH' | 'MEDIUM' | 'LOW'; // Quality classification
}

/**
 * Calculate array intersection (mutual follows)
 */
function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item));
}

/**
 * Calculate array union (all unique follows)
 */
function union<T>(arr1: T[], arr2: T[]): T[] {
  return Array.from(new Set([...arr1, ...arr2]));
}

/**
 * Calculate social proximity between two Farcaster users
 * @param borrowerFid Borrower's Farcaster ID
 * @param lenderFid Lender's Farcaster ID
 * @param borrowerScore Optional Neynar user quality score (0-1, filters spam/bots)
 * @param lenderScore Optional Neynar user quality score (0-1, filters spam/bots)
 * @returns Social proximity score with risk assessment
 */
export async function calculateSocialProximity(
  borrowerFid: number,
  lenderFid: number,
  borrowerScore?: number,
  lenderScore?: number
): Promise<SocialProximityScore> {
  try {
    // Fetch social graphs for both users in parallel
    const [
      borrowerFollowers,
      borrowerFollowing,
      lenderFollowers,
      lenderFollowing,
    ] = await Promise.all([
      neynarClient.fetchFollowers(borrowerFid),
      neynarClient.fetchFollowing(borrowerFid),
      neynarClient.fetchFollowers(lenderFid),
      neynarClient.fetchFollowing(lenderFid),
    ]);

    // Combine followers + following for each user to get their full network
    const borrowerNetwork = union(borrowerFollowers, borrowerFollowing);
    const lenderNetwork = union(lenderFollowers, lenderFollowing);

    // Find mutual connections
    const mutualConnections = intersection(borrowerNetwork, lenderNetwork);
    const mutualCount = mutualConnections.length;

    // Calculate overlap percentage
    const totalUnique = union(borrowerNetwork, lenderNetwork).length;
    const percentOverlap = totalUnique > 0 ? (mutualCount / totalUnique) * 100 : 0;

    // Quality weighting (uses Neynar user scores to filter spam/bots)
    // Default to 0.7 if not provided (neutral quality assumption)
    const avgQuality = borrowerScore !== undefined && lenderScore !== undefined
      ? (borrowerScore + lenderScore) / 2
      : 0.7;

    // Quality-adjusted mutual connections
    // Example: 20 mutuals × 0.9 quality = 18 "effective" mutuals (high quality)
    //          20 mutuals × 0.3 quality = 6 "effective" mutuals (low quality/spam)
    const effectiveMutuals = mutualCount * avgQuality;

    // Calculate social distance score (0-100, higher = closer)
    let socialDistance = 0;

    // Base score from quality-adjusted mutual connections (up to 60 points)
    // Research: 20+ connections = 98% repayment vs 88% with 0 connections
    // Now weighted by account quality to prevent spam/bot gaming
    if (effectiveMutuals >= 18) {  // Was 20, now quality-adjusted
      socialDistance += 60;
    } else if (effectiveMutuals >= 9) {  // Was 10
      socialDistance += 50;
    } else if (effectiveMutuals >= 4.5) {  // Was 5
      socialDistance += 35;
    } else if (effectiveMutuals >= 2.5) {  // Was 3
      socialDistance += 20;
    } else if (effectiveMutuals >= 0.8) {  // Was 1
      socialDistance += 10;
    }

    // Bonus for high overlap percentage (up to 30 points)
    if (percentOverlap > 10) {
      socialDistance += Math.min(percentOverlap * 3, 30);
    }

    // Bonus if lender follows borrower (shows interest, up to 10 points)
    const lenderFollowsBorrower = lenderFollowing.includes(borrowerFid);
    const borrowerFollowsLender = borrowerFollowing.includes(lenderFid);

    if (lenderFollowsBorrower && borrowerFollowsLender) {
      socialDistance += 10; // Mutual follow = strongest signal
    } else if (lenderFollowsBorrower || borrowerFollowsLender) {
      socialDistance += 5;  // One-way follow = moderate signal
    }

    // Cap at 100
    socialDistance = Math.min(socialDistance, 100);

    // Determine risk tier based on research-backed thresholds
    // Now uses quality-adjusted mutuals for more accurate risk assessment
    let riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
    if (effectiveMutuals >= 9 || socialDistance >= 60) {
      riskTier = 'LOW';     // Similar to Kiva's 20+ friend lenders (quality-adjusted)
    } else if (effectiveMutuals >= 2.5 || socialDistance >= 30) {
      riskTier = 'MEDIUM';  // Some social connection
    } else {
      riskTier = 'HIGH';    // Similar to Kiva's 0 friend lenders
    }

    // Determine quality tier for user transparency
    let qualityTier: 'HIGH' | 'MEDIUM' | 'LOW' | undefined;
    if (avgQuality >= 0.7) {
      qualityTier = 'HIGH';   // Trusted, active accounts
    } else if (avgQuality >= 0.4) {
      qualityTier = 'MEDIUM'; // Average accounts
    } else if (avgQuality < 0.7) {
      qualityTier = 'LOW';    // Potential spam/bots
    }

    return {
      mutualFollows: mutualCount,
      effectiveMutuals: Math.round(effectiveMutuals * 10) / 10, // Round to 1 decimal
      socialDistance,
      riskTier,
      borrowerFollowers: borrowerFollowers.length,
      lenderFollowers: lenderFollowers.length,
      percentOverlap,
      userQuality: avgQuality,
      qualityTier,
    };
  } catch (error) {
    console.error('[Social Proximity] Error calculating proximity:', error);

    // Return default "no connection" score on error
    return {
      mutualFollows: 0,
      effectiveMutuals: 0,
      socialDistance: 0,
      riskTier: 'HIGH',
      borrowerFollowers: 0,
      lenderFollowers: 0,
      percentOverlap: 0,
    };
  }
}

/**
 * Batch calculate social proximity for multiple lenders
 * Useful for showing "who in my network knows this borrower"
 */
export async function calculateBatchProximity(
  borrowerFid: number,
  lenderFids: number[]
): Promise<Map<number, SocialProximityScore>> {
  const results = new Map<number, SocialProximityScore>();

  // Calculate in parallel
  const promises = lenderFids.map(async (lenderFid) => {
    const score = await calculateSocialProximity(borrowerFid, lenderFid);
    results.set(lenderFid, score);
  });

  await Promise.all(promises);
  return results;
}

/**
 * Get human-readable risk description
 */
export function getSocialRiskDescription(score: SocialProximityScore): string {
  const { mutualFollows, riskTier } = score;

  if (riskTier === 'LOW') {
    return `${mutualFollows} mutual connections - Highly trusted in your network`;
  } else if (riskTier === 'MEDIUM') {
    return `${mutualFollows} mutual connections - Some shared network`;
  } else {
    return mutualFollows > 0
      ? `${mutualFollows} mutual connections - Limited shared network`
      : 'No mutual connections - New to your network';
  }
}

/**
 * Get emoji indicator for risk tier
 */
export function getRiskEmoji(riskTier: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (riskTier) {
    case 'LOW':
      return '🟢';
    case 'MEDIUM':
      return '🟡';
    case 'HIGH':
      return '🔴';
  }
}
