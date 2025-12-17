import { NextRequest, NextResponse } from 'next/server';
import {
  searchGooglePlaces,
  searchYelp,
  lookupInstagram,
  lookupTikTok,
  type GooglePlacesResult,
  type YelpResult,
  type InstagramResult,
  type TikTokResult,
} from '@/lib/social-verification';

/**
 * POST /api/verify-social
 *
 * Verify and fetch data from social/review platforms
 *
 * Body:
 * {
 *   platform: 'google' | 'yelp' | 'instagram' | 'tiktok',
 *   // For google:
 *   query?: string,  // Business name + location
 *   // For yelp:
 *   businessName?: string,
 *   location?: string,
 *   // For instagram/tiktok:
 *   username?: string,
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform } = body;

    if (!platform) {
      return NextResponse.json(
        { error: 'Missing platform parameter' },
        { status: 400 }
      );
    }

    switch (platform) {
      case 'google': {
        const { query } = body;
        if (!query) {
          return NextResponse.json(
            { error: 'Missing query parameter for Google Places' },
            { status: 400 }
          );
        }

        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: 'Google Places API not configured' },
            { status: 503 }
          );
        }

        const result = await searchGooglePlaces(query, apiKey);
        return NextResponse.json(result);
      }

      case 'yelp': {
        const { businessName, location } = body;
        if (!businessName || !location) {
          return NextResponse.json(
            { error: 'Missing businessName or location for Yelp' },
            { status: 400 }
          );
        }

        const apiKey = process.env.YELP_API_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: 'Yelp API not configured' },
            { status: 503 }
          );
        }

        const result = await searchYelp(businessName, location, apiKey);
        return NextResponse.json(result);
      }

      case 'instagram': {
        const { username } = body;
        if (!username) {
          return NextResponse.json(
            { error: 'Missing username for Instagram' },
            { status: 400 }
          );
        }

        const apiKey = process.env.RAPIDAPI_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: 'Instagram API not configured' },
            { status: 503 }
          );
        }

        const result = await lookupInstagram(username, apiKey);
        return NextResponse.json(result);
      }

      case 'tiktok': {
        const { username } = body;
        if (!username) {
          return NextResponse.json(
            { error: 'Missing username for TikTok' },
            { status: 400 }
          );
        }

        const apiKey = process.env.RAPIDAPI_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: 'TikTok API not configured' },
            { status: 503 }
          );
        }

        const result = await lookupTikTok(username, apiKey);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: `Unknown platform: ${platform}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[verify-social] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
