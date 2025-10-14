'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import Link from 'next/link';
import { useLoanData, useContribute } from '@/hooks/useMicroLoan';
import { useUSDCBalance, useUSDCApprove, useNeedsApproval } from '@/hooks/useUSDC';
import { USDC_DECIMALS } from '@/types/loan';

interface LoanFundingFormProps {
  loanAddress: `0x${string}`;
}

export default function LoanFundingForm({ loanAddress }: LoanFundingFormProps) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'approve' | 'contribute' | 'success' | 'error'>('input');
  const [errorMessage, setErrorMessage] = useState('');

  const { address, isConnected } = useAccount();
  const { loanData, isLoading: loanLoading } = useLoanData(loanAddress);
  const { balance: usdcBalance, balanceFormatted } = useUSDCBalance(address);

  // Check if approval needed
  const amountBigInt = amount ? parseUnits(amount, USDC_DECIMALS) : 0n;
  const { needsApproval, currentAllowance } = useNeedsApproval(
    address,
    loanAddress,
    amountBigInt
  );

  // Contract interactions
  const {
    approve,
    isPending: isApproving,
    isConfirming: isApproveTxConfirming,
    isSuccess: isApproveSuccess,
    error: approveError
  } = useUSDCApprove();

  const {
    contribute,
    isPending: isContributing,
    isConfirming: isContributeTxConfirming,
    isSuccess: isContributeSuccess,
    error: contributeError
  } = useContribute();

  // Handle approval success -> move to contribute
  useEffect(() => {
    if (isApproveSuccess && step === 'approve') {
      handleContribute();
    }
  }, [isApproveSuccess]);

  // Handle contribute success
  useEffect(() => {
    if (isContributeSuccess && step === 'contribute') {
      setStep('success');
    }
  }, [isContributeSuccess]);

  // Handle errors
  useEffect(() => {
    if (approveError) {
      setStep('error');
      setErrorMessage(approveError.message || 'Failed to approve USDC');
    }
  }, [approveError]);

  useEffect(() => {
    if (contributeError) {
      setStep('error');
      setErrorMessage(contributeError.message || 'Failed to contribute');
    }
  }, [contributeError]);

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    if (!address) {
      setErrorMessage('Please connect your wallet');
      return;
    }

    const amountInUnits = parseUnits(amount, USDC_DECIMALS);

    // Check balance
    if (amountInUnits > usdcBalance) {
      setErrorMessage('Insufficient USDC balance');
      return;
    }

    // Check loan can accept this much
    if (loanData && loanData.totalFunded + amountInUnits > loanData.principal) {
      setErrorMessage('Amount exceeds remaining funding needed');
      return;
    }

    try {
      setStep('approve');
      setErrorMessage('');

      await approve(loanAddress, amountInUnits, false);
    } catch (error: any) {
      setStep('error');
      setErrorMessage(error.message || 'Failed to approve USDC');
    }
  };

  const handleContribute = async () => {
    try {
      setStep('contribute');
      setErrorMessage('');
      const amountInUnits = parseUnits(amount, USDC_DECIMALS);

      await contribute(loanAddress, amountInUnits);
    } catch (error: any) {
      setStep('error');
      setErrorMessage(error.message || 'Failed to contribute');
    }
  };

  const handleFund = async () => {
    if (needsApproval) {
      await handleApprove();
    } else {
      await handleContribute();
    }
  };

  if (loanLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!loanData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Loan not found</p>
        <Link href="/" className="text-[#3B9B7F] hover:underline">
          ← Back to loans
        </Link>
      </div>
    );
  }

  if (!loanData.fundraisingActive) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href={`/loan/${loanAddress}`} className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to loan
        </Link>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Fundraising Closed</h2>
          <p className="text-gray-600">
            This loan is no longer accepting contributions
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href={`/loan/${loanAddress}`} className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to loan
        </Link>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">
            Please connect your wallet to fund this loan
          </p>
          <p className="text-sm text-gray-500">
            Make sure you're using a Farcaster Frame-compatible wallet
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Funding Successful!
          </h2>
          <p className="text-gray-600 mb-2">
            You've successfully funded ${amount} USDC
          </p>
          <p className="text-sm text-green-600 mb-6">
            Zero-interest • Community support • 1.0x repayment
          </p>
          <div className="space-y-3">
            <Link
              href={`/loan/${loanAddress}`}
              className="block w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              View Loan
            </Link>
            <Link
              href="/"
              className="block w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const remainingNeeded = loanData.principal - loanData.totalFunded;
  const maxContribution = remainingNeeded < usdcBalance ? remainingNeeded : usdcBalance;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href={`/loan/${loanAddress}`} className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-6">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to loan
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Fund This Loan
      </h1>
      <p className="text-gray-600 mb-6">
        Support this business with zero-interest community funding
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USDC)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={step !== 'input'}
              max={formatUnits(maxContribution, USDC_DECIMALS)}
              step="0.01"
              className="w-full pl-8 pr-4 py-4 text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <p className="text-gray-500">
              Balance: {balanceFormatted}
            </p>
            <button
              onClick={() => setAmount(formatUnits(maxContribution, USDC_DECIMALS))}
              className="text-[#3B9B7F] hover:text-[#2E7D68] font-medium"
              disabled={step !== 'input'}
            >
              Max
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Remaining needed: ${formatUnits(remainingNeeded, USDC_DECIMALS)} USDC
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{errorMessage}</p>
            {step === 'error' && (
              <button
                onClick={() => {
                  setStep('input');
                  setErrorMessage('');
                }}
                className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleFund}
          disabled={!amount || parseFloat(amount) <= 0 || step !== 'input'}
          className="w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {step === 'approve' && (isApproving || isApproveTxConfirming) && 'Approving USDC...'}
          {step === 'contribute' && (isContributing || isContributeTxConfirming) && 'Confirming contribution...'}
          {step === 'input' && (needsApproval ? 'Approve & Fund Loan' : 'Fund Loan')}
        </button>

        {step !== 'input' && step !== 'success' && step !== 'error' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700 text-center">
              {step === 'approve' && 'Please approve USDC spending in your wallet...'}
              {step === 'contribute' && 'Please confirm the contribution in your wallet...'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Zero-Interest Model
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Interest Rate</span>
            <span className="font-medium text-green-600">0%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Repayment Multiple</span>
            <span className="font-medium text-gray-900">1.0x</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Term</span>
            <span className="font-medium text-gray-900">
              {loanData.termPeriods.toString()} periods
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-green-200">
            <span className="text-gray-600">You'll receive back</span>
            <span className="font-semibold text-[#3B9B7F]">
              ${amount && parseFloat(amount) > 0
                ? parseFloat(amount).toFixed(2)
                : '0.00'} USDC
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4 italic">
          This is community support, not profit-seeking. Your contribution helps the business grow, and you'll get exactly what you contributed back.
        </p>
      </div>
    </div>
  );
}
