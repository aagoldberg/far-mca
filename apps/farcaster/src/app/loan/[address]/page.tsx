'use client';

import { use } from 'react';
import LoanDetails from '@/components/LoanDetails';

interface PageProps {
  params: Promise<{ address: string }>;
}

export default function LoanDetailPage({ params }: PageProps) {
  const { address } = use(params);

  return <LoanDetails loanAddress={address as `0x${string}`} />;
}
