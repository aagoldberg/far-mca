// Gitcoin Passport API client for human verification scores
const PASSPORT_API_BASE = 'https://api.passport.xyz';
const passportApiKey = process.env.NEXT_PUBLIC_GITCOIN_PASSPORT_API_KEY;
const passportScorerId = process.env.NEXT_PUBLIC_GITCOIN_PASSPORT_SCORER_ID;

if (!passportApiKey || passportApiKey === 'your_gitcoin_api_key_here') {
  console.warn('NEXT_PUBLIC_GITCOIN_PASSPORT_API_KEY is not set. Gitcoin Passport features will be disabled.');
}

if (!passportScorerId || passportScorerId === 'your_scorer_id_here') {
  console.warn('NEXT_PUBLIC_GITCOIN_PASSPORT_SCORER_ID is not set. Gitcoin Passport features will be disabled.');
}

export interface GitcoinPassportScore {
  address: string;
  score: number;
  passing_score: boolean;
  threshold: number;
  last_score_timestamp: string;
}

// In-memory cache with TTL
interface CacheEntry {
  data: GitcoinPassportScore;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const gitcoinPassportClient = {
  isEnabled: () =>
    !!passportApiKey &&
    passportApiKey !== 'your_gitcoin_api_key_here' &&
    !!passportScorerId &&
    passportScorerId !== 'your_scorer_id_here',

  async getScore(address: string): Promise<GitcoinPassportScore | null> {
    if (!this.isEnabled()) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Gitcoin Passport] API key or Scorer ID not configured');
      }
      return null;
    }

    try {
      // Check cache first
      const cacheKey = address.toLowerCase();
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Gitcoin Passport] Cache hit for ${address.slice(0, 6)}...`);
        }
        return cached.data;
      }

      // Fetch from API
      const url = `${PASSPORT_API_BASE}/v2/stamps/${passportScorerId}/score/${address}`;
      const response = await fetch(url, {
        headers: {
          'X-API-KEY': passportApiKey!,
        },
      });

      if (!response.ok) {
        // Silently handle 404s - not all addresses have Gitcoin Passports
        if (response.status === 404) {
          return null;
        }

        if (process.env.NODE_ENV === 'development') {
          console.debug(`[Gitcoin Passport] API error: ${response.status}`);
        }
        return null;
      }

      const data = await response.json();

      const scoreData: GitcoinPassportScore = {
        address: data.address,
        score: parseFloat(data.score) || 0,
        passing_score: data.passing_score || false,
        threshold: parseFloat(data.threshold) || 20,
        last_score_timestamp: data.last_score_timestamp,
      };

      // Cache the result
      cache.set(cacheKey, {
        data: scoreData,
        timestamp: Date.now(),
      });

      return scoreData;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Gitcoin Passport] Error fetching score:', error);
      }
      return null;
    }
  },
};

// Helper to check if Gitcoin Passport is available
export const isGitcoinPassportEnabled = () => gitcoinPassportClient.isEnabled();
