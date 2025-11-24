/**
 * CDP Authentication Hook
 *
 * Replacement for Privy's usePrivy hook
 * Uses wagmi's useAccount and Coinbase Smart Wallets under the hood
 */

import { useAccount, useDisconnect } from 'wagmi';
import { useCallback } from 'react';

export interface CDPUser {
  wallet: {
    address: string;
  };
  authMethod?: string;
}

export interface UseCDPAuthReturn {
  /** Current connected wallet address */
  address: string | undefined;
  /** Whether a wallet is connected */
  authenticated: boolean;
  /** CDP is always ready (no async initialization) */
  ready: boolean;
  /** Trigger CDP wallet connection modal */
  login: () => void;
  /** Disconnect wallet */
  logout: () => void;
  /** User object with wallet info (Privy-compatible) */
  user: CDPUser | null;
  /** Connector information */
  connector?: {
    id: string;
    name: string;
  };
}

/**
 * Main CDP authentication hook
 * Drop-in replacement for usePrivy from Privy
 *
 * @example
 * ```tsx
 * const { user, authenticated, login, logout } = useCDPAuth();
 *
 * if (!authenticated) {
 *   return <button onClick={login}>Sign In</button>;
 * }
 *
 * return <div>Welcome {user.wallet.address}</div>;
 * ```
 */
export function useCDPAuth(): UseCDPAuthReturn {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  // Trigger wallet connection modal
  // Note: In CDP, the wallet button in the header handles this
  // This function helps maintain Privy API compatibility
  const login = useCallback(() => {
    // Try to find and click the wallet button
    const walletButton = document.querySelector('[data-connect-wallet]') as HTMLElement;
    if (walletButton) {
      walletButton.click();
    } else {
      console.warn('[useCDPAuth] CDP wallet button not found. Add data-connect-wallet attribute to your ConnectButton.');
    }
  }, []);

  // Create Privy-compatible user object
  const user: CDPUser | null = isConnected && address ? {
    wallet: {
      address,
    },
    authMethod: connector?.name,
  } : null;

  return {
    address,
    authenticated: isConnected,
    ready: true, // CDP is always ready
    login,
    logout: disconnect,
    user,
    connector: connector ? {
      id: connector.id,
      name: connector.name,
    } : undefined,
  };
}
