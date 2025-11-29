import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Handle Farcaster OAuth callback
 * Verifies the auth response and stores connection in Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return sendMessageToOpener({
        type: 'FARCASTER_AUTH_ERROR',
        error: error || 'Authentication failed',
      });
    }

    if (!code || !state) {
      return sendMessageToOpener({
        type: 'FARCASTER_AUTH_ERROR',
        error: 'Missing authentication parameters',
      });
    }

    // Decode state to get wallet address
    const { wallet, nonce } = JSON.parse(
      Buffer.from(state, 'base64').toString('utf-8')
    );

    if (!wallet) {
      return sendMessageToOpener({
        type: 'FARCASTER_AUTH_ERROR',
        error: 'Invalid state parameter',
      });
    }

    // Exchange code for Farcaster profile data
    // Note: In production, you'd verify the signature and get user data
    // For now, we'll use Neynar to fetch profile data
    const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

    // TODO: Implement proper SIWF verification
    // For now, we'll fetch by username or FID if provided in callback
    const fid = parseInt(searchParams.get('fid') || '0');
    if (!fid) {
      return sendMessageToOpener({
        type: 'FARCASTER_AUTH_ERROR',
        error: 'No Farcaster ID provided',
      });
    }

    // Fetch full profile from Neynar
    const response = await neynar.fetchBulkUsers([fid]);
    const user = response.users[0];

    if (!user) {
      return sendMessageToOpener({
        type: 'FARCASTER_AUTH_ERROR',
        error: 'Failed to fetch Farcaster profile',
      });
    }

    // Store connection in Supabase
    const { data: connection, error: dbError } = await supabase
      .from('social_connections')
      .upsert({
        wallet_address: wallet.toLowerCase(),
        platform: 'farcaster',
        platform_user_id: fid.toString(),
        fid,
        username: user.username,
        display_name: user.display_name || user.username,
        avatar_url: user.pfp_url,
        bio: user.profile?.bio?.text,
        follower_count: user.follower_count,
        following_count: user.following_count,
        verified_addresses: user.verified_addresses,
        raw_data: user,
        connected_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        is_active: true,
      }, {
        onConflict: 'wallet_address,platform,platform_user_id'
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Farcaster Callback] Database error:', dbError);
      return sendMessageToOpener({
        type: 'FARCASTER_AUTH_ERROR',
        error: 'Failed to save connection',
      });
    }

    console.log('[Farcaster] Successfully connected:', {
      wallet: wallet.toLowerCase(),
      fid,
      username: user.username,
    });

    // Send success message to opener window
    return sendMessageToOpener({
      type: 'FARCASTER_AUTH_SUCCESS',
      profile: {
        fid: user.fid,
        username: user.username,
        display_name: user.display_name || user.username,
        pfp_url: user.pfp_url,
        bio: user.profile?.bio?.text,
        follower_count: user.follower_count,
        following_count: user.following_count,
        verified_addresses: user.verified_addresses,
      },
    });
  } catch (error) {
    console.error('[Farcaster Callback] Error:', error);
    return sendMessageToOpener({
      type: 'FARCASTER_AUTH_ERROR',
      error: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
}

/**
 * Helper to send postMessage to opener window and close popup
 */
function sendMessageToOpener(data: any) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Farcaster Authentication</title>
      </head>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage(${JSON.stringify(data)}, '*');
            window.close();
          } else {
            document.body.innerHTML = '<h1>Authentication ${data.type === 'FARCASTER_AUTH_SUCCESS' ? 'Successful' : 'Failed'}</h1><p>You can close this window.</p>';
          }
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
