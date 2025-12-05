'use client';

import React from 'react';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';

export default function MiniAppNavbar() {
  const { isConnected, userProfile, connect, isConnecting } = useMiniAppWallet();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 h-12 flex items-center justify-between">
        {/* App name */}
        <span className="text-lg font-bold text-base-blue">LendFriend</span>

        {/* User avatar - in Farcaster mini app, user is always connected */}
        <div className="flex items-center">
          {userProfile?.pfp ? (
            <img
              src={userProfile.pfp}
              alt={userProfile.username || 'Profile'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-base-blue/10 flex items-center justify-center">
              <span className="text-sm font-medium text-base-blue">
                {userProfile?.username?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}