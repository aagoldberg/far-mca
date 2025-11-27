import { NextRequest, NextResponse } from 'next/server';
import { SquareClient } from '@/lib/square-client/index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.SQUARE_APPLICATION_ID || !process.env.SQUARE_APPLICATION_SECRET) {
      console.error('Missing Square environment variables');
      return NextResponse.json(
        { error: 'Square not configured' },
        { status: 500 }
      );
    }

    const environment = (process.env.SQUARE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';

    const squareClient = new SquareClient({
      applicationId: process.env.SQUARE_APPLICATION_ID,
      applicationSecret: process.env.SQUARE_APPLICATION_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/square/callback`,
      environment,
    });

    // Generate state parameter for CSRF protection and wallet tracking
    // State will be passed back by Square, so we can retrieve the wallet from it
    const state = `${wallet}-${Date.now()}`;
    const authUrl = squareClient.getAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Square auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
