'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useUSDCFaucet, useUSDCBalance } from '@/hooks/useUSDC';
import ConnectWallet from './ConnectWallet';

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
  const { balanceFormatted } = useUSDCBalance(address);
  const { faucet, isPending, isConfirming, isSuccess } = useUSDCFaucet();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [isSuccess]);

  const handleFaucet = () => {
    faucet(); // Mints 1000 USDC by default
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col group no-underline">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#2C7DA0] from-35% via-[#2E8B8B] via-45% to-[#3B9B7F] to-55% bg-clip-text text-transparent group-hover:from-[#236382] group-hover:via-[#26706F] group-hover:to-[#2E7D68] transition-all">
              LendFriend
            </span>
            <span className="text-xs text-gray-600 -mt-1">Community Lending</span>
          </Link>

          {/* Right side - Create Loan button & Profile */}
          <div className="flex items-center gap-3">
            {/* Create Loan Button */}
            <Link
              href="/create"
              className="px-3 py-1.5 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              + Create
            </Link>

            {/* Profile Avatar (placeholder for now) */}
            {isConnected && address && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C7DA0] to-[#3B9B7F] flex items-center justify-center text-white text-xs font-bold">
                {address.slice(2, 4).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
