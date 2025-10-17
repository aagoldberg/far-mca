'use client';

import LoanList from '../components/LoanList';
import TabNavigation from '../components/TabNavigation';
import { LoanListErrorBoundary } from '../components/ErrorBoundary';

export default function HomePage() {
  return (
    <div className="frame-container">
      {/* Tab Navigation */}
      <TabNavigation />

      {/* Content */}
      <div className="w-full p-4">
        <LoanListErrorBoundary>
          <LoanList />
        </LoanListErrorBoundary>
      </div>
    </div>
  );
}
