'use client';

import {
  UsersIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface DonorInsightsProps {
  campaign: any;
  analyticsData: any;
}

export default function DonorInsights({ campaign, analyticsData }: DonorInsightsProps) {
  // Mock donor data - in real app, this would come from your analytics
  const donorInsights = {
    repeatDonors: 3,
    averageSessionTime: '2m 34s',
    topDonationTimes: [
      { time: '6-9 PM', percentage: 35 },
      { time: '12-3 PM', percentage: 28 },
      { time: '9-12 PM', percentage: 22 },
      { time: '3-6 PM', percentage: 15 },
    ],
    donorLocations: [
      { location: 'United States', donors: 8, percentage: 67 },
      { location: 'Canada', donors: 2, percentage: 17 },
      { location: 'United Kingdom', donors: 1, percentage: 8 },
      { location: 'Other', donors: 1, percentage: 8 },
    ],
    engagementMetrics: {
      shareRate: 12, // percentage of donors who shared
      returnVisitors: 23, // percentage
      mobileDonors: 68, // percentage
    }
  };

  const totalDonors = campaign.contributions?.length || 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Donor Insights</h3>
      
      {/* Key Donor Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Repeat Donors</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{donorInsights.repeatDonors}</p>
          <p className="text-xs text-gray-500">
            {totalDonors > 0 ? Math.round((donorInsights.repeatDonors / totalDonors) * 100) : 0}% of total
          </p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="w-5 h-5 text-blue-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Avg. Visit</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{donorInsights.averageSessionTime}</p>
          <p className="text-xs text-gray-500">Per session</p>
        </div>
      </div>

      {/* Peak Donation Times */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Peak Donation Times</h4>
        <div className="space-y-2">
          {donorInsights.topDonationTimes.map((timeSlot, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{timeSlot.time}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${timeSlot.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{timeSlot.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donor Locations */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <MapPinIcon className="w-4 h-4 mr-1" />
          Donor Locations
        </h4>
        <div className="space-y-2">
          {donorInsights.donorLocations.map((location, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{location.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{location.donors} donors</span>
                <span className="text-sm font-medium text-gray-900">{location.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Engagement</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{donorInsights.engagementMetrics.shareRate}%</p>
            <p className="text-xs text-gray-500">Share rate</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{donorInsights.engagementMetrics.returnVisitors}%</p>
            <p className="text-xs text-gray-500">Return visits</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{donorInsights.engagementMetrics.mobileDonors}%</p>
            <p className="text-xs text-gray-500">Mobile donors</p>
          </div>
        </div>
      </div>
    </div>
  );
}