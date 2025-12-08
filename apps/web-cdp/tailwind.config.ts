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
        // Deep Emerald - The "Modern Money" Primary
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Bright Emerald for highlights
          600: '#059669',
          700: '#047857', // Primary Base (Deep Emerald)
          800: '#065f46',
          900: '#064e3b', // Darkest Text
          950: '#022c22',
        },
        // Slate Blue - The "Tech/Corporate" Secondary
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569', // Icon/Subtext Base (Slate Blue)
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Coral - The "Community" Accent
        accent: {
          DEFAULT: '#F47461', // Coral Base
          hover: '#E05D4C',   // Darker Coral
          50: '#fff1f0',
          100: '#ffe4e1',
        },
        // Alias standard colors to 'base' semantics
        'base-blue': '#047857', // Remapped to Deep Emerald
        'base-black': '#0f172a', // Remapped to Slate-900 (Dark Navy)
        'base-gray': '#f8fafc',  // Remapped to Slate-50 (Cool White)
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
