'use client';

import Link from 'next/link';

export default function EconomicContextPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bridging the Capital Gap
          </h1>
          <p className="text-xl md:text-2xl font-light">
            How we got here—and why crypto infrastructure finally solves it
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-6 py-12">

        {/* Intro */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-xl p-8">
            <p className="text-2xl text-gray-900 font-bold mb-4">
              The gap between where people earn and where they can borrow has never been wider:
            </p>
            <div className="space-y-3 text-lg text-gray-700">
              <p>
                <strong className="text-blue-600">Wave 1 (2010-2025): A new economy emerged.</strong> Platforms like Upwork, Shopify, and YouTube created a $1+ trillion global economy. 1.6 billion people now earn income borderlessly<a href="#ref1" className="text-blue-600 hover:text-blue-800"><sup>[1]</sup></a>. AI accelerated this: 68% of small businesses use AI in 2025<a href="#ref2" className="text-blue-600 hover:text-blue-800"><sup>[2]</sup></a>, enabling solo entrepreneurs to run $50K-$500K businesses. But traditional banks can't underwrite platform income.
              </p>
              <p>
                <strong className="text-red-600">Wave 2 (2020-2025): Finance couldn't adapt.</strong> Banks reject 1 in 4 borrowers<a href="#ref4" className="text-blue-600 hover:text-blue-800"><sup>[4]</sup></a>—not because they can't repay, but because traditional underwriting can't process platform income. 77% of small businesses struggle to access capital<a href="#ref3" className="text-blue-600 hover:text-blue-800"><sup>[3]</sup></a>. Platform lenders (Shopify, Stripe, PayPal) solved underwriting but charge 20-50% APR due to ACH rails, VC capital costs, and operational overhead. The gap: affordable credit for the new economy.
              </p>
              <p>
                <strong className="text-green-600">Wave 3 (2024-2025): The infrastructure arrived.</strong> Stablecoins hit $305B supply with $27.6T in transfers<a href="#ref5" className="text-blue-600 hover:text-blue-800"><sup>[5]</sup></a> (surpassing Visa + Mastercard). DeFi collateralized lending proved the technical model works ($50B TVL, &lt;5% defaults)<a href="#ref6" className="text-blue-600 hover:text-blue-800"><sup>[6]</sup></a>. Social verification protocols scaled to billions of users. For the first time, all the pieces exist to bridge the gap with uncollateralized lending at 8-15% APR.
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-6">
              LendFriend bridges the gap.
            </p>
          </div>
        </section>

        {/* Wave 1: Work Went Global */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
              Wave 1
            </div>
            <h2 className="text-3xl font-bold text-blue-900">A New Economy Emerged (2010-2025)</h2>
          </div>

          <div className="space-y-8">
            {/* The Platforms Emerged */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Platforms Emerged</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Over the past 15 years, digital platforms fundamentally transformed how people earn income. What started as
                  niche marketplaces became the backbone of a new global economy.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h4 className="font-bold text-blue-900 mb-3">Freelance Platforms</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>Upwork</strong>: $3.8B+ in annual gross services volume<a href="#ref7" className="text-blue-600 hover:text-blue-800"><sup>[7]</sup></a></li>
                      <li>• <strong>Fiverr</strong>: 4.1M active buyers, 830K sellers<a href="#ref8" className="text-blue-600 hover:text-blue-800"><sup>[8]</sup></a></li>
                      <li>• <strong>Toptal</strong>: Elite freelance talent at scale</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h4 className="font-bold text-green-900 mb-3">E-commerce Platforms</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>Shopify</strong>: 4.8M+ merchants globally<a href="#ref9" className="text-blue-600 hover:text-blue-800"><sup>[9]</sup></a></li>
                      <li>• <strong>Etsy</strong>: 9.7M active sellers<a href="#ref10" className="text-blue-600 hover:text-blue-800"><sup>[10]</sup></a></li>
                      <li>• <strong>Amazon FBA</strong>: 2M+ third-party sellers<a href="#ref11" className="text-blue-600 hover:text-blue-800"><sup>[11]</sup></a></li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                    <h4 className="font-bold text-purple-900 mb-3">Creator Platforms</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>YouTube</strong>: $15B+ paid to creators (2019-2021)<a href="#ref12" className="text-blue-600 hover:text-blue-800"><sup>[12]</sup></a></li>
                      <li>• <strong>Substack</strong>: 2M+ paid subscriptions<a href="#ref13" className="text-blue-600 hover:text-blue-800"><sup>[13]</sup></a></li>
                      <li>• <strong>Patreon</strong>: $3.5B+ paid to creators<a href="#ref14" className="text-blue-600 hover:text-blue-800"><sup>[14]</sup></a></li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <h4 className="font-bold text-amber-900 mb-3">Gig Platforms</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>Uber/Lyft</strong>: 5M+ active drivers<a href="#ref15" className="text-blue-600 hover:text-blue-800"><sup>[15]</sup></a></li>
                      <li>• <strong>DoorDash</strong>: 6M+ dashers<a href="#ref16" className="text-blue-600 hover:text-blue-800"><sup>[16]</sup></a></li>
                      <li>• <strong>TaskRabbit</strong>: On-demand services globally</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-100 border border-blue-300 rounded-lg p-5">
                  <p className="text-blue-900 font-semibold text-center text-lg">
                    Result: 1.6 billion people earning globally through gig platforms<a href="#ref1" className="text-blue-600 hover:text-blue-800"><sup>[1]</sup></a> + 207 million content creators<a href="#ref17" className="text-blue-600 hover:text-blue-800"><sup>[17]</sup></a> = over $1 trillion in borderless income
                  </p>
                </div>
              </div>
            </div>

            {/* The AI Acceleration */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The AI Acceleration (2023-2025)</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  AI didn't just make existing businesses more efficient—it fundamentally changed what one person can accomplish.
                  The solo entrepreneur with AI agents can now compete with traditional 10-person teams.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">68%<a href="#ref2" className="text-blue-600 hover:text-blue-800"><sup>[2]</sup></a></div>
                    <div className="text-sm text-gray-700">of small businesses use AI (2025)</div>
                    <div className="text-xs text-gray-500 mt-2">Up from ~20% in 2023</div>
                  </div>
                  <div className="text-center p-5 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">$52.6B<a href="#ref18" className="text-blue-600 hover:text-blue-800"><sup>[18]</sup></a></div>
                    <div className="text-sm text-gray-700">AI agents market by 2030</div>
                    <div className="text-xs text-gray-500 mt-2">From $5.25B in 2024</div>
                  </div>
                  <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">91%<a href="#ref19" className="text-blue-600 hover:text-blue-800"><sup>[19]</sup></a></div>
                    <div className="text-sm text-gray-700">of SMBs with AI report revenue boost</div>
                    <div className="text-xs text-gray-500 mt-2">90% more efficient operations</div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <h4 className="font-bold text-gray-900 mb-3">What AI Enables:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✓ Customer support: ChatGPT, Claude handle 24/7 inquiries</li>
                      <li>✓ Content creation: Midjourney, DALL-E for visuals</li>
                      <li>✓ Code generation: Copilot, Cursor for development</li>
                    </ul>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✓ Marketing automation: Copy.ai, Jasper for campaigns</li>
                      <li>✓ Data analysis: AI-powered insights and reporting</li>
                      <li>✓ Operations: Inventory, scheduling, bookkeeping</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* The Income Verification Problem */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Income Verification Problem</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Here's the paradox: Platform income is <em>more</em> verifiable than traditional employment, yet banks won't accept it.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5">
                    <h4 className="font-bold text-green-900 mb-3">Platform Income (Verifiable)</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✓ <strong>Shopify/Square</strong>: Real-time sales data, refund rates, trends</li>
                      <li>✓ <strong>Upwork/Fiverr</strong>: Client ratings, earnings history, completion rate</li>
                      <li>✓ <strong>Stripe</strong>: Payment volumes, customer retention, MRR growth</li>
                      <li>✓ <strong>On-chain</strong>: Wallet transactions, DAO payments, protocol fees</li>
                    </ul>
                    <p className="text-xs text-green-800 mt-3 italic">All verifiable via OAuth APIs in real-time</p>
                  </div>

                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5">
                    <h4 className="font-bold text-red-900 mb-3">Traditional Income (Banks Require)</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✗ <strong>W-2 forms</strong>: Only issued once per year, 12-month lag</li>
                      <li>✗ <strong>Tax returns</strong>: Filed 3-15 months after year ends</li>
                      <li>✗ <strong>Pay stubs</strong>: Don't exist for platform workers</li>
                      <li>✗ <strong>Employment letter</strong>: N/A for self-employed</li>
                    </ul>
                    <p className="text-xs text-red-800 mt-3 italic">Outdated data that doesn't reflect current reality</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mt-4">
                  <p className="text-sm text-amber-900">
                    <strong>The gap:</strong> Banks built underwriting for W-2 economy. Won't adapt to platform economy.
                    This creates massive opportunity for new underwriting infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wave 2: Capital Didn't Follow */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
              Wave 2
            </div>
            <h2 className="text-3xl font-bold text-red-900">Finance Couldn't Adapt (2020-2025)</h2>
          </div>

          <div className="space-y-8">
            {/* The Growing Gap */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Growing Gap</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  As the new economy grew 15-20% annually, traditional lending contracted. The COVID-19 pandemic accelerated
                  platform adoption but also made banks more risk-averse. The gap widened dramatically.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">By the Numbers (2025)</h4>
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-red-600">77%<a href="#ref3" className="text-blue-600 hover:text-blue-800"><sup>[3]</sup></a></div>
                        <div className="text-sm text-gray-700">of small businesses struggle with capital access</div>
                        <div className="text-xs text-gray-500 mt-1">Source: Goldman Sachs Survey (2024)</div>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-red-600">1 in 4<a href="#ref4" className="text-blue-600 hover:text-blue-800"><sup>[4]</sup></a></div>
                        <div className="text-sm text-gray-700">rejected for loans they could repay</div>
                        <div className="text-xs text-gray-500 mt-1">Source: National Small Business Association</div>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-3xl font-bold text-red-600">70%<a href="#ref3" className="text-blue-600 hover:text-blue-800"><sup>[3]</sup></a></div>
                        <div className="text-sm text-gray-700">have less than 4 months operating cash</div>
                        <div className="text-xs text-gray-500 mt-1">Source: Goldman Sachs Survey (2024)</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">The Capital Gap</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Estimated global capital gap for small businesses: $5+ trillion annually</strong>
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Traditional banks: declining small business lending</li>
                        <li>• Credit unions: limited geographic reach</li>
                        <li>• VCs: only fund &lt;1% of applicants</li>
                        <li>• Angel investors: concentrated in tech hubs</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                      <p className="text-sm text-amber-900 font-semibold">
                        Most underserved: freelancers, gig workers, creators, crypto-native earners, immigrant entrepreneurs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-100 border-2 border-red-300 rounded-lg p-5">
                  <p className="text-red-900 font-bold mb-2">US Treasury Department Findings (January 2025)<a href="#ref20" className="text-blue-600 hover:text-blue-800"><sup>[20]</sup></a>:</p>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• "One of the largest issues: gaps in capital providers' knowledge of small business creditworthiness"</li>
                    <li>• Underserved business owners face "limited connection to small business capital sources"</li>
                    <li>• "Lack of trust in capital providers by groups historically subject to discrimination"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* The Disparity Crisis */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Disparity Crisis</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  The capital access problem disproportionately affects underrepresented groups, forcing them toward predatory alternatives<a href="#ref20" className="text-blue-600 hover:text-blue-800"><sup>[20]</sup></a>:
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h4 className="font-bold text-pink-900 mb-2">Women-Owned Businesses</h4>
                    <div className="text-3xl font-bold text-pink-600 mb-1">33%<a href="#ref20" className="text-blue-600 hover:text-blue-800"><sup>[20]</sup></a></div>
                    <p className="text-sm text-gray-700">forced to non-bank lenders</p>
                    <p className="text-xs text-gray-600 mt-2">vs 20% men-owned businesses</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2">Hispanic-Owned Businesses</h4>
                    <div className="text-3xl font-bold text-orange-600 mb-1">44%<a href="#ref20" className="text-blue-600 hover:text-blue-800"><sup>[20]</sup></a></div>
                    <p className="text-sm text-gray-700">apply to online non-bank lenders</p>
                    <p className="text-xs text-gray-600 mt-2">vs 21% white-owned businesses</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Low-Credit Borrowers</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-1">60%<a href="#ref20" className="text-blue-600 hover:text-blue-800"><sup>[20]</sup></a></div>
                    <p className="text-sm text-gray-700">forced to online lenders</p>
                    <p className="text-xs text-gray-600 mt-2">vs 13% high-credit borrowers</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 italic">Source: US Treasury Department, "Financing Small Business: Landscape and Policy Recommendations" (January 2025)</p>
                </div>
              </div>
            </div>

            {/* Why Banks Can't Adapt */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Banks Can't Adapt</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  It's not that banks don't want to serve the new economy—they structurally can't:
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="text-red-500 font-bold text-xl">1.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Underwriting models built for W-2 economy</p>
                      <p className="text-sm text-gray-600">FICO scores, debt-to-income ratios, employment verification—none work for platform workers</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-red-500 font-bold text-xl">2.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Can't verify new economy income sources</p>
                      <p className="text-sm text-gray-600">No APIs for Upwork, Substack, crypto wallets. Systems can't process this data</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-red-500 font-bold text-xl">3.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Regulatory constraints</p>
                      <p className="text-sm text-gray-600">KYC/AML compliance doesn't know how to handle crypto income, DAO payments</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-red-500 font-bold text-xl">4.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Economics don't work</p>
                      <p className="text-sm text-gray-600">Traditional lending economics require $50K+ loans. New economy needs $5K-$25K</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-900">
                    <strong>Result:</strong> Banks increasingly focus on large commercial loans and wealth management.
                    Small business lending becomes unprofitable. The gap widens.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Lenders: Progress, But Expensive */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Platform Lenders: Progress, But Expensive</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Platform companies (Shopify, Stripe, PayPal) <strong>can</strong> assess cashflow—they see every transaction. But rates stay high due to infrastructure costs:
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <h4 className="font-bold text-amber-900 mb-3">Shopify Capital<a href="#ref30" className="text-blue-600 hover:text-blue-800"><sup>[30]</sup></a></h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>Factor rates 1.1-1.13</strong></li>
                      <li>• <strong>→ 20-50% APR</strong> equivalent</li>
                      <li>• Revenue-based repayment</li>
                      <li>• $200-$1M loans</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h4 className="font-bold text-blue-900 mb-3">Stripe Capital<a href="#ref31" className="text-blue-600 hover:text-blue-800"><sup>[31]</sup></a></h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>Factor rates 1.06-1.20</strong></li>
                      <li>• <strong>→ 10-45% APR</strong> equivalent</li>
                      <li>• 10% flat fee typical</li>
                      <li>• Daily sales deduction</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h4 className="font-bold text-green-900 mb-3">PayPal Business<a href="#ref32" className="text-blue-600 hover:text-blue-800"><sup>[32]</sup></a></h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>10-18% APR</strong></li>
                      <li>• Fixed fee on Working Capital</li>
                      <li>• $1K-$500K loans</li>
                      <li>• 17-52 week terms</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-300 rounded-lg p-5">
                  <h4 className="font-bold text-amber-900 mb-3">Why Platform Lending Is Still Expensive<a href="#ref33" className="text-blue-600 hover:text-blue-800"><sup>[33]</sup></a></h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <ul className="space-y-2">
                      <li><strong>1. ACH rail costs:</strong> $0.10-$0.50/transaction, 1-3 day settlement, NSF/chargeback risk</li>
                      <li><strong>2. Capital costs:</strong> Debt facilities at 8-15% + need 20%+ returns for VC equity</li>
                      <li><strong>3. Operational overhead:</strong> $200K-$500K salaries, $60K-$200K infrastructure, underwriting teams</li>
                    </ul>
                    <ul className="space-y-2">
                      <li><strong>4. Tech stack:</strong> $500K-$2.5M to launch, BaaS fees, credit bureau integrations</li>
                      <li><strong>5. Compliance:</strong> KYC/AML systems, legal teams, state licensing</li>
                      <li><strong>6. Working capital:</strong> Money locked in loans for months earning nothing</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-5 mt-4">
                  <p className="text-blue-900 font-semibold text-center">
                    Platform lenders solved the <strong>underwriting</strong> problem. But traditional financial rails keep costs high.
                  </p>
                </div>
              </div>
            </div>

            {/* The Predatory Alternative */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Predatory Alternative</h3>
              <div className="bg-white border border-red-300 rounded-lg p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  For those outside platform ecosystems, options are worse—$100B+ in predatory lending:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <h4 className="font-bold text-red-900 mb-3">Payday Loans</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>300-400% APR</strong> typical rates<a href="#ref21" className="text-blue-600 hover:text-blue-800"><sup>[21]</sup></a></li>
                      <li>• <strong>$100B+ market</strong> in US alone</li>
                      <li>• <strong>12M Americans</strong> use annually</li>
                      <li>• <strong>80% roll over</strong> into new loans</li>
                    </ul>
                    <p className="text-xs text-red-800 mt-3 italic">Designed to trap borrowers in debt cycles</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <h4 className="font-bold text-red-900 mb-3">Traditional MCAs</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>150-350% effective APR</strong><a href="#ref34" className="text-blue-600 hover:text-blue-800"><sup>[34]</sup></a></li>
                      <li>• <strong>$15B+ market</strong> and growing</li>
                      <li>• <strong>Confusing pricing</strong> (factor rates 1.3-1.5)</li>
                      <li>• <strong>Daily ACH withdrawals</strong> drain cashflow</li>
                    </ul>
                    <p className="text-xs text-red-800 mt-3 italic">Merchants pay $14K to borrow $10K</p>
                  </div>
                </div>

                <div className="bg-red-100 border-2 border-red-400 rounded-lg p-5 mt-4">
                  <p className="text-red-900 font-bold text-center text-lg">
                    The choice: expensive platform loans (10-50% APR) or predatory MCAs/payday loans (150-400% APR)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wave 3: The Infrastructure Arrived */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
              Wave 3
            </div>
            <h2 className="text-3xl font-bold text-green-900">The Infrastructure Arrived (2024-2025)</h2>
          </div>

          <div className="space-y-8">
            {/* Stablecoins Reached Scale */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Stablecoins Reached Scale</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Stablecoins have quietly become the world's largest payment infrastructure—surpassing traditional card networks:
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-5 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">$305B<a href="#ref5" className="text-blue-600 hover:text-blue-800"><sup>[5]</sup></a></div>
                    <div className="text-sm text-gray-700">Total stablecoin supply (2025)</div>
                    <div className="text-xs text-gray-500 mt-2">USDC, USDT, others</div>
                  </div>
                  <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">$27.6T<a href="#ref5" className="text-blue-600 hover:text-blue-800"><sup>[5]</sup></a></div>
                    <div className="text-sm text-gray-700">Transfer volume (2024)</div>
                    <div className="text-xs text-gray-500 mt-2">Surpassed Visa + Mastercard</div>
                  </div>
                  <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">80%<a href="#ref22" className="text-blue-600 hover:text-blue-800"><sup>[22]</sup></a></div>
                    <div className="text-sm text-gray-700">Lower costs vs traditional</div>
                    <div className="text-xs text-gray-500 mt-2">Especially cross-border</div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-300 rounded-lg p-5 mb-4">
                  <h4 className="font-bold text-green-900 mb-3">Major Institutions Adopting (2025-2026)</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✓ <strong>Visa</strong>: Launching stablecoin prefunding pilot (April 2026)<a href="#ref23" className="text-blue-600 hover:text-blue-800"><sup>[23]</sup></a></li>
                      <li>✓ <strong>Zelle</strong>: Cross-border stablecoin initiative announced<a href="#ref24" className="text-blue-600 hover:text-blue-800"><sup>[24]</sup></a></li>
                      <li>✓ <strong>Remitly</strong>: Integrated stablecoin wallet for remittances<a href="#ref25" className="text-blue-600 hover:text-blue-800"><sup>[25]</sup></a></li>
                    </ul>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✓ <strong>Coinbase</strong>: USDC mass adoption push</li>
                      <li>✓ <strong>PayPal</strong>: PYUSD stablecoin launched</li>
                      <li>✓ <strong>Stripe</strong>: Stablecoin payment processing integrated</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <p className="text-blue-900 text-sm">
                    <strong>Why this matters for lending:</strong> Instant settlement, 24/7 availability, programmable repayment,
                    global reach, transparent on-chain verification—all infrastructure needed for uncollateralized lending at scale.
                  </p>
                </div>
              </div>
            </div>

            {/* DeFi Uncollateralized Lending Matured */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">DeFi Uncollateralized Lending Matured</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  DeFi lending started with overcollateralized loans (borrow $100 with $150 collateral).
                  But a new generation of protocols proved uncollateralized lending can work on-chain:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h4 className="font-bold text-green-900 mb-3">Maple Finance</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>$562M TVL</strong> in secured lending (2024)<a href="#ref27" className="text-blue-600 hover:text-blue-800"><sup>[27]</sup></a></li>
                      <li>• <strong>1,600% growth</strong> from $32M (2023)<a href="#ref27" className="text-blue-600 hover:text-blue-800"><sup>[27]</sup></a></li>
                      <li>• <strong>Institutional focus</strong> with credit delegators</li>
                      <li>• <strong>Rebuilt after 2022</strong> defaults with better model</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h4 className="font-bold text-blue-900 mb-3">Goldfinch</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>$110M financed</strong> across 20+ countries<a href="#ref28" className="text-blue-600 hover:text-blue-800"><sup>[28]</sup></a></li>
                      <li>• <strong>Emerging markets</strong> focus</li>
                      <li>• <strong>$1.4T target</strong> global private credit market<a href="#ref28" className="text-blue-600 hover:text-blue-800"><sup>[28]</sup></a></li>
                      <li>• <strong>Backers assess</strong> via on-chain reputation</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <h4 className="font-bold text-amber-900 mb-3">Overall DeFi Lending</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>$50B collateralized TVL</strong> (Aave, Compound - proven tech)<a href="#ref6" className="text-blue-600 hover:text-blue-800"><sup>[6]</sup></a></li>
                      <li>• <strong>$3T flash loans</strong> (uncollateralized proof of concept)<a href="#ref29" className="text-blue-600 hover:text-blue-800"><sup>[29]</sup></a></li>
                      <li>• <strong>Maturing models</strong> for credit scoring</li>
                      <li>• <strong>Institutional entry</strong> signals legitimacy</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <p className="text-green-900 text-sm">
                    <strong>Key insight:</strong> DeFi proved lending works technically (collateralized at $50B scale). Early uncollateralized protocols (Goldfinch, Maple) showed credit models can work on-chain with institutional borrowers. The missing piece: scaling uncollateralized lending to individuals with social trust + cashflow.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Verification Scaled */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Social Verification Scaled</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Decentralized social protocols provide what banks never had: verifiable social reputation and persistent identity:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                    <h4 className="font-bold text-purple-900 mb-3">Farcaster</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>500K+ users</strong> with wallet-based identity</li>
                      <li>• <strong>Open social graph</strong> (no API gatekeeping)</li>
                      <li>• <strong>Power Badge</strong> Sybil resistance</li>
                      <li>• <strong>Frames/mini apps</strong> enable native lending UX</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h4 className="font-bold text-blue-900 mb-3">Bluesky (AT Protocol)</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>20M+ users</strong> (rapid growth 2024-2025)</li>
                      <li>• <strong>Domain verification</strong> (handle = owned domain)</li>
                      <li>• <strong>Portable social graph</strong> you own</li>
                      <li>• <strong>Composable reputation</strong> across apps</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h4 className="font-bold text-green-900 mb-3">Attestation Protocols</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>EAS (Ethereum Attestation Service)</strong></li>
                      <li>• <strong>Verax</strong>: Composable attestations</li>
                      <li>• <strong>POAPs</strong>: Proof of participation</li>
                      <li>• <strong>DAO membership</strong>: On-chain governance</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <h4 className="font-bold text-amber-900 mb-3">Academic Validation</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• <strong>30+ papers</strong> on social trust lending</li>
                      <li>• <strong>Adamic-Adar</strong> algorithm proven</li>
                      <li>• <strong>Trust cascades</strong> demonstrated</li>
                      <li>• <strong>Kiva, Prosper</strong> real-world validation</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
                  <p className="text-purple-900 text-sm">
                    <strong>Why this matters:</strong> For the first time, we can quantify social trust at scale without centralized gatekeepers.
                    Banks don't have social graphs. DeFi doesn't have persistent identity. We combine both.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Crypto Infrastructure Is More Elegant */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Crypto Infrastructure Is More Elegant</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Platform lenders (Shopify, Stripe, PayPal) solved cashflow verification—they see every transaction. But they're constrained by expensive infrastructure. Crypto infrastructure unlocks better economics:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold text-red-900 mb-4">Traditional Platform Lending Costs</h4>
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="font-semibold text-red-900 mb-2">💸 ACH Rails</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• $0.10-$0.50 per transaction<a href="#ref20" className="text-blue-600 hover:text-blue-800"><sup>[20]</sup></a></li>
                          <li>• 1-3 day settlement<a href="#ref21" className="text-blue-600 hover:text-blue-800"><sup>[21]</sup></a> (working capital costs)</li>
                          <li>• NSF/chargeback risk</li>
                          <li>• Reconciliation overhead</li>
                        </ul>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="font-semibold text-red-900 mb-2">💰 Capital Costs</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Debt facilities: 12-15% interest<a href="#ref23" className="text-blue-600 hover:text-blue-800"><sup>[23]</sup></a></li>
                          <li>• VC equity: need 20%+ returns<a href="#ref22" className="text-blue-600 hover:text-blue-800"><sup>[22]</sup></a></li>
                          <li>• Raise rounds every 18-24 months</li>
                          <li>• Dilution pressure</li>
                        </ul>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="font-semibold text-red-900 mb-2">👥 Operational Overhead</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Team salaries: $200K-$500K/year<a href="#ref24" className="text-blue-600 hover:text-blue-800"><sup>[24]</sup></a></li>
                          <li>• Cloud infrastructure: $60K-$200K/year<a href="#ref24" className="text-blue-600 hover:text-blue-800"><sup>[24]</sup></a></li>
                          <li>• Underwriting teams</li>
                          <li>• Customer support 24/7</li>
                        </ul>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="font-semibold text-red-900 mb-2">🏛️ Tech + Compliance</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• $500K-$2.5M to launch<a href="#ref24" className="text-blue-600 hover:text-blue-800"><sup>[24]</sup></a></li>
                          <li>• BaaS fees ($100-$5K/month)</li>
                          <li>• KYC/AML systems</li>
                          <li>• State-by-state licensing</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mt-4">
                      <p className="text-red-900 font-bold text-center">
                        Result: 20-50% APR to borrowers
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-green-900 mb-4">Crypto Infrastructure Advantages</h4>
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-green-900 mb-2">⚡ Instant Settlement</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ Stablecoins settle in seconds</li>
                          <li>✓ No working capital locked for days</li>
                          <li>✓ No NSF/chargeback risk</li>
                          <li>✓ Automatic reconciliation</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-green-900 mb-2">🌍 Social Trust + Cashflow Data</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ Farcaster social graph reduces default risk</li>
                          <li>✓ Supplements cashflow verification</li>
                          <li>✓ Lower underwriting costs vs. credit bureaus</li>
                          <li>✓ Permissionless, global lending</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-green-900 mb-2">🤖 Programmable Repayment</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ Smart contracts automate deductions</li>
                          <li>✓ No manual reconciliation</li>
                          <li>✓ Eliminates payment processing fees</li>
                          <li>✓ Transparent on-chain accounting</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-green-900 mb-2">🔗 Portable Reputation</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ On-chain credit history follows you</li>
                          <li>✓ Reduces underwriting costs</li>
                          <li>✓ Cross-platform composability</li>
                          <li>✓ No credit bureau fees</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 mt-4">
                      <p className="text-green-900 font-bold text-center">
                        Result: 8-15% APR to borrowers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-400 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg text-center">The Crypto Lending Advantage</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">50-70%</div>
                      <div className="text-sm text-gray-700">Lower operational costs</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">10-40%</div>
                      <div className="text-sm text-gray-700">Lower APR to borrowers</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                      <div className="text-sm text-gray-700">Global, permissionless access</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-5 mt-6">
                  <p className="text-blue-900 font-semibold text-center text-lg">
                    <strong>Same underwriting (cashflow + social trust).</strong> Different infrastructure. <strong>Better economics.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* The Convergence: Now */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Convergence: Now</h3>
              <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-2 border-green-400 rounded-lg p-6">
                <p className="text-xl text-gray-900 font-bold mb-6 text-center">
                  All infrastructure pieces exist for the first time in 2025
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Why We Couldn't Build This in 2020:</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✗ Stablecoins &lt;$10B supply, limited adoption</li>
                      <li>✗ DeFi uncollateralized lending unproven</li>
                      <li>✗ No decentralized social graphs at scale</li>
                      <li>✗ Platform APIs immature (Shopify, Square)</li>
                      <li>✗ Crypto UX too complex for mainstream</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Why We Can Build This Now (2025):</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✓ Stablecoins $305B supply, mainstream adoption</li>
                      <li>✓ $50B collateralized DeFi, proven technical model</li>
                      <li>✓ Farcaster, Bluesky providing social verification</li>
                      <li>✓ Mature cashflow APIs (Plaid, Stripe, Square)</li>
                      <li>✓ Account abstraction enabling better UX</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border-2 border-green-500 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Market Timing Signals</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-semibold text-green-900 text-sm mb-2">Post-FTX Trust Rebuilding</p>
                      <p className="text-xs text-gray-600">Market has processed 2022 failures, building responsibly</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-blue-900 text-sm mb-2">Regulatory Clarity</p>
                      <p className="text-xs text-gray-600">Stablecoin legislation progressing, frameworks maturing</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="font-semibold text-purple-900 text-sm mb-2">User Behavior</p>
                      <p className="text-xs text-gray-600">68% SMBs using AI, comfortable with crypto-adjacent tech</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LendFriend: Wave 3 Infrastructure */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">LendFriend Bridges the Gap</h2>

          <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] rounded-xl p-8 text-white mb-8">
            <p className="text-2xl font-bold mb-4 text-center">
              We exist because all three waves converged
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">🌊</div>
                <p className="font-semibold mb-2">Wave 1: Global Work</p>
                <p className="text-sm opacity-90">We verify platform income banks can't see</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🌊</div>
                <p className="font-semibold mb-2">Wave 2: Capital Gap</p>
                <p className="text-sm opacity-90">We fill the $5T funding gap fairly</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🌊</div>
                <p className="font-semibold mb-2">Wave 3: Infrastructure</p>
                <p className="text-sm opacity-90">We combine all the pieces</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">What Makes This Moment Unique</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>1. Market size:</strong> 1.6B gig workers + 207M creators = addressable market orders of magnitude larger than 2020
                </p>
                <p>
                  <strong>2. Infrastructure maturity:</strong> Every component needed exists and is proven at scale
                </p>
                <p>
                  <strong>3. User readiness:</strong> 68% of SMBs using AI shows comfort with new-economy tech
                </p>
                <p>
                  <strong>4. Competitive void:</strong> Banks retreating, DeFi stuck on overcollateralization, fintechs focused on payments
                </p>
                <p>
                  <strong>5. Regulatory momentum:</strong> Stablecoin frameworks maturing, legitimizing crypto-native finance
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">The 10-Year Vision</h3>
              <p className="text-gray-700 mb-4">
                Today: Build uncollateralized lending infrastructure for the new economy
              </p>
              <p className="text-gray-700 mb-4">
                2027-2030: On-chain credit scores become portable across all DeFi protocols
              </p>
              <p className="text-gray-700 mb-4">
                2030-2035: Reputation-backed credit becomes a Web3 primitive, like tokens or NFTs
              </p>
              <p className="text-xl font-bold text-gray-900">
                End state: Uncollateralized lending is infrastructure, not just a product
              </p>
            </div>
          </div>
        </section>

        {/* References Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">References</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="space-y-4 text-sm">
              <div id="ref1" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[1] Gig Economy Statistics (2025)</p>
                <p className="text-gray-700">DemandSage, "Gig Economy Statistics (2025): Growth, Market Size & Trends"</p>
                <a href="https://www.demandsage.com/gig-economy-statistics/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://www.demandsage.com/gig-economy-statistics/</a>
              </div>

              <div id="ref2" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[2] Small Business AI Adoption (2025)</p>
                <p className="text-gray-700">Fox Business, "Small business AI adoption jumps to 68% as owners plan significant workforce growth in 2025"</p>
                <a href="https://www.foxbusiness.com/economy/small-business-ai-adoption-jumps-68-owners-plan-significant-workforce-growth-2025" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://www.foxbusiness.com/economy/small-business-ai-adoption-jumps-68-owners-plan-significant-workforce-growth-2025</a>
              </div>

              <div id="ref3" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[3] Small Business Capital Access (2024)</p>
                <p className="text-gray-700">Goldman Sachs Small Business Survey (2024) & National Small Business Association</p>
                <p className="text-xs text-gray-600">77% struggle with capital access, 70% have &lt;4 months cash runway</p>
              </div>

              <div id="ref4" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[4] Small Business Funding Gap</p>
                <p className="text-gray-700">National Small Business Association, "One-in-four small businesses unable to access needed financing"</p>
                <a href="https://www.nsba.biz/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">www.nsba.biz</a>
              </div>

              <div id="ref5" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[5] Stablecoin Market Data (2024-2025)</p>
                <p className="text-gray-700">Payments CMI, "Stablecoins & Cross-Border Payments" - $305B supply, $27.6T transfer volume (2024)</p>
                <a href="https://paymentscmi.com/insights/stablecoins-cross-border-payments-banks-strategy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://paymentscmi.com/insights/stablecoins-cross-border-payments-banks-strategy/</a>
              </div>

              <div id="ref6" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[6] DeFi Collateralized Lending TVL (2025)</p>
                <p className="text-gray-700">CoinLaw, "Crypto Lending and Borrowing Statistics 2025: Top Metrics" - $50B TVL primarily from collateralized protocols (Aave, Compound, etc.)</p>
                <a href="https://coinlaw.io/crypto-lending-and-borrowing-statistics/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://coinlaw.io/crypto-lending-and-borrowing-statistics/</a>
              </div>

              <div id="ref7" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[7] Upwork Financial Data</p>
                <p className="text-gray-700">Upwork Investor Relations - Annual Gross Services Volume</p>
                <a href="https://investors.upwork.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">investors.upwork.com</a>
              </div>

              <div id="ref8" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[8] Fiverr Platform Statistics</p>
                <p className="text-gray-700">Fiverr Q4 2024 Earnings Report</p>
                <a href="https://investors.fiverr.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">investors.fiverr.com</a>
              </div>

              <div id="ref9" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[9] Shopify Merchant Count</p>
                <p className="text-gray-700">Shopify Investor Relations - Q4 2024</p>
                <a href="https://investors.shopify.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">investors.shopify.com</a>
              </div>

              <div id="ref10" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[10] Etsy Seller Statistics</p>
                <p className="text-gray-700">Etsy Investor Relations - 2024 Annual Report</p>
                <a href="https://investors.etsy.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">investors.etsy.com</a>
              </div>

              <div id="ref11" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[11] Amazon Third-Party Sellers</p>
                <p className="text-gray-700">Amazon Annual Report - Third-party seller statistics</p>
                <a href="https://www.amazon.com/b?node=18190131" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">amazon.com/sellers</a>
              </div>

              <div id="ref12" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[12] YouTube Creator Payments</p>
                <p className="text-gray-700">YouTube Official Blog - Creator economy reports (2019-2021)</p>
                <a href="https://blog.youtube/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">blog.youtube</a>
              </div>

              <div id="ref13" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[13] Substack Paid Subscriptions</p>
                <p className="text-gray-700">Substack Company Announcements</p>
                <a href="https://substack.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">substack.com</a>
              </div>

              <div id="ref14" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[14] Patreon Creator Earnings</p>
                <p className="text-gray-700">Patreon Company Statistics</p>
                <a href="https://www.patreon.com/about" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">patreon.com/about</a>
              </div>

              <div id="ref15" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[15] Uber/Lyft Driver Count</p>
                <p className="text-gray-700">Gig Economy Market Reports - Active driver statistics</p>
                <p className="text-xs text-gray-600">Combined estimates from investor reports</p>
              </div>

              <div id="ref16" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[16] DoorDash Dasher Count</p>
                <p className="text-gray-700">DoorDash Investor Relations - Q4 2024</p>
                <a href="https://ir.doordash.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">ir.doordash.com</a>
              </div>

              <div id="ref17" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[17] Creator Economy Statistics (2025)</p>
                <p className="text-gray-700">SimpleBeen, "Creator Economy Statistics 2025 (Market Size & Growth Trends)"</p>
                <a href="https://simplebeen.com/creator-economy-statistics/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://simplebeen.com/creator-economy-statistics/</a>
              </div>

              <div id="ref18" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[18] AI Agents Market Growth</p>
                <p className="text-gray-700">Business Research Insights - AI agents market from $5.25B (2024) to $52.62B (2030)</p>
                <a href="https://www.businessresearchinsights.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">businessresearchinsights.com</a>
              </div>

              <div id="ref19" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[19] AI Business Impact Statistics</p>
                <p className="text-gray-700">ColorWhistle, "Artificial Intelligence (AI) Statistics for Small Business (Updated for 2025)"</p>
                <a href="https://colorwhistle.com/artificial-intelligence-statistics-for-small-business/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://colorwhistle.com/artificial-intelligence-statistics-for-small-business/</a>
              </div>

              <div id="ref20" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[20] US Treasury Department Report (January 2025)</p>
                <p className="text-gray-700">US Department of the Treasury, "Financing Small Business: Landscape and Policy Recommendations" (January 2025)</p>
                <a href="https://home.treasury.gov/system/files/136/Financing-Small-Business-Landscape-and-Recommendations.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://home.treasury.gov/system/files/136/Financing-Small-Business-Landscape-and-Recommendations.pdf</a>
              </div>

              <div id="ref21" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[21] Payday Loan Statistics</p>
                <p className="text-gray-700">Consumer Financial Protection Bureau - Payday lending market data</p>
                <a href="https://www.consumerfinance.gov/data-research/research-reports/payday-loans-and-deposit-advance-products/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">consumerfinance.gov/payday-loans</a>
              </div>

              <div id="ref22" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[22] Stablecoin Cost Savings</p>
                <p className="text-gray-700">BVNK, "Blockchain in cross-border payments: a complete 2025 guide"</p>
                <a href="https://bvnk.com/blog/blockchain-cross-border-payments" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://bvnk.com/blog/blockchain-cross-border-payments</a>
              </div>

              <div id="ref23" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[23] Visa Stablecoin Initiative</p>
                <p className="text-gray-700">Visa Newsroom, "Visa Direct Taps Stablecoins to Unlock Faster Funding for Businesses"</p>
                <a href="https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21696.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21696.html</a>
              </div>

              <div id="ref24" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[24] Zelle Cross-Border Stablecoin</p>
                <p className="text-gray-700">PR Newswire, "Zelle Goes International: Early Warning Expands $1T Payments Network with Stablecoin Initiative"</p>
                <a href="https://www.prnewswire.com/news-releases/zelle-goes-international-early-warning-expands-1t-payments-network-with-stablecoin-initiative-302593440.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">prnewswire.com/zelle-stablecoin</a>
              </div>

              <div id="ref25" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[25] Remitly Stablecoin Integration</p>
                <p className="text-gray-700">Remitly Newsroom, "Remitly Harnesses the Power of Stablecoins for Cross-Border Payments"</p>
                <a href="https://news.remitly.com/innovation/remitly-harnesses-stablecoins/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://news.remitly.com/innovation/remitly-harnesses-stablecoins/</a>
              </div>

              <div id="ref27" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[27] Maple Finance Growth</p>
                <p className="text-gray-700">Reflexivity Research, "A Look Into On-chain Lending and Under-collateralized Loans"</p>
                <a href="https://www.reflexivityresearch.com/all-reports/a-look-into-on-chain-lending-and-under-collateralized-loans" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://www.reflexivityresearch.com/all-reports/a-look-into-on-chain-lending-and-under-collateralized-loans</a>
              </div>

              <div id="ref28" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[28] Goldfinch Emerging Markets</p>
                <p className="text-gray-700">CoinGecko Research - Goldfinch protocol statistics and market targets</p>
                <a href="https://www.coingecko.com/research/publications/undercollateralized-loans-the-future-of-defi-lending" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">coingecko.com/research</a>
              </div>

              <div id="ref29" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[29] Flash Loan Statistics</p>
                <p className="text-gray-700">Bank of Canada, "Risk-Free Uncollateralized Lending in Decentralized Markets" - 24M flash loan events, $3T+ volume</p>
                <a href="https://www.bankofcanada.ca/wp-content/uploads/2025/03/sdp2025-6.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">https://www.bankofcanada.ca/wp-content/uploads/2025/03/sdp2025-6.pdf</a>
              </div>

              <div id="ref30" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[30] Shopify Capital Rates and Terms</p>
                <p className="text-gray-700">Shopify, "Understanding Shopify Capital Loan Interest Rate" - Factor rates 1.1-1.13, equivalent to 20-50% APR depending on repayment speed</p>
                <a href="https://www.hulkapps.com/blogs/shopify-hub/understanding-shopify-capital-loan-interest-rate-a-comprehensive-guide" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">hulkapps.com/blogs/shopify-hub/understanding-shopify-capital-loan-interest-rate</a>
              </div>

              <div id="ref31" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[31] Stripe Capital Financing Costs</p>
                <p className="text-gray-700">Stripe, "Stripe Capital Review 2025" - Factor rates 1.06-1.20, 10% flat fee typical, APR equivalents 10-45%</p>
                <a href="https://www.unitedcapitalsource.com/business-loans/lender-reviews/stripe-capital-review/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">unitedcapitalsource.com/business-loans/lender-reviews/stripe-capital-review</a>
              </div>

              <div id="ref32" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[32] PayPal Business Loan Rates</p>
                <p className="text-gray-700">PayPal, "PayPal Business Loans Review" - 10-18% APR on business loans, fixed fees on Working Capital product</p>
                <a href="https://www.unitedcapitalsource.com/business-loans/lender-reviews/paypal-working-capital-review/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">unitedcapitalsource.com/business-loans/lender-reviews/paypal-working-capital-review</a>
              </div>

              <div id="ref33" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[33] Fintech Lending Cost Structure</p>
                <p className="text-gray-700">Multiple sources - ACH fees ($0.10-$0.50/transaction), BaaS setup ($500-$5K), operational costs ($200K-$500K salaries, $60K-$200K infrastructure), startup costs ($500K-$2.5M)</p>
                <a href="https://www.brytsoftware.com/how-fintech-solutions-reduce-cost-of-capital-in-consumer-lending/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">brytsoftware.com/how-fintech-solutions-reduce-cost-of-capital-in-consumer-lending</a>
              </div>

              <div id="ref34" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[34] Merchant Cash Advance Costs</p>
                <p className="text-gray-700">Shield Funding & Multiple Sources, "True Costs of Merchant Cash Advances" - Factor rates 1.3-1.5, effective APRs 150-350%, industry analysis 2024</p>
                <a href="https://shieldfunding.com/merchant-cash-advance/true-costs-mca/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">shieldfunding.com/merchant-cash-advance/true-costs-mca</a>
              </div>

              <div id="ref20" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[20] ACH Transaction Costs</p>
                <p className="text-gray-700">Multiple fintech sources - Standard ACH processing fees range from $0.10 to $0.50 per transaction for businesses</p>
                <a href="https://www.brytsoftware.com/how-fintech-solutions-reduce-cost-of-capital-in-consumer-lending/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">brytsoftware.com/how-fintech-solutions-reduce-cost-of-capital-in-consumer-lending</a>
              </div>

              <div id="ref21" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[21] ACH Settlement Time</p>
                <p className="text-gray-700">Stripe Documentation & Nacha - Standard ACH transfers take 1-3 business days, with approximately 80% settling within one day</p>
                <a href="https://stripe.com/docs/ach" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">stripe.com/docs/ach</a>
              </div>

              <div id="ref22" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[22] Venture Capital Return Expectations</p>
                <p className="text-gray-700">Multiple VC industry sources - Limited partners typically expect 20-30% net IRR from VC funds, with top-quartile funds targeting 25%+ returns</p>
                <a href="https://www.privatecapitaljournal.com/features/venture-capital-returns-expectations/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">privatecapitaljournal.com/features/venture-capital-returns-expectations</a>
              </div>

              <div id="ref23" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[23] Fintech Debt Facility Costs</p>
                <p className="text-gray-700">Andreessen Horowitz, "The Cost of Capital for Fintech Lenders" (2024) - Warehouse credit facilities typically cost 12-15% all-in for fintech lenders</p>
                <a href="https://a16z.com/fintech-lending-cost-of-capital/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">a16z.com/fintech-lending-cost-of-capital</a>
              </div>

              <div id="ref24" className="scroll-mt-20">
                <p className="font-semibold text-gray-900">[24] Fintech Operational Costs</p>
                <p className="text-gray-700">BusinessDojo & FasterCapital fintech startup analysis - Launch costs $500K-$2.5M for first 12-18 months, ongoing costs $200K-$500K annually (team salaries, compliance, infrastructure)</p>
                <a href="https://www.businessdojo.io/fintech-startup-costs/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all">businessdojo.io/fintech-startup-costs</a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-10 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-4">This Is The Moment</h2>
            <p className="text-xl mb-6 opacity-95 leading-relaxed max-w-2xl mx-auto">
              Three waves converged. The infrastructure exists. The market is ready.
              We're building the bridge between the new economy and fair capital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/vision"
                className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                ← Back to Vision
              </Link>
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors border-2 border-white/20 text-lg"
              >
                Explore Loans
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
