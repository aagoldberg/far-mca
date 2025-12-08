"use client";

import LoanList from "@/components/LoanList";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-stone-100">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-white to-accent-50/30 opacity-70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-6 border border-brand-100/50 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              0% Interest Loans • 100% Impact
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-stone-900 tracking-tight mb-6 leading-[1.1]">
              Grow Your Business with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-secondary-600">
                Community Capital.
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Skip the banks. Use your verifiable sales revenue to unlock 0% interest loans from the people who believe in you most.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/create-loan"
                className="w-full sm:w-auto px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:shadow-brand-500/20 transition-all transform hover:-translate-y-1"
              >
                Start Your Raise
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-stone-50 text-stone-700 text-lg font-bold rounded-full border border-stone-200 hover:border-brand-200 shadow-md hover:shadow-lg transition-all"
              >
                How it Works
              </Link>
            </div>
            
            {/* Trust Badges / Integration Logos */}
            <div className="border-t border-stone-100 pt-8 max-w-2xl mx-auto">
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-6">
                Trusted data integrations
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Shopify */}
                <div className="flex items-center gap-2 group">
                   <svg width="110" height="32" viewBox="0 0 446.3 127.5" fill="#96bf48" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
                    <path d="M154.4,70.9c-3.8-2.1-5.8-3.8-5.8-6.2c0-3.1,2.7-5,7-5c5,0,9.4,2.1,9.4,2.1l3.5-10.7c0,0-3.2-2.5-12.7-2.5c-13.2,0-22.4,7.6-22.4,18.2c0,6,4.3,10.6,10,13.9c4.6,2.6,6.2,4.5,6.2,7.2c0,2.9-2.3,5.2-6.6,5.2c-6.4,0-12.4-3.3-12.4-3.3l-3.7,10.7c0,0,5.6,3.7,14.9,3.7c13.6,0,23.3-6.7,23.3-18.7C165.3,78.9,160.3,74.3,154.4,70.9z"/>
                    <path d="M208.6,48.4c-6.7,0-11.9,3.2-16,8l-0.2-0.1l5.8-30.4H183l-14.7,77.3h15.1l5-26.4c2-10,7.1-16.1,11.9-16.1c3.4,0,4.7,2.3,4.7,5.6c0,2.1-0.2,4.6-0.7,6.7l-5.7,30.3h15.1l5.9-31.2c0.7-3.3,1.1-7.2,1.1-9.9C220.9,53.5,216.5,48.4,208.6,48.4z"/>
                    <path d="M255.1,48.4c-18.2,0-30.3,16.4-30.3,34.7c0,11.7,7.2,21.2,20.8,21.2c17.9,0,29.9-16,29.9-34.7C275.6,58.7,269.3,48.4,255.1,48.4z M247.7,92.6c-5.2,0-7.3-4.4-7.3-9.9c0-8.7,4.5-22.8,12.7-22.8c5.4,0,7.1,4.6,7.1,9.1C260.2,78.4,255.7,92.6,247.7,92.6z"/>
                    <path d="M314.3,48.4c-10.2,0-16,9-16,9h-0.2l0.9-8.1h-13.4c-0.7,5.5-1.9,13.8-3.1,20.1L272,124.6h15.1l4.2-22.4h0.3c0,0,3.1,2,8.9,2c17.8,0,29.4-18.2,29.4-36.6C329.9,57.5,325.4,48.4,314.3,48.4z M299.9,92.9c-3.9,0-6.2-2.2-6.2-2.2l2.5-14.1c1.8-9.4,6.7-15.7,11.9-15.7c4.6,0,6,4.3,6,8.3C314.1,78.9,308.3,92.9,299.9,92.9z"/>
                    <path d="M351.5,26.7c-4.8,0-8.7,3.8-8.7,8.8c0,4.5,2.8,7.6,7.1,7.6h0.2c4.7,0,8.8-3.2,8.9-8.8C359.1,29.8,356.1,26.7,351.5,26.7z"/>
                    <polygon points="330.3,103.2 345.5,103.2 355.8,49.6 340.5,49.6"/>
                    <path d="M394.2,49.5h-10.5l0.5-2.5c0.9-5.2,3.9-9.8,9-9.8c2.7,0,4.8,0.8,4.8,0.8l3-11.8c0,0-2.6-1.3-8.2-1.3c-5.4,0-10.7,1.5-14.8,5c-5.2,4.4-7.6,10.7-8.8,17.1l-0.4,2.5h-7l-2.2,11.4h7l-8,42.3h15.1l8-42.3h10.4L394.2,49.5z"/>
                    <path d="M430.6,49.6c0,0-9.5,23.8-13.7,36.8h-0.2c-0.3-4.2-3.7-36.8-3.7-36.8h-15.9l9.1,49.2c0.2,1.1,0.1,1.8-0.3,2.5c-1.8,3.4-4.7,6.7-8.2,9.1c-2.8,2.1-6,3.4-8.5,4.3l4.2,12.8c3.1-0.7,9.4-3.2,14.8-8.2c6.9-6.5,13.3-16.4,19.8-30l18.5-39.7H430.6z"/>
                    <path d="M74.8,14.8c0,0-1.4,0.4-3.7,1.1c-0.4-1.3-1-2.8-1.8-4.4c-2.6-5-6.5-7.7-11.1-7.7c0,0,0,0,0,0c-0.3,0-0.6,0-1,0.1c-0.1-0.2-0.3-0.3-0.4-0.5c-2-2.2-4.6-3.2-7.7-3.1c-6,0.2-12,4.5-16.8,12.2c-3.4,5.4-6,12.2-6.7,17.5c-6.9,2.1-11.7,3.6-11.8,3.7c-3.5,1.1-3.6,1.2-4,4.5c-0.3,2.5-9.5,72.9-9.5,72.9l75.6,13.1V14.7C75.3,14.7,75,14.8,74.8,14.8z M57.3,20.2c-4,1.2-8.4,2.6-12.7,3.9c1.2-4.7,3.6-9.4,6.4-12.5c1.1-1.1,2.6-2.4,4.3-3.2C57,12,57.4,16.9,57.3,20.2z M49.1,4.4c1.4,0,2.6,0.3,3.6,0.9c-1.6,0.8-3.2,2.1-4.7,3.6c-3.8,4.1-6.7,10.5-7.9,16.6c-3.6,1.1-7.2,2.2-10.5,3.2C31.8,19.1,39.9,4.6,49.1,4.4z M37.5,59.4c0.4,6.4,17.3,7.8,18.3,22.9c0.7,11.9-6.3,20-16.4,20.6c-12.2,0.8-18.9-6.4-18.9-6.4l2.6-11c0,0,6.7,5.1,12.1,4.7c3.5-0.2,4.8-3.1,4.7-5.1c-0.5-8.4-14.3-7.9-15.2-21.7C23.9,51.8,31.5,40.1,48.3,39c6.5-0.4,9.8,1.2,9.8,1.2l-3.8,14.4c0,0-4.3-2-9.4-1.6C37.5,53.5,37.4,58.2,37.5,59.4z M61.3,19c0-3-0.4-7.3-1.8-10.9c4.6,0.9,6.8,6,7.8,9.1C65.5,17.7,63.5,18.3,61.3,19z"/>
                    <path d="M78.2,124l31.4-7.8c0,0-13.5-91.3-13.6-91.9c-0.1-0.6-0.6-1-1.1-1c-0.5,0-9.3-0.2-9.3-0.2s-5.4-5.2-7.4-7.2V124z"/>
                   </svg>
                </div>
                {/* Stripe */}
                <div className="flex items-center gap-2 group">
                   <svg width="80" height="32" viewBox="0 0 360 150" fill="#635BFF" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
                    <path fillRule="evenodd" clipRule="evenodd" d="M360 77.4001C360 51.8001 347.6 31.6001 323.9 31.6001C300.1 31.6001 285.7 51.8001 285.7 77.2001C285.7 107.3 302.7 122.5 327.1 122.5C339 122.5 348 119.8 354.8 116V96.0001C348 99.4001 340.2 101.5 330.3 101.5C320.6 101.5 312 98.1001 310.9 86.3001H359.8C359.8 85.0001 360 79.8001 360 77.4001ZM310.6 67.9001C310.6 56.6001 317.5 51.9001 323.8 51.9001C329.9 51.9001 336.4 56.6001 336.4 67.9001H310.6Z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M247.1 31.6001C237.3 31.6001 231 36.2001 227.5 39.4001L226.2 33.2001H204.2V149.8L229.2 144.5L229.3 116.2C232.9 118.8 238.2 122.5 247 122.5C264.9 122.5 281.2 108.1 281.2 76.4001C281.1 47.4001 264.6 31.6001 247.1 31.6001ZM241.1 100.5C235.2 100.5 231.7 98.4001 229.3 95.8001L229.2 58.7001C231.8 55.8001 235.4 53.8001 241.1 53.8001C250.2 53.8001 256.5 64.0001 256.5 77.1001C256.5 90.5001 250.3 100.5 241.1 100.5Z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M169.8 25.7L194.9 20.3V0L169.8 5.3V25.7Z"/>
                    <path d="M194.9 33.3H169.8V120.8H194.9V33.3Z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M142.9 40.7L141.3 33.3H119.7V120.8H144.7V61.5C150.6 53.8 160.6 55.2 163.7 56.3V33.3C160.5 32.1 148.8 29.9 142.9 40.7Z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M92.8999 11.6001L68.4999 16.8001L68.3999 96.9001C68.3999 111.7 79.4999 122.6 94.2999 122.6C102.5 122.6 108.5 121.1 111.8 119.3V99.0001C108.6 100.3 92.7999 104.9 92.7999 90.1001V54.6001H111.8V33.3001H92.7999L92.8999 11.6001Z"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M25.3 58.7001C25.3 54.8001 28.5 53.3001 33.8 53.3001C41.4 53.3001 51 55.6001 58.6 59.7001V36.2001C50.3 32.9001 42.1 31.6001 33.8 31.6001C13.5 31.6001 0 42.2001 0 59.9001C0 87.5001 38 83.1001 38 95.0001C38 99.6001 34 101.1 28.4 101.1C20.1 101.1 9.5 97.7001 1.1 93.1001V116.9C10.4 120.9 19.8 122.6 28.4 122.6C49.2 122.6 63.5 112.3 63.5 94.4001C63.4 64.6001 25.3 69.9001 25.3 58.7001Z"/>
                   </svg>
                </div>
                {/* Square */}
                <div className="flex items-center gap-2 group">
                   <svg width="110" height="32" viewBox="0 0 2000 501.43" fill="#000000" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
                    <path d="M501.43,83.79v333.84c0,46.27-37.5,83.79-83.79,83.79H83.79c-46.28,0-83.79-37.5-83.79-83.79V83.79C0,37.52,37.52,0,83.79,0h333.84c46.29,0,83.79,37.5,83.79,83.79ZM410.23,117.65c0-14.61-11.85-26.45-26.45-26.45H117.63c-14.61,0-26.45,11.84-26.45,26.45v266.19c0,14.61,11.84,26.45,26.45,26.45h266.17c14.61,0,26.45-11.85,26.45-26.45V117.65h-.02ZM182.32,197.6c0-8.43,6.79-15.26,15.17-15.26h106.4c8.39,0,15.17,6.84,15.17,15.26v106.24c0,8.43-6.75,15.26-15.17,15.26h-106.4c-8.39,0-15.17-6.84-15.17-15.26v-106.24ZM778.95,221.94l-3.85-.86c-41.04-9.31-65.81-14.93-65.81-42,0-24.2,23.02-41.11,55.98-41.11,30.52,0,53.74,12.76,73.08,40.16,1.11,1.57,2.84,2.61,4.74,2.84,1.89.23,3.79-.35,5.23-1.59l32.16-27.71c2.68-2.31,3.15-6.22,1.1-9.09-24.19-33.89-67.01-54.12-114.56-54.12-31.56,0-60.34,9.26-81.04,26.08-21.73,17.65-33.21,41.93-33.21,70.23,0,63.76,54.74,76.94,98.71,87.53,4.45,1.08,8.77,2.1,12.95,3.08,39.74,9.36,66,15.54,66,43.74s-24.04,45.48-61.24,45.48c-33.71,0-64.35-17.1-86.28-48.14-1.1-1.55-2.8-2.59-4.68-2.84-1.88-.25-3.73.28-5.2,1.49l-33.86,27.99c-2.72,2.25-3.28,6.14-1.3,9.05,25.63,37.64,76.48,61.97,129.56,61.97,32.56,0,62.52-9.57,84.36-26.95,23.27-18.51,35.57-44.01,35.57-73.73,0-67.27-57.62-80.13-108.45-91.48ZM1126.34,177.74h-40.76c-3.74,0-6.78,3.04-6.78,6.78v19.06c-12.6-14.21-33.77-30.22-65.18-30.22s-56.88,12.32-75.37,35.62c-17.16,21.63-26.62,51.73-26.62,84.75s9.45,63.12,26.62,84.75c18.49,23.31,44.56,35.62,75.37,35.62,26.63,0,49.1-9.45,65.18-27.37v107.92c0,3.74,3.04,6.78,6.78,6.78h40.76c3.74,0,6.78-3.04,6.78-6.78V184.52c0-3.74-3.04-6.78-6.78-6.78ZM1080.11,287.17v13.57c0,39.86-21.97,65.61-55.98,65.61-36.15,0-57.74-27.15-57.74-72.61s21.58-72.61,57.74-72.61c34.01,0,55.98,25.93,55.98,66.05ZM1360.6,177.74h-40.76c-3.74,0-6.78,3.04-6.78,6.78v130.66c0,32.45-23.32,49.42-46.36,49.42-26.03,0-39.79-15.58-39.79-45.04v-135.03c0-3.74-3.04-6.78-6.78-6.78h-40.76c-3.74,0-6.78,3.04-6.78,6.78v146.41c0,50.53,30.93,83.17,78.8,83.17,23.76,0,43.95-9.67,61.67-29.56v17.96c0,3.74,3.04,6.7... [truncated]
                   </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans Section */}
      <div id="loans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
          <h2 className="text-[22px] font-semibold text-stone-900">Community Businesses</h2>
          <Link href="/search" className="group text-[14px] text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 transition-colors">
            Show all
            <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <LoanList />
      </div>

      {/* How It Works (New Strategy) */}
      <div id="how-it-works" className="bg-white py-20 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-secondary-600 font-bold tracking-wider uppercase text-sm">The Journey</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mt-3 mb-4">
              How We Grow Together
            </h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
              We use your real-time business performance to unlock capital, focusing on your future, not your history.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-brand-100 via-secondary-100 to-brand-100 z-0 rounded-full" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-brand-500/10 border-4 border-white ring-1 ring-stone-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="text-brand-600 bg-brand-50 p-3 rounded-full">
                  {/* Icon: Data Connection */}
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">1. Prove Your Potential</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Link your Shopify, Stripe, or Square account. We verify your revenue so your community knows you're the real deal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-secondary-500/10 border-4 border-white ring-1 ring-stone-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="text-secondary-600 bg-secondary-50 p-3 rounded-full">
                  {/* Icon: Network/Share */}
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">2. Share Your Story</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Share your verified request. Friends and believers lend with confidence, knowing you have a viable business.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-brand-500/10 border-4 border-white ring-1 ring-stone-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300">
                <div className="text-brand-600 bg-brand-50 p-3 rounded-full">
                  {/* Icon: Growth/Arrow */}
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">3. Repay & Rise</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Use funds to grow. As your revenue climbs, you pay back the loan at 0% interest—strengthening your reputation for next time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900">
              Banking on Character, Not Just Credit
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Traditional Banks */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold text-stone-400 mb-6">The Old Way</h3>
              <ul className="space-y-5 text-stone-500 text-lg">
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Ignore platform revenue
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Require collateral (houses/cars)
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Weeks of paperwork
                </li>
              </ul>
            </div>

            {/* LendFriend (Highlighted) */}
            <div className="bg-white p-10 rounded-3xl border-2 border-brand-500 shadow-2xl shadow-brand-500/10 relative transform md:-translate-y-6 z-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-secondary-600 text-white px-8 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg whitespace-nowrap">
                The Community Way
              </div>
              <h3 className="text-3xl font-bold text-stone-900 mb-8 text-center">LendFriend</h3>
              <ul className="space-y-6 text-stone-700 text-lg">
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1.5 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Data-verified trust
                </li>
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1.5 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  0% Interest (Community)
                </li>
                <li className="flex items-center gap-4 font-bold">
                  <div className="p-1.5 rounded-full bg-brand-100 text-brand-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Funded by people who care
                </li>
              </ul>
              <div className="mt-10">
                <Link href="/create-loan" className="block w-full py-4 bg-brand-600 hover:bg-brand-700 text-white text-center font-bold rounded-full transition-colors shadow-lg">
                    Check Your Eligibility
                </Link>
              </div>
            </div>

            {/* Merchant Cash Advance */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold text-stone-400 mb-6">The Costly Way</h3>
              <ul className="space-y-5 text-stone-500 text-lg">
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  20-40% APR equivalent
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Aggressive daily withdrawals
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-red-400 text-2xl font-bold">✕</span>
                  Profit-driven (not people-driven)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-brand-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-secondary-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Believe in your business? <br/> So do we.
          </h2>
          <p className="text-stone-200 text-xl md:text-2xl mb-10 font-light leading-relaxed">
            Join the community where reputation and revenue build your future.
          </p>
          <Link
            href="/create-loan"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-brand-900 font-bold rounded-full shadow-2xl hover:bg-brand-50 transition-all transform hover:-translate-y-1 text-lg"
          >
            Start Your Story
          </Link>
        </div>
      </div>
    </main>
  );
}