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

  const getScoreColor = (score: number) => {
    if (score >= 70) return { text: 'text-emerald-600', bg: 'bg-emerald-500', light: 'bg-emerald-100' };
    if (score >= 40) return { text: 'text-amber-600', bg: 'bg-amber-500', light: 'bg-amber-100' };
    return { text: 'text-teal-600', bg: 'bg-teal-500', light: 'bg-teal-100' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Good';
    if (score > 0) return 'Building';
    return 'Not rated';
  };

  if (!address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Connect Your Wallet</h2>
          <p className="text-slate-500 text-sm">Connect a wallet to view your account</p>
        </div>
      </div>
    );
  }

  const scoreColors = trustData ? getScoreColor(trustData.score) : getScoreColor(0);

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      {/* Trust Score Card */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Trust Score</h2>
          {trustData?.connections && trustData.connections.length > 0 && (
            <button
              onClick={refreshConnections}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Syncing...' : 'Refresh'}
            </button>
          )}
        </div>

        {trustLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-teal-600"></div>
          </div>
        ) : trustData ? (
          <div className="p-5">
            {/* Score Display */}
            <div className="flex items-start gap-5 mb-6">
              <div className="flex-shrink-0">
                <div className={`w-20 h-20 rounded-2xl ${scoreColors.light} flex items-center justify-center`}>
                  <span className={`text-3xl font-bold ${scoreColors.text}`}>{trustData.score}</span>
                </div>
                <p className="text-center text-xs text-slate-400 mt-1.5">of 100</p>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${scoreColors.light} ${scoreColors.text}`}>
                    {getScoreLabel(trustData.score)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {trustData.connections.length} platform{trustData.connections.length !== 1 ? 's' : ''} linked
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {trustData.score < 40
                    ? 'Connect more platforms and increase sales to improve your score.'
                    : trustData.score < 70
                    ? 'Good progress! Continue building your track record.'
                    : 'Excellent score! You qualify for the best loan terms.'}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-3">
              <ScoreRow label="Revenue" value={trustData.breakdown.revenueScore} max={40} />
              <ScoreRow label="Consistency" value={trustData.breakdown.consistencyScore} max={20} />
              <ScoreRow label="Reliability" value={trustData.breakdown.reliabilityScore} max={20} />
              <ScoreRow label="Growth" value={trustData.breakdown.growthScore} max={20} />
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium mb-1">Build Your Trust Score</p>
            <p className="text-slate-400 text-sm mb-4">Connect a business platform to get started</p>
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
      </section>

      {/* Connected Platforms */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Connected Platforms</h2>
          <a
            href="/create-loan?step=2"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            + Add
          </a>
        </div>

        {trustData?.connections && trustData.connections.length > 0 ? (
          <div>
            {trustData.connections.map((conn, idx) => (
              <PlatformRow key={idx} connection={conn} formatCurrency={formatCurrency} />
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-slate-400 text-sm">No platforms connected</p>
          </div>
        )}
      </section>

      {/* Loan Activity */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Loan Activity</h2>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          <div className="py-4 text-center">
            <p className="text-2xl font-semibold text-slate-800">{borrowedLoans?.length || 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total</p>
          </div>
          <div className="py-4 text-center bg-teal-50/50">
            <p className="text-2xl font-semibold text-teal-600">{activeBorrowedLoans}</p>
            <p className="text-xs text-slate-500 mt-0.5">Active</p>
          </div>
          <div className="py-4 text-center">
            <p className="text-2xl font-semibold text-slate-800">{completedBorrowedLoans}</p>
            <p className="text-xs text-slate-500 mt-0.5">Completed</p>
          </div>
        </div>
      </section>

      {/* Wallet */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Wallet</h2>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>
            <div>
              <button
                onClick={() => copyToClipboard(address)}
                className="font-mono text-sm text-slate-800 hover:text-slate-600 flex items-center gap-2 transition-colors"
              >
                {formatAddress(address)}
                <span className={`text-xs px-1.5 py-0.5 rounded ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {copied ? 'Copied' : 'Copy'}
                </span>
              </button>
              {connector?.name && (
                <p className="text-xs text-slate-400">{connector.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors"
          >
            Disconnect
          </button>
        </div>
      </section>

      {/* Social Profile */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Social Profile</h2>
        </div>
        <div className="p-5">
          <FarcasterProfileEdit />
        </div>
      </section>
    </div>
  );
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600 w-24">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-slate-700 w-12 text-right">{value}/{max}</span>
    </div>
  );
}

function PlatformRow({ connection, formatCurrency }: { connection: TrustScoreData['connections'][0]; formatCurrency: (amount: number, currency: string) => string }) {
  const platformConfig: Record<string, { icon: JSX.Element; bg: string; label: string }> = {
    shopify: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.337 3.415c-.045-.027-.09-.045-.135-.054a.587.587 0 00-.12-.009c-.03 0-.065.003-.105.009-.04.005-.087.014-.14.027-.052.013-.095.027-.13.04-.034.014-.07.03-.108.05a1.2 1.2 0 00-.237.17 2.36 2.36 0 00-.18.18l-.003.003-.009.01c-.105.12-.21.27-.315.45-.105.18-.203.383-.293.608l-2.497 6.907-2.476-6.907a3.96 3.96 0 00-.293-.608 2.38 2.38 0 00-.315-.45l-.009-.01-.003-.003a2.36 2.36 0 00-.18-.18 1.2 1.2 0 00-.237-.17c-.038-.02-.074-.036-.108-.05a1.06 1.06 0 00-.13-.04 1.03 1.03 0 00-.14-.027.587.587 0 00-.105-.009.587.587 0 00-.12.009c-.045.009-.09.027-.135.054-.267.153-.4.486-.4.998v12.94c0 .512.133.845.4.998.045.027.09.045.135.054.045.009.087.009.12.009.033 0 .07-.003.105-.009.04-.005.087-.014.14-.027.052-.013.095-.027.13-.04.034-.014.07-.03.108-.05.087-.05.165-.108.237-.17.072-.063.135-.12.18-.18l.003-.003.009-.01c.105-.12.21-.27.315-.45.105-.18.203-.383.293-.608L12 10.173l2.476 6.907c.09.225.188.428.293.608.105.18.21.33.315.45l.009.01.003.003c.045.06.108.117.18.18.072.062.15.12.237.17.038.02.074.036.108.05.035.013.078.027.13.04.053.013.1.022.14.027.035.006.072.009.105.009.033 0 .075 0 .12-.009.045-.009.09-.027.135-.054.267-.153.4-.486.4-.998V4.413c0-.512-.133-.845-.4-.998z"/>
        </svg>
      ),
      bg: 'bg-green-500',
      label: 'Shopify'
    },
    stripe: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
        </svg>
      ),
      bg: 'bg-indigo-500',
      label: 'Stripe'
    },
    square: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm16.5 16.5v-15h-15v15h15zM9 9h6v6H9V9z"/>
        </svg>
      ),
      bg: 'bg-slate-800',
      label: 'Square'
    },
  };

  const config = platformConfig[connection.platform.toLowerCase()] || {
    icon: <span className="text-sm">?</span>,
    bg: 'bg-slate-500',
    label: connection.platform
  };

  const revenue = connection.revenue_data.totalRevenue;
  const orders = connection.revenue_data.orderCount;

  return (
    <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center text-white`}>
          {config.icon}
        </div>
        <div>
          <p className="font-medium text-slate-800">{config.label}</p>
          <p className="text-xs text-slate-400 truncate max-w-[140px]">{connection.platform_user_id}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-slate-800">{formatCurrency(revenue, connection.revenue_data.currency)}</p>
        <p className="text-xs text-slate-400">{orders.toLocaleString()} orders</p>
      </div>
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
