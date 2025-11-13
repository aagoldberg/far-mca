'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface AirdropStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  message: string | null;
  amounts?: {
    eth?: string;
    usdc?: string;
  };
  txHashes?: string[];
}

/**
 * Custom hook to automatically airdrop test tokens to new users on first login
 *
 * Usage:
 * ```tsx
 * const { isLoading, isSuccess, message } = useAutoAirdrop();
 *
 * {isLoading && <div>Sending test tokens...</div>}
 * {isSuccess && <div>{message}</div>}
 * ```
 */
export function useAutoAirdrop() {
  const { authenticated, user, ready } = usePrivy();
  const [status, setStatus] = useState<AirdropStatus>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    message: null,
  });

  const walletAddress = user?.wallet?.address;

  const requestAirdrop = useCallback(async (address: string) => {
    // Check if we've already requested for this address in this session
    const storageKey = `airdrop_requested_${address.toLowerCase()}`;
    const hasRequested = sessionStorage.getItem(storageKey);

    if (hasRequested) {
      console.log('[Auto-Airdrop] Already requested in this session, skipping');
      return;
    }

    setStatus((prev) => ({ ...prev, isLoading: true, isError: false, error: null }));

    try {
      const response = await fetch('/api/airdrop-new-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to airdrop tokens');
      }

      // Mark as requested in this session
      sessionStorage.setItem(storageKey, 'true');

      setStatus({
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        message: data.message || 'Test tokens sent successfully!',
        amounts: data.amounts,
        txHashes: data.txHashes,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[Auto-Airdrop] Success:', {
          skipped: data.skipped,
          amounts: data.amounts,
          txHashes: data.txHashes,
        });
      }
    } catch (error: any) {
      console.error('[Auto-Airdrop] Error:', error);

      setStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: error.message,
        message: null,
      });
    }
  }, []);

  useEffect(() => {
    // Wait for Privy to be ready and user to be authenticated
    if (!ready || !authenticated || !walletAddress) {
      return;
    }

    // Small delay to ensure wallet is fully connected
    const timeoutId = setTimeout(() => {
      requestAirdrop(walletAddress);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [ready, authenticated, walletAddress, requestAirdrop]);

  return status;
}
