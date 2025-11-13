import { WalletConnect } from '@/components/WalletConnect'
import { SessionKeyDemo } from '@/components/SessionKeyDemo'
import { AutoRepaymentDemo } from '@/components/AutoRepaymentDemo'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          CDP Auto-Repayment Demo
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how Coinbase Smart Wallets enable automatic loan repayments using ERC-4337 session keys
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Connect Wallet */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
              1
            </div>
            <h2 className="text-2xl font-bold">Connect CDP Smart Wallet</h2>
          </div>
          <WalletConnect />
        </div>

        {/* Step 2: Create Session Key */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
              2
            </div>
            <h2 className="text-2xl font-bold">Create Session Key</h2>
          </div>
          <SessionKeyDemo />
        </div>

        {/* Step 3: Simulate Auto-Repayment */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
              3
            </div>
            <h2 className="text-2xl font-bold">Simulate Auto-Repayment</h2>
          </div>
          <AutoRepaymentDemo />
        </div>

        {/* Architecture Diagram */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Architecture Overview</h2>
          <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
            <div className="space-y-2">
              <div className="text-gray-700">📊 <strong>Merchant Revenue</strong> (Stripe/Square)</div>
              <div className="ml-4 text-gray-600">↓ Webhook triggers backend</div>

              <div className="text-gray-700">🔄 <strong>Backend</strong> (Your server)</div>
              <div className="ml-4 text-gray-600">↓ Calculates repayment % of revenue</div>

              <div className="text-gray-700">💱 <strong>Bridge API</strong> (Stripe)</div>
              <div className="ml-4 text-gray-600">↓ Converts USD → USDC on Base</div>

              <div className="text-gray-700">📝 <strong>Smart Contract</strong> (Your protocol)</div>
              <div className="ml-4 text-gray-600">↓ Calls repayLoan() with session key</div>

              <div className="text-gray-700">🔐 <strong>CDP Smart Wallet</strong> (ERC-4337)</div>
              <div className="ml-4 text-gray-600">↓ validateUserOp() checks session key</div>
              <div className="ml-4 text-gray-600">↓ Auto-approves if within limits</div>

              <div className="text-gray-700">✅ <strong>Repayment Complete</strong></div>
              <div className="ml-4 text-gray-600">→ USDC distributed to lenders</div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg shadow p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Why This Matters</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">🚀 Zero Friction</h3>
              <p className="text-sm opacity-90">
                Borrowers sign ONCE. All future repayments are automatic.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">🔒 Still Non-Custodial</h3>
              <p className="text-sm opacity-90">
                Users control session key limits. Revoke anytime.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">📈 Revenue-Based</h3>
              <p className="text-sm opacity-90">
                Deduct % of actual sales. Fair for merchants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
