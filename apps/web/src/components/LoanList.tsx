'use client';

import React, { useEffect, useState } from 'react';
import { useLoans, useLoanData } from '@/hooks/useMicroLoan';
import { LoanCard } from './LoanCard';
import { fetchFromIPFS } from '@/lib/ipfs';

// Enhanced skeleton loading component matching actual loan card structure
const LoanCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-300 animate-pulse">
    {/* Optional image placeholder */}
    <div className="w-full h-48 bg-gray-100" />

    {/* Content */}
    <div className="p-5">
      {/* Title and badge */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-6 w-20 bg-gray-200 rounded-lg flex-shrink-0" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2.5 bg-gray-200 rounded-full mb-2" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
  </div>
);

// Component to fetch and display a single loan
const LoanCardWrapper = ({ loanAddress }: { loanAddress: `0x${string}` }) => {
  const { loanData, isLoading } = useLoanData(loanAddress);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (loanData?.metadataURI) {
      fetchFromIPFS(loanData.metadataURI)
        .then(data => {
          // Convert image IPFS URI to gateway URL if needed
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
      termPeriods={loanData.termPeriods}
      imageUrl={metadata?.image}
      fundraisingDeadline={loanData.fundraisingDeadline}
      businessWebsite={metadata?.loanDetails?.businessWebsite}
    />
  );
};

const LoanList = () => {
  const { loanAddresses, isLoading, error } = useLoans();

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
      <div className="text-center py-12 px-4">
        <div className="max-w-sm mx-auto">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#3B9B7F]/10 to-[#2E7D68]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-[#3B9B7F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>

          {/* Heading */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No Loan Requests Yet
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            Be the first in your community to create a zero-interest loan request and get support from your friends!
          </p>

          {/* CTA Button */}
          <a
            href="/create-loan"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Loan Request
          </a>

          {/* Info text */}
          <p className="text-xs text-gray-500 mt-4">
            Interest-free community lending powered by trust
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loanAddresses.map((address) => (
        <LoanCardWrapper key={address} loanAddress={address} />
      ))}
    </div>
  );
};

export default LoanList;
