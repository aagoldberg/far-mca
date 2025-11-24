'use client';

import { useState } from 'react';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { getConnectedPlatforms, PLATFORM_ICONS, SocialPlatform, getTrustScore } from '@/utils/socialUtils';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

// CDP supports: Google, Apple, Twitter/X natively
// Farcaster via custom integration
// TODO: Add support for other platforms via custom OAuth
const ALL_PLATFORMS: SocialPlatform[] = [
  'google', 'twitter', 'farcaster', 'apple'
  // TODO: Add discord, linkedin, github via custom OAuth
];

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

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  google: 'bg-red-500 hover:bg-red-600',
  twitter: 'bg-black hover:bg-gray-800',
  discord: 'bg-indigo-500 hover:bg-indigo-600',
  farcaster: 'bg-purple-500 hover:bg-purple-600',
  telegram: 'bg-blue-500 hover:bg-blue-600',
  instagram: 'bg-pink-500 hover:bg-pink-600',
  spotify: 'bg-green-500 hover:bg-green-600',
  tiktok: 'bg-black hover:bg-gray-800',
  linkedin: 'bg-blue-700 hover:bg-blue-800',
  github: 'bg-gray-800 hover:bg-gray-900',
  apple: 'bg-gray-700 hover:bg-gray-800',
};

interface SocialAccountLinkerProps {
  showTitle?: boolean;
  compact?: boolean;
}

export default function SocialAccountLinker({ showTitle = true, compact = false }: SocialAccountLinkerProps) {
  const { user, linkEmail, linkWallet, linkGoogle, linkTwitter, linkDiscord, linkGithub, linkLinkedIn, linkApple, linkFarcaster } = usePrivy();
  const [linking, setLinking] = useState<SocialPlatform | null>(null);
  
  const connectedPlatforms = getConnectedPlatforms(user);
  const trustScore = getTrustScore(user);
  
  const [linkError, setLinkError] = useState<string | null>(null);

  const handleLinkAccount = async (platform: SocialPlatform) => {
    setLinking(platform);
    setLinkError(null);
    try {
      // Privy requires specific link functions for each platform
      switch (platform) {
        case 'google':
          await linkGoogle();
          break;
        case 'twitter':
          await linkTwitter();
          break;
        case 'discord':
          await linkDiscord();
          break;
        case 'github':
          await linkGithub();
          break;
        case 'linkedin':
          await linkLinkedIn();
          break;
        case 'apple':
          await linkApple();
          break;
        case 'farcaster':
          await linkFarcaster();
          break;
        case 'email':
          await linkEmail();
          break;
        default:
          console.log(`Linking ${platform} is not yet supported`);
          break;
      }
    } catch (error: any) {
      console.error(`Failed to link ${platform}:`, error);
      
      // Handle common Privy errors
      if (error?.message?.includes('already linked') || error?.message?.includes('already associated')) {
        setLinkError(`This ${PLATFORM_NAMES[platform]} account is already linked to another user. Please log out and sign in with that account instead.`);
      } else if (error?.message?.includes('cancelled') || error?.message?.includes('closed')) {
        // User cancelled the linking process
        setLinkError(null);
      } else {
        setLinkError(`Failed to link ${PLATFORM_NAMES[platform]}. Please try again.`);
      }
    } finally {
      setLinking(null);
    }
  };

  const availablePlatforms = ALL_PLATFORMS.filter(
    platform => !connectedPlatforms.includes(platform)
  );

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Trust Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Trust Score</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-green-500 h-2 rounded-full transition-all"
                style={{ width: `${trustScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-900">{trustScore}</span>
          </div>
        </div>

        {/* Connected Platforms */}
        <div className="flex flex-wrap gap-2">
          {connectedPlatforms.map(platform => (
            <div 
              key={platform}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm ${PLATFORM_COLORS[platform]}`}
            >
              {PLATFORM_ICONS[platform]}
              <span className="font-medium">{PLATFORM_NAMES[platform]}</span>
              <CheckIcon className="w-4 h-4" />
            </div>
          ))}
        </div>

        {/* Add More (only show if there are unconnected platforms) */}
        {availablePlatforms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.slice(0, 3).map(platform => (
              <button
                key={platform}
                onClick={() => handleLinkAccount(platform)}
                disabled={linking === platform}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 text-sm transition-colors disabled:opacity-50"
              >
                {linking === platform ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4" />
                    <span>{PLATFORM_NAMES[platform]}</span>
                  </>
                )}
              </button>
            ))}
            {availablePlatforms.length > 3 && (
              <span className="text-sm text-gray-500 py-1.5">
                +{availablePlatforms.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {showTitle && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Social Verification
          </h3>
          <p className="text-sm text-gray-600">
            Link your social accounts to build trust and show your identity to donors.
          </p>
        </div>
      )}

      {/* Error Message */}
      {linkError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{linkError}</p>
        </div>
      )}

      {/* Trust Score Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Trust Score</span>
          <span className="text-2xl font-bold text-gray-900">{trustScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${trustScore}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Higher trust scores increase donor confidence
        </p>
      </div>

      {/* Connected Accounts */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Connected Accounts ({connectedPlatforms.length})
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {connectedPlatforms.map(platform => (
            <div 
              key={platform}
              className={`flex items-center gap-3 p-3 rounded-lg text-white ${PLATFORM_COLORS[platform]}`}
            >
              {PLATFORM_ICONS[platform]}
              <span className="font-medium flex-1">{PLATFORM_NAMES[platform]}</span>
              <CheckIcon className="w-5 h-5" />
            </div>
          ))}
          {connectedPlatforms.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No accounts connected yet
            </p>
          )}
        </div>
      </div>

      {/* Available Platforms to Link */}
      {availablePlatforms.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Link More Accounts
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {availablePlatforms.map(platform => (
              <button
                key={platform}
                onClick={() => handleLinkAccount(platform)}
                disabled={linking === platform}
                className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                {linking === platform ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {PLATFORM_ICONS[platform]}
                    <span className="font-medium flex-1">Connect {PLATFORM_NAMES[platform]}</span>
                    <PlusIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {availablePlatforms.length === 0 && (
        <div className="text-center py-4">
          <CheckIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">All accounts connected!</p>
          <p className="text-xs text-gray-600">You've maximized your trust score</p>
        </div>
      )}
    </div>
  );
}