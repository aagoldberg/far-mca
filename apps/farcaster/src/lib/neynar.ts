import { NeynarAPIClient } from '@neynar/nodejs-sdk';

// Initialize Neynar client
const neynarApiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

if (!neynarApiKey) {
  console.warn('NEXT_PUBLIC_NEYNAR_API_KEY is not set. Neynar features will be disabled.');
}

export const neynarClient = neynarApiKey
  ? new NeynarAPIClient({ apiKey: neynarApiKey })
  : null;

// Helper to check if Neynar is available
export const isNeynarEnabled = () => !!neynarClient;
