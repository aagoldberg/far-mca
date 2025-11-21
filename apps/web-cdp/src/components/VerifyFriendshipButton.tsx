'use client';

import { useState } from 'react';
import { useSocialVerification, SocialPlatform } from '@/hooks/useSocialVerification';
import { usePrivy } from '@privy-io/react-auth';

interface VerifyFriendshipButtonProps {
  friendAddress: string;
  platform: SocialPlatform;
  onVerified?: () => void;
  className?: string;
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  discord: 'Discord',
  farcaster: 'Farcaster',
  bluesky: 'Bluesky',
  google: 'Google',
};

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: 'bg-blue-600 hover:bg-blue-700',
  instagram: 'bg-pink-600 hover:bg-pink-700',
  twitter: 'bg-sky-500 hover:bg-sky-600',
  linkedin: 'bg-blue-700 hover:bg-blue-800',
  discord: 'bg-indigo-600 hover:bg-indigo-700',
  farcaster: 'bg-purple-600 hover:bg-purple-700',
  bluesky: 'bg-blue-500 hover:bg-blue-600',
  google: 'bg-red-600 hover:bg-red-700',
};

export function VerifyFriendshipButton({
  friendAddress,
  platform,
  onVerified,
  className = '',
}: VerifyFriendshipButtonProps) {
  const { verifyFriendship, isLoading, error } = useSocialVerification();
  const { user, linkAccount } = usePrivy();
  const [verified, setVerified] = useState(false);
  const [showError, setShowError] = useState(false);

  // Check if user has connected this platform
  const isPlatformConnected = !!getPlatformFromUser(user, platform);

  const handleVerify = async () => {
    setShowError(false);

    // If platform not connected, prompt to connect
    if (!isPlatformConnected) {
      try {
        await linkAccount(platform);
        // After linking, try verification again
        setTimeout(() => handleVerify(), 1000);
        return;
      } catch (err) {
        console.error('Failed to link account:', err);
        setShowError(true);
        return;
      }
    }

    // Verify friendship
    const success = await verifyFriendship({
      friendAddress,
      platform,
    });

    if (success) {
      setVerified(true);
      onVerified?.();
    } else {
      setShowError(true);
    }
  };

  if (verified) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 ${className}`}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Verified {PLATFORM_LABELS[platform]} Friend</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={handleVerify}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${PLATFORM_COLORS[platform]}
        `}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              {isPlatformConnected
                ? `Verify ${PLATFORM_LABELS[platform]} Friend`
                : `Connect ${PLATFORM_LABELS[platform]}`}
            </span>
          </>
        )}
      </button>

      {(showError || error) && (
        <p className="mt-2 text-sm text-red-600">
          {error || `Not connected on ${PLATFORM_LABELS[platform]}`}
        </p>
      )}
    </div>
  );
}

/**
 * Helper to check if user has connected a platform
 */
function getPlatformFromUser(user: any, platform: SocialPlatform): any {
  if (!user) return null;

  switch (platform) {
    case 'facebook':
      return user.facebook;
    case 'instagram':
      return user.instagram;
    case 'twitter':
      return user.twitter;
    case 'linkedin':
      return user.linkedin;
    case 'discord':
      return user.discord;
    case 'google':
      return user.google;
    case 'farcaster':
      return user.farcaster;
    default:
      return null;
  }
}
