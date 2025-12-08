'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/solid';

export function HeroVisual() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5); // 5 steps loop
    }, 2000); // Change step every 2 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      {/* Floating Elements Background */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-100 rounded-full opacity-50 blur-xl animate-pulse"></div>
      <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-secondary-100 rounded-full opacity-50 blur-xl animate-pulse delay-700"></div>

      {/* Main Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden transform transition-all duration-500 hover:rotate-y-2 hover:scale-105">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-secondary-500 p-0.5">
              <div className="w-full h-full bg-white rounded-full overflow-hidden">
                 {/* Placeholder Avatar */}
                 <div className="w-full h-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-400">JD</div>
              </div>
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">Jane's Bakery</div>
              <div className="text-xs text-stone-500">Expansion Capital</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-extrabold text-brand-600">$5,000</div>
            <div className="text-[10px] font-semibold text-brand-200 bg-brand-50 px-2 py-0.5 rounded-full">0% Interest</div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Step 1: Revenue Verification */}
          <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${step >= 1 ? 'bg-green-50 border border-green-100' : 'bg-stone-50 border border-transparent opacity-50'}`}>
            <div className={`p-2 rounded-full ${step >= 1 ? 'bg-white text-green-500 shadow-sm' : 'bg-stone-200 text-stone-400'}`}>
              <ChartBarIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className={`text-xs font-bold ${step >= 1 ? 'text-green-800' : 'text-stone-400'}`}>Revenue Verified</div>
              <div className={`text-[10px] ${step >= 1 ? 'text-green-600' : 'text-stone-400'}`}>Shopify • $12k/mo avg</div>
            </div>
            {step >= 1 && <CheckCircleIcon className="w-5 h-5 text-green-500 animate-scale-in" />}
          </div>

          {/* Step 2: Social Trust */}
          <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${step >= 2 ? 'bg-blue-50 border border-blue-100' : 'bg-stone-50 border border-transparent opacity-50'}`}>
            <div className={`p-2 rounded-full ${step >= 2 ? 'bg-white text-blue-500 shadow-sm' : 'bg-stone-200 text-stone-400'}`}>
              <UserGroupIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className={`text-xs font-bold ${step >= 2 ? 'text-blue-800' : 'text-stone-400'}`}>Community Trust</div>
              <div className={`text-[10px] ${step >= 2 ? 'text-blue-600' : 'text-stone-400'}`}>Farcaster • 500+ followers</div>
            </div>
            {step >= 2 && <CheckCircleIcon className="w-5 h-5 text-blue-500 animate-scale-in" />}
          </div>

          {/* Step 3: Funding Progress */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-stone-600">{step >= 3 ? '100% Funded' : step >= 1 ? '40% Funded' : '0% Funded'}</span>
              <span className="text-stone-400">{step >= 3 ? '25 backers' : step >= 1 ? '10 backers' : '0 backers'}</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-secondary-500 transition-all duration-1000 ease-out"
                style={{ width: step >= 3 ? '100%' : step >= 1 ? '40%' : '5%' }}
              />
            </div>
          </div>

          {/* Step 4: Success Message */}
          <div className={`absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ${step === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`text-center transform transition-transform duration-500 ${step === 4 ? 'scale-100' : 'scale-90'}`}>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-bounce">
                <CurrencyDollarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-stone-900">Funded!</h3>
              <p className="text-sm text-stone-500">Ready to grow.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
