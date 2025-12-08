'use client';

import { use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { mockLoans } from '@/lib/mockData';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const loan = mockLoans.find((l) => l.id === id) || mockLoans[0];
  const progress = (loan.funded / loan.amount) * 100;

  const mockFunders = [
    { name: 'Sarah Mitchell', amount: 500, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    { name: 'John Davis', amount: 250, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
    { name: 'Emily Rodriguez', amount: 1000, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
    { name: 'Michael Brown', amount: 200, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
    { name: 'Anonymous', amount: 100, avatar: null },
  ];

  const daysLeft = 12;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Image - Full Bleed */}
      <div className="w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] overflow-hidden md:rounded-xl md:mt-4 md:mb-0">
            <img
              src={loan.coverImage}
              alt={loan.businessName}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 pt-4 pb-32 lg:pb-12">
        {/* Two Column Layout - 60/40 split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-3">
            {/* Title Section */}
            <div className="pb-6 border-b border-gray-200">
              <h1 className="text-[26px] md:text-[32px] font-semibold text-gray-900 leading-tight">
                {loan.purpose}
              </h1>
            </div>

            {/* Borrower Card */}
            <div className="py-6 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <img
                  src={loan.avatar}
                  alt={loan.borrowerName}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="text-[16px] font-semibold text-gray-900 mb-1">
                    Organized by {loan.borrowerName}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-500">
                    <span>{loan.businessName}</span>
                  </div>
                  {/* Verification badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[12px]">
                      <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified identity
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-[12px]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Revenue verified via Shopify
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signals - Verification Badges (privacy-compliant) */}
            <div className="py-6 border-b border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold text-green-700">Revenue Verified</div>
                  <div className="text-[11px] text-green-600">via Shopify</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold text-green-700">Established</div>
                  <div className="text-[11px] text-green-600">1+ years active</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold text-green-700">Growing</div>
                  <div className="text-[11px] text-green-600">Revenue trending up</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-[13px] font-semibold text-green-700">Active Sales</div>
                  <div className="text-[11px] text-green-600">Regular orders</div>
                </div>
              </div>
            </div>

            {/* About the Business */}
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-[16px] font-medium text-gray-900 mb-3">About the Business</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-normal text-[15px]">
                {loan.story}
              </p>
            </div>

            {/* Use of Funds */}
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-[16px] font-medium text-gray-900 mb-3">Use of Funds</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-normal text-[15px]">
                The funds will be used to purchase a commercial-grade oven that can handle higher volume production. This will allow me to take on larger wholesale orders from local cafes and restaurants, potentially doubling my monthly revenue within 6 months.
              </p>
            </div>

            {/* Loan Terms - Airbnb Style */}
            <div className="py-6">
              <h2 className="text-[16px] font-medium text-gray-900 mb-4">Loan Details</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">0% interest rate</div>
                    <div className="text-[14px] text-gray-500">Pay back exactly what you borrow</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">1.0x repayment</div>
                    <div className="text-[14px] text-gray-500">Full principal returned to lenders</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">{loan.duration} month term</div>
                    <div className="text-[14px] text-gray-500">Repayment deadline for this loan</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">Fundraising ends Dec 20, 2024</div>
                    <div className="text-[14px] text-gray-500">Last day to contribute to this loan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar - Right Column */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-[22px] font-semibold text-gray-900">{formatCurrency(loan.funded)}</span>
                    <span className="text-[15px] text-gray-500 font-normal">of {formatCurrency(loan.amount)} goal</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-brand-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-5">
                  <button className="block w-full text-center px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-[16px] font-semibold rounded-full transition-all active:scale-[0.98]">
                    Fund this Loan
                  </button>

                  <button className="block w-full text-center px-6 py-3.5 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-full transition-all active:scale-[0.98]">
                    Share
                  </button>
                </div>

                {/* Stats below buttons */}
                <div className="text-[13px] text-gray-500 text-center mb-4">
                  <span className="font-medium text-gray-700">{loan.fundersCount}</span> backers
                  <span className="mx-2">·</span>
                  <span className="font-medium text-gray-700">{daysLeft}</span> days left
                </div>

                {/* Recent Contributors */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Supporters</h3>
                  <div className="space-y-0 max-h-[300px] overflow-y-auto">
                    {mockFunders.map((funder, i) => (
                      <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                        {funder.avatar ? (
                          <img
                            src={funder.avatar}
                            alt={funder.name}
                            className="w-10 h-10 rounded-full bg-gray-100 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                            {funder.name[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold text-gray-900 truncate">
                            {funder.name}
                          </div>
                          <div className="text-[12px] text-gray-500">
                            {formatCurrency(funder.amount)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-3 z-40">
        <div className="flex items-center justify-between gap-4">
          {/* Price Summary */}
          <div className="flex-shrink-0">
            <div className="text-[16px] font-bold text-gray-900">{formatCurrency(loan.funded)}</div>
            <div className="text-[12px] text-gray-500">of {formatCurrency(loan.amount)}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="px-4 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full active:scale-[0.98]">
              Share
            </button>
            <button className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-full active:scale-[0.98]">
              Fund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
