/**
 * Square OAuth Client
 *
 * Handles OAuth flow and payment data fetching from Square
 * Uses Square OAuth 2.0 for merchant authorization
 */

export interface SquareOAuthConfig {
  applicationId: string;
  applicationSecret: string;
  redirectUri: string;
  environment: 'sandbox' | 'production';
}

export interface SquareSession {
  merchant_id: string; // Square merchant ID
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: string;
  short_lived: boolean;
}

export interface SquareRevenueData {
  totalRevenue: number;
  paymentCount: number;
  successfulPaymentCount: number;
  periodDays: number;
  currency: string;
  averagePaymentAmount?: number;
  refundRate?: number;
  successRate?: number;
}

export class SquareClient {
  private config: SquareOAuthConfig;
  private baseUrl: string;

  constructor(config: SquareOAuthConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production'
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';
  }

  /**
   * Generate Square OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.applicationId,
      scope: 'PAYMENTS_READ MERCHANT_PROFILE_READ',
      session: 'false', // Use long-lived access tokens
      state,
    });

    return `${this.baseUrl}/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<SquareSession> {
    const response = await fetch(`${this.baseUrl}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-12-18', // Latest stable version
      },
      body: JSON.stringify({
        client_id: this.config.applicationId,
        client_secret: this.config.applicationSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to exchange code: ${error.message || response.statusText}`);
    }

    const data = await response.json();

    return {
      merchant_id: data.merchant_id,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      expires_at: data.expires_at,
      short_lived: data.short_lived || false,
    };
  }

  /**
   * Fetch payment data from Square for the last N days
   */
  async getRevenueData(session: SquareSession, days: number = 90): Promise<SquareRevenueData> {
    const beginTime = new Date();
    beginTime.setDate(beginTime.getDate() - days);
    const beginTimeISO = beginTime.toISOString();
    const endTimeISO = new Date().toISOString();

    // Fetch payments using Search Payments endpoint
    const apiBaseUrl = this.config.environment === 'production'
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';

    const response = await fetch(`${apiBaseUrl}/v2/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'Square-Version': '2024-12-18',
      },
      body: JSON.stringify({
        begin_time: beginTimeISO,
        end_time: endTimeISO,
        limit: 100, // Max results per request
        sort_order: 'DESC',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Square API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    const payments = data.payments || [];

    // Calculate revenue metrics
    const completedPayments = payments.filter((payment: any) =>
      payment.status === 'COMPLETED'
    );

    let totalRevenue = 0;
    let totalRefunds = 0;
    const currencies: { [key: string]: number } = {};

    completedPayments.forEach((payment: any) => {
      const amount = payment.amount_money?.amount || 0;
      const currency = payment.amount_money?.currency || 'USD';

      // Convert from cents to dollars
      totalRevenue += amount / 100;

      // Track currency
      currencies[currency] = (currencies[currency] || 0) + 1;

      // Track refunds
      if (payment.refund_ids && payment.refund_ids.length > 0) {
        const refundAmount = payment.refunded_money?.amount || 0;
        totalRefunds += refundAmount / 100;
      }
    });

    // Get most common currency
    const currency = Object.keys(currencies).sort(
      (a, b) => currencies[b] - currencies[a]
    )[0] || 'USD';

    const averagePaymentAmount = completedPayments.length > 0
      ? totalRevenue / completedPayments.length
      : 0;

    const refundRate = totalRevenue > 0
      ? (totalRefunds / totalRevenue) * 100
      : 0;

    const successRate = payments.length > 0
      ? (completedPayments.length / payments.length) * 100
      : 0;

    return {
      totalRevenue,
      paymentCount: payments.length,
      successfulPaymentCount: completedPayments.length,
      periodDays: days,
      currency,
      averagePaymentAmount,
      refundRate,
      successRate,
    };
  }

  /**
   * Refresh an expired access token
   */
  async refreshAccessToken(refreshToken: string): Promise<SquareSession> {
    const response = await fetch(`${this.baseUrl}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-12-18',
      },
      body: JSON.stringify({
        client_id: this.config.applicationId,
        client_secret: this.config.applicationSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to refresh token: ${error.message || response.statusText}`);
    }

    const data = await response.json();

    return {
      merchant_id: data.merchant_id,
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken, // Use old if new one not provided
      token_type: data.token_type,
      expires_at: data.expires_at,
      short_lived: data.short_lived || false,
    };
  }

  /**
   * Revoke access token (disconnect)
   */
  async revokeAccessToken(accessToken: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/oauth2/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2024-12-18',
        'Authorization': `Client ${this.config.applicationSecret}`,
      },
      body: JSON.stringify({
        client_id: this.config.applicationId,
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to revoke token: ${error.message || response.statusText}`);
    }
  }

  /**
   * Get merchant profile information
   */
  async getMerchantProfile(session: SquareSession): Promise<any> {
    const apiBaseUrl = this.config.environment === 'production'
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';

    const response = await fetch(`${apiBaseUrl}/v2/merchants/${session.merchant_id}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Square-Version': '2024-12-18',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get merchant profile: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.merchant;
  }
}
