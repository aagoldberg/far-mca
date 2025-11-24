-- Create social_verifications table for attesting social connections
-- This is SEPARATE from social_connections (OAuth account linking)

CREATE TABLE IF NOT EXISTS social_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Attestation parties
  attester_address TEXT NOT NULL,       -- Wallet making the claim
  attester_platform_id TEXT NOT NULL,   -- Their platform ID
  friend_address TEXT NOT NULL,         -- Friend's wallet
  friend_platform_id TEXT,              -- Friend's platform ID (optional)

  -- Platform info
  platform TEXT NOT NULL,               -- 'facebook', 'instagram', 'twitter', 'farcaster', etc.
  connection_type TEXT NOT NULL,        -- 'friend', 'mutual', 'follower', 'following', 'colleague'

  -- Verification metadata
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration
  is_active BOOLEAN DEFAULT TRUE,

  -- Proof data (optional)
  proof_data JSONB,                     -- API responses, signatures, etc.

  -- Constraints
  UNIQUE(attester_address, friend_address, platform, is_active)
);

-- Indexes for performance
CREATE INDEX idx_social_verifications_attester ON social_verifications(attester_address);
CREATE INDEX idx_social_verifications_friend ON social_verifications(friend_address);
CREATE INDEX idx_social_verifications_platform ON social_verifications(platform);
CREATE INDEX idx_social_verifications_both_addresses ON social_verifications(attester_address, friend_address);

-- Row Level Security (RLS)
ALTER TABLE social_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read verifications (public attestations)
CREATE POLICY "Anyone can view social verifications"
  ON social_verifications
  FOR SELECT
  USING (true);

-- Policy: Users can create verifications for their own wallet
CREATE POLICY "Users can create own verifications"
  ON social_verifications
  FOR INSERT
  WITH CHECK (attester_address = LOWER(current_setting('request.jwt.claim.wallet_address', TRUE)));

-- Policy: Users can update their own verifications
CREATE POLICY "Users can update own verifications"
  ON social_verifications
  FOR UPDATE
  USING (attester_address = LOWER(current_setting('request.jwt.claim.wallet_address', TRUE)));

-- Policy: Users can delete their own verifications
CREATE POLICY "Users can delete own verifications"
  ON social_verifications
  FOR DELETE
  USING (attester_address = LOWER(current_setting('request.jwt.claim.wallet_address', TRUE)));

-- Comments
COMMENT ON TABLE social_verifications IS 'Social connection attestations between wallets (separate from OAuth account linking)';
COMMENT ON COLUMN social_verifications.attester_address IS 'Wallet address making the attestation';
COMMENT ON COLUMN social_verifications.friend_address IS 'Friend''s wallet address being attested to';
COMMENT ON COLUMN social_verifications.connection_type IS 'Type of social connection: friend, mutual, follower, following, colleague';
