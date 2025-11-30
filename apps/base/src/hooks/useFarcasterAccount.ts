'use client';

import { useState, useEffect } from 'react';
import { useSignTypedData } from 'wagmi';
import { useSignEvmTypedData, useCurrentUser } from '@coinbase/cdp-hooks';
import { useWalletType } from '@/hooks/useWalletType';

interface FarcasterAccount {
  fid: number;
  username: string;
  signer_uuid?: string;
  signer_status?: string;
  signer_approval_url?: string;
}

export interface ProfileUpdates {
  bio?: string;
  pfp_url?: string;
  url?: string;
  username?: string;
  display_name?: string;
  location?: string;
}

interface UseFarcasterAccountReturn {
  farcasterAccount: FarcasterAccount | null;
  isLoading: boolean;
  error: string | null;
  createAccount: (username: string) => Promise<boolean>;
  updateProfile: (updates: ProfileUpdates) => Promise<boolean>;
  hasPrompted: boolean;
  markPrompted: () => void;
  clearError: () => void;
}

/**
 * Hook to manage Farcaster account creation and status
 * Uses localStorage for persistence until database is added
 *
 * IMPORTANT: When createOnLogin: 'smart', CDP creates BOTH:
 * - An EOA (evmAccounts[0]) - used for Farcaster signing
 * - A Smart Account (evmSmartAccounts[0]) - used for gasless transactions
 *
 * This allows CDP Smart Wallet users to create Farcaster accounts without needing external wallets!
 */
