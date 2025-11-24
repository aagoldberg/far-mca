# TikTok Shop Integration

Connect TikTok Shop accounts to verify sales revenue and affiliate commissions for credit scoring.

## Overview

TikTok Shop integration allows sellers and creator affiliates to prove their income by connecting their TikTok Shop account through OAuth. We fetch actual transaction data including order history, GMV (Gross Merchandise Value), and affiliate commission earnings.

**Key Advantage:** Unlike Twitch (estimated revenue), TikTok Shop provides **actual verified transaction data** similar to Shopify.

## Prerequisites

- Active TikTok Shop seller account OR creator affiliate account
- Shop must be in an available region (US, UK, EU, Southeast Asia)
- Business verification completed
- For affiliates: Identity verification completed

## TikTok Shop: Dual Revenue Model

TikTok Shop uniquely serves two user types:

### 1. Sellers (Direct Sales)
- Own and sell products through TikTok Shop
- Earn revenue from product sales
- Similar to Shopify merchants

### 2. Creator Affiliates (Commission-Based)
- Promote other sellers' products
- Earn commission (10-80% of sales)
- Don't need to own inventory
- Perfect for influencers and content creators

**This makes TikTok Shop ideal for creator economy lending** - creators can verify income without owning physical products.

## Data Collected

### Sales Data (For Sellers)
- **Total Revenue**: GMV across all orders
- **Order Count**: Number of completed transactions
- **Order History**: 90-day transaction records
- **Average Order Value**: Revenue per order
- **Product Performance**: Items sold count

### Commission Data (For Creator Affiliates)
- **Total Commission Earned**: Actual payouts from affiliate sales
- **Attribution**: Direct vs. assisted sales
- **Commission Rates**: Percentage earned per product
- **Payout History**: Settlement/withdrawal data

### Shop Metrics
- **Shop Rating**: Customer satisfaction score
- **Shop Reviews**: Total review count
- **Return Rate**: Order return percentage
- **Shop Performance Value**: Platform-assigned quality score

### Quality Indicators
- Shop standing and violations
- Fulfillment performance
- Customer service rating
- On-time delivery rate

## Credit Score Impact

TikTok Shop data contributes to all four credit scoring factors with HIGH confidence (actual revenue data):

### Revenue Score (40%)
- Based on ACTUAL transaction data (not estimates)
- Both seller revenue AND affiliate commissions counted
- Threshold tiers:
  - $0-1,000/month: Base score
  - $1,000-5,000/month: Mid-range score
  - $5,000-20,000/month: High score
  - $20,000+/month: Maximum score

### Consistency Score (20%)
- Order frequency and regularity
- Revenue stability month-over-month
- Shop age and longevity
- Seller type (individual vs. business)

### Reliability Score (20%)
- Shop rating (higher = better)
- Return rate (lower = better)
- Customer satisfaction metrics
- Fulfillment performance
- Platform standing (violations, warnings)

### Growth Score (20%)
- Revenue growth trajectory
- Order count increase
- New product launches
- Market expansion
- Affiliate network growth (for creators)

## Regional Availability

### Supported Markets
**North America:** 🇺🇸 United States, 🇨🇦 Canada
**Europe:** 🇬🇧 UK, 🇫🇷 France, 🇩🇪 Germany, 🇮🇹 Italy, 🇪🇸 Spain
**Southeast Asia:** 🇮🇩 Indonesia, 🇲🇾 Malaysia, 🇹🇭 Thailand, 🇻🇳 Vietnam, 🇵🇭 Philippines, 🇸🇬 Singapore

### Restricted Markets
**Not Available:** Australia, India, Most Middle East countries

### Business Requirements by Region
- **US:** US business entity + EIN
- **UK/EU:** UK Limited Company + VAT registration
- **SEA:** Local entity + market-specific compliance

## Technical Implementation

### OAuth Flow

