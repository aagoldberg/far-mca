'use client';

import { useState } from 'react';
import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface CampaignAnalyticsChartsProps {
  campaignId: string;
  timeRange: string;
  totalRaised: number;
}

export default function CampaignAnalyticsCharts({ 
  campaignId, 
  timeRange, 
  totalRaised 
}: CampaignAnalyticsChartsProps) {
  const [activeTab, setActiveTab] = useState<'donations' | 'views'>('donations');

  // Mock chart data - in real app, this would come from your analytics API
  const chartData = {
    donations: [
      { date: '8/7', amount: 150, count: 3 },
      { date: '8/8', amount: 75, count: 1 },
      { date: '8/9', amount: 200, count: 2 },
      { date: '8/10', amount: 0, count: 0 },
      { date: '8/11', amount: 125, count: 2 },
      { date: '8/12', amount: 300, count: 4 },
      { date: '8/13', amount: 50, count: 1 },
    ],
    views: [
      { date: '8/7', count: 45 },
      { date: '8/8', count: 32 },
      { date: '8/9', count: 67 },
      { date: '8/10', count: 28 },
      { date: '8/11', count: 54 },
      { date: '8/12', count: 89 },
      { date: '8/13', count: 41 },
    ]
  };

  const maxDonationAmount = Math.max(...chartData.donations.map(d => d.amount));
  const maxViews = Math.max(...chartData.views.map(d => d.count));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'donations'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Donations
          </button>
          <button
            onClick={() => setActiveTab('views')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'views'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Views
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end justify-between gap-2 mb-4">
        {activeTab === 'donations' ? (
          chartData.donations.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col justify-end h-48 mb-2">
                <div
                  className="bg-green-500 rounded-t-sm min-h-[2px] transition-all duration-300 hover:bg-green-600 relative group cursor-pointer"
                  style={{ height: `${(day.amount / maxDonationAmount) * 100}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    ${day.amount} ({day.count} donations)
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">{day.date}</span>
            </div>
          ))
        ) : (
          chartData.views.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col justify-end h-48 mb-2">
                <div
                  className="bg-blue-500 rounded-t-sm min-h-[2px] transition-all duration-300 hover:bg-blue-600 relative group cursor-pointer"
                  style={{ height: `${(day.count / maxViews) * 100}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {day.count} views
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">{day.date}</span>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            {activeTab === 'donations' ? (
              <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600 mr-1" />
            )}
            <span className="text-sm font-medium text-gray-600">
              {activeTab === 'donations' ? 'Total This Week' : 'Weekly Views'}
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {activeTab === 'donations' 
              ? `$${chartData.donations.reduce((sum, d) => sum + d.amount, 0)}` 
              : chartData.views.reduce((sum, d) => sum + d.count, 0)
            }
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <CalendarIcon className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-600">Daily Average</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {activeTab === 'donations' 
              ? `$${Math.round(chartData.donations.reduce((sum, d) => sum + d.amount, 0) / 7)}` 
              : Math.round(chartData.views.reduce((sum, d) => sum + d.count, 0) / 7)
            }
          </p>
        </div>
      </div>
    </div>
  );
}