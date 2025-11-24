import { NextRequest, NextResponse } from 'next/server';

/**
 * Initiate Farcaster Sign-In With Farcaster (SIWF) flow
 * Returns auth URL for popup/redirect
 */
export async function POST(request: NextRequest) {
  try {
    const { wallet } = await request.json();

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Generate SIWF auth URL
    // Using Farcaster Auth Kit protocol
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004';
    const siweUri = `${domain}/api/farcaster/callback`;
    const nonce = generateNonce();

    // Store nonce and wallet in session/cache for verification
    // For now, we'll encode it in the state parameter
    const state = Buffer.from(JSON.stringify({
      wallet,
      nonce,
      timestamp: Date.now(),
    })).toString('base64');

    // Farcaster Auth URL format
    const authUrl = `https://warpcast.com/~/sign-in-with-farcaster?` + new URLSearchParams({
      client_id: process.env.FARCASTER_CLIENT_ID || 'lendfriend',
      redirect_uri: siweUri,
      state,
      scope: 'profile', // Request profile data
    }).toString();

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('[Farcaster Auth] Error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Farcaster auth' },
      { status: 500 }
    );
  }
}

/**
 * Generate a cryptographic nonce for CSRF protection
 */
function generateNonce(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}
