"use client";

import { useState, useEffect } from 'react';

const words = ['matters', 'helps', 'counts'];

// Alternative logo with circular icon
const CircleIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-[#29738F] to-[#6BBAA7] rounded-full animate-pulse"></div>
    <div className="relative bg-white rounded-full w-8 h-8 flex items-center justify-center">
      <div className="w-3 h-3 bg-gradient-to-r from-[#29738F] to-[#6BBAA7] rounded-full"></div>
    </div>
  </div>
);

// Minimal sparkle icon
const SparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10 2L11 7L16 8L11 9L10 14L9 9L4 8L9 7L10 2Z"/>
  </svg>
);

export function EverybitLogo() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      {/* Icon */}
      <div className="relative">
        <CircleIcon className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
        <SparkleIcon className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
      </div>
      
      {/* Text */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-nunito font-bold text-[#29738F] group-hover:text-[#6BBAA7] transition-colors duration-300">
          everybit
        </span>
        <span 
          className={`text-xl font-nunito font-medium text-gray-600 transition-all duration-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {words[currentWordIndex]}
        </span>
      </div>
    </div>
  );
}

// Even more minimal version
export function EverybitMinimal() {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="text-2xl font-nunito font-extrabold">
        <span className="text-[#29738F]">every</span>
        <span className="text-[#6BBAA7] group-hover:text-red-500 transition-colors duration-300">bit</span>
      </div>
      <div className="w-2 h-2 bg-gradient-to-r from-[#29738F] to-[#6BBAA7] rounded-full group-hover:scale-150 transition-transform duration-300"></div>
    </div>
  );
}

// Playful version with multiple elements
export function EverybitPlayful() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 group">
      {/* Animated dots */}
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-[#29738F] rounded-full animate-bounce [animation-delay:0ms]"></div>
        <div className="w-2 h-2 bg-[#6BBAA7] rounded-full animate-bounce [animation-delay:150ms]"></div>
        <div className="w-2 h-2 bg-[#29738F] rounded-full animate-bounce [animation-delay:300ms]"></div>
      </div>
      
      <div className="text-2xl font-nunito font-bold">
        <span className="bg-gradient-to-r from-[#29738F] via-[#6BBAA7] to-[#29738F] bg-clip-text text-transparent">
          everybit
        </span>
        <span 
          className={`ml-2 text-gray-700 transition-all duration-400 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          {words[currentWordIndex]}
        </span>
      </div>
    </div>
  );
}