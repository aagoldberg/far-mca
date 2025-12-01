import { NextRequest, NextResponse } from 'next/server';
import { StripeClient } from '@/lib/stripe-client/index';
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
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('Stripe OAuth error:', error, errorDescription);
      const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
      errorUrl.searchParams.set('platform', 'stripe');
      errorUrl.searchParams.set('error', errorDescription || error);
      return NextResponse.redirect(errorUrl.toString());
    }

    if (!code || !state) {
      const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
      errorUrl.searchParams.set('platform', 'stripe');
      errorUrl.searchParams.set('error', 'Missing required parameters');
      return NextResponse.redirect(errorUrl.toString());
    }

    // Parse state parameter to extract wallet address
    let wallet: string | null = null;
    try {
      const stateData = JSON.parse(state);
      wallet = stateData.wallet;
    } catch {
      // Fallback for old format: "wallet-timestamp"
      wallet = state.split('-')[0];
    }

    if (!wallet) {
      const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
      errorUrl.searchParams.set('platform', 'stripe');
      errorUrl.searchParams.set('error', 'Invalid state parameter');
      return NextResponse.redirect(errorUrl.toString());
    }

    // Validate environment variables
    if (!process.env.STRIPE_CLIENT_ID || !process.env.STRIPE_CLIENT_SECRET) {
      console.error('Missing Stripe environment variables');
      const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
      errorUrl.searchParams.set('platform', 'stripe');
      errorUrl.searchParams.set('error', 'Stripe not configured');
      return NextResponse.redirect(errorUrl.toString());
    }

    const stripeClient = new StripeClient({
      clientId: process.env.STRIPE_CLIENT_ID,
      clientSecret: process.env.STRIPE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/callback`
    });

    // Exchange authorization code for access token
    const session = await stripeClient.exchangeCodeForToken(code);

    // Try to fetch revenue data (may fail for some accounts)
    let revenueData = {
      totalRevenue: 0,
      chargeCount: 0,
      successfulChargeCount: 0,
      periodDays: 90,
      currency: 'usd',
      recurringRevenue: 0,
      successRate: 0,
    };
    let dataAccessError = false;

    try {
      revenueData = await stripeClient.getRevenueData(session, 90);
    } catch (apiError: any) {
      console.warn('[Stripe] Could not fetch revenue data:', apiError.message);
      dataAccessError = true;
    }

    // Calculate average charge amount
    const averageChargeAmount = revenueData.successfulChargeCount > 0
      ? revenueData.totalRevenue / revenueData.successfulChargeCount
      : 0;

    // Try to store connection in Supabase (non-fatal)
    try {
      const { error: dbError } = await getSupabaseClient()
        .from('business_connections')
        .upsert({
          wallet_address: wallet.toLowerCase(),
          platform: 'stripe',
          platform_user_id: session.stripe_user_id,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          revenue_data: {
            totalRevenue: revenueData.totalRevenue,
            chargeCount: revenueData.chargeCount,
            successfulChargeCount: revenueData.successfulChargeCount,
            periodDays: revenueData.periodDays,
            currency: revenueData.currency,
            averageChargeAmount,
            recurringRevenue: revenueData.recurringRevenue,
            successRate: revenueData.successRate,
          },
          metadata: {
            scope: session.scope,
            token_type: session.token_type,
          },
          last_synced_at: new Date().toISOString(),
          is_active: true,
        }, {
          onConflict: 'wallet_address,platform,platform_user_id'
        });

      if (dbError) {
        console.warn('[Stripe] Database error (non-fatal):', dbError);
      } else {
        console.log('[Stripe] ✓ Connection stored:', {
          wallet: wallet.toLowerCase(),
          stripe_user_id: session.stripe_user_id,
          totalRevenue: revenueData.totalRevenue,
        });
      }
    } catch (dbErr) {
      console.warn('[Stripe] Database storage failed (non-fatal):', dbErr);
    }

    // Calculate credit score
    let creditScoreData;
    try {
      const scoreResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/credit-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: wallet }),
      });
      if (scoreResponse.ok) {
        creditScoreData = await scoreResponse.json();
      }
    } catch (scoreErr) {
      console.warn('[Stripe] Credit score calculation failed:', scoreErr);
    }

    // Redirect to success page
    const redirectUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
    redirectUrl.searchParams.set('platform', 'stripe');
    redirectUrl.searchParams.set('score', creditScoreData?.score?.toString() || '0');
    if (dataAccessError) {
      redirectUrl.searchParams.set('dataAccessPending', 'true');
    }

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('[Stripe] Callback error:', error);
    const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
    errorUrl.searchParams.set('platform', 'stripe');
    errorUrl.searchParams.set('error', error instanceof Error ? error.message : 'Failed to connect Stripe');
    return NextResponse.redirect(errorUrl.toString());
  }
}
