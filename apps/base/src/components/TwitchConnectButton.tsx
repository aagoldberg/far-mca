'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  PlayIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface TwitchConnectButtonProps {
  onConnectionSuccess?: (creditScore: any) => void;
  onConnectionError?: (error: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TwitchConnectButton({
  onConnectionSuccess,
  onConnectionError,
  className = '',
  size = 'md'
}: TwitchConnectButtonProps) {
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
        `/api/twitch/auth?wallet=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate Twitch connection');
      }

      // Redirect to Twitch OAuth
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Twitch connection error:', error);
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
        bg-purple-600 text-white rounded-md hover:bg-purple-700
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
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
          <PlayIcon className="h-5 w-5" />
          <span>Connect Twitch Channel</span>
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
