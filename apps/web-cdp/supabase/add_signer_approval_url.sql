-- Add signer_approval_url column to farcaster_accounts table
-- Run this in Supabase SQL Editor

ALTER TABLE farcaster_accounts
ADD COLUMN IF NOT EXISTS signer_approval_url TEXT;

COMMENT ON COLUMN farcaster_accounts.signer_approval_url IS 'Farcaster app URL where user approves the signer (app.neynar.com)';
