import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors when env vars are missing
let supabase: ReturnType<typeof createClient> | null = null;

export function getSupabaseServer() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_KEY || 'placeholder'
    );
  }
  return supabase;
}
