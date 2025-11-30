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
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=${encodeURIComponent(errorDescription || error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=Missing required parameters`
      );
    }

    // Extract wallet address from state parameter
    // State format: "wallet-timestamp"
    const wallet = state.split('-')[0];
    if (!wallet) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=Invalid state parameter`
      );
    }

    // Validate environment variables
    if (!process.env.STRIPE_CLIENT_ID || !process.env.STRIPE_CLIENT_SECRET) {
      console.error('Missing Stripe environment variables');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=Stripe not configured`
      );
    }

    const stripeClient = new StripeClient({
      clientId: process.env.STRIPE_CLIENT_ID,
      clientSecret: process.env.STRIPE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/callback`
    });

    // Exchange authorization code for access token
    const session = await stripeClient.exchangeCodeForToken(code);

    // Fetch revenue data for the last 90 days
    const revenueData = await stripeClient.getRevenueData(session, 90);

    // Calculate average charge amount
    const averageChargeAmount = revenueData.successfulChargeCount > 0
      ? revenueData.totalRevenue / revenueData.successfulChargeCount
      : 0;

    // Store connection in Supabase
    const { data: connection, error: dbError } = await getSupabaseClient()
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
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=${encodeURIComponent('Failed to save connection')}`
      );
    }

    console.log('[Stripe] Successfully connected:', {
      wallet: wallet.toLowerCase(),
      stripe_user_id: session.stripe_user_id,
      totalRevenue: revenueData.totalRevenue,
      chargeCount: revenueData.chargeCount,
      recurringRevenue: revenueData.recurringRevenue,
    });

    // Redirect to credit page with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/credit?stripe_connected=true`
    );
  } catch (error) {
    console.error('Stripe callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to connect Stripe'
      )}`
    );
  }
}
