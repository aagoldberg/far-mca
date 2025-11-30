/**
 * CDP Wallets Hook
 *
 * Replacement for Privy's useWallets hook
 * Provides access to connected wallets via wagmi
 */

import { useAccount, useConnections } from 'wagmi';

export interface ConnectedWallet {
  /** Wallet address */
  address: string;
  /** Wallet type - 'cdp' for CDP Smart Wallets, or connector id for others */
  walletClientType: string;
  /** Chain ID the wallet is connected to */
  chainId?: number;
  /** Connector name */
  connectorName?: string;
}

export interface UseCDPWalletsReturn {
  /** Array of connected wallets */
  wallets: ConnectedWallet[];
  /** Whether this is a CDP Smart Wallet */
  isCDPWallet: boolean;
  /** Whether this is an external wallet (MetaMask, Rainbow, etc.) */
  isExternalWallet: boolean;
}

/**
 * CDP wallets management hook
 * Drop-in replacement for useWallets from Privy
 *
 * @example
 * ```tsx
 * const { wallets, isCDPWallet } = useCDPWallets();
 *
 * const cdpWallet = wallets.find(w => w.walletClientType === 'cdp');
 * const externalWallet = wallets.find(w => w.walletClientType !== 'cdp');
 * ```
 */
export function useCDPWallets(): UseCDPWalletsReturn {
  const { address, connector, chainId } = useAccount();
  const connections = useConnections();

  // Build wallets array from active connection
  const wallets: ConnectedWallet[] = address ? [{
    address,
    walletClientType: connector?.id === 'coinbaseWalletSDK' ? 'cdp' : (connector?.id || 'external'),
    chainId,
    connectorName: connector?.name,
  }] : [];

  // Determine wallet type
  const isCDPWallet = connector?.id === 'coinbaseWalletSDK' || connector?.name?.includes('Coinbase');
  const isExternalWallet = !isCDPWallet && !!address;

  return {
    wallets,
    isCDPWallet,
    isExternalWallet,
  };
}
