-- Run this in Supabase SQL Editor to add your existing signer

INSERT INTO farcaster_accounts (
  wallet_address,
  fid,
  username,
  signer_uuid,
  signer_status,
  last_verified_at
) VALUES (
  '0x9ad8d025387465e33ed509e0503a10ace5123998',
  1471595,
  'andrewag',
  '89ebe982-95e6-4ec3-ab8d-4d9f4c0c6ede',
  'approved',
  NOW()
)
ON CONFLICT (wallet_address)
DO UPDATE SET
  signer_uuid = EXCLUDED.signer_uuid,
  last_verified_at = NOW();
