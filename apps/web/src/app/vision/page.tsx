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
                    <span><strong>Multi-platform expansion:</strong> Bluesky (2026), Twitter/X (2027) with adapted risk models</span>
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

        {/* Platform Expansion Strategy */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Platform Expansion Strategy</h2>
          <p className="text-gray-600 text-center mb-8">
            Research-backed approach to maintaining signal quality across platforms
          </p>

          <div className="space-y-6">
            {/* Farcaster */}
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">✅</div>
                <h3 className="text-xl font-bold text-green-900">Farcaster (Phase 1-2: 2025-2026)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Why It's Strongest</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Wallet-based identity (crypto signatures)</li>
                    <li>• Crypto-native community (shared context)</li>
                    <li>• Neynar quality scores filter spam/bots</li>
                    <li>• Real relationships in tight-knit community</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Risk Model Weights</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Repayment History: 40%</li>
                    <li>• Social Trust Score: 30% (high confidence)</li>
                    <li>• Loan Size Risk: 20%</li>
                    <li>• Account Quality: 10%</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bluesky */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">⚠️</div>
                <h3 className="text-xl font-bold text-blue-900">Bluesky (Phase 2-3: 2026)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Signal Characteristics</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Domain-based verification (e.g., yourname.com)</li>
                    <li>• AT Protocol (decentralized, self-authenticating)</li>
                    <li>• Mix of real connections + strangers</li>
                    <li>• Better than Twitter, worse than Farcaster</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Adapted Risk Model</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Repayment History: 50% (↑10%)</li>
                    <li>• Social Trust Score: 20% (↓10%)</li>
                    <li>• Loan Size Risk: 20%</li>
                    <li>• Account Quality: 10% (+ domain verification)</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Mitigation:</strong> Weight domain-verified accounts higher. Cross-platform verification bonus (same user on Farcaster + Bluesky = more trustworthy).
                </p>
              </div>
            </div>

            {/* Twitter/X */}
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">🚨</div>
                <h3 className="text-xl font-bold text-amber-900">Twitter/X (Phase 3: 2027)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Signal Challenges</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Research: ~64% of accounts are bots</li>
                    <li>• "Less about real life friendships" (research)</li>
                    <li>• Follow-for-follow gaming common</li>
                    <li>• Anonymous accounts, email-based identity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Heavily Adapted Model</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Repayment History: 60% (↑20%)</li>
                    <li>• Social Trust Score: 10% (↓20%)</li>
                    <li>• Loan Size Risk: 20%</li>
                    <li>• Account Quality: 10% (require verification)</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-100 rounded-lg p-3">
                <p className="text-sm text-amber-900">
                  <strong>Requirements:</strong> Twitter Blue verification required (paid = Sybil resistance). Use Twitter as supplementary data only, not primary. Connections don't create social accountability because they're not real relationships.
                </p>
              </div>
            </div>

            {/* On-Chain Reputation */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">✅</div>
                <h3 className="text-xl font-bold text-purple-900">On-Chain Reputation (Phase 2-3: 2026-2027)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-purple-900 mb-2">Why It's Powerful</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Cryptographically verifiable (can't fake)</li>
                    <li>• Crypto-native signals for crypto users</li>
                    <li>• No API restrictions/permissions</li>
                    <li>• Complements social trust</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900 mb-2">Data Sources</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• ENS ownership (long-held domains)</li>
                    <li>• POAP collections (event attendance)</li>
                    <li>• DAO participation (voting, treasury)</li>
                    <li>• GitHub contributions (dev work)</li>
                    <li>• Base L2 transaction history</li>
                    <li>• Icebreaker credentials</li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <p className="text-sm text-purple-900">
                  <strong>Why it matters:</strong> Many crypto borrowers have non-traditional employment (DAO contributors, freelance devs).
                  Traditional employment data would penalize them. On-chain reputation captures their actual economic activity and community standing.
                </p>
              </div>
            </div>

            {/* Why Not Facebook */}
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">❌</div>
                <h3 className="text-xl font-bold text-red-900">Why Not Facebook?</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">API Access Blockers</h4>
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• <code className="bg-red-100 px-1 rounded">user_friends</code> permission restricted to "limited partners"</li>
                    <li>• Even if approved, only shows friends who also use your app (circular dependency)</li>
                    <li>• 2016: Facebook stopped letting lenders access data post-Cambridge Analytica</li>
                    <li>• Only ~20% user opt-in rate for friend permissions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Signal Quality Issues</h4>
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• Research: Only BFFs (friends who actually interact) predict defaults</li>
                    <li>• Facebook API doesn't provide interaction data—only friend lists</li>
                    <li>• Nominal connections have no predictive value</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-3">
                  <p className="text-sm text-red-900">
                    <strong>The Mutual App Problem:</strong> Can't get social graph data until both borrower AND lender already use LendFriend—a bootstrapping death spiral.
                  </p>
                </div>
              </div>
            </div>

            {/* Research Foundation */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">📊 Research Foundation</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Facebook vs Twitter research:</strong> "Facebook is more focused towards making social connections, while Twitter is all about staying informed... Facebook is typically full of people users have met... while Twitter is less about 'real life' friendships, and it's normal to connect with strangers."
                </p>
                <p>
                  <strong>BFF vs nominal friends (Bjorkegren & Grissen 2020):</strong> Only BFFs (friends who actually interact) predict loan defaults. Nominal friend connections and interest-based data performed equally well—meaning nominal connections have no unique value.
                </p>
                <p>
                  <strong>Real-life connections matter (Yum et al. 2012):</strong> Social lending groups only reduce default risk "if membership holds the possibility of real-life personal connections." Online-only groups behave like arm's-length transactions.
                </p>
                <p>
                  <strong>Key insight:</strong> As we expand platforms, shift from social trust → repayment history. Farcaster lets us bootstrap with social trust because connections are real. Twitter requires traditional credit history because connections are noise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Viral Growth Mechanics */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Built-In Viral Growth</h2>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">The Viral Loop</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Every borrower who creates a loan becomes a growth engine. When they share their loan
              on Twitter, Farcaster, WhatsApp & LinkedIn to reach their funding goal, they naturally
              introduce dozens of potential lenders to the protocol.
            </p>

            <div className="bg-white rounded-xl p-5 mb-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">1</div>
                  <span className="text-base font-semibold text-gray-900">Borrower creates loan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">2</div>
                  <span className="text-base font-semibold text-gray-900">Shares to 50-200 people across social platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">3</div>
                  <span className="text-base font-semibold text-gray-900">10-20% click through and become lenders</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">4</div>
                  <span className="text-base font-semibold text-gray-900">Some lenders become borrowers → loop repeats</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h5 className="font-semibold text-green-900 mb-2">Viral Coefficient &gt; 1.5</h5>
                <p className="text-sm text-green-800">
                  When each user brings 1.5+ new users, growth becomes exponential. Loan sharing achieves this naturally
                  because borrowers are motivated to reach their funding goal.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h5 className="font-semibold text-blue-900 mb-2">Network Effects</h5>
                <p className="text-sm text-blue-800">
                  More borrowers → more shares → more lenders → more liquidity → more loans funded.
                  The flywheel accelerates as the community grows.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-300 rounded-xl p-6">
            <h4 className="font-bold text-amber-900 mb-3">The Magic of Personal Stories</h4>
            <p className="text-gray-700 leading-relaxed mb-3">
              Borrowers aren't sharing "an app"—they're sharing their personal story and asking their community for help.
              This emotional connection drives 10-100x better engagement than traditional marketing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Each funded loan proves the concept works, creating social proof that accelerates growth.
              As more people see their friends successfully using LendFriend, trust in the platform compounds exponentially.
            </p>
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
