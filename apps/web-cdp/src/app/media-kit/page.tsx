'use client';

import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';

export default function MediaKitPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-10">
      <div className="text-white mb-4 text-center">
        <h1 className="text-2xl font-bold">Shopify App Store - Feature Media</h1>
        <p className="text-gray-400">Screenshot the box below (1600x900)</p>
      </div>

      {/* The Asset Container - 1600x900 Aspect Ratio */}
      <div 
        className="relative bg-white overflow-hidden shadow-2xl"
        style={{
          width: '1200px', // Scale down for viewing
          height: '675px', // 16:9 Aspect Ratio
          transform: 'scale(0.8)',
        }}
      >
        {/* Background - Subtle Brand Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100" />
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-50/50 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -ml-20 -mb-20" />

        {/* Content Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Main UI Card */}
          <div className="relative w-[700px] bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden z-10">
            
            {/* Cover Image */}
            <div className="h-48 w-full relative">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Bakery" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-3xl font-extrabold tracking-tight">Jane's Bakery</h2>
                <p className="text-lg font-medium opacity-90">Expansion Capital</p>
              </div>
            </div>

            {/* Card Content Wrapper */}
            <div className="p-10 pt-6">
              
              {/* Header (Avatar & Badge) */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                   {/* Avatar overlapping cover */}
                   <div className="-mt-16 relative">
                     <div className="w-20 h-20 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-2xl">JB</div>
                     </div>
                   </div>
                </div>
                <div className="px-5 py-2 bg-brand-50 text-brand-700 text-lg font-bold rounded-full border border-brand-100">
                  0% Interest
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Raised</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-extrabold text-gray-900">$10,000</span>
                      <span className="text-2xl font-medium text-gray-400">/ $10,000</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6" />
                    <span className="font-bold">Fully Funded</span>
                  </div>
                </div>
                
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 w-full" />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-brand-600">
                    <ChartBarIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-500">Business Health</div>
                    <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-sm">Grade A</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                    <UserGroupIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-500">Community Trust</div>
                    <div className="text-lg font-bold text-gray-900">42 Backers</div>
                  </div>
                </div>
              </div>

            </div> {/* End Content Wrapper */}
          </div>

          {/* Floating Elements (Decorations) */}
          <div className="absolute -right-12 top-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 transform rotate-6 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">JD</div>
              <div>
                <p className="text-sm font-bold text-gray-900">John Doe</p>
                <p className="text-xs text-green-600 font-medium">Contributed $500</p>
              </div>
            </div>
          </div>

          <div className="absolute -left-8 bottom-32 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 transform -rotate-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <ArrowTrendingUpIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Sales Trending Up</p>
                <p className="text-xs text-gray-500">+15% this month</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}