/**
 * Bluesky AT Protocol API Client
 *
 * Provides functions to interact with Bluesky's decentralized social network
 * for fetching user profiles, social graphs, and engagement metrics.
 */

import { BskyAgent, AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api';

// Initialize Bluesky agent (public API access, no auth required for reads)
const agent = new BskyAgent({
  service: 'https://public.api.bsky.app',
});

// Cache for API responses (5 minute TTL)
const cache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Generic cache wrapper
 */
function withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.data);
  }

  return fn().then((data) => {
    cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
    return data;
  });
}

export interface BlueskyProfile {
  did: string;
  handle: string;
  displayName?: string;
  description?: string;
  avatar?: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  indexedAt?: string;
  labels?: string[];
}

export interface BlueskyFollower {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  description?: string;
}

export interface BlueskyPost {
  uri: string;
  cid: string;
  text: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  quoteCount: number;
}

/**
 * Fetch a Bluesky profile by handle or DID
 */
export async function fetchBlueskyProfile(
  identifier: string
): Promise<BlueskyProfile | null> {
  return withCache(`profile:${identifier}`, async () => {
    try {
      const response = await agent.getProfile({ actor: identifier });

      if (!response.success) {
        console.error('Failed to fetch Bluesky profile:', response);
        return null;
      }

      const profile = response.data;

      return {
        did: profile.did,
        handle: profile.handle,
        displayName: profile.displayName,
        description: profile.description,
        avatar: profile.avatar,
        followersCount: profile.followersCount ?? 0,
        followsCount: profile.followsCount ?? 0,
        postsCount: profile.postsCount ?? 0,
        indexedAt: profile.indexedAt,
        labels: profile.labels?.map((l) => l.val) ?? [],
      };
    } catch (error) {
      console.error('Error fetching Bluesky profile:', error);
      return null;
    }
  });
}

/**
 * Fetch followers of a Bluesky user
 */
export async function fetchBlueskyFollowers(
  did: string,
  limit: number = 100,
  cursor?: string
): Promise<{ followers: BlueskyFollower[]; cursor?: string }> {
  const cacheKey = `followers:${did}:${limit}:${cursor || 'start'}`;

  return withCache(cacheKey, async () => {
    try {
      const response = await agent.getFollowers({
        actor: did,
        limit,
        cursor,
      });

      if (!response.success) {
        console.error('Failed to fetch Bluesky followers:', response);
        return { followers: [] };
      }

      const followers = response.data.followers.map((follower) => ({
        did: follower.did,
        handle: follower.handle,
        displayName: follower.displayName,
        avatar: follower.avatar,
        description: follower.description,
      }));

      return {
        followers,
        cursor: response.data.cursor,
      };
    } catch (error) {
      console.error('Error fetching Bluesky followers:', error);
      return { followers: [] };
    }
  });
}

/**
 * Fetch following (accounts a user follows) of a Bluesky user
 */
export async function fetchBlueskyFollowing(
  did: string,
  limit: number = 100,
  cursor?: string
): Promise<{ following: BlueskyFollower[]; cursor?: string }> {
  const cacheKey = `following:${did}:${limit}:${cursor || 'start'}`;

  return withCache(cacheKey, async () => {
    try {
      const response = await agent.getFollows({
        actor: did,
        limit,
        cursor,
      });

      if (!response.success) {
        console.error('Failed to fetch Bluesky following:', response);
        return { following: [] };
      }

      const following = response.data.follows.map((follow) => ({
        did: follow.did,
        handle: follow.handle,
        displayName: follow.displayName,
        avatar: follow.avatar,
        description: follow.description,
      }));

      return {
        following,
        cursor: response.data.cursor,
      };
    } catch (error) {
      console.error('Error fetching Bluesky following:', error);
      return { following: [] };
    }
  });
}

/**
 * Fetch ALL followers (paginated)
 */
export async function fetchAllBlueskyFollowers(
  did: string,
  maxPages: number = 10
): Promise<BlueskyFollower[]> {
  const allFollowers: BlueskyFollower[] = [];
  let cursor: string | undefined = undefined;
  let pageCount = 0;

  while (pageCount < maxPages) {
    const { followers, cursor: nextCursor } = await fetchBlueskyFollowers(
      did,
      100,
      cursor
    );

    allFollowers.push(...followers);

    if (!nextCursor) break;
    cursor = nextCursor;
    pageCount++;
  }

  return allFollowers;
}

/**
 * Fetch ALL following (paginated)
 */
