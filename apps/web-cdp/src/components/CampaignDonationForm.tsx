'use client';

import React from 'react';

interface CampaignDonationFormProps {
  campaignId: string;
}

export const CampaignDonationForm = ({ campaignId }: CampaignDonationFormProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Make a Donation</h3>
      <p className="text-gray-600">
        Donation functionality for campaign <span className="font-mono bg-gray-100 p-1 rounded text-sm">{campaignId}</span> will be implemented here.
      </p>
      {/* TODO: Add donation input, wallet connection, and transaction logic */}
    </div>
  );
}; 