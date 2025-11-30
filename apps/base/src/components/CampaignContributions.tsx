'use client';

import React from 'react';

interface CampaignContributionsProps {
  campaignNumericId: string;
}

export const CampaignContributions = ({ campaignNumericId }: CampaignContributionsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contributions</h3>
       <p className="text-gray-600">
        A list of contributions for campaign <span className="font-mono bg-gray-100 p-1 rounded text-sm">{campaignNumericId}</span> will be displayed here.
      </p>
      {/* TODO: Add a GraphQL query to fetch and display contribution data */}
    </div>
  );
}; 