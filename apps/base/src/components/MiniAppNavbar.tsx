'use client';

import React from 'react';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';

export default function MiniAppNavbar() {
  const { isConnected, address, userProfile, connect, isConnecting } = useMiniAppWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="px-4 h-12 flex items-center justify-between">
        {/* App name - compact for mini app */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#2C7A7B]">LendFriend</span>
        </div>

        {/* User info - minimal display */}
        <div className="flex items-center">
          {isConnected ? (
            <div className="flex items-center gap-2 text-sm">
              {userProfile?.username && (
                <span className="text-gray-600">@{userProfile.username}</span>
              )}
              {address && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-mono">
                  {formatAddress(address)}
                </span>
              )}
            </div>
          ) : (
            <button
              className="px-3 py-1.5 text-sm font-medium bg-[#2C7A7B] text-white rounded-lg transition-colors disabled:opacity-50"
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}