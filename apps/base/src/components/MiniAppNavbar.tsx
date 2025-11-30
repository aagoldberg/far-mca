'use client';

import React from 'react';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';

export default function MiniAppNavbar() {
  const { isConnected, userProfile, connect, isConnecting } = useMiniAppWallet();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 h-12 flex items-center justify-between">
        {/* App name */}
        <span className="text-lg font-bold text-[#2C7A7B]">LendFriend</span>

        {/* User info - Farcaster native: avatar + username */}
        <div className="flex items-center">
          {isConnected && userProfile ? (
            <div className="flex items-center gap-2">
              {userProfile.pfp ? (
                <img
                  src={userProfile.pfp}
                  alt={userProfile.username || 'Profile'}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#2C7A7B]/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-[#2C7A7B]">
                    {userProfile.username?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                @{userProfile.username}
              </span>
            </div>
          ) : isConnected ? (
            <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse" />
          ) : (
            <button
              className="px-3 py-1.5 text-sm font-medium bg-[#2C7A7B] text-white rounded-lg transition-colors disabled:opacity-50"
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? '...' : 'Connect'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}