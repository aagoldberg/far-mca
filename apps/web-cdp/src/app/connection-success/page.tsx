'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ConnectionSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const platform = searchParams.get('platform') || 'Account';
  const initialScore = searchParams.get('score');
  const dataAccessPending = searchParams.get('dataAccessPending') === 'true';
  const error = searchParams.get('error');
  const draft = searchParams.get('draft');
  const wallet = searchParams.get('wallet');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(initialScore);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const platformNames: Record<string, string> = {
    shopify: 'Shopify',
    stripe: 'Stripe',
    square: 'Square',
  };

  const displayName = platformNames[platform.toLowerCase()] || platform;

  // Refresh score from connected platforms
  const refreshScore = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setCountdown(0); // Pause auto-redirect

    try {
      // Get wallet from URL or try to infer from context
      const walletAddress = wallet;
      if (!walletAddress) {
        console.warn('No wallet address available for refresh');
        setIsRefreshing(false);
        return;
      }

      // First refresh the connection data
      const refreshResponse = await fetch('/api/connections/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      if (refreshResponse.ok) {
        // Then get the updated score
        const scoreResponse = await fetch(`/api/credit-score?walletAddress=${walletAddress}`);
        if (scoreResponse.ok) {
          const data = await scoreResponse.json();
          setScore(data.score?.toString() || '0');
        }
      }
    } catch (error) {
      console.error('Failed to refresh score:', error);
    } finally {
      setIsRefreshing(false);
      setCountdown(3); // Resume countdown
    }
  };

  // Build redirect URL with step and optional draft
  const getRedirectUrl = () => {
    let url = '/create-loan?step=2';
    if (draft) {
      url += `&draft=${encodeURIComponent(draft)}`;
    }
    return url;
  };

  // Auto-redirect after countdown
  useEffect(() => {
    if (error) return; // Don't auto-redirect on error

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(getRedirectUrl());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, error, draft]);

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
          <button
            onClick={() => router.push(getRedirectUrl())}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Try Again
          </button>
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
            <p className="text-sm text-gray-600 mb-1">Your Trust Score</p>
            <p className="text-4xl font-bold text-blue-600">{score}</p>
            <p className="text-xs text-gray-500 mt-1">out of 100</p>
            {wallet && (
              <button
                onClick={refreshScore}
                disabled={isRefreshing}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mx-auto disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefreshing ? 'Refreshing...' : 'Refresh Score'}
              </button>
            )}
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

        {/* Auto-redirect notice */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-gray-700 font-medium mb-2">
            Redirecting in {countdown} seconds...
          </p>
          <p className="text-sm text-gray-500">
            You'll be taken back to your loan application.
          </p>
        </div>

        {/* Manual button */}
        <button
          onClick={() => router.push(getRedirectUrl())}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
        >
          Continue to Loan Application
        </button>
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
