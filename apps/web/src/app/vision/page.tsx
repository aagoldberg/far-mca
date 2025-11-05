'use client';

import Link from 'next/link';

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The Vision
          </h1>
          <p className="text-xl md:text-2xl font-light">
            Building the infrastructure for reputation-backed credit—from social trust to global scale
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-6 py-12">

        {/* Intro Quote */}
        <section className="mb-16">
          <p className="text-2xl text-gray-800 leading-relaxed text-center mb-4 font-light">
            Imagine a world where <strong className="font-semibold text-[#2E7D68]">your reputation replaces your credit score</strong>,
            your cashflow replaces collateral, and loans repay themselves automatically as you earn.
          </p>
        </section>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Traditional lending is fundamentally broken:
            </p>
            <ul className="ml-6 space-y-2">
              <li>• <strong>Banks</strong> exclude billions who lack credit history or collateral</li>
              <li>• <strong>Payday lenders</strong> prey on the vulnerable with 300%+ APR</li>
              <li>• <strong>DeFi</strong> requires 150% overcollateralization, defeating the purpose of credit</li>
            </ul>
            <p className="pt-4">
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
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-[#3B9B7F] rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Our Vision</h2>
            <p className="text-xl text-gray-800 mb-6 text-center leading-relaxed">
              A world where <strong className="text-[#2E7D68]">your reputation is your collateral</strong>,
              your cashflow is your credit history, and your community is your underwriter.
            </p>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We're building the primitive that Vitalik described: <strong>web3-native uncollateralized lending</strong>
                powered by persistent identity and quantifiable reputation. Not extractive payday lending. Not restrictive traditional banking.
                But fair, transparent, community-driven credit.
              </p>
              <p>
                This starts simple—friends helping friends at 0% interest—then evolves through three phases to become
                scalable infrastructure that serves millions while maintaining social accountability.
              </p>
            </div>
          </div>
        </section>

        {/* Three-Phase Journey */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">The Journey</h2>
          <p className="text-gray-600 text-center mb-10 text-lg">
            A research-backed evolution from social trust to automated, scalable credit infrastructure
          </p>

          {/* Phase 0 */}
          <div className="mb-8">
            <div className="bg-white border-2 border-[#3B9B7F] rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#3B9B7F] text-white px-5 py-2 rounded-lg font-bold text-lg flex-shrink-0">
                  Phase 0
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#2E7D68] mb-1">Prove Trust Works</h3>
                  <p className="text-sm text-gray-600 font-medium">Live on Testnet • Launching Mainnet 2025</p>
                </div>
              </div>

              <p className="text-lg font-semibold text-gray-900 mb-6">
                Testing zero-interest loans backed purely by social signals to prove the fundamental primitive
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">What We're Building</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex gap-2">
                      <span className="text-[#3B9B7F] font-bold">→</span>
                      <span>$100-$5,000 community loans at 0% interest</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#3B9B7F] font-bold">→</span>
                      <span>Farcaster-native identity with wallet-based verification</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#3B9B7F] font-bold">→</span>
                      <span>Multi-signal reputation scoring (social proximity + on-chain history)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#3B9B7F] font-bold">→</span>
                      <span>Transparent on-chain repayments on Base L2</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">The Hypothesis</h4>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-gray-800">
                      Can reputation-backed lending achieve <strong>90%+ repayment</strong> with zero interest and zero collateral?
                      We believe yes—when persistent identity and social accountability are at stake.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">What We're Learning</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Behavioral Patterns</p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Funding speed vs. trust scores</li>
                        <li>• Repayment timing patterns</li>
                        <li>• Social proximity correlations</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-purple-900 mb-2">Network Topology</p>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Community cluster funding</li>
                        <li>• Trust cascades (friends → network)</li>
                        <li>• Viral growth mechanics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                  <p className="text-sm text-green-900">
                    <strong>Success Criteria:</strong> 500-1,000 users, 90%+ repayment rate, 3-6 months of clean behavioral data.
                    If we achieve this, we've proven the primitive works and can move to Phase 1.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="https://docs.lendfriend.org/vision/phase-0"
                  className="text-[#2E7D68] hover:text-[#3B9B7F] font-semibold"
                >
                  → Technical implementation details
                </Link>
              </div>
            </div>
          </div>

          {/* Phase 1 */}
          <div className="mb-8">
            <div className="bg-white border-2 border-purple-300 rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-purple-600 text-white px-5 py-2 rounded-lg font-bold text-lg flex-shrink-0">
                  Phase 1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-1">Scale with Cashflow</h3>
                  <p className="text-sm text-gray-600 font-medium">Planned 2025-2026</p>
                </div>
              </div>

              <p className="text-lg font-semibold text-gray-900 mb-6">
                Layer in cashflow data for larger loans with fair interest rates
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">The Key Shift</h4>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                    <p className="text-gray-800 mb-3">
                      Cashflow verification transforms lending from <strong>"I trust my friend"</strong> to <strong>"I trust the data"</strong>.
                    </p>
                    <p className="text-gray-700 text-sm">
                      With objective cashflow data, lenders don't need to personally know borrowers. Anonymous capital can
                      fund loans through pools. Liquidity scales beyond personal networks.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">New Capabilities</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Larger Loans</p>
                      <p className="text-sm text-gray-700">$5,000 - $50,000+ based on verified cashflow</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Cashflow Verification</p>
                      <p className="text-sm text-gray-700">Bank accounts (Plaid), merchant revenue (Square, Shopify)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Liquidity Pools</p>
                      <p className="text-sm text-gray-700">Passive lenders earn yields without active loan selection</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Sustainable Interest</p>
                      <p className="text-sm text-gray-700">0-8% APR (far below payday loans' 300%+)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Hybrid Risk Model</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-800 mb-3">
                      Combining social trust + verified cashflow + repayment history for accurate underwriting:
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>• <strong>Small loans ($100-$5K):</strong></span>
                        <span className="text-gray-600">60% social, 30% cashflow</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• <strong>Medium loans ($5K-$25K):</strong></span>
                        <span className="text-gray-600">40% social, 40% cashflow</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• <strong>Large loans ($25K+):</strong></span>
                        <span className="text-gray-600">20% social, 60% cashflow</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                  <p className="text-sm text-green-900">
                    <strong>Goal:</strong> Serve borrowers traditional finance excludes—freelancers, crypto-native workers, small merchants.
                    Prove that hybrid underwriting can scale to millions while maintaining fairness.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="https://docs.lendfriend.org/vision/phase-1"
                  className="text-purple-700 hover:text-purple-900 font-semibold"
                >
                  → Technical implementation details
                </Link>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-300 rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gray-700 text-white px-5 py-2 rounded-lg font-bold text-lg flex-shrink-0">
                  Phase 2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Automate Repayment</h3>
                  <p className="text-sm text-gray-600 font-medium">Future: 2026-2027</p>
                </div>
              </div>

              <p className="text-lg font-semibold text-gray-900 mb-6">
                Loans that repay themselves automatically from your wallet or business revenue
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">The Vision</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="text-[#3B9B7F] font-bold text-lg">1.</span>
                        <p className="text-gray-800">Get approved based on social trust + verified cashflow</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#3B9B7F] font-bold text-lg">2.</span>
                        <p className="text-gray-800">Choose "auto-repay from my Square sales" or "auto-deduct from my wallet"</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#3B9B7F] font-bold text-lg">3.</span>
                        <p className="text-gray-800">As you earn, small amounts automatically flow to lenders</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[#3B9B7F] font-bold text-lg">4.</span>
                        <p className="text-gray-800">No payment reminders, no stress, no late fees—just passive repayment</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">For Merchants</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 mb-2">
                        <strong>Square Integration</strong> (shipping first)
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Open APIs available today</li>
                        <li>• 2-5% of daily sales auto-repays loan</li>
                        <li>• Revenue-based = fair & flexible</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">For Wallet Holders</h4>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800 mb-2">
                        <strong>Account Abstraction</strong> (developing)
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Auto-deduct from incoming transfers</li>
                        <li>• Payment streams plugins maturing</li>
                        <li>• Stripe + Coinbase pushing adoption</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Why This Matters</h4>
                  <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                    <p className="text-gray-800 mb-2">
                      Removes the biggest friction in P2P lending: <strong>remembering to repay</strong>.
                    </p>
                    <p className="text-sm text-gray-700">
                      Borrowers never miss payments. Lenders get passive, predictable returns. Lower default rates for everyone.
                      Lending becomes invisible—you borrow, you earn, it repays itself.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="https://docs.lendfriend.org/vision/phase-2"
                  className="text-gray-700 hover:text-gray-900 font-semibold"
                >
                  → Technical implementation details
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Works Now */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why This Works Now</h2>
          <p className="text-lg text-gray-700 mb-6">
            Five years ago, this wasn't possible. Today, the infrastructure exists:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Open Social Graphs</h4>
              <p className="text-sm text-gray-700">
                Farcaster and Bluesky provide verifiable social connections without invasive API permissions.
                Wallet-based identity with crypto signatures.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Stablecoin Adoption</h4>
              <p className="text-sm text-gray-700">
                USDC on Base enables fast, cheap ($0.01), stable payments. Perfect for uncollateralized lending at scale.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Cashflow Data APIs</h4>
              <p className="text-sm text-gray-700">
                Plaid, Square, Shopify verify income without traditional employment. Serves freelancers and crypto-native workers.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Account Abstraction</h4>
              <p className="text-sm text-gray-700">
                ERC-4337 enables programmable wallets with payment streams and auto-deduction capabilities.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">On-Chain Reputation</h4>
              <p className="text-sm text-gray-700">
                ENS, POAPs, DAO participation captures crypto-native work that traditional credit bureaus miss.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-900 mb-2">Research Foundation</h4>
              <p className="text-sm text-gray-700">
                30+ peer-reviewed papers validate social proximity, trust cascades, and hybrid underwriting models.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xl text-gray-800 font-semibold">
              The pieces exist. We're assembling them into something new.
            </p>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why This Matters</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-[#3B9B7F] mb-2">1.7B</div>
              <p className="text-sm text-gray-600">Unbanked adults globally</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-[#3B9B7F] mb-2">$100B+</div>
              <p className="text-sm text-gray-600">Annual payday loan market (US)</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-[#3B9B7F] mb-2">300%+</div>
              <p className="text-sm text-gray-600">Typical payday loan APR</p>
            </div>
          </div>

          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
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
            <p className="text-xl font-semibold text-gray-900">
              This isn't just a product. It's infrastructure for a fairer financial system.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Principles</h2>

          <div className="space-y-4">
            <div className="bg-white border-l-4 border-[#3B9B7F] p-6 rounded-r-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Transparent by Default</h3>
              <p className="text-gray-700">
                All loans, repayments, and reputation scoring are on-chain and publicly auditable.
                No black boxes, no hidden fees, no surprises.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-6 rounded-r-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Research-Driven</h3>
              <p className="text-gray-700">
                Every decision is backed by academic research and proven fintech evolution patterns.
                We're not guessing—we're following validated models from Kiva, Grameen Bank, Prosper, and Branch.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-6 rounded-r-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Community-Governed</h3>
              <p className="text-gray-700">
                Borrowers and lenders are real people with persistent identities.
                Reputation matters. Community accountability matters. This is not anonymous DeFi.
              </p>
            </div>

            <div className="bg-white border-l-4 border-[#3B9B7F] p-6 rounded-r-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Mission-First</h3>
              <p className="text-gray-700">
                We start altruistic (0% interest) and evolve to sustainable (0-8% for larger loans).
                Not extractive. Not predatory. Just fair, transparent credit for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] rounded-xl p-10 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
            <p className="text-xl mb-8 opacity-95 leading-relaxed max-w-2xl mx-auto">
              We're building the future of credit. Help us prove that reputation,
              community, and trust can power a fairer financial system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-white text-[#3B9B7F] font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                Browse Loans
              </Link>
              <Link
                href="/create-loan"
                className="inline-block px-8 py-4 bg-[#2E7D68] text-white font-bold rounded-lg hover:bg-[#255A51] transition-colors border-2 border-white/20 text-lg"
              >
                Create a Loan
              </Link>
              <Link
                href="/research"
                className="inline-block px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#3B9B7F] transition-colors text-lg"
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
