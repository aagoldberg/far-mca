'use client';

import Link from 'next/link';
import LoanList from '../components/LoanList';

export default function HomePage() {
  return (
    <div className="frame-container">
      <div className="w-full p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                LendFriend
              </h1>
              <p className="text-sm text-gray-600">
                Zero-interest community loans
              </p>
            </div>
            <Link
              href="/create"
              className="px-4 py-2 bg-[#2E7D32] hover:bg-[#4CAF50] text-white text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              + Create Loan
            </Link>
          </div>
        </div>

        {/* Active Loans */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Available Loans
        </h2>

        <LoanList />
      </div>
    </div>
  );
}
