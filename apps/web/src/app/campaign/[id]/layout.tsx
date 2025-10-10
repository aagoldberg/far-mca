import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

async function getCampaignMetadata(id: string) {
  try {
    const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
    if (!subgraphUrl) {
      console.error('NEXT_PUBLIC_SUBGRAPH_URL not configured');
      return null;
    }

    const response = await fetch(subgraphUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetCampaign($campaignId: String!) {
            campaigns(where: { campaignId: $campaignId }) {
              id
              campaignId
              creator
              metadataURI
              goalAmount
              totalRaised
            }
          }
        `,
        variables: { campaignId: id },
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch from subgraph:', response.status);
      return null;
    }

    const data = await response.json();
    const campaign = data?.data?.campaigns?.[0];
    
    if (!campaign) return null;

    // Fetch metadata from IPFS
    if (campaign.metadataURI) {
      try {
        // Handle both IPFS hashes and full IPFS URLs
        let metadataUrl;
        if (campaign.metadataURI.startsWith('ipfs://')) {
          metadataUrl = `${IPFS_GATEWAY}${campaign.metadataURI.replace('ipfs://', '')}`;
        } else if (campaign.metadataURI.startsWith('Qm') || campaign.metadataURI.startsWith('bafy')) {
          // Direct IPFS hash
          metadataUrl = `${IPFS_GATEWAY}${campaign.metadataURI}`;
        } else {
          // Assume it's already a full URL
          metadataUrl = campaign.metadataURI;
        }
        
        console.log('Fetching metadata from:', metadataUrl);
        
        const metadataResponse = await fetch(metadataUrl, {
          headers: {
            'Accept': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000),
        });
        
        if (metadataResponse.ok) {
          const metadata = await metadataResponse.json();
          console.log('Metadata fetched successfully:', metadata);
          return {
            ...campaign,
            metadata,
          };
        } else {
          console.error('Failed to fetch metadata, status:', metadataResponse.status);
        }
      } catch (metadataError) {
        console.error('Error fetching metadata from IPFS:', metadataError);
      }
    }

    return campaign;
  } catch (error) {
    console.error('Error fetching campaign metadata:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaignMetadata(id);
  
  if (!campaign) {
    return {
      title: 'Campaign Not Found',
      description: 'The requested campaign could not be found.',
    };
  }

  const title = campaign?.metadata?.title || 'Support This Campaign';
  const description = campaign?.metadata?.description || 'Help support this important cause on everybit';
  const imageUrl = campaign?.metadata?.image 
    ? `${IPFS_GATEWAY}${campaign.metadata.image.replace('ipfs://', '')}`
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fundrise-web.vercel.app'}/placeholder.png`;
  const campaignUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fundrise-web.vercel.app'}/campaign/${id}`;

  // Log for debugging
  console.log('Generating metadata for campaign:', id);
  console.log('Campaign found:', !!campaign);
  console.log('Title:', title);
  console.log('Image URL:', imageUrl);

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: campaignUrl,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'everybit',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: campaignUrl,
    },
  };
}

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}