export function useFarcasterAccount(): UseFarcasterAccountReturn {
  const { address: defaultAddress, isExternalWallet, isCdpWallet } = useWalletType();
  const { currentUser } = useCurrentUser();
  const { signTypedDataAsync: signWithWagmi } = useSignTypedData();
  const { signEvmTypedData: signWithCDP } = useSignEvmTypedData();

  // CDP creates both EOA and Smart Account when createOnLogin: 'smart'
  // Access the EOA address for Farcaster signing
  const cdpEoaAddress = (currentUser as any)?.evmAccounts?.[0] as `0x${string}` | undefined;

  // For Farcaster, always use EOA address (not Smart Account)
  // External wallets: use their address directly
  // CDP wallets: use the auto-created EOA address
  const walletAddress = isCdpWallet ? cdpEoaAddress : defaultAddress;

  const [farcasterAccount, setFarcasterAccount] = useState<FarcasterAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to prevent flash
  const [error, setError] = useState<string | null>(null);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Check if wallet has Farcaster account by querying Neynar
  useEffect(() => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }

    async function checkFarcasterAccount() {
      setIsLoading(true);
      const promptKey = `farcaster_prompted_${walletAddress.toLowerCase()}`;

      console.log('[Farcaster] Checking Farcaster account for wallet:', walletAddress);

      try {
        // Clean up old localStorage format (migration)
        const oldKey = `farcaster_account_${walletAddress.toLowerCase()}`;
        if (localStorage.getItem(oldKey)) {
          console.log('[Farcaster] Migrating old localStorage format');
          localStorage.removeItem(oldKey);
        }

        // First check localStorage cache (5 minute TTL)
        const cacheKey = `farcaster_account_cache_${walletAddress.toLowerCase()}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5 minutes

          if (!isExpired) {
            console.log('[Farcaster] Using cached result:', data ? 'account found' : 'no account');
            setFarcasterAccount(data);
            setIsLoading(false);
            return;
          }
        }

        // Query Neynar API to check if wallet has Farcaster account
        const response = await fetch(
          `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${walletAddress}`,
          {
            headers: {
              'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const users = Object.values(data);

          if (users.length > 0 && users[0]) {
            const user = users[0] as any;
            const fid = user[0]?.fid;
            const username = user[0]?.username;

            // Query database for existing signer (persistent across sessions)
            let signer_uuid: string | undefined = undefined;
            let signer_status: string | undefined = undefined;
            let signer_approval_url: string | undefined = undefined;
            try {
              console.log('[Farcaster] Checking database for signer...');
              const signerResponse = await fetch(`/api/farcaster/get-signer?fid=${fid}&wallet=${walletAddress}`);
              const signerData = await signerResponse.json();

              if (signerData.success && signerData.signer_uuid) {
                signer_uuid = signerData.signer_uuid;
                signer_status = signerData.signer_status;
                signer_approval_url = signerData.signer_approval_url;
                console.log('[Farcaster] ✓ Retrieved signer from database');
              } else {
                console.log('[Farcaster] ℹ No signer found in database (profile editing will require setup)');
              }
            } catch (err) {
              console.warn('[Farcaster] Could not retrieve signer from database:', err);
            }

            const account = {
              fid,
              username,
              signer_uuid,
              signer_status,
              signer_approval_url,
            };

            console.log('[Farcaster] Found Farcaster account:', { fid, username, hasSigner: !!signer_uuid });
            setFarcasterAccount(account);

            // Cache the result (including signer_uuid from Neynar)
            localStorage.setItem(cacheKey, JSON.stringify({
              data: account,
              timestamp: Date.now(),
            }));
          } else {
            console.log('[Farcaster] No Farcaster account found for wallet');
            setFarcasterAccount(null);

            // Cache the negative result (but shorter TTL - 1 minute)
            localStorage.setItem(cacheKey, JSON.stringify({
              data: null,
              timestamp: Date.now() - (4 * 60 * 1000), // Expire in 1 minute instead of 5
            }));
          }
        } else {
          console.error('[Farcaster] Failed to check account:', response.status);
        }

        // Load hasPrompted state from localStorage
        const savedPrompt = localStorage.getItem(promptKey);
        if (savedPrompt === 'true') {
          setHasPrompted(true);
        }
      } catch (err) {
        console.error('[Farcaster] Error checking account:', err);
      } finally {
        setIsLoading(false);
        console.log('[Farcaster] Check complete');
      }
    }

    checkFarcasterAccount();
  }, [walletAddress]);

  const markPrompted = () => {
    if (!walletAddress) return;

    const promptKey = `farcaster_prompted_${walletAddress.toLowerCase()}`;
    localStorage.setItem(promptKey, 'true');
    setHasPrompted(true);
  };

  const clearError = () => setError(null);

  /**
   * Update Farcaster profile (bio, pfp, display name, etc.)
   */
  const updateProfile = async (updates: ProfileUpdates): Promise<boolean> => {
    if (!farcasterAccount?.signer_uuid) {
      setError('No signer UUID found. Please create a Farcaster account first.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[Farcaster] Updating profile with:', updates);

      const response = await fetch('/api/farcaster/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signer_uuid: farcasterAccount.signer_uuid,
          updates,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('[Farcaster] Profile updated successfully:', data.user);

        // Update local cache with new values
        const updatedAccount = {
          ...farcasterAccount,
          username: updates.username || farcasterAccount.username,
        };

        const cacheKey = `farcaster_account_cache_${walletAddress?.toLowerCase()}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          data: updatedAccount,
          timestamp: Date.now(),
        }));

        setFarcasterAccount(updatedAccount);
        setIsLoading(false);
        return true;
      }

      setError(data.error || 'Failed to update profile');
      setIsLoading(false);
      return false;

    } catch (err: any) {
      console.error('[Farcaster] Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      setIsLoading(false);
      return false;
    }
  };

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

      console.log('Registration prepared with FID:', fid, 'requesting signature...');

      // Step 2: Request user signature (Farcaster requires EOA signature)
      let signature: string;

      if (isExternalWallet) {
        // External wallet (wagmi) - Convert string values back to BigInt for signing
        console.log('[Farcaster] Using external wallet for signing...');
        signature = await signWithWagmi({
          domain: typedData.domain,
          types: typedData.types,
          primaryType: typedData.primaryType,
          message: {
            fid: BigInt(typedData.message.fid),
            to: typedData.message.to,
            nonce: BigInt(typedData.message.nonce),
            deadline: BigInt(typedData.message.deadline),
          },
        });
      } else if (isCdpWallet && cdpEoaAddress) {
        // CDP Smart Wallet - Use the auto-created EOA for signing
        console.log('[Farcaster] Using CDP EOA for signing:', cdpEoaAddress);
        const result = await signWithCDP({
          evmAccount: cdpEoaAddress, // Use the CDP-created EOA address
          typedData: {
            domain: typedData.domain,
            types: typedData.types,
            primaryType: typedData.primaryType,
            message: typedData.message, // CDP accepts string values directly
          },
        });
        signature = result.signature;
      } else {
        const errorMsg = 'No wallet found. Please connect a wallet to create a Farcaster account.';
        console.error('[Farcaster]', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return false;
      }

      console.log('Signature obtained, registering account...');

      // Step 3: Register account with signature and FID
      const registerResponse = await fetch('/api/farcaster/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: baseUsername,
          fid,
          walletAddress,
          signature,
          deadline,
        }),
      });

      const data = await registerResponse.json();

      if (registerResponse.ok && data.success) {
        // Success! Cache and update state
        const account: FarcasterAccount = {
          fid: data.fid,
          username: data.username,
          signer_uuid: data.signer_uuid,
          signer_status: data.signer_status,
          signer_approval_url: data.signer_approval_url,
        };

        // Auto-open approval URL for one-click approval
        if (data.signer_approval_url && data.signer_status !== 'approved') {
          console.log('[Farcaster] Opening signer approval URL:', data.signer_approval_url);
          window.open(data.signer_approval_url, '_blank', 'width=500,height=700');
        }

        // Cache the newly created account
        const cacheKey = `farcaster_account_cache_${walletAddress.toLowerCase()}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          data: account,
          timestamp: Date.now(),
        }));

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
    updateProfile,
    hasPrompted,
    markPrompted,
    clearError,
  };
}
