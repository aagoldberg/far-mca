import { getClient } from "@/lib/apollo";
import { gql } from "@apollo/client";

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

const GET_CAMPAIGN_DETAILS = gql`
  query GetCampaignDetails($id: ID!) {
    campaign(id: $id) {
      id
      campaignId
      creator
      metadataURI
      deadline
      goalAmount
      totalRaised
      totalDirectTransfers
      actualBalance
      ended
      tokenAddress
      state
      claimed
      createdAt
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
`;

const GET_ALL_CAMPAIGNS = gql`
  query GetAllCampaigns {
    campaigns(orderBy: createdAt, orderDirection: desc) {
      id
      campaignId
      creator
      metadataURI
      deadline
      goalAmount
      totalRaised
      totalDirectTransfers
      actualBalance
      ended
      tokenAddress
      state
      claimed
      createdAt
    }
  }
`;

const GET_RECENT_DONATIONS = gql`
  query GetRecentDonations($campaignId: String!) {
    contributions(where: { campaign: $campaignId }, orderBy: timestamp, orderDirection: desc, first: 10) {
      id
      contributor
      amount
      timestamp
    }
    directTransfers(where: { campaign: $campaignId }, orderBy: timestamp, orderDirection: desc, first: 10) {
      id
      from
      amount
      timestamp
      source
      transactionHash
    }
  }
`;

export async function getCampaign(id: string) {
    const { data } = await getClient().query({
        query: GET_CAMPAIGN_DETAILS,
        variables: { id: id.toLowerCase() },
    });
    return data.campaign;
}

export async function getIPFSMetadata(cid: string): Promise<{ title: string; description: string; image: string; } | null> {
    if (!cid) return null;
    try {
        const url = `${IPFS_GATEWAY}${cid.replace('ipfs://', '')}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch metadata from IPFS: ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching or parsing IPFS metadata:", error);
        return null;
    }
}

export async function getCampaignMetadata(id: string) {
    const campaign = await getCampaign(id);
    if (!campaign || !campaign.metadataURI) {
        return null;
    }
    const metadata = await getIPFSMetadata(campaign.metadataURI);
    return metadata;
}

export async function getAllCampaigns() {
    const { data } = await getClient().query({
        query: GET_ALL_CAMPAIGNS,
        fetchPolicy: 'network-only',
    });
    return data.campaigns;
}

export async function getRecentDonations(campaignId: string) {
    const { data } = await getClient().query({
        query: GET_RECENT_DONATIONS,
        variables: { campaignId: campaignId.toLowerCase() },
        fetchPolicy: 'network-only',
    });
    
    // Combine and sort all donations by timestamp
    const allDonations = [
        ...data.contributions.map((c: any) => ({ ...c, type: 'wallet', txHash: null })),
        ...data.directTransfers.map((d: any) => ({ ...d, type: d.source, contributor: d.from, txHash: d.transactionHash }))
    ].sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
    
    return allDonations;
} 