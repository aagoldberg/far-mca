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

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              <span className="font-bold text-[#2E7D68]">Wave 1 (2010-2025):</span> Platforms like Upwork, Shopify, and YouTube created a $1+ trillion global economy. 1.6 billion people now earn income borderlessly<sup className="text-[#3B9B7F]">[1]</sup>. AI accelerated this—68% of small businesses use AI in 2025<sup className="text-[#3B9B7F]">[2]</sup>. But banks can't underwrite platform income.
            </p>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              <span className="font-bold text-rose-600">Wave 2 (2020-2025):</span> Banks reject 1 in 4 borrowers<sup className="text-[#3B9B7F]">[4]</sup>—not because they can't repay, but because traditional underwriting can't process platform income. 77% of small businesses struggle to access capital<sup className="text-[#3B9B7F]">[3]</sup>. Platform lenders solved underwriting but charge 20-50% APR due to infrastructure costs.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              <span className="font-bold text-blue-700">Wave 3 (2024-2025):</span> Stablecoins hit $305B supply with $27.6T in transfers<sup className="text-[#3B9B7F]">[5]</sup> (surpassing Visa + Mastercard). DeFi proved the technical model works ($50B TVL)<sup className="text-[#3B9B7F]">[6]</sup>. Social protocols scaled to millions. All the pieces exist to bridge the gap.
            </p>
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

          {/* Platform Lenders - Table */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Platform Lenders: Progress, But Expensive</h3>
            <p className="text-lg text-gray-700 mb-8">
              Shopify, Stripe, and PayPal <strong>can</strong> assess cashflow—they see every transaction. But infrastructure costs keep rates high:
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Platform</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Cost Structure</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">APR Equivalent</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4 font-semibold">Shopify Capital<sup className="text-[#3B9B7F]">[30]</sup></td>
                    <td className="py-4 px-4">Factor rates 1.1-1.13</td>
                    <td className="py-4 px-4"><span className="font-bold text-amber-600">20-50%</span></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4 font-semibold">Stripe Capital<sup className="text-[#3B9B7F]">[31]</sup></td>
                    <td className="py-4 px-4">Factor rates 1.06-1.20</td>
                    <td className="py-4 px-4"><span className="font-bold text-amber-600">10-45%</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold">PayPal Business<sup className="text-[#3B9B7F]">[32]</sup></td>
                    <td className="py-4 px-4">Fixed fees, 17-52 weeks</td>
                    <td className="py-4 px-4"><span className="font-bold text-amber-600">10-18%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-lg p-6">
              <h4 className="font-bold text-rose-900 mb-3">Why costs stay high:<sup className="text-[#3B9B7F]">[33]</sup></h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-800">
                <div>
                  <p className="font-semibold mb-1">Capital Costs</p>
                  <p>Debt at 8-15%<br />VC equity needs 20%+ returns</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Payment Rails</p>
                  <p>ACH: $0.10-$0.50/transaction<br />1-3 day settlement</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Operations</p>
                  <p>$500K-$2.5M to launch<br />$200K-$500K/year ongoing</p>
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

          <div className="grid md:grid-cols-3 gap-8 mb-12">
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
