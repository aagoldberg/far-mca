import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});
const neynarClient = new NeynarAPIClient(config);

export async function PATCH(request: NextRequest) {
  try {
    const { signer_uuid, updates } = await request.json();

    if (!signer_uuid) {
      return NextResponse.json(
        { error: 'Signer UUID required' },
        { status: 400 }
      );
    }

    // Validate updates object has at least one field
    const allowedFields = ['bio', 'pfp_url', 'url', 'username', 'display_name', 'location'];
    const hasValidUpdate = Object.keys(updates).some(key => allowedFields.includes(key));

    if (!hasValidUpdate) {
      return NextResponse.json(
        { error: 'No valid fields to update. Allowed: bio, pfp_url, url, username, display_name, location' },
        { status: 400 }
      );
    }

    console.log('[Farcaster] Updating profile with signer_uuid:', signer_uuid, 'updates:', updates);

    // Update profile via Neynar
    const response = await neynarClient.updateUser({
      signer_uuid,
      ...updates,
    });

    console.log('[Farcaster] Profile updated successfully:', response);

    return NextResponse.json({
      success: true,
      user: response,
    });

  } catch (error: any) {
    console.error('[Farcaster] Profile update error:', error);

    // Handle specific Neynar errors
    if (error.response?.data) {
      return NextResponse.json(
        { error: error.response.data.message || 'Failed to update profile' },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
