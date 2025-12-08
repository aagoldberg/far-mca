import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Emerald - The "Money/Trust" Primary (Kept)
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857', // Primary Base (Deep Emerald)
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Slate Blue - The "Tech" Secondary (Kept)
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569', // Icon/Subtext Base
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Amber/Gold - The "Opportunity" Accent (Replaces Coral)
        // Green + Gold = Wealth (Not Christmas)
        accent: {
          DEFAULT: '#F59E0B', // Amber-500 (Gold)
          hover: '#D97706',   // Amber-600
          50: '#fffbeb',
          100: '#fef3c7',
        },
        // Alias standard colors
        'base-blue': '#047857', // Deep Emerald
        'base-black': '#0f172a', // Slate-900
        'base-gray': '#f8fafc',  // Slate-50
      },
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        rubik: ['var(--font-rubik)', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config