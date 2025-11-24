import { NextRequest, NextResponse } from 'next/server';
import { TikTokShopClient } from '@/lib/tiktokshop-client/index';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const wallet = searchParams.get('wallet');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('TikTok Shop OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent(errorDescription || error)}`
      );
    }

    if (!code || !wallet) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=Missing required parameters`
      );
    }

    // Validate environment variables
    if (!process.env.TIKTOK_SHOP_APP_KEY || !process.env.TIKTOK_SHOP_APP_SECRET) {
      console.error('Missing TikTok Shop environment variables');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=TikTok Shop not configured`
      );
    }

    const tiktokShopClient = new TikTokShopClient({
      appKey: process.env.TIKTOK_SHOP_APP_KEY,
      appSecret: process.env.TIKTOK_SHOP_APP_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/tiktokshop/callback`
    });

    // Exchange authorization code for access token
    const session = await tiktokShopClient.exchangeCodeForToken(code);

    // Check if seller has active shop
    const hasShop = await tiktokShopClient.hasActiveShop(session.access_token);

    if (!hasShop) {
      console.warn('[TikTok Shop] User has no active shop');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent(
          'No active TikTok Shop found. Please set up your shop first.'
        )}`
      );
    }

    // Fetch revenue data for the last 90 days
    const revenueData = await tiktokShopClient.getRevenueData(session, 90);

    // Get shop information
    const shops = await tiktokShopClient.getAuthorizedShops(session.access_token);
    const primaryShop = shops[0];

    // Store connection in Supabase
    const { data: connection, error: dbError } = await supabase
      .from('business_connections')
      .upsert({
        wallet_address: wallet.toLowerCase(),
        platform: 'tiktokshop',
        platform_user_id: session.open_id,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        revenue_data: {
          totalRevenue: revenueData.totalRevenue,
          orderCount: revenueData.orderCount,
          affiliateCommission: revenueData.affiliateCommission,
          averageOrderValue: revenueData.averageOrderValue,
          periodDays: revenueData.periodDays,
          currency: revenueData.currency,
          shopRating: revenueData.shopRating,
          itemsSoldCount: revenueData.itemsSoldCount,
        },
        metadata: {
          seller_name: session.seller_name,
          seller_base_region: session.seller_base_region,
          shop_id: session.shop_id,
          shop_cipher: session.shop_cipher,
          shop_name: primaryShop.shop_name,
          shop_url: `https://www.tiktok.com/@${primaryShop.shop_name}`,
          seller_type: primaryShop.seller_type,
          token_expire_in: session.access_token_expire_in,
        },
        last_synced_at: new Date().toISOString(),
        is_active: true,
      }, {
        onConflict: 'wallet_address,platform,platform_user_id'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent('Failed to save connection')}`
      );
    }

    console.log('[TikTok Shop] Successfully connected:', {
      wallet: wallet.toLowerCase(),
      open_id: session.open_id,
      seller_name: session.seller_name,
      shop_name: primaryShop.shop_name,
      totalRevenue: revenueData.totalRevenue,
      orderCount: revenueData.orderCount,
    });

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?tiktokshop_connected=true`
    );
  } catch (error) {
    console.error('TikTok Shop callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to connect TikTok Shop'
      )}`
    );
  }
}
