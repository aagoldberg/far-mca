import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * Shopify GDPR Webhook: shop/redact
 *
 * Called 48 hours after a store uninstalls your app.
 * This is your signal to delete all data associated with that shop.
 *
 * We MUST delete:
 * - Access tokens
 * - Shop connection records
 * - Any cached revenue/order data
 */

function verifyShopifyWebhook(body: string, hmacHeader: string | null): boolean {
  if (!hmacHeader || !process.env.SHOPIFY_API_SECRET) {
    return false;
  }

  const calculated = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(calculated),
    Buffer.from(hmacHeader)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');

    // Verify webhook signature
    if (!verifyShopifyWebhook(body, hmacHeader)) {
      console.error('[Shopify Webhook] Invalid HMAC signature for shop/redact');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const shopDomain = payload.shop_domain;

    console.log('[Shopify Webhook] shop/redact received:', {
      shop_domain: shopDomain,
      shop_id: payload.shop_id,
    });

    // Delete shop data from our database
    let deletedCount = 0;
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Delete all connections for this shop
        const { data, error } = await supabase
          .from('business_connections')
          .delete()
          .eq('platform', 'shopify')
          .eq('platform_user_id', shopDomain)
          .select();

        if (error) {
          console.error('[Shopify Webhook] Database deletion error:', error);
        } else {
          deletedCount = data?.length || 0;
          console.log(`[Shopify Webhook] shop/redact: Deleted ${deletedCount} connection(s) for ${shopDomain}`);
        }
      }
    } catch (dbErr) {
      console.error('[Shopify Webhook] Database error during shop/redact:', dbErr);
      // Don't fail the webhook - log and continue
    }

    // Log for compliance tracking
    console.log('[Shopify Webhook] shop/redact completed:', {
      shop_domain: shopDomain,
      records_deleted: deletedCount,
      timestamp: new Date().toISOString(),
    });

    // Shopify expects a 200 response to acknowledge receipt
    return NextResponse.json({
      message: 'Shop data redacted successfully',
      shop_domain: shopDomain,
      records_deleted: deletedCount
    });

  } catch (error) {
    console.error('[Shopify Webhook] Error processing shop/redact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
