-- Borrower Profiles Table
-- Stores reputational collateral data for loan borrowers
-- This is the public-facing identity that creates accountability

CREATE TABLE IF NOT EXISTS borrower_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Borrower identification (links to wallet)
  wallet_address TEXT NOT NULL UNIQUE,

  -- Owner Identity (REQUIRED for loan requests)
  owner_full_name TEXT NOT NULL,
  owner_photo_url TEXT NOT NULL,
  owner_email TEXT,

  -- Social Proof (OPTIONAL - displayed publicly)
  instagram_handle TEXT,
  instagram_followers INTEGER,
  tiktok_handle TEXT,
  tiktok_followers INTEGER,
  linkedin_url TEXT,
  google_rating DECIMAL(2,1) CHECK (google_rating >= 1 AND google_rating <= 5),
  google_review_count INTEGER,
  yelp_rating DECIMAL(2,1) CHECK (yelp_rating >= 1 AND yelp_rating <= 5),
  yelp_review_count INTEGER,

  -- Computed Trust Boost (based on social proof provided)
  -- Calculated: Shopify=0, +Google=10, +Instagram1K=5, +LinkedIn=5, +Multiple=15
  trust_boost_percent INTEGER DEFAULT 0 CHECK (trust_boost_percent >= 0 AND trust_boost_percent <= 100),

  -- Platform-tracked loan history (updated by system)
  total_loans INTEGER DEFAULT 0,
  loans_repaid_on_time INTEGER DEFAULT 0,
  current_loan_status TEXT DEFAULT 'none' CHECK (current_loan_status IN ('none', 'current', 'late', 'delinquent', 'default')),
  days_past_due INTEGER DEFAULT 0,

  -- Profile visibility settings
  is_public BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_borrower_profiles_wallet
  ON borrower_profiles(wallet_address);

CREATE INDEX IF NOT EXISTS idx_borrower_profiles_loan_status
  ON borrower_profiles(current_loan_status) WHERE current_loan_status != 'none';

CREATE INDEX IF NOT EXISTS idx_borrower_profiles_trust_boost
  ON borrower_profiles(trust_boost_percent DESC);

-- Row Level Security (RLS)
ALTER TABLE borrower_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS borrower_profiles_select_policy ON borrower_profiles;
DROP POLICY IF EXISTS borrower_profiles_insert_policy ON borrower_profiles;
DROP POLICY IF EXISTS borrower_profiles_update_policy ON borrower_profiles;
DROP POLICY IF EXISTS borrower_profiles_public_select_policy ON borrower_profiles;

-- Policy: Public profiles are readable by anyone
CREATE POLICY borrower_profiles_public_select_policy
  ON borrower_profiles FOR SELECT
  USING (is_public = TRUE);

-- Policy: Users can read their own profile (even if not public)
CREATE POLICY borrower_profiles_select_policy
  ON borrower_profiles FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claim.sub', TRUE));

-- Policy: Users can insert their own profile
CREATE POLICY borrower_profiles_insert_policy
  ON borrower_profiles FOR INSERT
  WITH CHECK (wallet_address = current_setting('request.jwt.claim.sub', TRUE));

-- Policy: Users can update their own profile
CREATE POLICY borrower_profiles_update_policy
  ON borrower_profiles FOR UPDATE
  USING (wallet_address = current_setting('request.jwt.claim.sub', TRUE));

-- Function: Auto-calculate trust boost based on social proof
CREATE OR REPLACE FUNCTION calculate_trust_boost()
RETURNS TRIGGER AS $$
DECLARE
  boost INTEGER := 0;
  platform_count INTEGER := 0;
BEGIN
  -- Google Reviews: +10%
  IF NEW.google_rating IS NOT NULL AND NEW.google_review_count > 0 THEN
    boost := boost + 10;
    platform_count := platform_count + 1;
  END IF;

  -- Instagram with 1K+ followers: +5%
  IF NEW.instagram_handle IS NOT NULL AND COALESCE(NEW.instagram_followers, 0) >= 1000 THEN
    boost := boost + 5;
    platform_count := platform_count + 1;
  END IF;

  -- LinkedIn profile: +5%
  IF NEW.linkedin_url IS NOT NULL THEN
    boost := boost + 5;
    platform_count := platform_count + 1;
  END IF;

  -- TikTok with followers: +5%
  IF NEW.tiktok_handle IS NOT NULL AND COALESCE(NEW.tiktok_followers, 0) >= 1000 THEN
    boost := boost + 5;
    platform_count := platform_count + 1;
  END IF;

  -- Yelp reviews: +5%
  IF NEW.yelp_rating IS NOT NULL AND COALESCE(NEW.yelp_review_count, 0) > 0 THEN
    boost := boost + 5;
    platform_count := platform_count + 1;
  END IF;

  -- Multiple platforms bonus: +15% (if 3+ platforms)
  IF platform_count >= 3 THEN
    boost := boost + 15;
  END IF;

  NEW.trust_boost_percent := LEAST(boost, 100);
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Calculate trust boost on insert/update
DROP TRIGGER IF EXISTS borrower_profile_trust_boost_trigger ON borrower_profiles;
CREATE TRIGGER borrower_profile_trust_boost_trigger
  BEFORE INSERT OR UPDATE ON borrower_profiles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_trust_boost();

-- Comments
COMMENT ON TABLE borrower_profiles IS 'Reputational collateral for borrowers - public identity creates accountability';
COMMENT ON COLUMN borrower_profiles.owner_full_name IS 'Real name of business owner - required for loan requests';
COMMENT ON COLUMN borrower_profiles.owner_photo_url IS 'Photo of owner - creates personal accountability';
COMMENT ON COLUMN borrower_profiles.trust_boost_percent IS 'Calculated visibility boost based on social proof (0-100%)';
COMMENT ON COLUMN borrower_profiles.current_loan_status IS 'Public loan status: none, current, late, delinquent, default';
