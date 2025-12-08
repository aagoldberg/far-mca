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
  ArrowPathIcon
} from '@heroicons/react/24/outline';

function ScoreBar({ label, value, tier }: { label: string; value: number; tier: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-36 text-sm font-medium text-stone-600">{label}</div>
      <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="w-24 text-sm font-bold text-stone-900 text-right">{tier}</div>
    </div>
  );
}

function SectionHeading({ id, title, icon: Icon }: { id: string, title: string, icon: any }) {
  return (
    <div id={id} className="scroll-mt-28 mb-6 flex items-center gap-3 border-b border-stone-200 pb-4">
      <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
    </div>
  );
}

export default function RiskScoringPage() {
  const [activeSection, setActiveSection] = useState('approach');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['approach', 'weights', 'methodology', 'calculation', 'affordability', 'privacy', 'sources'];
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
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6">
              Transparency Report
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-6 tracking-tight leading-tight">
              Assessing Business Health
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed max-w-2xl">
              We don't use black boxes. Our risk scoring approach balances rigorous data analysis for supporters with privacy protection for merchants.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Contents</h3>
              <nav className="space-y-1">
                {[
                  { id: 'approach', label: 'Our Approach' },
                  { id: 'weights', label: 'Weights & Factors' },
                  { id: 'methodology', label: 'Methodology' },
                  { id: 'calculation', label: 'Scoring Logic' },
                  { id: 'affordability', label: 'Loan Affordability' },
                  { id: 'privacy', label: 'Privacy Design' },
                  { id: 'sources', label: 'Data Sources' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-white text-brand-600 shadow-sm ring-1 ring-stone-200'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-20">

            {/* 1. Industry Approach */}
            <section>
              <SectionHeading id="approach" title="Industry-Informed Approach" icon={BuildingLibraryIcon} />
              
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                Our Business Health Score isn't reinventing the wheel; it draws from established risk rating systems used by leading peer-to-peer and revenue-based lending platforms to ensure reliability.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="text-stone-900 font-bold mb-2">Kiva Model</div>
                  <p className="text-sm text-stone-600">
                    0.5-5 star ratings based on 7 distinct categories including governance, financials, and transparency.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="text-stone-900 font-bold mb-2">Prosper Model</div>
                  <p className="text-sm text-stone-600">
                    Letter grades (AA to HR) that communicate comparative risk levels instantly to peer lenders.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="text-stone-900 font-bold mb-2">Stripe Model</div>
                  <p className="text-sm text-stone-600">
                    Numeric scores (0-99) with clear thresholds for normal vs. elevated risk behavior.
                  </p>
                </div>
              </div>

              <div className="bg-brand-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">The Dual-Indicator System</h3>
                  <p className="text-brand-100 mb-8 max-w-2xl">
                    We separate "Business Quality" from "Loan Size" so lenders can make nuanced decisions. A great business asking for too much money is different from a risky business asking for a small amount.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-xl p-5 text-stone-900 shadow-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-stone-500 uppercase">Health Score</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">A (82/100)</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-stone-500 mb-1">
                            <span>Revenue Stability</span>
                            <span>85/100</span>
                          </div>
                          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[85%]"></div></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-stone-500 mb-1">
                            <span>Business Tenure</span>
                            <span>100/100</span>
                          </div>
                          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[100%]"></div></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-stone-500 mb-1">
                            <span>Growth Trend</span>
                            <span>72/100</span>
                          </div>
                          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[72%]"></div></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-stone-500 mb-1">
                            <span>Order Consistency</span>
                            <span>90/100</span>
                          </div>
                          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[90%]"></div></div>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-stone-400 font-medium">Measures fundamental quality</div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-xl p-5 text-stone-900 shadow-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-stone-500 uppercase">Affordability</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Comfortable</span>
                      </div>
                      <div className="mb-2">
                        <div className="text-2xl font-bold">$2,000</div>
                        <div className="text-xs text-stone-500">Loan Request</div>
                      </div>
                      <div className="text-sm font-medium text-stone-700">~2 weeks of revenue</div>
                      <div className="mt-4 text-xs text-stone-400 font-medium">Measures repayment burden</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Weights */}
            <section>
              <SectionHeading id="weights" title="Components & Weights" icon={ScaleIcon} />
              
              <p className="text-lg text-stone-600 mb-8">
                Our scoring model prioritizes cash flow stability above all else, based on FinRegLab research showing it as the strongest predictor of repayment.
              </p>

              {/* Visual Weight Bar */}
              <div className="flex h-12 w-full rounded-xl overflow-hidden mb-8 shadow-sm">
                <div className="bg-brand-600 w-[35%] flex items-center justify-center text-white font-bold text-sm border-r border-white/20">35%</div>
                <div className="bg-brand-500 w-[25%] flex items-center justify-center text-white font-bold text-sm border-r border-white/20">25%</div>
                <div className="bg-brand-400 w-[20%] flex items-center justify-center text-white font-bold text-sm border-r border-white/20">20%</div>
                <div className="bg-brand-300 w-[20%] flex items-center justify-center text-white font-bold text-sm">20%</div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border-l-4 border-brand-600 shadow-sm">
                  <h3 className="font-bold text-stone-900 mb-2">Revenue Stability (35%)</h3>
                  <p className="text-sm text-stone-600">
                    Month-over-month consistency. Lower volatility equals higher score. The bedrock of the model.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-brand-500 shadow-sm">
                  <h3 className="font-bold text-stone-900 mb-2">Order Consistency (25%)</h3>
                  <p className="text-sm text-stone-600">
                    Frequency and regularity of transaction volume. Consistent daily orders indicate healthy demand.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-brand-400 shadow-sm">
                  <h3 className="font-bold text-stone-900 mb-2">Business Tenure (20%)</h3>
                  <p className="text-sm text-stone-600">
                    Length of operational history. While new businesses are welcome, track record still counts.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-brand-300 shadow-sm">
                  <h3 className="font-bold text-stone-900 mb-2">Growth Trend (20%)</h3>
                  <p className="text-sm text-stone-600">
                    Recent trajectory vs. historical baseline. We value sustainable growth (10-30%) over viral spikes.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                <strong>Research Basis:</strong> Weights derived from <span className="underline cursor-pointer">FinRegLab "Sharpening the Focus" (2025)</span> and <span className="underline cursor-pointer">NBER Working Paper 33367</span>, demonstrating that cash flow metrics provide 2x predictive power for young businesses compared to FICO.
              </div>
            </section>

            {/* 3. Methodology Details */}
            <section>
              <SectionHeading id="methodology" title="Detailed Methodology" icon={BeakerIcon} />
              
              <div className="space-y-6">
                {/* Revenue Stability */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 font-semibold text-stone-900 flex justify-between">
                    <span>Revenue Stability Calculation</span>
                    <span className="text-brand-600">CV Metric</span>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-stone-600 mb-4">
                      We use the <strong>Coefficient of Variation (CV)</strong>: <code className="bg-stone-100 px-1 rounded text-brand-700">Standard Deviation ÷ Mean</code>.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-green-50 text-green-800 rounded">CV &lt; 15% → 100 pts</div>
                      <div className="p-2 bg-green-50 text-green-800 rounded">CV 15-25% → 85 pts</div>
                      <div className="p-2 bg-yellow-50 text-yellow-800 rounded">CV 25-40% → 70 pts</div>
                      <div className="p-2 bg-yellow-50 text-yellow-800 rounded">CV 40-60% → 50 pts</div>
                      <div className="p-2 bg-red-50 text-red-800 rounded">CV 60-80% → 30 pts</div>
                      <div className="p-2 bg-red-50 text-red-800 rounded">CV &gt; 80% → 15 pts</div>
                    </div>
                  </div>
                </div>

                {/* Business Tenure */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 font-semibold text-stone-900 flex justify-between">
                    <span>Business Tenure Calculation</span>
                    <span className="text-brand-600">Time Metric</span>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-stone-600 mb-4">
                      Calculated from the date of the first verified platform transaction.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-green-50 text-green-800 rounded">36+ mos → 100 pts</div>
                      <div className="p-2 bg-green-50 text-green-800 rounded">24-36 mos → 85 pts</div>
                      <div className="p-2 bg-yellow-50 text-yellow-800 rounded">12-24 mos → 70 pts</div>
                      <div className="p-2 bg-yellow-50 text-yellow-800 rounded">6-12 mos → 50 pts</div>
                      <div className="p-2 bg-red-50 text-red-800 rounded">3-6 mos → 30 pts</div>
                      <div className="p-2 bg-red-50 text-red-800 rounded">&lt; 3 mos → 15 pts</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Scoring Logic */}
            <section>
              <SectionHeading id="calculation" title="Overall Score Logic" icon={ChartBarIcon} />
              
              <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center mb-8">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">The Formula</p>
                <div className="text-lg md:text-xl font-mono text-stone-800 bg-stone-50 p-4 rounded-xl inline-block mx-auto border border-stone-200">
                  (Rev. Stability × 0.35) + (Order Consist. × 0.25) <br className="md:hidden"/> + (Tenure × 0.20) + (Growth × 0.20)
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="text-2xl font-bold text-green-600">A</div>
                    <div className="text-xs text-green-800 font-bold">75-100</div>
                    <div className="text-[10px] text-green-700 mt-1">Excellent Health</div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">B</div>
                    <div className="text-xs text-blue-800 font-bold">55-74</div>
                    <div className="text-[10px] text-blue-700 mt-1">Good Fundamentals</div>
                  </div>
                  <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                    <div className="text-2xl font-bold text-yellow-600">C</div>
                    <div className="text-xs text-yellow-800 font-bold">40-54</div>
                    <div className="text-[10px] text-yellow-700 mt-1">Fair / Volatile</div>
                  </div>
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                    <div className="text-2xl font-bold text-red-600">D</div>
                    <div className="text-xs text-red-800 font-bold">0-39</div>
                    <div className="text-[10px] text-red-700 mt-1">Elevated Risk</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Affordability */}
            <section>
              <SectionHeading id="affordability" title="Loan Affordability" icon={ScaleIcon} />
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-stone-600 mb-4">
                    While the Health Score measures business quality, Affordability measures leverage. We use the <strong>Loan-to-Revenue Ratio</strong> (Loan Amount ÷ Avg Monthly Revenue).
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm">
                      <span className="w-24 font-bold text-green-600">&lt; 0.5x</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-bold">Comfortable</span>
                      <span className="text-stone-500">&lt; 2 weeks rev</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="w-24 font-bold text-blue-600">0.5x - 1.0x</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold">Manageable</span>
                      <span className="text-stone-500">&lt; 1 month rev</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="w-24 font-bold text-yellow-600">1.0x - 2.0x</span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">Stretched</span>
                      <span className="text-stone-500">1-2 months rev</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="w-24 font-bold text-red-600">&gt; 2.0x</span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-bold">High Burden</span>
                      <span className="text-stone-500">&gt; 2 months rev</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-stone-100 p-6 rounded-xl text-sm text-stone-600">
                  <strong>Industry Context:</strong><br/>
                  Revenue-based lenders (Wayflyer, Clearco) typically cap advances at 1.0x - 1.5x monthly revenue to prevent over-leverage. We display this metric prominently so lenders can assess the burden themselves.
                </div>
              </div>
            </section>

            {/* 6. Privacy */}
            <section>
              <SectionHeading id="privacy" title="Privacy-First Design" icon={LockClosedIcon} />
              
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-stone-50 text-stone-900 font-bold border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-4">We Don't Show (Raw Data)</th>
                      <th className="px-6 py-4">We Show (Signals)</th>
                      <th className="px-6 py-4">Why?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="px-6 py-4 text-stone-400 font-mono">$8,542 / month</td>
                      <td className="px-6 py-4 text-brand-700 font-bold">Revenue: Strong</td>
                      <td className="px-6 py-4 text-stone-600">Protects sensitive financials</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-stone-400 font-mono">184 orders</td>
                      <td className="px-6 py-4 text-brand-700 font-bold">Volume: Steady</td>
                      <td className="px-6 py-4 text-stone-600">Protects competitive advantage</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-stone-400 font-mono">+14.2% growth</td>
                      <td className="px-6 py-4 text-brand-700 font-bold">Trend: Positive</td>
                      <td className="px-6 py-4 text-stone-600">Qualitative signal is sufficient</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. Data Sources */}
            <section>
              <SectionHeading id="sources" title="Verified Data Sources" icon={ArrowPathIcon} />
              <div className="grid md:grid-cols-3 gap-6">
                {/* Shopify */}
                <div className="border border-stone-200 rounded-xl p-5 flex flex-col items-center text-center hover:border-brand-300 transition-colors">
                  <div className="w-12 h-12 bg-[#96bf48] rounded-full flex items-center justify-center mb-3 text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.5 4.5l2.5 15L12 24l8-4.5 2.5-15L12 0zm0 21.5l-6-3.5-2-12L12 2.5l8 3.5-2 12-6 3.5z"/></svg>
                  </div>
                  <h4 className="font-bold text-stone-900">Shopify</h4>
                  <p className="text-xs text-stone-500 mt-1">Orders, Revenue, Refunds</p>
                </div>
                {/* Stripe */}
                <div className="border border-stone-200 rounded-xl p-5 flex flex-col items-center text-center hover:border-brand-300 transition-colors">
                  <div className="w-12 h-12 bg-[#635BFF] rounded-full flex items-center justify-center mb-3 text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.9 10.5c-2.2-.8-3.4-1.4-3.4-2.4 0-.8.7-1.3 1.9-1.3 2.2 0 4.5.9 6.1 1.6l.9-5.5C18.3 1 15.7 0 12.2 0 9.7 0 7.6.7 6.1 1.9 4.6 3.1 3.8 5 3.8 7.2c0 4 2.5 5.8 6.5 7.2 2.6.9 3.4 1.6 3.4 2.6 0 1-.8 1.5-2.4 1.5-1.9 0-5-.9-7-2.1l-.9 5.6C5.2 23 8.4 24 11.7 24c2.6 0 4.8-.6 6.3-1.8 1.7-1.3 2.5-3.2 2.5-5.7 0-4.1-2.5-5.9-6.6-7.3z"/></svg>
                  </div>
                  <h4 className="font-bold text-stone-900">Stripe</h4>
                  <p className="text-xs text-stone-500 mt-1">Transaction Volume & History</p>
                </div>
                {/* Square */}
                <div className="border border-stone-200 rounded-xl p-5 flex flex-col items-center text-center hover:border-brand-300 transition-colors">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-3 text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 0h16c2.2 0 4 1.8 4 4v16c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4zm11.3 7H8.7v10h2.2v-3.5h4.5c2.4 0 4-1.3 4-3.2 0-1.9-1.6-3.2-4-3.2zm-.1 4.7H10.8V8.8h4.4c1.1 0 1.9.7 1.9 1.5 0 .8-.8 1.5-1.9 1.5z"/></svg>
                  </div>
                  <h4 className="font-bold text-stone-900">Square</h4>
                  <p className="text-xs text-stone-500 mt-1">POS & Offline Sales</p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-stone-900 rounded-3xl p-10 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">See Your Score</h2>
              <p className="text-stone-300 mb-8 max-w-2xl mx-auto">
                Connecting your accounts is safe, read-only, and takes less than 2 minutes.
                See where you stand before you apply.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/create-loan"
                  className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-colors"
                >
                  Check Eligibility
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-transparent border border-stone-700 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
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