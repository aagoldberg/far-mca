'use client';

import { useState, useEffect } from 'react';
import { useFarcasterAccount } from '@/hooks/useFarcasterAccount';

interface FarcasterOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestedUsername?: string;
}

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export function FarcasterOnboardingModal({
  isOpen,
  onClose,
  suggestedUsername = '',
}: FarcasterOnboardingModalProps) {
  const { createAccount, isLoading, error, clearError } = useFarcasterAccount();
  const [username, setUsername] = useState(suggestedUsername);
  const [step, setStep] = useState<'prompt' | 'creating' | 'success'>('prompt');
  const [availability, setAvailability] = useState<AvailabilityStatus>('idle');

  // Check username availability with debouncing
  useEffect(() => {
    if (!username || username.trim().length === 0) {
      setAvailability('idle');
      return;
    }

    // Validate format first
    if (!/^[a-z0-9][a-z0-9-]{0,15}$/.test(username)) {
      setAvailability('invalid');
      return;
    }

    setAvailability('checking');

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/farcaster/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();

        if (data.available) {
          setAvailability('available');
        } else {
          setAvailability('taken');
        }
      } catch (err) {
        console.error('Error checking username:', err);
        setAvailability('idle');
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [username]);

  if (!isOpen) return null;

  const handleSkip = () => {
    onClose();
  };

  const handleCreate = async () => {
    if (!username || username.trim().length === 0) {
      return;
    }

    setStep('creating');
    clearError();

    const success = await createAccount(username.toLowerCase().trim());

    if (success) {
      setStep('success');
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setStep('prompt'); // Stay on prompt if failed
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-gray-100">
        {/* Close button (only show on prompt step) */}
        {step === 'prompt' && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Prompt Step */}
        {step === 'prompt' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Pick a username
              </h2>
              <p className="text-sm text-gray-500">
                For your social profile
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">
                    @
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                      clearError();
                    }}
                    placeholder="yourname"
                    className="w-full pl-10 pr-4 py-3.5 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm"
                    autoFocus
                    maxLength={16}
                  />
                </div>

                {/* Availability Status */}
                {username && username.length > 0 && (
                  <div className="flex items-center gap-2 px-1">
                    {availability === 'checking' && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span>Checking...</span>
                      </div>
                    )}
                    {availability === 'available' && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Available</span>
                      </div>
                    )}
                    {availability === 'taken' && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>Already taken</span>
                      </div>
                    )}
                    {availability === 'invalid' && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Letters, numbers, hyphens only</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={isLoading || availability !== 'available'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                {isLoading ? 'Creating...' : 'Continue'}
              </button>

              <button
                onClick={handleSkip}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2.5 transition-colors"
              >
                Skip
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free & secure</span>
              </div>
            </div>
          </div>
        )}

        {/* Creating Step */}
        {step === 'creating' && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-600">Setting up your profile...</p>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h3>
            <p className="text-gray-600 text-lg">@{username}</p>
          </div>
        )}
      </div>
    </div>
  );
}
