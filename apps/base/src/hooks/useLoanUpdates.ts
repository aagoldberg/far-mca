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
 * Note: This assumes the subgraph has been updated with LoanUpdate entity
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
        const client = getClient();

        // For now, return empty array since subgraph doesn't have updates yet
        // Once subgraph is updated, uncomment the code below:

        /*
        const { data } = await client.query({
          query: GET_LOAN_UPDATES,
          variables: { id: loanAddress.toLowerCase() },
          fetchPolicy: 'network-only',
        });

        if (data?.microLoan?.updates) {
          const updatesList = data.microLoan.updates.map((u: any) => ({
            id: u.id,
            metadataURI: u.metadataURI,
            borrower: u.borrower,
            timestamp: parseInt(u.timestamp),
            transactionHash: u.transactionHash,
          }));

          // TODO: Fetch metadata from IPFS for each update
          setUpdates(updatesList);
        } else {
          setUpdates([]);
        }
        */

        // Placeholder: Return empty array until subgraph is updated
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
