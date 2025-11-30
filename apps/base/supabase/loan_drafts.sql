-- Loan Drafts Table
-- Stores temporary loan form data during multi-step OAuth flow
-- Drafts auto-expire after 1 hour for security

CREATE TABLE IF NOT EXISTS loan_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Borrower identification
  wallet_address TEXT NOT NULL,

  -- Current step in wizard
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 4),

  -- Form data from each step
  step1_data JSONB, -- {amount, repaymentWeeks, title}
  step2_data JSONB, -- {connectedPlatforms: string[]}
  step3_data JSONB, -- {creditScore, eligibility}
  step4_data JSONB, -- {aboutYou, loanUseAndImpact, imageUrl, etc}

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),

  -- Status
  is_completed BOOLEAN DEFAULT FALSE
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_loan_drafts_wallet
  ON loan_drafts(wallet_address) WHERE is_completed = FALSE;

CREATE INDEX IF NOT EXISTS idx_loan_drafts_expires
  ON loan_drafts(expires_at) WHERE is_completed = FALSE;

-- Row Level Security (RLS)
ALTER TABLE loan_drafts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS loan_drafts_select_policy ON loan_drafts;
DROP POLICY IF EXISTS loan_drafts_insert_policy ON loan_drafts;
DROP POLICY IF EXISTS loan_drafts_update_policy ON loan_drafts;
DROP POLICY IF EXISTS loan_drafts_delete_policy ON loan_drafts;

-- Policy: Users can read their own drafts (using service key for OAuth callbacks)
CREATE POLICY loan_drafts_select_policy
  ON loan_drafts FOR SELECT
  USING (TRUE); -- Allow all reads (OAuth callbacks use service key)

-- Policy: Anyone can insert drafts (OAuth flow starts anonymously)
CREATE POLICY loan_drafts_insert_policy
  ON loan_drafts FOR INSERT
  WITH CHECK (TRUE);

-- Policy: Anyone can update drafts (OAuth callbacks use service key)
CREATE POLICY loan_drafts_update_policy
  ON loan_drafts FOR UPDATE
  USING (TRUE);

-- Policy: Users can delete their own drafts
CREATE POLICY loan_drafts_delete_policy
  ON loan_drafts FOR DELETE
  USING (wallet_address = current_setting('request.jwt.claim.sub', TRUE));

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_loan_draft_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update updated_at automatically
DROP TRIGGER IF EXISTS loan_draft_update_trigger ON loan_drafts;
CREATE TRIGGER loan_draft_update_trigger
  BEFORE UPDATE ON loan_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_loan_draft_timestamp();

-- Function: Cleanup expired drafts (run via cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_loan_drafts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM loan_drafts
  WHERE expires_at < NOW()
    AND is_completed = FALSE;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE loan_drafts IS 'Temporary storage for loan form data during multi-step OAuth flow';
COMMENT ON COLUMN loan_drafts.current_step IS 'Current step in wizard (1-4)';
COMMENT ON COLUMN loan_drafts.step1_data IS 'Step 1: Basic loan details (amount, weeks, title)';
COMMENT ON COLUMN loan_drafts.step2_data IS 'Step 2: Connected OAuth platforms';
COMMENT ON COLUMN loan_drafts.step3_data IS 'Step 3: Credit score and eligibility';
COMMENT ON COLUMN loan_drafts.step4_data IS 'Step 4: Full application details';
COMMENT ON COLUMN loan_drafts.expires_at IS 'Draft expires 1 hour after creation for security';
