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

    if (!code || !shop) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Parse state parameter to extract wallet address
    let walletAddress: string | null = null;
    try {
      if (state) {
        const stateData = JSON.parse(state);
        walletAddress = stateData.wallet;
        // Verify nonce for security
        if (stateData.nonce !== 'credit-scoring') {
          return NextResponse.json(
            { error: 'Invalid state parameter' },
            { status: 400 }
          );
        }
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid state parameter format' },
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

    // Try to fetch revenue data (may fail if protected customer data access not approved)
    let revenueData = {
      totalRevenue: 0,
      orderCount: 0,
      periodDays: 90,
      currency: 'USD',
    };
    let dataAccessError = false;

    try {
      revenueData = await shopifyClient.getRevenueData(session, 90); // 90 days
    } catch (apiError: any) {
      // Log but don't fail - protected customer data may not be approved yet
      console.warn('[Shopify] Could not fetch revenue data (protected customer data access may be required):', apiError.message);
      dataAccessError = true;
    }

    // Calculate average order value
    const averageOrderValue = revenueData.orderCount > 0
      ? revenueData.totalRevenue / revenueData.orderCount
      : 0;

    // Try to store connection in Supabase (optional - may not have table set up)
    let dbStored = false;
    try {
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
        console.warn('[Shopify] Database error (non-fatal):', dbError);
      } else {
        dbStored = true;
        console.log('[Shopify] ✓ Connection stored:', {
          wallet: walletAddress,
          shop,
          revenue: revenueData.totalRevenue,
        });
      }
    } catch (dbErr) {
      console.warn('[Shopify] Database storage failed (non-fatal):', dbErr);
    }

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

    // Redirect to success page telling user to go back to Mini App
    const redirectUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
    redirectUrl.searchParams.set('platform', 'shopify');
    redirectUrl.searchParams.set('score', creditScoreData?.score?.toString() || '0');
    if (dataAccessError) {
      redirectUrl.searchParams.set('dataAccessPending', 'true');
    }

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('[Shopify] Callback error:', error);

    // Redirect to error page
    const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
    errorUrl.searchParams.set('platform', 'shopify');
    errorUrl.searchParams.set('error', error instanceof Error ? error.message : 'Connection failed');

    return NextResponse.redirect(errorUrl.toString());
  }
}
