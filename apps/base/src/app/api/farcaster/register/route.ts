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

    console.log('Farcaster registration response:', fidResponse);

    // registerAccount() automatically creates a signer with approval URL
    const signerResponse = fidResponse.signer || fidResponse.signers?.[0];

    if (!signerResponse || !signerResponse.signer_uuid) {
      throw new Error('No signer returned from registerAccount');
    }

    console.log('Signer from registration:', {
      signer_uuid: signerResponse.signer_uuid,
      status: signerResponse.status,
      has_approval_url: !!signerResponse.signer_approval_url,
    });

    console.log('Farcaster account registered:', {
      fid: fidResponse.fid || fid,
      username,
      signer_uuid: signerResponse.signer_uuid,
    });

    // Store in database for persistent access
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const supabase = getSupabaseAdmin();

      // Use the FID we got from prepare-registration since Neynar doesn't always return it
      const accountFid = fidResponse.fid || fid;

      const { error: dbError } = await supabase
        .from('farcaster_accounts')
        .upsert({
          wallet_address: walletAddress.toLowerCase(),
          fid: accountFid,
          username,
          signer_uuid: signerResponse.signer_uuid,
          public_key: signerResponse.public_key,
          signer_status: signerResponse.status || 'pending_approval',
          signer_approval_url: signerResponse.signer_approval_url,
          last_verified_at: new Date().toISOString(),
        }, {
          onConflict: 'wallet_address',
        });

      if (dbError) {
        console.error('[Farcaster] Database save error:', dbError);
        // Don't fail the request - database is just a cache
        console.warn('[Farcaster] Continuing without database save');
      } else {
        console.log('[Farcaster] ✓ Saved to database');
      }
    } catch (dbError) {
      console.error('[Farcaster] Database error:', dbError);
      // Don't fail the request - database is just a cache
    }

    return NextResponse.json({
      success: true,
      fid: fidResponse.fid || fid,
      username,
      signer_uuid: signerResponse.signer_uuid,
      signer_approval_url: signerResponse.signer_approval_url,
      signer_status: signerResponse.status,
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