```
User clicks "Connect TikTok Shop"
    ↓
Redirect to TikTok Shop authorization
    ↓
User grants permissions (read-only)
    ↓
Callback receives authorization code
    ↓
Exchange code for access token + refresh token
    ↓
Fetch shop information and authorized shops
    ↓
Fetch 90-day order history
    ↓
Calculate revenue metrics (GMV, commissions, AOV)
    ↓
Store connection in business_connections table
    ↓
Redirect to dashboard with updated credit score
```

### Required OAuth Scopes

TikTok Shop requires explicit permission scopes:
```
- Shop authorized information
- Product data access
- Order information
- Financial/settlement data
- Affiliate commission data (for creators)
```

### API Endpoints Used

**TikTok Shop Partner Center API** (open-api.tiktokglobalshop.com)

**Authorization:**
- `POST /api/token/get` - Exchange auth code for tokens
- `POST /api/token/refresh` - Refresh access tokens
- `GET /authorization/202309/shops` - Get authorized shops

**Commerce Data:**
- `GET /order/202309/orders` - Fetch order history
- `GET /product/202309/products` - Product catalog
- `GET /finance/202309/settlements` - Financial settlements
- `GET /affiliate/202309/orders` - Affiliate-attributed orders

**All requests require:**
- `x-tts-access-token` header with access token
- HMAC-SHA256 signature for authentication

## Setup Instructions

### 1. TikTok Shop Partner Center Registration

