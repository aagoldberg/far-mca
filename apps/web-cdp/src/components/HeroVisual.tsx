'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
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
          
          {/* Step 1: Shopify Connection */}
          <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${step >= 1 ? 'bg-green-50 border border-green-100' : 'bg-stone-50 border border-transparent opacity-50'}`}>
            <div className={`p-2 rounded-full ${step >= 1 ? 'bg-white shadow-sm' : 'bg-stone-200'}`}>
              {/* Shopify Logo */}
              <svg width="20" height="20" viewBox="0 0 446.3 127.5" fill={step >= 1 ? "#96bf48" : "#9ca3af"} xmlns="http://www.w3.org/2000/svg">
                <path d="M154.4,70.9c-3.8-2.1-5.8-3.8-5.8-6.2c0-3.1,2.7-5,7-5c5,0,9.4,2.1,9.4,2.1l3.5-10.7c0,0-3.2-2.5-12.7-2.5c-13.2,0-22.4,7.6-22.4,18.2c0,6,4.3,10.6,10,13.9c4.6,2.6,6.2,4.5,6.2,7.2c0,2.9-2.3,5.2-6.6,5.2c-6.4,0-12.4-3.3-12.4-3.3l-3.7,10.7c0,0,5.6,3.7,14.9,3.7c13.6,0,23.3-6.7,23.3-18.7C165.3,78.9,160.3,74.3,154.4,70.9z"/>
                <path d="M208.6,48.4c-6.7,0-11.9,3.2-16,8l-0.2-0.1l5.8-30.4H183l-14.7,77.3h15.1l5-26.4c2-10,7.1-16.1,11.9-16.1c3.4,0,4.7,2.3,4.7,5.6c0,2.1-0.2,4.6-0.7,6.7l-5.7,30.3h15.1l5.9-31.2c0.7-3.3,1.1-7.2,1.1-9.9C220.9,53.5,216.5,48.4,208.6,48.4z"/>
                <path d="M74.8,14.8c0,0-1.4,0.4-3.7,1.1c-0.4-1.3-1-2.8-1.8-4.4c-2.6-5-6.5-7.7-11.1-7.7c0,0,0,0,0,0c-0.3,0-0.6,0-1,0.1c-0.1-0.2-0.3-0.3-0.4-0.5c-2-2.2-4.6-3.2-7.7-3.1c-6,0.2-12,4.5-16.8,12.2c-3.4,5.4-6,12.2-6.7,17.5c-6.9,2.1-11.7,3.6-11.8,3.7c-3.5,1.1-3.6,1.2-4,4.5c-0.3,2.5-9.5,72.9-9.5,72.9l75.6,13.1V14.7C75.3,14.7,75,14.8,74.8,14.8z M57.3,20.2c-4,1.2-8.4,2.6-12.7,3.9c1.2-4.7,3.6-9.4,6.4-12.5c1.1-1.1,2.6-2.4,4.3-3.2C57,12,57.4,16.9,57.3,20.2z M49.1,4.4c1.4,0,2.6,0.3,3.6,0.9c-1.6,0.8-3.2,2.1-4.7,3.6c-3.8,4.1-6.7,10.5-7.9,16.6c-3.6,1.1-7.2,2.2-10.5,3.2C31.8,19.1,39.9,4.6,49.1,4.4z M37.5,59.4c0.4,6.4,17.3,7.8,18.3,22.9c0.7,11.9-6.3,20-16.4,20.6c-12.2,0.8-18.9-6.4-18.9-6.4l2.6-11c0,0,6.7,5.1,12.1,4.7c3.5-0.2,4.8-3.1,4.7-5.1c-0.5-8.4-14.3-7.9-15.2-21.7C23.9,51.8,31.5,40.1,48.3,39c6.5-0.4,9.8,1.2,9.8,1.2l-3.8,14.4c0,0-4.3-2-9.4-1.6C37.5,53.5,37.4,58.2,37.5,59.4z M61.3,19c0-3-0.4-7.3-1.8-10.9c4.6,0.9,6.8,6,7.8,9.1C65.5,17.7,63.5,18.3,61.3,19z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className={`text-xs font-bold ${step >= 1 ? 'text-green-800' : 'text-stone-400'}`}>Shopify Connected</div>
              <div className={`text-[10px] ${step >= 1 ? 'text-green-600' : 'text-stone-400'}`}>Verified: $12k/mo Revenue</div>
            </div>
            {step >= 1 && <CheckCircleIcon className="w-5 h-5 text-green-500 animate-scale-in" />}
          </div>

          {/* Step 2: Farcaster Connection */}
          <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${step >= 2 ? 'bg-purple-50 border border-purple-100' : 'bg-stone-50 border border-transparent opacity-50'}`}>
            <div className={`p-2 rounded-full ${step >= 2 ? 'bg-white shadow-sm' : 'bg-stone-200'}`}>
              {/* Farcaster Logo */}
              <svg width="20" height="20" viewBox="0 0 1000 1000" fill={step >= 2 ? "#855DCD" : "#9ca3af"} xmlns="http://www.w3.org/2000/svg">
                <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z"/>
                <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                <path d="M675.555 746.667C663.282 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.444H875.555V817.778C875.555 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.555Z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className={`text-xs font-bold ${step >= 2 ? 'text-purple-800' : 'text-stone-400'}`}>Farcaster Verified</div>
              <div className={`text-[10px] ${step >= 2 ? 'text-purple-600' : 'text-stone-400'}`}>Social Trust • 500+ followers</div>
            </div>
            {step >= 2 && <CheckCircleIcon className="w-5 h-5 text-purple-500 animate-scale-in" />}
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