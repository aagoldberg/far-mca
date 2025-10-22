// Neynar API client using fetch (browser-compatible)
const NEYNAR_API_BASE = 'https://api.neynar.com/v2';
const neynarApiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

if (!neynarApiKey || neynarApiKey === 'your_neynar_api_key_here') {
  console.warn('NEXT_PUBLIC_NEYNAR_API_KEY is not set. Neynar features will be disabled.');
}

// In-memory cache with TTL
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request deduplication: track in-flight requests
const pendingRequests = new Map<string, Promise<any>>();

function getCacheKey(addresses: string[]): string {
  return addresses.map(a => a.toLowerCase()).sort().join(',');
}

function getCachedData(addresses: string[]) {
  const key = getCacheKey(addresses);
  const entry = cache.get(key);

  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    console.log('[Neynar] Cache hit for:', addresses);
    return entry.data;
  }

  return null;
}

function setCachedData(addresses: string[], data: any) {
  const key = getCacheKey(addresses);
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export const neynarClient = {
  isEnabled: () => !!neynarApiKey && neynarApiKey !== 'your_neynar_api_key_here',

  async fetchBulkUsers(addresses: string[]) {
    if (!this.isEnabled()) {
      console.warn('[Neynar] API key not configured');
      return null;
    }

    if (addresses.length === 0) {
      return null;
    }

    // Check cache first
    const cachedData = getCachedData(addresses);
    if (cachedData !== null) {
      return cachedData;
    }

    // Check if there's already a pending request for these addresses
    const key = getCacheKey(addresses);
    if (pendingRequests.has(key)) {
      console.log('[Neynar] Deduplicating request for:', addresses);
      return pendingRequests.get(key);
    }

    // Create new request
    const requestPromise = (async () => {
      try {
        // Use the correct Neynar API endpoint for bulk user lookup by Ethereum address
        const params = new URLSearchParams();
        addresses.forEach(addr => params.append('addresses', addr.toLowerCase()));

        const url = `${NEYNAR_API_BASE}/farcaster/user/bulk-by-address?${params.toString()}`;

        const response = await fetch(url, {
          headers: {
            'accept': 'application/json',
            'api_key': neynarApiKey!,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();

          // Silently handle 404s - most addresses won't have Farcaster profiles
          // Cache the null result to avoid repeated requests
          if (response.status === 404) {
            setCachedData(addresses, null);
            return null;
          }

          // Log other errors (not 404s)
          console.error('[Neynar] API error:', response.status, errorText);

          // Don't cache rate limit errors
          if (response.status === 429) {
            console.warn('[Neynar] Rate limit exceeded - consider upgrading plan or reducing requests');
            return null;
          }

          return null;
        }

        const data = await response.json();

        // Cache successful response
        setCachedData(addresses, data);

        return data;
      } catch (error) {
        // Silently handle network errors
        if (process.env.NODE_ENV === 'development') {
          console.debug('Error fetching Neynar user data:', error);
        }
        return null;
      } finally {
        // Remove from pending requests
        pendingRequests.delete(key);
      }
    })();

    // Store pending request
    pendingRequests.set(key, requestPromise);

    return requestPromise;
  },

  /**
   * Fetch followers for a given FID
   * @param fid Farcaster ID
   * @param limit Max number of followers to fetch (default 150, max 1000)
   * @returns Array of FIDs who follow this user
   */
  async fetchFollowers(fid: number, limit: number = 150): Promise<number[]> {
    if (!this.isEnabled()) {
      console.warn('[Neynar] API key not configured');
      return [];
    }

    const cacheKey = `followers:${fid}:${limit}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const url = `${NEYNAR_API_BASE}/farcaster/followers?fid=${fid}&limit=${limit}`;

      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'api_key': neynarApiKey!,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return [];
        console.error('[Neynar] Error fetching followers:', response.status);
        return [];
      }

      const data = await response.json();
      const followerFids = data.users?.map((user: any) => user.fid) || [];

      // Cache the result
      cache.set(cacheKey, {
        data: followerFids,
        timestamp: Date.now(),
      });

      return followerFids;
    } catch (error) {
      console.debug('[Neynar] Error fetching followers:', error);
      return [];
    }
  },

  /**
   * Fetch users that a given FID is following
   * @param fid Farcaster ID
   * @param limit Max number to fetch (default 150, max 1000)
   * @returns Array of FIDs that this user follows
   */
  async fetchFollowing(fid: number, limit: number = 150): Promise<number[]> {
    if (!this.isEnabled()) {
      console.warn('[Neynar] API key not configured');
      return [];
    }

    const cacheKey = `following:${fid}:${limit}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const url = `${NEYNAR_API_BASE}/farcaster/following?fid=${fid}&limit=${limit}`;

      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'api_key': neynarApiKey!,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return [];
        console.error('[Neynar] Error fetching following:', response.status);
        return [];
      }

      const data = await response.json();
      const followingFids = data.users?.map((user: any) => user.fid) || [];

      // Cache the result
      cache.set(cacheKey, {
        data: followingFids,
        timestamp: Date.now(),
      });

      return followingFids;
    } catch (error) {
      console.debug('[Neynar] Error fetching following:', error);
      return [];
    }
  },
};

// Helper to check if Neynar is available
export const isNeynarEnabled = () => neynarClient.isEnabled();
