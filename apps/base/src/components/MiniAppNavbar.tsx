'use client';

import React from 'react';
import { sdk } from "@farcaster/miniapp-sdk";
import { LendFriendLogo } from './LendFriendLogo';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';

export default function MiniAppNavbar() {
  const { isConnected, address, userProfile, connect, disconnect, isConnecting } = useMiniAppWallet();

  const handleClose = () => {
    try {
      // Close the mini app and return to host app
      sdk.actions.close();
    } catch (error) {
      console.error('Error closing mini app:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Logo - Simplified for mini app */}
        <div className="flex items-center">
          <LendFriendLogo />
        </div>

        {/* Mini App Actions */}
        <div className="flex items-center gap-2">
          {/* Wallet Connection - Deferred Auth Pattern */}
          {isConnected ? (
            <div className="flex items-center gap-2">
              {userProfile && (
                <span className="text-xs text-gray-600">
                  @{userProfile.username}
                </span>
              )}
              <button
                className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={disconnect}
              >
                {address ? formatAddress(address) : 'Connected'}
              </button>
            </div>
          ) : (
            // Optional connection - not prominent unless needed
            <button
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#29738F] hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Sign In'}
            </button>
          )}

          {/* Close button - only visible in mini app context */}
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close mini app"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}