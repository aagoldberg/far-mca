import { NextRequest, NextResponse } from 'next/server';
import { YouTubeClient } from '@/lib/youtube-client/index';

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
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth environment variables');
      return NextResponse.json(
        { error: 'YouTube integration not configured' },
        { status: 500 }
      );
    }

    const youtubeClient = new YouTubeClient({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/youtube/callback?wallet=${encodeURIComponent(wallet)}`
    });

    // Generate state parameter for CSRF protection
    const state = `${wallet}-${Date.now()}`;
    const authUrl = youtubeClient.getAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('YouTube auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
