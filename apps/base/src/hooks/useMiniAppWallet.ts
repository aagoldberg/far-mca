'use client';

import { useState, useEffect } from 'react';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount } from 'wagmi';

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
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Also check wagmi connection for CDP Smart Wallet
  const wagmiAccount = useAccount();

  useEffect(() => {
    // Check if already connected via SDK
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Check if running in mini app context
      const context = await sdk.context.get();
      if (context?.user) {
        setUserProfile({
          fid: context.user.fid,
          username: context.user.username,
          displayName: context.user.displayName,
          pfp: context.user.pfp,
        });
      }
    } catch (error) {
      console.log('Not running in mini app context');
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Try to connect via SDK first (for mini app context)
      const result = await sdk.wallet.connect();

      if (result.address) {
        setAddress(result.address);
        setIsConnected(true);

        // Get user context if available
        const context = await sdk.context.get();
        if (context?.user) {
          setUserProfile({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfp: context.user.pfp,
          });
        }
      }
    } catch (error) {
      // Fallback to CDP Smart Wallet if not in mini app context
      console.log('SDK wallet connection failed, falling back to CDP');
      setError('Please use the Connect button to connect via Smart Wallet');

      // The CDP connection will be handled by existing components
      if (wagmiAccount.address) {
        setAddress(wagmiAccount.address);
        setIsConnected(true);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await sdk.wallet.disconnect();
      setAddress(null);
      setIsConnected(false);
      setUserProfile(null);
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  // Sync with wagmi state
  useEffect(() => {
    if (wagmiAccount.address && !address) {
      setAddress(wagmiAccount.address);
      setIsConnected(true);
    } else if (!wagmiAccount.address && address && !userProfile) {
      // Only clear if not connected via SDK
      setAddress(null);
      setIsConnected(false);
    }
  }, [wagmiAccount.address, address, userProfile]);

  return {
    isConnected,
    address,
    isConnecting,
    error,
    connect,
    disconnect,
    userProfile,
  };
}