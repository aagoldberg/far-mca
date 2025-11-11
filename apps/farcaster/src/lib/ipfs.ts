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
 * localStorage cache with TTL (client-side only)
 * IPFS data is immutable, so we can cache for a long time
 */
const LOCALSTORAGE_PREFIX = 'ipfs_cache_';
const LOCALSTORAGE_TTL = 30 * 60 * 1000; // 30 minutes

interface LocalStorageEntry<T> {
  data: T;
  timestamp: number;
}

function getFromLocalStorage<T>(key: string): T | null {
  // Check if running in browser
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const item = localStorage.getItem(LOCALSTORAGE_PREFIX + key);
    if (!item) return null;

    const entry: LocalStorageEntry<T> = JSON.parse(item);

    // Check if expired
    if (Date.now() - entry.timestamp > LOCALSTORAGE_TTL) {
      localStorage.removeItem(LOCALSTORAGE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch (error) {
    // Invalid JSON or localStorage error, ignore
    return null;
  }
}

function setInLocalStorage<T>(key: string, data: T): void {
  // Check if running in browser
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const entry: LocalStorageEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(LOCALSTORAGE_PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    // localStorage full or disabled, ignore
    if (process.env.NODE_ENV === 'development') {
      console.warn('[IPFS] localStorage write failed:', error);
    }
  }
}

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
  const cacheKey = uri.toLowerCase();

  // Check localStorage first (client-side, persists across reloads)
  const localStorageCached = getFromLocalStorage<T>(cacheKey);
  if (localStorageCached) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[IPFS localStorage HIT] ${uri.slice(0, 30)}...`);
    }
    return localStorageCached;
  }

  // Check in-memory cache (server-side or current session)
  const memoryCached = metadataCache.get(cacheKey);
  if (memoryCached) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[IPFS Memory Cache HIT] ${uri.slice(0, 30)}...`);
    }
    return memoryCached;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[IPFS Cache MISS] ${uri.slice(0, 30)}...`);
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

      // Store in both caches
      metadataCache.set(cacheKey, data);
      setInLocalStorage(cacheKey, data);

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
