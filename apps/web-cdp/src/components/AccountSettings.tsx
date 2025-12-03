'use client';

import { useAccount } from 'wagmi';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { useBorrowerLoans } from '@/hooks/useMicroLoan';
import { useState, useEffect } from 'react';
import { FarcasterProfileEdit } from './FarcasterProfileEdit';

interface TrustScoreData {
  score: number;
  breakdown: {
    revenueScore: number;
    consistencyScore: number;
    reliabilityScore: number;
    growthScore: number;
  };
  connections: Array<{
    platform: string;
    platform_user_id: string;
    connected_at: string;
    last_synced_at: string | null;
    revenue_data: {
      totalRevenue: number;
      orderCount: number;
      periodDays: number;
      currency: string;
    };
  }>;
}

export default function AccountSettings() {
  const { address: externalAddress, connector } = useAccount();
  const { evmAddress: cdpAddress } = useEvmAddress();
  const { logout } = useCDPAuth();
  const [trustData, setTrustData] = useState<TrustScoreData | null>(null);
  const [trustLoading, setTrustLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const address = externalAddress || cdpAddress;
  const { loans: borrowedLoans } = useBorrowerLoans(address);

  useEffect(() => {
    if (!address) return;
    const fetchTrustScore = async () => {
      setTrustLoading(true);
      try {
        const response = await fetch(`/api/credit-score?walletAddress=${address}`);
        if (response.ok) {
          setTrustData(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch trust score:', error);
      } finally {
        setTrustLoading(false);
      }
    };
    fetchTrustScore();
  }, [address]);

  const refreshConnections = async () => {
    if (!address || refreshing) return;
    setRefreshing(true);
    try {
      const response = await fetch('/api/connections/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });
      if (response.ok) {
        const scoreResponse = await fetch(`/api/credit-score?walletAddress=${address}`);
        if (scoreResponse.ok) {
          setTrustData(await scoreResponse.json());
        }
      }
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const activeBorrowedLoans = borrowedLoans?.filter(loan => loan.active).length || 0;
  const completedBorrowedLoans = borrowedLoans?.filter(loan => loan.completed).length || 0;

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Good';
    if (score > 0) return 'Early';
    return 'Not rated';
  };

  if (!address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-500 text-sm">Connect a wallet to view your account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Trust Score Card */}
      <section className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Trust Score</h2>
            {trustData?.connections && trustData.connections.length > 0 && (
              <button
                onClick={refreshConnections}
                disabled={refreshing}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {refreshing ? 'Syncing...' : 'Refresh'}
              </button>
            )}
          </div>

          {trustLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-teal-600"></div>
            </div>
          ) : trustData ? (
            <div>
              {/* Score Display - matches the circular progress style */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20">
                  {/* Background circle */}
                  <svg className="w-20 h-20 -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#0d9488"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(trustData.score / 100) * 226} 226`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{trustData.score}%</span>
                  </div>
                  {/* Green dot indicator */}
                  <div className="absolute -top-0.5 right-2 w-2 h-2 bg-teal-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">{trustData.connections.length} platform{trustData.connections.length !== 1 ? 's' : ''} linked</p>
                  {/* Score tier indicators */}
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${trustData.score < 40 ? 'bg-slate-200 text-slate-700 border border-slate-300' : 'bg-gray-50 text-gray-300 border border-gray-200'}`}>
                      Early
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${trustData.score >= 40 && trustData.score < 70 ? 'bg-teal-100 text-teal-700 border border-teal-300' : 'bg-gray-50 text-gray-300 border border-gray-200'}`}>
                      Good
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${trustData.score >= 70 ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-gray-50 text-gray-300 border border-gray-200'}`}>
                      Excellent
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {trustData.score < 40
                      ? 'Connect more platforms to improve.'
                      : trustData.score < 70
                      ? 'Good progress! Keep building.'
                      : 'You qualify for the best terms.'}
                  </p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <ScoreRow label="Revenue" value={trustData.breakdown.revenueScore} max={40} />
                <ScoreRow label="Consistency" value={trustData.breakdown.consistencyScore} max={20} />
                <ScoreRow label="Reliability" value={trustData.breakdown.reliabilityScore} max={20} />
                <ScoreRow label="Growth" value={trustData.breakdown.growthScore} max={20} />
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium mb-1">Build Your Trust Score</p>
              <p className="text-gray-500 text-sm mb-4">Connect a business platform to get started</p>
              <a
                href="/create-loan?step=2"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Connect Platform
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Connected Platforms */}
      <section className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Connected Platforms</h2>
            <a
              href="/create-loan?step=2"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              + Add
            </a>
          </div>

          {trustData?.connections && trustData.connections.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {trustData.connections.map((conn, idx) => (
                <PlatformCard key={idx} connection={conn} formatCurrency={formatCurrency} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">No platforms connected yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Social Profile */}
      <section className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Profile</h2>
          <FarcasterProfileEdit />
        </div>
      </section>

      {/* Loan Activity */}
      <section className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Activity</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{borrowedLoans?.length || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Total</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-2xl font-bold text-teal-600">{activeBorrowedLoans}</p>
              <p className="text-sm text-teal-600 mt-1">Active</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{completedBorrowedLoans}</p>
              <p className="text-sm text-gray-500 mt-1">Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet */}
      <section className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Wallet</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
              </div>
              <div>
                <button
                  onClick={() => copyToClipboard(address)}
                  className="font-mono text-sm text-gray-900 hover:text-gray-600 flex items-center gap-2 transition-colors"
                >
                  {formatAddress(address)}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${copied ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
                {connector?.name && (
                  <p className="text-xs text-gray-400 mt-0.5">{connector.name}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, #3b82f6 0%, #0d9488 ${Math.min(percentage * 2, 100)}%, #047857 100%)`
          }}
        />
      </div>
      <span className="text-sm text-gray-600 w-12 text-right">{value}/{max}</span>
    </div>
  );
}

function PlatformCard({ connection, formatCurrency }: { connection: TrustScoreData['connections'][0]; formatCurrency: (amount: number, currency: string) => string }) {
  const platformConfig: Record<string, { icon: JSX.Element; label: string; color: string }> = {
    shopify: {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 256 292" fill="none">
          <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.774 57.34z" fill="#95BF47"/>
          <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.637-1.496-.939-2.405-1.047l-12.406 253.183 89.77-19.42S223.973 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357z" fill="#5E8E3E"/>
          <path d="M135.242 104.585l-11.022 32.749s-9.686-5.15-21.474-5.15c-17.352 0-18.234 10.88-18.234 13.622 0 14.967 39.03 20.705 39.03 55.818 0 27.61-17.51 45.378-41.135 45.378-28.347 0-42.843-17.636-42.843-17.636l7.59-25.073s14.904 12.8 27.468 12.8c8.214 0 11.567-6.468 11.567-11.2 0-19.548-32.013-20.416-32.013-52.548 0-27.033 19.396-53.19 58.539-53.19 15.089 0 22.527 4.33 22.527 4.33z" fill="#fff"/>
        </svg>
      ),
      label: 'Shopify',
      color: 'text-[#95BF47]'
    },
    stripe: {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#635BFF">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
        </svg>
      ),
      label: 'Stripe',
      color: 'text-[#635BFF]'
    },
    square: {
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#000">
          <path d="M3 3h18v18H3V3zm16.5 16.5v-15h-15v15h15zM9 9h6v6H9V9z"/>
        </svg>
      ),
      label: 'Square',
      color: 'text-gray-900'
    },
  };

  const config = platformConfig[connection.platform.toLowerCase()] || {
    icon: <span className="text-2xl font-bold text-gray-400">?</span>,
    label: connection.platform,
    color: 'text-gray-600'
  };

  const revenue = connection.revenue_data.totalRevenue;
  const orders = connection.revenue_data.orderCount;

  return (
    <div className="border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
      <div className="flex flex-col items-center text-center">
        <div className="mb-2">
          {config.icon}
        </div>
        <p className="font-medium text-gray-900 text-sm">{config.label}</p>
        <p className="text-xs text-gray-400 truncate max-w-full">{connection.platform_user_id.split('.')[0]}</p>
        <div className="mt-2 pt-2 border-t border-gray-100 w-full">
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(revenue, connection.revenue_data.currency)}</p>
          <p className="text-xs text-gray-400">{orders} orders</p>
        </div>
      </div>
    </div>
  );
}
