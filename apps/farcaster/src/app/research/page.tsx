'use client';

import Link from 'next/link';

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">Research</h1>
          <p className="text-sm opacity-90">
            The academic foundations of reputation-backed lending
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Mission */}
        <section>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-base font-bold text-gray-900 mb-2">Why We Exist</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Traditional lending excludes billions without credit history or collateral.
              We're building a third path: <strong>reputation-backed lending</strong> that starts with
              trust and evolves to scale.
            </p>

            {/* Quote */}
            <div className="bg-white border-l-4 border-[#2E7D68] pl-4 py-3">
              <p className="text-xs text-gray-700 italic mb-2">
                "Perhaps the largest financial value built directly on reputation is credit and
                uncollateralized lending... the Web 3 ecosystem cannot replicate even the
                most primitive forms of uncollateralized lending..."
              </p>
              <p className="text-[10px] text-gray-600">
                — Vitalik Buterin & E. Glen Weyl
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How It Works</h2>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="w-8 h-8 bg-[#3B9B7F] rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h3 className="text-xs font-bold text-gray-900 mb-1">Request</h3>
              <p className="text-[10px] text-gray-600">
                Set goal, terms, and story with your Farcaster identity
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="w-8 h-8 bg-[#3B9B7F] rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h3 className="text-xs font-bold text-gray-900 mb-1">Fund</h3>
              <p className="text-[10px] text-gray-600">
                Community contributes USDC on Base L2
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="w-8 h-8 bg-[#3B9B7F] rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h3 className="text-xs font-bold text-gray-900 mb-1">Repay</h3>
              <p className="text-[10px] text-gray-600">
                Transparent on-chain repayments
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-xs font-bold text-blue-900 mb-2">Multi-Signal Reputation</h4>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-blue-700">
              <div>• Farcaster identity & history</div>
              <div>• Neynar spam score</div>
              <div>• OpenRank social graph</div>
              <div>• Gitcoin Passport</div>
              <div>• On-chain wallet activity</div>
              <div>• Lender vouching patterns</div>
            </div>
          </div>
        </section>

        {/* Two-Phase Evolution */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Two-Phase Evolution</h2>

          {/* Version 1.0 */}
          <div className="bg-white border-2 border-[#3B9B7F] rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[#3B9B7F] text-white px-3 py-1 rounded text-xs font-bold">
                v1.0
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2E7D68]">Social at 0%</h3>
                <p className="text-[10px] text-gray-600">Q4 2025 - Q1 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <h5 className="text-[10px] font-semibold text-green-800 mb-1">Trust Signals</h5>
                <ul className="text-[9px] text-green-700 space-y-0.5">
                  <li>• Farcaster identity</li>
                  <li>• Reputation scores</li>
                  <li>• Wallet activity</li>
                  <li>• Lender vouching</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-2">
                <h5 className="text-[10px] font-semibold text-green-800 mb-1">Cash Flow Proxies</h5>
                <ul className="text-[9px] text-green-700 space-y-0.5">
                  <li>• Cast frequency</li>
                  <li>• Network growth</li>
                  <li>• Mutual connections</li>
                  <li>• Activity consistency</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-300 rounded p-2">
              <p className="text-[10px] text-amber-900">
                Research shows social signals support <strong>~$6k average</strong> loans.
                v1 focuses on $100-$5k to build trust within proven bounds.
              </p>
            </div>
          </div>

          {/* Version 2.0 */}
          <div className="bg-white border-2 border-purple-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold">
                v2.0
              </div>
              <div>
                <h3 className="text-base font-bold text-purple-900">Hybrid at 0-5%</h3>
                <p className="text-[10px] text-gray-600">Q2 2026+</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 mb-3">
              Add verified cash flow for $10k-$25k+ loans with socially-appropriate interest
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-purple-50 border border-purple-200 rounded p-2">
                <h5 className="text-[10px] font-semibold text-purple-800 mb-1">New Data</h5>
                <ul className="text-[9px] text-purple-700 space-y-0.5">
                  <li>• Bank cash flow (Plaid)</li>
                  <li>• On-chain revenue</li>
                  <li>• Creator earnings</li>
                  <li>• Merchant payments</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded p-2">
                <h5 className="text-[10px] font-semibold text-purple-800 mb-1">Automation</h5>
                <ul className="text-[9px] text-purple-700 space-y-0.5">
                  <li>• Auto-approval &lt;$10k</li>
                  <li>• Dynamic pricing</li>
                  <li>• Revenue-based repay</li>
                  <li>• Continuous learning</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <p className="text-[10px] text-blue-800">
                Hybrid models achieve <strong>AUC ≈ 0.72-0.80</strong> vs 0.65 for social alone
              </p>
            </div>
          </div>
        </section>

        {/* Research Foundation */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Research-Backed Evolution</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-gray-900 mb-1">Platform Evolution</h4>
                <ul className="space-y-2 text-[10px] text-gray-700">
                  <li>
                    <strong>Prosper:</strong> Social networks → algorithmic (2006-2010)
                  </li>
                  <li>
                    <strong>Branch:</strong> Group lending → ML with 2,000+ data points
                  </li>
                  <li>
                    <strong>Tala:</strong> Mobile → causal ML. Doubled approval rates, $300M revenue
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-900 mb-1">Academic Evidence</h4>
                <ul className="space-y-2 text-[10px] text-gray-700">
                  <li>
                    <strong>Karlan (2007):</strong> Group lending reduced defaults 7%
                  </li>
                  <li>
                    <strong>Field & Pande (2008):</strong> Monthly = same default, 51% less stress
                  </li>
                  <li>
                    <strong>FinRegLab (2023):</strong> Cash flow AUC ≈ 0.80, hybrid 0.72-0.80
                  </li>
                  <li>
                    <strong>Upstart (2022):</strong> Alt data + ML = 27% more approvals
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who We Serve</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Borrowers</h3>
              <ul className="space-y-1 text-[10px] text-gray-600">
                <li>• Underbanked individuals</li>
                <li>• Small business owners</li>
                <li>• Creators & freelancers</li>
                <li>• Farcaster community</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Lenders</h3>
              <ul className="space-y-1 text-[10px] text-gray-600">
                <li>• Community supporters</li>
                <li>• Impact investors (v1)</li>
                <li>• Yield seekers (v2: 0-5%)</li>
                <li>• DeFi users</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Different */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What Makes Us Different</h2>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-xs font-bold text-gray-900 mb-1">🔍 Transparent</h4>
              <p className="text-[10px] text-gray-600">All on-chain, no black boxes</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-xs font-bold text-gray-900 mb-1">🤝 Community</h4>
              <p className="text-[10px] text-gray-600">Real Farcaster identities</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-xs font-bold text-gray-900 mb-1">📊 Data-Driven</h4>
              <p className="text-[10px] text-gray-600">Following proven research</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-xs font-bold text-gray-900 mb-1">⚡ Low-Cost</h4>
              <p className="text-[10px] text-gray-600">Base L2, ~$0.01-0.10 fees</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-xs font-bold text-gray-900 mb-1">🔐 Safe</h4>
              <p className="text-[10px] text-gray-600">Smart contracts, no custodians</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="text-xs font-bold text-gray-900 mb-1">🌱 Bootstrap</h4>
              <p className="text-[10px] text-gray-600">0% → 0-5%, not extractive</p>
            </div>
          </div>
        </section>

        {/* The Vision */}
        <section>
          <div className="bg-gradient-to-r from-green-50 to-purple-50 border-2 border-[#3B9B7F] rounded-lg p-4 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">The Vision</h2>
            <p className="text-sm text-gray-700 mb-3">
              A world where <strong>your reputation is your collateral</strong>, your network is your
              credit history, and your community is your underwriter.
            </p>
            <p className="text-xs text-gray-600">
              Building reputation-backed credit infrastructure that's transparent, on-chain,
              and community-governed.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="bg-[#3B9B7F] rounded-lg p-5 text-center text-white">
            <h2 className="text-lg font-bold mb-2">Join the Movement</h2>
            <p className="text-sm mb-4 opacity-90">
              Help us prove reputation-backed credit works
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="block px-6 py-2.5 bg-white text-[#3B9B7F] text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Loans
              </Link>
              <Link
                href="/create"
                className="block px-6 py-2.5 bg-[#2E7D68] text-white text-sm font-bold rounded-lg hover:bg-[#255A51] transition-colors"
              >
                Create a Loan
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
