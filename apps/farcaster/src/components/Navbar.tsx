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
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div className="transition-all duration-300 group-hover:scale-110">
              <GrowthIcon />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#2E7D32] group-hover:text-[#4CAF50] transition-colors">
              lendfriend
            </span>
          </Link>

          {/* Right side - Wallet & Balance & Faucet */}
          <div className="flex items-center gap-3">
            {!isConnected ? (
              <ConnectWallet />
            ) : (
              <>
                {/* Balance display */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {balanceFormatted}
                  </span>
                </div>

                {/* Faucet button */}
                <button
                  onClick={handleFaucet}
                  disabled={isPending || isConfirming}
                  className="relative px-3 py-1.5 bg-[#2E7D32] hover:bg-[#4CAF50] text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isPending || isConfirming ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="hidden sm:inline">Minting...</span>
                    </span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Get Test USDC</span>
                      <span className="sm:hidden">Faucet</span>
                    </>
                  )}
                </button>

                {/* Success notification */}
                {showSuccess && (
                  <div className="absolute top-20 right-4 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg animate-fade-in-down">
                    <p className="text-sm text-green-800 font-medium">
                      ✅ 1000 USDC minted successfully!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
