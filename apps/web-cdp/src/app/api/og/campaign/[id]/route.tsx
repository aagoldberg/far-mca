import { getCampaign, getIPFSMetadata } from '../../../../../lib/subgraph';
import { getClient } from '../../../../../lib/apollo';
import { gql } from '@apollo/client';
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { formatUnits } from 'viem';

export const runtime = 'edge';

const GET_CAMPAIGN_METADATA = gql`
  query GetCampaignMetadata($id: ID!) {
    campaign(id: $id) {
      id
      metadataCID
    }
  }
`;

async function getIPFSMetadata(cid: string): Promise<{ title: string; description: string; image: string; } | null> {
    if (!cid) return null;
    try {
        const url = `https://ipfs.io/ipfs/${cid}`;
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch {
        return null;
    }
}

function formatIpfsUrl(ipfsUrl: string): string {
    const gateway = 'https://gateway.pinata.cloud/ipfs/';
    if (!ipfsUrl) return '';
    if (ipfsUrl.startsWith('http')) {
        return ipfsUrl;
    }
    if (ipfsUrl.startsWith('ipfs://')) {
        return `${gateway}${ipfsUrl.substring(7)}`;
    }
    return `${gateway}${ipfsUrl}`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            return new Response('Campaign ID is required', { status: 400 });
        }
        
        const client = getClient();
        await client.query({
            query: GET_CAMPAIGN_METADATA,
            variables: { id },
        });

        // 1. Fetch campaign details from the subgraph
        const campaign = await getCampaign(id);

        if (!campaign || !campaign.metadataURI) {
          return new Response('Campaign not found', { status: 404 });
        }

        // 2. Fetch metadata from IPFS
        const metadata = await getIPFSMetadata(campaign.metadataURI);
        if (!metadata) {
          return new Response('Metadata not found', { status: 404 });
        }

        const imageUrl = formatIpfsUrl(metadata.image);

        console.log(`Fetching OG image from: ${imageUrl}`);
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
            const errorBody = await imageResponse.text();
            console.error(`Failed to fetch image from gateway. Status: ${imageResponse.status}. Body: ${errorBody.slice(0, 500)}`);
            throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }

        const contentType = imageResponse.headers.get('content-type');
        if (!contentType?.startsWith('image/')) {
            console.error(`URL did not return an image. Content-Type: ${contentType}`);
            throw new Error('Invalid content type for image');
        }

        await imageResponse.arrayBuffer();

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'white',
                    }}
                >
                    {/* Background */}
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Main Content */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                width: '80%',
                            }}
                        >
                            {/* Image */}
                            <img 
                                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${metadata.image.replace('ipfs://', '')}`} 
                                alt={metadata.title} 
                                width={500} 
                                height={262}
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '20px',
                                    marginBottom: '30px',
                                    border: '5px solid #f3f4f6'
                                }}
                            />

                            {/* Title */}
                            <h1
                                style={{
                                    fontSize: '60px',
                                    fontWeight: 700,
                                    color: '#1f2937',
                                    margin: '0',
                                    lineHeight: '1.2'
                                }}
                            >
                                {metadata.title}
                            </h1>

                            {/* Raised Amount */}
                            <p 
                                style={{
                                    fontSize: '32px',
                                    color: '#4b5563',
                                    marginTop: '20px'
                                }}
                            >
                                ${Number(formatUnits(BigInt(campaign.actualBalance || campaign.totalRaised), 6)).toLocaleString()} Raised
                            </p>

                        </div>

                        {/* Footer */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '30px',
                                fontSize: '24px',
                                color: '#6b7280'
                            }}
                        >
                            Created by {campaign.creator.substring(0,6)}...{campaign.creator.substring(campaign.creator.length - 4)} on everybit
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error(errorMessage);
        return new Response(`Failed to generate the image: ${errorMessage}`, {
            status: 500,
        });
    }
} 