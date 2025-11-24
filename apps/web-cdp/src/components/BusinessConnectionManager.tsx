'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import ShopifyConnectButton from './ShopifyConnectButton';
import StripeConnectButton from './StripeConnectButton';
import YouTubeConnectButton from './YouTubeConnectButton';
import TwitchConnectButton from './TwitchConnectButton';
import TikTokShopConnectButton from './TikTokShopConnectButton';
import {
  CheckCircleIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  VideoCameraIcon,
  PlayIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

interface BusinessConnection {
  platform: string;
  platform_user_id: string;
  connected_at: string;
  last_synced_at: string;
  revenue_data: {
    totalRevenue: number;
    orderCount: number;
    periodDays: number;
    currency: string;
    averageOrderValue?: number;
  };
}

interface CreditScoreData {
  score: number;
  breakdown: {
    revenueScore: number;
    consistencyScore: number;
    reliabilityScore: number;
    growthScore: number;
  };
  factors: string[];
  recommendations: string[];
  connections: BusinessConnection[];
}

const PLATFORM_CONFIG = {
  shopify: {
    name: 'Shopify',
    icon: ShoppingBagIcon,
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
  },
  stripe: {
    name: 'Stripe',
    icon: CreditCardIcon,
    color: 'bg-indigo-600',
    hoverColor: 'hover:bg-indigo-700',
  },
  youtube: {
    name: 'YouTube',
    icon: VideoCameraIcon,
    color: 'bg-red-600',
    hoverColor: 'hover:bg-red-700',
  },
  twitch: {
    name: 'Twitch',
    icon: PlayIcon,
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
  },
  tiktokshop: {
    name: 'TikTok Shop',
    icon: ShoppingCartIcon,
    color: 'bg-black',
    hoverColor: 'hover:bg-gray-800',
  },
  square: {
    name: 'Square',
    icon: BuildingStorefrontIcon,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
  },
  plaid: {
    name: 'Bank Account',
    icon: BanknotesIcon,
    color: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-800',
  },
};

export default function BusinessConnectionManager() {
  const { address } = useAccount();
  const [creditScore, setCreditScore] = useState<CreditScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      loadCreditScore();
    }
  }, [address]);

  const loadCreditScore = async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/credit-score?walletAddress=${encodeURIComponent(address)}`);

      if (!response.ok) {
        throw new Error('Failed to load credit score');
      }

      const data = await response.json();
      setCreditScore(data);
    } catch (err) {
      console.error('Error loading credit score:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-gray-600">Please connect your wallet to view business connections.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-center gap-3">
          <ArrowPathIcon className="w-5 h-5 animate-spin text-gray-400" />
          <span className="text-gray-600">Loading credit score...</span>
        </div>
      </div>
    );
  }

  const connections = creditScore?.connections || [];
  const score = creditScore?.score || 0;

  return (
    <div className="space-y-6">
      {/* Credit Score Display */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Business Credit Score</h3>
            <p className="text-sm text-gray-600">Based on your connected revenue sources</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900">{score}</div>
            <div className="text-sm text-gray-500">out of 100</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Score Breakdown */}
        {creditScore && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Revenue:</span>
              <span className="ml-2 font-semibold">{Math.round(creditScore.breakdown.revenueScore)}/40</span>
            </div>
            <div>
              <span className="text-gray-600">Consistency:</span>
              <span className="ml-2 font-semibold">{Math.round(creditScore.breakdown.consistencyScore)}/20</span>
            </div>
            <div>
              <span className="text-gray-600">Reliability:</span>
              <span className="ml-2 font-semibold">{Math.round(creditScore.breakdown.reliabilityScore)}/20</span>
            </div>
            <div>
              <span className="text-gray-600">Growth:</span>
              <span className="ml-2 font-semibold">{Math.round(creditScore.breakdown.growthScore)}/20</span>
            </div>
          </div>
        )}
      </div>

      {/* Connected Platforms */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Connected Platforms</h3>

        {connections.length > 0 ? (
          <div className="space-y-3 mb-6">
            {connections.map((connection) => {
              const config = PLATFORM_CONFIG[connection.platform as keyof typeof PLATFORM_CONFIG];
              const Icon = config?.icon || ShoppingBagIcon;
              const daysSince = Math.floor(
                (Date.now() - new Date(connection.last_synced_at).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={`${connection.platform}-${connection.platform_user_id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${config?.color} rounded-lg text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{config?.name || connection.platform}</div>
                      <div className="text-sm text-gray-500">{connection.platform_user_id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${(connection.revenue_data.totalRevenue / 1000).toFixed(1)}k
                    </div>
                    <div className="text-xs text-gray-500">
                      {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 mb-6">No platforms connected yet. Connect your first platform below.</p>
        )}

        {/* Connect Buttons */}
        <div className="space-y-3">
          {!connections.some(c => c.platform === 'shopify') && (
            <ShopifyConnectButton
              onConnectionSuccess={() => loadCreditScore()}
              onConnectionError={(err) => setError(err)}
              size="md"
            />
          )}

          {/* Stripe Integration */}
          {!connections.some(c => c.platform === 'stripe') && (
            <StripeConnectButton
              onConnectionSuccess={() => loadCreditScore()}
              onConnectionError={(err) => setError(err)}
              size="md"
            />
          )}

          {/* YouTube Integration */}
          {!connections.some(c => c.platform === 'youtube') && (
            <YouTubeConnectButton
              onConnectionSuccess={() => loadCreditScore()}
              onConnectionError={(err) => setError(err)}
              size="md"
            />
          )}

          {/* Twitch Integration */}
          {!connections.some(c => c.platform === 'twitch') && (
            <TwitchConnectButton
              onConnectionSuccess={() => loadCreditScore()}
              onConnectionError={(err) => setError(err)}
              size="md"
            />
          )}

          {/* TikTok Shop Integration */}
          {!connections.some(c => c.platform === 'tiktokshop') && (
            <TikTokShopConnectButton
              onConnectionSuccess={() => loadCreditScore()}
              onConnectionError={(err) => setError(err)}
              size="md"
            />
          )}

          {!connections.some(c => c.platform === 'square') && (
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
            >
              <BuildingStorefrontIcon className="w-5 h-5" />
              <span>Square (Coming Soon)</span>
            </button>
          )}

          {!connections.some(c => c.platform === 'plaid') && (
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
            >
              <BanknotesIcon className="w-5 h-5" />
              <span>Bank Account via Plaid (Coming Soon)</span>
            </button>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {creditScore && creditScore.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Improve Your Score</h3>
          <ul className="space-y-2">
            {creditScore.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
