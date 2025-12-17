/**
 * useMicroLoan Hook
 *
 * React hooks for interacting with MicroLoan and MicroLoanFactory contracts
 * Handles all read and write operations for zero-interest microloans
 */

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt, useAccount, usePublicClient } from 'wagmi';
import { useWalletType } from '@/hooks/useWalletType';
import { useState, useEffect } from 'react';
import { formatUnits, parseUnits, encodeFunctionData } from 'viem';
import { MICROLOAN_FACTORY_ADDRESS, USDC_ADDRESS } from '@/lib/wagmi';
import MicroLoanFactoryABI from '@/abi/MicroLoanFactory.json';
import MicroLoanABI from '@/abi/MicroLoan.json';
import {
  RawLoan,
  LoanDetails,
  UserContribution,
  USDC_DECIMALS
} from '@/types/loan';
import { useSendUserOperation, useWaitForUserOperation, useEvmAddress } from '@coinbase/cdp-hooks';

const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL;

// =============================================================================
// FACTORY - GET ALL LOANS
// =============================================================================

/**
 * Get all loan addresses from the factory
 */
export const useLoans = () => {
  const { data: loanAddresses, isLoading, error, refetch } = useReadContract({
    address: MICROLOAN_FACTORY_ADDRESS,
    abi: MicroLoanFactoryABI.abi,
    functionName: 'getLoans',
  });

  return {
    loanAddresses: (loanAddresses as `0x${string}`[]) || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Get loans created by a specific borrower
 */
export const useBorrowerLoans = (borrower: `0x${string}` | undefined) => {
  const { data: loanAddresses, isLoading, error, refetch } = useReadContract({
    address: MICROLOAN_FACTORY_ADDRESS,
    abi: MicroLoanFactoryABI.abi,
    functionName: 'getBorrowerLoans',
    args: borrower ? [borrower] : undefined,
    query: {
      enabled: !!borrower,
    },
  });

  return {
    loanAddresses: (loanAddresses as `0x${string}`[]) || [],
    isLoading,
    error,
    refetch,
  };
};

// =============================================================================
// LOAN - READ BASIC INFO
// =============================================================================

/**
 * Get raw loan data from contract
 * Returns all basic loan information
 */
export const useLoanData = (loanAddress: `0x${string}` | undefined) => {
  const enabled = !!loanAddress;

  // Read all loan data in parallel
  const { data: borrower } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'borrower',
    query: { enabled },
  });

  const { data: principal } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'principal',
    query: { enabled },
  });

  const { data: totalFunded } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'totalFunded',
    query: { enabled },
  });

  const { data: outstandingPrincipal } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'outstandingPrincipal',
    query: { enabled },
  });

  const { data: dueAt } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'dueAt',
    query: { enabled },
  });

  const { data: fundraisingDeadline } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'fundraisingDeadline',
    query: { enabled },
  });

  const { data: metadataURI } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'metadataURI',
    query: { enabled },
  });

  const { data: fundraisingActive } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'fundraisingActive',
    query: { enabled },
  });

  const { data: active } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'active',
    query: { enabled },
  });

  const { data: completed } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'completed',
    query: { enabled },
  });

  const { data: contributorsCount } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributorsCount',
    query: { enabled },
  });

  const { data: totalRepaid } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'totalRepaid',
    query: { enabled },
  });

  const { data: cancelled } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'cancelled',
    query: { enabled },
  });

  const { data: fundedAt } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'fundedAt',
    query: { enabled },
  });

  if (!loanAddress) {
    return { loanData: null, isLoading: false };
  }

  // Check if still loading
  const isLoading = borrower === undefined || principal === undefined;

  if (isLoading) {
    return { loanData: null, isLoading: true };
  }

  const loanData: RawLoan = {
    address: loanAddress,
    borrower: borrower as `0x${string}`,
    principal: principal as bigint,
    totalFunded: totalFunded as bigint,
    totalRepaid: totalRepaid as bigint,
    outstandingPrincipal: outstandingPrincipal as bigint,
    dueAt: dueAt as bigint,
    fundraisingDeadline: fundraisingDeadline as bigint,
    fundedAt: fundedAt as bigint,
    metadataURI: metadataURI as string,
    fundraisingActive: fundraisingActive as boolean,
    active: active as boolean,
    completed: completed as boolean,
    cancelled: cancelled as boolean,
    contributorsCount: contributorsCount as bigint,
  };

  return { loanData, isLoading: false };
};

