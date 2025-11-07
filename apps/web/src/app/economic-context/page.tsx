'use client';

import Link from 'next/link';

export default function EconomicContextPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Economic Context
          </h1>
          <p className="text-xl md:text-2xl font-light">
            How we got here—and why now is the moment
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-6 py-12">

        {/* Intro - Hero Statement */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <p className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              The gap between where people earn<br />and where they can borrow<br />has never been wider
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-gray-300 pl-6 py-2">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">Wave 1 (2010-2025):</span> Digital platforms built a $1+ trillion global economy. 1.6 billion people now earn income from Upwork, Shopify, YouTube, and thousands of other platforms—borderlessly<sup className="text-[#3B9B7F]">[1]</sup>. Then AI turbocharged it: 68% of small businesses adopted AI in 2025<sup className="text-[#3B9B7F]">[2]</sup>. A new economy emerged. But banks still can't underwrite it.
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-6 py-2">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">Wave 2 (2020-2025):</span> Traditional finance couldn't adapt. Banks reject 1 in 4 small business borrowers<sup className="text-[#3B9B7F]">[4]</sup>—not because they can't repay, but because legacy underwriting can't process platform income. 77% struggle to access capital<sup className="text-[#3B9B7F]">[3]</sup>. Platform lenders like Shopify and Stripe filled the gap, but only for their own users, at brutal rates: 20-50% APR.
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-6 py-2">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">Wave 3 (2024-2025):</span> The infrastructure finally arrived. Stablecoins reached $305B in supply and processed $27.6T in transfers<sup className="text-[#3B9B7F]">[5]</sup>—more than Visa and Mastercard combined. DeFi proved crypto-native lending works at scale: $50B TVL, minimal defaults<sup className="text-[#3B9B7F]">[6]</sup>. Decentralized social protocols hit millions of users. For the first time, all the pieces exist to bridge the gap.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-2xl font-bold text-[#2E7D68]">
              → LendFriend bridges the gap.
            </p>
          </div>
        </section>

        {/* Wave 1: The New Economy */}
        <section className="mb-20 pb-20 border-b-4 border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg">
              Wave 1
            </div>
            <h2 className="text-3xl font-bold text-gray-900">The New Economy Emerged</h2>
          </div>

          {/* Platform Stats - Grid without heavy borders */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">The Platforms That Changed Everything</h3>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">$3.8B</div>
                <div className="text-sm font-semibold text-gray-700">Upwork<sup className="text-[#3B9B7F]">[7]</sup></div>
                <div className="text-xs text-gray-500">Annual volume</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">4.8M</div>
                <div className="text-sm font-semibold text-gray-700">Shopify<sup className="text-[#3B9B7F]">[9]</sup></div>
                <div className="text-xs text-gray-500">Global merchants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">9.7M</div>
                <div className="text-sm font-semibold text-gray-700">Etsy<sup className="text-[#3B9B7F]">[10]</sup></div>
                <div className="text-xs text-gray-500">Active sellers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">6M</div>
                <div className="text-sm font-semibold text-gray-700">DoorDash<sup className="text-[#3B9B7F]">[16]</sup></div>
                <div className="text-xs text-gray-500">Dashers</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-[#3B9B7F]">
              <p className="text-lg font-semibold text-[#065F46]">
                = 1.6 billion gig workers<sup className="text-[#3B9B7F]">[1]</sup> + 207M creators<sup className="text-[#3B9B7F]">[17]</sup> = $1+ trillion borderless economy
              </p>
            </div>
          </div>

          {/* AI Acceleration */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">AI Changed The Game (2023-2025)</h3>

            <p className="text-lg text-gray-700 mb-8">
              AI didn't just make businesses more efficient—it fundamentally changed what one person can accomplish.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-5xl font-bold text-gray-900 mb-2">68%<sup className="text-[#3B9B7F] text-xl">[2]</sup></div>
                <p className="text-gray-700">of small businesses use AI</p>
                <p className="text-sm text-gray-500 mt-1">Up from ~20% in 2023</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-gray-900 mb-2">$53B<sup className="text-[#3B9B7F] text-xl">[18]</sup></div>
                <p className="text-gray-700">AI agents market by 2030</p>
                <p className="text-sm text-gray-500 mt-1">From $5.25B in 2024</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-gray-900 mb-2">91%<sup className="text-[#3B9B7F] text-xl">[19]</sup></div>
                <p className="text-gray-700">report revenue boost with AI</p>
                <p className="text-sm text-gray-500 mt-1">90% more efficient ops</p>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-300 rounded-r-lg p-6">
              <p className="text-gray-800 leading-relaxed">
                <strong>What this means:</strong> One person with ChatGPT, Midjourney, and Cursor can now compete with traditional teams. Customer support 24/7. Marketing campaigns at scale. Code generation. Data analysis. All automated.
              </p>
            </div>
          </div>

          {/* The Paradox */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50 border-l-4 border-rose-500 rounded-r-lg p-8 my-12">
            <h3 className="text-2xl font-bold text-rose-900 mb-4">The Income Verification Paradox</h3>
            <p className="text-lg text-gray-800 mb-6">
              Platform income is <em>more verifiable</em> than traditional employment. Yet banks won't accept it.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-[#3B9B7F] rounded-full"></div>
                  <h4 className="font-bold text-gray-900">Platform Income (Verifiable)</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Shopify/Square: Real-time sales, refund rates, trends</li>
                  <li>✓ Upwork/Fiverr: Client ratings, earnings, completion rate</li>
                  <li>✓ Stripe: Payment volumes, retention, MRR growth</li>
                  <li>✓ On-chain: Wallet transactions, DAO payments</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <h4 className="font-bold text-gray-900">Traditional (Banks Require)</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✗ W-2 forms: Once per year, 12-month lag</li>
                  <li>✗ Tax returns: Filed 3-15 months after year end</li>
                  <li>✗ Pay stubs: Don't exist for platform workers</li>
                  <li>✗ Employment letter: N/A for self-employed</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Wave 2: Finance Couldn't Adapt */}
        <section className="mb-20 pb-20 border-b-4 border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg">
              Wave 2
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Finance Couldn't Adapt</h2>
          </div>

          {/* The Gap - Big numbers */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">The Numbers Tell The Story</h3>

            <div className="space-y-8 mb-12">
              <div className="flex items-baseline gap-6">
                <div className="text-6xl font-bold text-gray-900 w-32">77%<sup className="text-[#3B9B7F] text-2xl">[3]</sup></div>
                <div className="flex-1">
                  <p className="text-xl text-gray-700">of small businesses struggle to access capital</p>
                  <p className="text-sm text-gray-500 mt-1">Goldman Sachs Survey, 2024</p>
                </div>
              </div>

              <div className="flex items-baseline gap-6">
                <div className="text-6xl font-bold text-gray-900 w-32">1/4<sup className="text-[#3B9B7F] text-2xl">[4]</sup></div>
                <div className="flex-1">
                  <p className="text-xl text-gray-700">rejected for loans they could actually repay</p>
                  <p className="text-sm text-gray-500 mt-1">National Small Business Association</p>
                </div>
              </div>

              <div className="flex items-baseline gap-6">
                <div className="text-6xl font-bold text-gray-900 w-32">$5T<sup className="text-[#3B9B7F] text-2xl">[20]</sup></div>
                <div className="flex-1">
                  <p className="text-xl text-gray-700">estimated global capital gap for small businesses annually</p>
                  <p className="text-sm text-gray-500 mt-1">US Treasury Department, 2025</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8">
              <p className="font-bold text-lg mb-3 text-gray-900">US Treasury Department (January 2025):</p>
              <ul className="space-y-2 text-gray-700">
                <li>"Gaps in capital providers' knowledge of small business creditworthiness"</li>
                <li>"Limited connection to small business capital sources"</li>
                <li>"Lack of trust in capital providers by groups historically subject to discrimination"</li>
              </ul>
            </div>
          </div>

          {/* Two Attempts to Fill the Gap */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Two Different Attempts to Fill the Gap</h3>

            {/* Embedded Lenders: Successful but Gatekept */}
            <div className="mb-12">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Embedded Lenders: Successful, But Selective & Expensive</h4>

              <p className="text-lg text-gray-700 mb-6">
                Platform lenders like Shopify, Stripe, and PayPal <strong>solved</strong> underwriting by controlling payment rails—they see every transaction and auto-deduct repayments. It works. Merchants funded by Shopify Capital see 36% higher sales growth<sup className="text-[#3B9B7F]">[35]</sup>. But they're gatekept and costly:
              </p>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-[#3B9B7F] rounded-r-lg p-6 mb-6">
                <h5 className="font-bold text-[#065F46] mb-3">Why embedded lending works:</h5>
                <ul className="space-y-2 text-sm text-gray-800">
                  <li>✓ <strong>Control payment rails</strong>: Auto-deduct before merchant receives funds—revenue can't be diverted</li>
                  <li>✓ <strong>Complete data visibility</strong>: See 100% of on-platform transactions in real-time</li>
                  <li>✓ <strong>Cherry-pick winners</strong>: Only invite merchants with proven sales history (PayPal requires $15K+ annual sales<sup className="text-[#3B9B7F]">[36]</sup>)</li>
                  <li>✓ <strong>Low customer acquisition cost</strong>: Merchants already on platform</li>
                </ul>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Platform</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Eligibility</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">APR</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-semibold">Shopify Capital<sup className="text-[#3B9B7F]">[30]</sup></td>
                      <td className="py-4 px-4">Invite-only, 90+ days selling</td>
                      <td className="py-4 px-4"><span className="font-bold text-rose-600">20-50%</span></td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-semibold">Stripe Capital<sup className="text-[#3B9B7F]">[31]</sup></td>
                      <td className="py-4 px-4">Invite-only, high processing volume</td>
                      <td className="py-4 px-4"><span className="font-bold text-rose-600">10-45%</span></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">PayPal Working Capital<sup className="text-[#3B9B7F]">[32]</sup></td>
                      <td className="py-4 px-4">$15K-$20K min. annual sales</td>
                      <td className="py-4 px-4"><span className="font-bold text-rose-600">10-18%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 italic">
                <strong>The problem:</strong> Gatekept to platform users only. If you sell on multiple channels, work freelance, or earn through platforms these lenders don't integrate with, you're excluded.
              </p>
            </div>

            {/* Standalone RBF: Spectacular Failures */}
            <div className="mb-12">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Standalone Revenue-Based Financing: Spectacular Failures</h4>

              <p className="text-lg text-gray-700 mb-6">
                Standalone lenders (Clearco, Wayflyer, Pipe, Uncapped) tried to offer RBF <em>without</em> controlling payment rails. The model collapsed across the board:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border-2 border-rose-200 rounded-lg p-5">
                  <h5 className="font-bold text-rose-700 mb-2">Clearco<sup className="text-[#3B9B7F]">[37]</sup></h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 90% valuation wipeout ($2B → $200M)</li>
                    <li>• CEO resigned, 500 → 140 employees</li>
                    <li>• "Still unprofitable due to cost of capital and default rates"</li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-rose-200 rounded-lg p-5">
                  <h5 className="font-bold text-rose-700 mb-2">Wayflyer<sup className="text-[#3B9B7F]">[38]</sup></h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• €40.9M operating loss (2023)</li>
                    <li>• Cut 200 jobs (2022)</li>
                    <li>• "Monthly profitability" = one month, Oct 2023</li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-rose-200 rounded-lg p-5">
                  <h5 className="font-bold text-rose-700 mb-2">Pipe<sup className="text-[#3B9B7F]">[39]</sup></h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• All co-founders resigned (Nov 2022)</li>
                    <li>• Pivoted away from core RBF model</li>
                    <li>• "Model faltered when expanding into riskier segments"</li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-rose-200 rounded-lg p-5">
                  <h5 className="font-bold text-rose-700 mb-2">Uncapped<sup className="text-[#3B9B7F]">[40]</sup></h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Completely stopped offering RBF (2023)</strong></li>
                    <li>• "RBF loans are not the best funding product"</li>
                    <li>• Switched to fixed-term loans</li>
                  </ul>
                </div>
              </div>

              <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-lg p-6">
                <h5 className="font-bold text-rose-900 mb-3">Why standalone RBF failed:</h5>
                <div className="space-y-3 text-gray-800">
                  <p>
                    <strong>1. Moral hazard & revenue diversion:</strong> Harvard research on South African RBF found firms process 16% less revenue through monitored platforms after taking financing<sup className="text-[#3B9B7F]">[41]</sup>. Borrowers route sales through unmonitored channels—cash, alternative payment processors, different bank accounts. Auto-deduction only works on revenue you can see.
                  </p>
                  <p>
                    <strong>2. Selection problem:</strong> Can't cherry-pick like embedded lenders. Need volume to justify infrastructure costs. End up lending to riskier borrowers banks reject.
                  </p>
                  <p>
                    <strong>3. High capital costs:</strong> VC-backed companies need 20%+ returns. Debt financing at 8-15%. Even at 20-50% APR, "cost of capital + default rates = unprofitable."
                  </p>
                  <p className="italic pt-2">
                    → <strong>Same repayment structure (% of revenue), opposite outcomes.</strong> Embedded = works. Standalone = fails.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wave 3: Infrastructure Arrived */}
        <section className="mb-20 pb-20 border-b-4 border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg">
              Wave 3
            </div>
            <h2 className="text-3xl font-bold text-gray-900">The Infrastructure Arrived</h2>
          </div>

          {/* Stablecoins */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Stablecoins Reached Scale</h3>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 border border-blue-200">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-gray-900 mb-2">$305B<sup className="text-[#3B9B7F] text-xl">[5]</sup></div>
                  <p className="text-gray-700 font-semibold">Total stablecoin supply</p>
                  <p className="text-sm text-gray-600 mt-1">USDC, USDT, others</p>
                </div>
                <div>
                  <div className="text-5xl font-bold text-gray-900 mb-2">$28T<sup className="text-[#3B9B7F] text-xl">[5]</sup></div>
                  <p className="text-gray-700 font-semibold">Transfer volume (2024)</p>
                  <p className="text-sm text-gray-600 mt-1">Surpassed Visa + Mastercard</p>
                </div>
                <div>
                  <div className="text-5xl font-bold text-gray-900 mb-2">80%<sup className="text-[#3B9B7F] text-xl">[22]</sup></div>
                  <p className="text-gray-700 font-semibold">Lower costs vs traditional</p>
                  <p className="text-sm text-gray-600 mt-1">Especially cross-border</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Major institutions are adopting:</strong> Visa launching stablecoin prefunding (April 2026)<sup className="text-[#3B9B7F]">[23]</sup>, Zelle cross-border initiative<sup className="text-[#3B9B7F]">[24]</sup>, Remitly integration<sup className="text-[#3B9B7F]">[25]</sup>, plus Coinbase, PayPal, and Stripe all pushing mass adoption.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Why this matters for lending:</strong> Instant settlement. 24/7 availability. Programmable repayment. Global reach. Transparent on-chain verification. All the infrastructure needed for uncollateralized lending at scale.
              </p>
            </div>
          </div>

          {/* DeFi */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">DeFi Proved The Technical Model</h3>

            <div className="space-y-6 mb-8">
              <div className="flex gap-6 items-start">
                <div className="text-3xl font-bold text-gray-900 min-w-[120px]">$562M<sup className="text-[#3B9B7F] text-lg">[27]</sup></div>
                <div>
                  <p className="font-semibold text-gray-900">Maple Finance</p>
                  <p className="text-gray-600">1,600% growth from 2023. Institutional focus with credit delegators.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="text-3xl font-bold text-gray-900 min-w-[120px]">$110M<sup className="text-[#3B9B7F] text-lg">[28]</sup></div>
                <div>
                  <p className="font-semibold text-gray-900">Goldfinch</p>
                  <p className="text-gray-600">Financed across 20+ countries. Emerging markets focus.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="text-3xl font-bold text-gray-900 min-w-[120px]">$50B<sup className="text-[#3B9B7F] text-lg">[6]</sup></div>
                <div>
                  <p className="font-semibold text-gray-900">Overall DeFi</p>
                  <p className="text-gray-600">Collateralized lending TVL. Proven technical model at scale.</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 italic bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300">
              DeFi proved lending works technically. The missing piece: scaling to individuals with social trust + cashflow.
            </p>
          </div>

          {/* Social Verification */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Social Verification Scaled</h3>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Farcaster</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• 500K+ users with wallet-based identity</li>
                  <li>• Open social graph (no API gatekeeping)</li>
                  <li>• Power Badge Sybil resistance</li>
                  <li>• Frames enable native lending UX</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Bluesky (AT Protocol)</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• 20M+ users (rapid 2024-2025 growth)</li>
                  <li>• Domain verification (handle = owned domain)</li>
                  <li>• Portable social graph you own</li>
                  <li>• Composable reputation across apps</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <strong>The breakthrough:</strong> For the first time, we can quantify social trust at scale without centralized gatekeepers. Banks don't have social graphs. DeFi doesn't have persistent identity. We combine both.
            </p>
          </div>

          {/* The Convergence */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-10 mb-8">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-900">The Convergence: Now</h3>
            <p className="text-xl text-center mb-8 text-gray-700">
              All infrastructure pieces exist for the first time in 2025
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 border border-rose-200">
                <h4 className="font-bold text-rose-700 mb-3">Why we couldn't build this in 2020:</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✗ Stablecoins &lt;$10B supply</li>
                  <li>✗ DeFi uncollateralized lending unproven</li>
                  <li>✗ No decentralized social graphs at scale</li>
                  <li>✗ Platform APIs immature</li>
                  <li>✗ Crypto UX too complex</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 border border-green-200">
                <h4 className="font-bold text-[#2E7D68] mb-3">Why we can build this now (2025):</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Stablecoins $305B supply, mainstream</li>
                  <li>✓ $50B collateralized DeFi, proven model</li>
                  <li>✓ Farcaster, Bluesky providing verification</li>
                  <li>✓ Mature cashflow APIs</li>
                  <li>✓ Account abstraction enabling better UX</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* LendFriend Solution */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">LendFriend Bridges the Gap</h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-2xl text-gray-700 leading-relaxed">
                We exist because all three waves converged
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl mb-3">🌊</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wave 1: Global Work</h3>
              <p className="text-gray-600">We verify platform income banks can't see</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🌊</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wave 2: Capital Gap</h3>
              <p className="text-gray-600">We fill the $5T funding gap fairly</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🌊</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Wave 3: Infrastructure</h3>
              <p className="text-gray-600">We combine all the pieces</p>
            </div>
          </div>

          {/* Why We Succeed Where Standalone RBF Failed */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-[#3B9B7F] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-[#2E7D68] mb-6">Why LendFriend Succeeds Where Standalone RBF Failed</h3>

              <div className="space-y-6 text-gray-700">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">We Solve the Revenue Diversion Problem Differently</h4>
                  <p className="mb-3">
                    Standalone RBF lenders failed because borrowers could route sales through unmonitored channels. Embedded lenders solved this by controlling payment rails, but gatekept access to one platform.
                  </p>
                  <p className="font-semibold text-[#065F46]">
                    → LendFriend uses <strong>social accountability</strong> instead of payment control:
                  </p>
                  <ul className="mt-2 space-y-2 ml-4">
                    <li>✓ <strong>Reputation on the line:</strong> Public, on-chain loan history. Default = visible to your entire social graph</li>
                    <li>✓ <strong>Community vouching:</strong> People who know you contribute. They trust you'll repay</li>
                    <li>✓ <strong>Transparent repayment:</strong> All transactions on-chain. Can't hide from lenders</li>
                    <li>✓ <strong>Future opportunities:</strong> Building reputation unlocks larger loans, better terms, and DeFi access</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">We Combine Embedded + Standalone Advantages</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="font-semibold text-gray-900 mb-2">Like Embedded Lenders:</p>
                      <ul className="text-sm space-y-1">
                        <li>✓ Verify platform income (Shopify, Upwork, Stripe APIs)</li>
                        <li>✓ Real-time cashflow data</li>
                        <li>✓ Can assess creditworthiness banks can't</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="font-semibold text-gray-900 mb-2">Like Standalone (But Better):</p>
                      <ul className="text-sm space-y-1">
                        <li>✓ Work across ALL platforms, not gatekept</li>
                        <li>✓ Available to freelancers, multi-channel sellers</li>
                        <li>✓ Don't exclude based on which payment processor you use</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">We Have Structural Cost Advantages</h4>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-bold">Cost Factor</th>
                          <th className="text-left py-2 font-bold">Standalone RBF</th>
                          <th className="text-left py-2 font-bold text-[#2E7D68]">LendFriend</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Capital Source</td>
                          <td className="py-2">VC equity (20%+ returns needed)</td>
                          <td className="py-2 text-[#065F46] font-semibold">Community (0% initially)</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Payment Rails</td>
                          <td className="py-2">ACH ($0.10-$0.50/tx, 1-3 days)</td>
                          <td className="py-2 text-[#065F46] font-semibold">Stablecoins (pennies, instant)</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Customer Acquisition</td>
                          <td className="py-2">Marketing, sales team</td>
                          <td className="py-2 text-[#065F46] font-semibold">Viral social sharing</td>
                        </tr>
                        <tr>
                          <td className="py-2">Underwriting</td>
                          <td className="py-2">Manual review, risk models</td>
                          <td className="py-2 text-[#065F46] font-semibold">Algorithmic social trust + platform data</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-[#3B9B7F]">
                  <p className="text-lg font-bold text-gray-900 mb-3">The Key Insight:</p>
                  <p className="text-gray-800 leading-relaxed">
                    Standalone RBF tried to replace <em>payment control</em> with bank account monitoring. It didn't work. We replace payment control with <strong>social accountability</strong> and <strong>reputation incentives</strong>. Borrowers repay not because we control their money, but because defaulting is <em>publicly visible</em> and destroys future access to capital.
                  </p>
                  <p className="text-gray-800 mt-4 font-semibold">
                    → This is only possible because Wave 3 gave us on-chain transparency + decentralized social graphs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 prose prose-lg max-w-none">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mt-0 mb-4">What makes this moment unique</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>Market size:</strong> 1.6B gig workers + 207M creators = addressable market orders of magnitude larger than 2020</li>
                <li><strong>Infrastructure maturity:</strong> Every component needed exists and is proven at scale</li>
                <li><strong>User readiness:</strong> 68% of SMBs using AI shows comfort with new-economy tech</li>
                <li><strong>Competitive void:</strong> Banks retreating, DeFi stuck on overcollateralization</li>
                <li><strong>Regulatory momentum:</strong> Stablecoin frameworks maturing, legitimizing crypto-native finance</li>
              </ol>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-[#3B9B7F] rounded-lg p-8">
              <h3 className="text-xl font-bold text-[#2E7D68] mt-0 mb-4">The 10-Year Vision</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Today:</strong> Build uncollateralized lending infrastructure for the new economy</p>
                <p><strong>2027-2030:</strong> On-chain credit scores become portable across all DeFi protocols</p>
                <p><strong>2030-2035:</strong> Reputation-backed credit becomes a Web3 primitive, like tokens or NFTs</p>
                <p className="text-xl font-bold text-[#2E7D68] pt-4">
                  → End state: Uncollateralized lending is infrastructure, not just a product
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* References - Compact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">References</h2>
          <div className="bg-gray-50 rounded-lg p-6 text-xs">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {[
                { id: 1, title: "Gig Economy Statistics (2025)", url: "https://www.demandsage.com/gig-economy-statistics/" },
                { id: 2, title: "Small Business AI Adoption (2025)", url: "https://www.foxbusiness.com/economy/small-business-ai-adoption-jumps-68-owners-plan-significant-workforce-growth-2025" },
                { id: 3, title: "Small Business Capital Access (2024)", source: "Goldman Sachs Survey" },
                { id: 4, title: "Small Business Funding Gap", url: "https://www.nsba.biz/" },
                { id: 5, title: "Stablecoin Market Data", url: "https://paymentscmi.com/insights/stablecoins-cross-border-payments-banks-strategy/" },
                { id: 6, title: "DeFi Collateralized Lending TVL", url: "https://coinlaw.io/crypto-lending-and-borrowing-statistics/" },
                { id: 7, title: "Upwork Financial Data", url: "https://investors.upwork.com/" },
                { id: 8, title: "Fiverr Platform Statistics", url: "https://investors.fiverr.com/" },
                { id: 9, title: "Shopify Merchant Count", url: "https://investors.shopify.com/" },
                { id: 10, title: "Etsy Seller Statistics", url: "https://investors.etsy.com/" },
                { id: 11, title: "Amazon Third-Party Sellers", url: "https://www.amazon.com/b?node=18190131" },
                { id: 12, title: "YouTube Creator Payments", url: "https://blog.youtube/" },
                { id: 13, title: "Substack Paid Subscriptions", url: "https://substack.com/" },
                { id: 14, title: "Patreon Creator Earnings", url: "https://www.patreon.com/about" },
                { id: 15, title: "Uber/Lyft Driver Count", source: "Gig Economy Market Reports" },
                { id: 16, title: "DoorDash Dasher Count", url: "https://ir.doordash.com/" },
                { id: 17, title: "Creator Economy Statistics", url: "https://simplebeen.com/creator-economy-statistics/" },
                { id: 18, title: "AI Agents Market Growth", url: "https://www.businessresearchinsights.com/" },
                { id: 19, title: "AI Business Impact", url: "https://colorwhistle.com/artificial-intelligence-statistics-for-small-business/" },
                { id: 20, title: "US Treasury Report (2025)", url: "https://home.treasury.gov/system/files/136/Financing-Small-Business-Landscape-and-Recommendations.pdf" },
                { id: 21, title: "Payday Loan Statistics", url: "https://www.consumerfinance.gov/data-research/research-reports/payday-loans-and-deposit-advance-products/" },
                { id: 22, title: "Stablecoin Cost Savings", url: "https://bvnk.com/blog/blockchain-cross-border-payments" },
                { id: 23, title: "Visa Stablecoin Initiative", url: "https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21696.html" },
                { id: 24, title: "Zelle Cross-Border", url: "https://www.prnewswire.com/news-releases/zelle-goes-international-early-warning-expands-1t-payments-network-with-stablecoin-initiative-302593440.html" },
                { id: 25, title: "Remitly Stablecoin", url: "https://news.remitly.com/innovation/remitly-harnesses-stablecoins/" },
                { id: 27, title: "Maple Finance Growth", url: "https://www.reflexivityresearch.com/all-reports/a-look-into-on-chain-lending-and-under-collateralized-loans" },
                { id: 28, title: "Goldfinch Emerging Markets", url: "https://www.coingecko.com/research/publications/undercollateralized-loans-the-future-of-defi-lending" },
                { id: 29, title: "Flash Loan Statistics", url: "https://www.bankofcanada.ca/wp-content/uploads/2025/03/sdp2025-6.pdf" },
                { id: 30, title: "Shopify Capital Rates", url: "https://www.hulkapps.com/blogs/shopify-hub/understanding-shopify-capital-loan-interest-rate-a-comprehensive-guide" },
                { id: 31, title: "Stripe Capital Costs", url: "https://www.unitedcapitalsource.com/business-loans/lender-reviews/stripe-capital-review/" },
                { id: 32, title: "PayPal Business Loans", url: "https://www.unitedcapitalsource.com/business-loans/lender-reviews/paypal-working-capital-review/" },
                { id: 33, title: "Fintech Cost Structure", url: "https://www.brytsoftware.com/how-fintech-solutions-reduce-cost-of-capital-in-consumer-lending/" },
                { id: 34, title: "Merchant Cash Advance Costs", url: "https://shieldfunding.com/merchant-cash-advance/true-costs-mca/" },
                { id: 35, title: "Shopify Capital Impact on Merchant Growth", url: "https://www.shopify.com/blog/capital-effect-on-business-growth" },
                { id: 36, title: "PayPal Working Capital Eligibility Requirements", url: "https://www.paypal.com/us/business/financial-services/working-capital-loan" },
                { id: 37, title: "Clearco Recapitalization and Valuation Collapse", url: "https://betakit.com/clearco-secures-new-equity-financing-from-existing-investors-and-an-asset-backed-facility-as-struggling-fintech-executes-complex-recapitalization-plan/" },
                { id: 38, title: "Wayflyer Financial Performance and Losses", url: "https://www.irishtimes.com/business/2024/11/26/wayflyer-sees-losses-narrow-amid-efficiency-drive/" },
                { id: 39, title: "Pipe Co-founders Resignation and Pivot", url: "https://davefriedman.substack.com/p/what-happened-at-pipe" },
                { id: 40, title: "Uncapped Discontinues Revenue-Based Financing", url: "https://www.weareuncapped.com/blog/uncapped-remove-rbf-offering" },
                { id: 41, title: "Revenue-Based Financing: Moral Hazard and Adverse Selection", source: "Russel, D., Shi, C., Clarke, R. (2023). Harvard Business School Working Paper" },
              ].map((ref) => (
                <div key={ref.id} id={`ref${ref.id}`} className="scroll-mt-20">
                  <span className="font-semibold text-gray-900">[{ref.id}]</span>{' '}
                  <span className="text-gray-700">{ref.title}</span>
                  {ref.url && (
                    <>
                      {' '}
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-[#3B9B7F] hover:text-[#2E7D68]">
                        ↗
                      </a>
                    </>
                  )}
                  {ref.source && <span className="text-gray-600"> - {ref.source}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">This Is The Moment</h2>
            <p className="text-2xl mb-8 opacity-95 max-w-2xl mx-auto">
              Three waves converged. The infrastructure exists. The market is ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/vision"
                className="inline-block px-10 py-4 bg-white text-[#3B9B7F] font-bold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 text-lg shadow-lg"
              >
                Read Our Vision
              </Link>
              <Link
                href="/"
                className="inline-block px-10 py-4 bg-transparent text-white font-bold rounded-lg hover:bg-white/10 transition-all border-2 border-white/30 text-lg"
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
