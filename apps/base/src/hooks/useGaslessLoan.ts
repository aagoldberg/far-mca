/**
 * useGaslessLoan Hook
 *
 * Provides gasless loan creation using backend relayer
 * Users don't need ETH to create loans
 */

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface CreateLoanParams {
  principal: bigint;
  termPeriods: bigint;
  name: string;
  description?: string;
  imageUrl?: string;
  businessWebsite?: string;
}

interface GaslessLoanResult {
  createLoan: (params: CreateLoanParams) => Promise<{ txHash: string; loanAddress?: string }>;
  isLoading: boolean;
  error: Error | null;
}

export function useGaslessLoan(): GaslessLoanResult {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createLoan = async (params: CreateLoanParams) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/relay/create-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          principal: params.principal.toString(),
          termPeriods: params.termPeriods.toString(),
          name: params.name,
          description: params.description || '',
          imageUrl: params.imageUrl || '',
          businessWebsite: params.businessWebsite || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create loan');
      }

      return {
        txHash: data.txHash,
        loanAddress: data.loanAddress,
      };
    } catch (err: any) {
      const error = new Error(err.message || 'Failed to create loan');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createLoan,
    isLoading,
    error,
  };
}
