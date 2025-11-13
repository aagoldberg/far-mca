"use client";

import { useState } from 'react';
import { useCampaign } from '@/hooks/useCampaign';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const USDC_DECIMALS = 6;

function FundingCard({ 
  advanceId, 
  onFundClick 
}: { 
  advanceId: string;
  onFundClick: () => void;
}) {
  const { campaign, loading } = useCampaign(advanceId);
  const { address } = useAccount();
  const { ready, authenticated, login } = usePrivy();
  const [fundAmount, setFundAmount] = useState('');
  
  if (loading || !campaign) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  
  const fundedAmount = Number(formatUnits(BigInt(campaign.totalRaised || '0'), USDC_DECIMALS));
  const goalAmount = Number(formatUnits(BigInt(campaign.goalAmount || '0'), USDC_DECIMALS));
  const remainingAmount = goalAmount - fundedAmount;
  const progressPercentage = goalAmount > 0 ? (fundedAmount / goalAmount) * 100 : 0;
  const investorCount = campaign.contributions?.length || 0;
  
  const handleQuickAmount = (amount: number) => {
    setFundAmount(amount.toString());
  };
  
  const handleFund = () => {
    if (!authenticated) {
      login();
      return;
    }
    onFundClick();
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Progress Overview */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Funded</p>
            <p className="text-3xl font-bold text-gray-900">
              ${fundedAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Goal</p>
            <p className="text-xl font-semibold text-gray-700">
              ${goalAmount.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500">
          {progressPercentage.toFixed(1)}% funded • ${remainingAmount.toLocaleString()} remaining
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <UsersIcon className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-semibold text-gray-900">{investorCount}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Investors</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-semibold text-gray-900">1.5x</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Return Cap</p>
        </div>
      </div>
      
      {/* RBF Terms Summary */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5" />
          Investment Terms
        </h4>
        <ul className="space-y-1 text-sm text-green-800">
          <li>• 5% of monthly revenue</li>
          <li>• Returns capped at 1.5x investment</li>
          <li>• No equity dilution</li>
          <li>• Monthly distributions</li>
        </ul>
      </div>
      
      {/* Fund Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Investment Amount (USDC)
        </label>
        <div className="relative">
          <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            max={remainingAmount.toString()}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[100, 500, 1000, 5000].map(amount => (
            <button
              key={amount}
              onClick={() => handleQuickAmount(amount)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              disabled={amount > remainingAmount}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>
      
      {/* Fund Button */}
      <button
        onClick={handleFund}
        className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={progressPercentage >= 100}
      >
        {!authenticated ? 'Sign In to Invest' : 
         progressPercentage >= 100 ? 'Fully Funded' : 
         'Invest Now'}
      </button>
      
      {/* Expected Return */}
      {fundAmount && Number(fundAmount) > 0 && (
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-sm text-blue-700">
            Expected Return: <span className="font-semibold">${(Number(fundAmount) * 1.5).toLocaleString()}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            (1.5x cap on investment)
          </p>
        </div>
      )}
    </div>
  );
}

export default FundingCard;