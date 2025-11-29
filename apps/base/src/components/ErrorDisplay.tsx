"use client";

import { ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { formatErrorForUI } from '@/utils/errorHandling';

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, onDismiss, className = '' }: ErrorDisplayProps) {
  const errorDetails = formatErrorForUI(error);

  const getIcon = () => {
    switch (errorDetails.severity) {
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (errorDetails.severity) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getTextColor = () => {
    switch (errorDetails.severity) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-red-800';
    }
  };

  const getButtonColor = () => {
    switch (errorDetails.severity) {
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-red-600 hover:bg-red-700';
    }
  };

  return (
    <div className={`${getBackgroundColor()} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${getTextColor()}`}>
            {errorDetails.title}
          </h3>
          <p className={`text-sm mt-1 ${getTextColor().replace('800', '700')}`}>
            {errorDetails.message}
          </p>
          {errorDetails.suggestion && (
            <p className={`text-sm mt-2 ${getTextColor().replace('800', '600')}`}>
              💡 {errorDetails.suggestion}
            </p>
          )}
          <div className="mt-4 flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className={`${getButtonColor()} text-white text-sm font-medium py-2 px-3 rounded-md transition-colors`}
              >
                {errorDetails.actionLabel || 'Try Again'}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-3 rounded-md transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ml-2 ${getTextColor().replace('800', '400')} hover:${getTextColor().replace('800', '600')}`}
          >
            <span className="sr-only">Dismiss</span>
            <XCircleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}