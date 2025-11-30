'use client';

import { useSignInWithOAuth, useSignInWithEmail, useIsSignedIn } from '@coinbase/cdp-hooks';
import { useState } from 'react';

export function AuthButtons() {
  const { signInWithOAuth } = useSignInWithOAuth();
  const { signInWithEmail } = useSignInWithEmail();
  const { isSignedIn } = useIsSignedIn();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  if (isSignedIn) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithOAuth('oauth:google');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithOAuth('oauth:apple');
    } catch (error) {
      console.error('Apple sign-in failed:', error);
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

  if (showEmailInput) {
    return (
      <div className="space-y-2">
        <form onSubmit={handleEmailSignIn} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29738F]"
          />
          <button
            type="submit"
            className="w-full bg-[#29738F] hover:bg-[#1E5A6F] text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Continue with Email
          </button>
        </form>
        <button
          onClick={() => setShowEmailInput(false)}
          className="w-full text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to options
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleGoogleSignIn}
        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <button
        onClick={handleAppleSignIn}
        className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        Continue with Apple
      </button>

      <button
        onClick={() => setShowEmailInput(true)}
        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Continue with Email
      </button>
    </div>
  );
}
