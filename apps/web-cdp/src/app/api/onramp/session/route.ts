import { NextRequest, NextResponse } from 'next/server';

const CDP_API_KEY_ID = process.env.CDP_API_KEY_ID;
const NEXT_PUBLIC_CDP_API_KEY = process.env.NEXT_PUBLIC_CDP_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { addresses } = await request.json();

    // Use whichever API key is available
    const apiKey = CDP_API_KEY_ID || NEXT_PUBLIC_CDP_API_KEY;

    if (!apiKey) {
      console.error('[Onramp] Missing CDP API key');
      return NextResponse.json(
        { error: 'CDP API key not configured' },
        { status: 500 }
      );
    }

    console.log('[Onramp] Generating session token with addresses:', addresses);

    // Generate session token using Coinbase CDP API
    const response = await fetch('https://api.developer.coinbase.com/onramp/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        addresses: addresses || {},
      }),
    });

    const responseText = await response.text();
    console.log('[Onramp] API response status:', response.status);
    console.log('[Onramp] API response:', responseText);

    if (!response.ok) {
      console.error('[Onramp] Failed to generate session token');
      return NextResponse.json(
        { error: 'Failed to generate session token', details: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      sessionToken: data.token,
    });
  } catch (error: any) {
    console.error('[Onramp] Error generating session token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate session token' },
      { status: 500 }
    );
  }
}
