'use client';

import { useState, useEffect } from 'react';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { useAccount } from 'wagmi';

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
   * Generate a signature for Farcaster registration
   * This is a simplified version - in production you'd want to sign a proper message
   */
  const generateSignature = async (): Promise<{ signature: string; deadline: number }> => {
    // For now, we'll use a simple deadline (24 hours from now)
    const deadline = Math.floor(Date.now() / 1000) + 86400;

    // TODO: In production, you should sign a proper EIP-712 message
    // For now, we'll use a placeholder signature
    const signature = '0x' + '0'.repeat(130); // Placeholder

    return { signature, deadline };
  };

  /**
   * Create a Farcaster account with retry logic
   * Tries up to 3 times with different usernames if needed
   */
  const createAccount = async (baseUsername: string): Promise<boolean> => {
    if (!walletAddress) {
      setError('No wallet address found. Please connect your wallet.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    let attempts = 0;
    const maxAttempts = 3;
    let currentUsername = baseUsername;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Trying username "${currentUsername}"...`);

        // Generate signature
        const { signature, deadline } = await generateSignature();

        // Call the registration API
        const response = await fetch('/api/farcaster/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: currentUsername,
            walletAddress,
            signature,
            deadline,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
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

        // Handle username taken error - try with a different username
        if (response.status === 409 || data.error?.includes('username')) {
          attempts++;

          if (attempts < maxAttempts) {
            // Try with a random suffix
            currentUsername = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
            console.log(`Username taken, trying "${currentUsername}"...`);
            continue;
          } else {
            setError('Username unavailable. Please try a different username.');
            setIsLoading(false);
            return false;
          }
        }

        // Handle other errors
        setError(data.error || 'Failed to create Farcaster account');
        setIsLoading(false);
        return false;

      } catch (err: any) {
        console.error('Farcaster registration error:', err);

        attempts++;

        if (attempts < maxAttempts) {
          console.log('Network error, retrying...');
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        } else {
          setError('Network error. Please check your connection and try again.');
          setIsLoading(false);
          return false;
        }
      }
    }

    setError('Failed to create account after multiple attempts.');
    setIsLoading(false);
    return false;
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
