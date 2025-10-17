'use client';

import TabNavigation from '../../components/TabNavigation';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function SupportingPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        sdk.actions.ready();
        console.log('[SupportingPage] Farcaster Mini App ready signal sent');
      } catch (error) {
        console.error('[SupportingPage] Error sending ready signal:', error);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Not supporting anyone yet</h2>
          <p className="text-sm text-gray-600 mb-4">
            Browse the feed to find loans to support
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Browse Loans
          </a>
        </div>
      </div>
    </div>
  );
}
