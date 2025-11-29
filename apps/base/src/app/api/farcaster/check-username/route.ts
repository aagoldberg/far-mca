import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});
const neynarClient = new NeynarAPIClient(config);

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

    // Check if username is available using Neynar fname availability endpoint
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/fname/availability?fname=${encodeURIComponent(username)}`,
      {
        headers: {
          'x-api-key': process.env.NEYNAR_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.available) {
      return NextResponse.json({
        available: true,
        message: 'Username is available!',
      });
    } else {
      return NextResponse.json({
        available: false,
        message: 'Username already taken',
      });
    }
  } catch (error: any) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check username availability' },
      { status: 500 }
    );
  }
}
