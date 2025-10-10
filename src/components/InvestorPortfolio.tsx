"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import Link from 'next/link';
import { 
  BriefcaseIcon,
  ChartPieIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const USDC_DECIMALS = 6;

interface PortfolioAdvance {
  id: string;
  businessName: string;
  invested: bigint;
  returns: bigint;
  totalFunded: bigint;
  totalRepaid: bigint;
  revenueSharePercentage: number;
  repaymentCap: number;
  status: 'funding' | 'active' | 'completed';
  expectedReturn: bigint;
}

export const InvestorPortfolio = () => {
  const { address } = useAccount();
  const [portfolio, setPortfolio] = useState<PortfolioAdvance[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [availableWithdrawals, setAvailableWithdrawals] = useState(0);
  const [selectedAdvance, setSelectedAdvance] = useState<string | null>(null);
  
  // Withdraw returns
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Load portfolio data (would come from subgraph in production)
  useEffect(() => {
    if (!address) return;
    
    // This would query the subgraph for all advances where user has invested
    // For now, using mock data structure
    loadPortfolioData();
  }, [address]);
  
  const loadPortfolioData = async () => {
    // Mock implementation - replace with actual subgraph query
    // This would fetch all advances where the user has investments
  };
  
  const handleWithdraw = async (advanceAddress: string) => {
    try {
      await writeContract({
        address: advanceAddress as `0x${string}`,
        abi: RBF_ADVANCE_ABI,
        functionName: 'withdrawReturns',
      });
      setSelectedAdvance(advanceAddress);
    } catch (error) {
      console.error('Error withdrawing returns:', error);
      alert('Failed to withdraw returns');
    }
  };
  
  // Calculate portfolio metrics
  const activeInvestments = portfolio.filter(a => a.status === 'active').length;
  const completedInvestments = portfolio.filter(a => a.status === 'completed').length;
  const averageReturn = totalInvested > 0 ? ((totalReturns / totalInvested - 1) * 100) : 0;
  
  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BriefcaseIcon className="w-6 h-6 text-green-600" />
          Your Investment Portfolio
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700">Total Invested</span>
              <BanknotesIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${totalInvested.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700">Total Returns</span>
              <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${totalReturns.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600">
              {averageReturn > 0 ? '+' : ''}{averageReturn.toFixed(1)}% ROI
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-700">Active Advances</span>
              <ClockIcon className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {activeInvestments}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-700">Available</span>
              <ArrowDownTrayIcon className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${availableWithdrawals.toLocaleString()}
            </p>
            <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
              Withdraw →
            </button>
          </div>
        </div>
      </div>
      
      {/* Portfolio Distribution Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ChartPieIcon className="w-5 h-5 text-gray-600" />
          Portfolio Distribution
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Pie chart would go here */}
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Chart visualization</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Investment Breakdown</h4>
            {portfolio.slice(0, 5).map((advance, index) => (
              <div key={advance.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${['green', 'blue', 'purple', 'orange', 'pink'][index]}-500`} />
                  <span className="text-sm text-gray-700">{advance.businessName}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ${Number(formatUnits(advance.invested, USDC_DECIMALS)).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active Investments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Active Investments</h3>
        
        <div className="space-y-4">
          {portfolio.filter(a => a.status === 'active').map((advance) => {
            const invested = Number(formatUnits(advance.invested, USDC_DECIMALS));
            const returns = Number(formatUnits(advance.returns, USDC_DECIMALS));
            const expectedReturn = Number(formatUnits(advance.expectedReturn, USDC_DECIMALS));
            const progressPercentage = (returns / expectedReturn) * 100;
            
            return (
              <div key={advance.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link href={`/advance/${advance.id}`} className="font-semibold text-gray-900 hover:text-green-600">
                      {advance.businessName}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {advance.revenueSharePercentage}% revenue share · {advance.repaymentCap}x cap
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Invested</p>
                    <p className="font-medium text-gray-900">${invested.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Received</p>
                    <p className="font-medium text-gray-900">${returns.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expected</p>
                    <p className="font-medium text-gray-900">${expectedReturn.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progressPercentage.toFixed(1)}% returned</p>
                </div>
                
                {returns > 0 && (
                  <button
                    onClick={() => handleWithdraw(advance.id)}
                    disabled={isPending || isConfirming}
                    className="w-full bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Withdraw ${returns.toLocaleString()}
                  </button>
                )}
              </div>
            );
          })}
          
          {portfolio.filter(a => a.status === 'active').length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No active investments</p>
              <Link href="/" className="text-green-600 hover:text-green-700 font-medium text-sm">
                Browse funding opportunities →
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Completed Investments */}
      {completedInvestments > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckBadgeIcon className="w-5 h-5 text-green-600" />
            Completed Investments
          </h3>
          
          <div className="space-y-3">
            {portfolio.filter(a => a.status === 'completed').map((advance) => {
              const invested = Number(formatUnits(advance.invested, USDC_DECIMALS));
              const returns = Number(formatUnits(advance.returns, USDC_DECIMALS));
              const roi = ((returns / invested - 1) * 100).toFixed(1);
              
              return (
                <div key={advance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{advance.businessName}</p>
                    <p className="text-sm text-gray-500">
                      Invested ${invested.toLocaleString()} → Returned ${returns.toLocaleString()}
                    </p>
                  </div>
                  <span className={`font-semibold ${Number(roi) > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {Number(roi) > 0 ? '+' : ''}{roi}% ROI
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Success message */}
      {isSuccess && selectedAdvance && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckBadgeIcon className="w-5 h-5 text-green-600" />
            <p className="text-green-900 font-medium">Returns withdrawn successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Minimal ABI for withdrawing returns
const RBF_ADVANCE_ABI = [
  {
    inputs: [],
    name: 'withdrawReturns',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;