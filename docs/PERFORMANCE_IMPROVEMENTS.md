# Performance Improvements - In-Memory Caching Implementation

**Date:** 2025-10-17
**Author:** Claude
**Status:** In Progress

## Executive Summary

This document outlines the performance improvements being implemented for LendFriend, focusing on adding in-memory caching to reduce API calls and improve page load times.

## Problem Statement

### Current Issues

1. **N+1 Query Problem**
   - For 20 loans on the homepage → 60+ network requests
   - Each loan card makes 3 separate requests:
     - Blockchain data (multicall)
     - Farcaster profile (Neynar API)
     - IPFS metadata (Pinata gateway)

2. **Slow Page Loads**
   - Neynar API calls: 500-1000ms each
   - IPFS fetches: 1000-3000ms each
   - Total: 5-10 seconds for full page load

3. **Wasted API Calls**
   - Same borrower appears in multiple loans → fetched multiple times
   - Same metadata fetched on every page visit
   - No caching between page navigations

### Impact

- **User Experience:** Slow, janky page loads
- **API Costs:** Unnecessary Neynar API usage
- **Scalability:** Won't scale beyond 50 concurrent users

## Solution: In-Memory Caching Layer

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Component Layer                        │
│  (LoanList, LoanCard, LoanDetails)                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Hook Layer                              │
│  (useFarcasterProfile, useLoanData)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   🆕 CACHE LAYER                            │
│  (profileCache, metadataCache)                              │
│  - In-memory Map storage                                    │
│  - TTL-based expiration                                     │
│  - Automatic cleanup                                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  (Neynar API, IPFS, Blockchain RPC)                        │
└─────────────────────────────────────────────────────────────┘
```

### Cache Strategy

| Data Type | Cache? | TTL | Reasoning |
|-----------|--------|-----|-----------|
| Farcaster Profiles | ✅ Yes | 10 min | Rarely changes, expensive API |
| IPFS Metadata | ✅ Yes | 30 min | Immutable, slow to fetch |
| Loan Blockchain Data | ❌ No | N/A | Changes frequently (funding) |
| User Balances | ❌ No | N/A | Real-time required |
| User Contributions | ❌ No | N/A | Real-time required |

## Implementation Plan

### Phase 1: Core Cache Infrastructure

#### File 1: `apps/farcaster/src/lib/cache.ts` (NEW)

**Purpose:** Generic cache implementation with TTL support

**Code:**
```typescript
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
```

**Why this design:**
- Generic class allows reuse for different data types
- TTL ensures data doesn't get stale
- maxSize prevents memory leaks
- cleanup() prevents accumulation of expired entries
- Simple API: get/set/has/clear

---

### Phase 2: Integrate Cache into Farcaster Profile Hook

#### File 2: `apps/farcaster/src/hooks/useFarcasterProfile.ts` (MODIFIED)

**Changes:**
1. Import cache
2. Check cache before API call
3. Store result in cache after fetch

**Modified sections:**

```typescript
// ADD AT TOP:
import { profileCache } from '@/lib/cache';

// MODIFY fetchProfile function inside useEffect:
const fetchProfile = async () => {
  setIsLoading(true);
  setError(null);

  try {
    // 🆕 CHECK CACHE FIRST
    const cacheKey = address.toLowerCase();
    const cached = profileCache.get(cacheKey);

    if (cached) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Profile Cache HIT] ${address.slice(0, 6)}...${address.slice(-4)}`);
      }
      setProfile(cached.profile);
      setReputation(cached.reputation);
      setIsLoading(false);
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Profile Cache MISS] ${address.slice(0, 6)}...${address.slice(-4)}`);
    }

    // Fetch user by verified address using the new API
    const response = await neynarClient.fetchBulkUsers([address]);

    // ... existing profile building code ...

    // 🆕 STORE IN CACHE
    profileCache.set(cacheKey, {
      profile: farcasterProfile,
      reputation: reputationScore,
    });

    setProfile(farcasterProfile);
    setReputation(reputationScore);
  } catch (err) {
    // ... existing error handling ...
  } finally {
    setIsLoading(false);
  }
};
```

**Impact:**
- ✅ Subsequent profile loads: instant (0ms instead of 500-1000ms)
- ✅ Same borrower in multiple loans: 1 API call instead of N
- ✅ Page navigation back to home: cached profiles

---

### Phase 3: Add IPFS Metadata Caching

#### File 3: `apps/farcaster/src/lib/ipfs.ts` (NEW)

**Purpose:** Centralized IPFS fetching with caching and fallback gateways

```typescript
import { metadataCache } from './cache';

