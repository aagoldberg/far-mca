"use client";

export const MockModeIndicator = () => {
  const MOCK_MODE = process.env.NEXT_PUBLIC_COINBASE_MOCK_MODE === 'true';
  
  if (!MOCK_MODE) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-lg">🧪</span>
        <span className="font-semibold text-sm">Mock Mode Active</span>
      </div>
      <p className="text-xs mt-1">
        Coinbase payments are simulated
      </p>
    </div>
  );
};