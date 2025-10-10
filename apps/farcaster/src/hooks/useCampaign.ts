'use client';

import { useState, useEffect, useCallback } from 'react';
import { gql } from 'graphql-tag';
import { getClient } from '@/lib/apollo';

// Type for the raw campaign data from the subgraph
export type RawCampaign = {
    id: string;
    campaignId: string;
    creator: string;
    metadataURI: string;
    goalAmount: string;
    totalRaised: string;
};

// Type for the processed campaign data, including fetched metadata
export interface ProcessedCampaign extends RawCampaign {
    metadata: CampaignMetadata | null;
}

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

// Define the structure of the campaign metadata stored in IPFS
interface CampaignMetadata {
  title: string;
  description: string;
  image: string;
}

// Custom hook to fetch and process campaign metadata from IPFS
export const useCampaigns = (campaignsFromSubgraph: any[] | undefined) => {
  const [campaigns, setCampaigns] = useState<ProcessedCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignsFromSubgraph) {
      setCampaigns([]);
        return;
      }

    const fetchMetadata = async () => {
        setLoading(true);
      setError(null);

      try {
        const processedCampaigns = await Promise.all(
          campaignsFromSubgraph.map(async (campaign) => {
            let metadata: CampaignMetadata | null = null;
            if (campaign.metadataURI) {
              try {
                const url = `${IPFS_GATEWAY}${campaign.metadataURI.replace('ipfs://', '')}`;
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error(`Failed to fetch metadata from ${url}: ${response.statusText}`);
                }
                metadata = await response.json();
              } catch (e) {
                console.error(`Failed to fetch or parse metadata for campaign ${campaign.campaignId}:`, e);
              }
            }
            return {
                id: campaign.id,
                campaignId: campaign.campaignId,
                creator: campaign.creator,
                metadataURI: campaign.metadataURI,
                goalAmount: campaign.goalAmount,
                totalRaised: campaign.totalRaised || '0',
                metadata: metadata,
            };
          })
        );
        setCampaigns(processedCampaigns);
      } catch (e: any) {
        console.error("An error occurred while processing campaigns:", e);
        setError(e.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [campaignsFromSubgraph]);

  return { campaigns, loading, error };
};

export const useCampaign = (campaignNumericId: string | undefined) => {
  const [campaign, setCampaign] = useState<ProcessedCampaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = useCallback(async () => {
    if (!campaignNumericId) {
      setCampaign(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await getClient().query({
        query: gql`
          query GetCampaignByNumericId($campaignId: String!) {
            campaigns(where: { campaignId: $campaignId }) {
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
        `,
        variables: { campaignId: campaignNumericId },
        fetchPolicy: 'network-only',
      });

      if (!data.campaigns || data.campaigns.length === 0) {
        setCampaign(null);
        setLoading(false);
        return;
      }

      const subgraphCampaign = data.campaigns[0];

      // Fetch metadata from IPFS
      let metadata: CampaignMetadata | null = null;
      if (subgraphCampaign.metadataURI) {
        try {
          const url = `${IPFS_GATEWAY}${subgraphCampaign.metadataURI.replace('ipfs://', '')}`;
          const response = await fetch(url);
          if (response.ok) {
            metadata = await response.json();
          }
        } catch (e) {
          console.error(`Failed to fetch metadata for campaign ${subgraphCampaign.id}:`, e);
        }
      }

      setCampaign({
        id: subgraphCampaign.id,
        campaignId: subgraphCampaign.campaignId,
        creator: subgraphCampaign.creator,
        metadataURI: subgraphCampaign.metadataURI,
        goalAmount: subgraphCampaign.goalAmount,
        totalRaised: subgraphCampaign.totalRaised || '0',
        metadata
      });

    } catch (e: any) {
      console.error("Failed to fetch campaign data:", e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [campaignNumericId]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return { campaign, loading, error, refetch: fetchCampaign };
};