// =============================================================================
// LOAN - USER CONTRIBUTIONS
// =============================================================================

/**
 * Get user's contribution to a loan
 */
export const useContribution = (
  loanAddress: `0x${string}` | undefined,
  contributorAddress: `0x${string}` | undefined
) => {
  const enabled = !!loanAddress && !!contributorAddress;

  const { data: contributionAmount } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributions',
    args: contributorAddress ? [contributorAddress] : undefined,
    query: { enabled },
  });

  const { data: claimableAmount } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'claimableAmount',
    args: contributorAddress ? [contributorAddress] : undefined,
    query: { enabled },
  });

  // Get total funded for calculating share percentage
  const { data: totalFunded } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'totalFunded',
    query: { enabled },
  });

  if (!enabled || contributionAmount === undefined) {
    return { contribution: null, isLoading: !enabled };
  }

  const amount = contributionAmount as bigint;
  const claimable = claimableAmount as bigint;
  const total = (totalFunded as bigint) || 0n;

  const contribution: UserContribution = {
    loanAddress: loanAddress!,
    contributorAddress: contributorAddress!,
    amount,
    amountFormatted: `${formatUnits(amount, USDC_DECIMALS)} USDC`,
    claimable,
    claimableFormatted: `${formatUnits(claimable, USDC_DECIMALS)} USDC`,
    claimed: 0n, // Would need to track this separately
    claimedFormatted: '0.00 USDC',
    sharePercentage: total > 0n ? Number((amount * 10000n) / total) / 100 : 0,
  };

  return { contribution, isLoading: false };
};

/**
 * Get first N contributors for a loan
 */
export const useContributors = (
  loanAddress: `0x${string}` | undefined,
  limit: number = 3
) => {
  const enabled = !!loanAddress;

  // First get the count
  const { data: count } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributorsCount',
    query: { enabled },
  });

  const contributorsCount = (count as bigint) || 0n;
  const actualLimit = Math.min(Number(contributorsCount), limit);

  // Fetch the first N contributors by index
  const contributorQueries = Array.from({ length: actualLimit }, (_, i) => ({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributors',
    args: [BigInt(i)],
  }));

  const { data: contributorsData } = useReadContracts({
    contracts: contributorQueries.length > 0 ? contributorQueries as any : [],
    query: { enabled: enabled && actualLimit > 0 },
  });

  const contributors = contributorsData
    ?.filter((result) => result.status === 'success')
    .map((result) => result.result as `0x${string}`) || [];

  if (process.env.NODE_ENV === 'development' && enabled && contributors.length > 0) {
    console.log(`[Contributors] Loan ${loanAddress?.slice(0, 6)}...${loanAddress?.slice(-4)}:`, {
      count: Number(contributorsCount),
      limit: actualLimit,
      contributors: contributors.map(addr => `${addr.slice(0, 6)}...${addr.slice(-4)}`),
    });
  }

  return {
    contributors,
    totalCount: Number(contributorsCount),
    hasMore: Number(contributorsCount) > limit,
  };
};

/**
 * Get contributors with their contribution amounts
 * Fetches a larger pool to enable filtering by Farcaster profiles
 */
