import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loanAddress = searchParams.get('loanAddress');

    if (!loanAddress) {
      return NextResponse.json(
        { error: 'loanAddress parameter required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: messages, error } = await supabase
      .from('contribution_messages')
      .select('*')
      .eq('loan_address', loanAddress.toLowerCase())
      .eq('is_hidden', false) // Don't show hidden/moderated messages
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Messages] Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
      count: messages?.length || 0,
    });
  } catch (error: any) {
    console.error('[Messages] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
