'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { InvestorPortfolio } from '@/components/InvestorPortfolio';
import Link from 'next/link';
import { 
  BriefcaseIcon, 
  ArrowRightIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function PortfolioPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  // Redirect if not authenticated
  if (ready && !authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Portfolio</h2>
          <p className="text-gray-600 mb-6">
            Sign in to view your investments and track returns
          </p>
          <button
            onClick={login}
            className="w-full bg-green-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ChartBarIcon className="w-8 h-8 text-green-600" />
                Investment Portfolio
              </h1>
              <p className="text-gray-600 mt-1">
                Track your revenue-based financing investments and returns
              </p>
            </div>
            
            <Link
              href="/"
              className="flex items-center gap-2 bg-green-600 text-white font-medium py-2.5 px-5 rounded-xl hover:bg-green-700 transition-colors"
            >
              Browse Opportunities
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InvestorPortfolio />
      </div>
    </div>
  );
}