'use client';

import Link from 'next/link';
import Image from 'next/image';

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
            Building the Web3 infrastructure for uncollateralized credit—from community lending to global markets
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-6 py-12">

        {/* Aspirational Vision */}
        <section className="mb-16">
          <p className="text-2xl text-gray-800 leading-relaxed text-center mb-4 font-light max-w-[46rem] mx-auto">
            Imagine a world where <strong className="font-semibold text-[#2E7D68]">your reputation replaces your credit score</strong>, your cashflow replaces collateral, and loans repay themselves automatically as you earn.
          </p>
        </section>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Millions of entrepreneurs now run real businesses with public online profiles—merchants, freelancers, creators, crypto builders.
              They have customer reviews, social media followings, and verifiable income streams. Together they've built a $1+ trillion
              economy, and AI tools are accelerating their growth. To grow, they need capital for equipment, inventory, and operations.
            </p>
            <p>
              But traditional lending is fundamentally broken:
            </p>
            <ul className="ml-6 space-y-2">
              <li>• <strong>Banks</strong> exclude billions who lack credit history or collateral</li>
              <li>• <strong>Fintech lenders</strong> struggle with expensive funding and legacy payment rails, charging 20-40% APR</li>
              <li>• <strong>DeFi</strong> requires 125% overcollateralization, defeating the purpose of credit</li>
            </ul>
          </div>
        </section>

        {/* Vitalik Quote */}
        <section className="mb-16">
          <div className="bg-white border-l-4 border-[#2E7D68] rounded-r-lg shadow-md p-6">
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
              We make uncollateralized lending work by solving fintech's core problems. We eliminate VC and debt middlemen with <strong className="text-[#2E7D68]">community capital</strong>, replace costly payment rails with <strong className="text-[#2E7D68]">instant, low-cost stablecoins</strong>, and reduce defaults through <strong className="text-[#2E7D68]">social trust + cashflow data</strong>. Result: 8-15% lower APR at scale.
            </p>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We start with 0% loans to prove trust works, then evolve to sustainable revenue-based financing as we scale. Fair rates, transparent terms, real accountability.
              </p>
            </div>
          </div>
        </section>

        {/* Economics Comparison */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">How We Lower Costs</h3>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Traditional Fintech */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-5">
              <h4 className="text-lg font-bold text-red-900 mb-1">Traditional Fintech</h4>
              <p className="text-xs text-gray-600 italic mb-4">Cashflow underwriting, but still 7-12% defaults</p>

              <div className="space-y-3">
                {/* Expensive Capital */}
                <div className="bg-white rounded-lg p-3 border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Expensive Capital Sources</span>
                  </div>
                  <p className="text-xs text-gray-600">Borrow from VC (20%+) or banks (12-15%)</p>
                </div>

                <div className="flex justify-center text-xl text-red-600 font-bold">+</div>

                {/* ACH Rails */}
                <div className="bg-white rounded-lg p-3 border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Expensive Payment Rails</span>
                  </div>
                  <p className="text-xs text-gray-600">ACH: $0.50/transaction, 1-3 day delays</p>
                </div>

                <div className="flex justify-center text-xl text-red-600 font-bold">+</div>

                {/* Operational Overhead */}
                <div className="bg-white rounded-lg p-3 border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Operational Overhead</span>
                  </div>
                  <p className="text-xs text-gray-600">$500K-$2.5M to launch, $200K-$500K/year</p>
                </div>

                <div className="flex justify-center py-1">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Result */}
                <div className="bg-red-100 rounded-lg p-4 border-2 border-red-400">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-900">~20-50%</p>
                    <p className="text-xs text-red-700 mt-1">APR to cover capital + infrastructure + defaults</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LendFriend */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-[#3B9B7F] rounded-xl p-5">
              <h4 className="text-lg font-bold text-[#2E7D68]">LendFriend</h4>
              <p className="text-xs text-gray-600 italic mb-4">Cashflow + social trust to reduce defaults</p>

              <div className="space-y-3">
                {/* Community Capital */}
                <div className="bg-white rounded-lg p-3 border-2 border-[#3B9B7F]">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#3B9B7F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Low-Cost Capital Sources</span>
                  </div>
                  <p className="text-xs text-gray-600">Community capital, DeFi (5-10%)</p>
                </div>

                <div className="flex justify-center text-xl text-[#3B9B7F] font-bold">+</div>

                {/* Stablecoins */}
                <div className="bg-white rounded-lg p-3 border-2 border-[#3B9B7F]">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#3B9B7F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Low-Cost Payment Rails</span>
                  </div>
                  <p className="text-xs text-gray-600">Stablecoins: $0.01/transaction, instant settlement</p>
                </div>

                <div className="flex justify-center text-xl text-[#3B9B7F] font-bold">+</div>

                {/* Minimal Overhead */}
                <div className="bg-white rounded-lg p-3 border-2 border-[#3B9B7F]">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#3B9B7F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-semibold text-gray-900 text-sm">Minimal Overhead</span>
                  </div>
                  <p className="text-xs text-gray-600">Minimal: Smart contracts, {'<'}$100K setup, {'<'}$50K/year</p>
                </div>

                <div className="flex justify-center py-1">
                  <svg className="w-5 h-5 text-[#3B9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Result */}
                <div className="bg-green-100 rounded-lg p-4 border-2 border-[#3B9B7F]">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#2E7D68]">~10-40%</p>
                    <p className="text-xs text-[#065F46] mt-1">APR via better capital + infrastructure + defaults</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Built-In Viral Growth */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Built-In Viral Growth</h2>
          <p className="text-gray-600 text-center mb-8 text-lg">
            Every borrower becomes a growth engine by sharing their personal story
          </p>

          {/* The Viral Loop */}
          <div className="bg-gradient-to-r from-[#ECFDF5] to-green-50 border-2 border-[#3B9B7F] rounded-xl p-8 mb-8">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                <p className="text-gray-900 font-bold text-lg mb-1">Create</p>
                <p className="text-sm text-gray-600">Borrower posts loan</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#2E7D68] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                <p className="text-gray-900 font-bold text-lg mb-1">Share</p>
                <p className="text-sm text-gray-600">50-200 people see it</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#065F46] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                <p className="text-gray-900 font-bold text-lg mb-1">Convert</p>
                <p className="text-sm text-gray-600">10-20% become lenders</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#3B9B7F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
                <p className="text-gray-900 font-bold text-lg mb-1">Repeat</p>
                <p className="text-sm text-gray-600">Lenders → borrowers</p>
              </div>
            </div>

            <div className="bg-[#ECFDF5] rounded-lg p-6 border-l-4 border-[#3B9B7F]">
              <p className="text-gray-700 text-lg leading-relaxed text-center">
                <strong className="text-[#2E7D68]">The magic:</strong> Emotional connection drives 10-100x better engagement.
                Each funded loan creates social proof that accelerates growth.
              </p>
            </div>
          </div>

          {/* Why It Works */}
          <div className="grid md:grid-cols-[2fr_3fr] gap-6">
            <div className="bg-gradient-to-br from-[#ECFDF5] to-white border-2 border-[#3B9B7F] rounded-xl p-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#3B9B7F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#2E7D68]">0.7-1.2</h4>
                  <p className="text-sm text-gray-600 font-medium">Viral Coefficient</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Each user brings 0.7-1.2 new users. Outstanding viral growth potential.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#ECFDF5] to-white border-2 border-[#3B9B7F] rounded-xl p-4 flex items-center justify-center">
              <Image
                src="/images/viral.png"
                alt="Viral Growth Network Effect"
                width={600}
                height={400}
                className="rounded-lg w-full h-auto"
                priority
              />
            </div>
          </div>
        </section>

        {/* Three-Phase Journey */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">The Journey</h2>
          <p className="text-gray-600 text-center mb-10 text-lg">
            A research-backed evolution from social trust to automated, scalable credit infrastructure
          </p>

          {/* Visual Timeline */}
          <div className="mb-12 relative">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Phase 0 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-[#ECFDF5] to-white border-2 border-[#3B9B7F] rounded-xl p-6 h-full">
                  <div className="bg-[#3B9B7F] text-white px-4 py-2 rounded-lg font-bold text-sm inline-block mb-3">
                    Phase 0
                  </div>
                  <h3 className="text-xl font-bold text-[#2E7D68] mb-2">Bootstrap Trust</h3>
                  <div className="text-sm text-gray-600 mb-4">Launching 2025</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-[#2E7D68]">0%</span>
                      <span className="text-sm text-gray-600">Interest</span>
                    </div>
                    <p className="text-sm text-gray-700">Pure social lending to prove trust works</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#3B9B7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Phase 1 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-[#EFF6FF] to-white border-2 border-[#3B82F6] rounded-xl p-6 h-full">
                  <div className="bg-[#1E40AF] text-white px-4 py-2 rounded-lg font-bold text-sm inline-block mb-3">
                    Phase 1
                  </div>
                  <h3 className="text-xl font-bold text-[#1E40AF] mb-2">Add Cashflow</h3>
                  <div className="text-sm text-gray-600 mb-4">2025-2026</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-[#1E40AF]">RBF</span>
                    </div>
                    <p className="text-sm text-gray-700">Revenue-based financing with hybrid underwriting</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-[#F3F4F6] to-white border-2 border-gray-400 rounded-xl p-6 h-full">
                  <div className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold text-sm inline-block mb-3">
                    Phase 2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Automate Repayment</h3>
                  <div className="text-sm text-gray-600 mb-4">2026-2027</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-gray-900">⚡</span>
                    </div>
                    <p className="text-sm text-gray-700">Revenue integration & agentic payments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile arrows */}
            <div className="md:hidden flex justify-center my-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#3B9B7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Phase 0 */}
          <div className="mb-8">
            <div className="bg-white border-2 border-[#3B9B7F] rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#3B9B7F] text-white px-5 py-2 rounded-lg font-bold text-lg flex-shrink-0">
                  Phase 0
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#2E7D68] mb-1">Bootstrap Trust Networks</h3>
                  <p className="text-sm text-gray-600 font-medium">Live on Testnet • Launching Mainnet 2025</p>
                </div>
              </div>

              <p className="text-lg font-semibold text-gray-900 mb-6">
                Pure social lending at 0% to bootstrap the network
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
                      <span>Optional tipping for borrowers who want to give back</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#3B9B7F] font-bold">→</span>
                      <span><strong>Primary launch on Farcaster</strong> (Base app + other Farcaster-native platforms)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#3B9B7F] font-bold">→</span>
                      <span>Also exploring: Bluesky, Twitter, Reddit communities</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#3B9B7F] font-bold">→</span>
                      <span>Simple wallet verification + social signals</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#3B9B7F] font-bold">→</span>
                      <span>On-chain repayment tracking</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">What We're Learning</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#ECFDF5] rounded-lg p-4 shadow-md">
                      <p className="text-sm font-semibold text-[#065F46] mb-2">Where's The Demand?</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Which networks have active lenders/borrowers?</li>
                        <li>• Community clusters vs. broad networks</li>
                        <li>• Trust cascade patterns</li>
                        <li>• Viral growth mechanics</li>
                      </ul>
                    </div>
                    <div className="bg-[#EFF6FF] rounded-lg p-4 shadow-md">
                      <p className="text-sm font-semibold text-[#1E40AF] mb-2">How Does Repayment Work?</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Repayment rates without interest</li>
                        <li>• Social proximity effects</li>
                        <li>• Timing patterns</li>
                        <li>• Impact of transparency</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] rounded-r-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-900">
                    <strong className="text-[#92400E]">What Happens Next:</strong> We move to Phase 1 (cashflow + interest) with learnings about what borrowers need
                    and where demand exists. Every loan teaches us something valuable about making this work at scale.
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
            <div className="bg-[#EFF6FF] border-2 border-[#3B82F6] rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#1E40AF] text-white px-5 py-2 rounded-lg font-bold text-lg flex-shrink-0">
                  Phase 1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1E40AF] mb-1">Scale with Cashflow</h3>
                  <p className="text-sm text-gray-600 font-medium">Planned 2025-2026</p>
                </div>
              </div>

              <p className="text-lg font-semibold text-gray-900 mb-6">
                Layer in cashflow data for larger loans with fair interest rates
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">The Key Shift</h4>
                  <div className="bg-white border-l-4 border-[#1E40AF] rounded-r-lg p-5 shadow-md">
                    <p className="text-gray-900 mb-3">
                      Cashflow verification transforms lending from <strong>"I trust my friend"</strong> to <strong>"I trust my friend + the data"</strong>.
                    </p>
                    <p className="text-gray-700 text-sm">
                      With objective cashflow data, community lenders can confidently fund larger loans. The social trust
                      remains, but now backed by verified revenue streams.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">New Capabilities</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white border-l-4 border-[#3B82F6] rounded-r-lg p-4 shadow-md">
                      <p className="font-semibold text-[#1E40AF] mb-2">Larger Loans</p>
                      <p className="text-sm text-gray-700">$5,000 - $50,000+ based on verified cashflow</p>
                    </div>
                    <div className="bg-white border-l-4 border-[#3B9B7F] rounded-r-lg p-4 shadow-md">
                      <p className="font-semibold text-[#065F46] mb-2">Cashflow Verification</p>
                      <p className="text-sm text-gray-700">Bank accounts (Plaid), merchant revenue (Square, Shopify)</p>
                    </div>
                    <div className="bg-white border-l-4 border-[#3B82F6] rounded-r-lg p-4 shadow-md">
                      <p className="font-semibold text-[#1E40AF] mb-2">Fair Revenue-Based Terms</p>
                      <p className="text-sm text-gray-700">Lower cost than traditional RBF (typical: 1.2-1.5x factor rates)</p>
                    </div>
                    <div className="bg-white border-l-4 border-[#3B9B7F] rounded-r-lg p-4 shadow-md">
                      <p className="font-semibold text-[#065F46] mb-2">Community Funding</p>
                      <p className="text-sm text-gray-700">Direct lending from your network and broader community</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Hybrid Risk Model</h4>
                  <div className="bg-white border-l-4 border-[#3B82F6] rounded-r-lg p-4 shadow-md">
                    <p className="text-sm text-gray-900 mb-3">
                      Combining social trust + verified cashflow + repayment for accurate underwriting (exact weightings are experimental):
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>• <strong className="text-gray-900">Small loans ($100-$5K):</strong></span>
                        <span>60% social, 30% cashflow, 10% repayment</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• <strong className="text-gray-900">Medium loans ($5K-$25K):</strong></span>
                        <span>40% social, 40% cashflow, 20% repayment</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• <strong className="text-gray-900">Large loans ($25K+):</strong></span>
                        <span>20% social, 60% cashflow, 20% repayment</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] rounded-r-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-900">
                    <strong className="text-[#92400E]">Goal:</strong> Serve borrowers traditional finance excludes—freelancers, crypto-native workers, small merchants.
                    Prove that hybrid underwriting can scale while maintaining fairness.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="https://docs.lendfriend.org/vision/phase-1"
                  className="text-[#3B9B7F] hover:text-[#2E7D68] font-semibold"
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

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">For Merchants</h4>
                    <div className="bg-[#ECFDF5] rounded-lg p-4 shadow-md">
                      <p className="text-sm text-[#065F46] mb-2">
                        <strong>Revenue Integration</strong>
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Shopify, Square, Stripe</li>
                        <li>• Coinbase Commerce for crypto</li>
                        <li>• And other payment platforms</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">For Wallet Holders</h4>
                    <div className="bg-[#EFF6FF] rounded-lg p-4 shadow-md">
                      <p className="text-sm text-[#1E40AF] mb-2">
                        <strong>Account Abstraction</strong> (developing)
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Auto-deduct from incoming transfers</li>
                        <li>• Payment streams plugins maturing</li>
                        <li>• Stripe + Coinbase pushing adoption</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Agentic Repayment</h4>
                    <div className="bg-[#ECFDF5] rounded-lg p-4 shadow-md">
                      <p className="text-sm text-[#065F46] mb-2">
                        <strong>AI-Managed Payments</strong> (future)
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Agent monitors your income streams</li>
                        <li>• Auto-schedules optimal repayments</li>
                        <li>• Manages cashflow for you</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Why This Matters</h4>
                  <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] rounded-r-lg p-4 shadow-sm">
                    <p className="text-gray-900 mb-2">
                      Removes the biggest friction in P2P lending: <strong className="text-[#92400E]">remembering to repay</strong>.
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
                We start altruistic (0% interest) and evolve to sustainable revenue share as we scale.
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
