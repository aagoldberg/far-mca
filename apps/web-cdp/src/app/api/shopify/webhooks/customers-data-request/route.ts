import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Shopify GDPR Webhook: customers/data_request
 *
 * Called when a customer requests their data from a store.
 * We must respond with any customer data we have stored.
 *
 * Since we only store merchant-level data (not individual customer data),
 * we typically have nothing to return here.
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
      console.error('[Shopify Webhook] Invalid HMAC signature for customers/data_request');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    console.log('[Shopify Webhook] customers/data_request received:', {
      shop_domain: payload.shop_domain,
      customer: payload.customer?.email || 'unknown',
      orders_requested: payload.orders_requested?.length || 0,
    });

    // LendFriend does not store individual customer data.
    // We only store merchant-level revenue aggregates.
    // Therefore, we have no customer data to return.

    // Log for compliance tracking
    console.log('[Shopify Webhook] customers/data_request: No customer data stored. Request acknowledged.');

    // Shopify expects a 200 response to acknowledge receipt
    return NextResponse.json({
      message: 'Data request acknowledged. LendFriend does not store individual customer data.',
      customer_data: null
    });

  } catch (error) {
    console.error('[Shopify Webhook] Error processing customers/data_request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
