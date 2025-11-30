'use client';

import { useState, useEffect, useRef } from 'react';
import { useSignInWithOAuth, useSignInWithEmail, useSignInWithSms, useIsSignedIn } from '@coinbase/cdp-hooks';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { signInWithOAuth } = useSignInWithOAuth();
  const { signInWithEmail } = useSignInWithEmail();
  const { signInWithSms } = useSignInWithSms();
  const { isSignedIn } = useIsSignedIn();
  const { isConnected } = useAccount(); // For external wallets via RainbowKit
  const { openConnectModal } = useConnectModal();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when user signs in (CDP or external wallet)
  useEffect(() => {
    if (isSignedIn || isConnected) {
      setIsOpen(false);
    }
  }, [isSignedIn, isConnected]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowEmailInput(false);
        setShowPhoneInput(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (isSignedIn || isConnected) return null;

  const handleGoogleSignIn = async () => {
    console.log('[AuthModal] Google button clicked');
    try {
      await signInWithOAuth('google');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithOAuth('apple');
    } catch (error) {
      console.error('Apple sign-in failed:', error);
    }
  };

  const handleXSignIn = async () => {
    try {
      await signInWithOAuth('x');
    } catch (error) {
      console.error('X sign-in failed:', error);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await signInWithEmail({ email });
      // After this, user needs to verify OTP
    } catch (error) {
      console.error('Email sign-in failed:', error);
    }
  };

  const handleSmsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    try {
      // Ensure phone number has country code format (e.g., +1234567890)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber.replace(/\D/g, '')}`;
      await signInWithSms({ phoneNumber: formattedPhone });
      // After this, user needs to verify OTP
    } catch (error) {
      console.error('SMS sign-in failed:', error);
      alert('Please enter a valid phone number with country code (e.g., +1234567890)');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#29738F] hover:bg-[#1E5A6F] text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap"
      >
        Log In
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-[300]">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1.5 text-center">
              {showEmailInput ? 'Sign in with Email' : showPhoneInput ? 'Sign in with Phone' : 'Log in or sign up'}
            </h3>
            {(showEmailInput || showPhoneInput) && (
              <p className="text-sm text-gray-600 text-center">
                {showEmailInput ? 'Enter your email address' : 'Enter your phone number'}
              </p>
            )}
          </div>

          {/* Content */}
          {showEmailInput ? (
            <div className="space-y-3">
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29738F] focus:border-transparent text-gray-900"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-[#29738F] hover:bg-[#1E5A6F] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Continue with Email
                </button>
              </form>
              <button
                onClick={() => setShowEmailInput(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
              >
                ← Back to options
              </button>
            </div>
          ) : showPhoneInput ? (
            <div className="space-y-3">
              <form onSubmit={handleSmsSignIn} className="space-y-3">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29738F] focus:border-transparent text-gray-900"
                  autoFocus
                />
                <p className="text-xs text-gray-500">Include country code (e.g., +1 for US)</p>
                <button
                  type="submit"
                  className="w-full bg-[#29738F] hover:bg-[#1E5A6F] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Continue with Phone
                </button>
              </form>
              <button
                onClick={() => setShowPhoneInput(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
              >
                ← Back to options
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Wallet Connection Section */}
              <div className="space-y-2">
                <button
                  onClick={() => openConnectModal?.()}
                  disabled={!openConnectModal}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Wallet</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
                    or
                  </span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="space-y-2">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  onClick={handleAppleSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span>Apple</span>
                </button>

                <button
                  onClick={handleXSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X</span>
                </button>

                <button
                  onClick={() => setShowPhoneInput(true)}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Phone</span>
                </button>

                <button
                  onClick={() => setShowEmailInput(true)}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center">
                  <img src="/coinbase-wordmark.svg" alt="Protected by Coinbase" className="h-4 opacity-40 hover:opacity-60 transition-opacity" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
