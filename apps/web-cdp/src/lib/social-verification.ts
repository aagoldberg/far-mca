/**
 * Social Verification Library
 *
 * Verifies and fetches data from social/review platforms:
 * - Google Places: Business info, ratings, review counts
 * - Yelp: Business info, ratings, review counts
 * - Instagram: Profile lookup via RapidAPI
 * - TikTok: Profile lookup via RapidAPI
 */

// Types
export interface GooglePlacesResult {
  placeId: string;
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone?: string;
  website?: string;
  types: string[];
  verified: boolean;
}

export interface YelpResult {
  businessId: string;
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone?: string;
  url: string;
  categories: string[];
  verified: boolean;
}

export interface InstagramResult {
  username: string;
  fullName: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  profilePicUrl?: string;
  bio?: string;
  isVerified: boolean;
  isBusinessAccount: boolean;
  verified: boolean;
}

export interface TikTokResult {
  username: string;
  nickname: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  videoCount: number;
  profilePicUrl?: string;
  bio?: string;
  isVerified: boolean;
  verified: boolean;
}

export interface VerificationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'google' | 'yelp' | 'instagram' | 'tiktok';
  timestamp: string;
}

/**
 * Search Google Places for a business by name/address
 */
export async function searchGooglePlaces(
  query: string,
  apiKey: string
): Promise<VerificationResult<GooglePlacesResult>> {
  try {
    // Use Places Text Search API
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' || !searchData.results?.length) {
      return {
        success: false,
        error: searchData.status === 'ZERO_RESULTS'
          ? 'No businesses found matching that name'
          : `Google API error: ${searchData.status}`,
        source: 'google',
        timestamp: new Date().toISOString(),
      };
    }

    const place = searchData.results[0];

    // Get place details for more info
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,user_ratings_total,formatted_address,formatted_phone_number,website,types&key=${apiKey}`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK') {
      // Use search result data if details fail
      return {
        success: true,
        data: {
          placeId: place.place_id,
          name: place.name,
          rating: place.rating || 0,
          reviewCount: place.user_ratings_total || 0,
          address: place.formatted_address || '',
          types: place.types || [],
          verified: true,
        },
        source: 'google',
        timestamp: new Date().toISOString(),
      };
    }

    const details = detailsData.result;

    return {
      success: true,
      data: {
        placeId: place.place_id,
        name: details.name || place.name,
        rating: details.rating || place.rating || 0,
        reviewCount: details.user_ratings_total || place.user_ratings_total || 0,
        address: details.formatted_address || place.formatted_address || '',
        phone: details.formatted_phone_number,
        website: details.website,
        types: details.types || place.types || [],
        verified: true,
      },
      source: 'google',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[GooglePlaces] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to search Google Places',
      source: 'google',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Search Yelp for a business by name/location
 */
export async function searchYelp(
  businessName: string,
  location: string,
  apiKey: string
): Promise<VerificationResult<YelpResult>> {
  try {
    const searchUrl = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(businessName)}&location=${encodeURIComponent(location)}&limit=1`;

    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Yelp] API Error:', response.status, errorText);
      return {
        success: false,
        error: response.status === 401
          ? 'Invalid Yelp API key'
          : `Yelp API error: ${response.status}`,
        source: 'yelp',
        timestamp: new Date().toISOString(),
      };
    }

    const data = await response.json();

    if (!data.businesses?.length) {
      return {
        success: false,
        error: 'No businesses found on Yelp matching that name and location',
        source: 'yelp',
        timestamp: new Date().toISOString(),
      };
    }

    const business = data.businesses[0];

    return {
      success: true,
      data: {
        businessId: business.id,
        name: business.name,
        rating: business.rating || 0,
        reviewCount: business.review_count || 0,
        address: business.location?.display_address?.join(', ') || '',
        phone: business.display_phone,
        url: business.url,
        categories: business.categories?.map((c: any) => c.title) || [],
        verified: true,
      },
      source: 'yelp',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Yelp] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to search Yelp',
      source: 'yelp',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Lookup Instagram profile via RapidAPI
 */
export async function lookupInstagram(
  username: string,
  rapidApiKey: string
): Promise<VerificationResult<InstagramResult>> {
  try {
    // Clean username (remove @ if present)
    const cleanUsername = username.replace(/^@/, '');

    // Using Instagram Scraper API on RapidAPI
    const response = await fetch(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${encodeURIComponent(cleanUsername)}`,
      {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Instagram profile not found',
          source: 'instagram',
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: `Instagram API error: ${response.status}`,
        source: 'instagram',
        timestamp: new Date().toISOString(),
      };
    }

    const data = await response.json();
    const user = data.data;

    if (!user) {
      return {
        success: false,
        error: 'Instagram profile not found',
        source: 'instagram',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: {
        username: user.username,
        fullName: user.full_name || '',
        followersCount: user.follower_count || 0,
        followingCount: user.following_count || 0,
        postsCount: user.media_count || 0,
        profilePicUrl: user.profile_pic_url,
        bio: user.biography,
        isVerified: user.is_verified || false,
        isBusinessAccount: user.is_business || false,
        verified: true,
      },
      source: 'instagram',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Instagram] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to lookup Instagram profile',
      source: 'instagram',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Lookup TikTok profile via RapidAPI
 */
export async function lookupTikTok(
  username: string,
  rapidApiKey: string
): Promise<VerificationResult<TikTokResult>> {
  try {
    // Clean username (remove @ if present)
    const cleanUsername = username.replace(/^@/, '');

    // Using TikTok Scraper API on RapidAPI
    const response = await fetch(
      `https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${encodeURIComponent(cleanUsername)}`,
      {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'TikTok profile not found',
          source: 'tiktok',
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: `TikTok API error: ${response.status}`,
        source: 'tiktok',
        timestamp: new Date().toISOString(),
      };
    }

    const data = await response.json();
    const user = data.data?.user;

    if (!user) {
      return {
        success: false,
        error: 'TikTok profile not found',
        source: 'tiktok',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: {
        username: user.uniqueId,
        nickname: user.nickname || '',
        followersCount: user.followerCount || 0,
        followingCount: user.followingCount || 0,
        likesCount: user.heartCount || 0,
        videoCount: user.videoCount || 0,
        profilePicUrl: user.avatarThumb,
        bio: user.signature,
        isVerified: user.verified || false,
        verified: true,
      },
      source: 'tiktok',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[TikTok] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to lookup TikTok profile',
      source: 'tiktok',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Format follower count for display (e.g., 1.2K, 15K, 1.5M)
 */
export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
