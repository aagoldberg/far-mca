'use client';

import { useParams, useRouter } from 'next/navigation';
import CampaignDetails from "@/components/CampaignDetails";
import DonateShareCard from "@/components/DonateShareCard";
import DynamicMetaTags from "@/components/DynamicMetaTags";

export default function CampaignPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const handleDonateClick = () => {
    router.push(`/campaign/${id}/donate`);
  };

  if (!id || typeof id !== "string") {
    return <div>Invalid campaign ID.</div>;
  }

  return (
    <>
      <DynamicMetaTags campaignId={id} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            <CampaignDetails campaignNumericId={id} />
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8">
              <DonateShareCard campaignNumericId={id} onDonateClick={handleDonateClick} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 