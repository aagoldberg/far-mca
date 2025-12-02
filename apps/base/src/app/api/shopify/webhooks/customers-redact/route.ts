import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Shopify GDPR Webhook: customers/redact
 *
 * Called when a store owner requests deletion of customer data,
 * or when a customer requests to be forgotten (GDPR "right to be forgotten").
 *
 * Since we only store merchant-level data (not individual customer data),
 * we typically have nothing to delete here.
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
      console.error('[Shopify Webhook] Invalid HMAC signature for customers/redact');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    console.log('[Shopify Webhook] customers/redact received:', {
      shop_domain: payload.shop_domain,
      customer: payload.customer?.email || 'unknown',
      orders_to_redact: payload.orders_to_redact?.length || 0,
    });

    // LendFriend does not store individual customer data.
    // We only store merchant-level revenue aggregates (totals, counts).
    // Therefore, there is no customer-specific data to redact.

    // Log for compliance tracking
    console.log('[Shopify Webhook] customers/redact: No customer data stored. Redaction acknowledged.');

    // Shopify expects a 200 response to acknowledge receipt
    return NextResponse.json({
      message: 'Redaction request acknowledged. LendFriend does not store individual customer data.',
      redacted: true
    });

  } catch (error) {
    console.error('[Shopify Webhook] Error processing customers/redact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
