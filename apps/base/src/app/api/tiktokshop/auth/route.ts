import { NextRequest, NextResponse } from 'next/server';
import { TikTokShopClient } from '@/lib/tiktokshop-client/index';

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
    if (!process.env.TIKTOK_SHOP_APP_KEY || !process.env.TIKTOK_SHOP_APP_SECRET) {
      console.error('Missing TikTok Shop environment variables');
      return NextResponse.json(
        { error: 'TikTok Shop integration not configured' },
        { status: 500 }
      );
    }

    const tiktokShopClient = new TikTokShopClient({
      appKey: process.env.TIKTOK_SHOP_APP_KEY,
      appSecret: process.env.TIKTOK_SHOP_APP_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/tiktokshop/callback?wallet=${encodeURIComponent(wallet)}`
    });

    // Generate state parameter for CSRF protection
    const state = `${wallet}-${Date.now()}`;
    const authUrl = tiktokShopClient.getAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('TikTok Shop auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
