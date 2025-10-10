"use client";

import { useState, useEffect } from 'react';
import { PaymentProviderFactory } from '@/providers/payment/factory';
import { isSandboxMode } from '@/config/sandbox';

export function ProviderDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [sandboxEnabled, setSandboxEnabled] = useState(false);
  
  useEffect(() => {
    // Only show in development or when explicitly enabled
    const showDebug = process.env.NODE_ENV === 'development' || 
                     process.env.NEXT_PUBLIC_SHOW_DEBUG === 'true';
    
    if (!showDebug) return;
    
    setCurrentProvider(PaymentProviderFactory.getCurrentProviderName());
    setSandboxEnabled(isSandboxMode());
  }, []);
  
  // Don't render in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && 
      process.env.NEXT_PUBLIC_SHOW_DEBUG !== 'true') {
    return null;
  }
  
  const handleProviderSwitch = (provider: 'coinbase' | 'privy') => {
    // Note: This would require a page reload to take effect
    // since env vars are read at build time
    localStorage.setItem('debug_payment_provider', provider);
    alert(`Provider will switch to ${provider} on next page load. Reload the page to apply.`);
  };
  
  const toggleSandboxMode = () => {
    localStorage.setItem('debug_sandbox_mode', (!sandboxEnabled).toString());
    alert('Sandbox mode toggled. Reload the page to apply.');
  };
  
  return (
    <>
      {/* Debug toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg z-50 hover:bg-gray-700"
        title="Debug Panel"
      >
        🛠️
      </button>
      
      {/* Debug panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 w-80">
          <h3 className="font-bold text-sm mb-3">Payment Provider Debug</h3>
          
          {/* Current provider info */}
          <div className="mb-4 text-sm">
            <p className="text-gray-600">Current Provider:</p>
            <p className="font-mono font-bold">{currentProvider}</p>
          </div>
          
          {/* Provider switcher */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Switch Provider:</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleProviderSwitch('coinbase')}
                className={`px-3 py-1 text-xs rounded ${
                  currentProvider === 'coinbase' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Coinbase
              </button>
              <button
                onClick={() => handleProviderSwitch('privy')}
                className={`px-3 py-1 text-xs rounded ${
                  currentProvider === 'privy' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Privy
              </button>
            </div>
          </div>
          
          {/* Sandbox mode toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sandboxEnabled}
                onChange={toggleSandboxMode}
                className="rounded"
              />
              <span>Sandbox Mode</span>
            </label>
          </div>
          
          {/* Environment info */}
          <div className="text-xs text-gray-500 border-t pt-2">
            <p>Environment: {process.env.NODE_ENV}</p>
            <p>Sandbox: {sandboxEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}