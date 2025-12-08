'use client';

import { Navbar } from '@/components/Navbar';
import { LoanCard } from '@/components/LoanCard';
import { mockLoans } from '@/lib/mockData';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-white border-b border-stone-100">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-white to-secondary-50/30 opacity-70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-6 border border-brand-100/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              0% Interest Loans
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-stone-900 tracking-tight mb-6 leading-[1.1]">
              Grow with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-secondary-600">
                Community Capital.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Skip the banks. Use your verifiable sales revenue to unlock 0%
              interest loans from the people who believe in you most.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/create-loan"
                className="w-full sm:w-auto px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
              >
                Start Your Raise
              </a>
              <a
                href="#loans"
                className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-stone-50 text-stone-700 text-lg font-bold rounded-full border border-stone-200 shadow-md hover:shadow-lg transition-all"
              >
                Browse Loans
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans */}
      <div id="loans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-stone-900">Active Raises</h2>
          <span className="text-stone-500">
            {mockLoans.filter((l) => l.status === 'active').length} active
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-600">$47,500</div>
              <div className="text-stone-600 mt-1">Total Funded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600">23</div>
              <div className="text-stone-600 mt-1">Businesses Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-600">0%</div>
              <div className="text-stone-600 mt-1">Interest Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
