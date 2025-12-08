'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ScaleIcon,
  BeakerIcon,
  LockClosedIcon,
  ArrowPathIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

function SectionHeading({ id, title, subtitle }: { id: string, title: string, subtitle?: string }) {
  return (
    <div id={id} className="scroll-mt-28 mb-8">
      <h2 className="text-3xl font-bold text-stone-900 mb-2">{title}</h2>
      {subtitle && <p className="text-lg text-stone-500">{subtitle}</p>}
    </div>
  );
}

function ComponentCard({
  title,
  weight,
  formula,
  formulaExplanation,
  description,
  minimum,
  thresholds
}: {
  title: string;
  weight: string;
  formula: string;
  formulaExplanation: string;
  description: string;
  minimum: string;
  thresholds: { label: string; score: string }[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-stone-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">{title}</h3>
            <p className="text-sm text-stone-500 mt-1">{description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-stone-900">{weight}</div>
            <div className="text-xs text-stone-400 uppercase tracking-wider">Weight</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Formula */}
        <div className="mb-5 p-4 bg-stone-50 rounded-lg">
          <div className="font-mono text-sm text-stone-700 mb-1">{formula}</div>
          <div className="text-xs text-stone-500">{formulaExplanation}</div>
        </div>

        {/* Thresholds - Simple list */}
        <div className="mb-5">
          <div className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Thresholds</div>
          <div className="space-y-1">
            {thresholds.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1.5">
                <span className="text-stone-600">{t.label}</span>
                <span className="font-mono text-stone-900">{t.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Requirement */}
        <div className="text-xs text-stone-500 pt-4 border-t border-stone-100">
          <span className="font-medium">Min. data:</span> {minimum}
        </div>
      </div>
    </div>
  );
}

export default function RiskScoringPage() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'components', 'affordability', 'grades', 'privacy', 'sources'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <ShieldCheckIcon className="w-4 h-4" />
              Transparency Report
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              How We Assess<br />Business Health
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              No black boxes. Our risk scoring is built on peer-reviewed research and displays two independent indicators so lenders can make informed decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">

          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8">
              <nav className="space-y-1 bg-white rounded-xl p-4 shadow-sm border border-stone-200">
                {[
                  { id: 'overview', label: 'Overview', icon: BuildingLibraryIcon },
                  { id: 'components', label: 'Score Components', icon: ChartBarIcon },
                  { id: 'affordability', label: 'Loan Affordability', icon: ScaleIcon },
                  { id: 'grades', label: 'Grade System', icon: BeakerIcon },
                  { id: 'privacy', label: 'Privacy Design', icon: LockClosedIcon },
                  { id: 'sources', label: 'Data Sources', icon: ArrowPathIcon },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeSection === item.id
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-24">

            {/* Overview Section */}
            <section>
              <SectionHeading
                id="overview"
                title="The Two-Indicator System"
                subtitle="We separate business quality from loan appropriateness"
              />

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Health Score Card */}
                <div className="bg-white rounded-2xl border-2 border-brand-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16" />
                  <div className="relative">
                    <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">Indicator 1</div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-3">Business Health Score</h3>
                    <p className="text-stone-600 mb-4">
                      Measures the fundamental quality and stability of the business based on cash flow patterns.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">Grade A-D</span>
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-sm">0-100 score</span>
                    </div>
                  </div>
                </div>

                {/* Affordability Card */}
                <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16" />
                  <div className="relative">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Indicator 2</div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-3">Loan Affordability</h3>
                    <p className="text-stone-600 mb-4">
                      Measures whether this specific loan amount is appropriate for the business's revenue.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">4 Tiers</span>
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-sm">Loan ÷ Revenue</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Reference Legend */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Grade Scale */}
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
                  <h4 className="font-bold text-stone-900 mb-3 text-sm uppercase tracking-wide">Grade Scale</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-700">A (Excellent)</span>
                      <span className="font-mono text-stone-600">75-100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-700">B (Good)</span>
                      <span className="font-mono text-stone-600">55-74</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-700">C (Fair)</span>
                      <span className="font-mono text-stone-600">40-54</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-700">D (Risk)</span>
                      <span className="font-mono text-stone-600">0-39</span>
                    </div>
                  </div>
                </div>

                {/* Affordability Scale */}
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
                  <h4 className="font-bold text-stone-900 mb-3 text-sm uppercase tracking-wide">Affordability Scale</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-700">Comfortable</span>
                      <span className="font-mono text-stone-600">&lt; 0.5x Rev</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-700">Manageable</span>
                      <span className="font-mono text-stone-600">0.5x - 1.0x</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-700">Stretched</span>
                      <span className="font-mono text-stone-600">1.0x - 2.0x</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-700">High Burden</span>
                      <span className="font-mono text-stone-600">&gt; 2.0x Rev</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Components Section */}
            <section>
              <SectionHeading
                id="components"
                title="Score Components"
                subtitle="Four factors weighted by predictive power"
              />

              {/* Weight Visualization */}
              <div className="mb-10">
                <div className="flex h-4 w-full rounded-full overflow-hidden shadow-inner bg-stone-200">
                  <div className="bg-brand-600 w-[35%] relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">35%</div>
                  </div>
                  <div className="bg-brand-500 w-[25%] relative">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">25%</div>
                  </div>
                  <div className="bg-brand-400 w-[20%] relative">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">20%</div>
                  </div>
                  <div className="bg-brand-300 w-[20%] relative">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90">20%</div>
                  </div>
                </div>
                <div className="flex text-xs mt-2 text-stone-500">
                  <div className="w-[35%]">Revenue Stability</div>
                  <div className="w-[25%]">Order Consistency</div>
                  <div className="w-[20%]">Tenure</div>
                  <div className="w-[20%]">Growth</div>
                </div>
              </div>

              {/* Component Cards */}
              <div className="grid gap-6">
                <ComponentCard
                  title="Revenue Stability"
                  weight="35%"
                  metric="Coefficient of Variation (CV) of Monthly Revenue"
                  formula="CV = (σ / μ) × 100"
                  formulaExplanation="Standard deviation of monthly revenue divided by mean monthly revenue. Lower CV = more stable."
                  description="Month-over-month consistency is the strongest predictor of repayment per FinRegLab research."
                  minimum="3+ months of order history. Less data defaults to 40 pts (Fair)."
                  thresholds={[
                    { label: 'CV < 15%', score: '100 pts', color: 'green' },
                    { label: 'CV 15-25%', score: '85 pts', color: 'green' },
                    { label: 'CV 25-40%', score: '70 pts', color: 'yellow' },
                    { label: 'CV 40-60%', score: '50 pts', color: 'yellow' },
                    { label: 'CV 60-80%', score: '30 pts', color: 'red' },
                    { label: 'CV > 80%', score: '15 pts', color: 'red' },
                  ]}
                />

                <ComponentCard
                  title="Order Consistency"
                  weight="25%"
                  metric="Coefficient of Variation (CV) of Weekly Order Count"
                  formula="CV = (σ / μ) × 100"
                  formulaExplanation="Standard deviation of weekly order counts divided by mean weekly orders. Lower CV = steadier demand."
                  description="Steady transaction patterns indicate reliable demand and operational consistency."
                  minimum="4+ weeks of order history. Less data defaults to 40 pts (Fair)."
                  thresholds={[
                    { label: 'CV < 20%', score: '100 pts', color: 'green' },
                    { label: 'CV 20-35%', score: '85 pts', color: 'green' },
                    { label: 'CV 35-50%', score: '70 pts', color: 'yellow' },
                    { label: 'CV 50-70%', score: '50 pts', color: 'yellow' },
                    { label: 'CV 70-90%', score: '30 pts', color: 'red' },
                    { label: 'CV > 90%', score: '15 pts', color: 'red' },
                  ]}
                />

                <ComponentCard
                  title="Business Tenure"
                  weight="20%"
                  metric="Months Since First Order"
                  formula="tenure = (today - firstOrderDate) / 30"
                  formulaExplanation="Days between today and the first verified order, converted to months."
                  description="Track record matters, but cash flow metrics collectively outweigh pure tenure."
                  minimum="Uses first order date. No orders = 15 pts (Poor)."
                  thresholds={[
                    { label: '36+ months', score: '100 pts', color: 'green' },
                    { label: '24-36 months', score: '85 pts', color: 'green' },
                    { label: '12-24 months', score: '70 pts', color: 'yellow' },
                    { label: '6-12 months', score: '50 pts', color: 'yellow' },
                    { label: '3-6 months', score: '30 pts', color: 'red' },
                    { label: '< 3 months', score: '15 pts', color: 'red' },
                  ]}
                />

                <ComponentCard
                  title="Growth Trend"
                  weight="20%"
                  metric="Revenue Change: First Half vs Second Half"
                  formula="growth = ((recentRevenue - priorRevenue) / priorRevenue) × 100"
                  formulaExplanation="Split order history at midpoint. Compare total revenue in second half vs first half."
                  description="Sustainable growth (10-30%) scores highest. Extreme spikes may indicate volatility."
                  minimum="45+ days of order history. Less data defaults to 40 pts (Fair)."
                  thresholds={[
                    { label: '+10% to +30%', score: '100 pts', color: 'green' },
                    { label: '+30% to +50%', score: '85 pts', color: 'green' },
                    { label: '0% to +10%', score: '75 pts', color: 'blue' },
                    { label: '+50% or more', score: '60 pts', color: 'yellow' },
                    { label: '0% to -10%', score: '50 pts', color: 'yellow' },
                    { label: 'Below -10%', score: '15-30 pts', color: 'red' },
                  ]}
                />
              </div>

              {/* Research Basis */}
              <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BuildingLibraryIcon className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Research Foundation</h4>
                    <p className="text-sm text-blue-800">
                      Weights derived from <strong>FinRegLab "Sharpening the Focus" (2025)</strong> analyzing 38,000+ small business loans,
                      and <strong>NBER Working Paper 33367</strong> showing cash flow metrics provide 2x predictive power for constrained businesses.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Affordability Section */}
            <section>
              <SectionHeading
                id="affordability"
                title="Loan Affordability"
                subtitle="Is this specific loan appropriate for this business?"
              />

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="p-6 border-b border-stone-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ScaleIcon className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Loan-to-Revenue Ratio</div>
                      <div className="text-sm text-stone-500">Loan Amount ÷ Average Monthly Revenue</div>
                    </div>
                  </div>
                  <p className="text-stone-600">
                    Revenue-based lenders (Wayflyer, Clearco) typically cap advances at 1-2x monthly revenue.
                    We display this separately so lenders can assess repayment burden independently from business health.
                  </p>
                </div>

                <div className="divide-y divide-stone-100">
                  {[
                    { tier: 'Comfortable', ratio: '< 0.5x', desc: 'Less than 2 weeks of revenue', color: 'green' },
                    { tier: 'Manageable', ratio: '0.5x - 1.0x', desc: 'Less than 1 month of revenue', color: 'blue' },
                    { tier: 'Stretched', ratio: '1.0x - 2.0x', desc: '1-2 months of revenue', color: 'amber' },
                    { tier: 'High Burden', ratio: '> 2.0x', desc: 'More than 2 months of revenue', color: 'red' },
                  ].map((item) => (
                    <div key={item.tier} className="flex items-center px-6 py-4">
                      <div className="w-32">
                        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold
                          ${item.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                          ${item.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                          ${item.color === 'amber' ? 'bg-amber-100 text-amber-800' : ''}
                          ${item.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {item.tier}
                        </span>
                      </div>
                      <div className="w-28 font-mono text-sm text-stone-700">{item.ratio}</div>
                      <div className="text-sm text-stone-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Grades Section */}
            <section>
              <SectionHeading
                id="grades"
                title="Grade System"
                subtitle="How component scores become letter grades"
              />

              <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8">
                <div className="text-center mb-8">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">The Formula</div>
                  <div className="inline-block text-lg font-mono text-stone-800 bg-stone-50 px-6 py-4 rounded-xl border border-stone-200">
                    (Stability × 0.35) + (Consistency × 0.25) + (Tenure × 0.20) + (Growth × 0.20)
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { grade: 'A', range: '75-100', label: 'Excellent Health', color: 'green' },
                    { grade: 'B', range: '55-74', label: 'Good Fundamentals', color: 'blue' },
                    { grade: 'C', range: '40-54', label: 'Fair / Developing', color: 'amber' },
                    { grade: 'D', range: '0-39', label: 'Elevated Risk', color: 'red' },
                  ].map((item) => (
                    <div
                      key={item.grade}
                      className={`p-5 rounded-xl text-center border-2
                        ${item.color === 'green' ? 'bg-green-50 border-green-200' : ''}
                        ${item.color === 'blue' ? 'bg-blue-50 border-blue-200' : ''}
                        ${item.color === 'amber' ? 'bg-amber-50 border-amber-200' : ''}
                        ${item.color === 'red' ? 'bg-red-50 border-red-200' : ''}
                      `}
                    >
                      <div className={`text-4xl font-bold mb-1
                        ${item.color === 'green' ? 'text-green-600' : ''}
                        ${item.color === 'blue' ? 'text-blue-600' : ''}
                        ${item.color === 'amber' ? 'text-amber-600' : ''}
                        ${item.color === 'red' ? 'text-red-600' : ''}
                      `}>
                        {item.grade}
                      </div>
                      <div className={`text-sm font-bold mb-1
                        ${item.color === 'green' ? 'text-green-800' : ''}
                        ${item.color === 'blue' ? 'text-blue-800' : ''}
                        ${item.color === 'amber' ? 'text-amber-800' : ''}
                        ${item.color === 'red' ? 'text-red-800' : ''}
                      `}>
                        {item.range}
                      </div>
                      <div className={`text-xs
                        ${item.color === 'green' ? 'text-green-700' : ''}
                        ${item.color === 'blue' ? 'text-blue-700' : ''}
                        ${item.color === 'amber' ? 'text-amber-700' : ''}
                        ${item.color === 'red' ? 'text-red-700' : ''}
                      `}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Privacy Section */}
            <section>
              <SectionHeading
                id="privacy"
                title="Privacy-First Design"
                subtitle="We show signals, not sensitive data"
              />

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <th className="px-6 py-4 text-left text-sm font-bold text-stone-900">Raw Data (Hidden)</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-stone-900">Signal (Shown)</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-stone-900">Why?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="px-6 py-4 text-stone-400 font-mono text-sm">$8,542/month</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-sm font-bold">Strong</span></td>
                      <td className="px-6 py-4 text-stone-600 text-sm">Protects sensitive financials</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-stone-400 font-mono text-sm">184 orders</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-sm font-bold">Steady</span></td>
                      <td className="px-6 py-4 text-stone-600 text-sm">Protects competitive advantage</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-stone-400 font-mono text-sm">+14.2% growth</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-sm font-bold">Growing</span></td>
                      <td className="px-6 py-4 text-stone-600 text-sm">Qualitative signal is sufficient</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-stone-400 font-mono text-sm">$2,000 loan / $5,000 rev</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-bold">~2 weeks revenue</span></td>
                      <td className="px-6 py-4 text-stone-600 text-sm">Shows ratio, not absolute amounts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Data Sources Section */}
            <section>
              <SectionHeading
                id="sources"
                title="Verified Data Sources"
                subtitle="Read-only API connections to commerce platforms"
              />

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'Shopify', color: '#96bf48', metrics: 'Orders, Revenue, Refunds, Shop Age' },
                  { name: 'Stripe', color: '#635BFF', metrics: 'Charges, Subscriptions, MRR, Payouts' },
                  { name: 'Square', color: '#000000', metrics: 'Payments, Refunds, POS Transactions' },
                ].map((platform) => (
                  <div key={platform.name} className="bg-white rounded-2xl border border-stone-200 p-6 text-center hover:shadow-lg transition-shadow">
                    <div
                      className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name[0]}
                    </div>
                    <h4 className="font-bold text-stone-900 mb-1">{platform.name}</h4>
                    <p className="text-sm text-stone-500">{platform.metrics}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-10 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">See Your Score</h2>
              <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                Connecting your accounts is safe, read-only, and takes less than 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/create-loan"
                  className="px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors"
                >
                  Check Eligibility
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-400 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
