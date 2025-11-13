'use client';

import { User } from '@privy-io/react-auth';
import { 
  getSocialProfile, 
  PlatformBadges, 
  TrustIndicator, 
  getConnectedPlatforms,
  PLATFORM_ICONS,
  SocialPlatform 
} from '@/utils/socialUtils';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface CampaignCreatorProfileProps {
  creator: User | null;
  walletAddress?: string;
  showFullProfile?: boolean;
}

const PLATFORM_NAMES: Record<SocialPlatform, string> = {
  google: 'Google',
  twitter: 'Twitter/X',
  discord: 'Discord',
  farcaster: 'Farcaster',
  telegram: 'Telegram',
  instagram: 'Instagram',
  spotify: 'Spotify',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  apple: 'Apple',
};

export default function CampaignCreatorProfile({ 
  creator, 
  walletAddress, 
  showFullProfile = false 
}: CampaignCreatorProfileProps) {
  const [expanded, setExpanded] = useState(false);
  const profile = getSocialProfile(creator);
  const platforms = getConnectedPlatforms(creator);

  if (!creator && !walletAddress) {
    return (
      <div className="text-sm text-gray-500">
        Creator information not available
      </div>
    );
  }

  // Compact version for campaign cards
  if (!showFullProfile) {
    return (
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name || 'Creator'} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {(profile.name || 'A').charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name and platforms */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">
              {profile.name || `${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}
            </span>
            {platforms.length > 0 && (
              <TrustIndicator score={profile.trustScore} />
            )}
          </div>
          {platforms.length > 0 && (
            <PlatformBadges platforms={platforms} maxDisplay={3} />
          )}
        </div>
      </div>
    );
  }

  // Full profile for campaign details page
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name || 'Creator'} 
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-xl font-medium">
              {(profile.name || 'A').charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {profile.name || 'Anonymous Creator'}
            </h3>
            <TrustIndicator score={profile.trustScore} showLabel />
          </div>

          {/* Wallet Address */}
          {walletAddress && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">Wallet:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </code>
            </div>
          )}

          {/* Social Verification Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {platforms.length > 0 ? (
                <>
                  <span className="text-sm text-gray-600">
                    {platforms.length} verified account{platforms.length > 1 ? 's' : ''}
                  </span>
                  <PlatformBadges platforms={platforms} maxDisplay={5} />
                </>
              ) : (
                <span className="text-sm text-gray-500">No verified social accounts</span>
              )}
            </div>
            
            {platforms.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {expanded ? 'Less' : 'More'}
                {expanded ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Social Details */}
      {expanded && platforms.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
            <CheckBadgeIcon className="w-5 h-5 text-green-500" />
            Verified Social Accounts
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {platforms.map(platform => {
              const userData = creator?.[platform as keyof typeof creator] as any;
              const username = userData?.username || userData?.email?.split('@')[0] || userData?.name;
              
              return (
                <div 
                  key={platform}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    {PLATFORM_ICONS[platform]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {PLATFORM_NAMES[platform]}
                    </div>
                    {username && (
                      <div className="text-sm text-gray-600 truncate">
                        @{username}
                      </div>
                    )}
                  </div>
                  <CheckBadgeIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <CheckBadgeIcon className="w-4 h-4" />
              <span className="font-medium">Trust Score: {profile.trustScore}/100</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Multiple verified accounts increase donor confidence and campaign credibility
            </p>
          </div>
        </div>
      )}
    </div>
  );
}