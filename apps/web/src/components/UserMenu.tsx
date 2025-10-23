"use client";

import { useState, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useDisconnect } from 'wagmi';
import { getSocialProfile, formatDisplayName, PlatformBadges, TrustIndicator } from '@/utils/socialUtils';
import { HeartIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

type UserMenuProps = {
  inline?: boolean;
  onItemClick?: () => void;
};

export const UserMenu = ({ inline = false, onItemClick }: UserMenuProps) => {
  const { user, logout } = usePrivy();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const profile = getSocialProfile(user);
  const displayName = formatDisplayName(user);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    
    // Only add click outside listener for dropdown version
    if (!inline) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuRef, inline]);

  const handleItemClick = () => {
    setMenuOpen(false);
    onItemClick?.();
  };

  // Inline version for mobile
  if (inline) {
    return (
      <div className="space-y-0">
        {/* User info section */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl mb-4">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#29738F] to-[#6BBAA7] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {displayName.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {displayName}
              </p>
              <TrustIndicator score={profile.trustScore} />
            </div>
            {user?.email?.address && (
              <p className="text-xs text-gray-500 truncate">
                {user.email.address}
              </p>
            )}
            {profile.platforms.length > 0 && (
              <div className="mt-2">
                <PlatformBadges platforms={profile.platforms} showAll={true} />
              </div>
            )}
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          <Link
            href="/request-funding"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-bold no-underline transition-colors"
            onClick={handleItemClick}
          >
            Get Funding
          </Link>
          <Link
            href="/portfolio"
            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium no-underline transition-colors"
            onClick={handleItemClick}
          >
            <HeartIcon className="w-5 h-5" />
            Supporting
          </Link>
          <Link
            href="/my-advances"
            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium no-underline transition-colors"
            onClick={handleItemClick}
          >
            <DocumentTextIcon className="w-5 h-5" />
            My Loans
          </Link>
          <Link
            href="/account-settings"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium no-underline transition-colors"
            onClick={handleItemClick}
          >
            Account & Verification
          </Link>
          <button
            onClick={() => {
              logout();
              disconnect();
              handleItemClick();
            }}
            className="w-full text-left block px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center space-x-2 p-1.5 pr-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#29738F]"
        aria-label="Open user menu"
      >
        {profile.avatar ? (
          <img 
            src={profile.avatar} 
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#29738F] to-[#6BBAA7] flex items-center justify-center">
            <span className="text-white font-semibold text-xs">
              {displayName.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {displayName}
          </span>
          <TrustIndicator score={profile.trustScore} />
        </div>
      </button>
      {menuOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#29738F] to-[#6BBAA7] flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {displayName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  <TrustIndicator score={profile.trustScore} />
                </div>
                {user?.email?.address && (
                  <p className="text-xs text-gray-500 truncate">
                    {user.email.address}
                  </p>
                )}
                {profile.platforms.length > 0 && (
                  <div className="mt-2">
                    <PlatformBadges platforms={profile.platforms} showAll={true} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <Link
            href="/portfolio"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 no-underline"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            <HeartIcon className="w-4 h-4" />
            Supporting
          </Link>
          <Link
            href="/my-advances"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 no-underline"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            <DocumentTextIcon className="w-4 h-4" />
            My Loans
          </Link>
          <Link
            href="/account-settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 no-underline"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
          >
            Account & Verification
          </Link>
          <button
            onClick={() => {
              logout();
              disconnect();
              setMenuOpen(false);
            }}
            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            role="menuitem"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}; 