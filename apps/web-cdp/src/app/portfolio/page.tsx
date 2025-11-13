'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { InvestorPortfolio } from '@/components/InvestorPortfolio';
import Link from 'next/link';
import {
  HeartIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function PortfolioPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  // Redirect if not authenticated
  if (ready && !authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] rounded-full opacity-20 blur-xl" />
            <HeartIcon className="relative w-16 h-16 text-[#2E8B8B] mx-auto" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] bg-clip-text text-transparent mb-3">
            Supporting
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Track your community impact and see the lives you've helped transform through zero-interest loans
          </p>
          <button
            onClick={login}
            className="w-full bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            Sign In to View Your Impact
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E8B8B]"></div>
          <SparklesIcon className="absolute inset-0 w-6 h-6 text-[#2E8B8B] m-auto animate-pulse" />
        </div>
      </div>
    );
  }

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
                  <HeartIcon className="relative w-10 h-10 text-[#2E8B8B]" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] bg-clip-text text-transparent">
                  Supporting
                </h1>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Your generosity creates ripples of change. Track the lives you're helping transform through interest-free community support.
              </p>
            </div>

            <Link
              href="/"
              className="group flex items-center gap-2 bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap self-start sm:self-center"
            >
              Discover More Lives to Support
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InvestorPortfolio />
      </div>
    </div>
  );
}