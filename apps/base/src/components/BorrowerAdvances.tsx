'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useBorrowerLoans } from '@/hooks/useMicroLoan';
import AdvanceCard from './AdvanceCard';
import Link from 'next/link';
import {
  DocumentTextIcon,
  BanknotesIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

type FilterType = 'all' | 'fundraising' | 'active' | 'completed';

export default function BorrowerAdvances() {
  const { address, isConnected } = useAccount();
  const { loanAddresses, isLoading } = useBorrowerLoans(address);
  const [filter, setFilter] = useState<FilterType>('all');

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] rounded-full opacity-20 blur-xl" />
            <DocumentTextIcon className="relative w-16 h-16 text-[#2E8B8B] mx-auto" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] bg-clip-text text-transparent mb-3">
            My Loans
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Connect your wallet to view and manage your loan requests
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center px-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E8B8B]"></div>
          <SparklesIcon className="absolute inset-0 w-6 h-6 text-[#2E8B8B] m-auto animate-pulse" />
        </div>
      </div>
    );
  }

  const loanAddressesList = loanAddresses || [];

  // Note: Stats are calculated by the AdvanceCard components individually
  // We can't filter by status without loading all loan data first

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/30">
      {/* Enhanced Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] rounded-full opacity-20 blur-md" />
              <DocumentTextIcon className="relative w-10 h-10 text-[#2E8B8B]" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] bg-clip-text text-transparent">
              My Loans
            </h1>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
            Manage your loan requests and track funding progress. Each loan tells your story of ambition and community support.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="group bg-white/90 backdrop-blur-sm border-2 border-gray-100 rounded-2xl p-6 hover:border-[#2E8B8B] hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Requests</p>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DocumentTextIcon className="w-6 h-6 text-[#2C7DA0]" />
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#2C7DA0] to-[#2E8B8B] bg-clip-text text-transparent">
              {loanAddressesList.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Active loan requests</p>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm border-2 border-gray-100 rounded-2xl p-6 hover:border-[#2E8B8B] hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Funds Raised</p>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BanknotesIcon className="w-6 h-6 text-[#3B9B7F]" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[#3B9B7F]">-</p>
            <p className="text-xs text-gray-500 mt-2">Total USDC received</p>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm border-2 border-gray-100 rounded-2xl p-6 hover:border-[#2E8B8B] hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Repaid</p>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowPathIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-emerald-600">-</p>
            <p className="text-xs text-gray-500 mt-2">USDC returned to community</p>
          </div>
        </div>

        {/* Loan List */}
        {loanAddressesList.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] rounded-full opacity-10 blur-2xl" />
              <RocketLaunchIcon className="relative w-20 h-20 text-[#2E8B8B] mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Launch Your Dream?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              You haven't created any loan requests yet. Share your vision with your community and get the support you need to make it happen.
            </p>
            <Link
              href="/create-loan"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] hover:shadow-xl text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <PlusCircleIcon className="w-6 h-6" />
              Create Your First Loan Request
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Zero interest • Community-powered • Your story matters
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {loanAddressesList.map(loanAddress => (
                <AdvanceCard key={loanAddress} loanAddress={loanAddress} />
              ))}
            </div>

            {/* Create New Loan CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/create-loan"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm border-2 border-[#2E8B8B] text-[#2E8B8B] hover:bg-gradient-to-r hover:from-[#2C7DA0] hover:via-[#2E8B8B] hover:to-[#3B9B7F] hover:text-white font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
              >
                <PlusCircleIcon className="w-6 h-6" />
                Create Another Loan Request
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
