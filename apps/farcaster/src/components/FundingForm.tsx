'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import Link from 'next/link';
import { useCampaign } from '@/hooks/useCampaign';
import { CAMPAIGN_FACTORY_ADDRESS, USDC_CONTRACT_ADDRESS } from '@/lib/wagmi';

interface FundingFormProps {
  campaignNumericId: string;
}

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

const CAMPAIGN_FACTORY_ABI = [
  {
    name: 'contribute',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'campaignId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

export default function FundingForm({ campaignNumericId }: FundingFormProps) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'approve' | 'contribute' | 'success' | 'error'>('input');
  const [errorMessage, setErrorMessage] = useState('');

  const { address, isConnected } = useAccount();
  const { campaign, loading: campaignLoading } = useCampaign(campaignNumericId);

  const { data: usdcBalance } = useBalance({
    address,
    token: USDC_CONTRACT_ADDRESS,
  });

  const { writeContract: approveUSDC, data: approveHash, isPending: isApproving } = useWriteContract();
  const { writeContract: contribute, data: contributeHash, isPending: isContributing } = useWriteContract();

  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isSuccess: isContributeSuccess } = useWaitForTransactionReceipt({
    hash: contributeHash,
  });

  useEffect(() => {
    if (isApproveSuccess && step === 'approve') {
      handleContribute();
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    if (isContributeSuccess && step === 'contribute') {
      setStep('success');
    }
  }, [isContributeSuccess]);

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    try {
      setStep('approve');
      setErrorMessage('');
      const amountInWei = parseUnits(amount, 6); // USDC has 6 decimals

      approveUSDC({
        address: USDC_CONTRACT_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CAMPAIGN_FACTORY_ADDRESS, amountInWei],
      });
    } catch (error: any) {
      setStep('error');
      setErrorMessage(error.message || 'Failed to approve USDC');
    }
  };

  const handleContribute = async () => {
    try {
      setStep('contribute');
      setErrorMessage('');
      const amountInWei = parseUnits(amount, 6);

      contribute({
        address: CAMPAIGN_FACTORY_ADDRESS,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'contribute',
        args: [BigInt(campaignNumericId), amountInWei],
      });
    } catch (error: any) {
      setStep('error');
      setErrorMessage(error.message || 'Failed to contribute');
    }
  };

  if (campaignLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Campaign not found</p>
        <Link href="/" className="text-[#3B9B7F] hover:underline">
          ← Back to campaigns
        </Link>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href={`/campaign/${campaignNumericId}`} className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to campaign
        </Link>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">
            Please connect your wallet to fund this campaign
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
          <p className="text-gray-600 mb-6">
            You've successfully funded ${amount} to {campaign.metadata?.title}
          </p>
          <div className="space-y-3">
            <Link
              href={`/campaign/${campaignNumericId}`}
              className="block w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              View Campaign
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href={`/campaign/${campaignNumericId}`} className="inline-flex items-center text-[#3B9B7F] hover:text-[#2E7D68] mb-6">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to campaign
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Fund: {campaign.metadata?.title}
      </h1>

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
              className="w-full pl-8 pr-4 py-4 text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          {usdcBalance && (
            <p className="text-sm text-gray-500 mt-2">
              Balance: ${parseFloat(usdcBalance.formatted).toFixed(2)} USDC
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        <button
          onClick={handleApprove}
          disabled={!amount || parseFloat(amount) <= 0 || step !== 'input'}
          className="w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {step === 'approve' && isApproving && 'Approving USDC...'}
          {step === 'approve' && !isApproving && 'Waiting for approval...'}
          {step === 'contribute' && 'Confirming support...'}
          {step === 'input' && 'Fund Campaign'}
        </button>

        {step !== 'input' && step !== 'success' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700 text-center">
              {step === 'approve' && 'Please approve USDC spending in your wallet...'}
              {step === 'contribute' && 'Please confirm the support in your wallet...'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Funding Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Revenue Share</span>
            <span className="font-medium text-gray-900">
              {campaign.metadata?.revenueShare || 5}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Repayment Cap</span>
            <span className="font-medium text-gray-900">
              {campaign.metadata?.repaymentCap || 1.5}x
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Expected Return</span>
            <span className="font-semibold text-[#3B9B7F]">
              ${amount && parseFloat(amount) > 0
                ? (parseFloat(amount) * (campaign.metadata?.repaymentCap || 1.5)).toFixed(2)
                : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
