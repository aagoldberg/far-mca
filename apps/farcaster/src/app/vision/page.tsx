'use client';

import Link from 'next/link';

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The Vision
          </h1>
          <p className="text-xl md:text-2xl font-light">
            Building the infrastructure for reputation-backed credit—from trust to scale.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-3xl mx-auto px-6 py-12">

        {/* The Problem */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Traditional lending is broken. Banks exclude billions who lack credit history or collateral.
              Payday lenders prey on the vulnerable with 300%+ APR. DeFi requires 150% overcollateralization,
              defeating the purpose of credit.
            </p>
            <p>
              Meanwhile, we all trust people based on reputation every day—who we hire, who we do business with,
              who we lend to informally. <strong>But this social capital has never been systematized for credit at scale.</strong>
            </p>
          </div>

          {/* Vitalik Quote */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-[#2E7D68] rounded-xl p-6">
            <p className="text-gray-800 text-lg italic mb-4 leading-relaxed">
              "Perhaps the largest financial value built directly on reputation is credit and
              uncollateralized lending. Currently, the Web 3 ecosystem cannot replicate even the
              most primitive forms of uncollateralized lending... because there is no web3-native
              representation of persistent identity and reputation."
            </p>
            <p className="text-sm text-gray-600 font-semibold">
              — Vitalik Buterin & E. Glen Weyl
            </p>
            <p className="text-xs text-gray-500 italic">
              "Decentralized Society: Finding Web3's Soul" (2022)
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-[#3B9B7F] rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our Vision</h2>
            <p className="text-xl text-gray-800 mb-6 text-center leading-relaxed">
              A world where <strong className="text-[#2E7D68]">your reputation is your collateral</strong>,
              your network is your credit history, and your community is your underwriter.
            </p>
            <div className="space-y-4 text-gray-700">
              <p>
                We're building the primitive that Vitalik described: <strong>web3-native uncollateralized lending</strong>
                powered by persistent identity and reputation. Not extractive payday lending. Not restrictive traditional banking.
                But fair, transparent, community-driven credit.
              </p>
              <p>
                This starts simple—friends helping friends at 0% interest—then evolves to algorithmic underwriting
                that serves millions while maintaining social accountability.
              </p>
            </div>
          </div>
        </section>

        {/* How We Get There: The Roadmap */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How We Get There</h2>
          <p className="text-gray-600 text-center mb-8">
            A research-backed evolution from social trust to scalable credit infrastructure
          </p>

          {/* Phase 1 */}
          <div className="mb-8">
            <div className="bg-white border-2 border-[#3B9B7F] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#3B9B7F] text-white px-4 py-2 rounded-lg font-bold">
                  Phase 1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#2E7D68]">Bootstrap Trust</h3>
                  <p className="text-sm text-gray-600">Q4 2025 - Q1 2026</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">
                  Pure altruistic lending at 0% interest to prove the primitive works
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">What We're Building</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✓ $100-$5,000 community loans</li>
                      <li>✓ Farcaster-native identity</li>
                      <li>✓ Multi-signal reputation scoring</li>
                      <li>✓ Transparent on-chain repayments</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">What We're Learning</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ Repayment behavior patterns</li>
                      <li>✓ Trust network topology</li>
                      <li>✓ Social signal predictiveness</li>
                      <li>✓ Community dynamics at scale</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                  <p className="text-sm text-amber-900">
                    <strong>Success Metric:</strong> 500-1,000 users, 3-6 months of clean behavioral data,
                    proven that reputation-backed 0% interest loans can work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="mb-8">
            <div className="bg-white border-2 border-purple-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">
                  Phase 2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-900">Scale with Algorithms</h3>
                  <p className="text-sm text-gray-600">Q2 2026+</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">
                  Layer in cash flow data for larger loans with socially-appropriate interest
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">New Capabilities</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>✓ $10k-$25k+ loan sizes</li>
                      <li>✓ Bank account cash flow (Plaid)</li>
                      <li>✓ On-chain revenue verification</li>
                      <li>✓ Algorithmic underwriting (0-5%)</li>
                      <li>✓ Revenue-based repayment</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">The Model</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>✓ Hybrid social + financial signals</li>
                      <li>✓ Proven AUC ≈ 0.72-0.80 accuracy</li>
                      <li>✓ Auto-approval for qualified loans</li>
                      <li>✓ Dynamic risk-based pricing</li>
                      <li>✓ Continuous model improvement</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                  <p className="text-sm text-green-900">
                    <strong>This isn't theory:</strong> Prosper, Branch, and Tala all followed this exact evolution—
                    start with social proof, gather data, scale with algorithms. We're doing the same, but transparent and on-chain.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold">
                  Phase 3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">The Credit Network</h3>
                  <p className="text-sm text-gray-600">2027+</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">
                  Transform Farcaster's social graph into a full credit network
                </p>

                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <span className="text-[#3B9B7F] font-bold">→</span>
                    <span><strong>Cross-platform expansion:</strong> Extend beyond Farcaster to broader web3 identity</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#3B9B7F] font-bold">→</span>
                    <span><strong>Credit scoring primitive:</strong> Portable reputation scores used across DeFi</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#3B9B7F] font-bold">→</span>
                    <span><strong>Liquidity markets:</strong> Secondary markets for loan participation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#3B9B7F] font-bold">→</span>
                    <span><strong>Institutional integration:</strong> Traditional lenders using our risk models</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#3B9B7F] font-bold">→</span>
                    <span><strong>Global accessibility:</strong> Serving the 1.7B unbanked worldwide</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why This Matters</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-4xl font-bold text-[#3B9B7F] mb-2">1.7B</div>
              <p className="text-sm text-gray-600">Unbanked adults globally</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-4xl font-bold text-[#3B9B7F] mb-2">$100B+</div>
              <p className="text-sm text-gray-600">Annual payday loan market (US)</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-4xl font-bold text-[#3B9B7F] mb-2">300%+</div>
              <p className="text-sm text-gray-600">Typical payday loan APR</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Traditional finance has failed to serve billions of people. Web3 has the tools to fix this—
              persistent identity, transparent transactions, programmable trust—but until now, no one has
              built the primitive for uncollateralized lending.
            </p>
            <p>
              LendFriend is that primitive. We're proving that <strong>reputation can be collateral</strong>,
              that <strong>communities can be underwriters</strong>, and that <strong>algorithms can scale trust</strong>
              without extracting predatory profits.
            </p>
            <p>
              This isn't just a product. It's infrastructure for a fairer financial system.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Principles</h2>

          <div className="space-y-4">
            <div className="bg-white border-l-4 border-[#3B9B7F] p-5 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">🔍 Transparent by Default</h3>
              <p className="text-gray-700 text-sm">
                All loans, repayments, and reputation scoring are on-chain and publicly auditable.
                No black boxes, no hidden fees, no surprises.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-5 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">📊 Research-Driven</h3>
              <p className="text-gray-700 text-sm">
                Every decision is backed by academic research and proven fintech evolution.
                We're not guessing—we're following the data.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-5 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">🤝 Community-Governed</h3>
              <p className="text-gray-700 text-sm">
                Borrowers and lenders are real people with persistent identities.
                Reputation matters. Community accountability matters.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-5 rounded-r-xl">
              <h3 className="font-bold text-gray-900 mb-2">💚 Mission-First</h3>
              <p className="text-gray-700 text-sm">
                We start altruistic (0% interest) and evolve to sustainable (0-5% for larger loans).
                Not extractive. Not predatory. Just fair.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-[#3B9B7F] rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
            <p className="text-lg mb-6 opacity-90 leading-relaxed">
              We're building the future of credit. Help us prove that reputation,
              community, and trust can power a fairer financial system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-white text-[#3B9B7F] font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Loans
              </Link>
              <Link
                href="/create"
                className="inline-block px-8 py-3 bg-[#2E7D68] text-white font-bold rounded-lg hover:bg-[#255A51] transition-colors"
              >
                Create a Loan
              </Link>
              <Link
                href="/research"
                className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#3B9B7F] transition-colors"
              >
                Read the Research
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