export async function fetchAllBlueskyFollowing(
  did: string,
  maxPages: number = 10
): Promise<BlueskyFollower[]> {
  const allFollowing: BlueskyFollower[] = [];
  let cursor: string | undefined = undefined;
  let pageCount = 0;

  while (pageCount < maxPages) {
    const { following, cursor: nextCursor } = await fetchBlueskyFollowing(
      did,
      100,
      cursor
    );

    allFollowing.push(...following);

    if (!nextCursor) break;
    cursor = nextCursor;
    pageCount++;
  }

  return allFollowing;
}

/**
 * Fetch mutual connections (Known Followers endpoint)
 * This is Bluesky's built-in mutual connections API
 */
export async function fetchBlueskyMutualConnections(
  viewerDid: string,
  targetDid: string,
  limit: number = 50
): Promise<BlueskyFollower[]> {
  const cacheKey = `mutuals:${viewerDid}:${targetDid}:${limit}`;

  return withCache(cacheKey, async () => {
    try {
      // First, get the target's followers
      const { followers } = await fetchBlueskyFollowers(targetDid, limit);

      // Then, get the viewer's following
      const { following } = await fetchBlueskyFollowing(viewerDid, limit);

      // Find intersection (mutual connections)
      const followingDids = new Set(following.map((f) => f.did));
      const mutuals = followers.filter((follower) =>
        followingDids.has(follower.did)
      );

      return mutuals;
    } catch (error) {
      console.error('Error fetching Bluesky mutual connections:', error);
      return [];
    }
  });
}

/**
 * Fetch a user's posts with engagement metrics
 */
export async function fetchBlueskyPosts(
  did: string,
  limit: number = 50,
  cursor?: string
): Promise<{ posts: BlueskyPost[]; cursor?: string }> {
  const cacheKey = `posts:${did}:${limit}:${cursor || 'start'}`;

  return withCache(cacheKey, async () => {
    try {
      const response = await agent.getAuthorFeed({
        actor: did,
        limit,
        cursor,
      });

      if (!response.success) {
        console.error('Failed to fetch Bluesky posts:', response);
        return { posts: [] };
      }

      const posts = response.data.feed
        .map((item) => {
          const post = item.post;

          // Type guard for post record
          if (!AppBskyFeedDefs.isPostView(post)) {
            return null;
          }

          return {
            uri: post.uri,
            cid: post.cid,
            text: (post.record as any)?.text || '',
            createdAt: post.indexedAt,
            likeCount: post.likeCount ?? 0,
            replyCount: post.replyCount ?? 0,
            repostCount: post.repostCount ?? 0,
            quoteCount: post.quoteCount ?? 0,
          };
        })
        .filter((post): post is BlueskyPost => post !== null);

      return {
        posts,
        cursor: response.data.cursor,
      };
    } catch (error) {
      console.error('Error fetching Bluesky posts:', error);
      return { posts: [] };
    }
  });
}

/**
 * Calculate engagement rate for a user
 */
export async function calculateBlueskyEngagement(
  did: string
): Promise<number> {
  const cacheKey = `engagement:${did}`;

  return withCache(cacheKey, async () => {
    try {
      const profile = await fetchBlueskyProfile(did);
      if (!profile) return 0;

      const { posts } = await fetchBlueskyPosts(did, 50);

      if (posts.length === 0) return 0;

      // Calculate average engagement per post
      const totalEngagement = posts.reduce(
        (sum, post) =>
          sum + post.likeCount + post.replyCount + post.repostCount,
        0
      );

      const avgEngagementPerPost = totalEngagement / posts.length;

      // Normalize by follower count (engagement rate)
      const engagementRate =
        profile.followersCount > 0
          ? (avgEngagementPerPost / profile.followersCount) * 100
          : 0;

      return Math.min(engagementRate, 100); // Cap at 100%
    } catch (error) {
      console.error('Error calculating Bluesky engagement:', error);
      return 0;
    }
  });
}

/**
 * Check if a user follows another user
 */
export async function checkBlueskyFollowsUser(
  viewerDid: string,
  targetDid: string
): Promise<boolean> {
  try {
    const { following } = await fetchBlueskyFollowing(viewerDid, 100);
    return following.some((f) => f.did === targetDid);
  } catch (error) {
    console.error('Error checking Bluesky follows:', error);
    return false;
  }
}

/**
 * Resolve handle to DID
 */
export async function resolveBlueskyHandle(handle: string): Promise<string | null> {
  return withCache(`resolve:${handle}`, async () => {
    try {
      const response = await agent.resolveHandle({ handle });

      if (!response.success) {
        console.error('Failed to resolve Bluesky handle:', response);
        return null;
      }

      return response.data.did;
    } catch (error) {
      console.error('Error resolving Bluesky handle:', error);
      return null;
    }
  });
}
