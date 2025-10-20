'use client';

import { useAccount } from 'wagmi';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';

interface LoanCardPreviewProps {
  businessName: string;
  description: string;
  fundingGoal: string;
  imageUrl: string;
  fundraisingDays: number;
}

export default function LoanCardPreview({
  businessName,
  description,
  fundingGoal,
  imageUrl,
  fundraisingDays,
}: LoanCardPreviewProps) {
  const { address } = useAccount();
  const { profile, hasProfile } = useFarcasterProfile(address);

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0x0000...0000';
  const daysText = fundraisingDays === 1 ? '1 day' : `${fundraisingDays} days`;

  return (
    <div className="bg-white border-2 border-[#3B9B7F] rounded-lg overflow-hidden shadow-md">
      {/* Header */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasProfile && profile ? (
              <>
                <img
                  src={profile.pfpUrl}
                  alt={profile.displayName}
                  className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xs font-semibold text-gray-900 truncate">
                  {profile.displayName || `@${profile.username}`}
                </span>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-900 truncate">{shortAddress}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{daysText}</span>
          </div>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="w-full h-48 bg-gray-100">
          <img
            src={imageUrl}
            alt="Loan preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1 min-w-0">
            {businessName || 'Your Business Name'}
          </h3>
          <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-yellow-100 text-yellow-800">
            Fundraising
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem] overflow-hidden">
          {description || 'Your loan description will appear here. Keep it concise - only 2 lines will show on cards.'}
        </p>

        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-[#3B9B7F] h-2 rounded-full"
              style={{ width: '0%' }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-900">
              $0 USDC
            </span>
            <span className="text-gray-500">
              of ${fundingGoal || '0'} USDC
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
          No supporters yet
        </div>
      </div>

      {/* Preview label */}
      <div className="bg-[#3B9B7F] text-white text-xs font-medium text-center py-2">
        LIVE PREVIEW
      </div>
    </div>
  );
}
