-- Business Connections Table
-- Stores OAuth connections to business platforms (Shopify, Stripe, Square, Plaid)
-- Used for credit scoring and revenue verification

CREATE TABLE IF NOT EXISTS business_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Borrower identification
  wallet_address TEXT NOT NULL,

  -- Platform details
  platform TEXT NOT NULL CHECK (platform IN ('shopify', 'stripe', 'square', 'plaid')),
  platform_user_id TEXT NOT NULL, -- Shopify shop domain, Stripe account ID, etc.

  -- OAuth tokens (should be encrypted in production)
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,

  -- Revenue/Business data
  revenue_data JSONB, -- {totalRevenue, orderCount, periodDays, currency, etc}
  credit_score INTEGER CHECK (credit_score >= 0 AND credit_score <= 100),

  -- Platform-specific metadata
  metadata JSONB, -- Additional platform-specific data

  -- Timestamps
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Unique constraint: one connection per wallet + platform + user_id
  CONSTRAINT unique_business_connection UNIQUE (wallet_address, platform, platform_user_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_business_connections_wallet
  ON business_connections(wallet_address) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_business_connections_platform
  ON business_connections(platform) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_business_connections_last_synced
  ON business_connections(last_synced_at);

-- Row Level Security (RLS)
ALTER TABLE business_connections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS business_connections_select_policy ON business_connections;
DROP POLICY IF EXISTS business_connections_insert_policy ON business_connections;
DROP POLICY IF EXISTS business_connections_update_policy ON business_connections;

-- Policy: Users can read their own connections
CREATE POLICY business_connections_select_policy
  ON business_connections FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claim.sub', TRUE));

-- Policy: Users can insert their own connections
CREATE POLICY business_connections_insert_policy
  ON business_connections FOR INSERT
  WITH CHECK (wallet_address = current_setting('request.jwt.claim.sub', TRUE));

-- Policy: Users can update their own connections
CREATE POLICY business_connections_update_policy
  ON business_connections FOR UPDATE
  USING (wallet_address = current_setting('request.jwt.claim.sub', TRUE));

-- Function: Auto-update last_synced_at on revenue_data change
CREATE OR REPLACE FUNCTION update_business_connection_sync_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.revenue_data IS DISTINCT FROM OLD.revenue_data THEN
    NEW.last_synced_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update last_synced_at automatically
CREATE TRIGGER business_connection_sync_trigger
  BEFORE UPDATE ON business_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_business_connection_sync_time();

-- Comments
COMMENT ON TABLE business_connections IS 'Stores OAuth connections to business platforms for credit scoring';
COMMENT ON COLUMN business_connections.access_token IS 'OAuth access token - should be encrypted';
COMMENT ON COLUMN business_connections.revenue_data IS 'JSON with totalRevenue, orderCount, periodDays, currency';
COMMENT ON COLUMN business_connections.credit_score IS 'Calculated credit score 0-100 based on revenue data';
