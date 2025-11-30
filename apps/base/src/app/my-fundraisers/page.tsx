'use client';

import { useState, useEffect } from 'react';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { useRouter } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import CampaignManagementCard from '@/components/CampaignManagementCard';
import CampaignStats from '@/components/CampaignStats';
import { 
  PlusIcon, 
  FunnelIcon,
  ArrowDownTrayIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';


const GET_USER_CAMPAIGNS = gql`
  query GetUserCampaigns($creator: String!) {
    campaigns(where: { creator: $creator }) {
      id
      campaignId
      creator
      metadataURI
      goalAmount
      totalRaised
      totalDirectTransfers
      actualBalance
      createdAt
      contributions(orderBy: timestamp, orderDirection: desc) {
        id
        contributor
        amount
        timestamp
      }
      directTransfers(orderBy: timestamp, orderDirection: desc) {
        id
        from
        amount
        timestamp
      }
    }
  }
`;

type FilterType = 'all' | 'active' | 'ended' | 'draft';
type SortType = 'recent' | 'raised' | 'goal' | 'donors';

interface Campaign {
  id: string;
  campaignId: string;
  creator: string;
  metadataURI: string;
  goalAmount: string;
  totalRaised: string;
  totalDirectTransfers: string;
  actualBalance: string;
  createdAt: string;
  contributions?: Array<{
    id: string;
    contributor: string;
    amount: string;
    timestamp: string;
  }>;
  directTransfers?: Array<{
    id: string;
    from: string;
    amount: string;
    timestamp: string;
  }>;
}

export default function MyFundraisersPage() {
  const { user, authenticated } = useCDPAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('recent');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (authenticated === false) {
      router.push('/');
    }
  }, [authenticated, router]);

  // Query user's campaigns
  const { loading, error, data, refetch } = useQuery(GET_USER_CAMPAIGNS, {
    variables: { creator: user?.wallet?.address?.toLowerCase() || '' },
    skip: !user?.wallet?.address,
    fetchPolicy: 'network-only',
  });

  // Show loading while authentication is being determined
  if (authenticated === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // This shouldn't happen since useEffect redirects, but just in case
  if (!authenticated || !user) {
    return null;
  }

  const campaigns: Campaign[] = data?.campaigns || [];

  // Calculate aggregate stats
  const stats = {
    totalRaised: campaigns.reduce((sum: bigint, c: Campaign) => {
      const raised = BigInt(c.actualBalance || c.totalRaised || '0');
      return sum + raised;
    }, BigInt(0)),
    activeCampaigns: campaigns.filter((c: Campaign) => {
      // Consider a campaign active if it has a goal and hasn't been manually ended
      // Since we don't have isActive or endedAt fields, we'll consider all campaigns with goals as active
      return BigInt(c.goalAmount || '0') > BigInt(0);
    }).length,
    totalDonors: campaigns.reduce((sum: number, c: Campaign) => {
      const contributors = new Set([
        ...(c.contributions?.map(cont => cont.contributor) || []),
        ...(c.directTransfers?.map(dt => dt.from) || [])
      ]);
      return sum + contributors.size;
    }, 0),
    totalCampaigns: campaigns.length,
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign: Campaign) => {
    if (filter === 'all') return true;
    // Since we don't have isActive/endedAt, we'll use heuristics:
    // Active: has a goal and has raised something or is recent (< 90 days old)
    if (filter === 'active') {
      const hasGoal = BigInt(campaign.goalAmount || '0') > BigInt(0);
      const isRecent = (Date.now() / 1000 - Number(campaign.createdAt || 0)) < 90 * 24 * 60 * 60; // 90 days
      return hasGoal && isRecent;
    }
    // Ended: old campaigns (> 90 days) or campaigns that reached their goal
    if (filter === 'ended') {
      const isOld = (Date.now() / 1000 - Number(campaign.createdAt || 0)) > 90 * 24 * 60 * 60;
      const reachedGoal = BigInt(campaign.totalRaised || '0') >= BigInt(campaign.goalAmount || '1');
      return isOld || reachedGoal;
    }
    if (filter === 'draft') return !campaign.totalRaised || campaign.totalRaised === '0';
    return true;
  });

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a: Campaign, b: Campaign) => {
    switch (sort) {
      case 'recent':
        return Number(b.createdAt || 0) - Number(a.createdAt || 0);
      case 'raised':
        return Number(b.actualBalance || b.totalRaised || 0) - Number(a.actualBalance || a.totalRaised || 0);
      case 'goal':
        return Number(b.goalAmount || 0) - Number(a.goalAmount || 0);
      case 'donors':
        const aDonors = (a.contributions?.length || 0) + (a.directTransfers?.length || 0);
        const bDonors = (b.contributions?.length || 0) + (b.directTransfers?.length || 0);
        return bDonors - aDonors;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Fundraisers</h1>
          <p className="mt-2 text-gray-600">
            Manage and track all your fundraising campaigns
          </p>
        </div>

        {/* Stats Overview */}
        <CampaignStats stats={stats} />

        {/* Actions Bar */}
        <div className="my-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <Link
              href="/create-campaign"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Campaign
            </Link>
            
            {selectedCampaigns.length > 0 && (
              <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export ({selectedCampaigns.length})
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
                <option value="draft">Drafts</option>
              </select>
              <FunnelIcon className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="raised">Amount Raised</option>
                <option value="goal">Goal Amount</option>
                <option value="donors">Most Donors</option>
              </select>
              <ChartBarIcon className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700">Error loading campaigns: {error.message}</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : sortedCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No campaigns yet' : `No ${filter} campaigns`}
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first fundraising campaign to get started
            </p>
            <Link
              href="/create-campaign"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCampaigns.map((campaign: Campaign) => (
              <CampaignManagementCard
                key={campaign.id}
                campaign={campaign}
                isSelected={selectedCampaigns.includes(campaign.id)}
                onSelect={(selected) => {
                  setSelectedCampaigns(prev => 
                    selected 
                      ? [...prev, campaign.id]
                      : prev.filter(id => id !== campaign.id)
                  );
                }}
                onUpdate={() => refetch()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}