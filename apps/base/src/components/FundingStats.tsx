"use client";

import { formatUnits } from 'viem';
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const USDC_DECIMALS = 6;

interface Stats {
  totalRaised: bigint;
  totalRequests: number;
  activeRequests: number;
  totalInvestors: number;
}

export default function FundingStats({ stats }: { stats: Stats }) {
  const totalRaised = Number(formatUnits(stats.totalRaised, USDC_DECIMALS));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Raised</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalRaised.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-600 font-medium">Revenue-based returns</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Active Advances</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.activeRequests}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircleIcon className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">Generating returns</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Investors</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalInvestors}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <UsersIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Unique funders
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalRequests}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-lg">
            <BriefcaseIcon className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="text-xs text-gray-500">
          All time funding requests
        </div>
      </div>
    </div>
  );
}