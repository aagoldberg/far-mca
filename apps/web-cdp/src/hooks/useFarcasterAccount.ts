'use client';

import { useState, useEffect, useRef } from 'react';
import { useSignEvmTypedData, useCurrentUser } from '@coinbase/cdp-hooks';
import { useAccount } from 'wagmi';
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
  const { signEvmTypedData: signWithCDP } = useSignEvmTypedData();
  const { connector } = useAccount();

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

  // Track in-flight checks to prevent duplicate API calls
  const checkInProgressRef = useRef<string | null>(null);

  // Check if wallet has Farcaster account by querying Neynar
  useEffect(() => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }

    // Prevent duplicate checks for the same wallet
    if (checkInProgressRef.current === walletAddress.toLowerCase()) {
      return;
    }

    async function checkFarcasterAccount() {
      const walletLower = walletAddress!.toLowerCase();

      // Double-check we're not already checking this wallet
      if (checkInProgressRef.current === walletLower) {
        return;
      }

      checkInProgressRef.current = walletLower;
      setIsLoading(true);
      const promptKey = `farcaster_prompted_${walletLower}`;

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
        } else if (response.status === 404) {
          // 404 is expected when wallet has no Farcaster account - not an error
          console.log('[Farcaster] No Farcaster account found for this wallet (404)');
          setFarcasterAccount(null);

          // Cache the negative result (1 minute TTL)
          localStorage.setItem(cacheKey, JSON.stringify({
            data: null,
            timestamp: Date.now() - (4 * 60 * 1000), // Expire in 1 minute instead of 5
          }));
        } else {
          // Only log actual errors (500, etc.)
          console.warn('[Farcaster] Unexpected response checking account:', response.status);
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
      console.log('[Farcaster] Wallet info:', {
        walletAddress,
        isExternalWallet,
        isCdpWallet,
        cdpEoaAddress: cdpEoaAddress || 'undefined',
      });

      // Step 2: Request user signature (Farcaster requires EOA signature)
      // Note: We use wallet.request with eth_signTypedData_v4 directly to bypass
      // viem's chain ID validation. Farcaster signatures require chainId: 10 (Optimism)
      // but the user may be connected to a different chain (e.g., Base Sepolia).
      // Using the raw RPC method bypasses all client-side validation.
      let signature: string;

      if (isExternalWallet && walletAddress) {
        // External wallet - Use raw eth_signTypedData_v4 via the connector's provider
        // to bypass viem/wagmi chain ID validation AND the Coinbase Wallet SDK proxy.
        // Farcaster ID Registry requires chainId: 10 (Optimism) but user may be on any chain.
        // The signature itself doesn't require being on Optimism - it's just signing bytes.
        console.log('[Farcaster] Using external wallet for signing via raw RPC...');
        console.log('[Farcaster] Connected via connector:', connector?.id, connector?.name);

        // Get the provider directly from the connector to avoid Coinbase Wallet SDK proxy issues
        // when multiple wallet extensions are installed
        let ethereum: any;
        if (connector?.getProvider) {
          try {
            ethereum = await connector.getProvider();
            console.log('[Farcaster] Got provider from connector');
          } catch (providerError) {
            console.warn('[Farcaster] Could not get provider from connector, falling back to window.ethereum');
            ethereum = (window as any).ethereum;
          }
        } else {
          ethereum = (window as any).ethereum;
        }

        if (!ethereum) {
          throw new Error('No wallet found. Please install MetaMask or another wallet extension.');
        }

        console.log('[Farcaster] Provider obtained, requesting accounts...');

        // Get the currently connected accounts to ensure we have permission
        let accounts: string[];
        try {
          accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
        } catch (accountsError: any) {
          console.error('[Farcaster] Error getting accounts:', accountsError);
          throw new Error(`Failed to get wallet accounts: ${accountsError.message || 'Unknown error'}`);
        }
        console.log('[Farcaster] Connected accounts:', accounts);

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts connected. Please connect your wallet first.');
        }

        // Use the account from MetaMask directly (properly checksummed)
        const signingAddress = accounts.find(
          (acc: string) => acc.toLowerCase() === walletAddress.toLowerCase()
        );

        if (!signingAddress) {
          throw new Error(`Wallet address ${walletAddress} is not connected. Connected: ${accounts.join(', ')}`);
        }

        console.log('[Farcaster] Using signing address:', signingAddress);

        // Construct the typed data for eth_signTypedData_v4
        // MetaMask validates chainId in domain against connected chain.
        // We need to temporarily switch to Optimism to sign.
        const targetChainId = '0xa'; // 10 in hex (Optimism)
        const currentChainId = await ethereum.request({ method: 'eth_chainId' }) as string;

        console.log('[Farcaster] Current chain:', currentChainId, 'Target chain:', targetChainId);

        // Switch to Optimism if not already on it
        if (currentChainId.toLowerCase() !== targetChainId.toLowerCase()) {
          console.log('[Farcaster] Switching to Optimism for signing...');
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: targetChainId }],
            });
          } catch (switchError: any) {
            // If Optimism is not added, add it
            if (switchError.code === 4902) {
              console.log('[Farcaster] Adding Optimism network...');
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: targetChainId,
                  chainName: 'Optimism',
                  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['https://mainnet.optimism.io'],
                  blockExplorerUrls: ['https://optimistic.etherscan.io'],
                }],
              });
            } else {
              throw switchError;
            }
          }
        }

        const typedDataForSigning = {
          domain: typedData.domain,
          types: typedData.types,
          primaryType: typedData.primaryType,
          message: {
            fid: typedData.message.fid,
            to: typedData.message.to,
            nonce: typedData.message.nonce,
            deadline: typedData.message.deadline,
          },
        };

        console.log('[Farcaster] Typed data:', JSON.stringify(typedDataForSigning, null, 2));

        // Use raw RPC call directly to window.ethereum
        try {
          signature = await ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [signingAddress, JSON.stringify(typedDataForSigning)],
          }) as string;
          console.log('[Farcaster] Signature received:', signature);
        } catch (signError: any) {
          console.error('[Farcaster] Signing error:', signError);
          // Switch back to original chain before throwing
          if (currentChainId.toLowerCase() !== targetChainId.toLowerCase()) {
            try {
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: currentChainId }],
              });
            } catch {
              // Ignore switch-back errors
            }
          }
          throw signError;
        }

        // Switch back to original chain after signing
        if (currentChainId.toLowerCase() !== targetChainId.toLowerCase()) {
          console.log('[Farcaster] Switching back to original chain:', currentChainId);
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: currentChainId }],
            });
          } catch {
            console.warn('[Farcaster] Could not switch back to original chain');
          }
        }
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
