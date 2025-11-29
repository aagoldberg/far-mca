/**
 * Wallet types for CDP migration
 * Replaces Privy's ConnectedWallet type
 */

export interface ConnectedWallet {
  address: string;
  walletClientType: string;
  chainId?: number;
}
