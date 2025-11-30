/**
 * useUSDC Hook
 *
 * React hooks for interacting with TestUSDC contract
 * Handles balance checks, approvals, and faucet operations
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatUnits, parseUnits, maxUint256 } from 'viem';
import { USDC_ADDRESS } from '@/lib/wagmi';
import TestUSDCABI from '@/abi/TestUSDC.json';
import { USDC_DECIMALS } from '@/types/loan';

// =============================================================================
// READ FUNCTIONS
// =============================================================================

/**
 * Get USDC balance for an address
 */
export const useUSDCBalance = (address: `0x${string}` | undefined) => {
  const { data: balance, isLoading, error, refetch } = useReadContract({
    address: USDC_ADDRESS,
    abi: TestUSDCABI.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const balanceRaw = (balance as bigint) || 0n;
  const balanceFormatted = formatUnits(balanceRaw, USDC_DECIMALS);

  return {
    balance: balanceRaw,
    balanceFormatted: `${Number(balanceFormatted).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} USDC`,
    balanceNumber: Number(balanceFormatted),
    isLoading,
    error,
    refetch,
  };
};

/**
 * Get USDC allowance (how much spender can spend)
 */
export const useUSDCAllowance = (
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined
) => {
  const { data: allowance, isLoading, error, refetch } = useReadContract({
    address: USDC_ADDRESS,
    abi: TestUSDCABI.abi,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: {
      enabled: !!owner && !!spender,
    },
  });

  const allowanceRaw = (allowance as bigint) || 0n;

  return {
    allowance: allowanceRaw,
    allowanceFormatted: formatUnits(allowanceRaw, USDC_DECIMALS),
    isLoading,
    error,
    refetch,
  };
};

/**
 * Check if approval is needed for a specific amount
 */
export const useNeedsApproval = (
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined,
  amount: bigint
) => {
  const { allowance, isLoading } = useUSDCAllowance(owner, spender);

  const needsApproval = allowance < amount;
  const hasInfiniteApproval = allowance === maxUint256;

  return {
    needsApproval,
    hasInfiniteApproval,
    currentAllowance: allowance,
    isLoading,
  };
};

// =============================================================================
// WRITE FUNCTIONS
// =============================================================================

/**
 * Approve USDC spending
 * Default: Approve exact amount needed
 * Can set infinite=true for max approval (gas efficient for multiple txs)
 */
export const useUSDCApprove = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const approve = async (
    spender: `0x${string}`,
    amount: bigint,
    infinite = false
  ) => {
    const approvalAmount = infinite ? maxUint256 : amount;

    writeContract({
      address: USDC_ADDRESS,
      abi: TestUSDCABI.abi,
      functionName: 'approve',
      args: [spender, approvalAmount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Mint test USDC from faucet (testnet only)
 * Max 1000 USDC per call
 */
export const useUSDCFaucet = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const faucet = async (amount: bigint = parseUnits('1000', USDC_DECIMALS)) => {
    // Enforce max 1000 USDC
    const maxAmount = parseUnits('1000', USDC_DECIMALS);
    const faucetAmount = amount > maxAmount ? maxAmount : amount;

    writeContract({
      address: USDC_ADDRESS,
      abi: TestUSDCABI.abi,
      functionName: 'faucet',
      args: [faucetAmount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    faucet,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Transfer USDC to another address
 */
export const useUSDCTransfer = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const transfer = async (to: `0x${string}`, amount: bigint) => {
    writeContract({
      address: USDC_ADDRESS,
      abi: TestUSDCABI.abi,
      functionName: 'transfer',
      args: [to, amount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    transfer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

// =============================================================================
// COMBINED HOOKS FOR COMMON WORKFLOWS
// =============================================================================

/**
 * Complete approval workflow
 * Checks if approval needed, approves if necessary
 */
export const useApprovalWorkflow = () => {
  const { address } = useAccount();
  const { approve, isPending, isConfirming, isSuccess, error } = useUSDCApprove();

  const approveIfNeeded = async (
    spender: `0x${string}`,
    amount: bigint,
    currentAllowance: bigint,
    infinite = false
  ) => {
    if (currentAllowance >= amount) {
      return { needed: false, success: true };
    }

    await approve(spender, amount, infinite);
    return { needed: true, success: false }; // Success tracked by isSuccess
  };

  return {
    approveIfNeeded,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
};

/**
 * Get user's USDC status (balance + allowance for a spender)
 */
export const useUSDCStatus = (spender: `0x${string}` | undefined) => {
  const { address } = useAccount();
  const { balance, balanceFormatted, balanceNumber } = useUSDCBalance(address);
  const { allowance, allowanceFormatted } = useUSDCAllowance(address, spender);

  return {
    balance,
    balanceFormatted,
    balanceNumber,
    allowance,
    allowanceFormatted,
    hasBalance: balance > 0n,
    canSpend: (amount: bigint) => balance >= amount && allowance >= amount,
  };
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format USDC amount to human-readable string
 */
export const formatUSDC = (amount: bigint): string => {
  const formatted = formatUnits(amount, USDC_DECIMALS);
  return `${Number(formatted).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USDC`;
};

/**
 * Parse USDC amount from human-readable string
 */
export const parseUSDC = (amount: string): bigint => {
  return parseUnits(amount, USDC_DECIMALS);
};

/**
 * Check if user has sufficient USDC balance
 */
export const hasSufficientBalance = (
  userBalance: bigint,
  requiredAmount: bigint
): boolean => {
  return userBalance >= requiredAmount;
};

/**
 * Check if approval is sufficient
 */
export const hasSufficientApproval = (
  currentAllowance: bigint,
  requiredAmount: bigint
): boolean => {
  return currentAllowance >= requiredAmount;
};

/**
 * Calculate how much more approval is needed
 */
export const calculateApprovalNeeded = (
  currentAllowance: bigint,
  requiredAmount: bigint
): bigint => {
  if (currentAllowance >= requiredAmount) {
    return 0n;
  }
  return requiredAmount - currentAllowance;
};

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Max faucet amount (1000 USDC)
 */
export const MAX_FAUCET_AMOUNT = parseUnits('1000', USDC_DECIMALS);

/**
 * Minimum contribution amount (0.01 USDC)
 */
export const MIN_CONTRIBUTION = parseUnits('0.01', USDC_DECIMALS);

/**
 * Infinite approval amount
 */
export const INFINITE_APPROVAL = maxUint256;
