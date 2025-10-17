'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useReconnect } from 'wagmi';

export default function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { reconnect } = useReconnect();
  const [showError, setShowError] = useState(false);

  // Auto-connect on mount if not connected
  useEffect(() => {
    if (!isConnected && !isConnecting && !isReconnecting && connectors.length > 0) {
      // Attempt auto-connect with Farcaster connector
      const farcasterConnector = connectors[0];
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    }
  }, [isConnected, isConnecting, isReconnecting, connectors, connect]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [connectError]);

  // Show loading state
  if (isConnecting || isReconnecting || isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-[#3B9B7F] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-600">Connecting...</span>
      </div>
    );
  }

  // Show connected state
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Connection status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (showError && connectError) {
    return (
      <div className="flex flex-col gap-2">
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">Connection failed</p>
        </div>
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="px-4 py-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show connect button (fallback)
  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending || connectors.length === 0}
      className="px-4 py-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Connect Wallet
    </button>
  );
}
