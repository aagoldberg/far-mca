import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ShopifyClient } from '@/lib/shopify-client/index';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /api/connections/refresh
 *
 * Re-sync data from all connected platforms for a wallet
 * Body: { walletAddress: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required' },
        { status: 400 }
      );
    }

    // Fetch all active connections for this wallet
    const { data: connections, error } = await supabase
      .from('business_connections')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('is_active', true);

    if (error) {
      console.error('[Refresh] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch connections' },
        { status: 500 }
      );
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No connections to refresh',
        updated: 0,
      });
    }

    const results: Array<{ platform: string; success: boolean; error?: string }> = [];

    for (const conn of connections) {
      try {
        if (conn.platform === 'shopify') {
          // Refresh Shopify data
          const shopifyClient = new ShopifyClient({
            apiKey: process.env.SHOPIFY_API_KEY || '',
            apiSecret: process.env.SHOPIFY_API_SECRET || '',
            scopes: ['read_orders', 'read_products', 'read_locations'],
            redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`,
          });

          const session = {
            shop: conn.platform_user_id,
            accessToken: conn.access_token,
            scope: conn.metadata?.scope || '',
          };

          // Fetch detailed order data for Business Health Score
          // Use 450 days (~15 months) to capture full business tenure for accurate scoring
          const revenueData = await shopifyClient.getDetailedRevenueData(session, 450);
          const averageOrderValue = revenueData.orderCount > 0
            ? revenueData.totalRevenue / revenueData.orderCount
            : 0;

          // Preserve manually set firstOrderDate if it's older than Shopify's data
          // This allows for demo/testing with backdated tenure
          const existingFirstOrderDate = conn.revenue_data?.firstOrderDate;
          const shopifyFirstOrderDate = revenueData.firstOrderDate?.toISOString();
          let effectiveFirstOrderDate = shopifyFirstOrderDate;

          if (existingFirstOrderDate && shopifyFirstOrderDate) {
            const existing = new Date(existingFirstOrderDate);
            const shopify = new Date(shopifyFirstOrderDate);
            // Keep the older date (allows manual backdating for demos)
            if (existing < shopify) {
              effectiveFirstOrderDate = existingFirstOrderDate;
            }
          }

          // Update the connection with fresh data including individual orders
          const { error: updateError } = await supabase
            .from('business_connections')
            .update({
              revenue_data: {
                totalRevenue: revenueData.totalRevenue,
                orderCount: revenueData.orderCount,
                periodDays: revenueData.periodDays,
                currency: revenueData.currency,
                averageOrderValue,
                // Include detailed order data for Business Health Score CV calculations
                orders: revenueData.orders.map(o => ({
                  id: o.id,
                  createdAt: o.createdAt.toISOString(),
                  totalPrice: o.totalPrice,
                  currency: o.currency,
                })),
                firstOrderDate: effectiveFirstOrderDate,
                lastOrderDate: revenueData.lastOrderDate?.toISOString(),
              },
              last_synced_at: new Date().toISOString(),
            })
            .eq('id', conn.id);

          if (updateError) {
            console.error('[Refresh] Failed to update Shopify connection:', updateError);
            results.push({ platform: 'shopify', success: false, error: updateError.message });
          } else {
            console.log('[Refresh] ✓ Shopify data refreshed:', {
              wallet: walletAddress,
              shop: conn.platform_user_id,
              revenue: revenueData.totalRevenue,
              orders: revenueData.orderCount,
            });
            results.push({ platform: 'shopify', success: true });
          }
        }
        // Add other platforms here (Stripe, Square, etc.)
      } catch (platformError: any) {
        console.error(`[Refresh] Error refreshing ${conn.platform}:`, platformError);
        results.push({
          platform: conn.platform,
          success: false,
          error: platformError.message
        });
      }
    }

    // Recalculate credit score
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/credit-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
    } catch (scoreErr) {
      console.warn('[Refresh] Credit score recalculation failed:', scoreErr);
    }

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Refreshed ${successCount} of ${results.length} connections`,
      updated: successCount,
      results,
    });
  } catch (error) {
    console.error('[Refresh] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
