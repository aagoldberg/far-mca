"use client";

import LoanList from "@/components/LoanList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3B9B7F]/10 via-[#2C7DA0]/5 to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Support Your Community,
            <br />
            <span className="bg-gradient-to-r from-[#2C7DA0] via-[#2E8B8B] to-[#3B9B7F] bg-clip-text text-transparent">
              Change Lives
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Help neighbors and local businesses thrive with interest-free loans.
            Together, we build stronger communities—one loan at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/create-loan"
              className="inline-flex items-center gap-2 bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-bold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request a Loan
            </Link>
            <Link
              href="#loans"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-200"
            >
              Browse Loans
            </Link>
          </div>
        </div>
      </div>

      {/* Loan List Section */}
      <div id="loans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Ways to Help</h2>
          <p className="text-gray-600">Support community members working toward their dreams</p>
        </div>
        <LoanList />
      </div>
    </main>
  );
}