export const useContributorsWithAmounts = (
  loanAddress: `0x${string}` | undefined,
  limit: number = 10
) => {
  const enabled = !!loanAddress;

  // First get the count
  const { data: count } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributorsCount',
    query: { enabled },
  });

  const contributorsCount = (count as bigint) || 0n;
  const actualLimit = Math.min(Number(contributorsCount), limit);

  // Fetch contributor addresses
  const contributorQueries = Array.from({ length: actualLimit }, (_, i) => ({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributors',
    args: [BigInt(i)],
  }));

  const { data: contributorsData } = useReadContracts({
    contracts: contributorQueries.length > 0 ? contributorQueries as any : [],
    query: { enabled: enabled && actualLimit > 0 },
  });

  const contributorAddresses = contributorsData
    ?.filter((result) => result.status === 'success')
    .map((result) => result.result as `0x${string}`) || [];

  // Fetch contribution amounts for each contributor
  const amountQueries = contributorAddresses.map(addr => ({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributions',
    args: [addr],
  }));

  const { data: amountsData } = useReadContracts({
    contracts: amountQueries.length > 0 ? amountQueries as any : [],
    query: { enabled: enabled && contributorAddresses.length > 0 },
  });

  const amounts = amountsData
    ?.filter((result) => result.status === 'success')
    .map((result) => result.result as bigint) || [];

  // Combine addresses and amounts, then sort by amount descending
  const contributorsWithAmounts = contributorAddresses
    .map((address, index) => ({
      address,
      amount: amounts[index] || 0n,
    }))
    .sort((a, b) => {
      // Sort by amount descending
      if (a.amount > b.amount) return -1;
      if (a.amount < b.amount) return 1;
      return 0;
    });

  if (process.env.NODE_ENV === 'development' && enabled && contributorsWithAmounts.length > 0) {
    console.log(`[ContributorsWithAmounts] Loan ${loanAddress?.slice(0, 6)}...${loanAddress?.slice(-4)}:`, {
      count: Number(contributorsCount),
      fetched: contributorsWithAmounts.length,
      topContributors: contributorsWithAmounts.slice(0, 3).map(c => ({
        address: `${c.address.slice(0, 6)}...${c.address.slice(-4)}`,
        amount: Number(c.amount) / 1e6, // Convert to USDC
      })),
    });
  }

  return {
    contributors: contributorsWithAmounts,
    totalCount: Number(contributorsCount),
    hasMore: Number(contributorsCount) > limit,
  };
};

// =============================================================================
// LOAN - WRITE FUNCTIONS
// =============================================================================

/**
 * Contribute to a loan
 * NOTE: Requires USDC approval first!
 */
