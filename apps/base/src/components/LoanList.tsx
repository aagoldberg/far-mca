'use client';

import React, { useEffect, useState } from 'react';
import { useLoans, useLoanData } from '@/hooks/useMicroLoan';
import { LoanCard } from './LoanCard';
import { fetchFromIPFS, ipfsToHttp } from '@/lib/ipfs';

// Enhanced skeleton loading component matching actual loan card structure
const LoanCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-300 animate-pulse">
    {/* Header */}
    <div className="px-4 sm:px-5 pt-3 pb-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200" />
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-7 w-24 bg-gray-200 rounded-lg flex-shrink-0" />
      </div>
    </div>

    {/* Optional image placeholder */}
    <div className="w-full h-48 sm:h-56 bg-gray-100" />

    {/* Content */}
    <div className="p-4 sm:p-5">
      {/* Title */}
      <div className="flex items-start justify-between mb-2 gap-3">
        <div className="h-6 bg-gray-200 rounded w-2/3" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-200 rounded w-5/6" />
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-3 bg-gray-200 rounded-full mb-2.5" />
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-28" />
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-3">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

// Helper to determine if a loan is inactive
const isLoanInactive = (loanData: any): boolean => {
  if (!loanData) return false;
  const { fundraisingActive, active, completed, totalFunded, principal } = loanData;

  // A loan is inactive if it's not completed, not active, not fundraising, and not fully funded
  return !completed && !active && !fundraisingActive && totalFunded < principal;
};

// Component to fetch and display a single loan
const LoanCardWrapper = ({
  loanAddress,
  showInactive
}: {
  loanAddress: `0x${string}`;
  showInactive: boolean;
}) => {
  const { loanData, isLoading } = useLoanData(loanAddress);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (loanData?.metadataURI) {
      fetchFromIPFS(loanData.metadataURI)
        .then(data => {
          // Convert image IPFS URI to gateway URL using fallback system
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = ipfsToHttp(data.image, 0);
          }
          setMetadata(data);
        })
        .catch(err => {
          console.error('Error loading metadata:', err);
          // Set fallback metadata
          setMetadata({ name: 'Community Loan', description: 'Loading details...' });
        });
    }
  }, [loanData?.metadataURI]);

  if (isLoading || !loanData) {
    return <LoanCardSkeleton />;
  }

  const inactive = isLoanInactive(loanData);

  // Hide inactive loans if toggle is off
  if (inactive && !showInactive) {
    return null;
  }

  return (
    <div className={inactive ? 'opacity-60 grayscale' : ''}>
      <LoanCard
        address={loanData.address}
        borrower={loanData.borrower}
        name={metadata?.name || 'Loading...'}
        description={metadata?.description || ''}
        principal={loanData.principal}
        totalFunded={loanData.totalFunded}
        fundraisingActive={loanData.fundraisingActive}
        active={loanData.active}
        completed={loanData.completed}
        contributorsCount={loanData.contributorsCount}
        imageUrl={metadata?.image}
        fundraisingDeadline={loanData.fundraisingDeadline}
        businessWebsite={metadata?.loanDetails?.businessWebsite}
      />
    </div>
  );
};

const LoanList = () => {
  const { loanAddresses, isLoading, error } = useLoans();
  const [showInactive, setShowInactive] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => <LoanCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-500">Error loading loans</p>
        <p className="text-xs text-gray-500 mt-1">{error.message}</p>
      </div>
    );
  }

  if (!loanAddresses || loanAddresses.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-[#3B9B7F]/10 to-[#2E7D68]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#3B9B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>

          {/* Heading */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No Loan Requests Yet
          </h3>

          {/* Description */}
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Be the first in your community to create a zero-interest loan request and get support from your friends!
          </p>

          {/* CTA Button */}
          <a
            href="/create-loan"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-bold rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md text-base"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Loan Request
          </a>

          {/* Info text */}
          <p className="text-sm text-gray-500 mt-5">
            Interest-free community lending powered by trust
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          id="showInactive"
          checked={showInactive}
          onChange={(e) => setShowInactive(e.target.checked)}
          className="w-4 h-4 text-[#3B9B7F] bg-gray-100 border-gray-300 rounded focus:ring-[#3B9B7F] focus:ring-2"
        />
        <label htmlFor="showInactive" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
          Show inactive loans
        </label>
      </div>

      {/* Loan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loanAddresses.map((address) => (
          <LoanCardWrapper
            key={address}
            loanAddress={address}
            showInactive={showInactive}
          />
        ))}
      </div>
    </div>
  );
};

export default LoanList;
