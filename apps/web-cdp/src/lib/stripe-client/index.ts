/**
 * Stripe Connect Client
 *
 * Handles OAuth flow and revenue data fetching from Stripe
 * Uses Stripe Connect Standard for merchant onboarding
 */

export interface StripeOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface StripeSession {
  stripe_user_id: string; // Connected account ID (acct_xxx)
  access_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
}

export interface StripeRevenueData {
  totalRevenue: number;
  chargeCount: number;
  successfulChargeCount: number;
  periodDays: number;
  currency: string;
  averageChargeAmount?: number;
  recurringRevenue?: number;
  successRate?: number;
}

export class StripeClient {
  private config: StripeOAuthConfig;

  constructor(config: StripeOAuthConfig) {
    this.config = config;
  }

  /**
   * Generate Stripe Connect OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      scope: 'read_only', // Read-only access to payment data
      redirect_uri: this.config.redirectUri,
      state,
    });

    return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<StripeSession> {
    const response = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to exchange code: ${error.error_description || response.statusText}`);
    }

    const data = await response.json();

    return {
      stripe_user_id: data.stripe_user_id,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      scope: data.scope,
    };
  }

  /**
   * Fetch revenue data from Stripe for the last N days
   */
  async getRevenueData(session: StripeSession, days: number = 90): Promise<StripeRevenueData> {
    const timestamp = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);

    // Fetch charges (one-time payments)
    const chargesResponse = await fetch(
      `https://api.stripe.com/v1/charges?created[gte]=${timestamp}&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Stripe-Account': session.stripe_user_id,
        },
      }
    );

    if (!chargesResponse.ok) {
      throw new Error(`Stripe API error: ${chargesResponse.statusText}`);
    }

    const chargesData = await chargesResponse.json();
    const charges = chargesData.data || [];

    // Calculate revenue metrics
    const successfulCharges = charges.filter((charge: any) => charge.status === 'succeeded');
    const totalRevenue = successfulCharges.reduce((sum: number, charge: any) => {
      return sum + (charge.amount / 100); // Convert cents to dollars
    }, 0);

    const averageChargeAmount = successfulCharges.length > 0
      ? totalRevenue / successfulCharges.length
      : 0;

    const successRate = charges.length > 0
      ? (successfulCharges.length / charges.length) * 100
      : 0;

    // Try to fetch subscription data (recurring revenue)
    let recurringRevenue = 0;
    try {
      const subscriptionsResponse = await fetch(
        `https://api.stripe.com/v1/subscriptions?status=active&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Stripe-Account': session.stripe_user_id,
          },
        }
      );

      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json();
        const subscriptions = subscriptionsData.data || [];

        recurringRevenue = subscriptions.reduce((sum: number, sub: any) => {
          // Get monthly recurring revenue (MRR)
          const items = sub.items?.data || [];
          const subTotal = items.reduce((itemSum: number, item: any) => {
            const amount = item.price?.unit_amount || 0;
            const quantity = item.quantity || 1;
            return itemSum + (amount * quantity / 100);
          }, 0);
          return sum + subTotal;
        }, 0);
      }
    } catch (err) {
      console.warn('[Stripe] Could not fetch subscription data:', err);
      // Non-critical, continue without recurring revenue
    }

    // Get primary currency from first successful charge
    const currency = successfulCharges[0]?.currency?.toUpperCase() || 'USD';

    return {
      totalRevenue,
      chargeCount: charges.length,
      successfulChargeCount: successfulCharges.length,
      periodDays: days,
      currency,
      averageChargeAmount,
      recurringRevenue,
      successRate,
    };
  }

  /**
   * Refresh an expired access token
   */
  async refreshAccessToken(refreshToken: string): Promise<StripeSession> {
    const response = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to refresh token: ${error.error_description || response.statusText}`);
    }

    const data = await response.json();

    return {
      stripe_user_id: data.stripe_user_id,
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken, // Use old refresh token if new one not provided
      token_type: data.token_type,
      scope: data.scope,
    };
  }

  /**
   * Deauthorize a connected account (disconnect)
   */
  async deauthorize(stripeUserId: string): Promise<void> {
    const response = await fetch('https://connect.stripe.com/oauth/deauthorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        stripe_user_id: stripeUserId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to deauthorize: ${response.statusText}`);
    }
  }
}
