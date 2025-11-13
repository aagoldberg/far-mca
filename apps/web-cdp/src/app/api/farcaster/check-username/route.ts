import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-z0-9][a-z0-9-]{0,15}$/.test(username)) {
      return NextResponse.json({
        available: false,
        error: 'Invalid username format. Must be 1-16 characters, lowercase letters, numbers, and hyphens only.',
      });
    }

    // Check if username is available using Neynar API
    try {
      const userInfo = await neynarClient.fetchBulkUsers([username], { viewerFid: 0 });

      // If we get user data back, username is taken
      if (userInfo.users && userInfo.users.length > 0) {
        return NextResponse.json({
          available: false,
          message: 'Username already taken',
        });
      }

      // Username is available
      return NextResponse.json({
        available: true,
        message: 'Username is available!',
      });
    } catch (error: any) {
      // If user not found, username is available
      if (error.message?.includes('not found') || error.status === 404) {
        return NextResponse.json({
          available: true,
          message: 'Username is available!',
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check username availability' },
      { status: 500 }
    );
  }
}
