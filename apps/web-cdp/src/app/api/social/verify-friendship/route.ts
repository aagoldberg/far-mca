import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Verify friendship between two users on a social platform
 * POST /api/social/verify-friendship
 *
 * Body: {
 *   platform: 'facebook' | 'instagram' | 'twitter' | etc.,
 *   attesterAddress: '0x123...',
 *   attesterPlatformId: 'facebook_user_id',
 *   friendAddress: '0x456...',
 *   friendPlatformId: 'facebook_friend_id'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const {
      platform,
      attesterAddress,
      attesterPlatformId,
      friendAddress,
      friendPlatformId,
    } = await request.json();

    // Validation
    if (!platform || !attesterAddress || !friendAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify they're actually friends on the platform
    let areFriends = false;

    switch (platform) {
      case 'facebook':
        areFriends = await verifyFacebookFriendship(
          attesterPlatformId,
          friendPlatformId
        );
        break;

      case 'instagram':
        areFriends = await verifyInstagramConnection(
          attesterPlatformId,
          friendPlatformId
        );
        break;

      case 'farcaster':
        // Farcaster is already handled by your existing Neynar integration
        areFriends = await verifyFarcasterConnection(
          attesterPlatformId,
          friendPlatformId
        );
        break;

      default:
        return NextResponse.json(
          { error: `Platform ${platform} not yet supported` },
          { status: 400 }
        );
    }

    if (!areFriends) {
      return NextResponse.json(
        {
          success: false,
          error: `Not connected on ${platform}`,
          areFriends: false
        },
        { status: 200 }
      );
    }

    // Store the verified connection in Supabase
    const { data, error } = await supabase
      .from('social_connections')
      .upsert({
        attester_address: attesterAddress.toLowerCase(),
        attester_platform_id: attesterPlatformId,
        friend_address: friendAddress.toLowerCase(),
        friend_platform_id: friendPlatformId,
        platform,
        connection_type: 'friend',
        verified_at: new Date().toISOString(),
        is_active: true,
      }, {
        onConflict: 'attester_address,friend_address,platform,is_active',
      })
      .select()
      .single();

    if (error) {
      console.error('[Social Verification] Error storing connection:', error);
      return NextResponse.json(
        { error: 'Failed to store connection' },
        { status: 500 }
      );
    }

    console.log('[Social Verification] ✓ Connection verified and stored:', data.id);

    return NextResponse.json({
      success: true,
      areFriends: true,
      connection: data,
    });

  } catch (error: any) {
    console.error('[Social Verification] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Verify Facebook friendship via Graph API
 */
async function verifyFacebookFriendship(
  userId: string,
  friendId: string
): Promise<boolean> {
  try {
    // Get user's friends from Facebook
    // Note: This only works if BOTH users have connected Facebook to your app
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${userId}/friends`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.FACEBOOK_APP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      console.error('[Facebook] API error:', response.status);
      return false;
    }

    const data = await response.json();
    const friends = data.data || [];

    // Check if friendId is in the friends list
    const areFriends = friends.some((f: any) => f.id === friendId);

    return areFriends;

  } catch (error) {
    console.error('[Facebook] Verification error:', error);
    return false;
  }
}

/**
 * Verify Instagram connection via Graph API
 */
async function verifyInstagramConnection(
  userId: string,
  friendId: string
): Promise<boolean> {
  try {
    // Instagram API is similar to Facebook (both owned by Meta)
    // Note: Also requires both users to have connected Instagram

    // For now, return false - implement when Instagram is added
    return false;

  } catch (error) {
    console.error('[Instagram] Verification error:', error);
    return false;
  }
}

/**
 * Verify Farcaster connection via existing Neynar integration
 */
async function verifyFarcasterConnection(
  fid1: string,
  fid2: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid1},${fid2}`,
      {
        headers: {
          'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    // Check if both users exist
    if (!data.users || data.users.length < 2) {
      return false;
    }

    // For Farcaster, check if they follow each other
    const user1 = data.users.find((u: any) => u.fid === parseInt(fid1));
    const user2 = data.users.find((u: any) => u.fid === parseInt(fid2));

    if (!user1 || !user2) {
      return false;
    }

    // Check mutual follows via Neynar
    const followResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/following/bulk?fids=${fid1},${fid2}`,
      {
        headers: {
          'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
        },
      }
    );

    if (!followResponse.ok) {
      return false;
    }

    const followData = await followResponse.json();

    // Check if user1 follows user2 AND user2 follows user1
    const user1Follows = followData[fid1]?.following || [];
    const user2Follows = followData[fid2]?.following || [];

    const mutualFollow =
      user1Follows.some((f: any) => f.fid === parseInt(fid2)) &&
      user2Follows.some((f: any) => f.fid === parseInt(fid1));

    return mutualFollow;

  } catch (error) {
    console.error('[Farcaster] Verification error:', error);
    return false;
  }
}
