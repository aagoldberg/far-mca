'use client';

import { useState, useEffect } from 'react';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface MiniAppWalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  userProfile: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfp?: string;
  } | null;
}

export function useMiniAppWallet(): MiniAppWalletState {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Use wagmi hooks - the farcasterMiniApp connector handles everything
  const { address, isConnected } = useAccount();
  const { connect: wagmiConnect, connectors, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  // Fetch Farcaster user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const context = await sdk.context;
        console.log('[MiniAppWallet] Farcaster context:', context);

        if (context?.user) {
          setUserProfile({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfp: context.user.pfpUrl,
          });
        }
      } catch (err) {
        console.log('[MiniAppWallet] Not in mini app context:', err);
      }
    };

    fetchProfile();
  }, []);

  // Log connection state changes
  useEffect(() => {
    console.log('[MiniAppWallet] Connection state:', { isConnected, address });
  }, [isConnected, address]);

  const connect = async () => {
    setError(null);
    try {
      // Use the farcasterMiniApp connector
      const connector = connectors[0];
      if (connector) {
        console.log('[MiniAppWallet] Connecting with connector:', connector.name);
        wagmiConnect({ connector });
      } else {
        setError('No wallet connector available');
      }
    } catch (err) {
      console.error('[MiniAppWallet] Connect error:', err);
      setError('Could not connect wallet');
    }
  };

  const disconnect = async () => {
    try {
      wagmiDisconnect();
      setUserProfile(null);
    } catch (err) {
      console.error('[MiniAppWallet] Disconnect error:', err);
    }
  };

  return {
    isConnected,
    address: address || null,
    isConnecting: isPending,
    error,
    connect,
    disconnect,
    userProfile,
  };
}