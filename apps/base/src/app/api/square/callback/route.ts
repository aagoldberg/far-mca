import { NextRequest, NextResponse } from 'next/server';
import { SquareClient } from '@/lib/square-client/index';
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
      console.error('Square OAuth error:', error, errorDescription);
      const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
      errorUrl.searchParams.set('platform', 'square');
      errorUrl.searchParams.set('error', errorDescription || error);
      return NextResponse.redirect(errorUrl.toString());
    }

    if (!code || !state) {
      const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
      errorUrl.searchParams.set('platform', 'square');
      errorUrl.searchParams.set('error', 'Missing required parameters');
      return NextResponse.redirect(errorUrl.toString());
    }

    // Parse state parameter to extract wallet address
    let wallet: string | null = null;
    try {
      const stateData = JSON.parse(state);
      wallet = stateData.wallet;
    } catch {
      // Fallback for old format: "wallet-timestamp" or "wallet-draftId-timestamp"
      const stateParts = state.split('-');
      wallet = stateParts[0];
    }

    if (!wallet) {
      const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
      errorUrl.searchParams.set('platform', 'square');
      errorUrl.searchParams.set('error', 'Invalid state parameter');
      return NextResponse.redirect(errorUrl.toString());
    }

    // Validate environment variables
    if (!process.env.SQUARE_APPLICATION_ID || !process.env.SQUARE_APPLICATION_SECRET) {
      console.error('Missing Square environment variables');
      const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
      errorUrl.searchParams.set('platform', 'square');
      errorUrl.searchParams.set('error', 'Square not configured');
      return NextResponse.redirect(errorUrl.toString());
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

    // Try to fetch revenue data (may fail for some accounts)
    let revenueData = {
      totalRevenue: 0,
      paymentCount: 0,
      successfulPaymentCount: 0,
      periodDays: 90,
      currency: 'USD',
      refundRate: 0,
      successRate: 0,
    };
    let dataAccessError = false;

    try {
      revenueData = await squareClient.getRevenueData(session, 90);
    } catch (apiError: any) {
      console.warn('[Square] Could not fetch revenue data:', apiError.message);
      dataAccessError = true;
    }

    // Calculate average payment amount
    const averagePaymentAmount = revenueData.successfulPaymentCount > 0
      ? revenueData.totalRevenue / revenueData.successfulPaymentCount
      : 0;

    // Try to store connection in Supabase (non-fatal)
    try {
      const { error: dbError } = await getSupabaseClient()
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
        });

      if (dbError) {
        console.warn('[Square] Database error (non-fatal):', dbError);
      } else {
        console.log('[Square] ✓ Connection stored:', {
          wallet: wallet.toLowerCase(),
          merchant_id: session.merchant_id,
          totalRevenue: revenueData.totalRevenue,
        });
      }
    } catch (dbErr) {
      console.warn('[Square] Database storage failed (non-fatal):', dbErr);
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
      console.warn('[Square] Credit score calculation failed:', scoreErr);
    }

    // Redirect to success page
    const redirectUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
    redirectUrl.searchParams.set('platform', 'square');
    redirectUrl.searchParams.set('score', creditScoreData?.score?.toString() || '0');
    if (dataAccessError) {
      redirectUrl.searchParams.set('dataAccessPending', 'true');
    }

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('[Square] Callback error:', error);
    const errorUrl = new URL('/connection-success', process.env.NEXT_PUBLIC_APP_URL!);
    errorUrl.searchParams.set('platform', 'square');
    errorUrl.searchParams.set('error', error instanceof Error ? error.message : 'Failed to connect Square');
    return NextResponse.redirect(errorUrl.toString());
  }
}
