'use client';

import Link from 'next/link';

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">The Vision</h1>
          <p className="text-sm opacity-90">
            Building reputation-backed credit infrastructure
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Aspirational Vision */}
        <section>
          <p className="text-base text-gray-800 leading-relaxed text-center font-light">
            Imagine a world where <strong className="font-semibold text-[#2E7D68]">your reputation replaces your credit score</strong>,
            your cashflow replaces collateral, and loans repay themselves automatically as you earn.
          </p>
        </section>

        {/* The Problem */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">The Problem</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Millions of entrepreneurs now run real businesses with public online profiles—merchants, freelancers, creators, crypto builders.
            They have customer reviews, social media followings, and verifiable income streams. Together they've built a $1+ trillion
            economy, and AI tools are accelerating their growth. They need capital to scale: equipment, inventory, working capital.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            But traditional lending is fundamentally broken: banks exclude billions without credit history, fintech lenders struggle with expensive funding and legacy payment rails (charging 20-40% APR), and DeFi requires 125% overcollateralization.
          </p>
        </section>

        {/* Vitalik Quote */}
        <section>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-[#2E7D68] rounded-r-lg p-4">
            <p className="text-xs text-gray-800 italic mb-2 leading-relaxed">
              "Perhaps the largest financial value built directly on reputation is credit and
              uncollateralized lending... the Web 3 ecosystem cannot replicate even the
              most primitive forms of uncollateralized lending..."
            </p>
            <p className="text-[10px] text-gray-600 font-semibold">
              — Vitalik Buterin & E. Glen Weyl
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-[#3B9B7F] rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">Our Vision</h2>
            <p className="text-sm text-gray-800 mb-3 text-center leading-relaxed">
              We make uncollateralized lending work by solving fintech's core problems. We eliminate VC and debt middlemen with <strong className="text-[#2E7D68]">community capital</strong>, replace costly payment rails with <strong className="text-[#2E7D68]">instant, low-cost stablecoins</strong>, and reduce defaults through <strong className="text-[#2E7D68]">social trust + cashflow data</strong>.
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              Result: 8-15% lower APR at scale. From friends helping friends to scalable infrastructure serving millions.
            </p>
          </div>
        </section>

        {/* Economics Comparison */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">How We Lower Costs</h3>
          <div className="space-y-4">
            {/* Traditional Fintech */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <h4 className="text-base font-bold text-red-900 mb-2 text-center">Traditional Fintech</h4>
              <p className="text-xs text-gray-700 text-center mb-3 italic">Cashflow underwriting, but 7-12% defaults</p>
              <div className="space-y-3">
                {/* Expensive Capital */}
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Expensive Capital</span>
                  </div>
                  <p className="text-xs text-gray-600">Borrow from VC (20%+) or banks (12-15%)</p>
                </div>

                <div className="flex justify-center text-lg text-red-600 font-bold">+</div>

                {/* Expensive Rails */}
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Expensive Rails</span>
                  </div>
                  <p className="text-xs text-gray-600">ACH $0.50/tx, 1-3 days</p>
                </div>

                <div className="flex justify-center text-lg text-red-600 font-bold">+</div>

                {/* Operational Overhead */}
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Overhead</span>
                  </div>
                  <p className="text-xs text-gray-600">$500K-$2.5M setup, $200K-$500K/yr</p>
                </div>

                <div className="flex justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Result */}
                <div className="bg-red-100 rounded-lg p-3 border-2 border-red-300">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-900">~20-50%</p>
                    <p className="text-xs text-red-700">To cover capital + infrastructure + defaults</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LendFriend */}
            <div className="bg-green-50 border-2 border-[#3B9B7F] rounded-lg p-4">
              <h4 className="text-base font-bold text-[#2E7D68] mb-2 text-center">LendFriend</h4>
              <p className="text-xs text-gray-700 text-center mb-3 italic">Cashflow + social trust to reduce defaults</p>
              <div className="space-y-3">
                {/* Low-Cost Capital */}
                <div className="bg-white rounded-lg p-3 border border-[#3B9B7F]">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Low-Cost Capital</span>
                  </div>
                  <p className="text-xs text-gray-600">Community capital, DeFi (5-10%)</p>
                </div>

                <div className="flex justify-center text-lg text-[#3B9B7F] font-bold">+</div>

                {/* Low-Cost Rails */}
                <div className="bg-white rounded-lg p-3 border border-[#3B9B7F]">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Low-Cost Rails</span>
                  </div>
                  <p className="text-xs text-gray-600">Stablecoins $0.01/tx, instant</p>
                </div>

                <div className="flex justify-center text-lg text-[#3B9B7F] font-bold">+</div>

                {/* Minimal Overhead */}
                <div className="bg-white rounded-lg p-3 border border-[#3B9B7F]">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Minimal Overhead</span>
                  </div>
                  <p className="text-xs text-gray-600">Smart contracts automate</p>
                </div>

                <div className="flex justify-center">
                  <svg className="w-5 h-5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Result */}
                <div className="bg-[#ECFDF5] rounded-lg p-3 border-2 border-[#3B9B7F]">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#2E7D68]">~10-40%</p>
                    <p className="text-xs text-[#065F46]">APR via better capital + infrastructure + defaults</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Roadmap */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">The Roadmap</h2>

          {/* Phase 1 */}
          <div className="bg-white border-2 border-[#3B9B7F] rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[#3B9B7F] text-white px-3 py-1 rounded text-xs font-bold">
                Phase 1
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2E7D68]">Bootstrap Trust Networks</h3>
                <p className="text-[10px] text-gray-600">Launching 2025</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 mb-3">
              Pure social lending at 0% to bootstrap the network
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <h4 className="text-[10px] font-semibold text-green-900 mb-1">Building</h4>
                <ul className="text-[9px] text-green-800 space-y-0.5">
                  <li>• $100-$5k loans at 0% interest</li>
                  <li>• Optional tipping</li>
                  <li>• <strong>Primary: Farcaster</strong> (Base app + platforms)</li>
                  <li>• Exploring: Bluesky, Twitter, Reddit</li>
                  <li>• Wallet verification + social signals</li>
                  <li>• On-chain repayment tracking</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <h4 className="text-[10px] font-semibold text-blue-900 mb-1">Learning</h4>
                <ul className="text-[9px] text-blue-800 space-y-0.5">
                  <li>• Which networks have demand?</li>
                  <li>• Community clusters vs. broad</li>
                  <li>• Repayment rates w/o interest</li>
                  <li>• Social proximity effects</li>
                  <li>• Trust cascade patterns</li>
                  <li>• Viral growth mechanics</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-300 rounded p-2">
              <p className="text-[10px] text-green-900">
                <strong>What Happens Next:</strong> We move to Phase 2 (cashflow + interest) with learnings about what borrowers need and where demand exists. Every loan teaches us something valuable.
              </p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold">
                Phase 2
              </div>
              <div>
                <h3 className="text-base font-bold text-purple-900">Scale with Algorithms</h3>
                <p className="text-[10px] text-gray-600">Q2 2026+</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 mb-3">
              Layer in cashflow data for larger loans with fair revenue-based terms
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-purple-50 border border-purple-200 rounded p-2">
                <h4 className="text-[10px] font-semibold text-purple-900 mb-1">New Capabilities</h4>
                <ul className="text-[9px] text-purple-800 space-y-0.5">
                  <li>• $10k-$25k+ loans</li>
                  <li>• Bank cash flow (Plaid)</li>
                  <li>• On-chain revenue</li>
                  <li>• Algorithmic underwriting</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded p-2">
                <h4 className="text-[10px] font-semibold text-purple-900 mb-1">The Model</h4>
                <ul className="text-[9px] text-purple-800 space-y-0.5">
                  <li>• Hybrid social + financial</li>
                  <li>• AUC ≈ 0.72-0.80</li>
                  <li>• Auto-approval</li>
                  <li>• Dynamic pricing</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-300 rounded p-2">
              <p className="text-[10px] text-green-900">
                Prosper, Branch, and Tala followed this exact evolution
              </p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gray-700 text-white px-3 py-1 rounded text-xs font-bold">
                Phase 3
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">The Credit Network</h3>
                <p className="text-[10px] text-gray-600">2027+</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 mb-3">
              Transform Farcaster's social graph into a full credit network
            </p>

            <ul className="space-y-1.5 text-[10px] text-gray-700">
              <li className="flex gap-2">
                <span className="text-[#3B9B7F] font-bold">→</span>
                <span>Cross-platform expansion beyond Farcaster</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#3B9B7F] font-bold">→</span>
                <span>Portable reputation scores across DeFi</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#3B9B7F] font-bold">→</span>
                <span>Secondary markets for loan participation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#3B9B7F] font-bold">→</span>
                <span>Serving 1.7B unbanked globally</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Viral Growth Mechanics */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">Built-In Viral Growth</h2>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4 mb-4">
            <h3 className="text-base font-bold text-purple-900 mb-2">The Viral Loop</h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              Every borrower who creates a loan becomes a growth engine. When they share their loan
              on Twitter, Farcaster, WhatsApp & LinkedIn to reach their funding goal, they naturally
              introduce dozens of potential lenders to the protocol.
            </p>

            <div className="bg-white rounded p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-xs font-semibold text-gray-900">Borrower creates loan</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span className="text-xs font-semibold text-gray-900">Shares to 50-200 people on socials</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <span className="text-xs font-semibold text-gray-900">10-20% visit and become lenders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                <span className="text-xs font-semibold text-gray-900">Some lenders become borrowers → loop repeats</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <h5 className="text-[10px] font-semibold text-green-900 mb-1">Viral Coefficient</h5>
                <p className="text-[9px] text-green-800">
                  If each user brings 1.5+ new users, growth becomes exponential. Loan sharing achieves this naturally.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <h5 className="text-[10px] font-semibold text-blue-900 mb-1">Network Effects</h5>
                <p className="text-[9px] text-blue-800">
                  More borrowers = more shares = more lenders = more liquidity = more loans funded
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFBEB] border border-amber-300 rounded-lg p-3">
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>The magic:</strong> Borrowers aren't sharing "an app"—they're sharing their personal story
              and asking for help. This emotional connection drives 10-100x better engagement than traditional
              marketing. Each funded loan proves the concept works, creating social proof that accelerates growth.
            </p>
          </div>
        </section>

        {/* Why This Matters */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why This Matters</h2>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#3B9B7F] mb-1">1.7B</div>
              <p className="text-[9px] text-gray-600">Unbanked adults</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#3B9B7F] mb-1">$100B+</div>
              <p className="text-[9px] text-gray-600">Payday loans (US)</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#3B9B7F] mb-1">300%+</div>
              <p className="text-[9px] text-gray-600">Payday APR</p>
            </div>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed mb-2">
            Traditional finance has failed billions. Web3 has the tools—persistent identity, transparent
            transactions, programmable trust—but until now, no one has built the primitive for
            uncollateralized lending.
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">
            LendFriend is that primitive. We're proving <strong>reputation can be collateral</strong>,
            <strong> communities can be underwriters</strong>, and <strong>algorithms can scale trust</strong>
            without extracting predatory profits.
          </p>
        </section>

        {/* Principles */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Principles</h2>

          <div className="space-y-2">
            <div className="bg-white border-l-4 border-[#3B9B7F] p-3 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-1 text-xs">🔍 Transparent by Default</h3>
              <p className="text-gray-700 text-[10px]">
                All loans and repayments on-chain. No black boxes, no hidden fees.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-3 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-1 text-xs">📊 Research-Driven</h3>
              <p className="text-gray-700 text-[10px]">
                Every decision backed by academic research and proven fintech evolution.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-3 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-1 text-xs">🤝 Community-Governed</h3>
              <p className="text-gray-700 text-[10px]">
                Real people with persistent identities. Reputation and accountability matter.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-3 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-1 text-xs">💚 Mission-First</h3>
              <p className="text-gray-700 text-[10px]">
                Start altruistic (0%), evolve to sustainable (0-5%). Not extractive, just fair.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="bg-[#3B9B7F] rounded-lg p-5 text-center text-white">
            <h2 className="text-lg font-bold mb-2">Join the Movement</h2>
            <p className="text-sm mb-4 opacity-90">
              Help us build the future of credit
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
              <Link
                href="/research"
                className="block px-6 py-2.5 border-2 border-white text-white text-sm font-bold rounded-lg hover:bg-white hover:text-[#3B9B7F] transition-colors"
              >
                Read Research
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
