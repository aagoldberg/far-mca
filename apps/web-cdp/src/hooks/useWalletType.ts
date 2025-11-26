/**
 * useWalletType Hook
 *
 * Standardized wallet detection utility for CDP Smart Wallets vs External Wallets
 * Best practice for determining which transaction hooks to use
 */

import { useAccount } from 'wagmi';
import { useEvmAddress } from '@coinbase/cdp-hooks';

export interface WalletTypeInfo {
  /** The connected wallet address (CDP or external) */
  address: `0x${string}` | null;
  /** Whether any wallet is connected */
  isConnected: boolean;
  /** True if using CDP Smart Wallet (email, social login, etc.) */
  isCdpWallet: boolean;
  /** True if using external wallet (MetaMask, Coinbase Wallet, etc.) */
  isExternalWallet: boolean;
}

/**
 * Hook to detect wallet type and provide standardized wallet info
 *
 * @example
 * ```tsx
 * const { address, isCdpWallet, isExternalWallet } = useWalletType();
 *
 * if (isCdpWallet) {
 *   // Use CDP hooks: useSendEvmTransaction
 * } else if (isExternalWallet) {
 *   // Use wagmi hooks: useWriteContract
 * }
 * ```
 */
export const useWalletType = (): WalletTypeInfo => {
  // External wallet (MetaMask, Coinbase Wallet, etc.)
  const { address: externalAddress, isConnected: isExternalConnected } = useAccount();

  // CDP Smart Wallet (email, social login, etc.)
  const { evmAddress: cdpAddress } = useEvmAddress();

  // Determine which wallet is active
  const address = (externalAddress || cdpAddress) as `0x${string}` | null;
  const isConnected = isExternalConnected || !!cdpAddress;
  const isCdpWallet = !!cdpAddress && !isExternalConnected;
  const isExternalWallet = isExternalConnected && !cdpAddress;

  return {
    address,
    isConnected,
    isCdpWallet,
    isExternalWallet,
  };
};
