import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});
const neynarClient = new NeynarAPIClient(config);

/**
 * Create a signer for an existing Farcaster account
 * This allows users who linked existing Farcaster accounts to update their profiles
 */
export async function POST(request: NextRequest) {
  try {
    const { fid } = await request.json();

    if (!fid) {
      return NextResponse.json(
        { error: 'FID required' },
        { status: 400 }
      );
    }

    console.log('[Farcaster] Creating signer for FID:', fid);

    // Create a signer for this FID
    const signerResponse = await neynarClient.createSigner();

    if (!signerResponse) {
      throw new Error('Failed to create signer');
    }

    console.log('[Farcaster] Signer created:', signerResponse.signer_uuid);

    return NextResponse.json({
      success: true,
      signer_uuid: signerResponse.signer_uuid,
      public_key: signerResponse.public_key,
      signer_approval_url: signerResponse.signer_approval_url,
      status: signerResponse.status,
    });

  } catch (error: any) {
    console.error('[Farcaster] Signer creation error:', error);

    if (error.response?.data) {
      return NextResponse.json(
        { error: error.response.data.message || 'Failed to create signer' },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create signer' },
      { status: 500 }
    );
  }
}
