'use client';

import { formatUnits } from 'viem';
import { 
  CurrencyDollarIcon, 
  FireIcon, 
  UsersIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const USDC_DECIMALS = 6;

interface StatsProps {
  stats: {
    totalRaised: bigint;
    activeCampaigns: number;
    totalDonors: number;
    totalCampaigns: number;
  };
}

export default function CampaignStats({ stats }: StatsProps) {
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(formatUnits(stats.totalRaised, USDC_DECIMALS)));

  const statCards = [
    {
      label: 'Total Raised',
      value: formattedTotal,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Active Campaigns',
      value: stats.activeCampaigns.toString(),
      icon: FireIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      label: 'Total Donors',
      value: stats.totalDonors.toString(),
      icon: UsersIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'All Campaigns',
      value: stats.totalCampaigns.toString(),
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xs font-medium ${stat.textColor} uppercase tracking-wider`}>
              {stat.label}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stat.value}
          </div>
          {index === 0 && stats.totalCampaigns > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Avg: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(formatUnits(stats.totalRaised / BigInt(Math.max(stats.totalCampaigns, 1)), USDC_DECIMALS)))} per campaign
            </div>
          )}
        </div>
      ))}
    </div>
  );
}