'use client';

import TabNavigation from '../../components/TabNavigation';
import { InvestmentCard } from '../../components/InvestmentCard';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount } from 'wagmi';
import { useContributorLoans } from '@/hooks/useMicroLoan';
import Link from 'next/link';

export default function SupportingPage() {
  const { address } = useAccount();
  const { loanAddresses, isLoading } = useContributorLoans(address);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        sdk.actions.ready();
        console.log('[SupportingPage] Farcaster Mini App ready signal sent');
      } catch (error) {
        console.error('[SupportingPage] Error sending ready signal:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="frame-container">
      {/* Tab Navigation */}
      <TabNavigation />

      {/* Content */}
      <div className="w-full p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Investments</h1>
          <p className="text-sm text-gray-600">
            Track loans you're supporting
          </p>
        </div>

        {!address ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-sm text-gray-600">
              Please connect your wallet to view your investments
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B9B7F]"></div>
            <p className="mt-4 text-sm text-gray-600">Loading your investments...</p>
          </div>
        ) : loanAddresses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Not supporting anyone yet</h2>
            <p className="text-sm text-gray-600 mb-4">
              Browse the feed to find loans to support
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Browse Loans
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Supporting {loanAddresses.length} {loanAddresses.length === 1 ? 'loan' : 'loans'}
              </p>
              <Link
                href="/"
                className="px-3 py-1.5 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Browse More
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loanAddresses.map((loanAddress) => (
                <InvestmentCard key={loanAddress} loanAddress={loanAddress} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
