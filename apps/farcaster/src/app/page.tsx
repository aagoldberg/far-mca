'use client';

import Link from 'next/link';
import LoanList from '../components/LoanList';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function HomePage() {
  useEffect(() => {
    // Call ready() when the page loads
    const timer = setTimeout(() => {
      try {
        sdk.actions.ready();
        console.log('[HomePage] Farcaster Mini App ready signal sent');
      } catch (error) {
        console.error('[HomePage] Error sending ready signal:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
                Neighbors helping neighbors thrive
              </p>
            </div>
            <Link
              href="/create"
              className="px-4 py-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              + Request Support
            </Link>
          </div>
        </div>

        {/* Active Loans */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Ways to Help
        </h2>

        <LoanList />
      </div>
    </div>
  );
}
