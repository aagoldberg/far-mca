/**
 * Bluesky Social Proximity Calculation
 *
 * Measures "friendship intimacy" between two Bluesky users based on:
 * - Mutual connections (raw count)
 * - Quality-weighted mutual connections
 * - Network overlap percentage
 * - Social distance score (0-100)
 * - Risk tier classification
 *
 * Mirrors the Farcaster proximity calculation system.
 */

import {
  fetchBlueskyProfile,
  fetchBlueskyMutualConnections,
  fetchAllBlueskyFollowers,
  fetchAllBlueskyFollowing,
  BlueskyFollower,
} from './bluesky';
import {
  calculateBlueskyQualityScore,
  batchCalculateBlueskyQuality,
  BlueskyQualityScore,
} from './blueskyQuality';

export interface BlueskyProximityScore {
  lenderDid: string;
  lenderHandle: string;
  borrowerDid: string;
  borrowerHandle: string;
  mutualConnections: number;
  effectiveMutuals: number; // Quality-weighted
  socialDistance: number; // 0-100 (100 = closest)
  networkOverlap: number; // Percentage
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  qualityBreakdown: {
    lender: BlueskyQualityScore | null;
    borrower: BlueskyQualityScore | null;
    mutuals: {
      high: number; // Mutuals with quality score >= 70
      medium: number; // Mutuals with quality score 40-69
      low: number; // Mutuals with quality score < 40
    };
  };
  recommendation: {
    trustLevel: 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY LOW';
    reasoning: string[];
    suggestedLoanLimit?: string;
  };
}

/**
 * Calculate network overlap percentage
 * What % of the borrower's network does the lender also follow?
 */
async function calculateNetworkOverlap(
  lenderDid: string,
  borrowerDid: string
): Promise<number> {
  try {
    const [lenderFollowing, borrowerFollowing] = await Promise.all([
      fetchAllBlueskyFollowing(lenderDid, 5), // Max 500 following
      fetchAllBlueskyFollowing(borrowerDid, 5),
    ]);

    if (borrowerFollowing.length === 0) return 0;

    const lenderFollowingDids = new Set(lenderFollowing.map((f) => f.did));
    const overlap = borrowerFollowing.filter((f) =>
      lenderFollowingDids.has(f.did)
    ).length;

    return (overlap / borrowerFollowing.length) * 100;
  } catch (error) {
    console.error('Error calculating network overlap:', error);
    return 0;
  }
}

/**
 * Calculate quality-weighted mutual connections
 * High-quality mutuals count more than low-quality mutuals
 *
 * Weights:
 * - High quality (70+): 1.0x weight
 * - Medium quality (40-69): 0.5x weight
 * - Low quality (<40): 0.2x weight
 */
async function calculateEffectiveMutuals(
  mutuals: BlueskyFollower[]
): Promise<{
  effectiveMutuals: number;
  breakdown: { high: number; medium: number; low: number };
}> {
  if (mutuals.length === 0) {
    return {
      effectiveMutuals: 0,
      breakdown: { high: 0, medium: 0, low: 0 },
    };
  }

  // Get quality scores for all mutuals
  const mutualDids = mutuals.map((m) => m.did);
  const qualityScores = await batchCalculateBlueskyQuality(mutualDids);

  let effectiveMutuals = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  mutuals.forEach((mutual) => {
    const quality = qualityScores.get(mutual.did);

    if (!quality) {
      // If we can't get quality score, assume low quality
      effectiveMutuals += 0.2;
      low++;
      return;
    }

    if (quality.overall >= 70) {
      effectiveMutuals += 1.0;
      high++;
    } else if (quality.overall >= 40) {
      effectiveMutuals += 0.5;
      medium++;
    } else {
      effectiveMutuals += 0.2;
      low++;
    }
  });

  return {
    effectiveMutuals: Math.round(effectiveMutuals * 10) / 10, // Round to 1 decimal
    breakdown: { high, medium, low },
  };
}

/**
 * Calculate social distance score (0-100)
 *
 * Factors:
 * - Mutual connections (60% weight)
 * - Network overlap (20% weight)
 * - Quality of lender and borrower (20% weight)
 *
 * Higher score = closer connection = lower risk
 */
