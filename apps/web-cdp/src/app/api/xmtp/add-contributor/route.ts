/**
 * API Route: Add Contributor to XMTP Group
 *
 * Called after a successful contribution to add the contributor to the loan's XMTP group.
 * This enables them to participate in the private contributor discussion.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { loanAddress, contributorAddress, contributorInboxId } = await request.json();

    console.log('[XMTP Add Contributor] Request:', {
      loanAddress,
      contributorAddress,
    });

    // Validate required fields
    if (!loanAddress || !contributorAddress || !contributorInboxId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the contributor's inbox ID
    const { error: inboxError } = await supabase
      .from('xmtp_inbox_ids')
      .upsert({
        wallet_address: contributorAddress.toLowerCase(),
        inbox_id: contributorInboxId,
        last_used_at: new Date().toISOString(),
      });

    if (inboxError) {
      console.error('[XMTP Add Contributor] Failed to store inbox ID:', inboxError);
      return NextResponse.json(
        { success: false, error: 'Failed to store inbox ID' },
        { status: 500 }
      );
    }

    // Get the loan's XMTP group ID
    const { data: loanChannel, error: channelError } = await supabase
      .from('loan_channels')
      .select('xmtp_group_id')
      .eq('loan_address', loanAddress.toLowerCase())
      .single();

    if (channelError || !loanChannel?.xmtp_group_id) {
      console.error('[XMTP Add Contributor] Group not found:', channelError);
      return NextResponse.json(
        { success: false, error: 'XMTP group not found for this loan' },
        { status: 404 }
      );
    }

    console.log('[XMTP Add Contributor] Contributor stored:', {
      loanAddress,
      contributorAddress,
      xmtpGroupId: loanChannel.xmtp_group_id,
    });

    // Note: The actual adding to the group happens on the client side
    // because it requires the borrower's XMTP client to add members
    // This endpoint just stores the inbox ID for later use

    return NextResponse.json({
      success: true,
      xmtpGroupId: loanChannel.xmtp_group_id,
      message: 'Contributor inbox ID stored. Borrower can now add them to the group.',
    });
  } catch (error: any) {
    console.error('[XMTP Add Contributor] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET: Get inbox ID for a wallet address
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing walletAddress' },
        { status: 400 }
      );
    }

    const { data: inboxData, error } = await supabase
      .from('xmtp_inbox_ids')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (error || !inboxData) {
      return NextResponse.json(
        { success: false, error: 'Inbox ID not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inboxId: inboxData.inbox_id,
      walletAddress: inboxData.wallet_address,
    });
  } catch (error: any) {
    console.error('[XMTP Add Contributor] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
