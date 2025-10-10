'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  XMarkIcon, 
  ExclamationTriangleIcon,
  StopIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { campaignABI } from '@/abi/Campaign';

interface EndCampaignModalProps {
  campaign: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EndCampaignModal({ campaign, onClose, onSuccess }: EndCampaignModalProps) {
  const [isEnding, setIsEnding] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleEndCampaign = async () => {
    if (confirmText !== 'END CAMPAIGN') {
      alert('Please type "END CAMPAIGN" to confirm');
      return;
    }

    setIsEnding(true);
    try {
      await writeContract({
        address: campaign.id as `0x${string}`,
        abi: campaignABI,
        functionName: 'endCampaign',
        args: [],
      });

      if (isSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to end campaign:', error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 m-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">End Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <StopIcon className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900 mb-2">
                Are you sure you want to end this campaign?
              </p>
              <div className="text-sm text-red-700 space-y-2">
                <p>This action will:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Stop accepting new donations</li>
                  <li>Allow donors to request refunds</li>
                  <li>Make the campaign inactive permanently</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
          <div className="flex gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>This action cannot be undone</li>
                <li>You can still withdraw remaining funds after ending</li>
                <li>Campaign page will remain visible but marked as ended</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type "END CAMPAIGN" to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="END CAMPAIGN"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
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
                Campaign ended successfully!
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
            onClick={handleEndCampaign}
            disabled={
              isPending || 
              isConfirming || 
              isEnding ||
              confirmText !== 'END CAMPAIGN'
            }
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isConfirming || isEnding ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              'End Campaign'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}