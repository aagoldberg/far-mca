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
            Web3 infrastructure for uncollateralized credit—powered by revenue verification and community trust
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-6 py-12">

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem</h2>
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Millions of entrepreneurs run real businesses with verifiable revenue—Shopify sellers, Stripe merchants, Square vendors.
              They have transaction history, customer reviews, and proven cashflow. To grow, they need working capital.
            </p>
            <p>
              But traditional lending fails them:
            </p>
          </div>

          {/* Comparison Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left p-3 bg-gray-50 border-b-2 border-gray-200"></th>
                  <th className="p-3 bg-gray-50 border-b-2 border-gray-200 text-gray-700 font-bold">Banks</th>
                  <th className="p-3 bg-gray-50 border-b-2 border-gray-200 text-gray-700 font-bold">Platform MCAs</th>
                  <th className="p-3 bg-gray-50 border-b-2 border-gray-200 text-gray-700 font-bold">DeFi</th>
                  <th className="p-3 bg-[#ECFDF5] border-b-2 border-[#3B9B7F] text-[#2E7D68] font-bold">LendFriend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b border-gray-100 font-medium text-gray-700">Examples</td>
                  <td className="p-3 border-b border-gray-100 text-center text-xs text-gray-500">Chase, BofA</td>
                  <td className="p-3 border-b border-gray-100 text-center text-xs text-gray-500">Wayflyer, Shopify, Square</td>
                  <td className="p-3 border-b border-gray-100 text-center text-xs text-gray-500">Aave, Compound</td>
                  <td className="p-3 border-b border-gray-100 text-center text-xs text-[#2E7D68]">—</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 font-medium text-gray-700">Credit Score<sup className="text-gray-400">1</sup></td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">680+</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">Not required</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">N/A</td>
                  <td className="p-3 border-b border-gray-100 text-center text-[#2E7D68] font-semibold">Not required</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 font-medium text-gray-700">Collateral<sup className="text-gray-400">2</sup></td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">Assets required</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">Future revenue</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">120-150% crypto</td>
                  <td className="p-3 border-b border-gray-100 text-center text-[#2E7D68] font-semibold">Verified revenue</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 font-medium text-gray-700">Cost<sup className="text-gray-400">3</sup></td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">8-15% APR</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">2-16% flat fee</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">Variable + liquidation risk</td>
                  <td className="p-3 border-b border-gray-100 text-center text-[#2E7D68] font-semibold">0% interest</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 font-medium text-gray-700">Min Revenue<sup className="text-gray-400">4</sup></td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">$100K-$250K/yr</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">$10K/mo (Wayflyer)</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">N/A (crypto only)</td>
                  <td className="p-3 border-b border-gray-100 text-center text-[#2E7D68] font-semibold">Any verified</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 font-medium text-gray-700">Time in Business<sup className="text-gray-400">5</sup></td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">2+ years</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">3-6 months</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">N/A</td>
                  <td className="p-3 border-b border-gray-100 text-center text-[#2E7D68] font-semibold">Any with sales</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-100 font-medium text-gray-700">Capital Source</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">Bank deposits</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">VC / balance sheet</td>
                  <td className="p-3 border-b border-gray-100 text-center text-gray-600">Liquidity pools</td>
                  <td className="p-3 border-b border-gray-100 text-center text-[#2E7D68] font-semibold">Your community</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Default Consequence</td>
                  <td className="p-3 text-center text-gray-600">Credit damage</td>
                  <td className="p-3 text-center text-gray-600">Platform lockout</td>
                  <td className="p-3 text-center text-gray-600">Liquidation</td>
                  <td className="p-3 text-center text-[#2E7D68] font-semibold">Social accountability</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p><sup>1</sup> Banks: <a href="https://www.bankrate.com/loans/small-business/business-loan-credit-score/" className="underline" target="_blank" rel="noopener">Bankrate</a>; Platform MCAs don't require credit scores per <a href="https://help-center.wayflyer.com/en/articles/96317-what-are-the-requirements-to-get-funding-from-wayflyer" className="underline" target="_blank" rel="noopener">Wayflyer</a>, <a href="https://squareup.com/help/us/en/article/6454-square-capital-eligibility-faqs" className="underline" target="_blank" rel="noopener">Square</a></p>
              <p><sup>2</sup> DeFi: LTV 75-80% means 120-133% collateral required (<a href="https://docs.aave.com/risk/asset-risk/risk-parameters" className="underline" target="_blank" rel="noopener">Aave Risk Docs</a>)</p>
              <p><sup>3</sup> Wayflyer: <a href="https://help-center.wayflyer.com/en/articles/96332-are-there-any-fees" className="underline" target="_blank" rel="noopener">2-8% fee</a>; Shopify/Square: 10-16% factor rate (<a href="https://www.business.org/finance/loans/square-capital-review/" className="underline" target="_blank" rel="noopener">Business.org</a>)</p>
              <p><sup>4</sup> Wayflyer: <a href="https://help-center.wayflyer.com/en/articles/96317-what-are-the-requirements-to-get-funding-from-wayflyer" className="underline" target="_blank" rel="noopener">$10K/mo minimum (US)</a>; Square: <a href="https://squareup.com/help/us/en/article/6454-square-capital-eligibility-faqs" className="underline" target="_blank" rel="noopener">$10K/yr processing</a>; Shopify: invite-only, undisclosed</p>
              <p><sup>5</sup> Wayflyer: <a href="https://help-center.wayflyer.com/en/articles/96317-what-are-the-requirements-to-get-funding-from-wayflyer" className="underline" target="_blank" rel="noopener">6+ months for e-commerce</a>; Shopify: <a href="https://help.shopify.com/en/manual/finance/shopify-capital/eligibility" className="underline" target="_blank" rel="noopener">3+ months active</a></p>
            </div>
          </div>

          {/* Who We Serve - Two Tiers */}
          <div className="mt-12 bg-white border-2 border-[#3B9B7F] rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Who We Serve</h3>
            <p className="text-gray-600 mb-6">
              Platform MCAs require $10K+/month revenue. We serve everyone below that threshold—real businesses that need smaller amounts.
            </p>

            {/* Tier 1: Verified via Platform Data */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#3B9B7F] rounded-full"></div>
                  <h4 className="font-bold text-gray-900">Revenue-Verified (via Shopify, Stripe, Square)</h4>
                </div>
                <span className="text-[#2E7D68] font-bold bg-[#ECFDF5] px-3 py-1 rounded-full text-sm">4M+ potential borrowers<sup>*</sup></span>
              </div>
              <p className="text-sm text-gray-600 mb-4 ml-5">
                Real sales history we can verify. Lower risk for lenders. Our core market.
              </p>
              <div className="space-y-3 ml-5">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <span className="font-medium text-gray-900">Small Shopify/WooCommerce Stores</span>
                    <p className="text-xs text-gray-500">Established stores earning $1K-$10K/month<sup>1</sup></p>
                  </div>
                  <span className="text-[#2E7D68] font-bold text-sm">4.8M+</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <span className="font-medium text-gray-900">Stripe/Square Merchants</span>
                    <p className="text-xs text-gray-500">Service providers, local businesses with payment history<sup>2</sup></p>
                  </div>
                  <span className="text-[#2E7D68] font-bold text-sm">3M+</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <span className="font-medium text-gray-900">Freelancers on Stripe</span>
                    <p className="text-xs text-gray-500">Designers, developers with verifiable client payments<sup>3</sup></p>
                  </div>
                  <span className="text-[#2E7D68] font-bold text-sm">10M+</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <div>
                    <span className="font-medium text-gray-900">Immigrant Entrepreneurs</span>
                    <p className="text-xs text-gray-500">No credit history, but verifiable platform revenue<sup>4</sup></p>
                  </div>
                  <span className="text-[#2E7D68] font-bold text-sm">3.2M+</span>
                </div>
              </div>
            </div>

            {/* Tier 2: Higher Risk - Community Trust */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <h4 className="font-bold text-gray-900">Community-Vouched (Limited Platform Data)</h4>
                </div>
                <span className="text-amber-700 font-bold bg-amber-100 px-3 py-1 rounded-full text-sm">5.5M new businesses/yr<sup>5</sup></span>
              </div>
              <p className="text-sm text-gray-600 mb-4 ml-5">
                New or pre-revenue businesses. Higher risk—lenders see clear warnings. Relies more on social trust.
              </p>
              <div className="space-y-3 ml-5">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <span className="font-medium text-gray-900">New Businesses (&lt;3 months sales)</span>
                    <p className="text-xs text-gray-500">Too new for platform MCAs, but have early traction<sup>5</sup></p>
                  </div>
                  <span className="text-amber-600 font-bold text-sm">5.5M/yr</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <div>
                    <span className="font-medium text-gray-900">Pre-Launch / Side Projects</span>
                    <p className="text-xs text-gray-500">No revenue yet—funded purely by friends & believers</p>
                  </div>
                  <span className="text-amber-600 font-bold text-sm">—</span>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 ml-5 mt-3">
                <p className="text-xs text-amber-800">
                  <strong>Lender Note:</strong> Limited or no verified revenue. Funding is based on social trust
                  and altruism—more like GoFundMe. Lenders should be prepared to not be repaid.
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-4">
              <p><sup>*</sup> <a href="https://www.demandsage.com/shopify-statistics/" className="underline" target="_blank" rel="noopener">DemandSage</a>: 4.8-5.5M active Shopify stores; avg revenue ~$2,300/mo—vast majority under $10K/mo threshold</p>
              <p><sup>1</sup> <a href="https://www.chargeflow.io/blog/shopify-statistics" className="underline" target="_blank" rel="noopener">Chargeflow</a>: Top 1% of Shopify stores earn 80% of revenue; most stores are small</p>
              <p><sup>2</sup> <a href="https://squareup.com/us/en/press" className="underline" target="_blank" rel="noopener">Square</a> serves 4M+ sellers; 70% are SMBs</p>
              <p><sup>3</sup> <a href="https://www.upwork.com/resources/freelancing-stats" className="underline" target="_blank" rel="noopener">Upwork</a>: 64M US freelancers; many use Stripe for invoicing</p>
              <p><sup>4</sup> <a href="https://news.mit.edu/2022/study-immigrants-more-likely-start-firms-create-jobs-0509" className="underline" target="_blank" rel="noopener">MIT Study 2022</a>; <a href="https://advocacy.sba.gov/2022/10/18/small-business-facts-an-overview-of-immigrant-business-ownership/" className="underline" target="_blank" rel="noopener">SBA</a>: 3.2M immigrant entrepreneurs</p>
              <p><sup>5</sup> <a href="https://www.census.gov/econ/bfs/index.html" className="underline" target="_blank" rel="noopener">Census Bureau</a>: 5.5M new business applications in 2023</p>
            </div>
          </div>

          {/* Our Market - TAM */}
          <div className="mt-6 bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#3B9B7F] rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Our Market</h3>
            <p className="text-gray-700 mb-6">
              Platform MCAs serve established merchants with $10K+/month. Banks require 680+ credit and 2+ years history.
              DeFi requires crypto collateral. <strong className="text-[#2E7D68]">We serve everyone else.</strong>
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-[#3B9B7F]/20">
                <div className="text-2xl font-bold text-[#2E7D68] mb-1">36M+</div>
                <p className="text-gray-600">Small businesses in the US<sup>1</sup></p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#3B9B7F]/20">
                <div className="text-2xl font-bold text-[#2E7D68] mb-1">40%</div>
                <p className="text-gray-600">MSMEs are credit-constrained globally<sup>2</sup></p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#3B9B7F]/20">
                <div className="text-2xl font-bold text-[#2E7D68] mb-1">5.5M</div>
                <p className="text-gray-600">New US business applications in 2023<sup>3</sup></p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#3B9B7F]/20">
                <div className="text-2xl font-bold text-[#2E7D68] mb-1">$5.7T</div>
                <p className="text-gray-600">Global MSME financing gap<sup>2</sup></p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-4 space-y-1">
              <p><sup>1</sup> <a href="https://advocacy.sba.gov/2025/06/30/new-advocacy-report-shows-the-number-of-small-businesses-in-the-u-s-exceeds-36-million/" className="underline" target="_blank" rel="noopener">SBA Office of Advocacy (June 2025)</a></p>
              <p><sup>2</sup> <a href="https://www.smefinanceforum.org/sites/default/files/Data Sites downloads/IFC Report_MAIN Final 3 25.pdf" className="underline" target="_blank" rel="noopener">IFC/World Bank MSME Finance Gap Report (March 2025)</a></p>
              <p><sup>3</sup> <a href="https://www.census.gov/econ/bfs/index.html" className="underline" target="_blank" rel="noopener">U.S. Census Bureau Business Formation Statistics</a></p>
            </div>
          </div>
        </section>

        {/* Vitalik Quote - now earned after problem statement */}
        <section className="mb-16">
          <div className="border-l-4 border-[#2E7D68] pl-6 py-2">
            <p className="text-gray-700 text-lg italic mb-3 leading-relaxed">
              "Perhaps the largest financial value built directly on reputation is credit and
              uncollateralized lending. Currently, the Web3 ecosystem cannot replicate even the
              most primitive forms of uncollateralized lending... because there is no web3-native
              representation of persistent identity and reputation."
            </p>
            <p className="text-sm text-gray-500">
              — Vitalik Buterin & E. Glen Weyl, <span className="italic">"Decentralized Society: Finding Web3's Soul"</span> (2022)
            </p>
          </div>
        </section>

        {/* Our Approach */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Approach</h2>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            We're building web3-native identity and reputation for small business lending. Instead of credit scores,
            we use <strong>verified revenue data</strong>. Instead of banks, we use <strong>community capital</strong>.
            Instead of collateral, we use <strong>progressive trust</strong>.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Revenue Verification</h3>
              <p className="text-sm text-gray-600 mb-4">
                Connect Shopify, Stripe, or Square. Your transaction history becomes your trust score.
              </p>
              <p className="text-xs text-gray-500">
                Research shows cashflow data predicts repayment as effectively as credit scores—without excluding the credit-invisible.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Community Capital</h3>
              <p className="text-sm text-gray-600 mb-4">
                Funded by friends, family, customers, and believers—people who know you and want you to succeed.
              </p>
              <p className="text-xs text-gray-500">
                No anonymous institutional capital. Lenders have skin in the game beyond yield.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">Progressive Trust</h3>
              <p className="text-sm text-gray-600 mb-4">
                Start small ($100-$5K). Each successful repayment unlocks larger amounts.
              </p>
              <p className="text-xs text-gray-500">
                Social accountability: defaulting means letting down people who believed in you—not an anonymous protocol.
              </p>
            </div>
          </div>
        </section>

        {/* Who This Serves */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who This Serves</h2>
          <p className="text-gray-600 mb-6">
            Entrepreneurs with real businesses but limited access to traditional credit:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-gray-900 mb-1">E-commerce Sellers</p>
              <p className="text-xs text-gray-500">Shopify, Etsy, Amazon</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-gray-900 mb-1">Service Providers</p>
              <p className="text-xs text-gray-500">Freelancers, contractors</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-gray-900 mb-1">New Americans</p>
              <p className="text-xs text-gray-500">No US credit history</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-gray-900 mb-1">Local Businesses</p>
              <p className="text-xs text-gray-500">Restaurants, salons, shops</p>
            </div>
          </div>
        </section>

        {/* Growth Model */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Growth Model</h2>
          <p className="text-gray-600 mb-8">
            Every borrower becomes a distribution channel by sharing their loan with their network.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-[#2E7D68]">0.7-1.2</div>
                <div>
                  <p className="font-semibold text-gray-900">Viral Coefficient</p>
                  <p className="text-sm text-gray-500">Each user brings 0.7-1.2 new users</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-3">
                  <span className="font-bold text-[#2E7D68]">1.</span>
                  <span>Borrower creates loan request</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-[#2E7D68]">2.</span>
                  <span>Shares to 50-200 people (social, Farcaster)</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-[#2E7D68]">3.</span>
                  <span>10-20% convert to lenders</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-[#2E7D68]">4.</span>
                  <span>Lenders become future borrowers</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/images/viral.png"
                alt="Viral Growth Network Effect"
                width={400}
                height={300}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* The Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Roadmap</h2>
          <p className="text-gray-600 mb-8">
            A phased evolution from proving the model to scaling it.
          </p>

          {/* Phase Cards */}
          <div className="space-y-6">
            {/* Phase 0 */}
            <div className="border-2 border-[#3B9B7F] rounded-xl overflow-hidden">
              <div className="bg-[#ECFDF5] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-[#3B9B7F] text-white px-3 py-1 rounded text-sm font-bold">Phase 0</span>
                  <h3 className="text-xl font-bold text-[#2E7D68]">Revenue-Verified Lending</h3>
                </div>
                <span className="text-sm font-medium text-[#2E7D68]">Live Now</span>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  0% interest community loans ($100-$5K) to prove that revenue verification + social trust works.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">What We've Built</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Shopify, Stripe, Square OAuth integrations</li>
                      <li>• Trust scores from verified sales data</li>
                      <li>• On-chain repayment tracking (Base L2)</li>
                      <li>• Farcaster + Twitter social sharing</li>
                      <li>• Optional tipping for grateful borrowers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">What We're Learning</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Which revenue signals predict repayment best</li>
                      <li>• Optimal loan-to-revenue ratios</li>
                      <li>• How social proximity affects default rates</li>
                      <li>• Repayment behavior without interest incentive</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 1 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-500 text-white px-3 py-1 rounded text-sm font-bold">Phase 1</span>
                  <h3 className="text-xl font-bold text-gray-700">Scale with Returns</h3>
                </div>
                <span className="text-sm font-medium text-gray-500">Exploring</span>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  If regulations permit: fair interest rates (8-12% APY for lenders) to attract capital at scale.
                  Still 50-70% cheaper than fintech MCAs for borrowers.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm">
                  <p className="text-amber-900">
                    <strong>Regulatory dependent.</strong> Interest-bearing loans require compliant frameworks.
                    We're exploring licensed partnerships, revenue share models, and jurisdiction-specific approaches.
                  </p>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-400 text-white px-3 py-1 rounded text-sm font-bold">Phase 2</span>
                  <h3 className="text-xl font-bold text-gray-500">Automated Repayment</h3>
                </div>
                <span className="text-sm font-medium text-gray-400">Future</span>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Auto-repay from revenue as you earn. The dream: loans that pay themselves.
                </p>
                <div className="bg-gray-100 border-l-4 border-gray-300 p-4 text-sm">
                  <p className="text-gray-600">
                    <strong>Tech not ready.</strong> Most merchants (Shopify, Square) operate in fiat.
                    Waiting for: merchant stablecoin adoption, Stripe/Square USDC payouts, AA payment plugins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Now */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Now</h2>
          <p className="text-gray-600 mb-6">
            Five years ago, this wasn't possible. Today:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Open Social Graphs</h4>
              <p className="text-xs text-gray-600">
                Farcaster, Bluesky provide verifiable social connections with wallet-based identity.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Stablecoin Rails</h4>
              <p className="text-xs text-gray-600">
                USDC on Base: $0.01 transactions, instant settlement. Finally viable for small loans.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Cashflow APIs</h4>
              <p className="text-xs text-gray-600">
                Plaid, Shopify, Square APIs enable real-time revenue verification.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Account Abstraction</h4>
              <p className="text-xs text-gray-600">
                ERC-4337 enables programmable wallets with payment streams (maturing).
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">On-Chain Reputation</h4>
              <p className="text-xs text-gray-600">
                ENS, POAPs, DAO participation create portable identity traditional credit misses.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Research Foundation</h4>
              <p className="text-xs text-gray-600">
                30+ papers validate social proximity lending (Kiva, Grameen, Prosper).
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Principles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-l-4 border-[#3B9B7F] pl-4 py-2">
              <h3 className="font-bold text-gray-900 mb-1">Transparent by Default</h3>
              <p className="text-sm text-gray-600">
                All loans, repayments, and scoring on-chain. No black boxes.
              </p>
            </div>
            <div className="border-l-4 border-[#3B9B7F] pl-4 py-2">
              <h3 className="font-bold text-gray-900 mb-1">Research-Driven</h3>
              <p className="text-sm text-gray-600">
                Following validated models from Kiva, Grameen, Prosper, Branch.
              </p>
            </div>
            <div className="border-l-4 border-[#3B9B7F] pl-4 py-2">
              <h3 className="font-bold text-gray-900 mb-1">Identity-Based</h3>
              <p className="text-sm text-gray-600">
                Real people with persistent identities. Not anonymous DeFi.
              </p>
            </div>
            <div className="border-l-4 border-[#3B9B7F] pl-4 py-2">
              <h3 className="font-bold text-gray-900 mb-1">Mission-First</h3>
              <p className="text-sm text-gray-600">
                Start altruistic (0%), evolve to sustainable. Never extractive.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] rounded-xl p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Us</h2>
            <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
              We're building web3-native credit infrastructure. Help us prove that revenue verification
              and community trust can power fairer lending.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-white text-[#3B9B7F] font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Loans
              </Link>
              <Link
                href="/create-loan"
                className="px-8 py-3 bg-[#2E7D68] text-white font-bold rounded-lg hover:bg-[#255A51] transition-colors border border-white/20"
              >
                Create a Loan
              </Link>
              <Link
                href="/research"
                className="px-8 py-3 border border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#3B9B7F] transition-colors"
              >
                Research
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
