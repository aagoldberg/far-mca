import { NextRequest, NextResponse } from 'next/server';
import { YouTubeClient } from '@/lib/youtube-client/index';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors when env vars are missing
let supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_KEY || 'placeholder'
    );
  }
  return supabase;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const wallet = searchParams.get('wallet');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('YouTube OAuth error:', error, errorDescription);
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
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth environment variables');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=YouTube not configured`
      );
    }

    const youtubeClient = new YouTubeClient({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/youtube/callback`
    });

    // Exchange authorization code for access token
    const session = await youtubeClient.exchangeCodeForToken(code);

    // Fetch channel and revenue data for the last 90 days
    const revenueData = await youtubeClient.getRevenueData(session, 90);

    // Get channel data for metadata
    const channelData = await youtubeClient.getChannelData(session);

    // Calculate channel age in days
    const channelAgeMs = Date.now() - new Date(channelData.publishedAt).getTime();
    const channelAgeDays = Math.floor(channelAgeMs / (1000 * 60 * 60 * 24));

    // Store connection in Supabase
    const { data: connection, error: dbError } = await getSupabase()
      .from('business_connections')
      .upsert({
        wallet_address: wallet.toLowerCase(),
        platform: 'youtube',
        platform_user_id: channelData.channelId,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        revenue_data: {
          totalRevenue: revenueData.totalRevenue,
          subscriberCount: revenueData.subscriberCount,
          totalViews: revenueData.views,
          videoCount: revenueData.videoCount,
          estimatedMinutesWatched: revenueData.estimatedMinutesWatched,
          averageViewDuration: revenueData.averageViewDuration,
          rpm: revenueData.rpm,
          periodDays: revenueData.periodDays,
          currency: revenueData.currency,
          uploadConsistency: revenueData.uploadConsistency,
          growthRate: revenueData.growthRate,
          engagementRate: revenueData.engagementRate,
          recentVideos: revenueData.recentVideos,
        },
        metadata: {
          channel_name: channelData.channelName,
          channel_url: channelData.customUrl
            ? `https://youtube.com/${channelData.customUrl}`
            : `https://youtube.com/channel/${channelData.channelId}`,
          thumbnail_url: channelData.thumbnailUrl,
          channel_age_days: channelAgeDays,
          total_views: channelData.totalViews,
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

    console.log('[YouTube] Successfully connected:', {
      wallet: wallet.toLowerCase(),
      channel_id: channelData.channelId,
      channel_name: channelData.channelName,
      totalRevenue: revenueData.totalRevenue,
      subscriberCount: revenueData.subscriberCount,
      views: revenueData.views,
      rpm: revenueData.rpm,
    });

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?youtube_connected=true`
    );
  } catch (error) {
    console.error('YouTube callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Failed to connect YouTube'
      )}`
    );
  }
}
