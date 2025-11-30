/**
 * TikTok Shop OAuth Client
 *
 * Handles OAuth flow and data fetching for TikTok Shop sellers and creator affiliates.
 * Integrates with TikTok Shop Partner Center API for revenue verification.
 */

export interface TikTokShopOAuthConfig {
  appKey: string;
  appSecret: string;
  redirectUri: string;
}

export interface TikTokShopSession {
  access_token: string;
  access_token_expire_in: number;
  refresh_token: string;
  refresh_token_expire_in: number;
  open_id: string;
  seller_name?: string;
  seller_base_region?: string;
  shop_id?: string;
  shop_cipher?: string;
}

export interface TikTokShopData {
  shop_id: string;
  shop_name: string;
  shop_cipher: string;
  region: string;
  seller_type: string;
}

export interface TikTokShopRevenueData {
  totalRevenue: number;
  orderCount: number;
  affiliateCommission: number; // For creator affiliates
  periodDays: number;
  currency: string;
  averageOrderValue: number;
  shopRating?: number;
  itemsSoldCount?: number;
  returnRate?: number;
}

export class TikTokShopClient {
  private config: TikTokShopOAuthConfig;
  private baseUrl: string;

  constructor(config: TikTokShopOAuthConfig) {
    this.config = config;
    // Use appropriate base URL based on region
    // Default to US endpoint
    this.baseUrl = 'https://open-api.tiktokglobalshop.com';
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      app_key: this.config.appKey,
      state,
      // Add required parameters based on TikTok Shop docs
    });

    return `https://services.tiktokshop.com/open/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TikTokShopSession> {
    const timestamp = Math.floor(Date.now() / 1000);

    // TikTok Shop requires signature for API calls
    const sign = this.generateSignature('/api/token/get', {
      app_key: this.config.appKey,
      auth_code: code,
      grant_type: 'authorized_code',
    }, timestamp);

    const response = await fetch(`${this.baseUrl}/api/token/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tts-access-token': '',
      },
      body: JSON.stringify({
        app_key: this.config.appKey,
        app_secret: this.config.appSecret,
        auth_code: code,
        grant_type: 'authorized_code',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to exchange code: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.code !== 0) {
      throw new Error(`TikTok Shop API error: ${data.message}`);
    }

    return {
      access_token: data.data.access_token,
      access_token_expire_in: data.data.access_token_expire_in,
      refresh_token: data.data.refresh_token,
      refresh_token_expire_in: data.data.refresh_token_expire_in,
      open_id: data.data.open_id,
      seller_name: data.data.seller_name,
      seller_base_region: data.data.seller_base_region,
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<TikTokShopSession> {
    const timestamp = Math.floor(Date.now() / 1000);

    const response = await fetch(`${this.baseUrl}/api/token/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: this.config.appKey,
        app_secret: this.config.appSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to refresh token: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.code !== 0) {
      throw new Error(`TikTok Shop API error: ${data.message}`);
    }

    return {
      access_token: data.data.access_token,
      access_token_expire_in: data.data.access_token_expire_in,
      refresh_token: data.data.refresh_token,
      refresh_token_expire_in: data.data.refresh_token_expire_in,
      open_id: data.data.open_id,
    };
  }

  /**
   * Get authorized shop information
   */
  async getAuthorizedShops(accessToken: string): Promise<TikTokShopData[]> {
    const timestamp = Math.floor(Date.now() / 1000);

    const response = await fetch(`${this.baseUrl}/authorization/202309/shops`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-tts-access-token': accessToken,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch shops: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.code !== 0) {
      throw new Error(`TikTok Shop API error: ${data.message}`);
    }

    return data.data.shops.map((shop: any) => ({
      shop_id: shop.shop_id,
      shop_name: shop.shop_name,
      shop_cipher: shop.shop_cipher,
      region: shop.region,
      seller_type: shop.seller_type,
    }));
  }

  /**
   * Get order data for revenue calculation
   * Note: This is a simplified version - actual implementation requires proper pagination
   * and handling of TikTok Shop's specific order API structure
   */
  async getOrderData(
    accessToken: string,
    shopCipher: string,
    days: number = 90
  ): Promise<{ orders: any[]; total: number }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const startTime = Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);
    const endTime = timestamp;

    // Note: Actual endpoint may be /order/202309/orders or similar
    // This is a placeholder based on TikTok Shop API patterns
    const response = await fetch(
      `${this.baseUrl}/order/202309/orders?` +
        new URLSearchParams({
          shop_cipher: shopCipher,
          create_time_from: startTime.toString(),
          create_time_to: endTime.toString(),
          page_size: '50',
        }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken,
        },
      }
    );

    if (!response.ok) {
      console.warn('Order data not available');
      return { orders: [], total: 0 };
    }

    const data = await response.json();

    if (data.code !== 0) {
      console.warn('Order API error:', data.message);
      return { orders: [], total: 0 };
    }

    return {
      orders: data.data.orders || [],
      total: data.data.total || 0,
    };
  }

  /**
   * Get affiliate commission data (for creator affiliates)
   */
  async getAffiliateCommissions(
    accessToken: string,
    shopCipher: string,
    days: number = 90
  ): Promise<number> {
    // Note: Actual endpoint for affiliate data
    // This is placeholder - requires actual TikTok Shop Affiliate API
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const startTime = Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);

      // Placeholder - actual implementation depends on Affiliate API structure
      // May require separate app registration for Affiliate APIs
      return 0; // Return 0 if not available
    } catch (error) {
      console.error('Affiliate commission data not available:', error);
      return 0;
    }
  }

  /**
   * Get comprehensive revenue data
   */
  async getRevenueData(
    session: TikTokShopSession,
    days: number = 90
  ): Promise<TikTokShopRevenueData> {
    // Get authorized shops
    const shops = await this.getAuthorizedShops(session.access_token);

    if (shops.length === 0) {
      throw new Error('No authorized shops found');
    }

    // Use first shop (or allow user to select)
    const shop = shops[0];
    session.shop_id = shop.shop_id;
    session.shop_cipher = shop.shop_cipher;

    // Get order data
    const { orders } = await this.getOrderData(session.access_token, shop.shop_cipher, days);

    // Calculate revenue from orders
    let totalRevenue = 0;
    let orderCount = 0;

    orders.forEach((order: any) => {
      // Only count completed/paid orders
      if (
        order.status === 'COMPLETED' ||
        order.payment_info?.payment_status === 'PAID'
      ) {
        totalRevenue += parseFloat(order.payment_info?.total_amount || 0);
        orderCount++;
      }
    });

    // Get affiliate commission data (if applicable)
    const affiliateCommission = await this.getAffiliateCommissions(
      session.access_token,
      shop.shop_cipher,
      days
    );

    // Calculate average order value
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Extract currency from first order or default to USD
    const currency = orders[0]?.payment_info?.currency || 'USD';

    return {
      totalRevenue,
      orderCount,
      affiliateCommission,
      periodDays: days,
      currency,
      averageOrderValue,
      // Additional metrics can be added here
    };
  }

  /**
   * Generate signature for TikTok Shop API requests
   * Required for authentication
   */
  private generateSignature(
    path: string,
    params: Record<string, string>,
    timestamp: number
  ): string {
    // TikTok Shop requires HMAC-SHA256 signature
    // Actual implementation requires crypto library
    // Placeholder for now - implement with actual crypto when ready
    const crypto = require('crypto');

    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}${params[key]}`)
      .join('');

    const signString = `${path}${sortedParams}${timestamp}`;

    return crypto
      .createHmac('sha256', this.config.appSecret)
      .update(signString)
      .digest('hex');
  }

  /**
   * Check if seller has active shop
   */
  async hasActiveShop(accessToken: string): Promise<boolean> {
    try {
      const shops = await this.getAuthorizedShops(accessToken);
      return shops.length > 0;
    } catch (error) {
      return false;
    }
  }
}
