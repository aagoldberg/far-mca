import React from 'react';

/**
 * Loading skeleton components based on web-cdp patterns
 * Uses Tailwind's animate-pulse for consistent loading animations
 */

// Generic skeleton line
export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`} />;
}

// Skeleton for text blocks
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

// Skeleton for loan cards
export function LoanCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2" />
      </div>
    </div>
  );
}

// Skeleton for form inputs
export function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Amount input skeleton */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-lg flex-1" />
          ))}
        </div>
      </div>

      {/* Purpose selector skeleton */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Description skeleton */}
      <div className="bg-white rounded-xl p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

// Full page skeleton
export function PageSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 p-4 space-y-3">
        <LoanCardSkeleton />
        <LoanCardSkeleton />
        <LoanCardSkeleton />
      </div>
    </main>
  );
}

// Loading spinner (for buttons and inline loading)
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Transaction status display
export function TransactionStatus({
  isPending,
  isConfirming,
  isSuccess,
  error,
}: {
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  error?: Error | null;
}) {
  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <LoadingSpinner size="sm" />
        <span className="text-sm">Waiting for signature...</span>
      </div>
    );
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 text-yellow-600">
        <LoadingSpinner size="sm" />
        <span className="text-sm">Confirming transaction...</span>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm">Transaction confirmed!</span>
      </div>
    );
  }

  if (error) {
    return null; // Use ErrorDisplay component for errors
  }

  return null;
}
