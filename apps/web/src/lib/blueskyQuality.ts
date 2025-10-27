/**
 * Bluesky Quality Scoring
 *
 * Calculates user quality scores based on Bluesky profile metrics.
 * Mirrors the Neynar quality scoring system for Farcaster.
 *
 * Quality Score (0-100):
 * - Account age and legitimacy
 * - Follower count (absolute and ratio)
 * - Engagement rate
 * - Activity level
 * - Profile completeness
 */

import {
  fetchBlueskyProfile,
  fetchBlueskyPosts,
  calculateBlueskyEngagement,
  BlueskyProfile,
} from './bluesky';

export interface BlueskyQualityScore {
  overall: number; // 0-100
  breakdown: {
    accountAge: number; // 0-20
    followerCount: number; // 0-25
    engagementRate: number; // 0-25
    activityLevel: number; // 0-20
    profileCompleteness: number; // 0-10
  };
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
}

/**
 * Calculate account age score (0-20 points)
 * - 0-7 days: 0 points (new account, risky)
 * - 7-30 days: 5 points
 * - 30-90 days: 10 points
 * - 90-180 days: 15 points
 * - 180+ days: 20 points
 */
function calculateAccountAgeScore(profile: BlueskyProfile): {
  score: number;
  reason?: string;
} {
  if (!profile.indexedAt) {
    return { score: 0, reason: 'Account age unknown' };
  }

  const accountAge =
    (Date.now() - new Date(profile.indexedAt).getTime()) / (1000 * 60 * 60 * 24); // days

  if (accountAge < 7) {
    return { score: 0, reason: 'Very new account (< 7 days)' };
  } else if (accountAge < 30) {
    return { score: 5, reason: 'New account (< 1 month)' };
  } else if (accountAge < 90) {
    return { score: 10, reason: 'Account age: 1-3 months' };
  } else if (accountAge < 180) {
    return { score: 15, reason: 'Account age: 3-6 months' };
  } else {
    return { score: 20, reason: 'Established account (6+ months)' };
  }
}

/**
 * Calculate follower count score (0-25 points)
 * - 0-10 followers: 0 points (very risky)
 * - 10-50 followers: 5 points
 * - 50-100 followers: 10 points
 * - 100-500 followers: 15 points
 * - 500-1000 followers: 20 points
 * - 1000+ followers: 25 points
 *
 * Penalty if follower ratio is suspicious (following >> followers)
 */
function calculateFollowerScore(profile: BlueskyProfile): {
  score: number;
  reason?: string;
} {
  const { followersCount, followsCount } = profile;

  let score = 0;
  let reason: string | undefined;

  // Base score from follower count
  if (followersCount < 10) {
    score = 0;
    reason = 'Very few followers (< 10)';
  } else if (followersCount < 50) {
    score = 5;
    reason = 'Small following (10-50)';
  } else if (followersCount < 100) {
    score = 10;
    reason = 'Growing following (50-100)';
  } else if (followersCount < 500) {
    score = 15;
    reason = 'Solid following (100-500)';
  } else if (followersCount < 1000) {
    score = 20;
    reason = 'Strong following (500-1K)';
  } else {
    score = 25;
    reason = 'Large following (1K+)';
  }

  // Penalize suspicious follower ratios
  const followRatio =
    followersCount > 0 ? followsCount / followersCount : followsCount;

  if (followRatio > 10 && followersCount < 50) {
    // Following 10x more than followers (potential spam/bot)
    score = Math.floor(score * 0.5);
    reason = 'Suspicious follower ratio (following >> followers)';
  }

  return { score, reason };
}

/**
 * Calculate engagement rate score (0-25 points)
 * Based on likes, replies, reposts per post relative to follower count
 *
 * - 0-0.5%: 0 points (very low engagement)
 * - 0.5-1%: 5 points
 * - 1-2%: 10 points
 * - 2-5%: 15 points
 * - 5-10%: 20 points
 * - 10%+: 25 points
 */
async function calculateEngagementScore(
  profile: BlueskyProfile
): Promise<{ score: number; reason?: string }> {
  const engagementRate = await calculateBlueskyEngagement(profile.did);

  if (engagementRate < 0.5) {
    return { score: 0, reason: 'Very low engagement (< 0.5%)' };
  } else if (engagementRate < 1) {
    return { score: 5, reason: 'Low engagement (0.5-1%)' };
  } else if (engagementRate < 2) {
    return { score: 10, reason: 'Moderate engagement (1-2%)' };
  } else if (engagementRate < 5) {
    return { score: 15, reason: 'Good engagement (2-5%)' };
  } else if (engagementRate < 10) {
    return { score: 20, reason: 'Strong engagement (5-10%)' };
  } else {
    return { score: 25, reason: 'Excellent engagement (10%+)' };
  }
}

