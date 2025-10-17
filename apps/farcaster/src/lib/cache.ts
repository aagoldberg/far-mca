/**
 * Simple in-memory cache with TTL support
 * Suitable for Vercel serverless environment
 *
 * Limitations:
 * - Cache clears on deployment
 * - Cache clears after ~5min of function inactivity
 * - Each serverless function instance has separate cache
 *
 * For production with high traffic, migrate to Vercel KV (Redis)
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number;
  private maxSize: number;

  /**
   * @param ttl Time to live in milliseconds
   * @param maxSize Maximum number of entries (prevents memory leaks)
   */
  constructor(ttl: number, maxSize: number = 1000) {
    this.ttl = ttl;
    this.maxSize = maxSize;
  }

  /**
   * Get value from cache
   * Returns null if not found or expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set value in cache
   * Automatically evicts oldest entries if maxSize exceeded
   */
  set(key: string, data: T): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics for debugging
   */
  stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
    };
  }

  /**
   * Remove expired entries (garbage collection)
   * Call periodically to prevent memory leaks
   */
  cleanup(): number {
    let removed = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }
}

// Export singleton instances for different data types

/**
 * Cache for Farcaster profiles
 * TTL: 10 minutes (profiles don't change often)
 * Max: 500 profiles (reasonable for community app)
 */
export const profileCache = new SimpleCache<any>(
  10 * 60 * 1000, // 10 minutes
  500
);

/**
 * Cache for IPFS metadata
 * TTL: 30 minutes (metadata is immutable)
 * Max: 1000 entries (metadata is small)
 */
export const metadataCache = new SimpleCache<any>(
  30 * 60 * 1000, // 30 minutes
  1000
);

/**
 * Cleanup interval - runs every 5 minutes
 * Prevents memory leaks from expired entries
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const profilesRemoved = profileCache.cleanup();
    const metadataRemoved = metadataCache.cleanup();

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache Cleanup] Removed ${profilesRemoved} profiles, ${metadataRemoved} metadata`);
    }
  }, 5 * 60 * 1000);
}