1. Go to [TikTok Shop Partner Center](https://partner.tiktokshop.com)
2. Select target market:
   - **US-only sellers**: Use US Partner Portal
   - **Global sellers**: Use Global Partner Portal
3. Register your application:
   - **App Name**: LendFriend
   - **Category**: Finance/Credit
   - **Redirect URL**: `https://yourdomain.com/api/tiktokshop/callback`
4. Complete business verification
5. Wait 2-3 business days for approval

### 2. API Permissions

1. Navigate to "Manage API" section in Partner Center
2. Apply for required data permissions:
   - Shop information
   - Order data
   - Financial data
   - Affiliate data (if targeting creators)
3. Most permissions approved instantly after verification

### 3. Environment Variables

Add to `.env.local`:

```bash
TIKTOK_SHOP_APP_KEY=your_app_key_here
TIKTOK_SHOP_APP_SECRET=your_app_secret_here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Webhook Setup (Optional)

For real-time updates:
- Order status changes
- Product updates
- Settlement notifications

## Implementation Details

### Phase 1: TikTok Shop OAuth Client Library
**File**: `apps/web-cdp/src/lib/tiktokshop-client/index.ts`

Methods implemented:
- `getAuthUrl(state: string)`: Generate OAuth authorization URL
- `exchangeCodeForToken(code: string)`: Exchange auth code for tokens
- `refreshAccessToken(refreshToken: string)`: Refresh expired tokens
- `getAuthorizedShops(accessToken: string)`: Fetch connected shops
- `getOrderData(accessToken, shopCipher, days)`: Fetch order history
- `getAffiliateCommissions(accessToken, shopCipher, days)`: Fetch affiliate earnings
- `getRevenueData(session, days)`: Calculate comprehensive revenue metrics

**Types:**
```typescript
interface TikTokShopSession {
  access_token: string;
  refresh_token: string;
  open_id: string;
  seller_name?: string;
  shop_id?: string;
}

interface TikTokShopRevenueData {
  totalRevenue: number;
  orderCount: number;
  affiliateCommission: number;
  averageOrderValue: number;
  periodDays: number;
  currency: string;
  shopRating?: number;
}
```

### Phase 2: API Routes

**Auth Endpoint**: `apps/web-cdp/src/app/api/tiktokshop/auth/route.ts`
- Accept `wallet` query parameter
- Generate OAuth URL with TikTok Shop client
- Include state for CSRF protection
- Return `{ authUrl }` JSON

**Callback Endpoint**: `apps/web-cdp/src/app/api/tiktokshop/callback/route.ts`
- Receive authorization code from TikTok Shop
- Exchange for access & refresh tokens
- Fetch shop information and verify active shop
- Fetch 90-day order history
- Calculate revenue metrics
- Store in `business_connections` table:
  ```sql
  {
    wallet_address: string,
    platform: 'tiktokshop',
    platform_user_id: open_id,
    access_token: encrypted_token,
    refresh_token: encrypted_token,
    revenue_data: {
      totalRevenue: number,
      orderCount: number,
      affiliateCommission: number,
      averageOrderValue: number,
      periodDays: 90,
      currency: string,
      shopRating: number
    },
    metadata: {
      seller_name: string,
      shop_name: string,
      shop_url: string,
      seller_type: string,
      region: string
    },
    last_synced_at: ISO_timestamp
  }
  ```
- Redirect to dashboard with `?tiktokshop_connected=true`

### Phase 3: UI Components

**TikTokShopConnectButton**: `apps/web-cdp/src/components/TikTokShopConnectButton.tsx`
```typescript
interface TikTokShopConnectButtonProps {
  onConnectionSuccess?: () => void;
  onConnectionError?: (error: string) => void;
  size?: 'sm' | 'md' | 'lg';
}
```

Features:
- Black branding (TikTok colors)
- Shopping cart icon from Heroicons
- Loading state during OAuth
- Error handling for inactive shops
- Disabled if no wallet connected

**BusinessConnectionManager Update**: Add TikTok Shop to platform list
```typescript
const PLATFORM_CONFIG = {
  // ... existing platforms
  tiktokshop: {
    name: 'TikTok Shop',
    icon: ShoppingCartIcon,
    color: 'bg-black',
    hoverColor: 'hover:bg-gray-800',
  },
};
```

### Phase 4: Testing

**Local Testing Checklist**:
- [ ] OAuth flow initiates correctly
- [ ] TikTok Shop consent screen shows correct scopes
- [ ] Authorization code exchange succeeds
- [ ] Shop information fetches successfully
- [ ] Order data retrieves correctly (90 days)
- [ ] Revenue calculation is accurate
- [ ] Affiliate commission data accessible (for creators)
- [ ] Inactive shops are rejected gracefully
- [ ] Data stores in Supabase correctly
- [ ] Credit score recalculates with TikTok Shop data
- [ ] UI displays TikTok Shop connection
- [ ] Token refresh workflow works

**Test Data Requirements**:
- Test TikTok Shop account with active shop
- Minimum 10+ orders in last 90 days
- Mix of order statuses (completed, pending, cancelled)
- For affiliate testing: Account with affiliate commissions

## Rate Limits & Quotas

**TikTok Shop API Rate Limits**:
- **Default**: ~50 requests per second per shop
- **Time Window**: 1-minute sliding window
- **429 Response**: Rate limit exceeded
- **Headers**: Standard rate limit headers provided

**Best Practices**:
- Cache shop data (update every 6-24 hours)
- Cache order data (update daily)
- Implement exponential backoff for 429 responses
- Use pagination responsibly (max 50 orders per page)

**Cost Structure**:
- **API Usage**: FREE (no per-call charges)
- **App Listing**: FREE (no listing fees)
- **Revenue Share**: NONE (unlike some app stores)

## Error Handling

### Common Errors

**No Active Shop**
- Error: User has no authorized shops
- Resolution: Direct user to create TikTok Shop first
- UI: "No active TikTok Shop found. Please set up your shop first."

**Insufficient Permissions**
- Error: `105005` - Missing auth package
- Cause: Required API permissions not approved
- Resolution: Apply for permissions in Partner Center "Manage API" section

**Token Expired**
- Error: `invalid_access_token`
- Cause: Access token expired (4-hour lifetime)
- Resolution: Use refresh token to get new access token

**Region Not Supported**
- Error: User's shop in restricted region
- Resolution: Display message about available markets
- UI: "TikTok Shop is not available in your region yet."

**Order Data Unavailable**
- Warning: No orders in time period
- Behavior: Accept connection with $0 revenue
- Score: Provide credit for shop existence, low revenue impact

## Security Considerations

### Token Storage
- Encrypt access tokens using AES-256
- Store refresh tokens separately with additional encryption
- Implement token rotation (tokens expire in 4 hours)
- Use Supabase Row Level Security (RLS)

### API Security
- All requests require HMAC-SHA256 signature
- Signature includes: path, params, timestamp, app secret
- Prevents request tampering and replay attacks
- Validate wallet ownership before OAuth redirect

### Data Privacy
- Only request minimum required scopes
- Never expose tokens in client-side code
- Log token access for audit trails
- Implement token revocation on disconnect

## Comparison to Other Integrations

| Platform | Data Quality | Revenue Type | Best For |
|----------|--------------|--------------|----------|
| **Shopify** | High (actual) | Direct sales | Traditional e-commerce |
| **TikTok Shop** | High (actual) | Sales + commissions | Social commerce, creators |
| **Stripe** | High (actual) | Payment processing | General transactions |
| **YouTube** | High (actual) | Ad revenue | Content creators |
| **Twitch** | Medium (estimated) | Subscriptions | Streamers |

**TikTok Shop Unique Advantages:**
- ✅ Serves both sellers AND affiliates
- ✅ Creator-focused revenue model
- ✅ Actual transaction data (not estimates)
- ✅ Free API access
- ✅ Fast-growing platform
- ✅ Mobile-first audience

## Use Cases

### Best For:
1. **Social Commerce Sellers** - Selling through TikTok videos
2. **Creator Affiliates** - Influencers earning commissions
3. **Gen Z/Millennial Entrepreneurs** - Mobile-native businesses
4. **Content Creators with Products** - Merch sellers
5. **Small Batch Sellers** - Dropshippers, boutique owners

### Less Relevant For:
- Traditional B2B businesses
- Enterprise e-commerce
- Businesses in restricted regions
- Creators without TikTok presence

## Future Enhancements

**Planned Features**:
- Multi-shop support (creators with multiple shops)
- Live sales tracking (real-time dashboard)
- Product-level analytics
- Affiliate network insights
- Campaign attribution
- Seasonal trend analysis

**Potential Integrations**:
- TikTok Creator Marketplace (brand deals)
- TikTok Live Gifts (livestream revenue)
- TikTok Ads Manager (advertising spend/ROI)

## Support Resources

**Official Documentation**:
- [TikTok Shop Partner Center](https://partner.tiktokshop.com)
- [TikTok Shop Seller University](https://seller.tiktokshop.com/university)
- [TikTok Developers Blog](https://developers.tiktok.com/blog)

**Integration Guides**:
- [Affiliate APIs Launch](https://developers.tiktok.com/blog/2024-tiktok-shop-affiliate-apis-launch-developer-opportunity)
- API Documentation (requires Partner Center access)

**Community**:
- TikTok Shop Seller Community Forums
- Developer Support Portal

## Appendix: Revenue Calculation Examples

### Example 1: Seller Revenue
```
Shop: Small Boutique
Orders (90 days): 150
Total GMV: $15,000
Average Order Value: $100
Return Rate: 5%

Net Revenue: $15,000 × (1 - 0.05) = $14,250
Monthly Revenue: $14,250 ÷ 3 = $4,750/month
Credit Score Impact: HIGH (verified transactions)
```

### Example 2: Creator Affiliate
```
Creator: Fashion Influencer
Orders Attributed: 200
Total Sales Generated: $30,000
Commission Rate: 15%
Total Commission: $4,500 (90 days)

Monthly Commission: $4,500 ÷ 3 = $1,500/month
Credit Score Impact: HIGH (verified commission payouts)
```

### Example 3: Hybrid (Seller + Affiliate)
```
User: Product Owner + Influencer
Own Shop Revenue: $10,000 (90 days)
Affiliate Commissions: $3,000 (90 days)
Total Income: $13,000

Monthly Income: $13,000 ÷ 3 = $4,333/month
Credit Score Impact: VERY HIGH (diversified income)
```

## Conclusion

TikTok Shop integration provides **actual verified revenue data** making it excellent for creator credit scoring. Its dual model (sellers + affiliates) makes it uniquely valuable for the creator economy, allowing influencers to verify income without owning inventory.

**Integration Priority: HIGH** - Implement alongside Shopify for comprehensive e-commerce coverage.
