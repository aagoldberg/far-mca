'use client';

import { use } from 'react';
import LoanFundingForm from '@/components/LoanFundingForm';

interface PageProps {
  params: Promise<{ address: string }>;
}

export default function LoanFundingPage({ params }: PageProps) {
  const { address } = use(params);

  return <LoanFundingForm loanAddress={address as `0x${string}`} />;
}
