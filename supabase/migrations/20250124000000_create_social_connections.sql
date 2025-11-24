-- Create social_connections table for storing linked social accounts
-- Replaces Privy's built-in social account storage

CREATE TABLE IF NOT EXISTS social_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Wallet association
  wallet_address TEXT NOT NULL,

  -- Platform info
  platform TEXT NOT NULL, -- 'google', 'apple', 'twitter', 'farcaster', 'discord', 'github', 'linkedin'
  platform_user_id TEXT, -- Platform-specific user ID (FID for Farcaster, sub for OAuth providers)

  -- Profile data
  username TEXT,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,

  -- OAuth tokens (encrypted)
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,

  -- Farcaster-specific
  fid INTEGER,
  follower_count INTEGER,
  following_count INTEGER,
  verified_addresses JSONB, -- {eth_addresses: [], sol_addresses: []}

  -- Metadata
  raw_data JSONB, -- Store full platform response for future use
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,

  -- Constraints
  UNIQUE(wallet_address, platform, platform_user_id)
);

-- Indexes for performance
CREATE INDEX idx_social_connections_wallet ON social_connections(wallet_address);
CREATE INDEX idx_social_connections_platform ON social_connections(platform);
CREATE INDEX idx_social_connections_fid ON social_connections(fid) WHERE fid IS NOT NULL;
CREATE INDEX idx_social_connections_email ON social_connections(email) WHERE email IS NOT NULL;

-- Row Level Security (RLS)
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own connections
CREATE POLICY "Users can view own social connections"
  ON social_connections
  FOR SELECT
  USING (wallet_address = LOWER(current_setting('request.jwt.claim.wallet_address', TRUE)));

-- Policy: Users can insert their own connections
CREATE POLICY "Users can add own social connections"
  ON social_connections
  FOR INSERT
  WITH CHECK (wallet_address = LOWER(current_setting('request.jwt.claim.wallet_address', TRUE)));

-- Policy: Users can update their own connections
CREATE POLICY "Users can update own social connections"
  ON social_connections
  FOR UPDATE
  USING (wallet_address = LOWER(current_setting('request.jwt.claim.wallet_address', TRUE)));

-- Policy: Users can delete their own connections
CREATE POLICY "Users can delete own social connections"
  ON social_connections
  FOR DELETE
  USING (wallet_address = LOWER(current_setting('request.jwt.claim.wallet_address', TRUE)));

-- Function to update last_synced_at automatically
CREATE OR REPLACE FUNCTION update_social_connection_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_synced_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp on update
CREATE TRIGGER update_social_connection_timestamp
  BEFORE UPDATE ON social_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_social_connection_timestamp();

-- Comments for documentation
COMMENT ON TABLE social_connections IS 'Stores linked social accounts for wallet addresses (CDP migration from Privy)';
COMMENT ON COLUMN social_connections.platform IS 'Social platform: google, apple, twitter, farcaster, discord, github, linkedin';
COMMENT ON COLUMN social_connections.fid IS 'Farcaster ID (only for Farcaster platform)';
COMMENT ON COLUMN social_connections.access_token IS 'OAuth access token (should be encrypted at app level)';
COMMENT ON COLUMN social_connections.verified_addresses IS 'Farcaster verified addresses (eth_addresses, sol_addresses)';
