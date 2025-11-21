import { NextRequest, NextResponse } from 'next/server';
import { StripeClient } from '@/lib/stripe-client/index';
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
      console.error('Stripe OAuth error:', error, errorDescription);
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
    if (!process.env.STRIPE_CLIENT_ID || !process.env.STRIPE_CLIENT_SECRET) {
      console.error('Missing Stripe environment variables');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=Stripe not configured`
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
    const { data: connection, error: dbError } = await supabase
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
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent('Failed to save connection')}`
      );
    }

    console.log('[Stripe] Successfully connected:', {
      wallet: wallet.toLowerCase(),
      stripe_user_id: session.stripe_user_id,
      totalRevenue: revenueData.totalRevenue,
      chargeCount: revenueData.chargeCount,
      recurringRevenue: revenueData.recurringRevenue,
    });

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe_connected=true`
    );
  } catch (error) {
    console.error('Stripe callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to connect Stripe'
      )}`
    );
  }
}
