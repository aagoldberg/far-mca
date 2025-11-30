import { NextRequest, NextResponse } from 'next/server';
import { ShopifyClient } from '@/lib/shopify-client/index';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors when env vars aren't available
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const shop = searchParams.get('shop');
    const state = searchParams.get('state');
    const walletAddress = searchParams.get('wallet'); // Pass wallet in state or query

    if (!code || !shop) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify state parameter for security
    if (state !== 'credit-scoring') {
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const shopifyClient = new ShopifyClient({
      apiKey: process.env.SHOPIFY_API_KEY || '',
      apiSecret: process.env.SHOPIFY_API_SECRET || '',
      scopes: ['read_orders', 'read_customers'],
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`
    });

    // Exchange code for access token
    const session = await shopifyClient.exchangeCodeForToken(shop, code);

    // Fetch revenue data
    const revenueData = await shopifyClient.getRevenueData(session, 90); // 90 days

    // Calculate average order value
    const averageOrderValue = revenueData.orderCount > 0
      ? revenueData.totalRevenue / revenueData.orderCount
      : 0;

    // Store connection in Supabase
    const { data: connection, error: dbError } = await getSupabaseClient()
      .from('business_connections')
      .upsert({
        wallet_address: walletAddress.toLowerCase(),
        platform: 'shopify',
        platform_user_id: shop,
        access_token: session.accessToken, // TODO: Encrypt in production
        revenue_data: {
          totalRevenue: revenueData.totalRevenue,
          orderCount: revenueData.orderCount,
          periodDays: revenueData.periodDays,
          currency: revenueData.currency,
          averageOrderValue,
        },
        metadata: {
          shop_domain: shop,
          scope: session.scope,
        },
        last_synced_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Shopify] Database error:', dbError);
      throw new Error('Failed to store connection');
    }

    console.log('[Shopify] ✓ Connection stored:', {
      wallet: walletAddress,
      shop,
      revenue: revenueData.totalRevenue,
    });

    // Calculate credit score for this wallet
    const scoreResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/credit-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
      })
    });

    let creditScoreData;
    if (scoreResponse.ok) {
      creditScoreData = await scoreResponse.json();
    }

    // Redirect to success page with wallet address
    const redirectUrl = new URL('/account-settings', process.env.NEXT_PUBLIC_APP_URL!);
    redirectUrl.searchParams.set('shopifyConnected', 'true');
    redirectUrl.searchParams.set('score', creditScoreData?.score?.toString() || '0');

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('[Shopify] Callback error:', error);

    // Redirect to settings with error
    const errorUrl = new URL('/account-settings', process.env.NEXT_PUBLIC_APP_URL!);
    errorUrl.searchParams.set('error', 'shopify_connection_failed');
    errorUrl.searchParams.set('message', error instanceof Error ? error.message : 'Unknown error');

    return NextResponse.redirect(errorUrl.toString());
  }
}
