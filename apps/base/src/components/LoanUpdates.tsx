'use client';

import { useLoanUpdates } from '@/hooks/useLoanUpdates';
import { ChatBubbleLeftIcon, HeartIcon, ClockIcon } from '@heroicons/react/24/outline';

interface LoanUpdatesProps {
  loanAddress: `0x${string}`;
  borrowerAddress: string;
}

export default function LoanUpdates({ loanAddress, borrowerAddress }: LoanUpdatesProps) {
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
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Updates</h2>
        <div className="space-y-3">
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
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Updates</h2>
        <div className="text-center py-8">
          <ChatBubbleLeftIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No updates yet</p>
          <p className="text-xs text-gray-400 mt-1">The borrower will post updates here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Updates ({updates.length})
      </h2>

      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className={`rounded-lg border p-4 ${getUpdateColor(update.updateType)}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getUpdateIcon(update.updateType)}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {update.title || 'Update'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <ClockIcon className="w-3 h-3" />
                    <span>{formatTimestamp(update.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            {update.content && (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-3">
                {update.content}
              </p>
            )}

            {/* Images */}
            {update.images && update.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
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

            {/* Footer */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#2C7A7B]">
                <HeartIcon className="w-4 h-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#2C7A7B]">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span>Comment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
