'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useIsSignedIn } from '@coinbase/cdp-hooks';
import { useAccount } from 'wagmi';
import { CreateFundingRequestButton } from "./CreateFundingRequestButton";
import { UserMenu } from './UserMenu';
import { AuthModal } from './AuthModal';
import { RotatingText } from './RotatingText';
import { LendFriendLogo } from './LendFriendLogo';
import { WalletBalance } from './WalletBalance';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 hover:text-gray-900">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSignedIn } = useIsSignedIn(); // CDP embedded wallet
  const { isConnected } = useAccount(); // External wallet (MetaMask, etc.)

  // Check if user is authenticated via either CDP or external wallet
  const isAuthenticated = isSignedIn || isConnected;

  // Debug logging
  console.log('Navbar - Auth state:', { isSignedIn, isConnected, isAuthenticated });


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (document.activeElement !== searchInputRef.current) {
             setIsSearchOpen(false);
        }
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, searchRef, aboutDropdownRef]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Focus search input when it opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };
  
  const toggleSearch = () => {
    if (isSearchOpen && searchQuery.trim()) {
        handleSearchSubmit(); 
    } else {
        setIsSearchOpen(!isSearchOpen);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <LendFriendLogo />
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Mobile Menu Slide-out Panel */}
        <>
          {/* Backdrop */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-10 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          
          {/* Sliding Panel */}
          <div 
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full bg-white">
              {/* Header with close button only */}
              <div className="flex justify-end p-4 bg-white">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>
              
              {/* Menu Content - GoFundMe style */}
              <div className="flex-1 px-6 py-4 bg-white">
                <div className="space-y-4">
                  {/* User authentication section - moved to top */}
                  <div className="w-full">
                    {isAuthenticated ? (
                      <UserMenu inline={true} onItemClick={() => setMobileMenuOpen(false)} />
                    ) : (
                      <div className="w-full">
                        <AuthModal />
                      </div>
                    )}
                  </div>

                  {/* Wallet balances - show when connected */}
                  {isAuthenticated && (
                    <div className="w-full">
                      <WalletBalance forceDesktopView={true} />
                    </div>
                  )}

                  {/* Create loan button - only show when not connected */}
                  {!isAuthenticated && (
                    <div className="w-full">
                      <Link
                        href="/create-loan"
                        className="block w-full text-center bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-3 px-5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create a Loan
                      </Link>
                    </div>
                  )}

                  {/* About Section */}
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 mb-3">
                      About
                    </p>
                    <div className="space-y-1">
                      <Link
                        href="/about"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        About LendFriend
                      </Link>
                      <Link
                        href="/vision"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Vision & Roadmap
                      </Link>
                      <Link
                        href="/economic-context"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Background
                      </Link>
                      <a
                        href="https://docs.lendfriend.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Documentation (Draft)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <LendFriendLogo />
            </Link>
            
            {/* Search Area - Desktop only */}
            <div className="flex items-center space-x-3" ref={searchRef}>
              <button
                onClick={toggleSearch}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#29738F] focus:ring-opacity-20"
                aria-label={
                  isSearchOpen && searchQuery.trim()
                    ? 'Submit search'
                    : 'Open search'
                }
              >
                <SearchIcon />
              </button>
              {isSearchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center"
                >
                  <input
                    ref={searchInputRef}
                    type="search"
                    name="search"
                    placeholder="Search funding requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29738F] focus:border-[#29738F] text-sm text-gray-900"
                  />
                </form>
              )}
            </div>
          </div>

          {/* Center: About Dropdown */}
          <div
            className={`flex-grow flex items-center justify-center ${
              isSearchOpen && 'hidden sm:flex'
            }`}
          >
            <div className="relative" ref={aboutDropdownRef}>
              <button
                onClick={() => {
                  console.log('About button clicked! Current state:', aboutDropdownOpen);
                  setAboutDropdownOpen(!aboutDropdownOpen);
                }}
                className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                About
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E8B8B] transition-colors"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    About LendFriend
                  </Link>
                  <Link
                    href="/vision"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E8B8B] transition-colors"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    Vision & Roadmap
                  </Link>
                  <Link
                    href="/economic-context"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E8B8B] transition-colors"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    Background
                  </Link>
                  <a
                    href="https://docs.lendfriend.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2E8B8B] transition-colors"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    Documentation (Draft)
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right: Wallet Balance, Auth Buttons and User Menu */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            {isAuthenticated && <WalletBalance />}
            <Link
              href="/create-loan"
              className="bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Loan
            </Link>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <AuthModal />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 