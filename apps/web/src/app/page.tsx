"use client";

import LoanList from "@/components/LoanList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3B9B7F]/10 via-[#2C7DA0]/5 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#3B9B7F] mb-8 tracking-tight leading-tight">
            Community Lending
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto mb-4 leading-relaxed font-semibold">
            Get funded from your network—and beyond. Your reputation grows as friends contribute.
          </p>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Zero interest. No credit checks. Social underwriting.
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
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Ways to Help</h2>
          <p className="text-gray-600">Support community members working toward their dreams</p>
        </div>
        <LoanList />
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
            From Request to Repayment
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900">Create Your Loan</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Request $100-$5K for 30-90 days. Add your story, budget breakdown, and photos. Share to your Farcaster network.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900">Friends Contribute</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Your network sees your request. Each contribution signals trust—they're risking real money, not just clicking "endorse."
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900">Trust Scores Calculate</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We measure connection strength using mutual friends and network overlap. Close friends with selective networks count more.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900">Lenders Evaluate</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Strangers see your trust score and backing from friends. Market-based filtering: high-risk loans don't fund.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <h3 className="text-xl font-bold text-gray-900">Loan Funds or Expires</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Hit your goal? Funds transfer to your wallet. Miss it? All contributions return automatically.
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
        </div>
      </div>

      {/* Three Innovations Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
            Three Innovations, One Protocol
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Built on proven research from Prosper.com and deployed on Base
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Innovation 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B9B7F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#3B9B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Social Collateral</h3>
              <p className="text-gray-600 leading-relaxed">
                Your network backs you with real capital. Close friends matter more than follower counts.
              </p>
            </div>

            {/* Innovation 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B9B7F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#3B9B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Market Filtering</h3>
              <p className="text-gray-600 leading-relaxed">
                Lenders choose their risk. Transparent trust scores + friend backing = informed decisions.
              </p>
            </div>

            {/* Innovation 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3B9B7F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#3B9B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">On-Chain Reputation</h3>
              <p className="text-gray-600 leading-relaxed">
                Every loan recorded on Base. Build verifiable reputation that follows you across DeFi.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="https://docs.lendfriend.org/vision"
              className="inline-flex items-center gap-2 text-[#3B9B7F] hover:text-[#2E7D68] font-semibold transition-colors"
            >
              Explore the Vision
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
