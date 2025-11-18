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

-- =============================================================================
-- Loan Channels Table
-- Tracks XMTP group chats for each loan
-- =============================================================================

CREATE TABLE IF NOT EXISTS loan_channels (
  loan_address TEXT PRIMARY KEY,

  -- XMTP group chat (private contributor discussion)
  xmtp_group_id TEXT NOT NULL,
  xmtp_created_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xmtp_group ON loan_channels(xmtp_group_id);

ALTER TABLE loan_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access on loan_channels"
  ON loan_channels
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE loan_channels IS 'Tracks XMTP group chats for each loan';
COMMENT ON COLUMN loan_channels.loan_address IS 'Loan contract address (lowercase)';
COMMENT ON COLUMN loan_channels.xmtp_group_id IS 'XMTP group ID for private contributor chat';

-- =============================================================================
-- XMTP Inbox IDs Table
-- Stores user XMTP inbox IDs for adding to groups
-- =============================================================================

CREATE TABLE IF NOT EXISTS xmtp_inbox_ids (
  wallet_address TEXT PRIMARY KEY,
  inbox_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inbox_id ON xmtp_inbox_ids(inbox_id);

ALTER TABLE xmtp_inbox_ids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access on xmtp_inbox_ids"
  ON xmtp_inbox_ids
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE xmtp_inbox_ids IS 'Stores XMTP inbox IDs for wallet addresses';
COMMENT ON COLUMN xmtp_inbox_ids.wallet_address IS 'Ethereum wallet address (lowercase)';
COMMENT ON COLUMN xmtp_inbox_ids.inbox_id IS 'XMTP inbox ID for this wallet';

-- =============================================================================
-- Contribution Messages Table
-- Stores messages left by contributors
-- =============================================================================

CREATE TABLE IF NOT EXISTS contribution_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_address TEXT NOT NULL,
  contributor_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  message TEXT NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Moderation
  is_hidden BOOLEAN DEFAULT FALSE,
  hidden_reason TEXT,

  CHECK (char_length(message) <= 280),
  CHECK (char_length(message) > 0)
);

CREATE INDEX IF NOT EXISTS idx_loan_messages ON contribution_messages(loan_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributor_messages ON contribution_messages(contributor_address);
CREATE INDEX IF NOT EXISTS idx_transaction_hash ON contribution_messages(transaction_hash);

ALTER TABLE contribution_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access on contribution_messages"
  ON contribution_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE contribution_messages IS 'Messages left by contributors when funding loans';
COMMENT ON COLUMN contribution_messages.loan_address IS 'Loan contract address (lowercase)';
COMMENT ON COLUMN contribution_messages.contributor_address IS 'Contributor wallet address (lowercase)';
COMMENT ON COLUMN contribution_messages.amount IS 'Contribution amount in USDC (human-readable)';
COMMENT ON COLUMN contribution_messages.message IS 'Support message (max 280 chars)';
COMMENT ON COLUMN contribution_messages.is_hidden IS 'Moderation flag to hide spam/inappropriate messages';
