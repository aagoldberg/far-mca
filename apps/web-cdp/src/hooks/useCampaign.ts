'use client';

import { useState, useEffect, useCallback } from 'react';
import { gql } from 'graphql-tag';
import { getClient } from '@/lib/apollo';
import { createPublicClient, http } from 'viem';
import { erc20Abi } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useQuery } from '@tanstack/react-query';

// Type for the raw campaign data from the subgraph
export type RawCampaign = {
    id: string; // The full ID from the subgraph
    campaignId: string; // The numeric campaign ID
    creator: string;
    metadataURI: string;
    goalAmount: string;
    totalRaised: string;
};

// Type for the processed campaign data, including fetched metadata
export interface ProcessedCampaign extends RawCampaign {
    metadata: CampaignMetadata | null;
};

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;

// Define the structure of the campaign metadata stored in IPFS
interface CampaignMetadata {
  title: string;
  description: string;
  image: string; // This should be the IPFS CID, e.g., "ipfs://bafybe..."
}

// Define the structure of a campaign coming from the subgraph
interface CampaignFromSubgraph {
    campaignAddress: `0x${string}`;
    campaignNumericId: string;
    creator: `0x${string}`;
    metadataURI: string;
    goalAmount: string;
    totalRaised: string;
}

// Define the structure of a campaign after its metadata has been fetched
export interface ProcessedCampaign {
  campaignAddress: `0x${string}`;
  campaignNumericId: string;
  creator: `0x${string}`;
  metadataURI: string;
  goalAmount: string;
  totalRaised: string;
  totalDirectTransfers?: string;
  actualBalance?: string;
  contributions?: Array<{ id: string; contributor: string; amount: string; timestamp: string }>;
  directTransfers?: Array<{ id: string; from: string; amount: string; timestamp: string; source: string; transactionHash: string }>;
  metadata: CampaignMetadata | null;
  reconciledTotalRaised: string;
}

// Custom hook to fetch and process campaign metadata from IPFS
export const useCampaigns = (campaignsFromSubgraph: any[] | undefined) => { // TODO: Update this any
  const [campaigns, setCampaigns] = useState<ProcessedCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If there are no campaigns from the subgraph, do nothing.
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
                // Format the IPFS URI to be a fetchable URL
                const url = `${IPFS_GATEWAY}${campaign.metadataURI.replace('ipfs://', '')}`;
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error(`Failed to fetch metadata from ${url}: ${response.statusText}`);
                }
                metadata = await response.json();
              } catch (e) {
                console.error(`Failed to fetch or parse metadata for campaign ${campaign.campaignNumericId}:`, e);
                // Keep metadata as null if fetching fails
              }
            }
            return {
                campaignAddress: campaign.id,
                campaignNumericId: campaign.campaignId,
                creator: campaign.creator,
                metadataURI: campaign.metadataURI,
                goalAmount: campaign.goalAmount,
                totalRaised: campaign.totalRaised,
                totalDirectTransfers: campaign.totalDirectTransfers,
                actualBalance: campaign.actualBalance,
                contributions: campaign.contributions,
                directTransfers: campaign.directTransfers,
                metadata: metadata,
                reconciledTotalRaised: campaign.actualBalance || campaign.totalRaised,
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
  }, [campaignsFromSubgraph]); // Re-run the effect if the source campaigns change

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
      // 1. Fetch on-chain data from subgraph
      const { data } = await getClient().query({
        query: gql`
          query GetCampaignByNumericId($campaignId: String!) {
            campaigns(where: { campaignId: $campaignId }) {
              campaignAddress: id
              campaignNumericId: campaignId
              creator
              metadataURI
              goalAmount
              totalRaised
              totalDirectTransfers
              actualBalance
              contributions {
                id
                contributor
                amount
                timestamp
              }
              directTransfers {
                id
                from
                amount
                timestamp
                source
                transactionHash
              }
            }
          }
        `,
        variables: { campaignId: campaignNumericId },
        fetchPolicy: 'network-only',
      });

      if (!data.campaigns || data.campaigns.length === 0) {
        // Campaign not found - this is a valid state, not an error
        setCampaign(null);
        setLoading(false);
        return;
      }
      
      const subgraphCampaign = data.campaigns[0];

      // 2. Fetch reconciled on-chain balance
      let reconciledTotalRaised = subgraphCampaign.totalRaised; // Default to subgraph value
      try {
        const publicClient = createPublicClient({
          chain: baseSepolia,
          transport: http(),
        });
        const balance = await publicClient.readContract({
          address: USDC_CONTRACT_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [subgraphCampaign.campaignAddress],
        });
        reconciledTotalRaised = balance.toString();
      } catch (e) {
        console.error(`Failed to fetch reconciled balance for campaign ${subgraphCampaign.campaignAddress}:`, e);
      }

      // 3. Fetch metadata from IPFS
      let metadata: CampaignMetadata | null = null;
      if (subgraphCampaign.metadataURI) {
        try {
          const url = `${IPFS_GATEWAY}${subgraphCampaign.metadataURI.replace('ipfs://', '')}`;
          const response = await fetch(url);
          if (response.ok) {
            metadata = await response.json();
          }
        } catch (e) {
          console.error(`Failed to fetch metadata for campaign ${subgraphCampaign.campaignAddress}:`, e);
        }
      }
      
      setCampaign({ ...subgraphCampaign, metadata, reconciledTotalRaised });

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