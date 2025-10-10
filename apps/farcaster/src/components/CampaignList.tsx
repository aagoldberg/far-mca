'use client';

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useCampaigns } from '@/hooks/useCampaign';
import { CampaignCard } from './CampaignCard';

// Define the GraphQL query to fetch campaigns
const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns(orderBy: createdAt, orderDirection: desc) {
      id
      campaignId
      creator
      metadataURI
      goalAmount
      totalRaised
      totalDirectTransfers
      actualBalance
    }
  }
`;

// Skeleton loading component
const CampaignCardSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5">
      <div className="h-6 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
      <div className="h-2 bg-gray-200 rounded-full mb-2" />
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

const CampaignList = () => {
  const { loading, error, data } = useQuery(GET_CAMPAIGNS, {
    fetchPolicy: 'network-only',
  });
  const { campaigns: processedCampaigns, loading: processingLoading, error: processingError } = useCampaigns(data?.campaigns);

  if (loading || processingLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <CampaignCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) return <p className="text-center text-sm text-red-500">Error loading campaigns: {error.message}</p>;
  if (processingError) return <p className="text-center text-sm text-red-500">Error processing campaigns: {processingError}</p>;
  if (!processedCampaigns || processedCampaigns.length === 0) return <p className="text-center text-sm text-gray-500">No campaigns found.</p>;

  return (
    <div className="space-y-4">
      {processedCampaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaignDetails={{
          id: parseInt(campaign.campaignId),
          creator: campaign.creator,
          title: campaign.metadata?.title || 'Untitled Campaign',
          description: campaign.metadata?.description || '',
          goalAmount: BigInt(campaign.goalAmount || '0'),
          deadline: BigInt(0),
          model: 0,
          totalRaised: BigInt(campaign.totalRaised || '0'),
          isActive: true,
          goalReached: false,
          cancelled: false,
          imageCID: campaign.metadata?.image?.replace('ipfs://', '') || undefined,
          contributorCount: BigInt(0),
          revenueShare: campaign.metadata?.revenueShare,
          repaymentCap: campaign.metadata?.repaymentCap,
          creditScore: campaign.metadata?.creditScore,
        }} />
      ))}
    </div>
  );
};

export default CampaignList;
