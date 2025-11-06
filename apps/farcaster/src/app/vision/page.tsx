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

        {/* The Problem */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">The Problem</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Digital platforms have enabled millions of entrepreneurs to earn borderlessly—merchants accepting payments online,
            freelancers working globally, crypto workers in DAOs. Together they've built a $1+ trillion economy with verifiable
            income. AI tools are making it easier than ever to scale, and they need capital to grow: equipment, inventory, working capital.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            But traditional lending is fundamentally broken: banks exclude billions without credit history, fintech lenders struggle with expensive lending capital and legacy infrastructure, payday lenders charge 300%+ APR, and DeFi requires 125% overcollateralization.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Meanwhile, we trust people based on reputation daily—<strong>but this social capital has never been
            systematized for credit at scale.</strong>
          </p>

          {/* Vitalik Quote */}
          <div className="mt-4 bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-[#2E7D68] rounded-r-lg p-4">
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
              Uncollateralized lending with <strong className="text-[#2E7D68]">fundamentally better economics</strong>. We solve expensive lending capital with <strong className="text-[#2E7D68]">peer-to-peer community funding</strong>, replace legacy infrastructure with <strong className="text-[#2E7D68]">stablecoins</strong>, and reduce defaults through <strong className="text-[#2E7D68]">social trust + cashflow data</strong>.
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              Result: 8-15% lower APR at scale. From friends helping friends to scalable infrastructure serving millions.
            </p>
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

          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
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
