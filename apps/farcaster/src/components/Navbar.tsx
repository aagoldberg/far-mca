'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useUSDCFaucet, useUSDCBalance } from '@/hooks/useUSDC';
import { useFarcasterUser } from '@/contexts/FarcasterContext';
import ConnectWallet from './ConnectWallet';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 hover:text-gray-900">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const GrowthIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
  </svg>
);

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { user: farcasterUser } = useFarcasterUser();
  const { balanceFormatted } = useUSDCBalance(address);
  const { faucet, isPending, isConfirming, isSuccess } = useUSDCFaucet();
  const [showSuccess, setShowSuccess] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [isSuccess]);

  // Close About dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aboutDropdownRef]);

  const handleFaucet = () => {
    faucet(); // Mints 1000 USDC by default
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center group no-underline">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#2C7DA0] from-35% via-[#2E8B8B] via-45% to-[#3B9B7F] to-55% bg-clip-text text-transparent group-hover:from-[#236382] group-hover:via-[#26706F] group-hover:to-[#2E7D68] transition-all">
                LendFriend
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 -mt-0.5 font-semibold tracking-wider hidden xs:block">
                COMMUNITY LENDING
              </span>
            </div>
          </Link>

          {/* Center: About Dropdown */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative" ref={aboutDropdownRef}>
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                About
                <ChevronDownIcon className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 sm:w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E8B8B] transition-colors"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    About LendFriend
                  </Link>
                  <Link
                    href="/vision"
                    className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E8B8B] transition-colors"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    Vision & Roadmap
                  </Link>
                  <Link
                    href="/research"
                    className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E8B8B] transition-colors"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    Research
                  </Link>
                  <a
                    href="https://docs.lendfriend.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E8B8B] transition-colors"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    Documentation (Draft)
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Create Loan button & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Create Loan Button */}
            <Link
              href="/create"
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Loan
            </Link>

            {/* Profile Avatar - Shows Farcaster pfp if available */}
            {isConnected && address && (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                {farcasterUser?.pfpUrl ? (
                  <Image
                    src={farcasterUser.pfpUrl}
                    alt={farcasterUser.displayName || farcasterUser.username || 'Profile'}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                    {address.slice(2, 4).toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
