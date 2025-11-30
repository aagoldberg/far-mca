/**
 * Farcaster Authentication Hook
 *
 * Integrates OnchainKit's Sign In with Farcaster
 * and fetches rich profile data from Neynar
 */

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

// Note: useAuthenticate from OnchainKit MiniKit is for Base Mini Apps
// For general web apps, we'll implement custom Farcaster Auth
// using Sign-In with Farcaster protocol

export interface FarcasterProfile {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  bio?: string;
  follower_count?: number;
  following_count?: number;
  verified_addresses?: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
}

export interface UseFarcasterAuthReturn {
  /** Link Farcaster account to current wallet */
  linkFarcaster: () => Promise<FarcasterProfile | null>;
  /** Current Farcaster profile if linked */
  farcasterProfile: FarcasterProfile | null;
  /** Loading state */
  isLinking: boolean;
  /** Error message */
  error: string | null;
}

/**
 * Farcaster authentication and profile management hook
 *
 * @example
 * ```tsx
 * const { linkFarcaster, farcasterProfile, isLinking } = useFarcasterAuth();
 *
 * const handleLink = async () => {
 *   const profile = await linkFarcaster();
 *   if (profile) {
 *     console.log('Linked Farcaster:', profile.username);
 *   }
 * };
 * ```
 */
export function useFarcasterAuth(): UseFarcasterAuthReturn {
  const { address } = useAccount();
  const [farcasterProfile, setFarcasterProfile] = useState<FarcasterProfile | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkFarcaster = useCallback(async (): Promise<FarcasterProfile | null> => {
    if (!address) {
      setError('Please connect your wallet first');
      return null;
    }

    setIsLinking(true);
    setError(null);

    try {
      // Call API endpoint to initiate Farcaster OAuth
      const response = await fetch('/api/farcaster/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to link Farcaster');
      }

      const { authUrl } = await response.json();

      // Open Farcaster auth in popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'Farcaster Sign In',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Wait for callback
      return new Promise((resolve) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'FARCASTER_AUTH_SUCCESS') {
            window.removeEventListener('message', handleMessage);
            setFarcasterProfile(event.data.profile);
            setIsLinking(false);
            popup?.close();
            resolve(event.data.profile);
          } else if (event.data.type === 'FARCASTER_AUTH_ERROR') {
            window.removeEventListener('message', handleMessage);
            setError(event.data.error);
            setIsLinking(false);
            popup?.close();
            resolve(null);
          }
        };

        window.addEventListener('message', handleMessage);

        // Timeout after 5 minutes
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
          setError('Authentication timed out');
          setIsLinking(false);
          popup?.close();
          resolve(null);
        }, 5 * 60 * 1000);
      });
    } catch (err) {
      console.error('[useFarcasterAuth] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to link Farcaster');
      setIsLinking(false);
      return null;
    }
  }, [address]);

  return {
    linkFarcaster,
    farcasterProfile,
    isLinking,
    error,
  };
}

/**
 * Fetch Farcaster profile by FID using Neynar
 * Utility function for server-side or client-side profile fetching
 */
export async function fetchFarcasterProfile(fid: number): Promise<FarcasterProfile | null> {
  try {
    const neynar = new NeynarAPIClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY!);
    const response = await neynar.fetchBulkUsers([fid]);

    const user = response.users[0];
    if (!user) return null;

    return {
      fid: user.fid,
      username: user.username,
      display_name: user.display_name || user.username,
      pfp_url: user.pfp_url,
      bio: user.profile?.bio?.text,
      follower_count: user.follower_count,
      following_count: user.following_count,
      verified_addresses: user.verified_addresses,
    };
  } catch (err) {
    console.error('[fetchFarcasterProfile] Error:', err);
    return null;
  }
}
