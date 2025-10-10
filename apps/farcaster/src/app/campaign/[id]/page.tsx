'use client';

import { useParams } from 'next/navigation';
import CampaignDetails from '@/components/CampaignDetails';

export default function CampaignPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  if (!id || typeof id !== "string") {
    return <div className="p-4 text-center">Invalid campaign ID.</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      <CampaignDetails campaignNumericId={id} />
    </main>
  );
}