export const useContribute = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const contribute = async (loanAddress: `0x${string}`, amount: bigint) => {
    writeContract({
      address: loanAddress,
      abi: MicroLoanABI.abi,
      functionName: 'contribute',
      args: [amount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    contribute,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Claim returns from a loan
 */
export const useClaim = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const claim = async (loanAddress: `0x${string}`) => {
    writeContract({
      address: loanAddress,
      abi: MicroLoanABI.abi,
      functionName: 'claim',
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    claim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Disburse loan funds (borrower only)
 */
export const useDisburse = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const disburse = async (loanAddress: `0x${string}`) => {
    writeContract({
      address: loanAddress,
      abi: MicroLoanABI.abi,
      functionName: 'disburse',
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    disburse,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Make a repayment (borrower only)
 * NOTE: Requires USDC approval first!
 */
export const useRepay = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const repay = async (loanAddress: `0x${string}`, amount: bigint) => {
    writeContract({
      address: loanAddress,
      abi: MicroLoanABI.abi,
      functionName: 'repay',
      args: [amount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    repay,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Cancel fundraising (borrower only)
 */
export const useCancelFundraise = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const cancelFundraise = async (loanAddress: `0x${string}`) => {
    writeContract({
      address: loanAddress,
      abi: MicroLoanABI.abi,
      functionName: 'cancelFundraise',
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    cancelFundraise,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Request refund (if loan cancelled)
 */
export const useRefund = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const refund = async (loanAddress: `0x${string}`) => {
    writeContract({
      address: loanAddress,
      abi: MicroLoanABI.abi,
      functionName: 'refund',
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    refund,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// =============================================================================
// FACTORY - CREATE LOAN
// =============================================================================

/**
 * Create a new loan
 */
export const useCreateLoan = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const createLoan = async (params: {
    borrower: `0x${string}`;
    metadataURI: string;
    principal: bigint;
    loanDuration: number;
    fundraisingDeadline: number;
  }) => {
    writeContract({
      address: MICROLOAN_FACTORY_ADDRESS,
      abi: MicroLoanFactoryABI.abi,
      functionName: 'createLoan',
      args: [
        params.borrower,
        params.metadataURI,
        params.principal,
        BigInt(params.loanDuration),
        BigInt(params.fundraisingDeadline),
      ],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    createLoan,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Create a new loan using CDP Smart Wallet with gasless transactions
 * Uses useSendUserOperation from @coinbase/cdp-hooks which properly
 * handles CDP Smart Accounts with paymaster support
 */
export const useCreateLoanGasless = () => {
  const { sendUserOperation, status, data, error } = useSendUserOperation();
  const { evmAddress } = useEvmAddress();

  const createLoan = async (params: {
    borrower: `0x${string}`;
    metadataURI: string;
    principal: bigint;
    loanDuration: number;
    fundraisingDeadline: number;
  }) => {
    console.log('[useCreateLoanGasless] Creating loan with CDP Smart Wallet:', {
      factoryAddress: MICROLOAN_FACTORY_ADDRESS,
      paymasterUrl: PAYMASTER_URL,
      smartAccount: evmAddress,
      params,
    });

    // Check if Smart Account exists
    if (!evmAddress) {
      const errorMsg = 'No Smart Account found. Please disconnect and reconnect to create a Smart Account.';
      console.error('[useCreateLoanGasless]', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Encode the contract function call
      const encodedData = encodeFunctionData({
        abi: MicroLoanFactoryABI.abi,
        functionName: 'createLoan',
        args: [
          params.borrower,
          params.metadataURI,
          params.principal,
          BigInt(params.loanDuration),
          BigInt(params.fundraisingDeadline),
        ],
      });

      console.log('[useCreateLoanGasless] Encoded transaction data:', encodedData);

      // Send user operation (Smart Account transaction with paymaster)
      const result = await sendUserOperation({
        evmSmartAccount: evmAddress,
        network: 'base-sepolia',
        calls: [{
          to: MICROLOAN_FACTORY_ADDRESS,
          data: encodedData,
        }],
        useCdpPaymaster: !!PAYMASTER_URL, // Use CDP paymaster if configured
      });

      console.log('[useCreateLoanGasless] User operation sent, result:', result);
      return result;
    } catch (err: any) {
      console.error('[useCreateLoanGasless] Error creating loan:', err);
      throw err;
    }
  };

  const isPending = status === 'pending';
  const isConfirming = status === 'pending';
  const isSuccess = status === 'success';
  const hash = data?.userOperationHash;

  return {
    createLoan,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
};

/**
 * Unified loan creation hook that automatically selects the right method
 * based on wallet type:
 * - CDP Smart Wallets: Uses gasless transactions via useSendUserOperation
 * - External Wallets (Farcaster, MetaMask, etc.): Uses standard wagmi writeContract
 *
 * This allows Farcaster users and other external wallet users to create loans
 * without requiring a CDP Smart Account.
 */
export const useCreateLoanUnified = () => {
  const { isCdpWallet, isExternalWallet, address } = useWalletType();
  const publicClient = usePublicClient();

  // CDP Smart Wallet hooks
  const { sendUserOperation, status: cdpStatus, data: cdpData, error: cdpError } = useSendUserOperation();
  const { evmAddress } = useEvmAddress();

  // External wallet hooks
  const { writeContractAsync, data: externalHash, error: externalError, isPending: externalIsPending } = useWriteContract();
  const { isLoading: externalIsConfirming, isSuccess: externalIsSuccess } = useWaitForTransactionReceipt({
    hash: externalHash,
  });

  const createLoan = async (params: {
    borrower: `0x${string}`;
    metadataURI: string;
    principal: bigint;
    loanDuration: number;
    fundraisingDeadline: number;
  }) => {
    console.log('[useCreateLoanUnified] Creating loan with unified hook:', {
      factoryAddress: MICROLOAN_FACTORY_ADDRESS,
      isCdpWallet,
      isExternalWallet,
      address,
      evmAddress,
      params,
    });

    // Use CDP gasless path for Smart Wallets
    if (isCdpWallet && evmAddress) {
      console.log('[useCreateLoanUnified] Using CDP Smart Wallet (gasless)');

      const encodedData = encodeFunctionData({
        abi: MicroLoanFactoryABI.abi,
        functionName: 'createLoan',
        args: [
          params.borrower,
          params.metadataURI,
          params.principal,
          BigInt(params.loanDuration),
          BigInt(params.fundraisingDeadline),
        ],
      });

      const result = await sendUserOperation({
        evmSmartAccount: evmAddress,
        network: 'base-sepolia',
        calls: [{
          to: MICROLOAN_FACTORY_ADDRESS,
          data: encodedData,
        }],
        useCdpPaymaster: !!PAYMASTER_URL,
      });

      console.log('[useCreateLoanUnified] CDP user operation sent:', result);
      return result;
    }

    // Use standard writeContract for external wallets (Farcaster, MetaMask, etc.)
    if (isExternalWallet && address) {
      console.log('[useCreateLoanUnified] Using external wallet (user-paid gas)');

      const hash = await writeContractAsync({
        address: MICROLOAN_FACTORY_ADDRESS,
        abi: MicroLoanFactoryABI.abi,
        functionName: 'createLoan',
        args: [
          params.borrower,
          params.metadataURI,
          params.principal,
          BigInt(params.loanDuration),
          BigInt(params.fundraisingDeadline),
        ],
      });

      console.log('[useCreateLoanUnified] External wallet transaction sent:', hash);
      return { hash };
    }

    // No wallet connected
    throw new Error('No wallet connected. Please connect a wallet to create a loan.');
  };

  // Determine states based on wallet type
  const isPending = isCdpWallet ? cdpStatus === 'pending' : externalIsPending;
  const isConfirming = isCdpWallet ? cdpStatus === 'pending' : externalIsConfirming;
  const isSuccess = isCdpWallet ? cdpStatus === 'success' : externalIsSuccess;
  const error = isCdpWallet ? cdpError : externalError;
  const hash = isCdpWallet ? cdpData?.userOperationHash : externalHash;

  return {
    createLoan,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    isCdpWallet,
    isExternalWallet,
  };
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format USDC amount to human-readable string
 */
export const formatUSDC = (amount: bigint): string => {
  return `${formatUnits(amount, USDC_DECIMALS)} USDC`;
};

/**
 * Parse USDC amount from human-readable string
 */
export const parseUSDC = (amount: string): bigint => {
  return parseUnits(amount, USDC_DECIMALS);
};

/**
 * Calculate funding progress percentage
 */
export const calculateFundingProgress = (
  totalFunded: bigint,
  principal: bigint
): number => {
  if (principal === 0n) return 0;
  return Number((totalFunded * 100n) / principal);
};

/**
 * Calculate repayment progress percentage
 */
export const calculateRepaymentProgress = (
  totalRepaid: bigint,
  principal: bigint
): number => {
  if (principal === 0n) return 0;
  return Number((totalRepaid * 100n) / principal);
};

/**
 * Check if loan is funded (reached goal)
 */
export const isLoanFunded = (totalFunded: bigint, principal: bigint): boolean => {
  return totalFunded >= principal;
};

/**
 * Check if fundraising expired
 */
export const isFundraisingExpired = (fundraisingDeadline: bigint): boolean => {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return now > fundraisingDeadline;
};
