# LendFriend Documentation

This directory contains technical documentation for the LendFriend project.

## Available Documentation

### [PERFORMANCE_IMPROVEMENTS.md](./PERFORMANCE_IMPROVEMENTS.md)
**Status:** ✅ Implemented (2025-10-17)

Comprehensive documentation of the in-memory caching system implemented to improve performance.

**Key Changes:**
- Added in-memory caching layer for Farcaster profiles (10min TTL)
- Added IPFS metadata caching (30min TTL)
- Implemented fallback gateway system for IPFS
- Added development-only cache statistics overlay
- **Expected improvement:** 34% fewer network requests, 40% faster page loads

**Files Modified:**
- `apps/farcaster/src/lib/cache.ts` (NEW)
- `apps/farcaster/src/lib/ipfs.ts` (NEW)
- `apps/farcaster/src/components/CacheStats.tsx` (NEW)
- `apps/farcaster/src/hooks/useFarcasterProfile.ts` (MODIFIED)
- `apps/farcaster/src/components/LoanDetails.tsx` (MODIFIED)
- `apps/farcaster/src/app/layout.tsx` (MODIFIED)

## Testing the Changes

### 1. Check Dev Server
Open your browser dev console and look for cache logs:
```
[Profile Cache MISS] 0x1234...5678
[Profile Cache HIT] 0x1234...5678
[IPFS Cache MISS] ipfs://Qm...
[IPFS Cache HIT] ipfs://Qm...
```

### 2. View Cache Stats
In development mode, you'll see a small overlay in the bottom-right corner showing:
- Number of cached profiles
- Number of cached IPFS metadata entries

### 3. Test Performance
1. Load homepage - observe initial load time
2. Reload page - observe faster load (cache hits)
3. Navigate to loan detail - observe faster metadata loading
4. Navigate back to home - observe instant profile loads

### 4. Test Fallback Gateways
If Pinata is slow/down, the system will automatically try:
1. Pinata (primary)
2. ipfs.io (fallback 1)
3. Cloudflare IPFS (fallback 2)

## Migration to Vercel KV (Future)

When you reach 100+ daily active users, upgrade to Vercel KV:

```bash
# 1. Install Vercel KV
npm install @vercel/kv

# 2. Enable in Vercel dashboard
# Storage → KV → Create Database

# 3. Replace cache imports
# OLD: import { profileCache } from '@/lib/cache';
# NEW: import { kv } from '@vercel/kv';
```

See `PERFORMANCE_IMPROVEMENTS.md` for full migration guide.

## Next Steps

1. Monitor cache hit rates in development
2. Gather user feedback on performance
3. Track Neynar API usage (should decrease by 70%+)
4. Consider adding more caching for other data types

## Questions?

Refer to `PERFORMANCE_IMPROVEMENTS.md` for:
- Detailed architecture diagrams
- Performance metrics and expectations
- Risk analysis and mitigation
- Complete implementation details
