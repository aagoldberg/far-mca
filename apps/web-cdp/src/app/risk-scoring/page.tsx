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
      <div className="w-36 text-sm font-medium text-gray-600">{label}</div>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="w-24 text-sm font-bold text-gray-900 text-right">{tier}</div>
    </div>
  );
}

function SectionHeading({ id, title, subtitle, chapter }: { id: string, title: string, subtitle?: string, chapter?: string }) {
  return (
    <div id={id} className="scroll-mt-28 mb-8 pt-8">
      {chapter && (
        <span className="text-brand-600 font-bold uppercase tracking-widest text-xs block mb-2">
          {chapter}
        </span>
      )}
      <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h2>
      {subtitle && <p className="text-lg text-gray-500 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

function ComponentCard({
  title,
  weight,
  metric,
  formula,
  formulaExplanation,
  description,
  minimum,
  thresholds
}: {
  title: string;
  weight: string;
  metric: string;
  formula: string;
  formulaExplanation: string;
  description: string;
  minimum: string;
  thresholds: { label: string; score: string; color: string }[];
}) {
  return (
    <details className="group bg-white rounded-2xl border border-gray-200 overflow-hidden open:shadow-md transition-all">
      {/* Header (Summary) */}
      <summary className="cursor-pointer list-none px-6 py-5 border-b border-transparent group-open:border-gray-100 transition-colors hover:bg-gray-50 select-none">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
              <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-gray-900">{weight}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Weight</div>
          </div>
        </div>
      </summary>

      {/* Body (Details) */}
      <div className="p-6 pt-2 animate-in slide-in-from-top-2 fade-in-50">
        {/* Formula */}
        <div className="mb-5 p-4 bg-gray-50 rounded-lg">
          <div className="font-mono text-sm text-gray-700 mb-1">{formula}</div>
          <div className="text-xs text-gray-500">{formulaExplanation}</div>
        </div>

        {/* Thresholds - Simple list */}
        <div className="mb-5">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Thresholds</div>
          <div className="space-y-1">
            {thresholds.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1.5">
                <span className="text-gray-600">{t.label}</span>
                <span className={`font-mono font-medium ${
                  t.color === 'green' ? 'text-green-600' :
                  t.color === 'blue' ? 'text-blue-600' :
                  t.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                }`}>{t.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Requirement */}
        <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span className="font-medium">Min. data:</span> {minimum}
        </div>
      </div>
    </details>
  );
}

export default function RiskScoringPage() {
  const [activeSection, setActiveSection] = useState('health');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['health', 'weights', 'methodology', 'grades', 'affordability', 'foundation', 'privacy', 'inclusive'];
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <ShieldCheckIcon className="w-4 h-4" />
              Transparency Report
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              Business Health &<br />Affordability
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              We evaluate every application on two independent factors: the quality of the business and the safety of the loan.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Contents</h3>
              <nav className="space-y-8">
                <div>
                  <p className="px-3 text-xs font-semibold text-brand-600 mb-3 tracking-wide uppercase">Part 1: Health</p>
                  <div className="space-y-1">
                    {[
                      { id: 'health', label: 'Overview' },
                      { id: 'weights', label: 'Components' },
                      { id: 'methodology', label: 'Methodology' },
                      { id: 'grades', label: 'Grade System' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeSection === item.id ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="px-3 text-xs font-semibold text-blue-600 mb-3 tracking-wide uppercase">Part 2: Safety</p>
                  <div className="space-y-1">
                    {[
                      { id: 'affordability', label: 'Affordability Check' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeSection === item.id ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="px-3 text-xs font-semibold text-gray-500 mb-3 tracking-wide uppercase">Part 3: Foundation</p>
                  <div className="space-y-1">
                    {[
                      { id: 'foundation', label: 'Data Sources' },
                      { id: 'privacy', label: 'Privacy' },
                      { id: 'inclusive', label: 'Inclusive Design' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeSection === item.id ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-16">

            {/* Intro / Roadmap */}
            <div className="prose text-gray-600 max-w-none border-b border-gray-200 pb-12">
              <p className="text-xl leading-relaxed">
                Our assessment process is divided into three parts to give lenders a complete picture without exposing sensitive merchant data.
              </p>
              <ul className="mt-6 space-y-4 list-none pl-0">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <strong className="text-gray-900 block">Business Health</strong>
                    Measures the quality and stability of the business (0-100 Score).
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <strong className="text-gray-900 block">Loan Safety</strong>
                    Checks if the specific loan amount is affordable given current revenue.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <strong className="text-gray-900 block">Data Foundation</strong>
                    Explains how we verify sources and protect privacy.
                  </div>
                </li>
              </ul>
            </div>

            {/* ================= PART 1: BUSINESS HEALTH ================= */}
            <div>
              <SectionHeading
                id="health"
                chapter="Part 1"
                title="Business Health Score"
                subtitle="Measures the quality and stability of the business."
              />

              {/* Example Calculation Card */}
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 block">Example Calculation</span>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">The Metric</div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Business Health Score</h3>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">Grade A (82/100)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <ScoreBar label="Revenue Stability" value={85} tier="85/100" />
                  <ScoreBar label="Business Tenure" value={100} tier="100/100" />
                  <ScoreBar label="Growth Trend" value={72} tier="72/100" />
                  <ScoreBar label="Order Consistency" value={90} tier="90/100" />
                </div>
              </div>

              {/* Weights */}
              <div id="weights" className="scroll-mt-32 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Score Components</h3>
                {/* Visual Weight Bar */}
                <div className="flex h-12 w-full rounded-xl overflow-hidden mb-4 shadow-sm border border-gray-200">
                  <div className="bg-brand-600 w-[35%] flex items-center justify-center text-white font-bold text-sm border-r border-white/20">35%</div>
                  <div className="bg-brand-500 w-[25%] flex items-center justify-center text-white font-bold text-sm border-r border-white/20">25%</div>
                  <div className="bg-brand-400 w-[20%] flex items-center justify-center text-white font-bold text-sm border-r border-white/20">20%</div>
                  <div className="bg-brand-300 w-[20%] flex items-center justify-center text-white font-bold text-sm">20%</div>
                </div>
                <div className="flex text-xs text-gray-500 justify-between px-1">
                  <span>Revenue Stability</span>
                  <span>Order Consistency</span>
                  <span>Tenure</span>
                  <span>Growth</span>
                </div>
              </div>

              {/* Methodology */}
              <div id="methodology" className="scroll-mt-32 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Detailed Methodology</h3>
                <div className="grid gap-6">
                  <ComponentCard
                    title="Revenue Stability"
                    weight="35%"
                    metric="CV of Monthly Revenue"
                    formula="CV = (σ / μ) × 100"
                    formulaExplanation="Standard deviation (σ) of monthly revenue divided by mean (μ) monthly revenue. Lower CV indicates higher stability."
                    description="Month-over-month consistency is the strongest predictor of repayment per FinRegLab research."
                    minimum="3+ months data"
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
                    metric="CV of Weekly Orders"
                    formula="CV = (σ / μ) × 100"
                    formulaExplanation="Standard deviation (σ) of weekly order counts divided by mean (μ) weekly orders. Lower CV indicates reliable demand."
                    description="Steady transaction patterns indicate reliable demand."
                    minimum="4+ weeks data"
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
                    metric="Months Active"
                    formula="tenure = (today - firstOrderDate) / 30"
                    formulaExplanation="Days since first verified transaction, converted to months."
                    description="Track record matters, but is weighted lower than cash flow."
                    minimum="First order date"
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
                    metric="Rev Change (Recent vs Prior)"
                    formula="growth = ((recentRev - priorRev) / priorRev) × 100"
                    formulaExplanation="Orders split at data midpoint. Compares total revenue in second half vs first half of available data."
                    description="Sustainable growth (10-30%) scores highest."
                    minimum="45+ days data"
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
              </div>

              {/* Grades */}
              <div id="grades" className="scroll-mt-32">
                <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Grade Output</h3>
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
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* ================= PART 2: LOAN AFFORDABILITY ================= */}
            <div>
              <SectionHeading 
                id="affordability" 
                chapter="Part 2"
                title="Loan Affordability Check" 
                subtitle="Measures whether this specific loan amount is appropriate for the business's revenue." 
              />

              {/* Example Calculation Card */}
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 block">Example Calculation</span>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">The Metric</div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Loan Affordability</h3>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">Comfortable (0.4x)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Data Points */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Loan Request</div>
                      <div className="text-xl font-bold text-gray-900">$5,000</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                      <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Monthly Revenue</div>
                      <div className="text-xl font-bold text-stone-900">$12,500</div>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-medium text-stone-500 mb-2">
                      <span>0x</span>
                      <span className="text-brand-600 font-bold">Current: 0.4x</span>
                      <span>2.0x+</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full w-[25%] bg-green-100"></div>
                      <div className="absolute top-0 left-[25%] h-full w-[25%] bg-blue-100"></div>
                      <div className="absolute top-0 left-[50%] h-full w-[25%] bg-amber-100"></div>
                      <div className="absolute top-0 left-[75%] h-full w-[25%] bg-red-100"></div>
                      <div className="absolute top-0 h-full w-1 bg-gray-900 z-10" style={{ left: '20%' }}></div>
                    </div>
                    <div className="flex text-[9px] md:text-[10px] text-gray-400 mt-1 text-center">
                      <span className="w-[25%]">Comfortable</span>
                      <span className="w-[25%]">Manageable</span>
                      <span className="w-[25%]">Stretched</span>
                      <span className="w-[25%] text-red-400 font-medium">High Burden</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Methodology Card */}
              <ComponentCard
                title="Loan-to-Revenue Ratio"
                weight="Safety Check"
                metric="Ratio Calculation"
                formula="Ratio = Loan Amount ÷ Avg Monthly Revenue"
                formulaExplanation="We compare the requested principal against the verified average monthly revenue from the last 3 months."
                description="Ensures the business isn't over-leveraging itself. This assessment assigns a risk tier separate from the quality score, allowing lenders to decide their own risk tolerance."
                minimum="3 months revenue history"
                thresholds={[
                  { label: 'Comfortable', score: '< 0.5x', color: 'green' },
                  { label: 'Manageable', score: '0.5x - 1.0x', color: 'blue' },
                  { label: 'Stretched', score: '1.0x - 2.0x', color: 'yellow' },
                  { label: 'High Burden', score: '> 2.0x', color: 'red' },
                ]}
              />

              {/* Tier Output */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Tier Output</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { tier: 'Comfortable', range: '< 0.5x', label: 'Low burden', color: 'green' },
                    { tier: 'Manageable', range: '0.5-1.0x', label: 'Moderate burden', color: 'blue' },
                    { tier: 'Stretched', range: '1.0-2.0x', label: 'Heavy burden', color: 'amber' },
                    { tier: 'High Burden', range: '> 2.0x', label: 'Over-leveraged', color: 'red' },
                  ].map((item) => (
                    <div
                      key={item.tier}
                      className={`p-5 rounded-xl text-center border-2
                        ${item.color === 'green' ? 'bg-green-50 border-green-200' : ''}
                        ${item.color === 'blue' ? 'bg-blue-50 border-blue-200' : ''}
                        ${item.color === 'amber' ? 'bg-amber-50 border-amber-200' : ''}
                        ${item.color === 'red' ? 'bg-red-50 border-red-200' : ''}
                      `}
                    >
                      <div className={`text-lg font-bold mb-1
                        ${item.color === 'green' ? 'text-green-600' : ''}
                        ${item.color === 'blue' ? 'text-blue-600' : ''}
                        ${item.color === 'amber' ? 'text-amber-600' : ''}
                        ${item.color === 'red' ? 'text-red-600' : ''}
                      `}>
                        {item.tier}
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
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* ================= PART 3: FOUNDATION ================= */}
            <div>
              <SectionHeading id="foundation" chapter="Part 3" title="Data Foundation" />
              
              <div id="sources" className="scroll-mt-32 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Verified Data Sources</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { name: 'Shopify', color: '#96bf48', metrics: 'Orders, Revenue' },
                    { name: 'Stripe', color: '#635BFF', metrics: 'Charges, Payouts' },
                    { name: 'Square', color: '#000000', metrics: 'POS Transactions' },
                  ].map((platform) => (
                    <div key={platform.name} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                      <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center text-white font-bold" style={{ backgroundColor: platform.color }}>
                        {platform.name[0]}
                      </div>
                      <div className="font-bold text-gray-900">{platform.name}</div>
                      <div className="text-xs text-gray-500">{platform.metrics}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="privacy" className="scroll-mt-32 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Privacy Design</h3>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-600">
                    We calculate these scores server-side and only display the <strong>Grade</strong> and <strong>Tier</strong> to the public. Raw financial data (exact revenue dollars) is never exposed, protecting the merchant's competitive advantage.
                  </p>
                </div>
              </div>

              <div id="inclusive" className="scroll-mt-32">
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Inclusive Design Philosophy</h3>
                <p className="text-gray-600 mb-6">
                  As an inclusive, mission-based fintech, we intentionally choose language and visuals that frame every business as being on a growth journey—not as passing or failing a test. Our terminology draws from research on{' '}
                  <a href="https://www.tandfonline.com/doi/full/10.1080/23311975.2025.2549511" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline hover:text-brand-700">inclusive fintech</a>{' '}
                  and{' '}
                  <a href="https://www.fdic.gov/analysis/cfr/working-papers/2018/cfr-wp2018-04.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline hover:text-brand-700">alternative credit scoring</a>.
                </p>

                <div className="space-y-4">
                  {/* Tier Labels */}
                  <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <summary className="cursor-pointer list-none px-6 py-4 hover:bg-gray-50 select-none">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-gray-900">Tier Labels</div>
                        <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">How we name score tiers to avoid judgment</p>
                    </summary>
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-4">
                        Traditional systems use A/B/C/D letter grades, which carry school-grade associations where "D" implies failure. We evaluated several alternatives:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 pr-4 font-medium text-gray-500">Score</th>
                              <th className="text-left py-2 pr-4 font-medium text-gray-500">Traditional</th>
                              <th className="text-left py-2 pr-4 font-medium text-gray-500">Journey-Based</th>
                              <th className="text-left py-2 pr-4 font-medium text-gray-500">Numeric Tiers</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700">
                            <tr className="border-b border-gray-100">
                              <td className="py-2 pr-4">75-100</td>
                              <td className="py-2 pr-4">Grade A</td>
                              <td className="py-2 pr-4 font-medium text-green-700">Established</td>
                              <td className="py-2 pr-4">Tier 1</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 pr-4">55-74</td>
                              <td className="py-2 pr-4">Grade B</td>
                              <td className="py-2 pr-4 font-medium text-blue-700">Growing</td>
                              <td className="py-2 pr-4">Tier 2</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="py-2 pr-4">40-54</td>
                              <td className="py-2 pr-4">Grade C</td>
                              <td className="py-2 pr-4 font-medium text-amber-700">Building</td>
                              <td className="py-2 pr-4">Tier 3</td>
                            </tr>
                            <tr>
                              <td className="py-2 pr-4">0-39</td>
                              <td className="py-2 pr-4 text-gray-400">Grade D</td>
                              <td className="py-2 pr-4 font-medium text-gray-600">Emerging</td>
                              <td className="py-2 pr-4">Tier 4</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        <strong>Our choice:</strong> Journey-based labels frame every tier as a stage in the business growth journey rather than a pass/fail judgment.
                      </p>
                    </div>
                  </details>

                  {/* Color Systems */}
                  <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <summary className="cursor-pointer list-none px-6 py-4 hover:bg-gray-50 select-none">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-gray-900">Color Systems</div>
                        <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Accessible, non-judgmental color choices</p>
                    </summary>
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-4">
                        Traditional "traffic light" colors (red/yellow/green) carry implicit judgment and are problematic for colorblind users (~8% of men). We evaluated alternatives:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded bg-green-500"></div>
                            <div className="w-6 h-6 rounded bg-blue-500"></div>
                            <div className="w-6 h-6 rounded bg-amber-500"></div>
                            <div className="w-6 h-6 rounded bg-red-500"></div>
                          </div>
                          <span className="text-sm text-gray-600">Traffic light (traditional)</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded bg-green-500"></div>
                            <div className="w-6 h-6 rounded bg-blue-500"></div>
                            <div className="w-6 h-6 rounded bg-amber-500"></div>
                            <div className="w-6 h-6 rounded bg-gray-400"></div>
                          </div>
                          <span className="text-sm text-gray-600">Neutral lowest tier (gray = needs data)</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded bg-brand-700"></div>
                            <div className="w-6 h-6 rounded bg-brand-500"></div>
                            <div className="w-6 h-6 rounded bg-brand-300"></div>
                            <div className="w-6 h-6 rounded bg-gray-300"></div>
                          </div>
                          <span className="text-sm text-gray-600">Single-hue gradient (no judgment)</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        <strong>Our choice:</strong> Gray for the lowest tier implies "needs more data" rather than "bad," removing the red "danger" signal.
                      </p>
                    </div>
                  </details>

                  {/* Why This Matters */}
                  <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <summary className="cursor-pointer list-none px-6 py-4 hover:bg-gray-50 select-none">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-gray-900">Why This Matters</div>
                        <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">The case for inclusive credit language</p>
                    </summary>
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-4">
                        Traditional credit systems exclude 1.4 billion unbanked adults globally—often labeling them as "high risk" simply because they lack data. Inclusive fintech research suggests:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex gap-2">
                          <span className="text-brand-600">•</span>
                          <span><strong>Focus on what they lack</strong> (data, history) rather than who they are</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-brand-600">•</span>
                          <span><strong>Frame trajectory</strong> (developing, building) rather than current state</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-brand-600">•</span>
                          <span><strong>Use opportunity language</strong>—"emerging" populations, not "risky" ones</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-brand-600">•</span>
                          <span><strong>Accessibility</strong>—avoid red/green for colorblind users, always include text labels</span>
                        </li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-4">
                        Our goal is to help every business grow, not to gatekeep who "deserves" credit.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            {/* CTA */}
            <section className="bg-gray-900 rounded-3xl p-10 text-center text-white mt-12">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Check Your Business Health</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create-loan" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-colors">Check Eligibility</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
