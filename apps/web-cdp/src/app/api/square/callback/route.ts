import { NextRequest, NextResponse } from 'next/server';
import { SquareClient } from '@/lib/square-client/index';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('Square OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=${encodeURIComponent(errorDescription || error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=Missing required parameters`
      );
    }

    // Extract wallet address and draft ID from state parameter
    // State format: "wallet-timestamp" or "wallet-draftId-timestamp"
    const stateParts = state.split('-');
    const wallet = stateParts[0];
    const draftId = stateParts.length === 3 ? stateParts[1] : null; // Draft ID if present

    if (!wallet) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=Invalid state parameter`
      );
    }

    // Validate environment variables
    if (!process.env.SQUARE_APPLICATION_ID || !process.env.SQUARE_APPLICATION_SECRET) {
      console.error('Missing Square environment variables');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=Square not configured`
      );
    }

    const environment = (process.env.SQUARE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';

    const squareClient = new SquareClient({
      applicationId: process.env.SQUARE_APPLICATION_ID,
      applicationSecret: process.env.SQUARE_APPLICATION_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/square/callback`,
      environment,
    });

    // Exchange authorization code for access token
    const session = await squareClient.exchangeCodeForToken(code);

    // Fetch revenue data for the last 90 days
    const revenueData = await squareClient.getRevenueData(session, 90);

    // Calculate average payment amount
    const averagePaymentAmount = revenueData.successfulPaymentCount > 0
      ? revenueData.totalRevenue / revenueData.successfulPaymentCount
      : 0;

    // Store connection in Supabase
    const { data: connection, error: dbError } = await supabase
      .from('business_connections')
      .upsert({
        wallet_address: wallet.toLowerCase(),
        platform: 'square',
        platform_user_id: session.merchant_id,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        revenue_data: {
          totalRevenue: revenueData.totalRevenue,
          paymentCount: revenueData.paymentCount,
          successfulPaymentCount: revenueData.successfulPaymentCount,
          periodDays: revenueData.periodDays,
          currency: revenueData.currency,
          averagePaymentAmount,
          refundRate: revenueData.refundRate,
          successRate: revenueData.successRate,
        },
        metadata: {
          token_type: session.token_type,
          short_lived: session.short_lived,
          environment,
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

    console.log('[Square] Successfully connected:', {
      wallet: wallet.toLowerCase(),
      merchant_id: session.merchant_id,
      totalRevenue: revenueData.totalRevenue,
      paymentCount: revenueData.paymentCount,
      successRate: revenueData.successRate,
    });

    // Redirect based on whether this is part of loan creation flow or standalone
    if (draftId) {
      // Loan creation flow: redirect to wizard Step 3 (eligibility)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/create-loan?draft=${draftId}&step=3`
      );
    } else {
      // Standalone flow: redirect to credit page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/credit?square_connected=true`
      );
    }
  } catch (error) {
    console.error('Square callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/credit?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to connect Square'
      )}`
    );
  }
}
