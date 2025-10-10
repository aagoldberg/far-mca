"use client";

import Link from 'next/link';
import { formatUnits } from 'viem';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const USDC_DECIMALS = 6;

interface FundingRequest {
  id: string;
  businessName?: string;
  description?: string;
  totalFunded: string;
  fundingGoal: string;
  revenueSharePercentage?: number;
  repaymentCap?: number;
  status: 'funding' | 'active' | 'completed';
  createdAt: string;
  investorCount?: number;
}

export default function FundingManagementCard({ 
  fundingRequest,
  isSelected,
  onToggleSelect
}: {
  fundingRequest: FundingRequest;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const funded = Number(formatUnits(BigInt(fundingRequest.totalFunded || '0'), USDC_DECIMALS));
  const goal = Number(formatUnits(BigInt(fundingRequest.fundingGoal || '0'), USDC_DECIMALS));
  const progressPercentage = goal > 0 ? (funded / goal) * 100 : 0;
  
  const getStatusBadge = () => {
    switch (fundingRequest.status) {
      case 'funding':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            Funding
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3" />
            Active
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {fundingRequest.businessName || 'Untitled Business'}
              </h3>
              {fundingRequest.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {fundingRequest.description}
                </p>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-900">
              ${funded.toLocaleString()} funded
            </span>
            <span className="text-gray-500">
              of ${goal.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Terms */}
        {(fundingRequest.revenueSharePercentage || fundingRequest.repaymentCap) && (
          <div className="flex gap-4 mb-4 text-sm">
            {fundingRequest.revenueSharePercentage && (
              <div className="flex items-center gap-1">
                <ChartBarIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {fundingRequest.revenueSharePercentage}% revenue share
                </span>
              </div>
            )}
            {fundingRequest.repaymentCap && (
              <div className="flex items-center gap-1">
                <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {fundingRequest.repaymentCap}x cap
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <UsersIcon className="w-4 h-4" />
            <span>{fundingRequest.investorCount || 0} investors</span>
          </div>
          <span>
            Created {new Date(Number(fundingRequest.createdAt) * 1000).toLocaleDateString()}
          </span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/advance/${fundingRequest.id}`}
            className="flex-1 text-center bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            View Details
          </Link>
          {fundingRequest.status === 'active' && (
            <Link
              href={`/advance/${fundingRequest.id}/dashboard`}
              className="flex-1 text-center bg-white text-green-600 border border-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors text-sm"
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}