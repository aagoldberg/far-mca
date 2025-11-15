-- Farcaster Accounts Table
-- Stores signer_uuid for persistent, cross-device profile editing
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS farcaster_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  fid INTEGER NOT NULL,
  username TEXT NOT NULL,
  signer_uuid TEXT NOT NULL,
  public_key TEXT,
  signer_status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(wallet_address),
  UNIQUE(fid),
  UNIQUE(signer_uuid)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_wallet_address ON farcaster_accounts(wallet_address);
CREATE INDEX IF NOT EXISTS idx_fid ON farcaster_accounts(fid);
CREATE INDEX IF NOT EXISTS idx_signer_uuid ON farcaster_accounts(signer_uuid);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_farcaster_accounts_updated_at ON farcaster_accounts;
CREATE TRIGGER update_farcaster_accounts_updated_at
  BEFORE UPDATE ON farcaster_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE farcaster_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Service role has full access (for API routes)
CREATE POLICY "Service role has full access"
  ON farcaster_accounts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE farcaster_accounts IS 'Stores Farcaster signer_uuid for persistent profile editing';
COMMENT ON COLUMN farcaster_accounts.wallet_address IS 'Ethereum wallet address (lowercase)';
COMMENT ON COLUMN farcaster_accounts.fid IS 'Farcaster ID';
COMMENT ON COLUMN farcaster_accounts.signer_uuid IS 'Neynar signer UUID - the "permission slip" to update profiles';
COMMENT ON COLUMN farcaster_accounts.signer_status IS 'Signer status: approved, pending, revoked';
