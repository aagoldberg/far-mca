'use client';

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function AddToAppsPrompt() {
  const [dismissed, setDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // TODO: Enable once manifest is signed with accountAssociation
    // The addMiniApp() action requires a valid domain signature
    // Sign manifest at: https://farcaster.xyz/~/developers/mini-apps/manifest

    // Check if user has already dismissed this prompt
    const hasDismissed = localStorage.getItem('lendfriend_add_to_apps_dismissed');
    if (hasDismissed) {
      setDismissed(true);
      return;
    }

    // Temporarily disabled until manifest is signed
    // Show after a short delay to avoid overwhelming on first load
    // const timer = setTimeout(() => {
    //   setShowPrompt(true);
    // }, 3000);

    // return () => clearTimeout(timer);
  }, []);

  const handleAddToApps = async () => {
    try {
      await sdk.actions.addMiniApp();
      setShowPrompt(false);
      setDismissed(true);
      localStorage.setItem('lendfriend_add_to_apps_dismissed', 'true');
    } catch (error) {
      console.error('Error adding mini app:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('lendfriend_add_to_apps_dismissed', 'true');
  };

  if (dismissed || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-[#3B9B7F] to-[#2E7D68] text-white rounded-2xl p-4 shadow-lg max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Add LendFriend to Your Apps</h3>
            <p className="text-sm text-white/90 mb-3">
              Get notified when loans you support are funded and ready to claim!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAddToApps}
                className="flex-1 bg-white text-[#3B9B7F] font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Add to Apps
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-200"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