function calculateSocialDistance(
  mutualConnections: number,
  effectiveMutuals: number,
  networkOverlap: number,
  lenderQuality: BlueskyQualityScore | null,
  borrowerQuality: BlueskyQualityScore | null
): number {
  // Mutual connections score (0-60 points)
  // Uses effective mutuals (quality-weighted)
  let mutualsScore = 0;
  if (effectiveMutuals >= 50) mutualsScore = 60;
  else if (effectiveMutuals >= 20) mutualsScore = 50;
  else if (effectiveMutuals >= 10) mutualsScore = 40;
  else if (effectiveMutuals >= 5) mutualsScore = 30;
  else if (effectiveMutuals >= 3) mutualsScore = 20;
  else if (effectiveMutuals >= 1) mutualsScore = 10;
  else mutualsScore = 0;

  // Network overlap score (0-20 points)
  let overlapScore = 0;
  if (networkOverlap >= 50) overlapScore = 20;
  else if (networkOverlap >= 30) overlapScore = 15;
  else if (networkOverlap >= 20) overlapScore = 10;
  else if (networkOverlap >= 10) overlapScore = 5;
  else overlapScore = 0;

  // Quality score (0-20 points)
  // Average of lender and borrower quality
  const avgQuality =
    ((lenderQuality?.overall || 0) + (borrowerQuality?.overall || 0)) / 2;
  const qualityScore = Math.min((avgQuality / 100) * 20, 20);

  const total = mutualsScore + overlapScore + qualityScore;

  return Math.min(Math.round(total), 100);
}

/**
 * Determine risk tier based on social distance and mutual count
 */
function determineRiskTier(
  socialDistance: number,
  mutualConnections: number,
  effectiveMutuals: number
): 'LOW' | 'MEDIUM' | 'HIGH' {
  // LOW RISK: Strong connection
  if (socialDistance >= 60 && effectiveMutuals >= 10) {
    return 'LOW';
  }

  // MEDIUM RISK: Moderate connection
  if (
    (socialDistance >= 40 && effectiveMutuals >= 5) ||
    (socialDistance >= 50 && effectiveMutuals >= 3)
  ) {
    return 'MEDIUM';
  }

  // HIGH RISK: Weak or no connection
  return 'HIGH';
}

/**
 * Generate trust recommendation
 */
function generateRecommendation(
  score: Omit<BlueskyProximityScore, 'recommendation'>
): BlueskyProximityScore['recommendation'] {
  const reasoning: string[] = [];
  let trustLevel: BlueskyProximityScore['recommendation']['trustLevel'];
  let suggestedLoanLimit: string | undefined;

  // Analyze mutuals
  if (score.mutualConnections === 0) {
    reasoning.push('No mutual connections found');
  } else if (score.mutualConnections >= 20) {
    reasoning.push(`Strong network overlap (${score.mutualConnections} mutuals)`);
  } else if (score.mutualConnections >= 5) {
    reasoning.push(`Moderate connections (${score.mutualConnections} mutuals)`);
  } else {
    reasoning.push(`Weak connection (${score.mutualConnections} mutuals)`);
  }

  // Analyze quality of mutuals
  if (score.qualityBreakdown.mutuals.high >= 5) {
    reasoning.push(
      `${score.qualityBreakdown.mutuals.high} high-quality mutual connections`
    );
  } else if (score.qualityBreakdown.mutuals.high >= 2) {
    reasoning.push(
      `${score.qualityBreakdown.mutuals.high} high-quality mutuals`
    );
  }

  // Analyze borrower quality
  const borrowerQuality = score.qualityBreakdown.borrower;
  if (borrowerQuality) {
    if (borrowerQuality.overall >= 70) {
      reasoning.push('High-quality borrower profile');
    } else if (borrowerQuality.overall < 30) {
      reasoning.push('Low-quality borrower profile (risk factor)');
    }
  }

  // Determine trust level and loan limit
  if (score.riskTier === 'LOW') {
    trustLevel = score.socialDistance >= 80 ? 'VERY HIGH' : 'HIGH';
    suggestedLoanLimit = '$500-2000';
    reasoning.push('Recommendation: Safe to lend with standard terms');
  } else if (score.riskTier === 'MEDIUM') {
    trustLevel = score.socialDistance >= 50 ? 'MEDIUM' : 'LOW';
    suggestedLoanLimit = '$100-500';
    reasoning.push(
      'Recommendation: Consider lending with cautious terms or collateral'
    );
  } else {
    trustLevel = 'VERY LOW';
    suggestedLoanLimit = '$50-100';
    reasoning.push(
      'Recommendation: High risk - only lend small amounts or require strong collateral'
    );
  }

  return {
    trustLevel,
    reasoning,
    suggestedLoanLimit,
  };
}

