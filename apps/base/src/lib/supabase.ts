import { createClient } from '@supabase/supabase-js';

// Supabase client for server-side operations (API routes)
// Uses service key for full database access
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Supabase] Missing environment variables');
    throw new Error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Database types
export interface FarcasterAccount {
  id?: string;
  wallet_address: string;
  fid: number;
  username: string;
  signer_uuid: string;
  public_key?: string;
  signer_status?: string;
  created_at?: string;
  updated_at?: string;
  last_verified_at?: string;
}
