'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">About LendFriend</h1>
          <p className="text-sm opacity-90">
            Zero-interest community loans on Farcaster
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* What We Do */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What We Do</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            LendFriend makes it easy for Farcaster members to get and give interest-free loans.
            No banks, credit checks, or collateral—just people helping people.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Borrowers share their story, the community contributes, and repayments are transparent on-chain.
          </p>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Create Request</h3>
                <p className="text-xs text-gray-600">
                  Set your goal ($100-$5k) and timeline. Your Farcaster profile is your identity.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Get Support & Share</h3>
                <p className="text-xs text-gray-600">
                  Friends contribute USDC on Base L2. Share your loan on Twitter, Farcaster, WhatsApp & more to reach your community and hit your goal faster!
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Repay</h3>
                <p className="text-xs text-gray-600">
                  Pay back on your timeline. All repayments are transparent on-chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Zero Interest */}
        <section>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-base font-bold text-gray-900 mb-2">Why 0% Interest?</h2>
            <p className="text-xs text-gray-700 leading-relaxed">
              We believe in building trust, not extracting profit. Lenders give to support their community,
              borrowers repay to build reputation. It's altruistic by design.
            </p>
          </div>
        </section>

        {/* Who It's For */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who It's For</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Borrowers</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Small business owners</li>
                <li>• Freelancers & creators</li>
                <li>• Web3 builders</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Lenders</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Community supporters</li>
                <li>• Impact-focused givers</li>
                <li>• Friends helping friends</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What Makes Us Different</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-bold text-gray-900 mb-1 text-xs">🔍 Transparent</h4>
              <p className="text-[10px] text-gray-600">
                All on-chain and publicly visible
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-bold text-gray-900 mb-1 text-xs">🤝 Community</h4>
              <p className="text-[10px] text-gray-600">
                Real Farcaster identities
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-bold text-gray-900 mb-1 text-xs">⚡ Low Fees</h4>
              <p className="text-[10px] text-gray-600">
                Base L2 gas costs
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-bold text-gray-900 mb-1 text-xs">🔐 Safe</h4>
              <p className="text-[10px] text-gray-600">
                Smart contract secured
              </p>
            </div>
          </div>
        </section>

        {/* Learn More - Vision */}
        <section>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Our Vision & Roadmap</h3>
            <p className="text-xs text-gray-700 mb-3">
              See how we're building reputation-backed credit from bootstrap to scale.
            </p>
            <Link
              href="/vision"
              className="inline-block px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explore Vision →
            </Link>
          </div>
        </section>

        {/* Learn More - Research */}
        <section>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Want the Full Story?</h3>
            <p className="text-xs text-gray-700 mb-3">
              Deep dive into our research and the academic foundations behind reputation lending.
            </p>
            <Link
              href="/research"
              className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Read Research →
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="bg-[#3B9B7F] rounded-lg p-5 text-center text-white">
            <h2 className="text-lg font-bold mb-2">Ready to Get Started?</h2>
            <p className="text-sm mb-4 opacity-90">
              Browse loans to support or create your own
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
