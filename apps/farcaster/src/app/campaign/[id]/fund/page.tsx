'use client';

import { useParams } from 'next/navigation';
import FundingForm from '@/components/FundingForm';

export default function FundPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  if (!id || typeof id !== "string") {
    return <div className="p-4 text-center">Invalid campaign ID.</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      <FundingForm campaignNumericId={id} />
    </main>
  );
}
