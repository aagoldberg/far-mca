'use client';

import { useAccount } from 'wagmi';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { useBorrowerLoans, useLoans } from '@/hooks/useMicroLoan';
import { useState, useEffect } from 'react';
import { DataExport } from './DataExport';
import { FarcasterProfileEdit } from './FarcasterProfileEdit';

interface TrustScoreData {
  score: number;
  breakdown: {
    revenueScore: number;
    consistencyScore: number;
    reliabilityScore: number;
    growthScore: number;
  };
  factors: string[];
  recommendations: string[];
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
  const { user, logout } = useCDPAuth();
  const [trustData, setTrustData] = useState<TrustScoreData | null>(null);
  const [trustLoading, setTrustLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Prioritize external wallet address, fallback to CDP address
  const address = externalAddress || cdpAddress;
  const { loans: borrowedLoans } = useBorrowerLoans(address);
  const { loans: allLoans } = useLoans();

  // Fetch trust score data
  useEffect(() => {
    if (!address) return;

    const fetchTrustScore = async () => {
      setTrustLoading(true);
      try {
        const response = await fetch(`/api/credit-score?walletAddress=${address}`);
        if (response.ok) {
          const data = await response.json();
          setTrustData(data);
        }
      } catch (error) {
        console.error('Failed to fetch trust score:', error);
      } finally {
        setTrustLoading(false);
      }
    };

    fetchTrustScore();
  }, [address]);

  // Calculate user stats
  const totalBorrowed = borrowedLoans?.reduce((sum, loan) => {
    return sum + Number(loan.principal);
  }, 0) || 0;

  const activeBorrowedLoans = borrowedLoans?.filter(loan => loan.active).length || 0;
  const completedBorrowedLoans = borrowedLoans?.filter(loan => loan.completed).length || 0;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-green-500 to-emerald-600';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Building';
    return 'Get Started';
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'shopify':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.337 3.415c-.022-.165-.182-.247-.302-.265-.12-.017-2.42-.182-2.42-.182s-1.612-1.6-1.793-1.78c-.18-.182-.532-.128-.668-.085l-.92.284c-.055-.165-.137-.367-.247-.587-.367-.715-.902-1.093-1.548-1.093-.045 0-.092.002-.137.007-.022-.025-.045-.05-.068-.072C6.87-.683 6.37-.628 5.92.017c-.585.84-.87 2.1-.775 3.375-.62.192-1.057.327-1.072.332-.33.105-.34.115-.382.427-.032.235-1.17 9.017-1.17 9.017l9.345 1.75 5.083-1.227s-3.59-9.772-3.612-9.877zm-4.31-1.2l-1.515.467c0-.472-.065-1.135-.287-1.702.715.135 1.065 1.065 1.802 1.235zm-2.537.783l-1.638.505c.16-.608.46-1.218.83-1.61.138-.147.33-.312.555-.412.217.458.257 1.107.253 1.517zm-1.107-3.03c.182 0 .33.045.457.135-.207.108-.41.283-.6.503-.503.58-.89 1.483-1.045 2.358l-1.27.393c.252-1.528.945-3.372 2.458-3.389z"/>
            <path d="M15.035 3.15c-.12-.017-2.42-.182-2.42-.182s-1.612-1.6-1.793-1.78a.391.391 0 00-.237-.1v20.855l5.083-1.228s-3.59-9.773-3.612-9.878c-.02-.165-.18-.247-.3-.265l1.28-7.422z" opacity=".7"/>
          </svg>
        );
      case 'stripe':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
          </svg>
        );
      case 'square':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 0A4.5 4.5 0 000 4.5v15A4.5 4.5 0 004.5 24h15a4.5 4.5 0 004.5-4.5v-15A4.5 4.5 0 0019.5 0h-15zM6 6h12v12H6V6z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
    }
  };

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Connect your wallet to view your account settings and credit score
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Account</h1>
        <p className="text-gray-600 mt-1">Manage your wallet, credit score, and connected accounts</p>
      </div>

      {/* Credit Score Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-lg font-semibold">LendFriend Trust Score</h2>
          </div>

          {trustLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400"></div>
            </div>
          ) : trustData ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Score Display */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-slate-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(creditData.score / 100) * 440} 440`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={creditData.score >= 70 ? '#10b981' : creditData.score >= 40 ? '#f59e0b' : '#ef4444'} />
                        <stop offset="100%" stopColor={creditData.score >= 70 ? '#059669' : creditData.score >= 40 ? '#d97706' : '#dc2626'} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{creditData.score}</span>
                    <span className="text-sm text-slate-400">out of 100</span>
                  </div>
                </div>
                <div className={`mt-3 px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getScoreGradient(creditData.score)}`}>
                  {getScoreLabel(creditData.score)}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Score Breakdown</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Revenue</span>
                    <span className="text-sm font-medium">{creditData.breakdown.revenueScore}/40</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${(creditData.breakdown.revenueScore / 40) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Consistency</span>
                    <span className="text-sm font-medium">{creditData.breakdown.consistencyScore}/20</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${(creditData.breakdown.consistencyScore / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Reliability</span>
                    <span className="text-sm font-medium">{creditData.breakdown.reliabilityScore}/20</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${(creditData.breakdown.reliabilityScore / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Growth</span>
                    <span className="text-sm font-medium">{creditData.breakdown.growthScore}/20</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${(creditData.breakdown.growthScore / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-400 mb-4">Connect a business account to see your credit score</p>
              <a
                href="/create-loan?step=2"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Connect Account
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Connected Platforms */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Connected Platforms</h2>
          <a
            href="/create-loan?step=2"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Platform
          </a>
        </div>

        {creditData && creditData.connections && creditData.connections.length > 0 ? (
          <div className="space-y-3">
            {creditData.connections.map((conn, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    conn.platform === 'shopify' ? 'bg-green-100 text-green-600' :
                    conn.platform === 'stripe' ? 'bg-purple-100 text-purple-600' :
                    conn.platform === 'square' ? 'bg-black text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {getPlatformIcon(conn.platform)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{conn.platform}</p>
                    <p className="text-sm text-gray-500">
                      Connected {new Date(conn.connected_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(conn.revenue_data.totalRevenue, conn.revenue_data.currency)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {conn.revenue_data.orderCount} orders ({conn.revenue_data.periodDays} days)
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-gray-600 mb-3">No platforms connected yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Connect Shopify, Stripe, or Square to build your credit score
            </p>
            <a
              href="/create-loan?step=2"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              Connect Your First Platform
            </a>
          </div>
        )}
      </section>

      {/* Recommendations */}
      {creditData && creditData.recommendations && creditData.recommendations.length > 0 && (
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Tips to Improve Your Score</h2>
              <ul className="space-y-2">
                {creditData.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Wallet Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Connected Wallet</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg text-gray-900">{formatAddress(address)}</p>
                <button
                  onClick={() => copyToClipboard(address)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title="Copy full address"
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {connector?.name && (
                <p className="text-sm text-gray-500">Connected via {connector.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      </section>

      {/* Farcaster Profile Section */}
      <section className="mb-6">
        <FarcasterProfileEdit />
      </section>

      {/* Activity Stats Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Loan Activity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{borrowedLoans?.length || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total Loans</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{activeBorrowedLoans}</p>
            <p className="text-sm text-gray-600 mt-1">Active</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{completedBorrowedLoans}</p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{allLoans?.length || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Network Total</p>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Identity Verification</h2>
            <p className="text-sm text-gray-700 mb-4">
              Coming soon! Verified users will unlock additional benefits:
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {['Higher loan limits', 'Better loan terms', 'Verified badge', 'Increased lender trust'].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </div>
              ))}
            </div>
            <button
              disabled
              className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-medium text-sm"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* Data Export Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6">
        <DataExport />
      </section>
    </div>
  );
}
