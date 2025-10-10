"use client";

import FundingRequestList from "@/components/FundingRequestList";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Revenue-Based Financing for Growing Businesses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the capital you need to grow, pay it back as you earn. No equity dilution, no personal guarantees.
          </p>
        </div>
      </div>
      
      {/* Funding Request List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Funding Requests</h2>
        <FundingRequestList /> 
      </div>
    </main>
  );
}
