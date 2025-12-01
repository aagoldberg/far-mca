'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConnectionSuccessContent() {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform') || 'Account';
  const score = searchParams.get('score');
  const dataAccessPending = searchParams.get('dataAccessPending') === 'true';
  const error = searchParams.get('error');

  const platformNames: Record<string, string> = {
    shopify: 'Shopify',
    stripe: 'Stripe',
    square: 'Square',
  };

  const displayName = platformNames[platform.toLowerCase()] || platform;

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Return to the LendFriend app in Warpcast and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {displayName} Connected!
        </h1>

        {/* Score Display */}
        {score && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Your Credit Score</p>
            <p className="text-4xl font-bold text-blue-600">{score}</p>
            <p className="text-xs text-gray-500 mt-1">out of 100</p>
          </div>
        )}

        {/* Data Access Note */}
        {dataAccessPending && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
            <p className="text-sm text-yellow-800">
              Revenue data pending approval. Your score will improve once data access is granted.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-gray-700 font-medium mb-2">
            You can close this tab now
          </p>
          <p className="text-sm text-gray-500">
            Return to the LendFriend app in Warpcast to continue your loan application.
          </p>
        </div>

        {/* Visual hint */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Go back to Warpcast</span>
        </div>
      </div>
    </div>
  );
}

export default function ConnectionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <ConnectionSuccessContent />
    </Suspense>
  );
}
