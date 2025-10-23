'use client';

import React, { useEffect, useState } from 'react';
import { useLoans, useLoanData } from '@/hooks/useMicroLoan';
import { LoanCard } from './LoanCard';

// Enhanced skeleton loading component matching actual loan card structure
const LoanCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 animate-pulse">
    {/* Header with borrower */}
    <div className="px-3 sm:px-4 pt-3 pb-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200" />
        <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-20 sm:w-24" />
      </div>
    </div>

    {/* Optional image placeholder */}
    <div className="w-full h-40 sm:h-48 bg-gray-100" />

    {/* Content */}
    <div className="p-3 sm:p-4">
      {/* Title and badge */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-full flex-shrink-0" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-3">
        <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-full" />
        <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-5/6" />
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full mb-2" />
        <div className="flex justify-between">
          <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-20 sm:w-24" />
          <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-16 sm:w-20" />
        </div>
      </div>

      {/* Contributors footer */}
      <div className="pt-2.5 sm:pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 border-2 border-white" />
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 border-2 border-white" />
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 border-2 border-white" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-24 sm:w-32" />
        </div>
      </div>
    </div>
  </div>
);

// Component to fetch and display a single loan
export const LoanCardWrapper = ({ loanAddress }: { loanAddress: `0x${string}` }) => {
  const { loanData, isLoading } = useLoanData(loanAddress);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (loanData?.metadataURI) {
      // Convert ipfs:// to HTTP gateway URL
      const metadataUrl = loanData.metadataURI.startsWith('ipfs://')
        ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${loanData.metadataURI.replace('ipfs://', '')}`
        : loanData.metadataURI;

      fetch(metadataUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch metadata');
          return res.json();
        })
        .then(data => {
          // Also convert image IPFS URI to gateway URL
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${data.image.replace('ipfs://', '')}`;
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

  return (
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
      dueAt={loanData.dueAt}
      imageUrl={metadata?.image}
      fundraisingDeadline={loanData.fundraisingDeadline}
      totalRepaid={loanData.totalRepaid}
    />
  );
};

const LoanList = () => {
  const { loanAddresses, isLoading, error } = useLoans();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <LoanCardSkeleton key={i} />)}
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
      <div className="text-center py-8 sm:py-12 px-3 sm:px-4">
        <div className="max-w-sm mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#3B9B7F]/10 to-[#2E7D68]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#3B9B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>

          {/* Heading */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
            No Loan Requests Yet
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            Be the first in your community to create a zero-interest loan request and get support from your friends!
          </p>

          {/* CTA Button */}
          <a
            href="/create"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white text-sm sm:text-base font-semibold rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md touch-manipulation"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Loan Request
          </a>

          {/* Info text */}
          <p className="text-[11px] sm:text-xs text-gray-500 mt-3 sm:mt-4">
            Interest-free community lending powered by trust
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {loanAddresses.map((address) => (
        <LoanCardWrapper key={address} loanAddress={address} />
      ))}
    </div>
  );
};

export default LoanList;
