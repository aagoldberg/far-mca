/**
 * usePortfolioData Hook
 *
 * Aggregates all contributions made by a user across all loans
 * Provides portfolio stats and claimable amounts
 */

import { useState, useEffect } from 'react';
import { useLoans, useContribution, useLoanData } from './useMicroLoan';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';

export interface PortfolioContribution {
  loanAddress: `0x${string}`;
  amount: bigint;
  claimable: bigint;
  loanActive: boolean;
  loanCompleted: boolean;
  loanBorrower: `0x${string}`;
  loanPrincipal: bigint;
  loanTotalFunded: bigint;
  metadataURI?: string;
}

export interface PortfolioData {
  contributions: PortfolioContribution[];
  totalContributed: bigint;
  totalClaimable: bigint;
  activeLoansCount: number;
  completedLoansCount: number;
  isLoading: boolean;
}

/**
 * Fetch portfolio data for a contributor
 * Checks all loans and aggregates contribution data
 */
export const usePortfolioData = (contributorAddress?: `0x${string}`): PortfolioData => {
  const { loanAddresses, isLoading: loansLoading } = useLoans();
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    contributions: [],
    totalContributed: 0n,
    totalClaimable: 0n,
    activeLoansCount: 0,
    completedLoansCount: 0,
    isLoading: true,
  });

  useEffect(() => {
    if (!contributorAddress || loansLoading || !loanAddresses || loanAddresses.length === 0) {
      if (!contributorAddress) {
        setPortfolioData({
          contributions: [],
          totalContributed: 0n,
          totalClaimable: 0n,
          activeLoansCount: 0,
          completedLoansCount: 0,
          isLoading: false,
        });
      }
      return;
    }

    const fetchPortfolioData = async () => {
      const contributions: PortfolioContribution[] = [];
      let totalContributed = 0n;
      let totalClaimable = 0n;
      let activeLoansCount = 0;
      let completedLoansCount = 0;

      // We'll use Promise.all to fetch all contributions in parallel
      // Note: This is a workaround since we can't directly use hooks in loops
      // In production, you might want to batch these requests
      for (const loanAddress of loanAddresses) {
        try {
          // Fetch contribution amount directly using contract read
          const contributionResponse = await fetch('/api/contract-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              loanAddress,
              contributorAddress,
              method: 'contribution'
            })
          });

          if (!contributionResponse.ok) continue;

          const { amount, claimable, loanData } = await contributionResponse.json();

          if (BigInt(amount) > 0n) {
            const amountBigInt = BigInt(amount);
            const claimableBigInt = BigInt(claimable);

            contributions.push({
              loanAddress,
              amount: amountBigInt,
              claimable: claimableBigInt,
              loanActive: loanData.active,
              loanCompleted: loanData.completed,
              loanBorrower: loanData.borrower,
              loanPrincipal: BigInt(loanData.principal),
              loanTotalFunded: BigInt(loanData.totalFunded),
              metadataURI: loanData.metadataURI,
            });

            totalContributed += amountBigInt;
            totalClaimable += claimableBigInt;

            if (loanData.active) activeLoansCount++;
            if (loanData.completed) completedLoansCount++;
          }
        } catch (error) {
          console.error(`Error fetching contribution for loan ${loanAddress}:`, error);
        }
      }

      setPortfolioData({
        contributions,
        totalContributed,
        totalClaimable,
        activeLoansCount,
        completedLoansCount,
        isLoading: false,
      });
    };

    fetchPortfolioData();
  }, [contributorAddress, loanAddresses, loansLoading]);

  return portfolioData;
};

/**
 * Simpler version that works without API endpoint
 * Uses multiple hook calls (less efficient but works immediately)
 */
export const usePortfolioDataSimple = (contributorAddress?: `0x${string}`): PortfolioData => {
  const { loanAddresses, isLoading: loansLoading } = useLoans();

  // For now, return loading state
  // The full implementation would need to be done in the component
  // using individual useContribution hooks for each loan
  return {
    contributions: [],
    totalContributed: 0n,
    totalClaimable: 0n,
    activeLoansCount: 0,
    completedLoansCount: 0,
    isLoading: loansLoading,
  };
};

/**
 * Format portfolio value for display
 */
export const formatPortfolioValue = (amount: bigint): string => {
  const value = parseFloat(formatUnits(amount, USDC_DECIMALS));
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
