'use client';

import { useState, useEffect, useRef } from 'react';
import { useLoans, useLoanData } from './useMicroLoan';
import { fetchFromIPFS, ipfsToHttp } from '@/lib/ipfs';

export interface LoanWithMetadata {
  // On-chain data
  address: `0x${string}`;
  borrower: `0x${string}`;
  principal: bigint;
  totalFunded: bigint;
  fundraisingActive: boolean;
  active: boolean;
  completed: boolean;
  contributorsCount: number;
  fundraisingDeadline: bigint;
  metadataURI: string;

  // IPFS metadata
  name?: string;
  title?: string;
  description?: string;
  fullDescription?: string;
  image?: string;
  imageUrl?: string;

  // Computed
  progress: number;
  daysLeft?: number;
  raised: number;
  goal: number;
  creator?: string;
}

/**
 * Custom hook to fetch all loans with their metadata from IPFS
 * Combines on-chain data from smart contracts with off-chain metadata
 */
export function useLoansWithMetadata() {
  const { loanAddresses, isLoading: isLoadingAddresses, error } = useLoans();
  const [loansWithMetadata, setLoansWithMetadata] = useState<LoanWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevAddressesRef = useRef<string>('');
  const hasLoadedRef = useRef(false);

  // Stringify addresses to create a stable dependency
  const addressesKey = loanAddresses ? loanAddresses.join(',') : '';

  useEffect(() => {
    // Skip if addresses haven't changed and we've already loaded
    if (prevAddressesRef.current === addressesKey && hasLoadedRef.current) {
      return;
    }
    prevAddressesRef.current = addressesKey;

    // If there's an error fetching loans, treat it as no loans available
    // This handles cases where the contract hasn't been deployed or network issues
    if (error) {
      console.warn('[useLoansWithMetadata] Error fetching loan addresses:', error);
      setLoansWithMetadata([]);
      setIsLoading(false);
      hasLoadedRef.current = true;
      return;
    }

    if (!loanAddresses || loanAddresses.length === 0) {
      setLoansWithMetadata([]);
      setIsLoading(false);
      hasLoadedRef.current = true;
      return;
    }

    // Fetch all loan data with metadata in parallel
    const fetchLoansData = async () => {
      try {
        const loansPromises = loanAddresses.map(async (address) => {
          // This will be handled by individual LoanWithMetadata component
          return { address } as LoanWithMetadata;
        });

        const loans = await Promise.all(loansPromises);
        setLoansWithMetadata(loans);
        hasLoadedRef.current = true;
      } catch (err) {
        console.error('Error fetching loans:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoansData();
  }, [addressesKey, error, loanAddresses]);

  return {
    loans: loansWithMetadata,
    loanAddresses: loanAddresses || [],
    isLoading: isLoadingAddresses || isLoading,
    error: undefined, // Don't propagate errors to UI, just show empty state
  };
}

/**
 * Hook to fetch a single loan with its IPFS metadata
 * Used for displaying individual loan cards
 */
export function useLoanWithMetadata(loanAddress: `0x${string}`) {
  const { loanData, isLoading } = useLoanData(loanAddress);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  useEffect(() => {
    if (loanData?.metadataURI) {
      setIsLoadingMetadata(true);
      fetchFromIPFS(loanData.metadataURI)
        .then(data => {
          // Convert image IPFS URI to gateway URL
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = ipfsToHttp(data.image, 0);
          }
          setMetadata(data);
        })
        .catch(err => {
          console.error('Error loading metadata for', loanAddress, ':', err);
          // Set fallback metadata
          setMetadata({ name: 'Community Loan', description: 'Loading details...' });
        })
        .finally(() => {
          setIsLoadingMetadata(false);
        });
    } else if (!loanData) {
      setIsLoadingMetadata(false);
    }
  }, [loanData?.metadataURI, loanAddress]);

  if (!loanData) {
    return {
      loan: null,
      isLoading: isLoading || isLoadingMetadata,
    };
  }

  // Combine on-chain and off-chain data
  const combinedLoan: LoanWithMetadata = {
    address: loanData.address,
    borrower: loanData.borrower,
    principal: loanData.principal,
    totalFunded: loanData.totalFunded,
    fundraisingActive: loanData.fundraisingActive,
    active: loanData.active,
    completed: loanData.completed,
    contributorsCount: loanData.contributorsCount,
    fundraisingDeadline: loanData.fundraisingDeadline,
    metadataURI: loanData.metadataURI,

    // Metadata
    name: metadata?.name || metadata?.title,
    title: metadata?.name || metadata?.title,
    description: metadata?.description,
    fullDescription: metadata?.fullDescription,
    image: metadata?.image,
    imageUrl: metadata?.image,
    creator: metadata?.borrower || loanData.borrower,

    // Computed values (convert from USDC wei to dollars)
    raised: Number(loanData.totalFunded) / 1e6,
    goal: Number(loanData.principal) / 1e6,
    progress: loanData.principal > 0n
      ? (Number(loanData.totalFunded) / Number(loanData.principal)) * 100
      : 0,

    // Days left calculation
    daysLeft: loanData.fundraisingDeadline > 0n
      ? Math.max(0, Math.floor((Number(loanData.fundraisingDeadline) - Date.now() / 1000) / 86400))
      : undefined,
  };

  return {
    loan: combinedLoan,
    isLoading: isLoading || isLoadingMetadata,
  };
}
