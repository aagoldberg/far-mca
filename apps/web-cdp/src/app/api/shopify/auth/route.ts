import { NextRequest, NextResponse } from 'next/server';
import { ShopifyClient } from '@/lib/shopify-client/index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get('shop');
    const wallet = searchParams.get('wallet');

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop parameter is required' },
        { status: 400 }
      );
    }

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate shop domain format
    if (!shop.includes('.myshopify.com')) {
      return NextResponse.json(
        { error: 'Invalid shop domain format' },
        { status: 400 }
      );
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`;
    console.log('[Shopify Auth] Config:', {
      apiKey: process.env.SHOPIFY_API_KEY?.substring(0, 8) + '...',
      redirectUri,
      shop,
    });

    const shopifyClient = new ShopifyClient({
      apiKey: process.env.SHOPIFY_API_KEY || '',
      apiSecret: process.env.SHOPIFY_API_SECRET || '',
      scopes: ['read_orders', 'read_products', 'read_locations'],
      redirectUri,
    });

    // Encode wallet in state parameter (Shopify returns this unchanged in callback)
    const state = JSON.stringify({ wallet, nonce: 'credit-scoring' });
    const authUrl = shopifyClient.getAuthUrl(shop, state);

    console.log('[Shopify Auth] Generated URL:', authUrl);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Shopify auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
