"use client";

import LoanList from "@/components/LoanList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#3B9B7F]/5 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Zero-Interest Community Loans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Get funding from your community with 0% interest. Pay back exactly what you borrow - no more, no less.
          </p>
          <Link
            href="/create-loan"
            className="inline-block bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Create a Loan
          </Link>
        </div>
      </div>

      {/* Loan List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Loans</h2>
          <Link
            href="/create-loan"
            className="text-[#3B9B7F] hover:text-[#2E7D68] font-medium text-sm"
          >
            + New Loan
          </Link>
        </div>
        <LoanList />
      </div>
    </main>
  );
}
