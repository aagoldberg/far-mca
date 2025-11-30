/**
 * Platform detection utility for cross-platform mini app
 * Detects whether app is running in Base App or Farcaster
 */

export type Platform = 'base-app' | 'farcaster' | 'web' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  isBaseApp: boolean;
  isFarcaster: boolean;
  isWeb: boolean;
  hasSmartWallet: boolean;
  hasFarcasterWallet: boolean;
}

/**
 * Detect which platform the app is running on
 */
export function detectPlatform(): PlatformInfo {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      platform: 'unknown',
      isBaseApp: false,
      isFarcaster: false,
      isWeb: false,
      hasSmartWallet: false,
      hasFarcasterWallet: false,
    };
  }

  // Check for Base App (Coinbase app)
  // Base App would inject specific properties
  const isBaseApp = !!(
    (window as any).coinbase ||
    (window as any).baseapp ||
    // Check for CDP SDK availability
    (window as any).__CDP_ENABLED__ ||
    // Check URL params that Base App might set
    new URLSearchParams(window.location.search).get('base_app')
  );

  // Check for Farcaster
  // Farcaster SDK is available
  const isFarcaster = !!(
    (window as any).farcaster ||
    // Check if Farcaster SDK is loaded
    typeof (window as any).__FARCASTER_SDK__ !== 'undefined' ||
    // Check if we're in a frame (Farcaster mini apps run in iframes)
    window.parent !== window ||
    // Check URL params
    new URLSearchParams(window.location.search).get('farcaster')
  );

  // Determine platform
  let platform: Platform = 'web';
  if (isBaseApp) {
    platform = 'base-app';
  } else if (isFarcaster) {
    platform = 'farcaster';
  }

  return {
    platform,
    isBaseApp,
    isFarcaster,
    isWeb: !isBaseApp && !isFarcaster,
    hasSmartWallet: isBaseApp,
    hasFarcasterWallet: isFarcaster,
  };
}

/**
 * React hook to use platform info
 */
import { useEffect, useState } from 'react';

export function usePlatform() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() =>
    detectPlatform()
  );

  useEffect(() => {
    // Re-detect on mount in case of dynamic loading
    setPlatformInfo(detectPlatform());
  }, []);

  return platformInfo;
}