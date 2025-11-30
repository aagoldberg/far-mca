'use client';

import { useLoanUpdates } from '@/hooks/useLoanUpdates';
import {
  ChatBubbleLeftIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface LoanUpdatesProps {
  loanAddress: `0x${string}`;
}

export default function LoanUpdates({ loanAddress }: LoanUpdatesProps) {
  const { updates, isLoading } = useLoanUpdates(loanAddress);

  const getUpdateIcon = (type?: string) => {
    switch (type) {
      case 'milestone':
        return '🎉';
      case 'gratitude':
        return '🙏';
      case 'repayment':
        return '💰';
      case 'challenge':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getUpdateColor = (type?: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-green-50 border-green-200';
      case 'gratitude':
        return 'bg-purple-50 border-purple-200';
      case 'repayment':
        return 'bg-blue-50 border-blue-200';
      case 'challenge':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500" />
          Updates
        </h2>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full mb-1" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500" />
          Updates
        </h2>
        <div className="text-center py-8">
          <ChatBubbleLeftIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No updates yet</p>
          <p className="text-sm text-gray-400 mt-1">The borrower will post updates here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500" />
        Updates ({updates.length})
      </h2>

      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className={`rounded-xl border p-4 ${getUpdateColor(update.updateType)}`}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{getUpdateIcon(update.updateType)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {update.title || 'Update'}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{formatTimestamp(update.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            {update.content && (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {update.content}
              </p>
            )}

            {/* Images */}
            {update.images && update.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {update.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Update image ${idx + 1}`}
                    className="rounded-lg w-full h-32 object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
