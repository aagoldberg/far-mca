'use client';

import Link from 'next/link';
import { EyeIcon, ChartBarIcon, BoltIcon, LockClosedIcon, ShieldCheckIcon, UserGroupIcon, ArrowTrendingUpIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <HeartIcon className="w-4 h-4" />
              Community Lending
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              About LendFriend
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              Loans backed by your business, not your credit score.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-3xl mx-auto px-6 py-12">

        {/* What We Do */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            LendFriend makes it easy for entrepreneurs and small business owners to access interest-free working capital.
            No banks. No credit checks. No collateral. Just proof that you're running a real business.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Connect your Shopify, Stripe, or Square account to instantly verify your revenue history. Your sales data becomes your trust score. Community members can further vouch for you, and your reputation grows with every successful repayment.
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">Connect Your Business</h3>
                <p className="text-gray-600">
                  Link your Shopify, Stripe, or Square account to verify your revenue. Your sales history builds your trust score automatically—no paperwork, no waiting.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Create a Loan Request</h3>
                <p className="text-gray-600">
                  Share your story, set your funding goal (up to $5,000), and choose your repayment timeline. Your verified business data gives lenders confidence.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Get Funded & Grow</h3>
                <p className="text-gray-600">
                  Community members fund your loan based on your proven track record. Friends can also vouch to strengthen your trust score. Share on social to reach your goal faster.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#3B9B7F] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Repay & Build Reputation</h3>
                <p className="text-gray-600">
                  Pay back on your timeline. Every successful repayment builds your reputation for larger future opportunities. All transactions are transparent and on-chain.
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
              We're starting with pure generosity. Zero interest means lenders give because they want to help entrepreneurs succeed, not because they're chasing returns.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Borrowers repay to build their reputation and unlock future opportunities. When people succeed here, new opportunities open up—for everyone.
            </p>
          </div>
        </section>

        {/* Who It's For */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who It's For</h2>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex gap-2">
              <span className="text-[#3B9B7F]">•</span>
              <span><strong>E-commerce sellers</strong> on Shopify, Stripe, or Square needing inventory capital</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#3B9B7F]">•</span>
              <span><strong>Freelancers and creators</strong> with proven client revenue</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#3B9B7F]">•</span>
              <span><strong>Immigrants</strong> without local credit history but with real businesses</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#3B9B7F]">•</span>
              <span><strong>Gig workers</strong> with irregular but verifiable income</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#3B9B7F]">•</span>
              <span><strong>Anyone</strong> facing unexpected expenses with a track record to show</span>
            </li>
          </ul>
        </section>

        {/* How Trust Scores Work */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Trust Scores Work</h2>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-[#3B9B7F]" />
                Revenue Verification (Primary)
              </h4>
              <p className="text-gray-600">
                Connect Shopify, Stripe, or Square to prove your business is real. We analyze your sales volume, consistency, and growth to generate a trust score.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <UserGroupIcon className="w-6 h-6 text-[#3B9B7F]" />
                Community Vouching (Secondary)
              </h4>
              <p className="text-gray-600">
                Friends and community members can vouch for you by contributing. Contributions from close connections add extra weight to your score.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-6 h-6 text-[#3B9B7F]" />
                Repayment History
              </h4>
              <p className="text-gray-600">
                Every on-time repayment strengthens your score and unlocks larger loan amounts.
              </p>
            </div>
          </div>
        </section>

        {/* Why Different */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What Makes Us Different</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-[#3B9B7F]" />
                Verified Revenue
              </h4>
              <p className="text-sm text-gray-600">
                Your Shopify, Stripe, or Square data proves you're running a real business—no credit bureau required.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <EyeIcon className="w-6 h-6 text-[#3B9B7F]" />
                Fully Transparent
              </h4>
              <p className="text-sm text-gray-600">
                All loans and repayments are on-chain and publicly visible. No hidden fees or terms.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-[#3B9B7F]" />
                Algorithmic Trust
              </h4>
              <p className="text-sm text-gray-600">
                Trust scores combine verified revenue data with social proximity. The stronger your business and community, the better your terms.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BoltIcon className="w-6 h-6 text-[#3B9B7F]" />
                Low Fees
              </h4>
              <p className="text-sm text-gray-600">
                Built on Base L2. Gas costs are pennies, not barriers.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 md:col-span-2">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <LockClosedIcon className="w-6 h-6 text-[#3B9B7F]" />
                Self-Custodial
              </h4>
              <p className="text-sm text-gray-600">
                Smart contracts handle everything. No middlemen, no counterparty risk.
              </p>
            </div>
          </div>
        </section>

        {/* Learn More - Risk Scoring */}
        <section className="mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Our Risk Scoring Methodology</h3>
            <p className="text-gray-700 mb-4">
              Learn how we assess business health using industry-standard approaches while protecting merchant privacy.
            </p>
            <Link
              href="/risk-scoring"
              className="inline-block px-6 py-2 bg-[#3B9B7F] text-white font-semibold rounded-lg hover:bg-[#2E7D68] transition-colors"
            >
              Learn About Risk Scoring →
            </Link>
          </div>
        </section>

        {/* Learn More - Vision */}
        <section className="mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Our Vision & Roadmap</h3>
            <p className="text-gray-700 mb-4">
              See how we're building the future of reputation-backed lending, from bootstrap to global scale.
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
              Connect your business and get funded today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-white text-[#3B9B7F] font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Loans
              </Link>
              <Link
                href="/create-loan"
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
