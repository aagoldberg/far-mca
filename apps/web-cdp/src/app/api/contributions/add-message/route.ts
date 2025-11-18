import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';

export async function POST(request: NextRequest) {
  try {
    const { loanAddress, contributorAddress, amount, message, transactionHash } =
      await request.json();

    // Validate required fields
    if (!loanAddress || !contributorAddress || !amount || !transactionHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Message is optional
    if (!message || !message.trim()) {
      return NextResponse.json({
        success: true,
        message: 'No message provided'
      });
    }

    // Validate message length
    if (message.length > 280) {
      return NextResponse.json(
        { error: 'Message too long (max 280 characters)' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Convert amount to human-readable format
    const amountFormatted = formatUnits(BigInt(amount), USDC_DECIMALS);

    // Save message to database
    const { data: savedMessage, error: dbError } = await supabase
      .from('contribution_messages')
      .insert({
        loan_address: loanAddress.toLowerCase(),
        contributor_address: contributorAddress.toLowerCase(),
        amount: amountFormatted,
        message: message.trim(),
        transaction_hash: transactionHash,
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Messages] Database save error:', dbError);

      // Check if duplicate transaction hash
      if (dbError.code === '23505') { // Unique violation
        return NextResponse.json({
          success: true,
          warning: 'Message already exists for this transaction',
        });
      }

      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    console.log('[Messages] Saved to database:', savedMessage.id);

    return NextResponse.json({
      success: true,
      message: savedMessage,
    });
  } catch (error: any) {
    console.error('[Messages] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save message' },
      { status: 500 }
    );
  }
}
