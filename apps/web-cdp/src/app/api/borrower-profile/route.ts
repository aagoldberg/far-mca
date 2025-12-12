import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { BorrowerProfileRow, rowToBorrowerProfile } from '@/types/borrowerProfile';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// GET: Retrieve a borrower profile by wallet address
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('borrower_profiles')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found - not an error, just doesn't exist yet
        return NextResponse.json({ profile: null });
      }
      console.error('Error fetching borrower profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profile: rowToBorrowerProfile(profile as BorrowerProfileRow),
    });
  } catch (error) {
    console.error('Error in GET /api/borrower-profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new borrower profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      ownerFullName,
      ownerPhotoUrl,
      ownerEmail,
      instagramHandle,
      instagramFollowers,
      tiktokHandle,
      tiktokFollowers,
      linkedinUrl,
      googleRating,
      googleReviewCount,
      yelpRating,
      yelpReviewCount,
    } = body;

    // Validate required fields
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    if (!ownerFullName || ownerFullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Owner full name is required (at least 2 characters)' },
        { status: 400 }
      );
    }
    if (!ownerPhotoUrl) {
      return NextResponse.json(
        { error: 'Owner photo is required' },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('borrower_profiles')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        owner_full_name: ownerFullName.trim(),
        owner_photo_url: ownerPhotoUrl,
        owner_email: ownerEmail || null,
        instagram_handle: instagramHandle || null,
        instagram_followers: instagramFollowers || null,
        tiktok_handle: tiktokHandle || null,
        tiktok_followers: tiktokFollowers || null,
        linkedin_url: linkedinUrl || null,
        google_rating: googleRating || null,
        google_review_count: googleReviewCount || null,
        yelp_rating: yelpRating || null,
        yelp_review_count: yelpReviewCount || null,
      })
      .select()
      .single();

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A profile already exists for this wallet' },
          { status: 409 }
        );
      }
      console.error('Error creating borrower profile:', error);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { profile: rowToBorrowerProfile(profile as BorrowerProfileRow) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/borrower-profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing borrower profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, ...updateFields } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields (convert camelCase to snake_case)
    const updateData: Record<string, any> = {};

    if (updateFields.ownerFullName !== undefined) {
      if (updateFields.ownerFullName.trim().length < 2) {
        return NextResponse.json(
          { error: 'Owner full name must be at least 2 characters' },
          { status: 400 }
        );
      }
      updateData.owner_full_name = updateFields.ownerFullName.trim();
    }
    if (updateFields.ownerPhotoUrl !== undefined) {
      updateData.owner_photo_url = updateFields.ownerPhotoUrl;
    }
    if (updateFields.ownerEmail !== undefined) {
      updateData.owner_email = updateFields.ownerEmail || null;
    }
    if (updateFields.instagramHandle !== undefined) {
      updateData.instagram_handle = updateFields.instagramHandle || null;
    }
    if (updateFields.instagramFollowers !== undefined) {
      updateData.instagram_followers = updateFields.instagramFollowers || null;
    }
    if (updateFields.tiktokHandle !== undefined) {
      updateData.tiktok_handle = updateFields.tiktokHandle || null;
    }
    if (updateFields.tiktokFollowers !== undefined) {
      updateData.tiktok_followers = updateFields.tiktokFollowers || null;
    }
    if (updateFields.linkedinUrl !== undefined) {
      updateData.linkedin_url = updateFields.linkedinUrl || null;
    }
    if (updateFields.googleRating !== undefined) {
      updateData.google_rating = updateFields.googleRating || null;
    }
    if (updateFields.googleReviewCount !== undefined) {
      updateData.google_review_count = updateFields.googleReviewCount || null;
    }
    if (updateFields.yelpRating !== undefined) {
      updateData.yelp_rating = updateFields.yelpRating || null;
    }
    if (updateFields.yelpReviewCount !== undefined) {
      updateData.yelp_review_count = updateFields.yelpReviewCount || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('borrower_profiles')
      .update(updateData)
      .eq('wallet_address', walletAddress.toLowerCase())
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }
      console.error('Error updating borrower profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profile: rowToBorrowerProfile(profile as BorrowerProfileRow),
    });
  } catch (error) {
    console.error('Error in PUT /api/borrower-profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Upsert (create or update) - useful for wizard flow
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      ownerFullName,
      ownerPhotoUrl,
      ownerEmail,
      instagramHandle,
      instagramFollowers,
      tiktokHandle,
      tiktokFollowers,
      linkedinUrl,
      googleRating,
      googleReviewCount,
      yelpRating,
      yelpReviewCount,
    } = body;

    // Validate required fields
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    if (!ownerFullName || ownerFullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Owner full name is required (at least 2 characters)' },
        { status: 400 }
      );
    }
    if (!ownerPhotoUrl) {
      return NextResponse.json(
        { error: 'Owner photo is required' },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('borrower_profiles')
      .upsert(
        {
          wallet_address: walletAddress.toLowerCase(),
          owner_full_name: ownerFullName.trim(),
          owner_photo_url: ownerPhotoUrl,
          owner_email: ownerEmail || null,
          instagram_handle: instagramHandle || null,
          instagram_followers: instagramFollowers || null,
          tiktok_handle: tiktokHandle || null,
          tiktok_followers: tiktokFollowers || null,
          linkedin_url: linkedinUrl || null,
          google_rating: googleRating || null,
          google_review_count: googleReviewCount || null,
          yelp_rating: yelpRating || null,
          yelp_review_count: yelpReviewCount || null,
        },
        {
          onConflict: 'wallet_address',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting borrower profile:', error);
      return NextResponse.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profile: rowToBorrowerProfile(profile as BorrowerProfileRow),
    });
  } catch (error) {
    console.error('Error in PATCH /api/borrower-profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
