/**
 * useMicroLoan Hook
 *
 * React hooks for interacting with MicroLoan and MicroLoanFactory contracts
 * Handles all read and write operations for zero-interest microloans
 */

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { MICROLOAN_FACTORY_ADDRESS, USDC_ADDRESS } from '@/lib/wagmi';
import MicroLoanFactoryABI from '@/abi/MicroLoanFactory.json';
import MicroLoanABI from '@/abi/MicroLoan.json';
import {
  RawLoan,
  LoanDetails,
  UserContribution,
  USDC_DECIMALS
} from '@/types/loan';

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
    query: {
      enabled: !!MICROLOAN_FACTORY_ADDRESS && MICROLOAN_FACTORY_ADDRESS !== '0x0000000000000000000000000000000000000000',
      staleTime: 30_000, // Consider data fresh for 30 seconds
    },
  });

  // Debug logging
  console.log('[useLoans] Factory address:', MICROLOAN_FACTORY_ADDRESS);
  console.log('[useLoans] isLoading:', isLoading);
  console.log('[useLoans] error:', error);
  console.log('[useLoans] loanAddresses:', loanAddresses);

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

/**
 * Get loans that a specific address has contributed to
 */
export const useContributorLoans = (contributor: `0x${string}` | undefined) => {
  const { loanAddresses, isLoading: isLoadingLoans } = useLoans();
  const enabled = !!contributor && loanAddresses.length > 0;

  // Build multicall to check contribution for each loan
  const contributionQueries = loanAddresses.map((loanAddress) => ({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributions',
    args: [contributor],
  }));

  const { data: contributionsData, isLoading: isLoadingContributions } = useReadContracts({
    contracts: contributionQueries.length > 0 ? contributionQueries as any : [],
    query: { enabled },
  });

  // Filter to only loans where user has contributed
  const contributorLoanAddresses = loanAddresses.filter((_, index) => {
    const result = contributionsData?.[index];
    if (result?.status !== 'success') return false;
    const contribution = result.result as bigint;
    return contribution > 0n;
  });

  return {
    loanAddresses: contributorLoanAddresses,
    isLoading: isLoadingLoans || isLoadingContributions,
  };
};

// =============================================================================
// LOAN - READ BASIC INFO
// =============================================================================

/**
 * Get raw loan data from contract using multicall for better performance
 * Returns all basic loan information in a single RPC call
 */
export const useLoanData = (loanAddress: `0x${string}` | undefined) => {
  const enabled = !!loanAddress;

  // Batch all contract reads into one multicall
  const { data, isLoading, isError } = useReadContracts({
    contracts: loanAddress ? [
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'borrower',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'principal',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'totalFunded',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'outstandingPrincipal',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'dueAt',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'fundraisingDeadline',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'metadataURI',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'fundraisingActive',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'active',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'completed',
      },
      {
        address: loanAddress,
        abi: MicroLoanABI.abi,
        functionName: 'contributorsCount',
      },
    ] as const : [],
    query: {
      enabled,
    },
  });

  if (!loanAddress) {
    return { loanData: null, isLoading: false };
  }

  if (isLoading || !data) {
    return { loanData: null, isLoading: true };
  }

  // Extract results from multicall (all calls should succeed)
  const [
    borrowerResult,
    principalResult,
    totalFundedResult,
    outstandingPrincipalResult,
    dueAtResult,
    fundraisingDeadlineResult,
    metadataURIResult,
    fundraisingActiveResult,
    activeResult,
    completedResult,
    contributorsCountResult,
  ] = data;

  // Check if any required calls failed
  if (
    !borrowerResult || borrowerResult.status !== 'success' ||
    !principalResult || principalResult.status !== 'success' ||
    !totalFundedResult || totalFundedResult.status !== 'success' ||
    !outstandingPrincipalResult || outstandingPrincipalResult.status !== 'success' ||
    !dueAtResult || dueAtResult.status !== 'success' ||
    !fundraisingDeadlineResult || fundraisingDeadlineResult.status !== 'success' ||
    !metadataURIResult || metadataURIResult.status !== 'success' ||
    !fundraisingActiveResult || fundraisingActiveResult.status !== 'success' ||
    !activeResult || activeResult.status !== 'success' ||
    !completedResult || completedResult.status !== 'success' ||
    !contributorsCountResult || contributorsCountResult.status !== 'success'
  ) {
    return { loanData: null, isLoading: false };
  }

  // Calculate totalRepaid from principal and outstandingPrincipal
  const principal = principalResult.result as bigint;
  const outstandingPrincipal = outstandingPrincipalResult.result as bigint;
  const totalRepaid = principal - outstandingPrincipal;

  const loanData: RawLoan = {
    address: loanAddress,
    borrower: borrowerResult.result as `0x${string}`,
    principal,
    totalFunded: totalFundedResult.result as bigint,
    totalRepaid,
    dueAt: dueAtResult.result as bigint,
    fundraisingDeadline: fundraisingDeadlineResult.result as bigint,
    metadataURI: metadataURIResult.result as string,
    fundraisingActive: fundraisingActiveResult.result as boolean,
    active: activeResult.result as boolean,
    completed: completedResult.result as boolean,
    disbursed: activeResult.result as boolean, // disbursed = active (funds are disbursed when loan becomes active)
    contributorsCount: contributorsCountResult.result as bigint,
  };

  return {
    loanData,
    isLoading: false,
  };
};

// =============================================================================
// LOAN - CONTRIBUTORS LIST
// =============================================================================

/**
 * Get contributor addresses (up to a limit for display)
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

  return {
    contributors,
    totalCount: Number(contributorsCount),
    hasMore: Number(contributorsCount) > limit,
  };
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
    console.log('useCreateLoan: Converting params to contract args');
    const args = [
      params.borrower,
      params.metadataURI,
      params.principal,
      BigInt(params.loanDuration),
      BigInt(params.fundraisingDeadline),
    ];
    console.log('useCreateLoan: Contract args prepared:', {
      borrower: args[0],
      metadataURILength: (args[1] as string).length,
      principal: args[2].toString(),
      loanDuration: args[3].toString(),
      fundraisingDeadline: args[4].toString(),
    });

    try {
      writeContract({
        address: MICROLOAN_FACTORY_ADDRESS,
        abi: MicroLoanFactoryABI.abi,
        functionName: 'createLoan',
        args,
      });
    } catch (err) {
      console.error('useCreateLoan: Error calling writeContract:', err);
      throw err;
    }
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
