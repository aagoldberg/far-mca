'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { formatUnits } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  XMarkIcon, 
  BanknotesIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { campaignABI } from '@/abi/Campaign';

const USDC_DECIMALS = 6;

interface WithdrawFundsModalProps {
  campaign: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WithdrawFundsModal({ campaign, onClose, onSuccess }: WithdrawFundsModalProps) {
  const { user } = usePrivy();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const availableBalance = BigInt(campaign.actualBalance || campaign.totalRaised || '0');
  const availableFormatted = formatUnits(availableBalance, USDC_DECIMALS);
  const availableNumber = Number(availableFormatted);

  const handleWithdraw = async () => {
    if (!user?.wallet?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsWithdrawing(true);
    try {
  
      await writeContract({
        address: campaign.id as `0x${string}`,
        abi: campaignABI,
        functionName: 'claimFunds',
        args: [],
      });

      // Wait for success
      if (isSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 m-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Available Balance */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <BanknotesIcon className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-700">Available Balance</p>
              <p className="text-2xl font-bold text-green-900">
                ${availableNumber.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            This will withdraw all available funds from the campaign.
          </p>
        </div>

        {/* Destination */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Withdrawal destination:</p>
          <div className="bg-gray-50 rounded-lg p-3">
            <code className="text-sm font-mono text-gray-800">
              {user?.wallet?.address 
                ? `${user.wallet.address.substring(0, 6)}...${user.wallet.address.substring(user.wallet.address.length - 4)}`
                : 'No wallet connected'}
            </code>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
          <div className="flex gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Funds will be sent to your connected wallet</li>
                <li>Transaction fees will apply</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">
              Error: {error.message}
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700">
                Withdrawal successful!
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleWithdraw}
            disabled={
              isPending || 
              isConfirming || 
              isWithdrawing ||
              availableBalance === BigInt(0)
            }
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isConfirming || isWithdrawing ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              'Withdraw All Funds'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}