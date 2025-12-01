import { NextRequest, NextResponse } from 'next/server';

/**
 * Farcaster Cast Action Handler
 * POST /api/action/fund
 *
 * This handles the "Fund This Loan" cast action defined in farcaster.json
 * When a user clicks the action on a cast, it opens the Mini App to the loan.
 *
 * Cast actions allow users to interact with your app directly from casts.
 */

interface CastActionRequest {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    castId: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CastActionRequest = await request.json();

    console.log('[CastAction] Fund action triggered by FID:', body.untrustedData.fid);
    console.log('[CastAction] Cast URL:', body.untrustedData.url);

    // The cast URL might contain a loan link - try to extract it
    const castUrl = body.untrustedData.url;

    // Try to find a loan address in the cast URL or text
    // Pattern: /loan/0x... or loan address in the cast
    const loanAddressMatch = castUrl.match(/\/loan\/(0x[a-fA-F0-9]{40})/);

    if (loanAddressMatch) {
      // Redirect to the loan page in the Mini App
      const loanAddress = loanAddressMatch[1];
      const appUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3005');

      return NextResponse.json({
        type: 'frame',
        frameUrl: `${appUrl}/loan/${loanAddress}`,
      });
    }

    // No loan found - redirect to home to browse loans
    const appUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3005');

    return NextResponse.json({
      type: 'frame',
      frameUrl: appUrl,
    });
  } catch (error) {
    console.error('[CastAction] Error handling fund action:', error);
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 });
  }
}

// Handle GET for action metadata
export async function GET() {
  return NextResponse.json({
    name: 'Fund This Loan',
    icon: 'dollar-sign',
    description: 'Fund a loan directly from any cast',
    aboutUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://lendfriend-base.vercel.app',
    action: {
      type: 'post',
    },
  });
}
