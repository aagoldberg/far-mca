// OpenRank API client for Farcaster reputation scores
const OPENRANK_API_BASE = 'https://graph.cast.k3l.io';

interface OpenRankScore {
  fid: number;
  score: number;
  rank?: number;
}

// In-memory cache with TTL
interface CacheEntry {
  data: OpenRankScore;
  timestamp: number;
}

const cache = new Map<number, CacheEntry>();
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours (matches OpenRank update frequency)

export const openRankClient = {
  async getScoreByFID(fid: number): Promise<OpenRankScore | null> {
    try {
      // Check cache first
      const cached = cache.get(fid);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[OpenRank] Cache hit for FID ${fid}`);
        }
        return cached.data;
      }

      // Fetch from API
      const response = await fetch(`${OPENRANK_API_BASE}/scores/global/engagement/fids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([fid]),
      });

      if (!response.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[OpenRank] API error: ${response.status}`);
        }
        return null;
      }

      const data = await response.json();

      // Response is an array of results
      if (Array.isArray(data) && data.length > 0) {
        const result = data[0];
        const scoreData: OpenRankScore = {
          fid: result.fid,
          score: result.score || 0,
          rank: result.rank,
        };

        // Cache the result
        cache.set(fid, {
          data: scoreData,
          timestamp: Date.now(),
        });

        return scoreData;
      }

      return null;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[OpenRank] Error fetching score:', error);
      }
      return null;
    }
  },
};
