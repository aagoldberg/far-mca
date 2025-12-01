import { NextRequest, NextResponse } from 'next/server';
import { StripeClient } from '@/lib/stripe-client/index';

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
    if (!process.env.STRIPE_CLIENT_ID || !process.env.STRIPE_CLIENT_SECRET) {
      console.error('Missing Stripe environment variables');
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const stripeClient = new StripeClient({
      clientId: process.env.STRIPE_CLIENT_ID,
      clientSecret: process.env.STRIPE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/callback`
    });

    // Encode wallet in state parameter (Stripe returns this unchanged in callback)
    const state = JSON.stringify({ wallet, nonce: Date.now() });
    const authUrl = stripeClient.getAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Stripe auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
