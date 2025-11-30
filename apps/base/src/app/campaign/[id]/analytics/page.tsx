'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCampaign } from '@/hooks/useCampaign';
import { formatUnits } from 'viem';
import Link from 'next/link';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  ClockIcon,
  ShareIcon,
  CalendarIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import CampaignAnalyticsCharts from '@/components/CampaignAnalyticsCharts';
import DonorInsights from '@/components/DonorInsights';
import SharePerformance from '@/components/SharePerformance';

const USDC_DECIMALS = 6;

type TimeRange = '7d' | '30d' | '90d' | 'all';

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const { campaign, loading, error } = useCampaign(campaignId);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading campaign analytics</p>
          <Link href="/my-fundraisers" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Back to Your Fundraisers
          </Link>
        </div>
      </div>
    );
  }

  const totalRaised = BigInt(campaign.actualBalance || campaign.totalRaised || '0');
  const goalAmount = BigInt(campaign.goalAmount || '0');
  const raisedFormatted = Number(formatUnits(totalRaised, USDC_DECIMALS));
  const goalFormatted = Number(formatUnits(goalAmount, USDC_DECIMALS));
  const percentComplete = goalAmount > 0 ? Math.min((raisedFormatted / goalFormatted) * 100, 100) : 0;

  // Mock analytics data - in real app, this would come from your analytics service
  const analyticsData = {
    views: 1247,
    shares: 89,
    conversionRate: 3.2,
    avgDonation: raisedFormatted > 0 ? raisedFormatted / (campaign.contributions?.length || 1) : 0,
    topSources: [
      { source: 'Direct Link', visitors: 456, donations: 12 },
      { source: 'Facebook', visitors: 234, donations: 8 },
      { source: 'Twitter', visitors: 178, donations: 5 },
      { source: 'WhatsApp', visitors: 156, donations: 7 },
    ],
    deviceBreakdown: [
      { device: 'Mobile', percentage: 68 },
      { device: 'Desktop', percentage: 28 },
      { device: 'Tablet', percentage: 4 },
    ],
    recentActivity: [
      { type: 'donation', amount: 25, donor: '0x1234...5678', timestamp: '2 hours ago' },
      { type: 'share', platform: 'Twitter', timestamp: '4 hours ago' },
      { type: 'view', source: 'Direct', timestamp: '5 hours ago' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/my-fundraisers"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-1" />
              Back to Your Fundraisers
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics</h1>
              <p className="mt-2 text-gray-600">{campaign.metadata?.title || 'Campaign'}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">${raisedFormatted.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{percentComplete.toFixed(1)}% of goal</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900">{campaign.contributions?.length || 0}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  +12% this week
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campaign Views</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.views.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{analyticsData.conversionRate}% conversion</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Donation</p>
                <p className="text-2xl font-bold text-gray-900">${analyticsData.avgDonation.toFixed(0)}</p>
                <p className="text-sm text-gray-500">Per donor</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <HeartIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CampaignAnalyticsCharts 
            campaignId={campaignId} 
            timeRange={timeRange}
            totalRaised={raisedFormatted}
          />
          <DonorInsights 
            campaign={campaign}
            analyticsData={analyticsData}
          />
        </div>

        {/* Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {analyticsData.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {source.source === 'Direct Link' && <GlobeAltIcon className="w-4 h-4 text-gray-600" />}
                      {source.source === 'Facebook' && <ShareIcon className="w-4 h-4 text-blue-600" />}
                      {source.source === 'Twitter' && <ShareIcon className="w-4 h-4 text-sky-600" />}
                      {source.source === 'WhatsApp' && <ShareIcon className="w-4 h-4 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{source.source}</p>
                      <p className="text-sm text-gray-500">{source.visitors} visitors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{source.donations} donations</p>
                    <p className="text-sm text-gray-500">
                      {((source.donations / source.visitors) * 100).toFixed(1)}% conversion
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SharePerformance 
            shares={analyticsData.shares}
            campaignId={campaignId}
          />
        </div>

        {/* Device Breakdown & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              {analyticsData.deviceBreakdown.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {device.device === 'Mobile' && <DevicePhoneMobileIcon className="w-4 h-4 text-gray-600" />}
                      {device.device === 'Desktop' && <ComputerDesktopIcon className="w-4 h-4 text-gray-600" />}
                      {device.device === 'Tablet' && <DevicePhoneMobileIcon className="w-4 h-4 text-gray-600" />}
                    </div>
                    <span className="font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{device.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'donation' ? 'bg-green-100' :
                    activity.type === 'share' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {activity.type === 'donation' && <BanknotesIcon className="w-4 h-4 text-green-600" />}
                    {activity.type === 'share' && <ShareIcon className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'view' && <ChartBarIcon className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'donation' && `$${activity.amount} donation from ${activity.donor}`}
                      {activity.type === 'share' && `Shared on ${activity.platform}`}
                      {activity.type === 'view' && `Page view from ${activity.source}`}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}