/**
 * Calculate social proximity score between a lender and borrower
 */
export async function calculateBlueskyProximity(
  lenderIdentifier: string,
  borrowerIdentifier: string
): Promise<BlueskyProximityScore | null> {
  try {
    // Fetch profiles
    const [lenderProfile, borrowerProfile] = await Promise.all([
      fetchBlueskyProfile(lenderIdentifier),
      fetchBlueskyProfile(borrowerIdentifier),
    ]);

    if (!lenderProfile || !borrowerProfile) {
      console.error('Could not fetch Bluesky profiles');
      return null;
    }

    // Fetch mutual connections
    const mutuals = await fetchBlueskyMutualConnections(
      lenderProfile.did,
      borrowerProfile.did,
      100
    );

    // Calculate quality scores
    const [lenderQuality, borrowerQuality] = await Promise.all([
      calculateBlueskyQualityScore(lenderProfile.did),
      calculateBlueskyQualityScore(borrowerProfile.did),
    ]);

    // Calculate effective mutuals (quality-weighted)
    const { effectiveMutuals, breakdown } =
      await calculateEffectiveMutuals(mutuals);

    // Calculate network overlap
    const networkOverlap = await calculateNetworkOverlap(
      lenderProfile.did,
      borrowerProfile.did
    );

    // Calculate social distance
    const socialDistance = calculateSocialDistance(
      mutuals.length,
      effectiveMutuals,
      networkOverlap,
      lenderQuality,
      borrowerQuality
    );

    // Determine risk tier
    const riskTier = determineRiskTier(
      socialDistance,
      mutuals.length,
      effectiveMutuals
    );

    // Build score object (without recommendation first)
    const scoreWithoutRec: Omit<BlueskyProximityScore, 'recommendation'> = {
      lenderDid: lenderProfile.did,
      lenderHandle: lenderProfile.handle,
      borrowerDid: borrowerProfile.did,
      borrowerHandle: borrowerProfile.handle,
      mutualConnections: mutuals.length,
      effectiveMutuals,
      socialDistance,
      networkOverlap: Math.round(networkOverlap * 10) / 10,
      riskTier,
      qualityBreakdown: {
        lender: lenderQuality,
        borrower: borrowerQuality,
        mutuals: breakdown,
      },
    };

    // Generate recommendation
    const recommendation = generateRecommendation(scoreWithoutRec);

    return {
      ...scoreWithoutRec,
      recommendation,
    };
  } catch (error) {
    console.error('Error calculating Bluesky proximity:', error);
    return null;
  }
}

/**
 * Quick proximity check (lighter version without full quality scoring)
 * Useful for displaying basic trust indicators in lists
 */
export async function quickBlueskyProximityCheck(
  lenderIdentifier: string,
  borrowerIdentifier: string
): Promise<{
  mutualConnections: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
} | null> {
  try {
    const [lenderProfile, borrowerProfile] = await Promise.all([
      fetchBlueskyProfile(lenderIdentifier),
      fetchBlueskyProfile(borrowerIdentifier),
    ]);

    if (!lenderProfile || !borrowerProfile) {
      return null;
    }

    const mutuals = await fetchBlueskyMutualConnections(
      lenderProfile.did,
      borrowerProfile.did,
      50 // Lower limit for quick check
    );

    let riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
    if (mutuals.length >= 10) {
      riskTier = 'LOW';
    } else if (mutuals.length >= 3) {
      riskTier = 'MEDIUM';
    } else {
      riskTier = 'HIGH';
    }

    return {
      mutualConnections: mutuals.length,
      riskTier,
    };
  } catch (error) {
    console.error('Error in quick Bluesky proximity check:', error);
    return null;
  }
}