/**
 * Multiple IPFS gateways for redundancy
 * If one fails, try the next
 */
const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
];

/**
 * Convert ipfs:// URI to HTTP gateway URL
 */
export function ipfsToHttp(uri: string, gatewayIndex: number = 0): string {
  if (!uri.startsWith('ipfs://')) {
    return uri; // Already HTTP or other protocol
  }

  const hash = uri.replace('ipfs://', '');
  return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
}

/**
 * Fetch from IPFS with caching and fallback gateways
 *
 * @param uri - IPFS URI (ipfs://Qm...) or HTTP URL
 * @param timeout - Request timeout in milliseconds
 * @returns Parsed JSON data
 */
export async function fetchFromIPFS<T = any>(
  uri: string,
  timeout: number = 5000
): Promise<T> {
  // 🆕 CHECK CACHE FIRST
  const cacheKey = uri.toLowerCase();
  const cached = metadataCache.get(cacheKey);

  if (cached) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[IPFS Cache HIT] ${uri.slice(0, 20)}...`);
    }
    return cached;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[IPFS Cache MISS] ${uri.slice(0, 20)}...`);
  }

  // Try each gateway in sequence
  let lastError: Error | null = null;

  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    try {
      const url = ipfsToHttp(uri, i);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // 🆕 STORE IN CACHE
      metadataCache.set(cacheKey, data);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[IPFS Success] Gateway ${i + 1}/${IPFS_GATEWAYS.length}`);
      }

      return data;

    } catch (error: any) {
      lastError = error;

      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[IPFS Gateway ${i + 1}/${IPFS_GATEWAYS.length} Failed]`,
          error.message
        );
      }

      // If this isn't the last gateway, continue to next
      if (i < IPFS_GATEWAYS.length - 1) {
        continue;
      }
    }
  }

  // All gateways failed
  throw new Error(
    `Failed to fetch from IPFS after trying ${IPFS_GATEWAYS.length} gateways: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Fetch image from IPFS with caching
 * Returns blob URL for display
 */
export async function fetchImageFromIPFS(
  uri: string,
  timeout: number = 10000
): Promise<string> {
  const cacheKey = `img:${uri.toLowerCase()}`;
  const cached = metadataCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  // Try each gateway
  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    try {
      const url = ipfsToHttp(uri, i);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      metadataCache.set(cacheKey, blobUrl);
      return blobUrl;

    } catch (error) {
      if (i < IPFS_GATEWAYS.length - 1) continue;
    }
  }

  throw new Error('Failed to fetch image from IPFS');
}
```

**Impact:**
- ✅ IPFS metadata: instant on repeat loads
- ✅ Fallback gateways: better reliability
- ✅ Timeout handling: no hanging requests

---

### Phase 4: Update LoanDetails to Use IPFS Utility

#### File 4: `apps/farcaster/src/components/LoanDetails.tsx` (MODIFIED)

**Change:** Replace inline IPFS fetching with cached utility

**Before:**
```typescript
fetch(metadataUrl, { signal: controller.signal })
  .then(res => res.json())
  .then(data => setMetadata(data))
```

**After:**
```typescript
import { fetchFromIPFS } from '@/lib/ipfs';

// In useEffect:
fetchFromIPFS(loanData.metadataURI)
  .then(data => setMetadata(data))
  .catch(err => {
    console.error('Error loading metadata:', err);
    setMetadata({ name: 'Community Loan', description: 'Metadata not available' });
  })
```

---

### Phase 5: Add Cache Monitoring (Development Only)

#### File 5: `apps/farcaster/src/components/CacheStats.tsx` (NEW)

**Purpose:** Display cache statistics in development mode

```typescript
'use client';

import { useEffect, useState } from 'react';
import { profileCache, metadataCache } from '@/lib/cache';

export default function CacheStats() {
  const [stats, setStats] = useState({ profiles: 0, metadata: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        profiles: profileCache.stats().size,
        metadata: metadataCache.stats().size,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-3 rounded-lg font-mono">
      <div className="font-bold mb-1">Cache Stats</div>
      <div>Profiles: {stats.profiles}</div>
      <div>Metadata: {stats.metadata}</div>
    </div>
  );
}
```

**Add to:** `apps/farcaster/src/app/layout.tsx`
```typescript
import CacheStats from '@/components/CacheStats';

// In layout:
<body>
  <Providers>
    <Navbar />
    {children}
    <CacheStats /> {/* 🆕 Add this */}
  </Providers>
</body>
```

---

## Expected Performance Improvements

### Before Caching

| Action | Requests | Time |
|--------|----------|------|
| Load homepage (20 loans) | 60+ | 8-12s |
| View loan detail | 3 | 2-4s |
| Navigate back to home | 60+ | 8-12s |
| **Total** | **123+** | **18-28s** |

### After Caching

| Action | Requests | Time |
|--------|----------|------|
| Load homepage (20 loans) - first time | 60+ | 8-12s |
| View loan detail - cached profiles | 1 | 0.5-1s |
| Navigate back to home - all cached | 20 (just blockchain) | 1-2s |
| **Total** | **81** | **9.5-15s** |

**Improvement:** 34% fewer requests, 40% faster overall

### Cache Hit Rates (Projected)

After 10 minutes of use:
- Profile cache hit rate: ~80% (same borrowers appear often)
- Metadata cache hit rate: ~90% (metadata immutable)

## Migration Path to Vercel KV (Future)

When you're ready to upgrade (100+ DAU):

1. Install Vercel KV:
```bash
npm install @vercel/kv
```

2. Replace cache implementations:
```typescript
// Old:
import { profileCache } from '@/lib/cache';
const cached = profileCache.get(key);

// New:
import { kv } from '@vercel/kv';
const cached = await kv.get(key);
```

3. No other code changes needed!

## Testing Plan

### Manual Testing

1. **Cache Miss → Hit**
   - Load homepage (watch console for "Cache MISS")
   - Reload page (watch for "Cache HIT")
   - Verify: Faster load time

2. **Profile Caching**
   - Same borrower in multiple loans
   - Verify: Only 1 Neynar API call

3. **IPFS Caching**
   - View loan detail
   - Navigate away and back
   - Verify: Instant metadata load

4. **Cache Expiration**
   - Wait 11 minutes
   - Reload page
   - Verify: Fresh API calls made

### Automated Testing (Future)

```typescript
// Example test
describe('Profile Cache', () => {
  it('should return cached profile on second call', () => {
    const address = '0x123...';

    profileCache.set(address, mockProfile);
    const result = profileCache.get(address);

    expect(result).toEqual(mockProfile);
  });

  it('should expire after TTL', async () => {
    profileCache.set('0x123', mockProfile);

    // Wait for TTL + 1ms
    await sleep(10 * 60 * 1000 + 1);

    expect(profileCache.get('0x123')).toBeNull();
  });
});
```

## Monitoring & Debugging

### Development Console Logs

```
[Profile Cache MISS] 0x1234...5678
[Profile Cache HIT] 0x1234...5678
[IPFS Cache MISS] ipfs://Qm...
[IPFS Cache HIT] ipfs://Qm...
[Cache Cleanup] Removed 5 profiles, 12 metadata
```

### Production Monitoring (Future)

Consider adding:
- Cache hit/miss metrics to Vercel Analytics
- Error tracking for failed IPFS fetches
- Performance monitoring for cache effectiveness

## Risks & Limitations

### Known Limitations

1. **Cache clears on deploy**
   - First load after deploy will be slow
   - Acceptable for MVP

2. **Cold start clears cache**
   - Serverless functions sleep after 5min
   - Next request after sleep = cache miss
   - Acceptable for low traffic

3. **No cache sharing between functions**
   - Each serverless instance has separate cache
   - Reduces effectiveness at high concurrency
   - Migrate to Vercel KV when this becomes an issue

### Risk Mitigation

1. **Stale data**
   - TTL of 10min means profiles could be 10min old
   - Acceptable: profiles don't change often
   - Users can hard refresh if needed

2. **Memory leaks**
   - maxSize cap prevents unbounded growth
   - cleanup() removes expired entries
   - Monitor in production

3. **Cache invalidation**
   - No manual invalidation implemented
   - If needed, can add `profileCache.clear()` endpoint

## Success Metrics

Track these after deployment:

- [ ] Average page load time < 3s (down from 8-12s)
- [ ] Profile API calls reduced by 70%+
- [ ] IPFS requests reduced by 80%+
- [ ] No increase in error rates
- [ ] No memory leaks (monitor cache size)

## Rollout Plan

### Phase 1: Development Testing (Day 1)
- Implement all changes
- Test locally
- Verify cache hit/miss in console

### Phase 2: Staging Deploy (Day 2)
- Deploy to preview branch
- Test with real data
- Monitor cache stats

### Phase 3: Production Deploy (Day 3)
- Deploy to main branch
- Monitor performance
- Watch for errors

### Phase 4: Monitor (Week 1)
- Track cache hit rates
- Monitor API usage
- Gather user feedback

### Phase 5: Optimize (Week 2+)
- Adjust TTL values if needed
- Add more caching if beneficial
- Plan migration to Vercel KV

## Files Changed

### New Files
- `apps/farcaster/src/lib/cache.ts` (Core cache implementation)
- `apps/farcaster/src/lib/ipfs.ts` (IPFS utilities with caching)
- `apps/farcaster/src/components/CacheStats.tsx` (Dev-only monitoring)
- `docs/PERFORMANCE_IMPROVEMENTS.md` (This file)

### Modified Files
- `apps/farcaster/src/hooks/useFarcasterProfile.ts` (Add caching)
- `apps/farcaster/src/components/LoanDetails.tsx` (Use IPFS utility)
- `apps/farcaster/src/app/layout.tsx` (Add CacheStats component)

### No Changes Required
- Smart contracts (no changes)
- Database/backend (no backend yet)
- Environment variables (no new vars needed)

## Questions & Answers

**Q: Will this work on Vercel?**
A: Yes! In-memory cache works perfectly on Vercel serverless functions.

**Q: What happens when I deploy?**
A: Cache clears. First load after deploy will be slow, then fast again.

**Q: Do I need Redis/external cache?**
A: Not for MVP. Upgrade to Vercel KV when you have 100+ daily users.

**Q: Can users have stale data?**
A: Yes, up to 10min old for profiles. Acceptable trade-off for performance.

**Q: How do I clear cache manually?**
A: Deploy a new version OR add cache.clear() endpoint if needed.

**Q: Will this increase memory usage?**
A: Slightly, but capped at ~500 profiles + 1000 metadata = ~5MB max.

---

## Next Steps

After this implementation:

1. **Test thoroughly** - Verify cache hit/miss in console
2. **Monitor performance** - Track page load times
3. **Gather feedback** - Ask users if it feels faster
4. **Plan Vercel KV migration** - When you hit 100+ DAU

---

**Ready to implement?** All code is documented above. Implementation will take ~30 minutes.
