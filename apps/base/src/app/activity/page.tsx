'use client';

import Link from 'next/link';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';

export default function ActivityPage() {
  const { isConnected, connect, userProfile } = useMiniAppWallet();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to View</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Connect your wallet to see your activity
        </p>
        <button
          onClick={connect}
          className="px-5 py-2.5 bg-[#2C7A7B] text-white rounded-xl font-medium text-sm shadow-sm hover:bg-[#234E52] transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Your Activity</h1>

      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Start by funding a loan or creating your own
        </p>
        <Link
          href="/create-loan"
          className="text-[#2C7A7B] font-medium text-sm hover:underline"
        >
          Create your first loan →
        </Link>
      </div>
    </div>
  );
}
