/**
 * Wallet Detection Utilities
 *
 * Detect wallet type (Smart Wallet vs EOA) to route users to
 * the best gasless transaction method:
 * - Smart Wallet → Batch transactions + paymaster (fully gasless)
 * - EOA → Relay endpoints (gasless after approval)
 */

import { useAccount, useConnector } from 'wagmi';
import { useMemo } from 'react';

/**
 * Check if current wallet is a Smart Wallet (EIP-4337 account)
 * Smart Wallets include:
 * - Coinbase Smart Wallet
 * - Safe
 * - Kernel
 * - Biconomy
 */
export const useIsSmartWallet = () => {
  const { connector } = useAccount();
  const connectorName = connector?.name?.toLowerCase() || '';

  const isSmartWallet = useMemo(() => {
    // Check connector name
    if (connectorName.includes('coinbase') && connectorName.includes('smart')) {
      return true;
    }
    if (connectorName.includes('safe')) {
      return true;
    }
    if (connectorName.includes('kernel')) {
      return true;
    }
    if (connectorName.includes('biconomy')) {
      return true;
    }

    // CDP wallets created with createOnLogin: 'all' are Smart Wallets
    // They have 'coinbase wallet' connector
    if (connectorName === 'coinbase wallet') {
      // TODO: Add more precise detection by checking account code
      return true; // Assume CDP users have Smart Wallets
    }

    return false;
  }, [connectorName]);

  return {
    isSmartWallet,
    connectorName,
  };
};

/**
 * Check if wallet supports gasless transactions via paymaster
 */
export const useSupportsPaymaster = () => {
  const { isSmartWallet } = useIsSmartWallet();
  const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;

  return {
    supportsPaymaster: isSmartWallet && !!paymasterUrl,
    hasPaymasterConfigured: !!paymasterUrl,
    isSmartWallet,
  };
};

/**
 * Get recommended gasless method for current wallet
 */
export const useGaslessMethod = () => {
  const { isSmartWallet, connectorName } = useIsSmartWallet();
  const { supportsPaymaster, hasPaymasterConfigured } = useSupportsPaymaster();

  const method = useMemo(() => {
    if (supportsPaymaster) {
      return 'paymaster'; // Use batch transactions + Coinbase paymaster
    }
    return 'relay'; // Use relay endpoints
  }, [supportsPaymaster]);

  return {
    method,
    isSmartWallet,
    supportsPaymaster,
    hasPaymasterConfigured,
    connectorName,
    description:
      method === 'paymaster'
        ? 'Fully gasless via Coinbase paymaster'
        : 'Gasless after one-time USDC approval',
  };
};

/**
 * Detect if on-chain code exists at address (Smart Wallet check)
 * This is more accurate but requires an RPC call
 */
export const checkIsSmartWallet = async (
  address: string,
  publicClient: any
): Promise<boolean> => {
  try {
    const code = await publicClient.getBytecode({ address });
    // If bytecode exists, it's a contract (Smart Wallet)
    return code !== undefined && code !== '0x';
  } catch {
    return false;
  }
};
