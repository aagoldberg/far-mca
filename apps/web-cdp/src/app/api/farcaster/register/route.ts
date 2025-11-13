import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});
const neynarClient = new NeynarAPIClient(config);

export async function POST(request: NextRequest) {
  try {
    const { username, walletAddress, signature, deadline } = await request.json();

    if (!username || !walletAddress || !signature || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields: username, walletAddress, signature, deadline' },
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

    // Step 1: Claim an FID for the new user
    console.log('Step 1: Claiming FID...');
    const fidResponse = await neynarClient.registerAccount(username, {
      signature,
      fid: 0, // Will be assigned by Neynar
      requestedUserCustodyAddress: walletAddress as `0x${string}`,
      deadline,
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

    return NextResponse.json(
      { error: error.message || 'Failed to register Farcaster account' },
      { status: 500 }
    );
  }
}
