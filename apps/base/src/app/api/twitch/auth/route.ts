import { NextRequest, NextResponse } from 'next/server';
import { TwitchClient } from '@/lib/twitch-client/index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
      console.error('Missing Twitch OAuth environment variables');
      return NextResponse.json(
        { error: 'Twitch integration not configured' },
        { status: 500 }
      );
    }

    const twitchClient = new TwitchClient({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/twitch/callback?wallet=${encodeURIComponent(wallet)}`
    });

    // Generate state parameter for CSRF protection
    const state = `${wallet}-${Date.now()}`;
    const authUrl = twitchClient.getAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Twitch auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