/**
 * Calculate activity level score (0-20 points)
 * Based on total posts and recent posting frequency
 *
 * - 0-10 posts: 0 points (inactive)
 * - 10-50 posts: 5 points
 * - 50-100 posts: 10 points
 * - 100-500 posts: 15 points
 * - 500+ posts: 20 points
 */
async function calculateActivityScore(
  profile: BlueskyProfile
): Promise<{ score: number; reason?: string }> {
  const { postsCount } = profile;

  if (postsCount < 10) {
    return { score: 0, reason: 'Very inactive (< 10 posts)' };
  } else if (postsCount < 50) {
    return { score: 5, reason: 'Low activity (10-50 posts)' };
  } else if (postsCount < 100) {
    return { score: 10, reason: 'Moderate activity (50-100 posts)' };
  } else if (postsCount < 500) {
    return { score: 15, reason: 'Active user (100-500 posts)' };
  } else {
    return { score: 20, reason: 'Very active user (500+ posts)' };
  }
}

/**
 * Calculate profile completeness score (0-10 points)
 * - Display name: 3 points
 * - Avatar: 3 points
 * - Bio/description: 4 points
 */
function calculateProfileCompletenessScore(profile: BlueskyProfile): {
  score: number;
  reason?: string;
} {
  let score = 0;
  const missing: string[] = [];

  if (profile.displayName) {
    score += 3;
  } else {
    missing.push('display name');
  }

  if (profile.avatar) {
    score += 3;
  } else {
    missing.push('avatar');
  }

  if (profile.description && profile.description.length > 10) {
    score += 4;
  } else {
    missing.push('bio');
  }

  const reason =
    missing.length > 0
      ? `Incomplete profile (missing: ${missing.join(', ')})`
      : 'Complete profile';

  return { score, reason };
}

/**
 * Calculate overall quality score for a Bluesky user
 */
export async function calculateBlueskyQualityScore(
  identifier: string
): Promise<BlueskyQualityScore | null> {
  try {
    const profile = await fetchBlueskyProfile(identifier);

    if (!profile) {
      return null;
    }

    // Calculate individual scores
    const accountAge = calculateAccountAgeScore(profile);
    const followerCount = calculateFollowerScore(profile);
    const engagementRate = await calculateEngagementScore(profile);
    const activityLevel = await calculateActivityScore(profile);
    const profileCompleteness = calculateProfileCompletenessScore(profile);

    // Calculate overall score (sum of all components)
    const overall =
      accountAge.score +
      followerCount.score +
      engagementRate.score +
      activityLevel.score +
      profileCompleteness.score;

    // Determine tier
    let tier: 'HIGH' | 'MEDIUM' | 'LOW';
    if (overall >= 70) {
      tier = 'HIGH';
    } else if (overall >= 40) {
      tier = 'MEDIUM';
    } else {
      tier = 'LOW';
    }

    // Collect reasons
    const reasons: string[] = [
      accountAge.reason,
      followerCount.reason,
      engagementRate.reason,
      activityLevel.reason,
      profileCompleteness.reason,
    ].filter((r): r is string => r !== undefined);

    return {
      overall,
      breakdown: {
        accountAge: accountAge.score,
        followerCount: followerCount.score,
        engagementRate: engagementRate.score,
        activityLevel: activityLevel.score,
        profileCompleteness: profileCompleteness.score,
      },
      tier,
      reasons,
    };
  } catch (error) {
    console.error('Error calculating Bluesky quality score:', error);
    return null;
  }
}

/**
 * Batch calculate quality scores for multiple users
 */
export async function batchCalculateBlueskyQuality(
  identifiers: string[]
): Promise<Map<string, BlueskyQualityScore>> {
  const results = new Map<string, BlueskyQualityScore>();

  await Promise.all(
    identifiers.map(async (identifier) => {
      const score = await calculateBlueskyQualityScore(identifier);
      if (score) {
        results.set(identifier, score);
      }
    })
  );

  return results;
}

/**
 * Check if a user meets minimum quality thresholds
 */
export function meetsQualityThreshold(
  score: BlueskyQualityScore,
  minimumScore: number = 30
): { passes: boolean; reason?: string } {
  if (score.overall < minimumScore) {
    return {
      passes: false,
      reason: `Quality score too low (${score.overall}/${minimumScore})`,
    };
  }

  // Additional checks
  if (score.breakdown.accountAge === 0) {
    return {
      passes: false,
      reason: 'Account too new (< 7 days)',
    };
  }

  if (score.breakdown.followerCount === 0) {
    return {
      passes: false,
      reason: 'Insufficient followers (< 10)',
    };
  }

  return { passes: true };
}
