'use client';

import { useLoansWithMetadata } from '@/hooks/useLoansWithMetadata';
import { LoanCardWrapper, LoanCardSkeleton } from '@/components/loans/LoanCard';
import Link from 'next/link';

export function FeaturedCampaigns() {
  const { loanAddresses, isLoading } = useLoansWithMetadata();

  const featuredLoans = loanAddresses.slice(0, 3);

  return (
    <div id="featured-campaigns" className="w-full bg-white py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Campaigns
          </h2>
          <Link href="/explore" className="text-sm font-semibold text-[#2C7A7B] hover:text-[#234E52] transition-colors">
            See All &rarr;
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <LoanCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredLoans.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">No campaigns yet!</h3>
            <p className="text-gray-500 mt-2">Why not be the first to start one?</p>
            <Link href="/create-loan" className="mt-4 inline-block bg-[#2C7A7B] text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-[#234E52] transition-colors">
              Request Funding
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLoans.map(address => (
              <LoanCardWrapper key={address} loanAddress={address} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
