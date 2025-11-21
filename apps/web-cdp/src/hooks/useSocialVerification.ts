'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (client-side, uses anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'discord' | 'farcaster' | 'bluesky' | 'google';
export type ConnectionType = 'friend' | 'mutual' | 'follower' | 'following' | 'colleague';

export interface SocialConnection {
  id: string;
  attester_address: string;
  friend_address: string;
  platform: SocialPlatform;
  connection_type: ConnectionType;
  verified_at: string;
  is_active: boolean;
}

export interface VerifyFriendshipParams {
  friendAddress: string;
  platform: SocialPlatform;
}

interface UseSocialVerificationReturn {
  verifyFriendship: (params: VerifyFriendshipParams) => Promise<boolean>;
  getMyConnections: () => Promise<SocialConnection[]>;
  getFriendConnections: (address: string) => Promise<SocialConnection[]>;
  areMutualFriends: (address1: string, address2: string, platform?: SocialPlatform) => Promise<boolean>;
  getMutualConnectionCount: (address1: string, address2: string) => Promise<number>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for verifying and managing social connections
 *
 * Usage:
 * ```tsx
 * const { verifyFriendship, areMutualFriends } = useSocialVerification();
 *
 * // Verify Facebook friendship
 * await verifyFriendship({
 *   friendAddress: '0x456...',
 *   platform: 'facebook'
 * });
 *
 * // Check if mutual friends
 * const isMutual = await areMutualFriends('0x123...', '0x456...', 'facebook');
 * ```
 */
export function useSocialVerification(): UseSocialVerificationReturn {
  const { address } = useAccount();
  const { user } = usePrivy();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verify friendship with another user on a platform
   */
  const verifyFriendship = async (params: VerifyFriendshipParams): Promise<boolean> => {
    if (!address) {
      setError('Wallet not connected');
      return false;
    }

    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { friendAddress, platform } = params;

      // Get platform-specific IDs
      const attesterPlatformId = getPlatformId(user, platform);
      const friendPlatformId = null; // Friend must have also connected their platform

      if (!attesterPlatformId) {
        setError(`Please connect your ${platform} account first`);
        setIsLoading(false);
        return false;
      }

      // Call API to verify friendship
      const response = await fetch('/api/social/verify-friendship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          attesterAddress: address,
          attesterPlatformId,
          friendAddress,
          friendPlatformId, // Will be null if friend hasn't connected
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to verify friendship');
        setIsLoading(false);
        return false;
      }

      console.log('[Social Verification] ✓ Friendship verified:', data.connection);
      setIsLoading(false);
      return true;

    } catch (err: any) {
      console.error('[Social Verification] Error:', err);
      setError(err.message || 'Failed to verify friendship');
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Get all connections for current user
   */
  const getMyConnections = async (): Promise<SocialConnection[]> => {
    if (!address) return [];

    try {
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('attester_address', address.toLowerCase())
        .eq('is_active', true)
        .order('verified_at', { ascending: false });

      if (error) {
        console.error('[Social Verification] Error fetching connections:', error);
        return [];
      }

      return data || [];

    } catch (err) {
      console.error('[Social Verification] Error:', err);
      return [];
    }
  };

  /**
   * Get all connections for a specific address
   */
  const getFriendConnections = async (friendAddress: string): Promise<SocialConnection[]> => {
    try {
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('attester_address', friendAddress.toLowerCase())
        .eq('is_active', true)
        .order('verified_at', { ascending: false });

      if (error) {
        console.error('[Social Verification] Error fetching friend connections:', error);
        return [];
      }

      return data || [];

    } catch (err) {
      console.error('[Social Verification] Error:', err);
      return [];
    }
  };

  /**
   * Check if two addresses have mutual connections (both attested each other)
   */
  const areMutualFriends = async (
    address1: string,
    address2: string,
    platform?: SocialPlatform
  ): Promise<boolean> => {
    try {
      let query1 = supabase
        .from('social_connections')
        .select('id')
        .eq('attester_address', address1.toLowerCase())
        .eq('friend_address', address2.toLowerCase())
        .eq('is_active', true);

      let query2 = supabase
        .from('social_connections')
        .select('id')
        .eq('attester_address', address2.toLowerCase())
        .eq('friend_address', address1.toLowerCase())
        .eq('is_active', true);

      if (platform) {
        query1 = query1.eq('platform', platform);
        query2 = query2.eq('platform', platform);
      }

      const [result1, result2] = await Promise.all([
        query1.single(),
        query2.single(),
      ]);

      // Both queries must succeed (meaning both attestations exist)
      return !result1.error && !result2.error;

    } catch (err) {
      console.error('[Social Verification] Error checking mutual friends:', err);
      return false;
    }
  };

  /**
   * Count mutual connections between two addresses
   */
  const getMutualConnectionCount = async (
    address1: string,
    address2: string
  ): Promise<number> => {
    try {
      // Get all friends of address1
      const { data: friends1 } = await supabase
        .from('social_connections')
        .select('friend_address')
        .eq('attester_address', address1.toLowerCase())
        .eq('is_active', true);

      // Get all friends of address2
      const { data: friends2 } = await supabase
        .from('social_connections')
        .select('friend_address')
        .eq('attester_address', address2.toLowerCase())
        .eq('is_active', true);

      if (!friends1 || !friends2) return 0;

      // Find intersection
      const friends1Set = new Set(friends1.map(f => f.friend_address));
      const mutuals = friends2.filter(f => friends1Set.has(f.friend_address));

      return mutuals.length;

    } catch (err) {
      console.error('[Social Verification] Error counting mutual connections:', err);
      return 0;
    }
  };

  return {
    verifyFriendship,
    getMyConnections,
    getFriendConnections,
    areMutualFriends,
    getMutualConnectionCount,
    isLoading,
    error,
  };
}

/**
 * Helper: Get platform-specific user ID from Privy user object
 */
function getPlatformId(user: any, platform: SocialPlatform): string | null {
  switch (platform) {
    case 'facebook':
      return user.facebook?.subject || null;
    case 'instagram':
      return user.instagram?.subject || null;
    case 'twitter':
      return user.twitter?.subject || null;
    case 'linkedin':
      return user.linkedin?.subject || null;
    case 'discord':
      return user.discord?.subject || null;
    case 'google':
      return user.google?.subject || null;
    case 'farcaster':
      return user.farcaster?.fid?.toString() || null;
    default:
      return null;
  }
}
