'use client';

import { useLoansWithMetadata } from '@/hooks/useLoansWithMetadata';
import Link from 'next/link';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';

const StatCard = ({ value, label, isLoading }: { value: string; label: string; isLoading: boolean }) => (
  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
    {isLoading ? (
      <div className="h-8 bg-gray-400/50 rounded-md animate-pulse w-20 mx-auto" />
    ) : (
      <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
    )}
    <p className="text-sm text-gray-200 mt-1">{label}</p>
  </div>
);

export function Hero() {
  const { loanAddresses, loans, isLoading } = useLoansWithMetadata();

  const totalFunded = loans.reduce((acc, loan) => {
    if (loan.totalFunded) {
      return acc + loan.totalFunded;
    }
    return acc;
  }, 0n);

  const formattedTotalFunded = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(formatUnits(totalFunded, USDC_DECIMALS)));

  return (
    <div className="w-full bg-gradient-to-b from-[#2C7A7B] to-[#234E52] text-white py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Fund Your Goals, Interest-Free
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
          LendFriend is a community-powered lending platform on Base. Get the funding you need from people who believe in you, and pay it back as you grow.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/create-loan" className="w-full sm:w-auto inline-block bg-white text-[#2C7A7B] font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
            Request Funding
          </Link>
          <Link href="#featured-campaigns" className="w-full sm:w-auto inline-block bg-transparent border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Explore Campaigns
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-12 md:mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            value={`$${formattedTotalFunded.split('$')[1]}`}
            label="Total Raised"
            isLoading={isLoading}
          />
          <StatCard
            value={loanAddresses.length.toString()}
            label="Campaigns"
            isLoading={isLoading}
          />
          <StatCard
            value="0%"
            label="Interest"
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
}
