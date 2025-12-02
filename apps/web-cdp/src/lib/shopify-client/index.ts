export interface ShopifyOAuthConfig {
  apiKey: string;
  apiSecret: string;
  scopes: string[];
  redirectUri: string;
}

export interface ShopifySession {
  shop: string;
  accessToken: string;
  scope: string;
  expiresAt?: Date;
}

export interface RevenueData {
  totalRevenue: number;
  orderCount: number;
  periodDays: number;
  currency: string;
}

export class ShopifyClient {
  private config: ShopifyOAuthConfig;

  constructor(config: ShopifyOAuthConfig) {
    this.config = config;
  }

  // Generate OAuth authorization URL
  getAuthUrl(shop: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.apiKey,
      scope: this.config.scopes.join(','),
      redirect_uri: this.config.redirectUri,
      state: state || '',
    });

    return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(shop: string, code: string): Promise<ShopifySession> {
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.apiKey,
        client_secret: this.config.apiSecret,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code: ${response.statusText}`);
    }

    const data = await response.json() as any;
    
    return {
      shop,
      accessToken: data.access_token,
      scope: data.scope,
    };
  }

  // Fetch revenue data for the last N days using GraphQL API
  async getRevenueData(session: ShopifySession, days: number = 30): Promise<RevenueData> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const createdAtMin = date.toISOString();

    // Use GraphQL API - may have better access for dev stores
    const query = `
      query getOrders($query: String!) {
        orders(first: 250, query: $query) {
          edges {
            node {
              id
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${session.shop}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': session.accessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          query: `created_at:>='${createdAtMin}'`,
        },
      }),
    });

    if (!response.ok) {
      // Fallback: try REST API (might work for some scopes)
      return this.getRevenueDataREST(session, days);
    }

    const result = await response.json() as any;

    // Check for GraphQL errors
    if (result.errors) {
      console.warn('[Shopify] GraphQL errors:', result.errors);
      // Fallback to REST API
      return this.getRevenueDataREST(session, days);
    }

    const orders = result.data?.orders?.edges || [];

    let totalRevenue = 0;
    let currency = 'USD';

    for (const edge of orders) {
      const amount = parseFloat(edge.node.totalPriceSet?.shopMoney?.amount || '0');
      if (!isNaN(amount)) {
        totalRevenue += amount;
      }
      if (edge.node.totalPriceSet?.shopMoney?.currencyCode) {
        currency = edge.node.totalPriceSet.shopMoney.currencyCode;
      }
    }

    return {
      totalRevenue,
      orderCount: orders.length,
      periodDays: days,
      currency,
    };
  }

  // Fallback REST API method
  private async getRevenueDataREST(session: ShopifySession, days: number): Promise<RevenueData> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const createdAtMin = date.toISOString();

    const url = `https://${session.shop}/admin/api/2024-10/orders.json` +
      `?status=any&created_at_min=${createdAtMin}&fields=total_price,currency`;

    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': session.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json() as any;
    const orders = data.orders || [];

    const totalRevenue = orders.reduce((sum: number, order: any) => {
      const price = parseFloat(order.total_price || '0');
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    return {
      totalRevenue,
      orderCount: orders.length,
      periodDays: days,
      currency: orders[0]?.currency || 'USD',
    };
  }

  // Validate webhook
  validateWebhook(data: string, hmacHeader: string): boolean {
    const crypto = require('crypto');
    const calculated = crypto
      .createHmac('sha256', this.config.apiSecret)
      .update(data, 'utf8')
      .digest('base64');
    
    return calculated === hmacHeader;
  }
}

// Types exported directly in this file