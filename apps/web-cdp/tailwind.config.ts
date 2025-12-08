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
        // Indigo - The "Digital Safety" Primary
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Primary Base (Indigo-600)
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Warm Sand - The "Community" Secondary
        secondary: {
          50: '#fafaf9', // Warm Stone-50
          100: '#f5f5f4', // Stone-100
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c', // Stone-500
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Burnt Orange - The "Builder" Accent
        accent: {
          DEFAULT: '#EA580C', // Orange-600
          hover: '#C2410C',   // Orange-700
          50: '#fff7ed',
          100: '#ffedd5',
        },
        // Alias standard colors
        'base-blue': '#4f46e5', // Indigo
        'base-black': '#1e1b4b', // Deep Indigo/Black
        'base-gray': '#fafaf9',  // Warm Sand
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