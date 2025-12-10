'use client';

import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  CalculatorIcon,
  CalendarIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  HomeIcon,
  CreditCardIcon,
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as SolidCheckCircle } from '@heroicons/react/24/solid';

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

// Reusable Mock Navbar
const MockNavbar = () => (
  <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 px-8 h-16 flex items-center justify-between">
    <div className="flex items-center gap-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">L</div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">LendFriend</span>
      </div>
      {/* Search */}
      <div className="hidden md:flex items-center text-gray-400 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-64">
        <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
        <span className="text-sm">Search loans...</span>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
        About <ChevronDownIcon className="w-4 h-4" />
      </div>
      <button className="bg-brand-600 text-white text-sm font-medium py-2 px-5 rounded-full shadow-sm">
        Start Your Raise
      </button>
      <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" crossOrigin="anonymous"/>
      </div>
    </div>
  </nav>
);

export default function MediaKitPage() {
  const featureRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null); 
  const detailsRef = useRef<HTMLDivElement>(null); 
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

      {/* 1. FEATURE MEDIA */}
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
                        <SolidCheckCircle className="w-8 h-8" />
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

      {/* 2. DESKTOP DASHBOARD */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-between w-[1200px] items-center text-white">
          <h2 className="text-xl font-bold">2. Desktop: Merchant Dashboard</h2>
          <button onClick={downloadDashboard} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors">Download PNG</button>
        </div>
        <div className="overflow-hidden shadow-2xl rounded-lg border border-gray-700" style={{ width: '1200px', height: '675px' }}>
          <div ref={dashboardRef} className="relative bg-gray-50 flex flex-col overflow-hidden origin-top-left" style={{ width: '1600px', height: '900px', transform: 'scale(0.75)' }}>
            
            <MockNavbar />

            {/* Dashboard Content */}
            <div className="flex-1 p-12 max-w-7xl mx-auto w-full">
              <div className="space-y-6">
                
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Revenue Sharing Dashboard</h2>
                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </div>

                  {/* Revenue Metrics */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                      <CurrencyDollarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-gray-900">5%</div>
                      <div className="text-sm text-gray-500 font-medium">Revenue Share</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                      <CalculatorIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-gray-900">1.5x</div>
                      <div className="text-sm text-gray-500 font-medium">Repayment Cap</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                      <ArrowTrendingUpIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-gray-900">$2,450</div>
                      <div className="text-sm text-gray-500 font-medium">Total Repaid</div>
                    </div>
                  </div>

                  {/* Revenue Reporting */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Reporting</h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                      <ChartBarIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Report Your Monthly Revenue</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Report your business revenue each month to calculate investor payments. 
                          Payments are automatically calculated at 5% of reported revenue.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Revenue (USD)</label>
                        <input type="text" placeholder="Enter this month's revenue" className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900" disabled />
                      </div>
                      <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-sm">Submit Revenue</button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[1, 2, 3].map((i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec {10 - i}, 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Revenue Share</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$124.50</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          <h2 className="text-xl font-bold">3. Desktop: Public Loan Page</h2>
          <button onClick={downloadDetails} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors">Download PNG</button>
        </div>
        <div className="overflow-hidden shadow-2xl rounded-lg border border-gray-700" style={{ width: '1200px', height: '675px' }}>
          <div ref={detailsRef} className="relative bg-white flex flex-col overflow-hidden origin-top-left" style={{ width: '1600px', height: '900px', transform: 'scale(0.75)' }}>
            
            <MockNavbar />

            <div className="flex-1 overflow-y-auto">
              <div className="h-72 w-full relative">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" className="w-full h-full object-cover" crossOrigin="anonymous" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="max-w-7xl mx-auto px-8 -mt-24 relative z-10 grid grid-cols-3 gap-12 pb-20">
                
                {/* Left Col */}
                <div className="col-span-2 space-y-8">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" crossOrigin="anonymous" />
                      </div>
                      <div className="pt-2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Jane's Bakery Expansion</h1>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <span>Organized by Jane Doe</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">Borrower</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-xs">
                            <ShieldCheckIcon className="w-3 h-3 text-green-500" />
                            Verified identity
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="prose prose-gray max-w-none text-gray-600">
                      <p>We are a beloved local bakery in downtown looking to expand our wholesale division. To meet growing demand from local cafes, we need to purchase a new industrial oven and hire two additional pastry chefs.</p>
                      <p>This capital will allow us to increase production by 40% and reach profitability on our wholesale line within 6 months.</p>
                    </div>
                  </div>

                  {/* Trust Signals */}
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Verification & Trust</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-start gap-4 p-4 bg-brand-50/50 border border-brand-100 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-brand-600">
                          <GlobeAltIcon className="w-5 h-5"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900">Verified Business</span>
                          </div>
                          <div className="text-sm text-brand-600 font-medium">janesbakery.com</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 mt-0.5 flex items-center justify-center text-gray-400">
                          <UserGroupIcon className="w-4 h-4"/>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">Community Support</div>
                          <div className="text-sm text-gray-600">Strong (42 backers)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Health */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Business Health</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Revenue Stability</div>
                        <div className="flex items-center gap-2 text-green-700 font-bold">
                          <CheckCircleIcon className="w-5 h-5"/> <span>Excellent</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Business Tenure</div>
                        <div className="flex items-center gap-2 text-blue-700 font-bold">
                          <CheckCircleIcon className="w-5 h-5"/> <span>3+ Years</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Growth Trend</div>
                        <div className="flex items-center gap-2 text-green-700 font-bold">
                          <ArrowTrendingUpIcon className="w-5 h-5"/> <span>+25% YoY</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Order Volume</div>
                        <div className="flex items-center gap-2 text-green-700 font-bold">
                          <CheckCircleIcon className="w-5 h-5"/> <span>High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="col-span-1">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-bold text-gray-900">$10,000</span>
                        <span className="text-gray-500">raised of $10,000</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                        <div className="bg-brand-600 h-2 rounded-full w-full"></div>
                      </div>
                      <p className="text-sm text-green-600 font-bold text-right">100% funded</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-full cursor-not-allowed">
                        Fully Funded
                      </button>
                      <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50">
                        Share
                      </button>
                    </div>

                    <div className="space-y-4 mb-4 pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-600"><CurrencyDollarIcon className="w-5 h-5"/></div>
                        <div><div className="text-sm font-medium text-gray-900">0% interest rate</div><div className="text-xs text-gray-500">Pay back exactly what you borrow</div></div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-600"><ArrowPathIcon className="w-5 h-5"/></div>
                        <div><div className="text-sm font-medium text-gray-900">1.0x repayment</div><div className="text-xs text-gray-500">Full principal returned</div></div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-600"><CalendarIcon className="w-5 h-5"/></div>
                        <div><div className="text-sm font-medium text-gray-900">Due Dec 2026</div><div className="text-xs text-gray-500">12 month term</div></div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Recent Supporters</h4>
                      <div className="space-y-4">
                        {[1,2,3].map(i => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                              {['JD', 'SM', 'MK'][i-1]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">Anonymous</p>
                              <p className="text-xs text-gray-500">$500 • {i}h ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MOBILE */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-between w-[400px] items-center text-white">
          <h2 className="text-xl font-bold">4. Mobile (900x1600)</h2>
          <button onClick={downloadMobile} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors">Download PNG</button>
        </div>
        <div className="overflow-hidden shadow-2xl rounded-3xl border-8 border-gray-800" style={{ width: '400px', height: '711px' }}>
          <div ref={mobileRef} className="relative bg-gray-50 flex flex-col overflow-hidden origin-top-left" style={{ width: '900px', height: '1600px', transform: 'scale(0.444)' }}>
            
            {/* Mobile Header */}
            <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 pt-12">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">LendFriend</span>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover" crossOrigin="anonymous"/>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Active Loan</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold">Active</span>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">$10,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div className="bg-brand-600 h-2 rounded-full w-[24%]"></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Paid: $2,450</span>
                  <span>Left: $7,550</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CalculatorIcon className="w-8 h-8"/></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1.5x</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">Cap</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CurrencyDollarIcon className="w-8 h-8"/></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">5%</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">Share</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><ArrowTrendingUpIcon className="w-5 h-5"/></div>
                        <div><p className="font-bold text-sm text-gray-900">Repayment</p><p className="text-xs text-gray-500">Revenue Share</p></div>
                      </div>
                      <span className="font-mono font-bold text-sm text-gray-900">-$124.50</span>
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
