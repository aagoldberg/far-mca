'use client';

import { useState, useEffect } from 'react';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { useAccount, useSignTypedData } from 'wagmi';

interface FarcasterAccount {
  fid: number;
  username: string;
  signer_uuid?: string;
}

interface UseFarcasterAccountReturn {
  farcasterAccount: FarcasterAccount | null;
  isLoading: boolean;
  error: string | null;
  createAccount: (username: string) => Promise<boolean>;
  hasPrompted: boolean;
  markPrompted: () => void;
  clearError: () => void;
}

/**
 * Hook to manage Farcaster account creation and status
 * Uses localStorage for persistence until database is added
 */
export function useFarcasterAccount(): UseFarcasterAccountReturn {
  const { evmAddress: cdpAddress } = useEvmAddress();
  const { address: externalAddress } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  // Prioritize external wallet address
  const walletAddress = externalAddress || cdpAddress;

  const [farcasterAccount, setFarcasterAccount] = useState<FarcasterAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (!walletAddress) return;

    const storageKey = `farcaster_account_${walletAddress.toLowerCase()}`;
    const promptKey = `farcaster_prompted_${walletAddress.toLowerCase()}`;

    try {
      const savedAccount = localStorage.getItem(storageKey);
      const savedPrompt = localStorage.getItem(promptKey);

      if (savedAccount) {
        setFarcasterAccount(JSON.parse(savedAccount));
      }

      if (savedPrompt === 'true') {
        setHasPrompted(true);
      }
    } catch (err) {
      console.error('Error loading Farcaster data from localStorage:', err);
    }
  }, [walletAddress]);

  const markPrompted = () => {
    if (!walletAddress) return;

    const promptKey = `farcaster_prompted_${walletAddress.toLowerCase()}`;
    localStorage.setItem(promptKey, 'true');
    setHasPrompted(true);
  };

  const clearError = () => setError(null);

  /**
   * Create a Farcaster account with EIP-712 signature
   */
  const createAccount = async (baseUsername: string): Promise<boolean> => {
    if (!walletAddress) {
      setError('No wallet address found. Please connect your wallet.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Creating Farcaster account for username "${baseUsername}"...`);

      // Step 1: Prepare registration data (get FID, nonce, typed data from backend)
      const prepareResponse = await fetch('/api/farcaster/prepare-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      if (!prepareResponse.ok) {
        const errorData = await prepareResponse.json();
        throw new Error(errorData.error || 'Failed to prepare registration');
      }

      const { fid, deadline, typedData } = await prepareResponse.json();

      console.log('Registration prepared, requesting signature...');

      // Step 2: Request user signature
      const signature = await signTypedDataAsync({
        domain: typedData.domain,
        types: typedData.types,
        primaryType: typedData.primaryType,
        message: typedData.message,
      });

      console.log('Signature obtained, registering account...');

      // Step 3: Register account with signature
      const registerResponse = await fetch('/api/farcaster/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: baseUsername,
          walletAddress,
          signature,
          fid,
          deadline,
        }),
      });

      const data = await registerResponse.json();

      if (registerResponse.ok && data.success) {
        // Success! Save to localStorage and state
        const account: FarcasterAccount = {
          fid: data.fid,
          username: data.username,
          signer_uuid: data.signer_uuid,
        };

        const storageKey = `farcaster_account_${walletAddress.toLowerCase()}`;
        localStorage.setItem(storageKey, JSON.stringify(account));

        setFarcasterAccount(account);
        setIsLoading(false);

        console.log('Farcaster account created successfully:', account);
        return true;
      }

      // Handle errors
      setError(data.error || 'Failed to create Farcaster account');
      setIsLoading(false);
      return false;

    } catch (err: any) {
      console.error('Farcaster registration error:', err);

      // Handle user rejected signature
      if (err.message?.includes('User rejected') || err.message?.includes('denied')) {
        setError('Signature rejected. Please approve the signature to create your account.');
      } else {
        setError(err.message || 'Failed to create account');
      }

      setIsLoading(false);
      return false;
    }
  };

  return {
    farcasterAccount,
    isLoading,
    error,
    createAccount,
    hasPrompted,
    markPrompted,
    clearError,
  };
}
