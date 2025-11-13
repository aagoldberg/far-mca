"use client";

import { useState } from 'react'
import { useAccount } from 'wagmi'

interface RepaymentLog {
  timestamp: number
  amount: string
  status: 'success' | 'pending' | 'failed'
  reason?: string
}

export function AutoRepaymentDemo() {
  const { isConnected } = useAccount()
  const [merchantRevenue, setMerchantRevenue] = useState('1000')
  const [repaymentPercentage, setRepaymentPercentage] = useState('10')
  const [logs, setLogs] = useState<RepaymentLog[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  const simulateRepayment = async () => {
    setIsSimulating(true)

    // Calculate repayment
    const revenue = parseFloat(merchantRevenue)
    const percentage = parseFloat(repaymentPercentage)
    const repaymentAmount = ((revenue * percentage) / 100).toFixed(2)

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newLog: RepaymentLog = {
      timestamp: Date.now(),
      amount: repaymentAmount,
      status: 'success',
    }

    setLogs(prev => [newLog, ...prev])
    setIsSimulating(false)
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">Connect your wallet to simulate auto-repayment</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Auto-Repayment Simulation</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant Revenue ($)
          </label>
          <input
            type="number"
            value={merchantRevenue}
            onChange={(e) => setMerchantRevenue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repayment % of Revenue
          </label>
          <input
            type="number"
            value={repaymentPercentage}
            onChange={(e) => setRepaymentPercentage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            placeholder="10"
            max="100"
            min="0"
          />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-semibold text-purple-900">Calculated Repayment:</p>
        <p className="text-2xl font-bold text-purple-700 mt-1">
          ${((parseFloat(merchantRevenue) * parseFloat(repaymentPercentage)) / 100).toFixed(2)} USDC
        </p>
      </div>

      <button
        onClick={simulateRepayment}
        disabled={isSimulating}
        className="w-full px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSimulating ? 'Processing...' : 'Trigger Auto-Repayment'}
      </button>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">How This Works:</h4>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Merchant processes $1,000 sale via Stripe</li>
          <li>Webhook triggers your backend</li>
          <li>Backend calculates 10% = $100 repayment</li>
          <li>Bridge converts USD → USDC</li>
          <li>Smart contract calls repayLoan() using session key</li>
          <li>Borrower's wallet auto-approves (no signature needed!)</li>
        </ol>
      </div>

      {logs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Repayment History</h3>
          <div className="space-y-2">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  log.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">
                      ${log.amount} USDC
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      log.status === 'success'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
