import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ShopifyClient } from '@/lib/shopify-client/index';
import { verifyIdentity, IdentitySource } from '@/lib/identity-verification';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /api/verify-identity
 *
 * Cross-reference identity across connected platforms (Shopify, etc.)
 * Body: { walletAddress: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Valid walletAddress is required' },
        { status: 400 }
      );
    }

    const wallet = walletAddress.toLowerCase();
    const sources: IdentitySource[] = [];

    // 1. Get self-reported profile data
    const { data: profile } = await supabase
      .from('borrower_profiles')
      .select('owner_full_name, owner_email')
      .eq('wallet_address', wallet)
      .single();

    if (profile?.owner_full_name) {
      sources.push({
        platform: 'profile',
        name: profile.owner_full_name,
        email: profile.owner_email || null,
      });
    }

    // 2. Get connected platforms
    const { data: connections } = await supabase
      .from('business_connections')
      .select('platform, platform_user_id, access_token, metadata')
      .eq('wallet_address', wallet)
      .eq('is_active', true);

    // 3. Fetch Shopify owner data if connected
    const shopifyConn = connections?.find(c => c.platform === 'shopify');
    if (shopifyConn) {
      try {
        const shopifyClient = new ShopifyClient({
          apiKey: process.env.SHOPIFY_API_KEY || '',
          apiSecret: process.env.SHOPIFY_API_SECRET || '',
          scopes: [],
          redirectUri: '',
        });

        const ownerData = await shopifyClient.getShopOwnerData({
          shop: shopifyConn.platform_user_id,
          accessToken: shopifyConn.access_token,
          scope: '',
        });

        sources.push({
          platform: 'shopify',
          name: ownerData.ownerName,
          email: ownerData.email,
        });
      } catch (err) {
        console.error('[Verify Identity] Shopify fetch failed:', err);
      }
    }

    // 4. Run verification
    const result = verifyIdentity(sources);

    return NextResponse.json({
      walletAddress: wallet,
      ...result,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Verify Identity] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
