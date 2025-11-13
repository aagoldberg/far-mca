"use client";

import LoanList from "@/components/LoanList";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3B9B7F]/10 via-[#2C7DA0]/5 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#3B9B7F] mb-6 tracking-tight leading-tight">
            Community Lending
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl text-gray-900 max-w-4xl mx-auto mb-5 leading-tight font-bold">
            Banks want big profits, friends don't
          </p>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Building reputation-based lending for the new economy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/create-loan"
              className="inline-flex items-center gap-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-bold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request a Loan
            </Link>
            <Link
              href="#loans"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
            >
              Browse Loans
            </Link>
          </div>
        </div>
      </div>

      {/* Loan List Section */}
      <div id="loans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="inline-block mb-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Ways to Help</h2>
            <div className="h-1 bg-gradient-to-r from-[#3B9B7F] to-[#2C7DA0] rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">Support community members working toward their dreams</p>
        </div>
        <LoanList />
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                How It Works
              </h2>
              <div className="h-1 bg-gradient-to-r from-[#3B9B7F] to-[#2C7DA0] rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From Request to Repayment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/instructions_1b.png"
                  alt="Create Your Loan"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900">Create Your Loan</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Request $100-$5K for 30-90 days. Add your story, budget breakdown, and photos. Share with friends.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/instructions_2.png"
                  alt="Friends Contribute"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 35%' }}
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900">Friends Contribute</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Your network sees your request. Each contribution signals trust with real money.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/instructions_3.png"
                  alt="Trust Scores Calculate"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900">Trust Scores Calculate</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We measure connection strength using mutual friends and network overlap. Close friends count more.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/instructions_4.png"
                  alt="Lenders Evaluate"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900">Lenders Evaluate</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Lenders see your trust score and friend support. High-risk loans don't get funded.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/instructions_5.png"
                  alt="Loan Funds or Expires"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <h3 className="text-xl font-bold text-gray-900">Loan Funds or Expires</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Hit your goal? Funds transfer to your wallet. Miss it? All contributions return.
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/instructions_6.png"
                  alt="Reputation Builds"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  6
                </div>
                <h3 className="text-xl font-bold text-gray-900">Reputation Builds</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Repay on time → stronger reputation. Default → permanent on-chain record follows you across DeFi.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="https://lendfriend.org/about"
              className="inline-flex items-center gap-2 text-[#3B9B7F] hover:text-[#2E7D68] font-bold transition-colors"
            >
              Learn more about how it works
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-gradient-to-br from-[#3B9B7F]/5 via-white to-[#2C7DA0]/5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                Vision: How Lendfriend Scales
              </h2>
              <div className="h-1 bg-gradient-to-r from-[#3B9B7F] to-[#2C7DA0] rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From bootstrap to global scale: Building the future of reputation-backed lending
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Phase 0 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-[#3B9B7F]">
              <div className="bg-[#3B9B7F] px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Phase 0: Social Trust</h3>
                  <span className="px-3 py-1 bg-white text-[#3B9B7F] text-xs font-bold rounded-full">
                    LIVE
                  </span>
                </div>
                <p className="text-[#3B9B7F]/80 text-sm mt-1 font-semibold">2024-2025</p>
              </div>
              <div className="p-6">
                <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/phase0_gb.png"
                    alt="Phase 0: Social Trust"
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 40%' }}
                  />
                </div>
                <p className="text-gray-700 mb-4 font-semibold">
                  Zero-interest loans backed by social trust
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#3B9B7F] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>$100-$5K loans, 30-90 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#3B9B7F] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Farcaster social graph</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#3B9B7F] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Prove the model works</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Phase 1 */}
            <div className="bg-blue-50/50 rounded-xl shadow-md overflow-hidden border-2 border-blue-200/60 opacity-75">
              <div className="bg-blue-100/60 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-700">Phase 1: Add Cashflow</h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                    PLANNED
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1 font-semibold">2025-2026</p>
              </div>
              <div className="p-6">
                <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden opacity-60">
                  <Image
                    src="/images/phase1_gb.png"
                    alt="Phase 1: Add Cashflow"
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 40%' }}
                  />
                </div>
                <p className="text-gray-700 mb-4 font-semibold">
                  Scale with revenue verification
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>$5K-$50K+ loans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Plaid/Stripe/Shopify data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>12-17% APR (vs ~25%)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-orange-50/40 rounded-xl shadow-md overflow-hidden border-2 border-orange-200/50 opacity-70">
              <div className="bg-orange-100/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-700">Phase 2: Automate</h3>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                    FUTURE
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1 font-semibold">2026-2027</p>
              </div>
              <div className="p-6">
                <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden opacity-50">
                  <Image
                    src="/images/phase2_gb.png"
                    alt="Phase 2: Automate"
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 40%' }}
                  />
                </div>
                <p className="text-gray-700 mb-4 font-semibold">
                  Loans that repay themselves
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>$10K-$100K+ loans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Smart wallet auto-repayment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mass market scale</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="https://lendfriend.org/vision"
              className="inline-flex items-center gap-2 text-[#3B9B7F] hover:text-[#2E7D68] font-bold transition-colors"
            >
              See the full roadmap
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* The Opportunity Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-block mb-4">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                    The $1 Trillion New Economy That Banks Don't Serve
                  </h3>
                  <div className="h-1 bg-gradient-to-r from-[#3B9B7F] to-[#2C7DA0] rounded-full"></div>
                </div>

                <div className="flex items-center justify-center gap-3 text-base md:text-lg text-gray-600 flex-wrap">
                  <span className="bg-[#3B9B7F]/10 px-4 py-2 rounded-full font-semibold">Freelancers (Upwork, Fiverr, Toptal)</span>
                  <span className="text-gray-400">•</span>
                  <span className="bg-[#3B9B7F]/10 px-4 py-2 rounded-full font-semibold">Creators (YouTube, TikTok, Patreon)</span>
                  <span className="text-gray-400">•</span>
                  <span className="bg-[#3B9B7F]/10 px-4 py-2 rounded-full font-semibold">Merchants (Shopify, Etsy, Amazon)</span>
                </div>
              </div>
            </div>

            {/* TAM Image */}
            <div className="mb-16 relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/why/platform_workers3.png"
                alt="$1 Trillion Platform Economy - Freelancers, Creators, Merchants"
                fill
                className="object-cover"
                style={{ objectPosition: 'center' }}
              />
            </div>

            {/* Three Comparison Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-6">
              {/* Traditional Banks */}
              <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-300 hover:shadow-lg transition-shadow">
                <div className="relative w-full h-56">
                  <Image
                    src="/images/why/bank_rejection.png"
                    alt="Traditional Banks Reject"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Traditional Banks</h4>
                  <p className="text-red-600 font-bold mb-2">❌ Often reject platform earners</p>
                  <p className="text-red-600 font-bold text-sm mb-2">
                    Limited access
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Traditional underwriting relies on W-2s and steady paychecks
                  </p>
                </div>
              </div>

              {/* Fintech Platform Lenders */}
              <div className="bg-orange-50 rounded-xl overflow-hidden border-2 border-orange-300 hover:shadow-lg transition-shadow">
                <div className="relative w-full h-56">
                  <Image
                    src="/images/why/invite_only.png"
                    alt="Fintech Platform Lenders Invite Only"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Fintech Platform Lenders</h4>
                  <p className="text-orange-600 font-bold mb-2">✓ ~25% APR</p>
                  <p className="text-orange-600 font-bold text-sm mb-2">
                    Invite-only
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Only established merchants with proven sales. Expensive infrastructure.
                  </p>
                </div>
              </div>

              {/* LendFriend */}
              <div className="bg-[#3B9B7F]/10 rounded-xl overflow-hidden border-2 border-[#3B9B7F] hover:shadow-lg transition-shadow">
                <div className="relative w-full h-56">
                  <Image
                    src="/images/why/lendfriend_b.png"
                    alt="LendFriend Open Access"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">LendFriend</h4>
                  <p className="text-[#3B9B7F] font-bold mb-2">✓ 12-17% APR</p>
                  <p className="text-[#3B9B7F] font-bold text-sm mb-2">
                    Open to everyone
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Crypto infrastructure + social trust for those building their track record
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  href="https://lendfriend.org/economic-context"
                  className="inline-flex items-center gap-2 text-[#3B9B7F] hover:text-[#2E7D68] font-bold transition-colors"
                >
                  Learn more about the opportunity
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How We Lower Rates Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                How We Lower Rates
              </h2>
              <div className="h-1 bg-gradient-to-r from-[#3B9B7F] to-[#2C7DA0] rounded-full"></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
            {/* Item 1 - Community Capital */}
            <div className="text-center group">
              <div className="relative w-full h-80 mb-6 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/lower_interest/middleman.png"
                  alt="Community Capital - Eliminate expensive debt middlemen"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Eliminate Expensive Debt Middlemen</h4>
              <p className="text-gray-600 leading-relaxed text-lg">
                Banks and VCs expect big profits from your loan - friends don't
              </p>
            </div>

            {/* Item 2 - Fast, Lower-Cost Payments */}
            <div className="text-center group">
              <div className="relative w-full h-80 mb-6 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/lower_interest/legacy_railsb.png"
                  alt="Fast, Lower-Cost Payments - Replace legacy payment rails with stablecoins"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fast, Lower-Cost Payments</h4>
              <p className="text-gray-600 leading-relaxed text-lg">
                Replace legacy payment rails with instant, low-cost stablecoins
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="https://lendfriend.org/economic-context"
              className="inline-flex items-center gap-2 text-[#3B9B7F] hover:text-[#2E7D68] font-bold transition-colors"
            >
              Read the full story
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Viral Growth Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-block mb-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                Built-In Viral Growth
              </h2>
              <div className="h-1 bg-gradient-to-r from-[#3B9B7F] to-[#2C7DA0] rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every borrower becomes a growth engine by sharing their personal story
            </p>
          </div>

          {/* Two-column layout: Steps (35%) + Illustration (65%) */}
          <div className="grid md:grid-cols-[0.55fr_1fr] gap-6 items-stretch mb-8">
            {/* Left: The Viral Loop Steps */}
            <div className="flex flex-col justify-between gap-4">
              {/* Step 1 */}
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 flex-1 flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-xl shadow-md">
                    1
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-1 text-lg">Create</p>
                    <p className="text-sm text-gray-600 leading-relaxed">Borrower shares loan with their network</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 flex-1 flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-xl shadow-md">
                    2
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-1 text-lg">Spread</p>
                    <p className="text-sm text-gray-600 leading-relaxed">Story spreads through their network and beyond</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 flex-1 flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-xl shadow-md">
                    3
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-1 text-lg">Convert</p>
                    <p className="text-sm text-gray-600 leading-relaxed">Some become lenders</p>
                  </div>
                </div>
              </div>

              {/* Step 4 + Loop arrow */}
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 flex-1 flex items-center relative">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-xl shadow-md">
                    4
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-1 text-lg">Repeat</p>
                    <p className="text-sm text-gray-600 leading-relaxed">Lenders become borrowers</p>
                  </div>
                </div>
                {/* Loop arrow indicator */}
                <div className="absolute -top-3 right-4 text-[#3B9B7F] opacity-60">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Visual Illustration (65% width, same height) */}
            <div className="relative w-full h-full flex items-center">
              <Image
                src="/images/viral/1_big.png"
                alt="Viral growth network effect - borrower sharing spreads to communities"
                width={800}
                height={400}
                className="rounded-xl shadow-lg w-full h-full object-contain"
              />
            </div>
          </div>

          {/* The Magic */}
          <div className="bg-gradient-to-r from-[#3B9B7F]/10 to-[#2C7DA0]/10 rounded-lg p-6 border border-[#3B9B7F]/30">
            <p className="text-lg text-gray-800 leading-relaxed text-center font-semibold">
              <span className="text-[#2E7D68] font-bold">The magic:</span> Emotional stories are 10x more likely to be shared than traditional ads.
              Each funded loan creates social proof that accelerates the next loan.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link
              href="https://lendfriend.org/vision"
              className="inline-flex items-center gap-2 text-[#3B9B7F] hover:text-[#2E7D68] font-bold transition-colors"
            >
              See the full growth model
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}
