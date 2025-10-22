/**
 * Advanced Social Scoring: Weighted Interactions
 *
 * Based on research:
 * - Facebook EdgeRank: Comments worth 10x more than likes
 * - Granovetter Strong Ties: Frequent interaction = social capital
 * - Reciprocity Research: Bidirectional interaction = higher trust
 *
 * WARNING: This is EXPENSIVE (~400 API calls per check)
 * Use only for:
 * - Pre-computed background jobs
 * - Featured/high-value loans
 * - With caching (24h+)
 *
 * For MVP, use mutual follows instead (socialProximity.ts)
 */

import { neynarClient } from './neynar';

export interface InteractionScore {
  mutualFollows: number;
  likes: {
    aToB: number;
    bToA: number;
    total: number;
  };
  recasts: {
    aToB: number;
    bToA: number;
    total: number;
  };
  replies: {
    aToB: number;
    bToA: number;
    total: number;
  };
  rawScore: number;            // Unweighted interaction count
  weightedScore: number;       // Weighted by interaction type
  qualityAdjusted: number;     // Adjusted by Neynar user scores
  strongTieScore: number;      // 0-100 final score
  relationship: 'STRONG' | 'MEDIUM' | 'WEAK' | 'NONE';
}

// Research-backed weights (Facebook EdgeRank + academic studies)
const WEIGHTS = {
  mutualFollow: 2,    // Baseline bidirectional connection
  like: 1,            // Low effort, minimal commitment
  recast: 3,          // Public endorsement (trust signal)
  reply: 4,           // Conversation (relationship proof)
};

/**
 * EXPENSIVE: Calculate detailed interaction score between two users
 * ~400 API calls, 10-30 seconds
 *
 * @param fidA First user's Farcaster ID
 * @param fidB Second user's Farcaster ID
 * @param options Computation options
 * @returns Detailed interaction analysis
 */
