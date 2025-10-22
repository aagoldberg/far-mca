'use client';

import LoanList from '../components/LoanList';
import TabNavigation from '../components/TabNavigation';
import { LoanListErrorBoundary } from '../components/ErrorBoundary';

export default function HomePage() {
  return (
    <div className="frame-container bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Tab Navigation */}
      <TabNavigation />

      {/* Content */}
      <div className="w-full p-4 sm:p-5">
        <LoanListErrorBoundary>
          <LoanList />
        </LoanListErrorBoundary>
      </div>
    </div>
  );
}
