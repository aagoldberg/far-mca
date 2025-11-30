/**
 * Simple Contribution Form
 * Based on web-cdp patterns but optimized for mini apps
 * Direct hook usage, mobile-friendly, no heavy state management
 */

'use client';

import { useState, useEffect } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useContribute } from '@/hooks/useMicroLoan';
import { useUSDCBalance, useNeedsApproval, useApproveUSDC } from '@/hooks/useUSDC';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LoadingSpinner, TransactionStatus } from '@/components/LoadingSkeletons';
import { parseBlockchainError } from '@/utils/errorHandling';
import { USDC_DECIMALS } from '@/types/loan';

interface SimpleContributeFormProps {
  loanAddress: `0x${string}`;
  remainingAmount: bigint; // Amount still needed
  onSuccess?: (txHash: string) => void;
  onError?: (message: string) => void;
}

// Suggested amounts for quick selection (web-cdp pattern)
const SUGGESTED_AMOUNTS = [5, 10, 25, 50, 100];

export default function SimpleContributeForm({
  loanAddress,
  remainingAmount,
  onSuccess,
  onError,
}: SimpleContributeFormProps) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'approve' | 'contribute' | 'success'>('input');
  const [error, setError] = useState(null);

  const { address, isConnected } = useAccount();
  const { balance: usdcBalance } = useUSDCBalance(address);

  // Parse amount to bigint
  const amountBigInt = amount ? parseUnits(amount, USDC_DECIMALS) : 0n;
  const amountValid = amountBigInt >= parseUnits('5', USDC_DECIMALS); // $5 minimum

  // Check approval status
  const { needsApproval, currentAllowance } = useNeedsApproval(
    address,
    loanAddress,
    amountBigInt
  );

  // Contract hooks
  const {
    approve,
    isPending: isApproving,
    isSuccess: isApproveSuccess,
    hash: approveHash,
    error: approveError,
  } = useApproveUSDC();

  const {
    contribute,
    isPending: isContributing,
    isConfirming,
    isSuccess: isContributeSuccess,
    hash: contributeHash,
    error: contributeError,
  } = useContribute();

  // Handle quick amount selection
  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError(null);
  };

  // Validate amount
  const validateAmount = (): boolean => {
    if (!amountValid) {
      setError({
        title: 'Invalid Amount',
        message: 'Minimum contribution is $5 USDC',
        severity: 'warning',
      });
      return false;
    }

    if (amountBigInt > usdcBalance) {
      setError({
        title: 'Insufficient Balance',
        message: `You only have ${formatUnits(usdcBalance, USDC_DECIMALS)} USDC`,
        severity: 'warning',
      });
      return false;
    }

    if (amountBigInt > remainingAmount) {
      setError({
        title: 'Amount Too Large',
        message: `Only ${formatUnits(remainingAmount, USDC_DECIMALS)} USDC needed`,
        severity: 'warning',
      });
      return false;
    }

    return true;
  };

  // Handle submission
  const handleSubmit = async () => {
    setError(null);

    if (!isConnected) {
      setError({
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to continue',
        severity: 'warning',
      });
      return;
    }

    if (!validateAmount()) {
      return;
    }

    try {
      if (needsApproval) {
        setStep('approve');
        await approve(loanAddress, amountBigInt);
      } else {
        setStep('contribute');
        await contribute(loanAddress, amountBigInt);
      }
    } catch (err: any) {
      const errorDetails = parseBlockchainError(err);
      setError(errorDetails);
      setStep('input');
    }
  };

  // Auto-progress from approve to contribute
  useEffect(() => {
    if (isApproveSuccess && step === 'approve') {
      setStep('contribute');
      contribute(loanAddress, amountBigInt);
    }
  }, [isApproveSuccess, step]);

  // Handle success
  useEffect(() => {
    if (isContributeSuccess && contributeHash) {
      setStep('success');
      onSuccess?.(contributeHash);
    }
  }, [isContributeSuccess, contributeHash]);

  // Handle errors
  useEffect(() => {
    if (approveError || contributeError) {
      const err = approveError || contributeError;
      const errorDetails = parseBlockchainError(err);
      setError(errorDetails);
      setStep('input');
      onError?.(errorDetails.message);
    }
  }, [approveError, contributeError]);

  // Success state
  if (step === 'success') {
    return (
      <div className="bg-green-50 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-green-900 mb-2">Contribution Successful!</h3>
        <p className="text-sm text-green-700 mb-4">
          You contributed ${amount} USDC to this loan
        </p>
        {contributeHash && (
          <a
            href={`https://sepolia.basescan.org/tx/${contributeHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:text-green-700 underline"
          >
            View on BaseScan →
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-bold">Contribute to Loan</h3>

      {/* Error display */}
      {error && (
        <ErrorDisplay
          error={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Amount input */}
      <div>
        <label className="text-sm text-gray-600 block mb-2">
          Amount (USDC)
        </label>

        {/* Quick amount buttons */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {SUGGESTED_AMOUNTS.map((val) => (
            <button
              key={val}
              onClick={() => handleQuickAmount(val)}
              disabled={step !== 'input'}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                amount === val.toString()
                  ? 'bg-[#2C7A7B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              ${val}
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={step !== 'input'}
            className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7A7B] disabled:bg-gray-50"
          />
        </div>

        {/* Balance display */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>
            Balance: {formatUnits(usdcBalance, USDC_DECIMALS)} USDC
          </span>
          <span>
            Needed: {formatUnits(remainingAmount, USDC_DECIMALS)} USDC
          </span>
        </div>
      </div>

      {/* Transaction status */}
      {step === 'approve' && (
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-700">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Approving USDC spending...</span>
          </div>
        </div>
      )}

      {step === 'contribute' && (
        <div className="bg-blue-50 rounded-lg p-3">
          <TransactionStatus
            isPending={isContributing}
            isConfirming={isConfirming}
            isSuccess={isContributeSuccess}
          />
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isConnected || !amount || step !== 'input' || !amountValid}
        className="w-full py-3 bg-gradient-to-r from-[#2C7A7B] to-[#3B9B7F] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
      >
        {!isConnected
          ? 'Connect Wallet'
          : needsApproval
          ? 'Approve & Contribute'
          : 'Contribute'}
      </button>

      {/* Info text */}
      <p className="text-xs text-center text-gray-500">
        Minimum contribution: $5 USDC • No interest or fees
      </p>
    </div>
  );
}