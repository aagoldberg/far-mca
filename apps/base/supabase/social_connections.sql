-- Social Connections Table
-- Stores verified friendships/connections across social platforms
-- Designed for easy migration to on-chain storage (EAS) later
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS social_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User who is attesting the connection
  attester_address TEXT NOT NULL,
  attester_platform_id TEXT,

  -- User being attested (the friend)
  friend_address TEXT NOT NULL,
  friend_platform_id TEXT,

  -- Connection details
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'discord', 'farcaster', 'bluesky', 'google')),
  connection_type TEXT NOT NULL DEFAULT 'friend' CHECK (connection_type IN ('friend', 'mutual', 'follower', 'following', 'colleague')),

  -- Verification metadata
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_data JSONB,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,

  -- Future migration fields (for when we move to EAS on-chain)
  on_chain_attestation_uid TEXT,
  migrated_to_chain BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_active_connection UNIQUE (attester_address, friend_address, platform, is_active),
  CONSTRAINT no_self_connection CHECK (attester_address != friend_address)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_connections_attester ON social_connections(attester_address) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_social_connections_friend ON social_connections(friend_address) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_social_connections_platform ON social_connections(platform) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_social_connections_mutual ON social_connections(attester_address, friend_address) WHERE is_active = TRUE;

-- Trigger to auto-update updated_at (reuses function from schema.sql)
DROP TRIGGER IF EXISTS update_social_connections_updated_at ON social_connections;
CREATE TRIGGER update_social_connections_updated_at
  BEFORE UPDATE ON social_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

-- Policy: Service role has full access (for API routes)
CREATE POLICY "Service role has full access to social connections"
  ON social_connections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Anyone can read active connections (for transparency)
CREATE POLICY "Anyone can read active social connections"
  ON social_connections
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- Comments
COMMENT ON TABLE social_connections IS 'Stores verified social connections between users across platforms. Will migrate to on-chain attestations (EAS) later.';
COMMENT ON COLUMN social_connections.attester_address IS 'Wallet address of user creating the attestation';
COMMENT ON COLUMN social_connections.friend_address IS 'Wallet address of friend being attested';
COMMENT ON COLUMN social_connections.platform IS 'Social platform where friendship was verified (facebook, instagram, etc.)';
COMMENT ON COLUMN social_connections.connection_type IS 'Type of relationship (friend, mutual, follower, etc.)';
COMMENT ON COLUMN social_connections.verification_data IS 'Platform-specific verification metadata (e.g., Facebook friendship proof)';
COMMENT ON COLUMN social_connections.on_chain_attestation_uid IS 'EAS attestation UID when migrated to Base blockchain';
COMMENT ON COLUMN social_connections.is_active IS 'Whether this connection is currently active (false = revoked)';
