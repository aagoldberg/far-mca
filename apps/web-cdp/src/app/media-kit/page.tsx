'use client';

import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  HomeIcon,
  CreditCardIcon,
  ArrowPathIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/solid';

// Helper for downloads
const useDownload = (ref: React.RefObject<HTMLDivElement>, filename: string, width: number, height: number) => {
  return useCallback(() => {
    if (ref.current === null) return;
    toPng(ref.current, { cacheBust: true, width, height, useCORS: true, pixelRatio: 1 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Download failed:', err));
  }, [ref, filename, width, height]);
};

export default function MediaKitPage() {
  const featureRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null); // Active Loan Dashboard
  const detailsRef = useRef<HTMLDivElement>(null); // Public Loan Details
  const mobileRef = useRef<HTMLDivElement>(null);

  const downloadFeature = useDownload(featureRef, 'lendfriend-feature-media.png', 1600, 900);
  const downloadDashboard = useDownload(dashboardRef, 'lendfriend-dashboard-desktop.png', 1600, 900);
  const downloadDetails = useDownload(detailsRef, 'lendfriend-details-desktop.png', 1600, 900);
  const downloadMobile = useDownload(mobileRef, 'lendfriend-mobile.png', 900, 1600);

  return (
    <div className="min-h-screen bg-gray-900 p-10 overflow-auto space-y-20">
      
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Shopify App Store Media Kit</h1>
        <p className="text-gray-400">Generates 4 assets. Click download for each.</p>
      </div>

      {/* 1. FEATURE MEDIA (The Swarm) */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-between w-[1200px] items-center text-white">
          <h2 className="text-xl font-bold">1. Feature Media (1600x900)</h2>
          <button onClick={downloadFeature} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors">Download PNG</button>
        </div>
        <div className="overflow-hidden shadow-2xl rounded-lg" style={{ width: '1200px', height: '675px' }}>
          <div ref={featureRef} className="relative bg-white overflow-hidden flex-shrink-0 origin-top-left" style={{ width: '1600px', height: '900px', transform: 'scale(0.75)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100" />
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-50/50 rounded-full blur-3xl -mr-60 -mt-60" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -ml-40 -mb-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[850px] bg-white rounded-[40px] shadow-[0_50px_100px_-12px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden z-20">
                <div className="h-64 w-full relative">
                  <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Bakery" crossOrigin="anonymous" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="px-12 pb-12 relative">
                  <div className="flex justify-between items-end mb-10">
                    <div className="flex items-end gap-6 relative z-10">
                       <div className="w-32 h-32 rounded-full border-[6px] border-white bg-white shadow-md overflow-hidden -mt-20">
                          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Jane" crossOrigin="anonymous" className="w-full h-full object-cover" />
                       </div>
                       <div className="pb-2">
                          <h2 className="text-5xl font-extrabold text-gray-900 leading-none mb-2">Jane's Bakery</h2>
                          <p className="text-xl font-medium text-gray-500">Expansion Capital</p>
                       </div>
                    </div>
                    <div className="px-8 py-3 bg-brand-50 text-brand-700 text-xl font-bold rounded-full border border-brand-100 mb-2">0% Interest</div>
                  </div>
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
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-5">
                      <div className="p-4 bg-white rounded-xl shadow-sm text-brand-600"><ChartBarIcon className="w-10 h-10" /></div>
                      <div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Business Health</div>
                        <div className="text-xl font-bold text-green-600 flex items-center gap-2"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-extrabold">Grade A</span></div>
                      </div>
                    </div>
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-5">
                      <div className="p-4 bg-white rounded-xl shadow-sm text-blue-600"><UserGroupIcon className="w-10 h-10" /></div>
                      <div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Community Trust</div>
                        <div className="text-2xl font-bold text-gray-900">42 Backers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-16 left-16 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 transform -rotate-12 z-30"><div className="flex items-center gap-6"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" crossOrigin="anonymous" className="w-32 h-32 rounded-full object-cover border-8 border-white shadow-sm" /><div><p className="text-4xl font-extrabold text-gray-900 leading-tight">Mike</p><p className="text-2xl text-green-600 font-bold">+$250</p></div></div></div>
              <div className="absolute top-24 right-24 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 transform rotate-6 z-30"><div className="flex items-center gap-6"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" crossOrigin="anonymous" className="w-32 h-32 rounded-full object-cover border-8 border-white shadow-sm" /><div><p className="text-4xl font-extrabold text-gray-900 leading-tight">Sarah</p><p className="text-2xl text-green-600 font-bold">+$1,200</p></div></div></div>
              <div className="absolute bottom-24 left-24 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 transform rotate-6 z-30"><div className="flex items-center gap-6"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" crossOrigin="anonymous" className="w-32 h-32 rounded-full object-cover border-8 border-white shadow-sm" /><div><p className="text-4xl font-extrabold text-gray-900 leading-tight">David</p><p className="text-2xl text-green-600 font-bold">+$500</p></div></div></div>
              <div className="absolute bottom-16 right-16 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 transform -rotate-12 z-30"><div className="flex items-center gap-6"><img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" crossOrigin="anonymous" className="w-32 h-32 rounded-full object-cover border-8 border-white shadow-sm" /><div><p className="text-4xl font-extrabold text-gray-900 leading-tight">Priya</p><p className="text-2xl text-green-600 font-bold">+$500</p></div></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DESKTOP DASHBOARD (Active Loan) */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-between w-[1200px] items-center text-white">
          <h2 className="text-xl font-bold">2. Desktop: Merchant Dashboard</h2>
          <button onClick={downloadDashboard} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors">Download PNG</button>
        </div>
        <div className="overflow-hidden shadow-2xl rounded-lg border border-gray-700" style={{ width: '1200px', height: '675px' }}>
          <div ref={dashboardRef} className="relative bg-gray-50 flex overflow-hidden origin-top-left" style={{ width: '1600px', height: '900px', transform: 'scale(0.75)' }}>
            {/* Sidebar */}
            <div className="w-72 bg-white border-r border-gray-200 p-8 flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex items-center gap-3 text-brand-600 mb-10">
                  <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
                  <span className="text-2xl font-extrabold tracking-tight text-gray-900">LendFriend</span>
                </div>
                <nav className="space-y-2">
                  <div className="flex items-center gap-4 px-4 py-3 bg-brand-50 text-brand-700 rounded-xl font-bold"><HomeIcon className="w-6 h-6"/> Dashboard</div>
                  <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium"><CurrencyDollarIcon className="w-6 h-6"/> Capital</div>
                  <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium"><ChartBarIcon className="w-6 h-6"/> Insights</div>
                  <div className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium"><UserGroupIcon className="w-6 h-6"/> Community</div>
                </nav>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" crossOrigin="anonymous" /></div>
                <div className="text-sm"><p className="font-bold text-gray-900">Jane's Bakery</p><p className="text-gray-500">View Store</p></div>
              </div>
            </div>
            {/* Main */}
            <div className="flex-1 p-12 overflow-y-auto">
              <header className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Overview</h2>
                  <p className="text-gray-500 mt-2 text-lg">Your capital growth engine is active.</p>
                </div>
                <button className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg">New Application</button>
              </header>
              <div className="grid grid-cols-3 gap-8 mb-12">
                <div className="col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><CurrencyDollarIcon className="w-40 h-40 text-brand-600" /></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Active Capital</p>
                        <h3 className="text-5xl font-extrabold text-gray-900">$10,000</h3>
                      </div>
                      <span className="px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-sm">Active &bull; 0% Interest</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold text-gray-500"><span>Repaid: $2,450</span><span>Remaining: $7,550</span></div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-[24%] bg-brand-500 rounded-full"></div></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-center">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Repayment Rate</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-extrabold text-gray-900">10%</span>
                    <span className="text-xl text-gray-500 font-medium">of sales</span>
                  </div>
                  <p className="text-sm text-gray-500">Auto-deducted from daily revenue.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm col-span-1">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">Recent Activity</h3>
                  <div className="space-y-6">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ArrowPathIcon className="w-5 h-5"/></div>
                          <div><p className="font-bold text-gray-900">Repayment</p><p className="text-xs text-gray-500">Daily Sales</p></div>
                        </div>
                        <span className="font-mono font-bold text-gray-900">-$124.50</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-brand-900 p-8 rounded-3xl shadow-sm col-span-2 text-white relative overflow-hidden flex items-center justify-between">
                   <div className="relative z-10">
                     <h3 className="text-3xl font-bold mb-2">Community Trust Score</h3>
                     <p className="text-brand-200 mb-6">Your network backing has improved your rate.</p>
                     <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                       <UserGroupIcon className="w-6 h-6" />
                       <span className="font-bold">42 Backers Verified</span>
                     </div>
                   </div>
                   <div className="relative z-10">
                     <div className="w-32 h-32 rounded-full border-8 border-white/10 flex items-center justify-center text-4xl font-bold bg-white/5">
                        A+
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DESKTOP DETAILS (Public Page) */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-between w-[1200px] items-center text-white">
          <h2 className="text-xl font-bold">3. Desktop: Public Loan Page (1600x900)</h2>
          <button onClick={downloadDetails} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors">Download PNG</button>
        </div>
        <div className="overflow-hidden shadow-2xl rounded-lg border border-gray-700" style={{ width: '1200px', height: '675px' }}>
          <div ref={detailsRef} className="relative bg-white flex flex-col overflow-hidden origin-top-left" style={{ width: '1600px', height: '900px', transform: 'scale(0.75)' }}>
            {/* Nav */}
            <div className="border-b border-gray-200 px-12 py-6 flex justify-between items-center bg-white sticky top-0 z-50">
              <div className="flex items-center gap-2 text-brand-600">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
                <span className="text-xl font-bold text-gray-900">LendFriend</span>
              </div>
              <div className="flex gap-6 text-sm font-medium text-gray-600">
                <span>Explore</span>
                <span>How it Works</span>
                <span>For Merchants</span>
              </div>
              <button className="px-5 py-2 bg-gray-900 text-white font-bold rounded-full text-sm">Connect Wallet</button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="h-64 w-full relative">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" className="w-full h-full object-cover" crossOrigin="anonymous" />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="max-w-6xl mx-auto px-12 -mt-24 relative z-10 grid grid-cols-3 gap-12 pb-20">
                {/* Left */}
                <div className="col-span-2">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-end gap-6 mb-6">
                      <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-md overflow-hidden -mt-24 bg-white">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" crossOrigin="anonymous" />
                      </div>
                      <div className="pb-2">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Jane's Bakery</h1>
                        <div className="flex items-center gap-2 text-gray-500 font-medium"><MapPinIcon className="w-5 h-5"/> New York, NY &bull; <GlobeAltIcon className="w-5 h-5"/> janesbakery.com</div>
                      </div>
                    </div>
                    <div className="prose prose-lg text-gray-600">
                      <p>We are expanding our wholesale division and need capital to purchase a new industrial oven. Our revenue has grown 40% YoY and we have a strong community of local supporters.</p>
                    </div>
                  </div>
                  {/* Trust */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Business Health</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-2xl">
                        <div className="text-sm font-bold text-gray-500 uppercase mb-2">Revenue Stability</div>
                        <div className="flex gap-1 text-green-500"><CheckCircleIcon className="w-6 h-6"/><span className="text-lg font-bold text-gray-900">Verified Strong</span></div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-2xl">
                        <div className="text-sm font-bold text-gray-500 uppercase mb-2">Repayment History</div>
                        <div className="flex gap-1 text-blue-500"><CheckCircleIcon className="w-6 h-6"/><span className="text-lg font-bold text-gray-900">100% On Time</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Sidebar */}
                <div className="col-span-1">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-32">
                    <div className="mb-6">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-4xl font-extrabold text-gray-900">$10,000</span>
                        <span className="text-gray-500 font-medium">goal</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2"><div className="h-full w-full bg-green-500"></div></div>
                      <p className="text-green-600 font-bold text-sm">100% Funded</p>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-gray-700 font-medium border-b border-gray-50 pb-3"><span>Interest Rate</span><span className="font-bold">0%</span></div>
                      <div className="flex justify-between text-gray-700 font-medium border-b border-gray-50 pb-3"><span>Repayment</span><span className="font-bold">1.0x</span></div>
                      <div className="flex justify-between text-gray-700 font-medium pb-3"><span>Term</span><span className="font-bold">12 Months</span></div>
                    </div>
                    <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl mb-4">Loan Fully Funded</button>
                    <p className="text-center text-gray-400 text-sm">42 backers supported this loan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MOBILE (900x1600) */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-between w-[400px] items-center text-white">
          <h2 className="text-xl font-bold">4. Mobile (900x1600)</h2>
          <button onClick={downloadMobile} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors">Download PNG</button>
        </div>
        <div className="overflow-hidden shadow-2xl rounded-3xl border-8 border-gray-800" style={{ width: '400px', height: '711px' }}>
          <div ref={mobileRef} className="relative bg-gray-50 flex flex-col overflow-hidden origin-top-left" style={{ width: '900px', height: '1600px', transform: 'scale(0.444)' }}>
            <div className="bg-white p-10 pt-16 flex justify-between items-center border-b border-gray-100 shadow-sm z-10">
              <div className="flex items-center gap-4 text-brand-600">
                <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">L</div>
                <span className="text-4xl font-extrabold tracking-tight text-gray-900">LendFriend</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"><div className="w-6 h-0.5 bg-gray-900 mb-1.5"></div><div className="w-6 h-0.5 bg-gray-900"></div></div>
            </div>
            <div className="flex-1 p-10 space-y-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-200">
                <p className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-4">Active Loan</p>
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-7xl font-extrabold text-gray-900">$10k</h3>
                  <span className="px-6 py-2 bg-green-100 text-green-700 font-bold rounded-full text-xl">0% Rate</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden mb-4"><div className="h-full w-[24%] bg-brand-500 rounded-full"></div></div>
                <p className="text-2xl text-gray-500 font-medium">Next payment: Tomorrow</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-200 flex flex-col items-center text-center gap-4">
                  <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl"><ChartBarIcon className="w-12 h-12"/></div>
                  <p className="text-2xl font-bold text-gray-900">Insights</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-200 flex flex-col items-center text-center gap-4">
                  <div className="p-5 bg-brand-50 text-brand-600 rounded-3xl"><UserGroupIcon className="w-12 h-12"/></div>
                  <p className="text-2xl font-bold text-gray-900">Backers</p>
                </div>
              </div>
              <div className="bg-brand-900 p-10 rounded-[3rem] text-white">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold">A</div>
                  <div>
                    <h3 className="text-3xl font-bold">Health Score</h3>
                    <p className="text-brand-200 text-xl">Excellent Standing</p>
                  </div>
                </div>
                <div className="bg-white/10 h-2 rounded-full w-full"><div className="bg-green-400 h-full w-[85%] rounded-full"></div></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 px-4">Recent Activity</h3>
                <div className="bg-white rounded-[3rem] border border-gray-200 overflow-hidden">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="p-8 border-b border-gray-100 flex justify-between items-center last:border-0">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-gray-100 rounded-2xl text-gray-600"><CreditCardIcon className="w-8 h-8"/></div>
                        <div><p className="text-2xl font-bold text-gray-900">Repayment</p><p className="text-lg text-gray-500"> Shopify Sales</p></div>
                      </div>
                      <span className="text-2xl font-mono font-bold text-gray-900">-$124</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
