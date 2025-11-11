'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon, ChartBarIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">How It Works</h1>
          <p className="text-sm opacity-90">
            From Request to Repayment
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/instructions_1b.png"
                alt="Create Your Loan"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900">Create Your Loan</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Request $100-$5K for 30-90 days. Add your story, budget breakdown, and photos. Share with friends.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/instructions_2.png"
                alt="Friends Contribute"
                fill
                className="object-cover"
                style={{ objectPosition: 'center 35%' }}
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900">Friends Contribute</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Your network sees your request. Each contribution signals trust with real money.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/instructions_3.png"
                alt="Trust Scores Calculate"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trust Scores Calculate</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We measure connection strength using mutual friends and network overlap. Close friends count more.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/instructions_4.png"
                alt="Lenders Evaluate"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900">Lenders Evaluate</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Lenders see your trust score and friend support. High-risk loans don't get funded.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/instructions_5.png"
                alt="Loan Funds or Expires"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                5
              </div>
              <h3 className="text-xl font-bold text-gray-900">Loan Funds or Expires</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Hit your goal? Funds transfer to your wallet. Miss it? All contributions return.
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src="/images/instructions_6.png"
                alt="Reputation Builds"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#3B9B7F] text-white flex items-center justify-center font-bold text-lg">
                6
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reputation Builds</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Repay on time → stronger reputation. Default → permanent on-chain record follows you across DeFi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