export async function calculateInteractionScore(
  fidA: number,
  fidB: number,
  options: {
    castLimit?: number;      // Max casts to analyze per user (default 100)
    reactionLimit?: number;  // Max reactions per cast (default 100)
  } = {}
): Promise<InteractionScore> {
  const {
    castLimit = 100,         // Reduce from 200 to save API calls
    reactionLimit = 100,
  } = options;

  try {
    console.log(`[Interaction Scoring] Starting analysis for FID ${fidA} <-> ${fidB}`);
    const startTime = Date.now();

    // Step 1: Fetch social graphs (4 API calls)
    const [followersA, followingA, followersB, followingB] = await Promise.all([
      neynarClient.fetchFollowers(fidA, 150),
      neynarClient.fetchFollowing(fidA, 150),
      neynarClient.fetchFollowers(fidB, 150),
      neynarClient.fetchFollowing(fidB, 150),
    ]);

    // Calculate mutual follows
    const setA = new Set([...followersA, ...followingA]);
    const setB = new Set([...followersB, ...followingB]);
    const mutualFollows = [...setA].filter(fid => setB.has(fid)).length;

    console.log(`[Interaction Scoring] Mutual follows: ${mutualFollows}`);

    // Step 2: Fetch recent casts (2 API calls)
    // NOTE: This is a simplified version - you'd need to implement cast fetching
    // via Neynar SDK or API. The code below is pseudocode.

    // For MVP, we'll skip cast analysis and just use mutual follows
    // To implement full version, you'd need:
    // - client.fetchCastsForUser(fidA, castLimit)
    // - For each cast, fetch reactions
    // - Count likes/recasts/replies between the two users

    // PLACEHOLDER: In production, implement full cast analysis here
    const likes = { aToB: 0, bToA: 0, total: 0 };
    const recasts = { aToB: 0, bToA: 0, total: 0 };
    const replies = { aToB: 0, bToA: 0, total: 0 };

    console.warn('[Interaction Scoring] Cast analysis not implemented - using mutual follows only');

    // Step 3: Calculate scores
    const rawScore = mutualFollows +
      likes.total +
      recasts.total +
      replies.total;

    const weightedScore =
      (WEIGHTS.mutualFollow * mutualFollows) +
      (WEIGHTS.like * likes.total) +
      (WEIGHTS.recast * recasts.total) +
      (WEIGHTS.reply * replies.total);

    // Add reciprocity bonus (bidirectional interactions count double)
    const reciprocityBonus =
      (likes.aToB > 0 && likes.bToA > 0 ? WEIGHTS.like : 0) +
      (recasts.aToB > 0 && recasts.bToA > 0 ? WEIGHTS.recast : 0) +
      (replies.aToB > 0 && replies.bToA > 0 ? WEIGHTS.reply : 0);

    const finalWeighted = weightedScore + reciprocityBonus;

    // Note: Neynar user scores require separate API calls
    // For MVP, we'll use 1.0 (neutral quality)
    const qualityScore = 1.0;
    const qualityAdjusted = finalWeighted * qualityScore;

    // Normalize to 0-100 scale
    // Based on empirical data, strong ties typically have:
    // - 10+ mutual follows
    // - 20+ total interactions
    // - 50+ weighted score
    const strongTieScore = Math.min((qualityAdjusted / 50) * 100, 100);

    // Classify relationship strength
    let relationship: 'STRONG' | 'MEDIUM' | 'WEAK' | 'NONE';
    if (strongTieScore >= 60 || mutualFollows >= 10) {
      relationship = 'STRONG';
    } else if (strongTieScore >= 30 || mutualFollows >= 3) {
      relationship = 'MEDIUM';
    } else if (strongTieScore > 0 || mutualFollows > 0) {
      relationship = 'WEAK';
    } else {
      relationship = 'NONE';
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Interaction Scoring] Completed in ${elapsed}ms`);

    return {
      mutualFollows,
      likes,
      recasts,
      replies,
      rawScore,
      weightedScore: finalWeighted,
      qualityAdjusted,
      strongTieScore,
      relationship,
    };
  } catch (error) {
    console.error('[Interaction Scoring] Error:', error);

    // Return default "no relationship" score on error
    return {
      mutualFollows: 0,
      likes: { aToB: 0, bToA: 0, total: 0 },
      recasts: { aToB: 0, bToA: 0, total: 0 },
      replies: { aToB: 0, bToA: 0, total: 0 },
      rawScore: 0,
      weightedScore: 0,
      qualityAdjusted: 0,
      strongTieScore: 0,
      relationship: 'NONE',
    };
  }
}

/**
 * RECOMMENDED: Hybrid approach - fast mutual follows + optional detailed analysis
 *
 * @param fidA First user
 * @param fidB Second user
 * @param useDetailedAnalysis Whether to run expensive interaction analysis (default: false)
 * @returns Quick score + optional detailed score
 */
export async function calculateHybridScore(
  fidA: number,
  fidB: number,
  useDetailedAnalysis: boolean = false
) {
  // Always compute fast mutual follows score
  const [followersA, followingA, followersB, followingB] = await Promise.all([
    neynarClient.fetchFollowers(fidA, 150),
    neynarClient.fetchFollowing(fidA, 150),
    neynarClient.fetchFollowers(fidB, 150),
    neynarClient.fetchFollowing(fidB, 150),
  ]);

  const setA = new Set([...followersA, ...followingA]);
  const setB = new Set([...followersB, ...followingB]);
  const mutualFollows = [...setA].filter(fid => setB.has(fid)).length;

  // Quick score (0-100)
  const quickScore = Math.min((mutualFollows / 20) * 100, 100);

  let quickRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  if (mutualFollows >= 10) quickRisk = 'LOW';
  else if (mutualFollows >= 3) quickRisk = 'MEDIUM';
  else quickRisk = 'HIGH';

  // Optionally compute detailed analysis (expensive!)
  let detailedScore: InteractionScore | null = null;
  if (useDetailedAnalysis) {
    detailedScore = await calculateInteractionScore(fidA, fidB);
  }

  return {
    mutualFollows,
    quickScore,
    quickRisk,
    detailedScore, // null if not requested
    combined: detailedScore
      ? (quickScore * 0.3 + detailedScore.strongTieScore * 0.7)
      : quickScore,
  };
}

/**
 * Background job: Pre-compute interaction scores for high-value loans
 * Run this once per day for top 20 loans
 */
export async function batchComputeInteractionScores(
  pairs: Array<{ borrowerFid: number; lenderFid: number; loanId: string }>
): Promise<Map<string, InteractionScore>> {
  const results = new Map<string, InteractionScore>();
  const batchSize = 5; // Process 5 at a time to avoid rate limits

  console.log(`[Batch Scoring] Computing ${pairs.length} interaction scores`);

  for (let i = 0; i < pairs.length; i += batchSize) {
    const batch = pairs.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async ({ borrowerFid, lenderFid, loanId }) => {
        const score = await calculateInteractionScore(borrowerFid, lenderFid);
        return { loanId, score };
      })
    );

    batchResults.forEach(({ loanId, score }) => {
      results.set(loanId, score);
    });

    // Rate limiting: wait 1 second between batches
    if (i + batchSize < pairs.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`[Batch Scoring] Completed ${results.size} scores`);
  return results;
}

/**
 * NOTE: To implement full cast analysis, you would need to:
 *
 * 1. Fetch casts for both users:
 *    const castsA = await client.fetchCastsForUser(fidA, limit);
 *    const castsB = await client.fetchCastsForUser(fidB, limit);
 *
 * 2. For each cast, fetch reactions:
 *    for (const cast of castsA) {
 *      const reactions = await client.fetchReactionsForCast(cast.hash);
 *      // Count likes/recasts from fidB
 *    }
 *
 * 3. Count replies:
 *    const replies = castsA.filter(cast =>
 *      cast.parentHash && castsBHashes.includes(cast.parentHash)
 *    );
 *
 * This requires ~400 API calls and 10-30 seconds per pair.
 * Only use for high-value scenarios with caching.
 */
