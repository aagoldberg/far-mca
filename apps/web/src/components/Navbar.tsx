'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useConnect } from 'wagmi';
import { CreateFundingRequestButton } from "./CreateFundingRequestButton";
import { UserMenu } from './UserMenu';
import { RotatingText } from './RotatingText';
import { YunusLogo } from './YunusLogo';
import { WalletBalance } from './WalletBalance';

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
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  
  // Debug logging
  console.log('Navbar - Privy state:', { ready, authenticated });


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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, searchRef]);

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <YunusLogo />
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
                    {!ready ? (
                      <div className="w-full h-12 bg-gray-100 rounded-xl animate-pulse" />
                    ) : authenticated ? (
                      <UserMenu inline={true} onItemClick={() => setMobileMenuOpen(false)} />
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          login();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-5 border border-gray-200 rounded-xl shadow-sm transition-colors"
                      >
                        Sign in
                      </button>
                    )}
                  </div>

                  {/* Wallet balances - show when authenticated */}
                  {authenticated && (
                    <div className="w-full">
                      <WalletBalance forceDesktopView={true} />
                    </div>
                  )}
                  
                  {/* Request funding button - only show when not authenticated */}
                  {!authenticated && (
                    <div className="w-full">
                      <CreateFundingRequestButton />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <YunusLogo />
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

          {/* Center: Logo */}
          <div
            className={`flex-grow flex items-center justify-center ${
              isSearchOpen && 'hidden sm:flex'
            }`}
          >
            {/* The centered logo is removed to prevent layout conflicts */}
          </div>

          {/* Right: Wallet Balance, Auth Buttons and User Menu */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            {authenticated && <WalletBalance />}
            <CreateFundingRequestButton />
            {!ready ? (
              <div className="w-20 h-10 bg-gray-100 rounded-xl animate-pulse" />
            ) : authenticated ? (
              <UserMenu />
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  login();
                }}
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-5 border border-gray-200 rounded-xl shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#29738F] focus:ring-opacity-20"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 