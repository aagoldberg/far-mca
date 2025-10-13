/**
 * useMicroLoan Hook
 *
 * React hooks for interacting with MicroLoan and MicroLoanFactory contracts
 * Handles all read and write operations for zero-interest microloans
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
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

  const { data: totalRepaid } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'totalRepaid',
    query: { enabled },
  });

  const { data: termPeriods } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'termPeriods',
    query: { enabled },
  });

  const { data: periodLength } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'periodLength',
    query: { enabled },
  });

  const { data: firstDueDate } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'firstDueDate',
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

  const { data: disbursed } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'disbursed',
    query: { enabled },
  });

  const { data: contributorsCount } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'contributorsCount',
    query: { enabled },
  });

  const { data: perPeriodPrincipal } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'perPeriodPrincipal',
    query: { enabled },
  });

  const { data: currentDueDate } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'currentDueDate',
    query: { enabled },
  });

  const { data: isDefaulted } = useReadContract({
    address: loanAddress,
    abi: MicroLoanABI.abi,
    functionName: 'isDefaulted',
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
    termPeriods: termPeriods as bigint,
    periodLength: periodLength as bigint,
    firstDueDate: firstDueDate as bigint,
    fundraisingDeadline: fundraisingDeadline as bigint,
    metadataURI: metadataURI as string,
    fundraisingActive: fundraisingActive as boolean,
    active: active as boolean,
    completed: completed as boolean,
    disbursed: disbursed as boolean,
    contributorsCount: contributorsCount as bigint,
  };

  return { loanData, isLoading: false, perPeriodPrincipal, currentDueDate, isDefaulted };
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
    termPeriods: number;
    periodLength: number;
    firstDueDate: number;
    fundraisingDeadline: number;
  }) => {
    console.log('useCreateLoan: Converting params to contract args');
    const args = [
      params.borrower,
      params.metadataURI,
      params.principal,
      BigInt(params.termPeriods),
      BigInt(params.periodLength),
      BigInt(params.firstDueDate),
      BigInt(params.fundraisingDeadline),
    ];
    console.log('useCreateLoan: Contract args prepared:', {
      borrower: args[0],
      metadataURILength: (args[1] as string).length,
      principal: args[2].toString(),
      termPeriods: args[3].toString(),
      periodLength: args[4].toString(),
      firstDueDate: args[5].toString(),
      fundraisingDeadline: args[6].toString(),
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
