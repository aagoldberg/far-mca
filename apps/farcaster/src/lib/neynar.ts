// Neynar API client using fetch (browser-compatible)
const NEYNAR_API_BASE = 'https://api.neynar.com/v2';
const neynarApiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

if (!neynarApiKey || neynarApiKey === 'your_neynar_api_key_here') {
  console.warn('NEXT_PUBLIC_NEYNAR_API_KEY is not set. Neynar features will be disabled.');
}

export const neynarClient = {
  isEnabled: () => !!neynarApiKey && neynarApiKey !== 'your_neynar_api_key_here',

  async fetchBulkUsers(addresses: string[]) {
    if (!this.isEnabled()) return null;

    try {
      // Use the correct Neynar API endpoint for bulk user lookup by Ethereum address
      const params = new URLSearchParams();
      addresses.forEach(addr => params.append('addresses', addr.toLowerCase()));

      const response = await fetch(
        `${NEYNAR_API_BASE}/farcaster/user/bulk-by-address?${params.toString()}`,
        {
          headers: {
            'accept': 'application/json',
            'api_key': neynarApiKey!,
          },
        }
      );

      if (!response.ok) {
        // Silently handle 404s - most addresses won't have Farcaster profiles
        if (response.status === 404) {
          return null;
        }
        // Only log non-404 errors in development
        if (process.env.NODE_ENV === 'development' && response.status !== 404) {
          const errorText = await response.text();
          console.debug('Neynar API error:', response.status, errorText);
        }
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Silently handle network errors
      if (process.env.NODE_ENV === 'development') {
        console.debug('Error fetching Neynar user data:', error);
      }
      return null;
    }
  },
};

// Helper to check if Neynar is available
export const isNeynarEnabled = () => neynarClient.isEnabled();
