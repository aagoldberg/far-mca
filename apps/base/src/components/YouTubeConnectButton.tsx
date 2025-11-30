'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  VideoCameraIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface YouTubeConnectButtonProps {
  onConnectionSuccess?: (creditScore: any) => void;
  onConnectionError?: (error: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function YouTubeConnectButton({
  onConnectionSuccess,
  onConnectionError,
  className = '',
  size = 'md'
}: YouTubeConnectButtonProps) {
  const { address } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const handleConnect = async () => {
    if (!address) {
      onConnectionError?.('Please connect your wallet first');
      return;
    }

    setIsConnecting(true);

    try {
      // Get auth URL from our API (includes wallet address)
      const response = await fetch(
        `/api/youtube/auth?wallet=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate YouTube connection');
      }

      // Redirect to Google OAuth
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('YouTube connection error:', error);
      onConnectionError?.(error instanceof Error ? error.message : 'Connection failed');
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`
        w-full inline-flex items-center justify-center gap-2
        bg-red-600 text-white rounded-md hover:bg-red-700
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${sizeClasses[size]} ${className}
      `}
    >
      {isConnecting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <VideoCameraIcon className="h-5 w-5" />
          <span>Connect YouTube Channel</span>
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
