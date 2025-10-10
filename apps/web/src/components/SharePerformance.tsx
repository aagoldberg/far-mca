'use client';

import { useState } from 'react';
import {
  ShareIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  LinkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface SharePerformanceProps {
  shares: number;
  campaignId: string;
}

export default function SharePerformance({ shares, campaignId }: SharePerformanceProps) {
  const [showTips, setShowTips] = useState(false);

  // Mock share performance data
  const shareData = {
    totalShares: shares,
    platforms: [
      { name: 'Facebook', shares: 34, conversions: 5, icon: '📘' },
      { name: 'Twitter', shares: 28, conversions: 3, icon: '🐦' },
      { name: 'WhatsApp', shares: 18, conversions: 7, icon: '💬' },
      { name: 'Instagram', shares: 9, conversions: 1, icon: '📷' },
    ],
    weekOverWeek: 23, // percentage increase
    bestPerformingPost: {
      platform: 'Facebook',
      engagement: '156 interactions',
      shares: 12
    }
  };

  const sharingTips = [
    {
      icon: <PhotoIcon className="w-5 h-5 text-blue-600" />,
      title: "Add compelling visuals",
      description: "Posts with images get 2.3x more engagement"
    },
    {
      icon: <ChartBarIcon className="w-5 h-5 text-green-600" />,
      title: "Share progress updates",
      description: "Show milestones reached to encourage more donations"
    },
    {
      icon: <LinkIcon className="w-5 h-5 text-purple-600" />,
      title: "Use direct campaign links",
      description: "Make it easy for supporters to donate immediately"
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Share Performance</h3>
        <button
          onClick={() => setShowTips(!showTips)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showTips ? 'Hide Tips' : 'Show Tips'}
        </button>
      </div>

      {showTips ? (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Tips to Boost Sharing</h4>
          {sharingTips.map((tip, index) => (
            <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {tip.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{tip.title}</p>
                <p className="text-xs text-gray-600">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Share Stats */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-gray-900">{shareData.totalShares}</span>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                +{shareData.weekOverWeek}% this week
              </div>
            </div>
            <p className="text-sm text-gray-600">Total shares across all platforms</p>
          </div>

          {/* Platform Breakdown */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform Breakdown</h4>
            <div className="space-y-3">
              {shareData.platforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{platform.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{platform.shares} shares</p>
                    <p className="text-xs text-gray-500">{platform.conversions} conversions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Performing Post */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <ShareIcon className="w-4 h-4 mr-1" />
              Best Performing Post
            </h4>
            <p className="text-sm text-blue-800">
              {shareData.bestPerformingPost.platform} post with {shareData.bestPerformingPost.engagement}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {shareData.bestPerformingPost.shares} shares generated
            </p>
          </div>
        </>
      )}
    </div>
  );
}