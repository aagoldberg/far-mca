'use client';

import BusinessConnectionManager from '@/components/BusinessConnectionManager';
import Link from 'next/link';
import {
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function CreditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] rounded-full opacity-20 blur-md" />
                  <ChartBarIcon className="relative w-10 h-10 text-[#2E8B8B]" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] bg-clip-text text-transparent">
                  Business Credit Score
                </h1>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Connect your business platforms to verify revenue streams and unlock financing opportunities
              </p>
            </div>

            <Link
              href="/request-funding"
              className="group flex items-center gap-2 bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap self-start sm:self-center"
            >
              Request Funding
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BusinessConnectionManager />
      </div>
    </div>
  );
}
