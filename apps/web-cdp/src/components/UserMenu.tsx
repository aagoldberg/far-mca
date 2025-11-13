"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useEvmAddress, useSignOut, useCurrentUser } from '@coinbase/cdp-hooks';
import { HeartIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { FarcasterSignupModal } from './FarcasterSignupModal';

type UserMenuProps = {
  inline?: boolean;
  onItemClick?: () => void;
};

export const UserMenu = ({ inline = false, onItemClick }: UserMenuProps) => {
  const { evmAddress: address } = useEvmAddress();
  const { signOut } = useSignOut();
  const { currentUser } = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [farcasterModalOpen, setFarcasterModalOpen] = useState(false);
  const [farcasterProfile, setFarcasterProfile] = useState<{ fid: number; username: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Debug logging to see what CDP is returning
  console.log('UserMenu - CDP currentUser data:', {
    currentUser,
    allKeys: currentUser ? Object.keys(currentUser) : [],
    username: (currentUser as any)?.username,
    displayName: (currentUser as any)?.displayName,
    name: (currentUser as any)?.name,
    email: (currentUser as any)?.email,
    avatarUrl: (currentUser as any)?.avatarUrl,
    profilePictureUrl: (currentUser as any)?.profilePictureUrl,
    picture: (currentUser as any)?.picture,
    fullObject: JSON.stringify(currentUser, null, 2)
  });

  // Get user info from CDP (name, avatar from OAuth providers)
  // Prioritize Farcaster username if available
  const displayName = farcasterProfile?.username ||
                      (currentUser as any)?.name ||
                      (currentUser as any)?.displayName ||
                      (currentUser as any)?.username ||
                      (currentUser as any)?.email ||
                      (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User');

  const userAvatar = (currentUser as any)?.picture ||
                     (currentUser as any)?.avatarUrl ||
                     (currentUser as any)?.profilePictureUrl;

  const handleFarcasterSuccess = (data: { fid: number; username: string }) => {
    setFarcasterProfile(data);
    // TODO: Save to database via API
  };

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
          {userAvatar ? (
            <img
              src={userAvatar}
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
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            {address && (
              <p className="text-xs text-gray-500 truncate font-mono">
                {address.slice(0, 10)}...{address.slice(-8)}
              </p>
            )}
          </div>
        </div>

        {/* Farcaster Account Prompt */}
        {!farcasterProfile && (
          <button
            onClick={() => setFarcasterModalOpen(true)}
            className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span>🎭</span>
            <span>Create Farcaster Account</span>
          </button>
        )}

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
              signOut();
              handleItemClick();
            }}
            className="w-full text-left block px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            Disconnect
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
        {userAvatar ? (
          <img
            src={userAvatar}
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
              {userAvatar ? (
                <img
                  src={userAvatar}
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
                <p className="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </p>
                {address && (
                  <p className="text-xs text-gray-500 truncate font-mono">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Farcaster Account Prompt */}
          {!farcasterProfile && (
            <button
              onClick={() => {
                setFarcasterModalOpen(true);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-purple-700 hover:bg-purple-50 font-medium flex items-center gap-2 transition-colors"
            >
              <span>🎭</span>
              <span>Create Farcaster Account</span>
            </button>
          )}

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
              signOut();
              setMenuOpen(false);
            }}
            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            role="menuitem"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Farcaster Signup Modal */}
      <FarcasterSignupModal
        isOpen={farcasterModalOpen}
        onClose={() => setFarcasterModalOpen(false)}
        onSuccess={handleFarcasterSuccess}
      />
    </div>
  );
}; 