import { NextRequest, NextResponse } from 'next/server';
import { TwitchClient } from '@/lib/twitch-client/index';
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
      console.error('Twitch OAuth error:', error, errorDescription);
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
    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
      console.error('Missing Twitch OAuth environment variables');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=Twitch not configured`
      );
    }

    const twitchClient = new TwitchClient({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/twitch/callback`
    });

    // Exchange authorization code for access token
    const session = await twitchClient.exchangeCodeForToken(code);

    // Fetch user and revenue data (ESTIMATED)
    const revenueData = await twitchClient.getRevenueData(session);

    // Get user data for metadata
    const userData = await twitchClient.getUserData(session.access_token);

    // Check monetization status
    const isMonetized = userData.broadcaster_type === 'partner' || userData.broadcaster_type === 'affiliate';

    if (!isMonetized) {
      console.warn('[Twitch] User is not monetized:', userData.login);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent(
          'Your Twitch channel must be a Partner or Affiliate to connect'
        )}`
      );
    }

    // Store connection in Supabase
    const { data: connection, error: dbError } = await supabase
      .from('business_connections')
      .upsert({
        wallet_address: wallet.toLowerCase(),
        platform: 'twitch',
        platform_user_id: userData.id,
        access_token: session.access_token,
        refresh_token: session.refresh_token || null,
        revenue_data: {
          totalRevenue: revenueData.estimatedRevenue,
          isEstimated: true, // Important: Flag this as estimated
          revenueConfidence: revenueData.revenueConfidence,
          subscriberCount: revenueData.subscriberCount,
          subscriberTier1: revenueData.subscriberTier1,
          subscriberTier2: revenueData.subscriberTier2,
          subscriberTier3: revenueData.subscriberTier3,
          followerCount: revenueData.followerCount,
          totalViews: revenueData.totalViews,
          broadcasterType: revenueData.broadcasterType,
          periodDays: revenueData.periodDays,
          currency: revenueData.currency,
          channelAgeDays: revenueData.channelAgeDays,
        },
        metadata: {
          username: userData.login,
          display_name: userData.display_name,
          profile_image_url: userData.profile_image_url,
          channel_url: `https://twitch.tv/${userData.login}`,
          broadcaster_type: userData.broadcaster_type,
          description: userData.description,
          view_count: userData.view_count,
          created_at: userData.created_at,
          token_scope: session.scope,
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

    console.log('[Twitch] Successfully connected:', {
      wallet: wallet.toLowerCase(),
      user_id: userData.id,
      username: userData.login,
      broadcaster_type: userData.broadcaster_type,
      estimatedRevenue: revenueData.estimatedRevenue,
      subscriberCount: revenueData.subscriberCount,
      revenueConfidence: revenueData.revenueConfidence,
    });

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?twitch_connected=true`
    );
  } catch (error) {
    console.error('Twitch callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to connect Twitch'
      )}`
    );
  }
}
