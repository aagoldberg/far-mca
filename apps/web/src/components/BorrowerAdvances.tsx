'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useBorrowerLoans } from '@/hooks/useMicroLoan';
import AdvanceCard from './AdvanceCard';
import Link from 'next/link';

type FilterType = 'all' | 'fundraising' | 'active' | 'completed';

export default function BorrowerAdvances() {
  const { address, isConnected } = useAccount();
  const { loanAddresses, isLoading } = useBorrowerLoans(address);
  const [filter, setFilter] = useState<FilterType>('all');

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">
            Please connect your wallet to view your advances
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="h-24 bg-gray-200 rounded-2xl" />
            <div className="h-24 bg-gray-200 rounded-2xl" />
            <div className="h-24 bg-gray-200 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-2xl" />
            <div className="h-32 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const loanAddressesList = loanAddresses || [];

  // Note: Stats are calculated by the AdvanceCard components individually
  // We can't filter by status without loading all loan data first

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Advances</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-1">Total Loans</p>
            <p className="text-3xl font-bold text-gray-900">{loanAddressesList.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-1">USDC Received</p>
            <p className="text-3xl font-bold text-blue-600">-</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-1">USDC Repaid</p>
            <p className="text-3xl font-bold text-green-600">-</p>
          </div>
        </div>
      </div>

      {/* Loan List */}
      {loanAddressesList.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Loans Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't created any loans yet. Start by creating your first advance.
          </p>
          <Link
            href="/create-loan"
            className="inline-block px-6 py-3 bg-[#2E7D32] hover:bg-[#4CAF50] text-white font-semibold rounded-xl transition-colors"
          >
            Create Your First Loan
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {loanAddressesList.map(loanAddress => (
            <AdvanceCard key={loanAddress} loanAddress={loanAddress} />
          ))}
        </div>
      )}

      {/* Create New Loan CTA */}
      {loanAddressesList.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/create-loan"
            className="inline-block px-6 py-3 bg-white border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white font-semibold rounded-xl transition-all"
          >
            + Create New Loan
          </Link>
        </div>
      )}
    </div>
  );
}
