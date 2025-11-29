'use client';

import { CreateFundingRequestForm } from "@/components/CreateFundingRequestForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function RequestFundingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Request Business Funding</h1>
            <p className="text-gray-600 mt-2">
              Get growth capital for your business with revenue-based financing. 
              Pay back a percentage of your revenue until you reach the repayment cap.
            </p>
          </div>
          <ErrorBoundary>
            <CreateFundingRequestForm />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
} 