'use client';

import React, { useEffect, useState } from 'react';
import { useLoans, useLoanData } from '@/hooks/useMicroLoan';
import { LoanCard } from './LoanCard';

// Skeleton loading component
const LoanCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 animate-pulse">
    <div className="p-4">
      <div className="h-5 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
      <div className="h-2 bg-gray-200 rounded-full mb-2" />
      <div className="flex justify-between mt-2">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
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
      fetch(loanData.metadataURI)
        .then(res => res.json())
        .then(data => setMetadata(data))
        .catch(err => console.error('Error loading metadata:', err));
    }
  }, [loanData?.metadataURI]);

  if (isLoading || !loanData) {
    return <LoanCardSkeleton />;
  }

  return (
    <LoanCard
      address={loanData.address}
      name={metadata?.name || 'Loading...'}
      description={metadata?.description || ''}
      principal={loanData.principal}
      totalFunded={loanData.totalFunded}
      fundraisingActive={loanData.fundraisingActive}
      active={loanData.active}
      completed={loanData.completed}
      contributorsCount={loanData.contributorsCount}
      termPeriods={loanData.termPeriods}
      imageUrl={metadata?.imageUrl}
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
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 mb-1">No loans yet</p>
        <p className="text-xs text-gray-400">
          Be the first to create a zero-interest loan!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loanAddresses.map((address) => (
        <LoanCardWrapper key={address} loanAddress={address} />
      ))}
    </div>
  );
};

export default LoanList;
