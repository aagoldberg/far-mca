'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About LendFriend
          </h1>
          <p className="text-xl md:text-2xl font-light whitespace-nowrap">Community loans based on character, not collateral or credit scores.</p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-3xl mx-auto px-6 py-12">

        {/* What We Do */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            LendFriend makes it easy for Farcaster community members to get and give interest-free loans.
            No banks. No credit checks. No collateral. Just people helping people.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Borrowers share their story publicly, community members vouch by contributing, and every social connection strengthens trust scores algorithmically. Your reputation grows with every successful repayment.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Create a Loan Request</h3>
                <p className="text-gray-600">
                  Share your story publicly, set your funding goal (up to $5,000), and choose your repayment timeline.
                  The closer your network, the stronger your trust score.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Get Community Support & Share</h3>
                <p className="text-gray-600">
                  Friends and community members vouch for you by contributing USDC. Each contribution strengthens your trust score algorithmically.
                  Share your loan on Twitter, Farcaster, Bluesky, Facebook and more to expand your network and reach your funding goal faster!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Repay When You Can</h3>
                <p className="text-gray-600">
                  Pay back on your timeline. Every successful repayment builds your reputation for future opportunities.
                  All transactions are transparent and on-chain, and lenders can claim their share as you repay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Zero Interest */}
        <section className="mb-12">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why 0% Interest?</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We're starting with pure generosity. Zero interest means lenders give because they want to help, not because they're chasing returns. It keeps everything simple and builds real community trust.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Borrowers repay to build their reputation and keep the cycle going. Lenders support people they believe in. And if borrowers want to show extra gratitude, they can leave an optional tip to share with their lenders.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When people succeed here, new opportunities open up—for everyone.
            </p>
          </div>
        </section>

        {/* Who It's For */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who It's For</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Borrowers */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Borrowers
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Small business owners</li>
                <li>• Freelancers and creators</li>
                <li>• Anyone needing a helping hand</li>
                <li>• People building in web3</li>
              </ul>
            </div>

            {/* Lenders */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Lenders
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Community supporters</li>
                <li>• Impact-focused givers</li>
                <li>• Friends helping friends</li>
                <li>• Anyone who believes in trust</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Different */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What Makes Us Different</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">🔍 Fully Transparent</h4>
              <p className="text-sm text-gray-600">
                All loans and repayments are on-chain and publicly visible. No hidden fees or terms.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">🤝 Community-Driven</h4>
              <p className="text-sm text-gray-600">
                Real people with Farcaster identities. Reputation matters more than credit scores.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">⚡ Low Fees</h4>
              <p className="text-sm text-gray-600">
                Built on Base L2. Gas costs are pennies, not barriers.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2">🔐 Self-Custodial</h4>
              <p className="text-sm text-gray-600">
                Smart contracts handle everything. No middlemen, no counterparty risk.
              </p>
            </div>
          </div>
        </section>

        {/* Learn More - Vision */}
        <section className="mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Our Vision & Roadmap</h3>
            <p className="text-gray-700 mb-4">
              See how we're building the future of reputation-backed credit, from bootstrap to global scale.
            </p>
            <Link
              href="/vision"
              className="inline-block px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explore the Vision →
            </Link>
          </div>
        </section>

        {/* Learn More - Research */}
        <section className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Want the Full Story?</h3>
            <p className="text-gray-700 mb-4">
              Deep dive into our research, evolution strategy, and the academic foundations behind reputation-backed lending.
            </p>
            <Link
              href="/research"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Read the Research →
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-[#3B9B7F] rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">
              Browse loans to support or create your own request.
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
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
