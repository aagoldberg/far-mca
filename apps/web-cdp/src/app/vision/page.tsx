'use client';

import Link from 'next/link';
import {
  BuildingLibraryIcon,
  ChartBarIcon,
  LockClosedIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            The Vision
          </h1>
          <p className="text-xl md:text-2xl font-light text-brand-50 max-w-2xl mx-auto leading-relaxed">
            Web3 infrastructure for uncollateralized credit—powered by revenue verification and community trust.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 py-16 space-y-24">

        {/* The Problem - 2 Column Split */}
        <section className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Millions of entrepreneurs run real businesses with verifiable revenue.
              They have transaction history and proven cashflow. To grow, they need working capital—but the system fails them.
            </p>
          </div>
          
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">
                <BuildingLibraryIcon className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Banks require 680+ credit</h3>
                <p className="text-gray-600">2+ years history, collateral, and weeks of paperwork.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">
                <ChartBarIcon className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Platform MCAs need $10K+/month</h3>
                <p className="text-gray-600">Wayflyer and Shopify Capital exclude smaller sellers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">
                <LockClosedIcon className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">DeFi demands 150% collateral</h3>
                <p className="text-gray-600">Defeats the purpose of credit for real-world growth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution - Full Width Band */}
        <section className="bg-brand-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Verified Revenue + Social Accountability
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Research shows alternative data predicts repayment better than credit scores. 
              We combine automated verification with community trust to serve businesses too small for traditional lenders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-6">
                <ChartBarIcon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Revenue Verification</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect Shopify, Stripe, or Square. Your transaction history becomes your trust score—instant, data-driven, and fair.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-6">
                <UserGroupIcon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Social Accountability</h3>
              <p className="text-gray-600 leading-relaxed">
                Funded by your community. When people who know you back you, default rates drop significantly.
              </p>
            </div>
          </div>
        </section>

        {/* Our Market - Big Typography */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Underserved Majority</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We serve the gap between micro-finance and institutional capital.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-brand-600 mb-2">36M+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Small Businesses (US)</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-brand-600 mb-2">40%</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Credit Constrained</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-brand-600 mb-2">5.5M</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">New Biz / Year</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-brand-600 mb-2">$5.7T</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Finance Gap</div>
            </div>
          </div>
        </section>

        {/* Comparison Table - Clean */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Competitive Landscape</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 pr-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Features</th>
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Banks</th>
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Platform MCAs</th>
                  <th className="py-4 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">DeFi</th>
                  <th className="py-4 pl-4 font-bold text-brand-600 uppercase text-xs tracking-wider">LendFriend</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-medium">Credit Score</td>
                  <td className="py-4 px-4 text-gray-500">680+ Required</td>
                  <td className="py-4 px-4 text-gray-500">Not Required</td>
                  <td className="py-4 px-4 text-gray-500">N/A</td>
                  <td className="py-4 pl-4 font-bold text-gray-900">Not Required</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-medium">Collateral</td>
                  <td className="py-4 px-4 text-gray-500">Assets Required</td>
                  <td className="py-4 px-4 text-gray-500">Future Revenue</td>
                  <td className="py-4 px-4 text-gray-500">150% Crypto</td>
                  <td className="py-4 pl-4 font-bold text-gray-900">Verified Revenue</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-medium">Cost</td>
                  <td className="py-4 px-4 text-gray-500">8-15% APR</td>
                  <td className="py-4 px-4 text-gray-500">High Fees</td>
                  <td className="py-4 px-4 text-gray-500">Variable</td>
                  <td className="py-4 pl-4 font-bold text-brand-600">0% Interest</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-4 font-medium">Min Revenue</td>
                  <td className="py-4 px-4 text-gray-500">$100k+/yr</td>
                  <td className="py-4 px-4 text-gray-500">$10k/mo</td>
                  <td className="py-4 px-4 text-gray-500">N/A</td>
                  <td className="py-4 pl-4 font-bold text-gray-900">Any Verified</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium">Trust Model</td>
                  <td className="py-4 px-4 text-gray-500">Bureau Data</td>
                  <td className="py-4 px-4 text-gray-500">Platform Data</td>
                  <td className="py-4 px-4 text-gray-500">Code</td>
                  <td className="py-4 pl-4 font-bold text-gray-900">Data + Social</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Distribution & Growth - Viral Loop Featured */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Distribution & Growth</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The viral mechanics of P2P networks are well-documented in academia and battle-tested in industry. 
              The capital exists; the challenge is simply connecting it efficiently.
            </p>
          </div>

          {/* Market Proof */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
            <div>
              <div className="text-4xl font-extrabold text-gray-900 mb-1">150M+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">GoFundMe Donors</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-gray-900 mb-1">2M+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Kiva Lenders</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-gray-900 mb-1">50%+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Donor Retention</div>
            </div>
          </div>

          {/* The Viral Loop - Featured Block */}
          <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-12">
                <div className="p-2 bg-white/10 rounded-full">
                  <ArrowPathIcon className="w-6 h-6 text-brand-300" />
                </div>
                <h3 className="text-2xl font-bold">The Viral Loop</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>

                {/* Step 1 */}
                <div className="text-center relative">
                  <div className="w-12 h-12 bg-brand-800 border border-brand-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 relative z-10 shadow-xl">1</div>
                  <h4 className="font-bold text-lg mb-2">Borrower Shares</h4>
                  <p className="text-brand-100 text-sm leading-relaxed px-4">
                    To get funded, borrowers share their loan with their own social graph (Farcaster, Twitter). Distribution is user-generated.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center relative">
                  <div className="w-12 h-12 bg-brand-800 border border-brand-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 relative z-10 shadow-xl">2</div>
                  <h4 className="font-bold text-lg mb-2">Friends Fund</h4>
                  <p className="text-brand-100 text-sm leading-relaxed px-4">
                    Social proximity increases funding success and lowers default rates. Communities bet on their own.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center relative">
                  <div className="w-12 h-12 bg-brand-800 border border-brand-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 relative z-10 shadow-xl">3</div>
                  <h4 className="font-bold text-lg mb-2">Network Grows</h4>
                  <p className="text-brand-100 text-sm leading-relaxed px-4">
                    Backers see the product work and convert into borrowers or invite other merchants. The network scales organically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap - Visual Timeline */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Roadmap</h2>
          
          <div className="relative border-l-2 border-gray-100 ml-4 md:ml-12 space-y-16">
            
            {/* Phase 0 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-500 border-4 border-white shadow-sm"></div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-brand-600">Live Now</span>
                <h3 className="text-2xl font-bold text-gray-900">Revenue-Verified Lending</h3>
              </div>
              <p className="text-gray-600 mb-4 max-w-2xl leading-relaxed">
                0% interest community loans ($100-$5K) to prove the model. We've built OAuth integrations for Shopify/Stripe, 
                on-chain repayment tracking, and social sharing rails.
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-brand-500" /> Shopify & Stripe Integrations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-brand-500" /> Trust Score V1
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-brand-500" /> Base L2 Payments
                </li>
              </ul>
            </div>

            {/* Phase 1 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow-sm"></div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-gray-500">Exploring</span>
                <h3 className="text-2xl font-bold text-gray-900">Scale with Returns</h3>
              </div>
              <p className="text-gray-600 mb-4 max-w-2xl leading-relaxed">
                Introduction of fair interest rates (8-12% APY) to attract institutional capital, contingent on regulatory frameworks. 
                Focus on creating a sustainable yield for lenders while keeping costs 50% lower than MCAs.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-200 border-4 border-white shadow-sm"></div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-gray-400">Future</span>
                <h3 className="text-2xl font-bold text-gray-900">Automated Repayment</h3>
              </div>
              <p className="text-gray-600 max-w-2xl leading-relaxed">
                Smart contracts that automatically route revenue percentage to repay loans. 
                "Loans that pay themselves" via streaming payments and merchant stablecoin adoption.
              </p>
            </div>

          </div>
        </section>

        {/* Why Now - Grid */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Now</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <CurrencyDollarIcon className="w-8 h-8 text-brand-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Stablecoins</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                $0.01 transactions on Base L2 finally make micro-loans viable globally.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <WrenchScrewdriverIcon className="w-8 h-8 text-brand-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Platform APIs</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Real-time data from Shopify & Stripe allows for instant, verified underwriting.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <GlobeAltIcon className="w-8 h-8 text-brand-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Open Identity</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Farcaster provides a portable, verifiable social graph for reputation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA - Simple & Clean */}
        <section className="bg-gray-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Future of Credit</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Help us build a fairer financial system based on verification and trust, not just collateral.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all"
            >
              Browse Loans
            </Link>
            <Link
              href="/create-loan"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all"
            >
              Create a Loan
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
