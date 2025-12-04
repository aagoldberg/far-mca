"use client";

import LoanList from "@/components/LoanList";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-stone-100">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-white to-accent-50/30 opacity-70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-4 border border-brand-100/50 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              0% Interest • 100% Impact
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight mb-4 leading-[1.1]">
              Fund a Friend. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-secondary-600">
                Fuel a Dream.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-stone-600 mb-6 max-w-2xl mx-auto leading-relaxed font-medium">
              Banks look at the past. We look at your business. Connect your revenue data to unlock 0% interest loans from your network.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link
                href="/create-loan"
                className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-brand-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Get Funded
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-50 text-stone-700 text-lg font-bold rounded-full border border-stone-200 hover:border-brand-200 shadow-sm hover:shadow-md transition-all"
              >
                How it Works
              </Link>
            </div>
            
            {/* Trust Badges / Integration Logos */}
            <div className="border-t border-stone-100 pt-5">
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-4">
                Trusted data integrations
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
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
      <div id="loans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">Community Businesses</h2>
            <p className="text-base text-stone-600">Support viable businesses in your network.</p>
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
      <div id="how-it-works" className="bg-white py-24 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-secondary-600 font-bold tracking-wider uppercase text-sm">The Journey</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mt-3 mb-4">
              How We Grow Together
            </h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
              We use your real-time business performance to unlock capital, focusing on your future, not your history.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-1 bg-gradient-to-r from-brand-100 via-secondary-100 to-brand-100 z-0 rounded-full" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-32 h-32 bg-white rounded-full shadow-xl shadow-brand-500/10 border-4 border-white ring-1 ring-stone-100 flex items-center justify-center mb-8 group-hover:scale-105 transition-all duration-300">
                <div className="text-brand-600 bg-brand-50 p-4 rounded-full">
                  {/* Icon: Data Connection */}
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">1. Prove Your Potential</h3>
              <p className="text-base text-stone-600 leading-relaxed">
                Link your Shopify, Stripe, or Square account. We verify your revenue so your community knows you're the real deal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-32 h-32 bg-white rounded-full shadow-xl shadow-secondary-500/10 border-4 border-white ring-1 ring-stone-100 flex items-center justify-center mb-8 group-hover:scale-105 transition-all duration-300">
                <div className="text-secondary-600 bg-secondary-50 p-4 rounded-full">
                  {/* Icon: Network/Share */}
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">2. Share Your Story</h3>
              <p className="text-base text-stone-600 leading-relaxed">
                Share your verified request. Friends and believers lend with confidence, knowing you have a viable business.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-32 h-32 bg-white rounded-full shadow-xl shadow-brand-500/10 border-4 border-white ring-1 ring-stone-100 flex items-center justify-center mb-8 group-hover:scale-105 transition-all duration-300">
                <div className="text-brand-600 bg-brand-50 p-4 rounded-full">
                  {/* Icon: Growth/Arrow */}
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">3. Repay & Rise</h3>
              <p className="text-base text-stone-600 leading-relaxed">
                Use funds to grow. As your revenue climbs, you pay back the loan at 0% interest—strengthening your reputation for next time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900">
              Banking on Character, Not Just Credit
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Traditional Banks */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold text-stone-400 mb-6">The Old Way</h3>
              <ul className="space-y-5 text-stone-500 text-lg">
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Ignore platform revenue
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Require collateral (houses/cars)
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Weeks of paperwork
                </li>
              </ul>
            </div>

            {/* LendFriend (Highlighted) */}
            <div className="bg-white p-10 rounded-3xl border-2 border-brand-500 shadow-2xl shadow-brand-500/10 relative transform md:-translate-y-6 z-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-secondary-600 text-white px-8 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg whitespace-nowrap">
                The Community Way
              </div>
              <h3 className="text-3xl font-bold text-stone-900 mb-8 text-center">LendFriend</h3>
              <ul className="space-y-6 text-stone-700 text-lg">
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1.5 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Data-verified trust
                </li>
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1.5 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  0% Interest (Community)
                </li>
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1.5 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Funded by people who care
                </li>
              </ul>
              <div className="mt-10">
                <Link href="/create-loan" className="block w-full py-4 bg-brand-600 hover:bg-brand-700 text-white text-center font-bold rounded-full transition-colors shadow-lg">
                    Check Your Eligibility
                </Link>
              </div>
            </div>

            {/* Merchant Cash Advance */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold text-stone-400 mb-6">The Costly Way</h3>
              <ul className="space-y-5 text-stone-500 text-lg">
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  20-40% APR equivalent
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Aggressive daily withdrawals
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Profit-driven (not people-driven)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-brand-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-secondary-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Believe in your business? <br/> So do we.
          </h2>
          <p className="text-stone-200 text-xl md:text-2xl mb-12 font-light leading-relaxed">
            Join the community where reputation and revenue build your future.
          </p>
          <Link
            href="/create-loan"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-brand-900 font-bold rounded-full shadow-2xl hover:bg-brand-50 transition-all transform hover:-translate-y-1 text-lg"
          >
            Start Your Story
          </Link>
        </div>
      </div>
    </main>
  );
}