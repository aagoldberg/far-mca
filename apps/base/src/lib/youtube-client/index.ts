/**
 * YouTube OAuth Client
 *
 * Handles OAuth flow and data fetching for YouTube Partner Program creators.
 * Integrates with YouTube Data API v3, YouTube Analytics API, and AdSense API.
 */

export interface YouTubeOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface YouTubeSession {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  channel_id?: string;
  channel_name?: string;
}

export interface YouTubeChannelData {
  channelId: string;
  channelName: string;
  subscriberCount: number;
  totalViews: number;
  videoCount: number;
  customUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;
}

export interface YouTubeRevenueData {
  totalRevenue: number;
  estimatedMinutesWatched: number;
  views: number;
  subscriberCount: number;
  videoCount: number;
  averageViewDuration: number;
  rpm: number; // Revenue per 1000 views
  periodDays: number;
  currency: string;
  uploadConsistency: number; // Videos per month
  growthRate: number; // Subscriber growth percentage
  engagementRate: number; // Likes + comments / views
  recentVideos: number; // Videos uploaded in period
}

export class YouTubeClient {
  private config: YouTubeOAuthConfig;

  constructor(config: YouTubeOAuthConfig) {
    this.config = config;
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
      'https://www.googleapis.com/auth/adsense.readonly'
    ];

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline', // Request refresh token
      prompt: 'consent', // Force consent to get refresh token
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<YouTubeSession> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to exchange code: ${error.error_description || error.error}`);
    }

    const data = await response.json();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<YouTubeSession> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to refresh token: ${error.error_description || error.error}`);
    }

    const data = await response.json();

    return {
      access_token: data.access_token,
      refresh_token: refreshToken, // Refresh token stays the same
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope,
    };
  }

  /**
   * Get channel data for authenticated user
   */
  async getChannelData(session: YouTubeSession): Promise<YouTubeChannelData> {
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true',
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch channel data: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No channel found for this account');
    }

    const channel = data.items[0];

    return {
      channelId: channel.id,
      channelName: channel.snippet.title,
      subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
      totalViews: parseInt(channel.statistics.viewCount) || 0,
      videoCount: parseInt(channel.statistics.videoCount) || 0,
      customUrl: channel.snippet.customUrl,
      thumbnailUrl: channel.snippet.thumbnails?.default?.url,
      publishedAt: channel.snippet.publishedAt,
    };
  }

  /**
   * Get analytics data for a channel (views, watch time, etc.)
   */
  async getAnalyticsData(
    channelId: string,
    accessToken: string,
    days: number = 90
  ): Promise<{
    views: number;
    estimatedMinutesWatched: number;
    averageViewDuration: number;
    likes: number;
    comments: number;
    subscribersGained: number;
    videosAdded: number;
  }> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const params = new URLSearchParams({
      ids: `channel==${channelId}`,
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,likes,comments,subscribersGained,videosAddedToPlaylists',
      dimensions: '',
    });

    const response = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch analytics: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Analytics API returns data in rows array
    const row = data.rows?.[0] || [];

    return {
      views: row[0] || 0,
      estimatedMinutesWatched: row[1] || 0,
      averageViewDuration: row[2] || 0,
      likes: row[3] || 0,
      comments: row[4] || 0,
      subscribersGained: row[5] || 0,
      videosAdded: row[6] || 0,
    };
  }

  /**
   * Get estimated AdSense revenue (requires AdSense API access)
   * Note: This may require additional setup and may not be available for all creators
   */
  async getAdSenseRevenue(
    accessToken: string,
    channelId: string,
    days: number = 90
  ): Promise<{ revenue: number; currency: string }> {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      // Try YouTube Analytics estimated revenue metric first
      const params = new URLSearchParams({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'estimatedRevenue',
        currency: 'USD',
      });

      const response = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.warn('AdSense revenue not available, using fallback');
        return { revenue: 0, currency: 'USD' };
      }

      const data = await response.json();
      const revenue = data.rows?.[0]?.[0] || 0;

      return {
        revenue: Math.abs(revenue), // Revenue is sometimes negative in API
        currency: 'USD',
      };
    } catch (error) {
      console.error('Error fetching AdSense revenue:', error);
      return { revenue: 0, currency: 'USD' };
    }
  }

  /**
   * Get comprehensive revenue data combining all metrics
   */
  async getRevenueData(
    session: YouTubeSession,
    days: number = 90
  ): Promise<YouTubeRevenueData> {
    // Get channel data first
    const channelData = await this.getChannelData(session);

    // Update session with channel info
    session.channel_id = channelData.channelId;
    session.channel_name = channelData.channelName;

    // Get analytics data
    const analyticsData = await this.getAnalyticsData(
      channelData.channelId,
      session.access_token,
      days
    );

    // Get AdSense revenue (may not be available)
    const revenueData = await this.getAdSenseRevenue(
      session.access_token,
      channelData.channelId,
      days
    );

    // Calculate derived metrics
    const rpm = analyticsData.views > 0
      ? (revenueData.revenue / analyticsData.views) * 1000
      : 0;

    const engagementRate = analyticsData.views > 0
      ? ((analyticsData.likes + analyticsData.comments) / analyticsData.views) * 100
      : 0;

    const uploadConsistency = (analyticsData.videosAdded / days) * 30; // Videos per month

    const growthRate = channelData.subscriberCount > 0
      ? (analyticsData.subscribersGained / channelData.subscriberCount) * 100
      : 0;

    return {
      totalRevenue: revenueData.revenue,
      estimatedMinutesWatched: analyticsData.estimatedMinutesWatched,
      views: analyticsData.views,
      subscriberCount: channelData.subscriberCount,
      videoCount: channelData.videoCount,
      averageViewDuration: analyticsData.averageViewDuration,
      rpm,
      periodDays: days,
      currency: revenueData.currency,
      uploadConsistency,
      growthRate,
      engagementRate,
      recentVideos: analyticsData.videosAdded,
    };
  }

  /**
   * Validate that a channel is monetized
   */
  async isMonetized(channelId: string, accessToken: string): Promise<boolean> {
    try {
      // Check if channel has any revenue in the last 90 days
      const revenue = await this.getAdSenseRevenue(accessToken, channelId, 90);
      return revenue.revenue > 0;
    } catch (error) {
      // If we can't check, assume not monetized
      return false;
    }
  }
}
