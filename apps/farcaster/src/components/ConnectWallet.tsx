'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className="px-4 py-2 bg-[#2E7D32] hover:bg-[#4CAF50] text-white text-sm font-semibold rounded-lg transition-colors disabled:bg-gray-400"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
