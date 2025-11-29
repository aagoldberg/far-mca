/**
 * Smart Wallet Gasless Hooks
 *
 * For CDP Smart Wallet users - fully gasless transactions including USDC approvals!
 * Uses batch transactions + Coinbase paymaster to sponsor ALL gas.
 *
 * User experience: Click once, sign once, done. Never touches gas.
 */

import { useState } from 'react';
import { useAccount, useWriteContracts, useCallsStatus } from 'wagmi/experimental';
import { parseUnits, encodeFunctionData, maxUint256 } from 'viem';
import { USDC_ADDRESS } from '@/lib/constants';
import MicroLoanABI from '@/abi/MicroLoan.json';

// ERC20 ABI (just the functions we need)
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;

const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL;

// =============================================================================
// SMART WALLET GASLESS CONTRIBUTE
// =============================================================================

/**
 * Fully gasless contribution for Smart Wallet users
 * Batches: approve USDC + contribute in ONE transaction
 * Coinbase paymaster sponsors ALL gas
 *
 * User clicks once → Signs once → Done (never pays gas)
 */
export const useSmartWalletContribute = () => {
  const { address } = useAccount();
  const [callsId, setCallsId] = useState<string | undefined>();
  const { writeContracts, isPending: isWritePending, data } = useWriteContracts();
  const { data: callsStatus } = useCallsStatus({
    id: callsId as `0x${string}`,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) =>
        data?.state.data?.status === 'CONFIRMED' ? false : 1000,
    },
  });

  const contribute = async (loanAddress: string, amountUSDC: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    const amountBigInt = parseUnits(amountUSDC, 6);

    // Batch transaction: approve + contribute
    const id = await writeContracts({
      contracts: [
        // 1. Approve USDC to loan contract
        {
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [loanAddress as `0x${string}`, amountBigInt],
        },
        // 2. Contribute to loan
        {
          address: loanAddress as `0x${string}`,
          abi: MicroLoanABI.abi,
          functionName: 'contribute',
          args: [amountBigInt],
        },
      ],
      capabilities: PAYMASTER_URL ? {
        paymasterService: {
          url: PAYMASTER_URL,
        },
      } : undefined,
    });

    setCallsId(id);
    return id;
  };

  const isConfirming = callsStatus?.status === 'PENDING';
  const isConfirmed = callsStatus?.status === 'CONFIRMED';
  const error = callsStatus?.status === 'FAILED' ? new Error('Transaction failed') : null;

  return {
    contribute,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error,
    callsId,
    callsStatus,
  };
};

// =============================================================================
// SMART WALLET GASLESS REPAY
// =============================================================================

/**
 * Fully gasless repayment for Smart Wallet users
 * Batches: approve USDC + repay in ONE transaction
 * Coinbase paymaster sponsors ALL gas
 */
export const useSmartWalletRepay = () => {
  const { address } = useAccount();
  const [callsId, setCallsId] = useState<string | undefined>();
  const { writeContracts, isPending: isWritePending } = useWriteContracts();
  const { data: callsStatus } = useCallsStatus({
    id: callsId as `0x${string}`,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) =>
        data?.state.data?.status === 'CONFIRMED' ? false : 1000,
    },
  });

  const repay = async (loanAddress: string, amountUSDC: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    const amountBigInt = parseUnits(amountUSDC, 6);

    // Batch transaction: approve + repay
    const id = await writeContracts({
      contracts: [
        // 1. Approve USDC to loan contract
        {
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [loanAddress as `0x${string}`, amountBigInt],
        },
        // 2. Repay loan
        {
          address: loanAddress as `0x${string}`,
          abi: MicroLoanABI.abi,
          functionName: 'repay',
          args: [amountBigInt],
        },
      ],
      capabilities: PAYMASTER_URL ? {
        paymasterService: {
          url: PAYMASTER_URL,
        },
      } : undefined,
    });

    setCallsId(id);
    return id;
  };

  const isConfirming = callsStatus?.status === 'PENDING';
  const isConfirmed = callsStatus?.status === 'CONFIRMED';
  const error = callsStatus?.status === 'FAILED' ? new Error('Transaction failed') : null;

  return {
    repay,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error,
    callsId,
    callsStatus,
  };
};

// =============================================================================
// SMART WALLET GASLESS CLAIM
// =============================================================================

/**
 * Fully gasless claim for Smart Wallet users
 * No approval needed (USDC sent TO user)
 * Coinbase paymaster sponsors gas
 */
export const useSmartWalletClaim = () => {
  const { address } = useAccount();
  const [callsId, setCallsId] = useState<string | undefined>();
  const { writeContracts, isPending: isWritePending } = useWriteContracts();
  const { data: callsStatus } = useCallsStatus({
    id: callsId as `0x${string}`,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) =>
        data?.state.data?.status === 'CONFIRMED' ? false : 1000,
    },
  });

  const claim = async (loanAddress: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    // Single transaction: claim
    const id = await writeContracts({
      contracts: [
        {
          address: loanAddress as `0x${string}`,
          abi: MicroLoanABI.abi,
          functionName: 'claim',
        },
      ],
      capabilities: PAYMASTER_URL ? {
        paymasterService: {
          url: PAYMASTER_URL,
        },
      } : undefined,
    });

    setCallsId(id);
    return id;
  };

  const isConfirming = callsStatus?.status === 'PENDING';
  const isConfirmed = callsStatus?.status === 'CONFIRMED';
  const error = callsStatus?.status === 'FAILED' ? new Error('Transaction failed') : null;

  return {
    claim,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error,
    callsId,
    callsStatus,
  };
};

// =============================================================================
// APPROVE ONLY (For advanced users who want to pre-approve)
// =============================================================================

/**
 * Gasless USDC approval to loan contract
 * Useful if user wants to pre-approve before contributing
 */
export const useSmartWalletApprove = () => {
  const { address } = useAccount();
  const [callsId, setCallsId] = useState<string | undefined>();
  const { writeContracts, isPending: isWritePending } = useWriteContracts();
  const { data: callsStatus } = useCallsStatus({
    id: callsId as `0x${string}`,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) =>
        data?.state.data?.status === 'CONFIRMED' ? false : 1000,
    },
  });

  const approve = async (loanAddress: string, amountUSDC?: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    // If no amount specified, approve infinite
    const amountBigInt = amountUSDC ? parseUnits(amountUSDC, 6) : maxUint256;

    const id = await writeContracts({
      contracts: [
        {
          address: USDC_ADDRESS as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [loanAddress as `0x${string}`, amountBigInt],
        },
      ],
      capabilities: PAYMASTER_URL ? {
        paymasterService: {
          url: PAYMASTER_URL,
        },
      } : undefined,
    });

    setCallsId(id);
    return id;
  };

  const isConfirming = callsStatus?.status === 'PENDING';
  const isConfirmed = callsStatus?.status === 'CONFIRMED';
  const error = callsStatus?.status === 'FAILED' ? new Error('Transaction failed') : null;

  return {
    approve,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error,
    callsId,
    callsStatus,
  };
};
