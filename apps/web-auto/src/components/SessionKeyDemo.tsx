"use client";

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'

interface SessionKeyParams {
  maxAmountPerTransaction: string
  maxAmountPerMonth: string
  validDays: number
}

export function SessionKeyDemo() {
  const { address, isConnected } = useAccount()
  const [sessionKey, setSessionKey] = useState<string | null>(null)
  const [params, setParams] = useState<SessionKeyParams>({
    maxAmountPerTransaction: '100',
    maxAmountPerMonth: '500',
    validDays: 90,
  })

  const handleCreateSessionKey = async () => {
    if (!isConnected) {
      alert('Please connect wallet first')
      return
    }

    // Simulate session key creation
    // In production, this would call the smart wallet contract
    const mockSessionKey = {
      id: `session_${Date.now()}`,
      address: address,
      rules: {
        maxPerTx: parseUnits(params.maxAmountPerTransaction, 6).toString(),
        maxPerMonth: parseUnits(params.maxAmountPerMonth, 6).toString(),
        validUntil: Date.now() + (params.validDays * 24 * 60 * 60 * 1000),
      },
      created: new Date().toISOString(),
    }

    console.log('[SessionKey Created]', mockSessionKey)
    setSessionKey(mockSessionKey.id)
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">Connect your wallet to create a session key</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Session Key Setup</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Amount Per Transaction (USDC)
          </label>
          <input
            type="number"
            value={params.maxAmountPerTransaction}
            onChange={(e) => setParams({...params, maxAmountPerTransaction: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Amount Per Month (USDC)
          </label>
          <input
            type="number"
            value={params.maxAmountPerMonth}
            onChange={(e) => setParams({...params, maxAmountPerMonth: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            placeholder="500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valid for (days)
          </label>
          <input
            type="number"
            value={params.validDays}
            onChange={(e) => setParams({...params, validDays: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            placeholder="90"
          />
        </div>
      </div>

      {!sessionKey ? (
        <button
          onClick={handleCreateSessionKey}
          className="w-full px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition font-semibold"
        >
          Create Session Key (Sign Once)
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Session Key Active</h3>
              <div className="mt-2 text-sm text-green-700">
                <p className="font-mono text-xs">{sessionKey}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Max per transaction: ${params.maxAmountPerTransaction} USDC</li>
                  <li>Max per month: ${params.maxAmountPerMonth} USDC</li>
                  <li>Valid for: {params.validDays} days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">How Session Keys Work:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Sign ONCE to authorize future repayments</li>
          <li>Your smart wallet validates each transaction against these rules</li>
          <li>Repayments execute automatically - no more signing needed!</li>
        </ol>
      </div>
    </div>
  )
}
