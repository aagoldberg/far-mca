'use client';

import { useState, useEffect } from 'react';
import { getClient } from '@/lib/apollo';
import { gql } from '@apollo/client';

export interface LoanUpdate {
  id: string;
  metadataURI: string;
  borrower: string;
  timestamp: number;
  transactionHash: string;
  // IPFS metadata fields (populated after fetch)
  title?: string;
  content?: string;
  updateType?: 'progress' | 'milestone' | 'gratitude' | 'repayment' | 'challenge';
  images?: string[];
}

const GET_LOAN_UPDATES = gql`
  query GetLoanUpdates($id: ID!) {
    microLoan(id: $id) {
      id
      updates {
        id
        metadataURI
        borrower
        timestamp
        transactionHash
      }
    }
  }
`;

/**
 * Hook to fetch loan updates from the subgraph
 */
export function useLoanUpdates(loanAddress: `0x${string}`) {
  const [updates, setUpdates] = useState<LoanUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!loanAddress) {
      setIsLoading(false);
      return;
    }

    async function fetchUpdates() {
      try {
        setIsLoading(true);

        // For now, return empty array since subgraph doesn't have updates yet
        // Once subgraph is updated, this will fetch real data
        setUpdates([]);

      } catch (err) {
        console.error('Error fetching loan updates:', err);
        setError(err as Error);
        setUpdates([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUpdates();
  }, [loanAddress]);

  return {
    updates,
    isLoading,
    error,
  };
}
