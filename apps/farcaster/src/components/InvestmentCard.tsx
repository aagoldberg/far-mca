'use client';

import React, { useState } from 'react';
import { LoanCardWrapper } from './LoanList';
import { useContribution, useClaim } from '@/hooks/useMicroLoan';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import toast from 'react-hot-toast';

interface InvestmentCardProps {
  loanAddress: `0x${string}`;
}

export const InvestmentCard = ({ loanAddress }: InvestmentCardProps) => {
  const { address } = useAccount();
  const { contribution } = useContribution(loanAddress, address);
  const {
    claim,
    isPending: isClaimPending,
    isConfirming: isClaimConfirming,
    isSuccess: isClaimSuccess,
  } = useClaim();

  const [hasClaimedSuccessfully, setHasClaimedSuccessfully] = useState(false);

  // Show success toast when claim succeeds
  React.useEffect(() => {
    if (isClaimSuccess && !hasClaimedSuccessfully) {
      setHasClaimedSuccessfully(true);
      const claimableFormatted = contribution?.claimableFormatted || '0 USDC';
      toast.success(`Successfully claimed ${claimableFormatted}!`);
    }
  }, [isClaimSuccess, hasClaimedSuccessfully, contribution?.claimableFormatted]);

  const handleClaim = async () => {
    try {
      await claim(loanAddress);
    } catch (error) {
      console.error('Error claiming:', error);
      toast.error('Failed to claim repayment');
    }
  };

  const formatUSDC = (amount: bigint) => {
    return parseFloat(formatUnits(amount, USDC_DECIMALS)).toFixed(2);
  };

  const hasClaimable = contribution && contribution.claimable > 0n;

  return (
    <div className="relative">
      {/* Loan Card */}
      <LoanCardWrapper loanAddress={loanAddress} />

      {/* Investment Details Overlay */}
      {contribution && (
        <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between gap-3">
            {/* Investment Info */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {/* Your Investment */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Your Investment</p>
                <p className="text-sm font-bold text-gray-900">
                  ${formatUSDC(contribution.amount)} USDC
                </p>
                {contribution.sharePercentage > 0 && (
                  <p className="text-xs text-gray-500">
                    {contribution.sharePercentage.toFixed(1)}% of total
                  </p>
                )}
              </div>

              {/* Claimable */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Claimable</p>
                <p className={`text-sm font-bold ${hasClaimable ? 'text-green-600' : 'text-gray-400'}`}>
                  ${formatUSDC(contribution.claimable)} USDC
                </p>
                {!hasClaimable && (
                  <p className="text-xs text-gray-500">Nothing yet</p>
                )}
              </div>
            </div>

            {/* Claim Button */}
            {hasClaimable && (
              <button
                onClick={handleClaim}
                disabled={isClaimPending || isClaimConfirming || isClaimSuccess}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                {isClaimPending || isClaimConfirming
                  ? 'Claiming...'
                  : isClaimSuccess
                  ? 'Claimed ✓'
                  : 'Claim'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
