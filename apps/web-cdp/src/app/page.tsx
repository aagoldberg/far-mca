"use client";

import LoanList from "@/components/LoanList";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-white to-secondary-50/50 opacity-70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-6 border border-brand-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Now integrating with Shopify, Stripe & Square
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]">
              Community Capital for <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-secondary-600">
                Creators & Merchants.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Banks look at credit scores. We look at your business. Connect your revenue data to unlock 0% interest loans from your network.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link
                href="/create-loan"
                className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-base font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-brand-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Get Funded
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-base font-bold rounded-xl border border-gray-200 hover:border-brand-200 shadow-sm hover:shadow-md transition-all"
              >
                How it Works
              </Link>
            </div>
            
            {/* Trust Badges / Integration Logos */}
            <div className="border-t border-gray-100/80 pt-6">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
                Trusted data integrations
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Shopify */}
                <div className="flex items-center gap-2">
                   <span className="text-xl font-bold text-[#96bf48] font-rubik tracking-tight">shopify</span>
                </div>
                {/* Stripe */}
                <div className="flex items-center gap-2">
                   <span className="text-xl font-bold text-[#635BFF] font-rubik tracking-tight">stripe</span>
                </div>
                {/* Square */}
                <div className="flex items-center gap-2">
                   <span className="text-xl font-bold text-[#000000] font-rubik tracking-tight">Square</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans Section */}
      <div id="loans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Community Businesses</h2>
            <p className="text-base text-gray-600">Support viable businesses in your network.</p>
          </div>
          <Link href="/search" className="group text-brand-600 font-bold hover:text-brand-700 inline-flex items-center gap-1 text-base transition-colors">
            View all requests
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <LoanList />
      </div>

      {/* How It Works (New Strategy) */}
      <div id="how-it-works" className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">The Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              From Data to Capital
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We use your real-time business performance to unlock capital, not just your credit score.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-1 bg-gradient-to-r from-brand-100 via-secondary-100 to-brand-100 z-0 rounded-full" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-brand-500/5 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-brand-500/10 transition-all duration-300">
                <div className="text-brand-500 bg-brand-50 p-4 rounded-2xl">
                  {/* Icon: Data Connection */}
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Connect Data</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Link your Shopify, Stripe, or Square account. We analyze revenue history securely to verify business viability.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-secondary-500/5 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-secondary-500/10 transition-all duration-300">
                <div className="text-secondary-500 bg-secondary-50 p-4 rounded-2xl">
                  {/* Icon: Network/Share */}
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Rally Support</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Share your verified request. Your network lends with confidence, knowing the business fundamentals are sound.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-brand-500/5 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-brand-500/10 transition-all duration-300">
                <div className="text-brand-500 bg-brand-50 p-4 rounded-2xl">
                  {/* Icon: Growth/Arrow */}
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Grow & Repay</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Use funds to buy inventory or marketing. Repayments can be automated from future revenue.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Built for the New Economy
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Traditional Banks */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold text-gray-400 mb-6">Traditional Banks</h3>
              <ul className="space-y-5 text-gray-500 text-lg">
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Reject 'gig economy' income
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Strict credit checks
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Slow approval process
                </li>
              </ul>
            </div>

            {/* LendFriend (Highlighted) */}
            <div className="bg-white p-8 rounded-3xl border-2 border-brand-500 shadow-2xl shadow-brand-500/10 relative transform md:-translate-y-6 z-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-secondary-500 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                Best for You
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">LendFriend</h3>
              <ul className="space-y-5 text-gray-700 text-lg">
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Data-driven approval
                </li>
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  0% Interest (Community)
                </li>
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Funding in days, not weeks
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/create-loan" className="block w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-center font-bold rounded-xl transition-colors shadow-lg">
                    Check Your Eligibility
                </Link>
              </div>
            </div>

            {/* Merchant Cash Advance */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold text-gray-400 mb-6">Predatory Lenders</h3>
              <ul className="space-y-5 text-gray-500 text-lg">
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  20-40% APR equivalent
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Aggressive daily payments
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Hidden fees
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-brand-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-secondary-900 opacity-50" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to grow your business?
          </h2>
          <p className="text-brand-100 text-lg md:text-xl mb-10 font-light leading-relaxed">
            Join the new economy where your revenue and your community power your growth.
          </p>
          <Link
            href="/create-loan"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-900 font-bold rounded-2xl shadow-2xl hover:bg-brand-50 transition-all transform hover:-translate-y-1 text-lg"
          >
            Start Your Application
          </Link>
        </div>
      </div>
    </main>
  );
}
