import React from 'react';
import { ErrorDetails } from '@/utils/errorHandling';
import { ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ErrorDisplayProps {
  error: ErrorDetails | Error | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  onAction?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, onDismiss, onAction, className = '' }: ErrorDisplayProps) {
  if (!error) return null;

  // Parse error details
  let details: ErrorDetails;
  if (typeof error === 'string') {
    details = {
      title: 'Error',
      message: error,
      severity: 'error',
    };
  } else if (error instanceof Error) {
    // Check if it's a UserFriendlyError with details
    if ('details' in error && typeof error.details === 'object') {
      details = error.details as ErrorDetails;
    } else {
      // Parse regular error
      const { parseBlockchainError } = require('@/utils/errorHandling');
      details = parseBlockchainError(error);
    }
  } else {
    details = error as ErrorDetails;
  }

  // Determine colors based on severity
  const severityStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircleIcon className="w-5 h-5 text-red-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <InformationCircleIcon className="w-5 h-5 text-blue-600" />,
    },
  };

  const styles = severityStyles[details.severity];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.text}`}>{details.title}</h3>
          <div className={`mt-1 text-sm ${styles.text} opacity-90`}>
            <p>{details.message}</p>
            {details.suggestion && (
              <p className="mt-2 text-xs">{details.suggestion}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex gap-2">
            {details.actionLabel && onAction && (
              <button
                onClick={onAction}
                className={`text-sm font-medium ${styles.text} hover:opacity-80 transition-opacity`}
              >
                {details.actionLabel}
              </button>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                className={`text-sm font-medium ${styles.text} hover:opacity-80 transition-opacity`}
              >
                Retry
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
