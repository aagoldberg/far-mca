'use client';

import { useEffect, useState } from 'react';
import { useAutoAirdrop } from '@/hooks/useAutoAirdrop';

/**
 * Toast notification component that shows airdrop status to users
 * Automatically appears when test tokens are being sent
 */
export function AirdropToast() {
  const { isLoading, isSuccess, isError, error, message, amounts } = useAutoAirdrop();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading || isSuccess || isError) {
      setShow(true);

      // Auto-hide success message after 8 seconds
      if (isSuccess) {
        const timer = setTimeout(() => setShow(false), 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isSuccess, isError]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`
          max-w-md rounded-lg shadow-lg p-4 border-2
          ${isLoading ? 'bg-blue-50 border-blue-200' : ''}
          ${isSuccess ? 'bg-green-50 border-green-200' : ''}
          ${isError ? 'bg-red-50 border-red-200' : ''}
        `}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {isLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
            )}
            {isSuccess && (
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {isError && (
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3
              className={`
                text-sm font-semibold mb-1
                ${isLoading ? 'text-blue-900' : ''}
                ${isSuccess ? 'text-green-900' : ''}
                ${isError ? 'text-red-900' : ''}
              `}
            >
              {isLoading && 'Sending Test Tokens...'}
              {isSuccess && 'Welcome to LendFriend!'}
              {isError && 'Airdrop Failed'}
            </h3>
            <p
              className={`
                text-sm
                ${isLoading ? 'text-blue-700' : ''}
                ${isSuccess ? 'text-green-700' : ''}
                ${isError ? 'text-red-700' : ''}
              `}
            >
              {isLoading && 'We\'re sending test ETH and USDC to your wallet...'}
              {isSuccess && message}
              {isError && (error || 'Failed to send test tokens. Please try the manual faucet.')}
            </p>

            {/* Show amounts for successful airdrops */}
            {isSuccess && amounts && (
              <div className="mt-2 text-xs text-green-600 space-y-1">
                {amounts.eth && <div>✓ {amounts.eth} ETH (for gas)</div>}
                {amounts.usdc && <div>✓ {amounts.usdc} USDC (for testing)</div>}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => setShow(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
