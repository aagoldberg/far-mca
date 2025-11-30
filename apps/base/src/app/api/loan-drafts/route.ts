import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors when env vars aren't available
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// GET: Retrieve a draft by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('id');
    const walletAddress = searchParams.get('wallet');

    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    const { data: draft, error } = await getSupabaseClient()
      .from('loan_drafts')
      .select('*')
      .eq('id', draftId)
      .single();

    if (error) {
      console.error('Error fetching draft:', error);
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    // Check if draft is expired
    if (new Date(draft.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Draft has expired' },
        { status: 410 }
      );
    }

    // Verify wallet ownership if provided
    if (walletAddress && draft.wallet_address.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(draft);
  } catch (error) {
    console.error('Error in GET /api/loan-drafts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new draft
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, currentStep = 1, step1Data, step2Data, step3Data, step4Data } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const { data: draft, error } = await getSupabaseClient()
      .from('loan_drafts')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        current_step: currentStep,
        step1_data: step1Data || null,
        step2_data: step2Data || null,
        step3_data: step3Data || null,
        step4_data: step4Data || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating draft:', error);
      return NextResponse.json(
        { error: 'Failed to create draft' },
        { status: 500 }
      );
    }

    return NextResponse.json(draft, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/loan-drafts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing draft
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, walletAddress, currentStep, step1Data, step2Data, step3Data, step4Data, isCompleted } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (currentStep !== undefined) updateData.current_step = currentStep;
    if (step1Data !== undefined) updateData.step1_data = step1Data;
    if (step2Data !== undefined) updateData.step2_data = step2Data;
    if (step3Data !== undefined) updateData.step3_data = step3Data;
    if (step4Data !== undefined) updateData.step4_data = step4Data;
    if (isCompleted !== undefined) updateData.is_completed = isCompleted;

    const { data: draft, error } = await getSupabaseClient()
      .from('loan_drafts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating draft:', error);
      return NextResponse.json(
        { error: 'Failed to update draft' },
        { status: 500 }
      );
    }

    return NextResponse.json(draft);
  } catch (error) {
    console.error('Error in PUT /api/loan-drafts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a draft
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('id');

    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    const { error } = await getSupabaseClient()
      .from('loan_drafts')
      .delete()
      .eq('id', draftId);

    if (error) {
      console.error('Error deleting draft:', error);
      return NextResponse.json(
        { error: 'Failed to delete draft' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/loan-drafts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
