/**
 * Twitch OAuth Client
 *
 * Handles OAuth flow and data fetching for Twitch Partners and Affiliates.
 * NOTE: Twitch does NOT provide direct revenue data via API.
 * Revenue is ESTIMATED based on subscriber counts and tier pricing.
 */

export interface TwitchOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TwitchSession {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope: string[];
  user_id?: string;
  login?: string;
}

export interface TwitchUserData {
  id: string;
  login: string;
  display_name: string;
  broadcaster_type: 'partner' | 'affiliate' | '';
  description: string;
  profile_image_url: string;
  view_count: number;
  created_at: string;
}

export interface TwitchSubscriberData {
  total: number;
  tier1: number;
  tier2: number;
  tier3: number;
  points: number; // Total subscriber points (Tier 1=1, Tier 2=2, Tier 3=6)
}

export interface TwitchRevenueData {
  estimatedRevenue: number; // ESTIMATED monthly revenue
  subscriberCount: number;
  subscriberTier1: number;
  subscriberTier2: number;
  subscriberTier3: number;
  followerCount: number;
  totalViews: number;
  broadcasterType: 'partner' | 'affiliate' | '';
  estimatedBitsRevenue: number;
  revenueConfidence: 'low' | 'medium' | 'high'; // Confidence in estimate
  periodDays: number;
  currency: string;
  channelAgeDays: number;
}

export class TwitchClient {
  private config: TwitchOAuthConfig;

