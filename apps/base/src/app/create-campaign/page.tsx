'use client';

import { CreateCampaignForm } from "@/components/CreateCampaignForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function CreateCampaignPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-nunito font-bold text-gray-900">Start a Fundraiser</h1>
            <p className="text-gray-600 mt-2">
              Create a campaign to start raising funds for your cause.
            </p>
          </div>
          <ErrorBoundary>
            <CreateCampaignForm />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
} 