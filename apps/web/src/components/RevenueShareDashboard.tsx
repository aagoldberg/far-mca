"use client";

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const USDC_DECIMALS = 6;

interface RevenueShareDashboardProps {
  campaignId: string;
  businessOwner: string;
  currentUserAddress: string | undefined;
}

export const RevenueShareDashboard = ({ campaignId, businessOwner, currentUserAddress }: RevenueShareDashboardProps) => {
  const { address } = useAccount();
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const isBusinessOwner = address && businessOwner && 
    address.toLowerCase() === businessOwner.toLowerCase();

  if (!isBusinessOwner) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-600">Revenue sharing dashboard is only available to business owners.</p>
      </div>
    );
  }

  const handleSubmitRevenue = async () => {
    if (!monthlyRevenue || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      // This would integrate with actual revenue reporting contract
      console.log('Would submit revenue:', monthlyRevenue);
      // Mock success for now
      setTimeout(() => {
        setIsSubmitting(false);
        setMonthlyRevenue('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting revenue:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Revenue Sharing Dashboard</h2>
          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Active
          </span>
        </div>

        {/* Revenue Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <CurrencyDollarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">5%</div>
            <div className="text-sm text-gray-600">Revenue Share</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <CalculatorIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1.5x</div>
            <div className="text-sm text-gray-600">Repayment Cap</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <ArrowTrendingUpIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">$0</div>
            <div className="text-sm text-gray-600">Total Repaid</div>
          </div>
        </div>

        {/* Revenue Reporting */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Reporting</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <ChartBarIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Report Your Monthly Revenue</p>
                <p className="text-sm text-blue-700 mt-1">
                  Report your business revenue each month to calculate investor payments. 
                  Payments are automatically calculated at 5% of reported revenue.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Revenue (USD)
              </label>
              <input
                id="revenue"
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
                placeholder="Enter this month's revenue"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSubmitRevenue}
                disabled={!monthlyRevenue || isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Revenue'}
              </button>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No revenue reports submitted yet</p>
            <p className="text-sm mt-1">Submit your first monthly revenue report to start tracking payments</p>
          </div>
        </div>
      </div>
    </div>
  );
};