'use client';

import { useState, useEffect, useRef } from 'react';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { useWalletClient } from 'wagmi';

type FarcasterSignupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (farcasterData: { fid: number; username: string }) => void;
};

export function FarcasterSignupModal({ isOpen, onClose, onSuccess }: FarcasterSignupModalProps) {
  const [step, setStep] = useState<'username' | 'signing' | 'success'>('username');
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { evmAddress: address } = useEvmAddress();
  const { data: walletClient } = useWalletClient();

  // Auto-check username as user types (debounced)
  useEffect(() => {
    if (!username || username.length < 1) {
      setIsAvailable(null);
      setError('');
      return;
    }

    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout to check after 500ms of no typing
    debounceTimeout.current = setTimeout(() => {
      checkUsername();
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [username]);

  if (!isOpen) return null;

  const checkUsername = async () => {
    if (!username || username.length < 1 || username.length > 16) {
      setError('Username must be 1-16 characters');
      setIsAvailable(false);
      return;
    }

    if (!/^[a-z0-9][a-z0-9-]{0,15}$/.test(username)) {
      setError('Only lowercase letters, numbers, and hyphens allowed');
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      const response = await fetch(`/api/farcaster/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (data.available) {
        setIsAvailable(true);
        setError('');
      } else {
        setIsAvailable(false);
        setError(data.message || 'Username not available');
      }
    } catch (err: any) {
      setError('Failed to check username availability');
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const createAccount = async () => {
    if (!isAvailable || !address || !walletClient) {
      return;
    }

    setIsCreating(true);
    setStep('signing');
    setError('');

    try {
      // Prepare the signature message
      const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now
      const message = `Create @${username} on Farcaster Social Network\n\nConnected wallet: ${address}\n\nThis is a free username signup`;

      // Request signature from CDP wallet
      const signature = await walletClient.signMessage({
        message,
        account: address as `0x${string}`,
      });

      // Register the Farcaster account
      const response = await fetch('/api/farcaster/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          walletAddress: address,
          signature,
          deadline,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Success!
      setStep('success');
      onSuccess({ fid: data.fid, username: data.username });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err: any) {
      console.error('Failed to create Farcaster account:', err);
      setError(err.message || 'Failed to create account. Please try again.');
      setStep('username');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setStep('username');
    setUsername('');
    setIsAvailable(null);
    setError('');
    setIsCreating(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 pt-20">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 my-auto">
        {step === 'username' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Your Farcaster Account
              </h2>
              <p className="text-gray-600 text-sm">
                Choose your username on Farcaster Social Network
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value.toLowerCase());
                      setIsAvailable(null);
                      setError('');
                    }}
                    placeholder="yourname"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29738F] focus:border-transparent text-gray-900"
                    maxLength={16}
                    autoFocus
                  />
                  {isAvailable === true && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">✓</span>
                  )}
                  {isAvailable === false && error && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600">✗</span>
                  )}
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
                {isAvailable && !error && (
                  <p className="mt-1 text-sm text-green-600">Username is available!</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  1-16 characters, lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <button
                onClick={checkUsername}
                disabled={isChecking || !username}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? 'Checking...' : 'Check Availability'}
              </button>

              <button
                onClick={createAccount}
                disabled={!isAvailable || isCreating}
                className="w-full bg-[#29738F] hover:bg-[#1E5A6F] text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>

              <button
                onClick={handleClose}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {step === 'signing' && (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto border-4 border-[#29738F] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Creating your account...
            </h3>
            <p className="text-gray-600 text-sm">
              Please sign the message in your wallet
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🎉 Success!
            </h3>
            <p className="text-gray-600">
              Your Farcaster account <span className="font-semibold">@{username}</span> has been created!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
