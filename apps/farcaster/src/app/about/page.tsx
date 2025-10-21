'use client';

import TabNavigation from '../../components/TabNavigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function AboutPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        sdk.actions.ready();
        console.log('[AboutPage] Farcaster Mini App ready signal sent');
      } catch (error) {
        console.error('[AboutPage] Error sending ready signal:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="frame-container">
      {/* Tab Navigation */}
      <TabNavigation />

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About LendFriend
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming Farcaster's social graph into a credit network—one community loan at a time.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why We Exist</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Traditional lending excludes billions of people who lack credit history, collateral, or access to banks.
              DeFi overcollateralization defeats the purpose of credit expansion. We're building a third path:
              <strong> reputation-backed lending that starts with trust and evolves to scale.</strong>
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              LendFriend proves that <strong>your network is your credit history</strong>, your reputation is your
              collateral, and your community is your underwriter. We start with pure altruism at 0% interest to gather
              behavioral data, then scale sustainably with algorithmic hybrid underwriting at socially-appropriate rates.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How LendFriend Works</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#3B9B7F] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Request a Loan</h3>
              <p className="text-gray-600">
                Borrowers create loan requests with their funding goal, repayment terms, and business story.
                Your Farcaster identity and on-chain history serve as your reputation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#3B9B7F] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Community Funding</h3>
              <p className="text-gray-600">
                Friends and community members contribute USDC to support your loan. High-reputation lenders
                implicitly vouch for borrowers by funding them. All on Base L2 for low gas costs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#3B9B7F] rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Transparent Repayment</h3>
              <p className="text-gray-600">
                Borrowers repay on a fixed monthly schedule. All payments are on-chain and visible to the community.
                Lenders can claim their share as repayments come in.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h4 className="font-bold text-blue-900 mb-3">Multi-Signal Reputation</h4>
            <p className="text-blue-800 mb-3">
              We verify identity and assess trust using multiple reputation signals:
            </p>
            <ul className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
              <li>• <strong>Farcaster Identity:</strong> Persistent FID with social history</li>
              <li>• <strong>Neynar Score:</strong> Spam detection (0-1 scale)</li>
              <li>• <strong>OpenRank:</strong> EigenTrust-based social graph reputation</li>
              <li>• <strong>Gitcoin Passport:</strong> Humanity verification</li>
              <li>• <strong>Wallet Activity:</strong> On-chain transaction history</li>
              <li>• <strong>Lender Vouching:</strong> High-reputation lenders endorsing borrowers</li>
            </ul>
          </div>
        </section>

        {/* Two-Phase Evolution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Evolution: From Social Trust to Scale
          </h2>

          {/* Version 1.0 */}
          <div className="bg-white border-2 border-[#3B9B7F] rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#3B9B7F] text-white px-4 py-2 rounded-lg font-bold text-lg">
                Version 1.0
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#2E7D68]">Social Underwriting at 0% Interest</h3>
                <p className="text-gray-600">Q4 2025 - Q1 2026 • Bootstrap Phase</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">What We're Building Now</h4>
                <p className="text-gray-700 mb-3">
                  Pure community-driven lending with <strong>zero interest</strong>. This is intentionally altruistic
                  to bootstrap trust, gather clean repayment data, and map social capital on Farcaster.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h5 className="font-semibold text-green-800 mb-2">Trust Signals</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Farcaster identity & social history</li>
                    <li>✓ Multi-protocol reputation scores</li>
                    <li>✓ Wallet on-chain activity</li>
                    <li>✓ Implicit lender vouching</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h5 className="font-semibold text-green-800 mb-2">Cash Flow Proxies</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Cast frequency & engagement</li>
                    <li>✓ Network growth patterns</li>
                    <li>✓ Mutual connections strength</li>
                    <li>✓ Social activity consistency</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
                <h5 className="font-semibold text-amber-900 mb-2">Loan Size Limits</h5>
                <p className="text-sm text-amber-800">
                  Research shows social signals alone reliably support loans up to <strong>~$6,000 average</strong>.
                  v1 focuses on <strong>$100-$5,000 loans</strong> to build trust while staying within proven bounds.
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Success Metrics</h5>
                <ul className="text-gray-700 space-y-1">
                  <li>• Bootstrap 500-1,000 Farcaster users</li>
                  <li>• Gather 3-6 months of repayment behavior data</li>
                  <li>• Map trust networks and reputation correlations</li>
                  <li>• Prove the zero-interest primitive works</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Version 2.0 */}
          <div className="bg-white border-2 border-purple-300 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                Version 2.0
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900">Hybrid Underwriting with Low Interest</h3>
                <p className="text-gray-600">Q2 2026+ • Scale Phase</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">The Evolution to Scale</h4>
                <p className="text-gray-700 mb-3">
                  Layer in <strong>verified cash flow data</strong> to enable larger loans ($10k-$25k+) with
                  <strong> socially-appropriate interest (0-5% monthly)</strong> vs predatory rates (10-30%).
                  Automate underwriting using hybrid social + financial models proven in research.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h5 className="font-semibold text-purple-800 mb-2">Additional Data Sources</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>✓ Bank account cash flow (Plaid)</li>
                    <li>✓ On-chain revenue streams</li>
                    <li>✓ Creator platform earnings</li>
                    <li>✓ Merchant payment histories</li>
                    <li>✓ Staking/vouching deposits</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h5 className="font-semibold text-purple-800 mb-2">Automation Capabilities</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>✓ Auto-approval for loans &lt;$10k</li>
                    <li>✓ Dynamic risk pricing (0-5%)</li>
                    <li>✓ Revenue-based repayment (RBF)</li>
                    <li>✓ Continuous model learning</li>
                    <li>✓ Multi-protocol identity</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h5 className="font-semibold text-blue-900 mb-2">Research-Backed Approach</h5>
                <p className="text-sm text-blue-800 mb-2">
                  We're following the proven path of Prosper, Branch, and Tala: start with social proof,
                  gather behavioral data, then layer in cash flow signals for algorithmic scaling.
                </p>
                <p className="text-sm text-blue-700">
                  Studies show hybrid social + cash flow models achieve <strong>AUC ≈ 0.72-0.80</strong> vs
                  0.65 for social alone, enabling larger loans while maintaining low default rates.
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-2">Expanded Use Cases</h5>
                <ul className="text-gray-700 space-y-1">
                  <li>• <strong>Friends & Family:</strong> $100-$1,000 at 0%</li>
                  <li>• <strong>Creators & Freelancers:</strong> $1,000-$10,000 at 0-3%</li>
                  <li>• <strong>Small Businesses:</strong> $5,000-$25,000 at 3-5%</li>
                  <li>• <strong>Merchants:</strong> Revenue-based repayment structures</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Research Foundation */}
        <section className="mb-16">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Built on Research, Not Guesswork</h2>

            <div className="space-y-4 text-gray-700">
              <p>
                Our two-phase approach isn't experimental—it's <strong>proven by decades of fintech evolution</strong>:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Platform Evolution</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Prosper (2006):</strong> Started with social networks and auctions,
                      evolved to algorithmic pricing by 2010. Now 8.99-35.99% APR.
                    </li>
                    <li>
                      <strong>Branch:</strong> Founded by Kiva's co-founder, evolved from group lending
                      to ML models using 2,000+ mobile data points.
                    </li>
                    <li>
                      <strong>Tala:</strong> Mobile signals → causal inference ML. Doubled approval
                      rates (40%→80%) while reducing defaults. $300M revenue, 9M users.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Academic Evidence</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Karlan (2007):</strong> Group lending reduced defaults by 7 percentage points.
                    </li>
                    <li>
                      <strong>Field & Pande (2008):</strong> Monthly installments = same default rate as weekly,
                      51% less borrower stress.
                    </li>
                    <li>
                      <strong>FinRegLab (2023):</strong> Bank cash flow data achieved AUC ≈ 0.80,
                      hybrid models 0.72-0.80.
                    </li>
                    <li>
                      <strong>Upstart (2022):</strong> Alternative data + ML increased approvals 27%
                      without increasing defaults.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-green-800 font-semibold">
                  Every successful fintech lender followed this path. LendFriend is doing the same—but on-chain,
                  transparent, and community-governed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Who LendFriend Serves</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Borrowers */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Borrowers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Underbanked or credit-invisible individuals</li>
                <li>✓ Small business owners needing working capital</li>
                <li>✓ Creators and freelancers with irregular income</li>
                <li>✓ Anyone with strong social capital but no collateral</li>
                <li>✓ Farcaster community members who need support</li>
              </ul>
            </div>

            {/* Lenders */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Lenders</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Community members who want to support friends</li>
                <li>✓ Impact investors seeking social returns (v1)</li>
                <li>✓ Yield seekers looking for fair returns (v2: 0-5%)</li>
                <li>✓ Anyone who believes in reputation-backed credit</li>
                <li>✓ DeFi users wanting productive capital use</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why We're Different */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes LendFriend Different</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">🔍 Transparent by Default</h4>
              <p className="text-sm text-gray-600">
                All loans, repayments, and reputation scores are on-chain and publicly verifiable.
                No black-box algorithms.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">🤝 Community-First</h4>
              <p className="text-sm text-gray-600">
                Borrowers and lenders are real people in the Farcaster community, not anonymous wallets.
                Reputation matters.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">📊 Data-Driven Evolution</h4>
              <p className="text-sm text-gray-600">
                We're not guessing—we're following proven fintech research and gathering real behavioral
                data to scale responsibly.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">⚡ Low-Cost Infrastructure</h4>
              <p className="text-sm text-gray-600">
                Built on Base L2 with USDC settlement. Gas costs are negligible (~$0.01-0.10 per transaction),
                not a barrier.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">🔐 Self-Custodial</h4>
              <p className="text-sm text-gray-600">
                Smart contracts handle funds automatically. No intermediaries, no custodians, no counterparty risk.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">🌱 Bootstrap to Scale</h4>
              <p className="text-sm text-gray-600">
                Start altruistic (0%), gather data, evolve to sustainable (0-5%). Not extractive,
                not predatory—just fair.
              </p>
            </div>
          </div>
        </section>

        {/* The Vision */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-purple-50 border-2 border-[#3B9B7F] rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Vision</h2>
            <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
              A world where <strong>your reputation is your collateral</strong>, your network is your credit history,
              and your community is your underwriter.
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              We're building the infrastructure for reputation-backed credit that starts with pure trust and
              evolves to algorithmic scale—transparent, on-chain, and community-governed.
            </p>
            <p className="text-2xl font-bold text-[#2E7D68]">
              Phase 1: Bootstrap at 0%. Phase 2: Scale with algorithms.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-[#3B9B7F] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
            <p className="text-lg mb-6 opacity-90">
              We're just getting started. Help us prove that reputation-backed credit works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-white text-[#3B9B7F] font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Browse Loans
              </Link>
              <Link
                href="/create"
                className="inline-block px-8 py-3 bg-[#2E7D68] text-white font-bold rounded-xl hover:bg-[#255A51] transition-colors"
              >
                Create a Loan
              </Link>
              <Link
                href="/whitepaper"
                className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-[#3B9B7F] transition-colors"
              >
                Read Whitepaper
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 mt-12">
          <p>Built on Base • Powered by USDC • Secured by Smart Contracts</p>
          <p className="mt-2">
            Open source • Transparent • Community-governed
          </p>
        </div>
      </div>
    </div>
  );
}
