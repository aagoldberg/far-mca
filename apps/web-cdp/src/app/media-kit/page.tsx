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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-10 overflow-auto">
      <div className="text-white mb-8 text-center">
        <h1 className="text-3xl font-bold">Shopify App Store - Feature Media</h1>
        <p className="text-gray-400">Screenshot the box below (1600x900)</p>
      </div>

      {/* The Asset Container - 1600x900 Fixed */}
      <div 
        className="relative bg-white overflow-hidden shadow-2xl flex-shrink-0"
        style={{
          width: '1600px',
          height: '900px',
        }}
      >
        {/* Background - Subtle Brand Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100" />
        
        {/* Abstract Shapes - Scaled Up */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-50/50 rounded-full blur-3xl -mr-60 -mt-60" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -ml-40 -mb-40" />

        {/* Content Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Main UI Card - Scaled to 900px */}
          <div className="relative w-[900px] bg-white rounded-[40px] shadow-[0_50px_100px_-12px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden z-20">
            
            {/* Cover Image */}
            <div className="h-64 w-full relative">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Bakery" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Card Content Wrapper */}
            <div className="px-12 pb-12 relative">
              
              {/* Profile Header Row */}
              <div className="flex justify-between items-end mb-10">
                <div className="flex items-end gap-6 relative z-10">
                   {/* Avatar */}
                   <div className="w-32 h-32 rounded-full border-[6px] border-white bg-white shadow-md overflow-hidden -mt-20">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                        alt="Jane" 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <div className="pb-2">
                      <h2 className="text-5xl font-extrabold text-gray-900 leading-none mb-2">Jane's Bakery</h2>
                      <p className="text-xl font-medium text-gray-500">Expansion Capital</p>
                   </div>
                </div>
                <div className="px-8 py-3 bg-brand-50 text-brand-700 text-xl font-bold rounded-full border border-brand-100 mb-2">
                  0% Interest
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-base font-bold text-gray-400 uppercase tracking-widest mb-2">Total Raised</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-7xl font-extrabold text-gray-900">$10,000</span>
                      <span className="text-3xl font-medium text-gray-400">/ $10,000</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-5 py-2.5 rounded-2xl">
                    <CheckCircleIcon className="w-8 h-8" />
                    <span className="font-bold text-xl">Fully Funded</span>
                  </div>
                </div>
                
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 w-full" />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-5">
                  <div className="p-4 bg-white rounded-xl shadow-sm text-brand-600">
                    <ChartBarIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Business Health</div>
                    <div className="text-xl font-bold text-green-600 flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-extrabold">Grade A</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-5">
                  <div className="p-4 bg-white rounded-xl shadow-sm text-blue-600">
                    <UserGroupIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Community Trust</div>
                    <div className="text-2xl font-bold text-gray-900">42 Backers</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* === THE NETWORK SWARM (SCALED UP) === */}
          
          {/* Top Left Cluster */}
          <div className="absolute top-24 left-24 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 transform -rotate-6 z-30 animate-pulse">
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
              <div><p className="text-xl font-bold text-gray-900">Mike</p><p className="text-lg text-green-600 font-bold">+$250 Backed</p></div>
            </div>
          </div>
          <div className="absolute top-60 left-10 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 transform rotate-12 z-10 opacity-90">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.200&q=80" className="w-14 h-14 rounded-full object-cover" />
              <div><p className="text-lg font-bold">Tom</p><p className="text-sm text-green-600">+$100</p></div>
            </div>
          </div>

          {/* Top Right Cluster */}
          <div className="absolute top-24 right-24 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 transform rotate-6 z-30">
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
              <div><p className="text-xl font-bold text-gray-900">Sarah</p><p className="text-lg text-green-600 font-bold">+$1,200 Backed</p></div>
            </div>
          </div>
          <div className="absolute top-72 right-8 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 transform -rotate-3 z-10 opacity-90">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" className="w-14 h-14 rounded-full object-cover" />
              <div><p className="text-lg font-bold">Emma</p><p className="text-sm text-green-600">+$50</p></div>
            </div>
          </div>

          {/* Bottom Left Cluster */}
          <div className="absolute bottom-32 left-24 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 transform rotate-3 z-30">
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
              <div><p className="text-xl font-bold text-gray-900">David</p><p className="text-lg text-green-600 font-bold">+$500 Backed</p></div>
            </div>
          </div>

          {/* Bottom Right Cluster */}
          <div className="absolute bottom-24 right-32 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 transform -rotate-6 z-30">
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
              <div><p className="text-xl font-bold text-gray-900">Priya</p><p className="text-lg text-green-600 font-bold">+$500 Backed</p></div>
            </div>
          </div>
          <div className="absolute bottom-16 right-80 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 transform rotate-12 z-10 opacity-80">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">A</div>
               <p className="text-sm font-bold text-stone-400">+3 others</p>
             </div>
          </div>

          {/* Connectors (Scaled) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
             <line x1="400" y1="300" x2="800" y2="450" stroke="#9ca3af" strokeWidth="3" strokeDasharray="8,8" />
             <line x1="1200" y1="300" x2="800" y2="450" stroke="#9ca3af" strokeWidth="3" strokeDasharray="8,8" />
             <line x1="400" y1="700" x2="800" y2="450" stroke="#9ca3af" strokeWidth="3" strokeDasharray="8,8" />
             <line x1="1200" y1="700" x2="800" y2="450" stroke="#9ca3af" strokeWidth="3" strokeDasharray="8,8" />
          </svg>

        </div>
      </div>
    </div>
  );
}
