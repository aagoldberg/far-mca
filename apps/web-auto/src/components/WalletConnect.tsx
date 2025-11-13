"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Connected Wallet</p>
            <p className="font-mono text-sm mt-1">{address.slice(0, 6)}...{address.slice(-4)}</p>
            <p className="text-xs text-green-600 mt-1">✓ CDP Smart Wallet</p>
          </div>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Connect CDP Smart Wallet</h2>
      <p className="text-gray-600 mb-6">
        Connect your Coinbase Smart Wallet to demo auto-repayment features
      </p>
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="w-full px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition font-semibold"
          >
            Connect with {connector.name}
          </button>
        ))}
      </div>
    </div>
  )
}
