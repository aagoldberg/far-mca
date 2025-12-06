"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useEvmAddress, useSignOut, useCurrentUser } from '@coinbase/cdp-hooks';
import { useAccount, useDisconnect } from 'wagmi';
import { HeartIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { FarcasterOnboardingModal } from './FarcasterOnboardingModal';
import { useFarcasterAccount } from '@/hooks/useFarcasterAccount';

type UserMenuProps = {
  inline?: boolean;
  onItemClick?: () => void;
};

export const UserMenu = ({ inline = false, onItemClick }: UserMenuProps) => {
  // CDP Embedded Wallet hooks
  const { evmAddress: cdpAddress } = useEvmAddress();
  const { signOut } = useSignOut();
  const { currentUser } = useCurrentUser();

  // External wallet hooks (RainbowKit/wagmi)
  const { address: externalAddress, isConnected: isExternalConnected } = useAccount();
  const { disconnect: disconnectExternal } = useDisconnect();

  // Farcaster account hook
  const { farcasterAccount } = useFarcasterAccount();

  // Prioritize external wallet address if connected, otherwise use CDP address
  const address = isExternalConnected ? externalAddress : cdpAddress;

  const [menuOpen, setMenuOpen] = useState(false);
  const [farcasterModalOpen, setFarcasterModalOpen] = useState(false);
  const [farcasterProfile, setFarcasterProfile] = useState<{ fid: number; username: string; pfp_url?: string; display_name?: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get user info - Prioritize Farcaster profile > CDP OAuth > wallet address
  const displayName = farcasterProfile?.display_name ||
                      farcasterProfile?.username ||
                      (currentUser as any)?.name ||
                      (currentUser as any)?.displayName ||
                      (currentUser as any)?.username ||
                      (currentUser as any)?.email ||
                      (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User');

  const userAvatar = farcasterProfile?.pfp_url ||
                     (currentUser as any)?.picture ||
                     (currentUser as any)?.avatarUrl ||
                     (currentUser as any)?.profilePictureUrl;

  const handleDisconnect = () => {
    if (isExternalConnected) {
      // Disconnect external wallet (MetaMask, etc.)
      disconnectExternal();
    } else {
      // Sign out from CDP embedded wallet
      signOut();
    }
  };

  // Fetch Farcaster profile data when account is available
  useEffect(() => {
    async function fetchFarcasterProfile() {
      if (!farcasterAccount?.fid) return;

      try {
        const response = await fetch(
          `https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterAccount.fid}`,
          {
            headers: {
              'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const user = data.users?.[0];

          if (user) {
            setFarcasterProfile({
              fid: user.fid,
              username: user.username,
              pfp_url: user.pfp_url,
              display_name: user.display_name,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching Farcaster profile:', error);
      }
    }

    fetchFarcasterProfile();
  }, [farcasterAccount]);

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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-600 to-brand-400 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {displayName.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
          </div>
        </div>

        {/* Farcaster Account Prompt */}
        {!farcasterAccount && (
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
            href="/create-loan"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-bold no-underline transition-colors"
            onClick={handleItemClick}
          >
            Get Funded
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
              handleDisconnect();
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
        className="flex items-center space-x-2 p-1.5 pr-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary-500"
        aria-label="Open user menu"
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-600 to-brand-400 flex items-center justify-center">
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-600 to-brand-400 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {displayName.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </p>
              </div>
            </div>
          </div>

          {/* Farcaster Account Prompt */}
          {!farcasterAccount && (
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
              handleDisconnect();
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
      <FarcasterOnboardingModal
        isOpen={farcasterModalOpen}
        onClose={() => setFarcasterModalOpen(false)}
        suggestedUsername={address ? `user${address.slice(-6).toLowerCase()}` : ''}
      />
    </div>
  );
}; 