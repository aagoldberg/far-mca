'use client';

import { useState, useEffect } from 'react';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { useCDPWallets } from '@/hooks/useCDPWallets';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { gql, useQuery } from '@apollo/client';
import { formatUnits } from 'viem';
import Link from 'next/link';
import {
  HeartIcon,
  TrophyIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShareIcon,
  CheckCircleIcon,
  StarIcon,
  FireIcon,
  GiftIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import ImpactTimeline from '@/components/ImpactTimeline';
import AchievementBadges from '@/components/AchievementBadges';
import ImpactStats from '@/components/ImpactStats';

const USDC_DECIMALS = 6;

const GET_USER_DONATIONS = gql`
  query GetUserDonations($contributor: String!) {
    contributions(where: { contributor: $contributor }, orderBy: timestamp, orderDirection: desc) {
      id
      contributor
      amount
      timestamp
      campaign {
        id
        campaignId
        metadataURI
        goalAmount
        totalRaised
        actualBalance
        creator
      }
    }
    directTransfers(where: { from: $contributor }, orderBy: timestamp, orderDirection: desc) {
      id
      from
      amount
      timestamp
      campaign {
        id
        campaignId
        metadataURI
        goalAmount
        totalRaised
        actualBalance
        creator
      }
    }
  }
`;

interface Donation {
  id: string;
  amount: string;
  timestamp: string;
  campaign: {
    id: string;
    campaignId: string;
    metadataURI: string;
    goalAmount: string;
    totalRaised: string;
    actualBalance: string;
    creator: string;
  };
}

export default function YourImpactPage() {
  const { user, authenticated } = useCDPAuth();
  const { wallets } = useCDPWallets();
  const { address } = useAccount();
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'year' | 'month'>('all');

  // Get effective address - same logic as WalletDonationButton
  const hasPrivyWallet = user?.wallet?.address;
  const effectiveAddress = address || hasPrivyWallet;

  // Redirect if not authenticated
  useEffect(() => {
    if (authenticated === false) {
      router.push('/');
    }
  }, [authenticated, router]);

  // Query user's donations using effective address
  const { loading, error, data, refetch } = useQuery(GET_USER_DONATIONS, {
    variables: { contributor: effectiveAddress?.toLowerCase() || '' },
    skip: !effectiveAddress,
    fetchPolicy: 'network-only',
    pollInterval: 5000, // Poll every 5 seconds to catch new donations faster
  });

  // Debug logging for address detection
  useEffect(() => {
    console.log('Your Impact - Address Debug:', {
      userWalletAddress: user?.wallet?.address,
      wagmiAddress: address,
      effectiveAddress,
      queryingWith: effectiveAddress?.toLowerCase()
    });
  }, [user?.wallet?.address, address, effectiveAddress]);

  // Show loading while authentication is being determined
  if (authenticated === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your impact...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your impact data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading your impact data</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const contributions: Donation[] = data?.contributions || [];
  const directTransfers: Donation[] = data?.directTransfers || [];
  const allDonations = [...contributions, ...directTransfers].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  // Calculate impact metrics
  const totalDonated = allDonations.reduce((sum, donation) => {
    return sum + BigInt(donation.amount);
  }, BigInt(0));

  const totalDonatedFormatted = Number(formatUnits(totalDonated, USDC_DECIMALS));
  const uniqueCampaigns = new Set(allDonations.map(d => d.campaign.campaignId));
  const campaignsSupported = uniqueCampaigns.size;
  
  // Calculate campaigns where goal was reached (mock data for now)
  const completedCampaigns = allDonations.filter(donation => {
    const totalRaised = BigInt(donation.campaign.actualBalance || donation.campaign.totalRaised || '0');
    const goalAmount = BigInt(donation.campaign.goalAmount || '1');
    return totalRaised >= goalAmount;
  });

  const campaignsCompleted = new Set(completedCampaigns.map(d => d.campaign.campaignId)).size;

  // Mock additional impact data
  const impactData = {
    totalDonated: totalDonatedFormatted,
    campaignsSupported,
    campaignsCompleted,
    peopleHelped: Math.max(campaignsSupported * 12, 1), // Estimate
    additionalDonationsInfluenced: totalDonatedFormatted * 2.3, // Mock social impact
    donationStreak: Math.min(allDonations.length, 30), // Days
    averageDonation: allDonations.length > 0 ? totalDonatedFormatted / allDonations.length : 0,
    monthsActive: Math.max(Math.ceil((Date.now() / 1000 - Number(allDonations[allDonations.length - 1]?.timestamp || Date.now() / 1000)) / (30 * 24 * 60 * 60)), 1),
  };

  // Calculate achievements
  const achievements = [
    { 
      id: 'first-donation', 
      name: 'First Steps', 
      description: 'Made your first donation', 
      icon: HeartIconSolid, 
      color: 'text-red-500 bg-red-100',
      earned: allDonations.length > 0,
      date: allDonations[allDonations.length - 1]?.timestamp
    },
    { 
      id: 'goal-crusher', 
      name: 'Goal Crusher', 
      description: 'Helped a campaign reach its goal', 
      icon: TrophyIcon, 
      color: 'text-yellow-500 bg-yellow-100',
      earned: campaignsCompleted > 0,
      date: completedCampaigns[0]?.timestamp
    },
    { 
      id: 'community-builder', 
      name: 'Community Builder', 
      description: 'Supported 5+ different campaigns', 
      icon: UserGroupIcon, 
      color: 'text-blue-500 bg-blue-100',
      earned: campaignsSupported >= 5,
      date: allDonations[4]?.timestamp
    },
    { 
      id: 'generous-giver', 
      name: 'Generous Giver', 
      description: 'Donated $100+ total', 
      icon: CurrencyDollarIcon, 
      color: 'text-green-500 bg-green-100',
      earned: totalDonatedFormatted >= 100,
      date: null // Would need to calculate when threshold was hit
    },
    { 
      id: 'streak-keeper', 
      name: 'Streak Keeper', 
      description: 'Donated for 7+ consecutive weeks', 
      icon: FireIcon, 
      color: 'text-orange-500 bg-orange-100',
      earned: impactData.donationStreak >= 7,
      date: null
    },
    { 
      id: 'super-supporter', 
      name: 'Super Supporter', 
      description: 'Made 10+ donations', 
      icon: StarIcon, 
      color: 'text-purple-500 bg-purple-100',
      earned: allDonations.length >= 10,
      date: allDonations[9]?.timestamp
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const nextAchievement = achievements.find(a => !a.earned);

  if (allDonations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <HeartIconSolid className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Impact Journey Starts Here</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Once you make your first donation, this page will track your incredible impact across all the campaigns you support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Campaigns
              </Link>
              <Link
                href="/create-campaign"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Start a Campaign
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Impact</h1>
                <p className="text-gray-600">See the difference you're making in the world</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 max-w-xs">
                  <div>Query Address: {effectiveAddress?.slice(0, 6)}...{effectiveAddress?.slice(-4)}</div>
                  <div>Found: {allDonations.length} donations</div>
                </div>
              )}
              <button
                onClick={() => {
                  console.log('Refreshing donation data...');
                  console.log('Current effective address:', effectiveAddress);
                  refetch();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                disabled={loading}
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {/* Time Filter */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Time' },
              { key: 'year', label: 'This Year' },
              { key: 'month', label: 'This Month' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSelectedTimeframe(option.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === option.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Stats Overview */}
        <ImpactStats impactData={impactData} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Achievements */}
          <div className="lg:col-span-1">
            <AchievementBadges 
              achievements={earnedAchievements} 
              nextAchievement={nextAchievement}
            />
          </div>

          {/* Impact Timeline */}
          <div className="lg:col-span-2">
            <ImpactTimeline donations={allDonations} />
          </div>
        </div>

        {/* Additional Impact Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Giving Pattern */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600" />
              Your Giving Pattern
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average donation</span>
                <span className="font-semibold">${impactData.averageDonation.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Donations this month</span>
                <span className="font-semibold">{allDonations.filter(d => 
                  Date.now() / 1000 - Number(d.timestamp) < 30 * 24 * 60 * 60
                ).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active months</span>
                <span className="font-semibold">{impactData.monthsActive}</span>
              </div>
            </div>
          </div>

          {/* Social Impact */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShareIcon className="w-5 h-5 mr-2 text-green-600" />
              Social Impact
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">Estimated influence</span>
                  <span className="font-semibold">${impactData.additionalDonationsInfluenced.toFixed(0)}</span>
                </div>
                <p className="text-xs text-gray-500">Additional donations inspired by your shares</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">People helped</span>
                  <span className="font-semibold">{impactData.peopleHelped}</span>
                </div>
                <p className="text-xs text-gray-500">Estimated lives impacted</p>
              </div>
            </div>
          </div>

          {/* Next Milestone */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Next Milestone
            </h3>
            {nextAchievement ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${nextAchievement.color}`}>
                    <nextAchievement.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{nextAchievement.name}</p>
                    <p className="text-sm text-gray-600">{nextAchievement.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {nextAchievement.id === 'community-builder' && `${campaignsSupported}/5 campaigns`}
                      {nextAchievement.id === 'generous-giver' && `$${totalDonatedFormatted.toFixed(0)}/$100`}
                      {nextAchievement.id === 'super-supporter' && `${allDonations.length}/10 donations`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${
                          nextAchievement.id === 'community-builder' ? (campaignsSupported / 5) * 100 :
                          nextAchievement.id === 'generous-giver' ? (totalDonatedFormatted / 100) * 100 :
                          nextAchievement.id === 'super-supporter' ? (allDonations.length / 10) * 100 :
                          0
                        }%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <TrophyIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-600">You've earned all available achievements! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}