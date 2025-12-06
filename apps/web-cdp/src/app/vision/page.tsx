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
      <div className="relative bg-gradient-to-b from-brand-600 to-brand-800 py-24 sm:py-32 overflow-hidden isolate">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[200%] aspect-[1/1] rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-brand-50 ring-1 ring-inset ring-brand-400/50 mb-6 bg-white/10 backdrop-blur-sm">
            The Vision
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight">
            Credit for the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-white">Reputation Economy</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-50 max-w-2xl mx-auto leading-relaxed font-light">
            Web3 infrastructure for uncollateralized credit—powered by verified revenue and community trust.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 py-16 space-y-24">

        {/* The Problem - 2 Column Split */}
        <section className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-3 block">The Problem</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Rejected by Banks. <br />Too Small for Fintechs.</h2>
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

        {/* The Solution - 2 Column Split */}
        <section className="grid md:grid-cols-12 gap-12 items-start border-t border-gray-100 pt-16">
          <div className="md:col-span-5">
            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-3 block">The Solution</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Trust Based on Truth.</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Traditional credit models look backward. We underwrite based on your reality: real-time revenue and community trust. This allows us to serve the high-potential businesses that legacy finance excludes.
            </p>
          </div>

          <div className="md:col-span-7 space-y-6">
            <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <ChartBarIcon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Your Sales Are Your Credit Score</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Stop relying on credit bureaus. Connect Shopify, Stripe, or Square instantly. We use your verifiable transaction history to prove you can repay.
              </p>
            </div>

            <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <UserGroupIcon className="w-6 h-6 text-brand-600" />
                </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Your Community is Your Collateral</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Get funded by the people who know you best. When your reputation is on the line within your own community, social accountability creates a powerful incentive to repay.
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
              The viral mechanics of crowdlending networks are well-documented in academia and battle-tested in industry. 
              The capital exists; the challenge is activating it through trusted social networks.
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
                    To get funded, borrowers share their loan with their own social graph (Facebook, WhatsApp). Distribution is user-generated.
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
                <span className="text-xs font-bold tracking-wider uppercase text-brand-600">In Testing</span>
                <h3 className="text-2xl font-bold text-gray-900">Revenue-Verified Lending</h3>
              </div>
              <p className="text-gray-600 mb-4 max-w-2xl leading-relaxed">
                0% interest community loans ($100-$5K) to prove the model. Connect Shopify, Stripe, or Square to verify revenue,
                track repayments on-chain, and share with your network.
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-brand-500" /> Shopify, Stripe & Square
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
                Once we can model repayment risk using business metrics combined with social data,
                we can introduce fair interest rates (8-12% APY) that reward lenders while keeping costs 50% lower than MCAs.
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
                AI agents that monitor revenue and automatically route payments to repay loans.
                "Loans that pay themselves" via autonomous agents, streaming payments, and merchant stablecoin adoption.
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
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Future of Credit</h2>
          <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
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
