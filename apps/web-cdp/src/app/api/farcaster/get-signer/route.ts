import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

/**
 * Retrieve signer UUID from database
 * This is the "permission slip" that allows profile updates
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const walletAddress = searchParams.get('wallet');

    if (!fid && !walletAddress) {
      return NextResponse.json(
        { error: 'FID or wallet address required' },
        { status: 400 }
      );
    }

    console.log('[Farcaster] Looking for signer in database...');

    const supabase = getSupabaseAdmin();

    // Query database by wallet address (primary) or FID (fallback)
    let query = supabase
      .from('farcaster_accounts')
      .select('*');

    if (walletAddress) {
      query = query.eq('wallet_address', walletAddress.toLowerCase());
    } else if (fid) {
      query = query.eq('fid', parseInt(fid));
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        console.log('[Farcaster] No signer found in database');
        return NextResponse.json({
          success: false,
          signer_uuid: null,
          message: 'No signer found. Account may need to be created.',
        });
      }

      throw error;
    }

    if (data && data.signer_uuid) {
      console.log('[Farcaster] ✓ Found signer in database');
      return NextResponse.json({
        success: true,
        signer_uuid: data.signer_uuid,
        signer_status: data.signer_status,
        signer_approval_url: data.signer_approval_url,
        fid: data.fid,
        username: data.username,
        source: 'database',
      });
    }

    return NextResponse.json({
      success: false,
      signer_uuid: null,
      message: 'Signer not found',
    });

  } catch (error: any) {
    console.error('[Farcaster] Database error:', error);

    // Check if it's a Supabase configuration error
    if (error.message?.includes('Missing Supabase')) {
      return NextResponse.json(
        {
          success: false,
          signer_uuid: null,
          error: 'Database not configured. Please set up Supabase.',
          setup_required: true,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        signer_uuid: null,
        error: error.message || 'Failed to retrieve signer'
      },
      { status: 500 }
    );
  }
}
