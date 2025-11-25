/**
 * Gasless MicroLoan hooks using relay endpoints
 * These hooks allow users to interact with loans without paying gas fees.
 *
 * IMPORTANT: For contribute and repay, users must approve USDC to the loan contract first.
 */

import { useState } from 'react';
import { useSignMessage, useAccount } from 'wagmi';
import { formatUnits } from 'viem';

// =============================================================================
// GASLESS CONTRIBUTE
// =============================================================================

/**
 * Gasless contribution to a loan
 * User must approve USDC to the loan contract before contributing.
 *
 * Flow:
 * 1. User approves USDC to loan contract (one-time, user pays gas)
 * 2. User signs message (gasless)
 * 3. Relayer calls contributeFor() (relayer pays gas)
 */
export const useContributeGasless = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const contribute = async (loanAddress: string, amountUSDC: string) => {
    if (!address) {
      setError(new Error('Wallet not connected'));
      return;
    }

    setIsPending(true);
    setIsSuccess(false);
    setError(null);
    setTxHash(null);

    try {
      // 1. Create timestamp
      const timestamp = Date.now();

      // 2. Create message to sign
      const message = `Contribute ${amountUSDC} USDC to ${loanAddress} at ${timestamp}`;

      // 3. Request signature from user
      const signature = await signMessageAsync({ message });

      // 4. Call relay endpoint
      const response = await fetch('/api/relay/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          loanAddress,
          amount: amountUSDC,
          signature,
          timestamp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to contribute');
      }

      setTxHash(data.txHash);
      setIsSuccess(true);
      console.log('[Gasless Contribute] Success:', data);
    } catch (err: any) {
      console.error('[Gasless Contribute] Error:', err);
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  return {
    contribute,
    isPending,
    isSuccess,
    error,
    txHash,
  };
};

// =============================================================================
// GASLESS REPAY
// =============================================================================

/**
 * Gasless loan repayment
 * User must approve USDC to the loan contract before repaying.
 *
 * Flow:
 * 1. User approves USDC to loan contract (one-time, user pays gas)
 * 2. User signs message (gasless)
 * 3. Relayer calls repayFor() (relayer pays gas)
 */
export const useRepayGasless = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loanCompleted, setLoanCompleted] = useState(false);

  const repay = async (loanAddress: string, amountUSDC: string) => {
    if (!address) {
      setError(new Error('Wallet not connected'));
      return;
    }

    setIsPending(true);
    setIsSuccess(false);
    setError(null);
    setTxHash(null);
    setLoanCompleted(false);

    try {
      // 1. Create timestamp
      const timestamp = Date.now();

      // 2. Create message to sign
      const message = `Repay ${amountUSDC} USDC to ${loanAddress} at ${timestamp}`;

      // 3. Request signature from user
      const signature = await signMessageAsync({ message });

      // 4. Call relay endpoint
      const response = await fetch('/api/relay/repay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          loanAddress,
          amount: amountUSDC,
          signature,
          timestamp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to repay');
      }

      setTxHash(data.txHash);
      setLoanCompleted(data.loanCompleted || false);
      setIsSuccess(true);
      console.log('[Gasless Repay] Success:', data);
    } catch (err: any) {
      console.error('[Gasless Repay] Error:', err);
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  return {
    repay,
    isPending,
    isSuccess,
    error,
    txHash,
    loanCompleted,
  };
};

// =============================================================================
// GASLESS CLAIM
// =============================================================================

/**
 * Gasless claim of loan returns
 * Fully gasless - no approval needed since USDC is sent TO the user.
 *
 * Flow:
 * 1. User signs message (gasless)
 * 2. Relayer calls claimFor() (relayer pays gas)
 * 3. USDC is sent directly to user's wallet
 */
export const useClaimGasless = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [claimedAmount, setClaimedAmount] = useState<string | null>(null);

  const claim = async (loanAddress: string) => {
    if (!address) {
      setError(new Error('Wallet not connected'));
      return;
    }

    setIsPending(true);
    setIsSuccess(false);
    setError(null);
    setTxHash(null);
    setClaimedAmount(null);

    try {
      // 1. Create timestamp
      const timestamp = Date.now();

      // 2. Create message to sign
      const message = `Claim from ${loanAddress} at ${timestamp}`;

      // 3. Request signature from user
      const signature = await signMessageAsync({ message });

      // 4. Call relay endpoint
      const response = await fetch('/api/relay/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          loanAddress,
          signature,
          timestamp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim');
      }

      setTxHash(data.txHash);
      setClaimedAmount(data.claimedAmount || '0');
      setIsSuccess(true);
      console.log('[Gasless Claim] Success:', data);
    } catch (err: any) {
      console.error('[Gasless Claim] Error:', err);
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  return {
    claim,
    isPending,
    isSuccess,
    error,
    txHash,
    claimedAmount,
  };
};

// =============================================================================
// USDC APPROVAL HELPER
// =============================================================================

/**
 * Check if user has approved enough USDC to the loan contract
 * This is needed before gasless contribute/repay can work.
 */
export const useUSDCApprovalCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [hasApproval, setHasApproval] = useState<boolean | null>(null);
  const [currentAllowance, setCurrentAllowance] = useState<string>('0');

  const checkApproval = async (
    userAddress: string,
    loanAddress: string,
    requiredAmount: string // In USDC units (e.g., "100" for $100)
  ) => {
    setIsChecking(true);
    try {
      // This would need to call a contract read function
      // For now, just a placeholder
      // TODO: Implement actual USDC allowance check
      console.log('[Approval Check] Checking allowance for', userAddress, 'to', loanAddress);

      // Placeholder logic
      setHasApproval(false);
      setCurrentAllowance('0');
    } catch (err) {
      console.error('[Approval Check] Error:', err);
      setHasApproval(false);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkApproval,
    isChecking,
    hasApproval,
    currentAllowance,
  };
};
