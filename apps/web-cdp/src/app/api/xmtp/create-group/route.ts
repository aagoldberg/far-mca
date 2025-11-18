/**
 * API Route: Create XMTP Group for Loan
 *
 * Called by the borrower to create a private XMTP group for their loan.
 * The group starts with just the borrower; contributors are added when they fund.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { loanAddress, xmtpGroupId, borrowerAddress, borrowerInboxId } = await request.json();

    console.log('[XMTP Group] Creating group for loan:', {
      loanAddress,
      xmtpGroupId,
      borrowerAddress,
    });

    // Validate required fields
    if (!loanAddress || !xmtpGroupId || !borrowerAddress || !borrowerInboxId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the XMTP group ID in database
    const { data: loanChannel, error: channelError } = await supabase
      .from('loan_channels')
      .upsert({
        loan_address: loanAddress.toLowerCase(),
        xmtp_group_id: xmtpGroupId,
        xmtp_created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (channelError) {
      console.error('[XMTP Group] Failed to store group:', channelError);
      return NextResponse.json(
        { success: false, error: 'Failed to store group' },
        { status: 500 }
      );
    }

    // Store the borrower's inbox ID
    const { error: inboxError } = await supabase
      .from('xmtp_inbox_ids')
      .upsert({
        wallet_address: borrowerAddress.toLowerCase(),
        inbox_id: borrowerInboxId,
        last_used_at: new Date().toISOString(),
      });

    if (inboxError) {
      console.error('[XMTP Group] Failed to store inbox ID:', inboxError);
      // Don't fail the request - group is still created
    }

    console.log('[XMTP Group] Group created successfully:', {
      loanAddress,
      xmtpGroupId,
    });

    return NextResponse.json({
      success: true,
      groupId: xmtpGroupId,
      loanChannel,
    });
  } catch (error: any) {
    console.error('[XMTP Group] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET: Retrieve XMTP group for a loan
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loanAddress = searchParams.get('loanAddress');

    if (!loanAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing loanAddress' },
        { status: 400 }
      );
    }

    const { data: loanChannel, error } = await supabase
      .from('loan_channels')
      .select('*')
      .eq('loan_address', loanAddress.toLowerCase())
      .single();

    if (error || !loanChannel) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      xmtpGroupId: loanChannel.xmtp_group_id,
      loanChannel,
    });
  } catch (error: any) {
    console.error('[XMTP Group] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
