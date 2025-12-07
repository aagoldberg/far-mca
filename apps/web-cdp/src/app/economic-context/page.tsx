'use client';

import Link from 'next/link';
import { useState } from 'react';

function Ref({ id, title, url, source }: { id: number; title: string; url?: string; source?: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline">
      <button
        onClick={() => setShow(!show)}
        className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
      >
        [{id}]
      </button>
      {show && (
        <span className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 shadow-xl z-10">
          {title}
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 ml-1">
              ↗
            </a>
          )}
          {source && <span className="text-slate-500 block mt-1">{source}</span>}
        </span>
      )}
    </span>
  );
}

export default function EconomicContextPage() {
  return (
    <div className="min-h-screen bg-white text-slate-700">
      {/* Hero */}
      <div className="py-20 md:py-28 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm tracking-wider uppercase mb-4">
            Economic Context
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            How We Got Here
          </h1>

          {/* TL;DR */}
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Platform workers earn $1T+ annually but can't get loans—banks can't verify their income. Standalone lenders tried and failed. We use social accountability instead of payment control.
          </p>
        </div>
      </div>

      {/* Headline Stats Strip */}
      <div className="border-b border-slate-200 py-10 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-between items-center text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-slate-900">77%</div>
              <div className="text-sm text-slate-500 mt-1">of small businesses</div>
              <div className="text-xs text-slate-400">struggle to access capital</div>
            </div>
            <div className="text-slate-300 text-2xl">|</div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-slate-900">1 in 4</div>
              <div className="text-sm text-slate-500 mt-1">small businesses</div>
              <div className="text-xs text-slate-400">denied traditional financing</div>
            </div>
            <div className="text-slate-300 text-2xl">|</div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-slate-900">$5T</div>
              <div className="text-sm text-slate-500 mt-1">global SMB funding gap</div>
              <div className="text-xs text-slate-400">annually</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Wave 1 */}
        <section className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">2010–2025</p>
            <h2 className="text-3xl font-bold text-slate-900">The New Economy Emerged</h2>
          </div>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Digital platforms built a $1+ trillion global economy. 1.6 billion gig workers
            <Ref id={1} title="Gig Economy Statistics (2025)" url="https://www.demandsage.com/gig-economy-statistics/" /> and 207 million creators
            <Ref id={17} title="Creator Economy Statistics" url="https://simplebeen.com/creator-economy-statistics/" /> now earn income borderlessly through Shopify, Stripe, Square, Upwork, and thousands of other platforms. Then AI accelerated everything—68% of small businesses adopted AI by 2025
            <Ref id={2} title="Small Business AI Adoption (2025)" url="https://www.foxbusiness.com/economy/small-business-ai-adoption-jumps-68-owners-plan-significant-workforce-growth-2025" />.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
            <div className="py-4">
              <div className="text-2xl font-bold text-slate-900">$3.8B</div>
              <div className="text-xs text-slate-500">Upwork volume</div>
            </div>
            <div className="py-4">
              <div className="text-2xl font-bold text-slate-900">4.8M</div>
              <div className="text-xs text-slate-500">Shopify merchants</div>
            </div>
            <div className="py-4">
              <div className="text-2xl font-bold text-slate-900">9.7M</div>
              <div className="text-xs text-slate-500">Etsy sellers</div>
            </div>
            <div className="py-4">
              <div className="text-2xl font-bold text-slate-900">6M</div>
              <div className="text-xs text-slate-500">DoorDash drivers</div>
            </div>
          </div>

          <div className="border-l-2 border-slate-300 pl-6 py-2">
            <p className="text-slate-600">
              <strong className="text-slate-900">The paradox:</strong> Platform income is more verifiable than traditional employment—Shopify sees every sale, Stripe sees every payment—yet banks won't accept it. They still require W-2s that don't exist for platform workers.
            </p>
          </div>
        </section>

        {/* Wave 2 */}
        <section className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">2020–2025</p>
            <h2 className="text-3xl font-bold text-slate-900">Finance Couldn't Adapt</h2>
          </div>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Platform lenders like Shopify Capital and Stripe Capital filled part of the gap. They control payment rails—seeing every transaction and auto-deducting repayments. It works: merchants funded see 36% higher growth
            <Ref id={35} title="Shopify Capital Impact" url="https://www.shopify.com/blog/capital-effect-on-business-growth" />. But they're invite-only, gatekept to their own platforms, and charge 20-50% APR.
          </p>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Standalone revenue-based lenders (Clearco, Wayflyer, Pipe, Uncapped) tried to serve everyone else without controlling payment rails. Most faced major restructuring or pivoted away entirely
            <Ref id={37} title="Clearco Restructuring" url="https://betakit.com/" />
            <Ref id={40} title="Uncapped Discontinues RBF" url="https://www.weareuncapped.com/blog/uncapped-remove-rbf-offering" />. The core problem: borrowers could route revenue through unmonitored channels
            <Ref id={41} title="RBF Moral Hazard Study" source="Harvard Business School Working Paper (2023)" />.
          </p>

          <div className="border-l-2 border-slate-300 pl-6 py-2">
            <p className="text-slate-600">
              <strong className="text-slate-900">The lesson:</strong> Embedded lenders succeed because they control payment rails. Standalone lenders fail because they can't. A different approach is needed.
            </p>
          </div>
        </section>

        {/* Wave 3 */}
        <section className="mb-20">
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">2024–2025</p>
            <h2 className="text-3xl font-bold text-slate-900">The Infrastructure Arrived</h2>
          </div>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Three pieces of infrastructure reached maturity simultaneously:
          </p>

          <div className="space-y-8 mb-10">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Stablecoins at Scale</h3>
              <p className="text-slate-600">
                $305B supply, $28T transferred in 2024—more than Visa and Mastercard combined
                <Ref id={5} title="Stablecoin Market Data" url="https://paymentscmi.com/insights/stablecoins-cross-border-payments-banks-strategy/" />. 80% lower costs than traditional rails
                <Ref id={22} title="Stablecoin Cost Savings" url="https://bvnk.com/blog/blockchain-cross-border-payments" />. Visa, PayPal, and Stripe are all building on stablecoins.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">On-Chain Lending Proven</h3>
              <p className="text-slate-600">
                Maple Finance grew 1,600% to $562M
                <Ref id={27} title="Maple Finance Growth" url="https://www.reflexivityresearch.com/" />. Goldfinch financed $110M across 20+ countries
                <Ref id={28} title="Goldfinch Emerging Markets" url="https://www.coingecko.com/research/publications/undercollateralized-loans-the-future-of-defi-lending" />. DeFi collateralized lending reached $50B TVL
                <Ref id={6} title="DeFi Collateralized Lending TVL" url="https://coinlaw.io/crypto-lending-and-borrowing-statistics/" />. Blockchain settlement works.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Social Verification Scaled</h3>
              <p className="text-slate-600">
                Farcaster: 500K+ users with wallet-based identity and open social graphs. Bluesky: 20M+ users with domain verification. For the first time, we can quantify social trust at scale without centralized gatekeepers.
              </p>
            </div>
          </div>

          <div className="border-l-2 border-slate-300 pl-6 py-2">
            <p className="text-slate-600">
              <strong className="text-slate-900">The convergence:</strong> In 2020, stablecoins were under $10B, no crypto lending existed at scale, and decentralized social wasn't viable. By 2025, all three are mature.
            </p>
          </div>
        </section>

        {/* LendFriend Solution - Tightened */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">LendFriend Bridges the Gap</h2>
          </div>

          <div className="bg-[#3B9B7F] rounded-lg p-6 mb-10">
            <p className="font-semibold text-white mb-4">The key insight:</p>
            <p className="text-white/90">
              Borrowers repay not because we control their money, but because defaulting is publicly visible to their entire social graph and destroys future access to capital. We verify Shopify, Stripe, and Square income—but enforce repayment through reputation, not payment rails.
            </p>
          </div>

          <div className="space-y-4 text-slate-600">
            <p><strong className="text-slate-900">Today:</strong> Build uncollateralized lending infrastructure for the new economy</p>
            <p><strong className="text-slate-900">2027–2030:</strong> On-chain credit scores become portable across DeFi</p>
            <p><strong className="text-slate-900">2030–2035:</strong> Reputation-backed credit becomes a Web3 primitive</p>
          </div>
        </section>

        {/* References */}
        <section className="mb-16">
          <details className="text-sm">
            <summary className="font-semibold text-slate-700 cursor-pointer hover:text-slate-900 py-2">
              References
            </summary>
            <div className="mt-4 text-xs text-slate-500 space-y-1">
              <div>[1] Gig Economy Statistics (2025) <a href="https://www.demandsage.com/gig-economy-statistics/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[2] Small Business AI Adoption (2025) <a href="https://www.foxbusiness.com/economy/small-business-ai-adoption-jumps-68-owners-plan-significant-workforce-growth-2025" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[3] Small Business Capital Access (2024) — Goldman Sachs Survey</div>
              <div>[4] Small Business Funding Gap <a href="https://www.nsba.biz/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[5] Stablecoin Market Data <a href="https://paymentscmi.com/insights/stablecoins-cross-border-payments-banks-strategy/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[6] DeFi Collateralized Lending TVL <a href="https://coinlaw.io/crypto-lending-and-borrowing-statistics/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[17] Creator Economy Statistics <a href="https://simplebeen.com/creator-economy-statistics/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[20] US Treasury Report (2025) <a href="https://home.treasury.gov/system/files/136/Financing-Small-Business-Landscape-and-Recommendations.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[22] Stablecoin Cost Savings <a href="https://bvnk.com/blog/blockchain-cross-border-payments" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[27] Maple Finance Growth <a href="https://www.reflexivityresearch.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[28] Goldfinch Emerging Markets <a href="https://www.coingecko.com/research/publications/undercollateralized-loans-the-future-of-defi-lending" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[35] Shopify Capital Impact <a href="https://www.shopify.com/blog/capital-effect-on-business-growth" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[37] Clearco Restructuring <a href="https://betakit.com/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[40] Uncapped Discontinues RBF <a href="https://www.weareuncapped.com/blog/uncapped-remove-rbf-offering" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">↗</a></div>
              <div>[41] RBF Moral Hazard Study — Harvard Business School Working Paper (2023)</div>
            </div>
          </details>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-200 pt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">This Is The Moment</h2>
            <p className="text-slate-500 mb-8">
              Three waves converged. The infrastructure exists. The market is ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vision"
                className="inline-block px-6 py-3 bg-[#3B9B7F] text-white font-semibold rounded-lg hover:bg-[#2E7D68] transition-colors"
              >
                Read Our Vision
              </Link>
              <Link
                href="/"
                className="inline-block px-6 py-3 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Browse Loans
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
