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
  const [isMiniApp, setIsMiniApp] = useState(false);

  // Also check wagmi connection for CDP Smart Wallet
  const wagmiAccount = useAccount();

  useEffect(() => {
    // Auto-connect when running in mini app context
    autoConnectInMiniApp();
  }, []);

  const autoConnectInMiniApp = async () => {
    try {
      // Check if running in mini app context
      const context = await sdk.context;
      console.log('[MiniAppWallet] Context:', context);

      if (context?.user) {
        setIsMiniApp(true);
        setUserProfile({
          fid: context.user.fid,
          username: context.user.username,
          displayName: context.user.displayName,
          pfp: context.user.pfpUrl,
        });

        // Get wallet address from context - user is already authenticated in Farcaster
        // The user's verified addresses or custody address should be available
        const userAddress = context.user.verifiedAddresses?.ethAddresses?.[0]
          || context.user.custodyAddress;

        if (userAddress) {
          console.log('[MiniAppWallet] Auto-connected with address:', userAddress);
          setAddress(userAddress);
          setIsConnected(true);
        } else {
          // If no address in context, try to get wallet via SDK
          console.log('[MiniAppWallet] No address in context, requesting wallet...');
          try {
            const ethProvider = await sdk.wallet.ethProvider;
            if (ethProvider) {
              const accounts = await ethProvider.request({ method: 'eth_requestAccounts' }) as string[];
              if (accounts && accounts.length > 0) {
                console.log('[MiniAppWallet] Got wallet from ethProvider:', accounts[0]);
                setAddress(accounts[0]);
                setIsConnected(true);
              }
            }
          } catch (walletError) {
            console.log('[MiniAppWallet] Could not get wallet from ethProvider:', walletError);
          }
        }
      }
    } catch (error) {
      console.log('[MiniAppWallet] Not running in mini app context:', error);
      setIsMiniApp(false);
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // If already in mini app context, try to get wallet from ethProvider
      if (isMiniApp) {
        const ethProvider = await sdk.wallet.ethProvider;
        if (ethProvider) {
          const accounts = await ethProvider.request({ method: 'eth_requestAccounts' }) as string[];
          if (accounts && accounts.length > 0) {
            console.log('[MiniAppWallet] Connected via ethProvider:', accounts[0]);
            setAddress(accounts[0]);
            setIsConnected(true);
            return;
          }
        }
      }

      // Fallback: Try sdk.wallet.connect()
      const result = await sdk.wallet.connect();
      console.log('[MiniAppWallet] sdk.wallet.connect result:', result);

      if (result.address) {
        setAddress(result.address);
        setIsConnected(true);

        // Get user context if available
        const context = await sdk.context;
        if (context?.user) {
          setUserProfile({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfp: context.user.pfpUrl,
          });
        }
      }
    } catch (error) {
      console.log('[MiniAppWallet] SDK wallet connection failed:', error);

      // Fallback to wagmi/CDP Smart Wallet if not in mini app context
      if (wagmiAccount.address) {
        setAddress(wagmiAccount.address);
        setIsConnected(true);
      } else {
        setError('Could not connect wallet. Please try again.');
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