  constructor(config: TwitchOAuthConfig) {
    this.config = config;
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const scopes = [
      'channel:read:subscriptions',
      'bits:read',
      'moderator:read:followers',
      'user:read:email',
    ];

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      state,
      force_verify: 'true', // Force re-authentication
    });

    return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TwitchSession> {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to exchange code: ${error.message || error.error}`);
    }

    const data = await response.json();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope || [],
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TwitchSession> {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to refresh token: ${error.message || error.error}`);
    }

    const data = await response.json();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope || [],
    };
  }

  /**
   * Get user data for authenticated user
   */
  async getUserData(accessToken: string): Promise<TwitchUserData> {
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': this.config.clientId,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch user data: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error('No user data found');
    }

    const user = data.data[0];

    return {
      id: user.id,
      login: user.login,
      display_name: user.display_name,
      broadcaster_type: user.broadcaster_type || '',
      description: user.description || '',
      profile_image_url: user.profile_image_url || '',
      view_count: parseInt(user.view_count) || 0,
      created_at: user.created_at,
    };
  }

  /**
   * Get subscriber data (counts and tiers)
   * NOTE: This does NOT include revenue amounts
   */
  async getSubscriberData(
    broadcasterId: string,
    accessToken: string
  ): Promise<TwitchSubscriberData> {
    try {
      // First request to get total count
      const firstResponse = await fetch(
        `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcasterId}&first=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-Id': this.config.clientId,
          },
        }
      );

      if (!firstResponse.ok) {
        console.warn('Subscriber data not available');
        return { total: 0, tier1: 0, tier2: 0, tier3: 0, points: 0 };
      }

      const firstData = await firstResponse.json();
      const total = firstData.total || 0;

      if (total === 0) {
        return { total: 0, tier1: 0, tier2: 0, tier3: 0, points: 0 };
      }

      // Fetch all subscribers to count tiers (paginated)
      const subscribers: any[] = [];
      let cursor = null;
      const maxPages = 10; // Limit to prevent excessive API calls (1000 subs max)
      let pageCount = 0;

      do {
        const url = cursor
          ? `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcasterId}&first=100&after=${cursor}`
          : `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcasterId}&first=100`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-Id': this.config.clientId,
          },
        });

        if (!response.ok) break;

        const data = await response.json();
        subscribers.push(...(data.data || []));
        cursor = data.pagination?.cursor;
        pageCount++;
      } while (cursor && pageCount < maxPages);

      // Count by tier
      const tierCounts = {
        tier1: 0,
        tier2: 0,
        tier3: 0,
      };

      subscribers.forEach((sub) => {
        if (sub.tier === '1000') tierCounts.tier1++;
        else if (sub.tier === '2000') tierCounts.tier2++;
        else if (sub.tier === '3000') tierCounts.tier3++;
      });

      // Calculate subscriber points (Tier 1=1, Tier 2=2, Tier 3=6)
      const points = tierCounts.tier1 + tierCounts.tier2 * 2 + tierCounts.tier3 * 6;

      return {
        total,
        tier1: tierCounts.tier1,
        tier2: tierCounts.tier2,
        tier3: tierCounts.tier3,
        points,
      };
    } catch (error) {
      console.error('Error fetching subscriber data:', error);
      return { total: 0, tier1: 0, tier2: 0, tier3: 0, points: 0 };
    }
  }

  /**
   * Get follower count
   */
  async getFollowerCount(broadcasterId: string, accessToken: string): Promise<number> {
    try {
      const response = await fetch(
        `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}&first=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-Id': this.config.clientId,
          },
        }
      );

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return data.total || 0;
    } catch (error) {
      console.error('Error fetching follower count:', error);
      return 0;
    }
  }

  /**
   * Estimate monthly revenue based on subscriber data
   * NOTE: This is an ESTIMATE as Twitch does not provide actual revenue via API
   */
  estimateMonthlyRevenue(
    subscriberData: TwitchSubscriberData,
    broadcasterType: 'partner' | 'affiliate' | ''
  ): { revenue: number; confidence: 'low' | 'medium' | 'high' } {
    if (subscriberData.total === 0) {
      return { revenue: 0, confidence: 'low' };
    }

    // Revenue split varies by broadcaster type and individual contracts
    // Standard splits:
    // - Affiliates: 50% ($2.50, $5.00, $12.50)
    // - Partners: 50-70% (we use 50% as conservative estimate)
    const tier1Revenue = 2.5; // $2.50 per Tier 1 sub
    const tier2Revenue = 5.0; // $5.00 per Tier 2 sub
    const tier3Revenue = 12.5; // $12.50 per Tier 3 sub

    const estimatedRevenue =
      subscriberData.tier1 * tier1Revenue +
      subscriberData.tier2 * tier2Revenue +
      subscriberData.tier3 * tier3Revenue;

    // Determine confidence level
    let confidence: 'low' | 'medium' | 'high';

    if (broadcasterType === 'partner' || broadcasterType === 'affiliate') {
      // Higher confidence if we have verified monetization status
      if (subscriberData.total > 100) {
        confidence = 'high';
      } else if (subscriberData.total > 10) {
        confidence = 'medium';
      } else {
        confidence = 'low';
      }
    } else {
      // Lower confidence if not monetized
      confidence = 'low';
    }

    return {
      revenue: estimatedRevenue,
      confidence,
    };
  }

  /**
   * Get comprehensive revenue data (ESTIMATED)
   */
  async getRevenueData(session: TwitchSession): Promise<TwitchRevenueData> {
    // Get user data
    const userData = await this.getUserData(session.access_token);

    // Update session with user info
    session.user_id = userData.id;
    session.login = userData.login;

    // Get subscriber data
    const subscriberData = await this.getSubscriberData(userData.id, session.access_token);

    // Get follower count
    const followerCount = await this.getFollowerCount(userData.id, session.access_token);

    // Estimate monthly revenue
    const revenueEstimate = this.estimateMonthlyRevenue(subscriberData, userData.broadcaster_type);

    // Calculate channel age
    const channelAgeMs = Date.now() - new Date(userData.created_at).getTime();
    const channelAgeDays = Math.floor(channelAgeMs / (1000 * 60 * 60 * 24));

    return {
      estimatedRevenue: revenueEstimate.revenue,
      subscriberCount: subscriberData.total,
      subscriberTier1: subscriberData.tier1,
      subscriberTier2: subscriberData.tier2,
      subscriberTier3: subscriberData.tier3,
      followerCount,
      totalViews: userData.view_count,
      broadcasterType: userData.broadcaster_type,
      estimatedBitsRevenue: 0, // Would require historical tracking
      revenueConfidence: revenueEstimate.confidence,
      periodDays: 30, // Monthly estimate
      currency: 'USD',
      channelAgeDays,
    };
  }

  /**
   * Check if channel is monetized (Partner or Affiliate)
   */
  async isMonetized(accessToken: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(accessToken);
      return userData.broadcaster_type === 'partner' || userData.broadcaster_type === 'affiliate';
    } catch (error) {
      return false;
    }
  }
}
