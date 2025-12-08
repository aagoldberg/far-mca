'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

function ScoreBar({ label, value, tier }: { label: string; value: number; tier: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-sm text-gray-600">{label}</div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="w-20 text-sm font-medium text-gray-700 text-right">{tier}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-cyan-50 to-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How We Assess Business Health
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our risk scoring approach balances transparency for supporters with privacy for merchants,
            drawing from industry-leading practices in peer-to-peer and revenue-based lending.
          </p>
        </div>
      </section>

      {/* Industry Inspiration */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Industry-Informed Approach</h2>

          <p className="text-gray-600 mb-6">
            Our Business Health Score draws from established risk rating systems:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-1">Kiva</div>
              <p className="text-sm text-gray-600">
                1-5 star ratings based on 38 variables including portfolio quality and track record
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-1">Prosper / Lending Club</div>
              <p className="text-sm text-gray-600">
                Letter grades (AA to HR) communicating risk level to peer lenders
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-1">Stripe Radar</div>
              <p className="text-sm text-gray-600">
                Numeric scores (0-99) with thresholds for normal, elevated, and high risk
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Hybrid Model</h3>
          <p className="text-gray-600 mb-6">
            We combine letter grades for quick comprehension, numeric scores for granularity,
            and component breakdowns for transparency:
          </p>

          {/* Demo Score Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-semibold text-gray-900">Business Health Score</h4>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-green-600">A</span>
                <span className="text-sm text-gray-500">82/100</span>
              </div>
            </div>

            <div className="space-y-3">
              <ScoreBar label="Revenue Stability" value={85} tier="Strong" />
              <ScoreBar label="Business Tenure" value={100} tier="3+ years" />
              <ScoreBar label="Growth Trend" value={72} tier="Positive" />
              <ScoreBar label="Order Consistency" value={90} tier="Steady" />
            </div>

            <p className="text-xs text-gray-400 mt-5">
              Verified via Shopify API · Updated Dec 2024
            </p>
          </div>
        </div>
      </section>

      {/* What We Measure */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What We Measure</h2>

          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Revenue Stability</h3>
                <p className="text-sm text-gray-600">
                  Month-over-month consistency. Steady patterns indicate sustainable business models.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Business Tenure</h3>
                <p className="text-sm text-gray-600">
                  Length of verified sales history. Longer track records provide more confidence.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Growth Trend</h3>
                <p className="text-sm text-gray-600">
                  Revenue direction over time, seasonally adjusted. Classified as Declining, Stable, Growing, or Accelerating.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Order Consistency</h3>
                <p className="text-sm text-gray-600">
                  Regularity of customer orders. Steady flow suggests reliable demand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy-First Choices */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy-First Design Choices</h2>

          <p className="text-gray-600 mb-6">
            We show qualitative assessments instead of exact numbers. This protects merchant privacy
            while still providing supporters with meaningful trust signals.
          </p>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-900">We Don't Show</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-900">We Show Instead</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-900">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-5 py-3 text-gray-500">$8,500/month</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">Revenue: Strong</td>
                  <td className="px-5 py-3 text-gray-600">Exact figures are sensitive</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-gray-500">180 orders/month</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">Orders: Steady</td>
                  <td className="px-5 py-3 text-gray-600">Protects competitive info</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-gray-500">+12% growth</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">Trend: Positive</td>
                  <td className="px-5 py-3 text-gray-600">Qualitative is sufficient</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-gray-500">36 months active</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">Tenure: 3+ years</td>
                  <td className="px-5 py-3 text-gray-600">Ranges work equally well</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-5 bg-cyan-50 rounded-xl border border-cyan-100">
            <h3 className="font-semibold text-cyan-900 mb-2">Aligned with Platform Standards</h3>
            <p className="text-cyan-800 text-sm">
              This follows Shopify's data minimization principles and mirrors how Clearco, Wayflyer,
              and other revenue-based lenders handle merchant data—using it for qualification without
              publicly exposing exact figures.
            </p>
          </div>
        </div>
      </section>

      {/* Grade Definitions */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Grade Definitions</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-xl font-bold text-green-600 w-10">A</div>
              <div>
                <span className="font-semibold text-gray-900">Excellent</span>
                <span className="text-gray-600 text-sm ml-2">
                  Strong stability, 2+ year track record, positive growth, consistent orders
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-xl font-bold text-blue-600 w-10">B</div>
              <div>
                <span className="font-semibold text-gray-900">Good</span>
                <span className="text-gray-600 text-sm ml-2">
                  Solid metrics with minor areas for improvement
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="text-xl font-bold text-amber-600 w-10">C</div>
              <div>
                <span className="font-semibold text-gray-900">Fair</span>
                <span className="text-gray-600 text-sm ml-2">
                  Acceptable metrics, some volatility or shorter track record
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="text-xl font-bold text-red-500 w-10">D</div>
              <div>
                <span className="font-semibold text-gray-900">Elevated Risk</span>
                <span className="text-gray-600 text-sm ml-2">
                  Limited data, newer business, or concerning patterns
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium">
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
