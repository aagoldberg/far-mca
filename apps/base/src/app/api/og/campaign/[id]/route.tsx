import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { formatUnits } from 'viem';

export const runtime = 'edge';

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

async function getIPFSMetadata(cid: string): Promise<{ title: string; description: string; image: string; } | null> {
    if (!cid) return null;
    try {
        const url = `${IPFS_GATEWAY}${cid.replace('ipfs://', '')}`;
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
    if (!ipfsUrl) return '';
    if (ipfsUrl.startsWith('http')) {
        return ipfsUrl;
    }
    if (ipfsUrl.startsWith('ipfs://')) {
        return `${IPFS_GATEWAY}${ipfsUrl.substring(7)}`;
    }
    return `${IPFS_GATEWAY}${ipfsUrl}`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) {
            return new Response('Campaign ID is required', { status: 400 });
        }

        const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
        if (!subgraphUrl) {
            return new Response('Subgraph not configured', { status: 500 });
        }

        // 1. Fetch campaign details from the subgraph
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
                            actualBalance
                        }
                    }
                `,
                variables: { campaignId: id },
            }),
        });

        if (!response.ok) {
            return new Response('Failed to fetch campaign', { status: 500 });
        }

        const data = await response.json();
        const campaign = data?.data?.campaigns?.[0];

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

        // Calculate funding percentage
        const goalAmount = Number(formatUnits(BigInt(campaign.goalAmount || 1), 6));
        const raisedAmount = Number(formatUnits(BigInt(campaign.actualBalance || campaign.totalRaised), 6));
        const percentFunded = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#f9fafb',
                        padding: '60px',
                    }}
                >
                    {/* Card Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {/* Campaign Image */}
                        <div
                            style={{
                                width: '100%',
                                height: '340px',
                                overflow: 'hidden',
                                display: 'flex',
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={metadata.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>

                        {/* Content Area */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '40px 50px',
                                flex: 1,
                                justifyContent: 'space-between',
                            }}
                        >
                            {/* Title */}
                            <h1
                                style={{
                                    fontSize: '48px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    margin: '0 0 20px 0',
                                    lineHeight: '1.2',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {metadata.title}
                            </h1>

                            {/* Bottom Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Borrower Info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '20px', color: '#6b7280' }}>
                                        Borrower:
                                    </span>
                                    <span style={{ fontSize: '20px', color: '#111827', fontWeight: 500 }}>
                                        {campaign.creator.substring(0, 6)}...{campaign.creator.substring(campaign.creator.length - 4)}
                                    </span>
                                </div>

                                {/* Progress Section */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontSize: '20px', color: '#6b7280' }}>
                                            Progress:
                                        </span>
                                        <span style={{ fontSize: '32px', color: '#10b981', fontWeight: 700 }}>
                                            {percentFunded}% funded
                                        </span>
                                    </div>
                                    {/* Progress Bar */}
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '12px',
                                            backgroundColor: '#e5e7eb',
                                            borderRadius: '6px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${percentFunded}%`,
                                                height: '100%',
                                                backgroundColor: '#10b981',
                                                borderRadius: '6px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Branding */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '20px',
                                backgroundColor: '#f9fafb',
                                borderTop: '1px solid #e5e7eb',
                            }}
                        >
                            <span style={{ fontSize: '18px', color: '#6b7280', fontWeight: 500 }}>
                                everybit • Together, we build stronger communities
                            </span>
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