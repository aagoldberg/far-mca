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

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-teal-600';
    if (score >= 40) return 'from-amber-500 to-orange-500';
    return 'from-slate-400 to-slate-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return { text: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 40) return { text: 'Good', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (score > 0) return { text: 'Building', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { text: 'Not rated', color: 'text-slate-500', bg: 'bg-slate-50' };
  };

  if (!address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-100">
            <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Connect Your Wallet</h2>
          <p className="text-slate-500">Connect a wallet to view your account and trust score</p>
        </div>
      </div>
    );
  }

  const scoreLabel = trustData ? getScoreLabel(trustData.score) : getScoreLabel(0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Trust Score Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Your Trust Score</p>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${scoreLabel.bg} ${scoreLabel.color}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {scoreLabel.text}
              </div>
            </div>
            {trustData?.connections && trustData.connections.length > 0 && (
              <button
                onClick={refreshConnections}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium transition-all"
              >
                <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {refreshing ? 'Syncing' : 'Refresh'}
              </button>
            )}
          </div>

          {trustLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-teal-400"></div>
            </div>
          ) : trustData ? (
            <>
              {/* Score Circle */}
              <div className="flex items-center gap-8 mb-8">
                <div className="relative">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="54" fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(trustData.score / 100) * 339} 339`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{trustData.score}</span>
                    <span className="text-slate-400 text-xs">of 100</span>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="flex-1 space-y-3">
                  <ScoreBar label="Revenue" value={trustData.breakdown.revenueScore} max={40} color="teal" />
                  <ScoreBar label="Consistency" value={trustData.breakdown.consistencyScore} max={20} color="blue" />
                  <ScoreBar label="Reliability" value={trustData.breakdown.reliabilityScore} max={20} color="purple" />
                  <ScoreBar label="Growth" value={trustData.breakdown.growthScore} max={20} color="amber" />
                </div>
              </div>

              {/* Connected count */}
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {trustData.connections.length} platform{trustData.connections.length !== 1 ? 's' : ''} connected
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">Build Your Trust Score</p>
              <p className="text-slate-400 text-sm mb-4">Connect your business platforms to get started</p>
              <a
                href="/create-loan?step=2"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/25"
              >
                Connect Platform
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Connected Platforms */}
      <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Connected Platforms</h2>
          <a
            href="/create-loan?step=2"
            className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </a>
        </div>

        {trustData?.connections && trustData.connections.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {trustData.connections.map((conn, idx) => (
              <PlatformRow key={idx} connection={conn} formatCurrency={formatCurrency} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No platforms connected yet</p>
            <p className="text-slate-400 text-xs mt-1">Connect Shopify, Stripe, or Square to build your score</p>
          </div>
        )}
      </section>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Loans" value={borrowedLoans?.length || 0} icon="📋" />
        <StatCard label="Active" value={activeBorrowedLoans} icon="🟢" highlight />
        <StatCard label="Completed" value={completedBorrowedLoans} icon="✅" />
      </div>

      {/* Wallet Card */}
      <section className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Connected Wallet</p>
              <button
                onClick={() => copyToClipboard(address)}
                className="font-mono font-medium text-slate-800 hover:text-slate-600 flex items-center gap-2 transition-colors"
              >
                {formatAddress(address)}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'} transition-colors`}>
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
              {connector?.name && (
                <p className="text-xs text-slate-400 mt-0.5">{connector.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="px-4 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all"
          >
            Disconnect
          </button>
        </div>
      </section>

      {/* Social Profile */}
      <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-white border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Social Profile</h2>
        </div>
        <div className="p-5">
          <FarcasterProfileEdit />
        </div>
      </section>
    </div>
  );
}

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = Math.round((value / max) * 100);
  const colorMap: Record<string, string> = {
    teal: 'bg-teal-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    amber: 'bg-amber-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-medium text-white">{value}<span className="text-slate-500">/{max}</span></span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function PlatformRow({ connection, formatCurrency }: { connection: TrustScoreData['connections'][0]; formatCurrency: (amount: number, currency: string) => string }) {
  const platformConfig: Record<string, { icon: string; gradient: string; label: string }> = {
    shopify: { icon: '🛍️', gradient: 'from-green-400 to-emerald-500', label: 'Shopify' },
    stripe: { icon: '💳', gradient: 'from-purple-400 to-indigo-500', label: 'Stripe' },
    square: { icon: '⬛', gradient: 'from-slate-600 to-slate-800', label: 'Square' },
  };

  const config = platformConfig[connection.platform.toLowerCase()] || {
    icon: '📊',
    gradient: 'from-slate-400 to-slate-500',
    label: connection.platform
  };

  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center text-xl shadow-sm`}>
          {config.icon}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{config.label}</p>
          <p className="text-xs text-slate-400 truncate max-w-[160px]">{connection.platform_user_id}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-slate-800">
          {formatCurrency(connection.revenue_data.totalRevenue, connection.revenue_data.currency)}
        </p>
        <p className="text-xs text-slate-400">
          {connection.revenue_data.orderCount.toLocaleString()} orders
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight }: { label: string; value: number; icon: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${highlight ? 'bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100' : 'bg-white border border-slate-100 shadow-sm shadow-slate-200/50'}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className={`text-2xl font-bold ${highlight ? 'text-teal-600' : 'text-slate-800'}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

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
