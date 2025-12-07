'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  GlobeAltIcon,
  BuildingLibraryIcon,
  BoltIcon,
  ChartBarIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

function Ref({ id, title, url, source }: { id: number; title: string; url?: string; source?: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block align-top ml-0.5">
      <button
        onClick={() => setShow(!show)}
        className="text-brand-400 hover:text-brand-600 text-xs font-bold cursor-pointer bg-brand-50 px-1.5 py-0.5 rounded transition-colors"
      >
        {id}
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 shadow-xl z-20 text-left leading-normal">
          <strong className="block text-gray-900 mb-1">{title}</strong>
          {source && <span className="block mb-1">{source}</span>}
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline block">
              View Source ↗
            </a>
          )}
        </span>
      )}
    </span>
  );
}

export default function EconomicContextPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-brand-600 to-brand-800 py-24 sm:py-32 overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[200%] aspect-[1/1] rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-brand-50 ring-1 ring-inset ring-brand-400/50 mb-6 bg-white/10 backdrop-blur-sm">
            Economic Context
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight">
            How We <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-white">Got Here</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-100 max-w-2xl mx-auto leading-relaxed font-light">
            Platform workers earn $1T+ annually but remain invisible to banks. This is the story of the gap they fell into—and how we're building the bridge out.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 py-16">

        {/* Key Stats - Big Typography */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-extrabold text-brand-600 mb-2">77%</div>
              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Small Businesses</div>
              <div className="text-sm text-gray-500">Struggle to access capital</div>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-extrabold text-brand-600 mb-2">1 in 4</div>
              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Applicants Denied</div>
              <div className="text-sm text-gray-500">By traditional lenders</div>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-extrabold text-brand-600 mb-2">$5T</div>
              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Funding Gap</div>
              <div className="text-sm text-gray-500">Global annual deficit</div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-100 my-24" />

        {/* Timeline Section */}
        <section className="space-y-24">
          
          {/* Wave 1 */}
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 sticky top-32">
              <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-3 block">2010–2025</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The New Economy Emerged</h2>
              <div className="hidden md:block w-12 h-1 bg-brand-500 rounded-full mt-6"></div>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Digital platforms built a $1+ trillion global economy. 1.6 billion gig workers
                <Ref id={1} title="Gig Economy Statistics" url="https://www.demandsage.com/gig-economy-statistics/" /> and 207 million creators
                <Ref id={17} title="Creator Economy Statistics" url="https://simplebeen.com/creator-economy-statistics/" /> now earn income borderlessly through Shopify, Stripe, Square, and Upwork. 
              </p>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.8M</div>
                    <div className="text-sm text-gray-500">Shopify Merchants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">$3.8B</div>
                    <div className="text-sm text-gray-500">Upwork Volume</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">9.7M</div>
                    <div className="text-sm text-gray-500">Etsy Sellers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">6M</div>
                    <div className="text-sm text-gray-500">DoorDash Drivers</div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-100 rounded-full mt-1">
                  <GlobeAltIcon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Paradox</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Platform income is more verifiable than traditional employment—Shopify sees every sale—yet banks won't accept it. They require W-2s that don't exist for the new economy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          {/* Wave 2 */}
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 sticky top-32">
              <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-3 block">2020–2025</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Finance Couldn't Adapt</h2>
              <div className="hidden md:block w-12 h-1 bg-gray-300 rounded-full mt-6"></div>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Platform lenders like Shopify Capital filled part of the gap by controlling payment rails. It works—merchants funded see 36% higher growth
                <Ref id={35} title="Shopify Capital Impact" url="https://www.shopify.com/blog/capital-effect-on-business-growth" />. But it's invite-only and expensive.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <LockClosedIcon className="w-8 h-8 text-gray-400 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">The Gatekeepers</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Platform lenders control the rails. If you leave the platform, you lose the credit.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <ChartBarIcon className="w-8 h-8 text-gray-400 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">The Failures</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Standalone lenders (Clearco, Wayflyer) struggled because borrowers could route revenue elsewhere.
                    <Ref id={37} title="Clearco Restructuring" url="https://betakit.com/" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-full mt-1">
                  <BuildingLibraryIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Lesson</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Embedded lenders succeed because they control payment rails. Standalone lenders fail because they can't. 
                    To build a truly open credit system, we need a different form of collateral.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          {/* Wave 3 */}
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 sticky top-32">
              <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-3 block">2024–Present</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Convergence</h2>
              <div className="hidden md:block w-12 h-1 bg-brand-500 rounded-full mt-6"></div>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Three pieces of infrastructure finally reached maturity simultaneously, enabling a new model:
              </p>

              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Stablecoins at Scale</h3>
                    <p className="text-gray-600 leading-relaxed">
                      $305B supply, moving $28T annually. 80% lower costs than traditional rails.
                      <Ref id={5} title="Stablecoin Market Data" url="https://paymentscmi.com/insights/stablecoins-cross-border-payments-banks-strategy/" />
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">On-Chain Lending Proven</h3>
                    <p className="text-gray-600 leading-relaxed">
                      DeFi credit protocols reached $50B TVL. The settlement layer works; it just needs better underwriting.
                      <Ref id={6} title="DeFi Stats" url="https://coinlaw.io/crypto-lending-and-borrowing-statistics/" />
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Social Verification Scaled</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Farcaster and Bluesky prove we can have portable, verifiable identity. For the first time, we can quantify reputation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        <div className="w-full h-px bg-gray-100 my-24" />

        {/* The Insight */}
        <section className="bg-brand-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <BoltIcon className="w-16 h-16 text-brand-300 mb-4" />
              <span className="text-brand-200 font-bold tracking-wider uppercase text-sm mb-2 block">The Insight</span>
              <h2 className="text-3xl font-bold">Reputation is the New Collateral</h2>
            </div>
            <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
              <p className="text-lg text-brand-50 leading-relaxed mb-6">
                Borrowers repay not because we control their bank account, but because defaulting destroys their social capital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/vision"
                  className="px-6 py-3 bg-white text-brand-900 font-bold rounded-lg hover:bg-brand-50 transition-colors text-center"
                >
                  Read The Vision
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-transparent border border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-center"
                >
                  Browse Loans
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* References Toggle */}
        <section className="mt-16 text-center">
          <details className="group inline-block text-left">
            <summary className="text-sm text-gray-400 font-medium cursor-pointer hover:text-gray-600 list-none flex items-center gap-2">
              <span>View Sources & Citations</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 p-6 bg-gray-50 rounded-2xl text-xs text-gray-500 space-y-2 max-w-2xl text-left">
              <p>[1] DemandSage: Gig Economy Statistics 2025</p>
              <p>[2] Fox Business: Small Business AI Adoption</p>
              <p>[5] PaymentsCMI: Stablecoin Market Data</p>
              <p>[6] CoinLaw: DeFi Lending Stats</p>
              <p>[35] Shopify: Capital Effect on Growth</p>
              <p>[41] HBS: RBF Moral Hazard Study (2023)</p>
            </div>
          </details>
        </section>

      </div>
    </div>
  );
}