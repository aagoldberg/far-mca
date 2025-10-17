'use client';

import TabNavigation from '../../components/TabNavigation';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function MyLoansPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        sdk.actions.ready();
        console.log('[MyLoansPage] Farcaster Mini App ready signal sent');
      } catch (error) {
        console.error('[MyLoansPage] Error sending ready signal:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="frame-container">
      {/* Tab Navigation */}
      <TabNavigation />

      {/* Content */}
      <div className="w-full p-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No loans yet</h2>
          <p className="text-sm text-gray-600 mb-4">
            You haven't created any loan requests
          </p>
          <a
            href="/create"
            className="inline-block px-4 py-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Create Your First Loan
          </a>
        </div>
      </div>
    </div>
  );
}
