'use client';

import { useEffect, useState } from 'react';
import { profileCache, metadataCache } from '@/lib/cache';

export default function CacheStats() {
  const [stats, setStats] = useState({ profiles: 0, metadata: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        profiles: profileCache.stats().size,
        metadata: metadataCache.stats().size,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs px-3 py-2 rounded-lg font-mono hover:bg-opacity-90 transition-opacity"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white text-xs p-4 rounded-lg font-mono shadow-lg border border-gray-700 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold">Cache Stats</div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white ml-2"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Profiles:</span>
          <span className="text-green-400 font-semibold">{stats.profiles}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Metadata:</span>
          <span className="text-blue-400 font-semibold">{stats.metadata}</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700 text-gray-500 text-[10px]">
        Dev only • Updates every 1s
      </div>
    </div>
  );
}
