'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import CampaignList from '../components/CampaignList';

export default function HomePage() {
  useEffect(() => {
    // Signal to the Farcaster client that the app is ready
    sdk.actions.ready()
      .then(() => {
        console.log('Farcaster Mini App signaled ready.');
      })
      .catch((err) => {
        console.error('Error signaling Farcaster Mini App ready:', err);
      });
  }, []);

  return (
    <div className="frame-container">
      <div className="w-full p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            LendFriend
          </h1>
          <p className="text-sm text-gray-600">
            Zero-equity business financing
          </p>
        </div>

        {/* Active Campaigns */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Active Requests
        </h2>

        <CampaignList />
      </div>
    </div>
  );
}
