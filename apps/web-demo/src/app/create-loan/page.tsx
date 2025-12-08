'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { mockConnectedStore } from '@/lib/mockData';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CreateLoanPage() {
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(6);
  const [purpose, setPurpose] = useState('New commercial oven');
  const [story, setStory] = useState(
    "I've been running my bakery for 3 years and my old oven finally gave out. A new commercial oven will help me double my production capacity and take on more wholesale orders."
  );

  const maxLoan = Math.round(mockConnectedStore.monthlyRevenue * 0.8);
  const monthlyPayment = Math.round(amount / duration);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Create Your Loan Request
        </h1>
        <p className="text-stone-600 mb-8">
          Request a 0% interest loan backed by your verified sales revenue
        </p>

        {/* Connected Store Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-stone-900">
                  {mockConnectedStore.name}
                </div>
                <div className="text-sm text-stone-500">
                  Connected via {mockConnectedStore.platform}
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Verified
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
            <div>
              <div className="text-2xl font-bold text-stone-900">
                {formatCurrency(mockConnectedStore.monthlyRevenue)}
              </div>
              <div className="text-sm text-stone-500">Monthly Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900">
                {mockConnectedStore.monthsActive}
              </div>
              <div className="text-sm text-stone-500">Months Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                +{mockConnectedStore.revenueGrowth}%
              </div>
              <div className="text-sm text-stone-500">Growth (YoY)</div>
            </div>
          </div>
        </div>

        {/* Loan Form */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 text-2xl font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-stone-500">
                Max available: {formatCurrency(maxLoan)}
              </span>
              <span className="text-brand-600">
                Based on your verified revenue
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={maxLoan}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-2 accent-brand-600"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Repayment Duration
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[3, 6, 9, 12].map((months) => (
                <button
                  key={months}
                  onClick={() => setDuration(months)}
                  className={`py-3 rounded-xl border-2 font-medium transition-all ${
                    duration === months
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  {months} months
                </button>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="What will you use this loan for?"
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Your Story
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={4}
              placeholder="Tell potential supporters about your business and why you need this loan..."
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Summary */}
          <div className="bg-stone-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-stone-600">Loan Amount</span>
              <span className="font-semibold text-stone-900">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Interest Rate</span>
              <span className="font-semibold text-green-600">0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Monthly Payment</span>
              <span className="font-semibold text-stone-900">
                ~{formatCurrency(monthlyPayment)}/mo
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-stone-200">
              <span className="text-stone-600">Total to Repay</span>
              <span className="font-bold text-lg text-stone-900">
                {formatCurrency(amount)}
              </span>
            </div>
          </div>

          <button className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg rounded-full transition-colors">
            Create Loan Request
          </button>

          <p className="text-center text-sm text-stone-500">
            Your loan will be visible to your community once created
          </p>
        </div>
      </div>
    </div>
  );
}
