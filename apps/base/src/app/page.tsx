"use client";

import Link from "next/link";
import { useLoansWithMetadata, useLoanWithMetadata } from "@/hooks/useLoansWithMetadata";
import { LoanCard } from "@/components/LoanCard";

// Loading skeleton for loan cards
function LoanCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse h-64">
      <div className="h-full bg-gray-100" />
    </div>
  );
}

// Component to fetch and display individual loan data
function LoanFeedItem({ loanAddress }: { loanAddress: `0x${string}` }) {
  const { loan, isLoading } = useLoanWithMetadata(loanAddress);

  if (isLoading || !loan) {
    return <LoanCardSkeleton />;
  }

  return (
    <LoanCard 
      address={loan.address}
      borrower={loan.borrower || loan.creator}
      name={loan.title || loan.name}
      description={loan.description}
      principal={loan.goal || 0n}
      totalFunded={loan.raised || 0n}
      fundraisingActive={loan.fundraisingActive}
      active={loan.active}
      completed={loan.completed}
      contributorsCount={BigInt(loan.contributorsCount || 0)}
      imageUrl={loan.imageUrl}
      fundraisingDeadline={loan.deadline ? BigInt(loan.deadline) : undefined}
    />
  );
}

export default function Home() {
  // Fetch loans from blockchain + IPFS
  const { loanAddresses, isLoading } = useLoansWithMetadata();

  return (
    <main className="min-h-screen bg-base-gray">
      {/* Minimal Hero */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-6 px-4 mb-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-base-black tracking-tight mb-2">
            Fund What You Believe In.
          </h1>
          <p className="text-gray-500 mb-6">
            Backed by verified revenue. Powered by community trust.
          </p>
          <Link
            href="/create-loan"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-base-blue hover:opacity-90 text-white font-bold rounded-full transition-all transform active:scale-95"
          >
            Create Loan
          </Link>
        </div>
      </div>

      {/* Loan Feed */}
      <div className="max-w-xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <LoanCardSkeleton key={i} />
            ))}
          </div>
        ) : loanAddresses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-base-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-base-black mb-1">
              No Active Loans
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Be the first to request funding.
            </p>
            <Link
              href="/create-loan"
              className="text-base-blue font-medium hover:underline"
            >
              Start Application
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {loanAddresses.map(address => (
              <LoanFeedItem key={address} loanAddress={address} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}