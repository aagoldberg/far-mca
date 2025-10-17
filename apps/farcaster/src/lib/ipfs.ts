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
  // Check cache first
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

      // Store in cache
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
