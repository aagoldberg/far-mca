import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});
const neynarClient = new NeynarAPIClient(config);

export async function POST(request: NextRequest) {
  try {
    const { username, fid, walletAddress, signature, deadline } = await request.json();

    if (!username || !fid || !walletAddress || !signature || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields: username, fid, walletAddress, signature, deadline' },
        { status: 400 }
      );
    }

    // Validate username format (lowercase alphanumeric, optional hyphens, 1-16 chars)
    if (!/^[a-z0-9][a-z0-9-]{0,15}$/.test(username)) {
      return NextResponse.json(
        { error: 'Invalid username format. Must be 1-16 characters, lowercase letters, numbers, and hyphens only.' },
        { status: 400 }
      );
    }

    console.log('Registering Farcaster account for wallet:', walletAddress);
    console.log('Registration params:', {
      username,
      fid,
      walletAddress,
      deadline,
      signatureLength: signature.length,
      signaturePrefix: signature.substring(0, 10),
    });

    // Register account with Neynar using the signed data and sponsored FID
    const fidResponse = await neynarClient.registerAccount({
      fid,
      signature,
      requestedUserCustodyAddress: walletAddress,
      deadline,
      fname: username, // Pass username as fname (Farcaster name)
    });

    console.log('Farcaster account registered:', {
      fid: fidResponse.fid,
      username,
    });

    return NextResponse.json({
      success: true,
      fid: fidResponse.fid,
      username,
      signer_uuid: fidResponse.signer_uuid,
    });
  } catch (error: any) {
    console.error('Farcaster registration error:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);

    // Handle specific error cases
    if (error.message?.includes('username')) {
      return NextResponse.json(
        { error: 'Username already taken or invalid' },
        { status: 409 }
      );
    }

    if (error.message?.includes('deadline')) {
      return NextResponse.json(
        { error: 'Registration deadline expired. Please try again.' },
        { status: 400 }
      );
    }

    if (error.message?.includes('signature')) {
      return NextResponse.json(
        { error: 'Invalid signature. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to register Farcaster account' },
      { status: 500 }
    );
  }
}
