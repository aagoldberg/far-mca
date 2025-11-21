'use client';

import { useEffect, useState } from 'react';
import { useSocialVerification, SocialPlatform } from '@/hooks/useSocialVerification';

interface SocialConnectionBadgeProps {
  userAddress: string;
  viewerAddress?: string;
  showCount?: boolean;
  className?: string;
}

const PLATFORM_ICONS: Record<SocialPlatform, JSX.Element> = {
  facebook: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  discord: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
  ),
  farcaster: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.24 3.75H5.76A2.01 2.01 0 003.75 5.76v12.48a2.01 2.01 0 002.01 2.01h12.48a2.01 2.01 0 002.01-2.01V5.76a2.01 2.01 0 00-2.01-2.01zM17.1 17.1h-2.4v-6.6c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2 1.2v6.6H9.9v-6.6c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2 1.2v6.6H5.1V6.9h12v10.2z"/>
    </svg>
  ),
  bluesky: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3c2.9 0 5.73 1.22 7.68 3.39.49.55.88 1.15 1.14 1.77.26.62.39 1.28.39 1.95 0 2.21-1.02 4.27-2.76 5.58-.36.27-.75.49-1.17.67-.41.17-.85.3-1.3.38-.45.08-.91.12-1.38.12-2.9 0-5.73-1.22-7.68-3.39-.49-.55-.88-1.15-1.14-1.77-.26-.62-.39-1.28-.39-1.95 0-2.21 1.02-4.27 2.76-5.58.36-.27.75-.49 1.17-.67.41-.17.85-.3 1.3-.38.45-.08.91-.12 1.38-.12z"/>
    </svg>
  ),
  google: (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
};

export function SocialConnectionBadge({
  userAddress,
  viewerAddress,
  showCount = false,
  className = '',
}: SocialConnectionBadgeProps) {
  const { getFriendConnections, areMutualFriends } = useSocialVerification();
  const [connections, setConnections] = useState<Array<{ platform: SocialPlatform; isMutual: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConnections() {
      if (!userAddress) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Get all connections for this user
        const userConnections = await getFriendConnections(userAddress);

        // If viewerAddress is provided, check which are mutual
        const connectionsWithMutual = await Promise.all(
          userConnections.map(async (conn) => {
            const isMutual = viewerAddress
              ? await areMutualFriends(userAddress, conn.friend_address, conn.platform)
              : false;

            return {
              platform: conn.platform,
              isMutual,
            };
          })
        );

        // Group by platform (in case multiple connections on same platform)
        const uniqueConnections = connectionsWithMutual.reduce((acc, conn) => {
          const existing = acc.find(c => c.platform === conn.platform);
          if (!existing) {
            acc.push(conn);
          } else if (conn.isMutual && !existing.isMutual) {
            // Prefer mutual connections
            existing.isMutual = true;
          }
          return acc;
        }, [] as Array<{ platform: SocialPlatform; isMutual: boolean }>);

        setConnections(uniqueConnections);
      } catch (err) {
        console.error('[Social Badge] Error loading connections:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadConnections();
  }, [userAddress, viewerAddress]);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (connections.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {connections.map(({ platform, isMutual }) => (
        <div
          key={platform}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            ${isMutual
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
            }
          `}
          title={isMutual ? `Mutual ${platform} friends` : `Connected on ${platform}`}
        >
          {PLATFORM_ICONS[platform]}
          <span className="capitalize">{platform}</span>
          {isMutual && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      ))}

      {showCount && connections.length > 3 && (
        <div className="px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs font-medium">
          +{connections.length - 3}
        </div>
      )}
    </div>
  );
}
