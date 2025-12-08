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
        // Spruce Green - The "Trust/Money" Primary
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Bright Teal for accents
          600: '#0d9488',
          700: '#0f766e', // Primary Base (Deep Spruce)
          800: '#115e59',
          900: '#134e4a', // Darkest Text
          950: '#042f2e',
        },
        // Stone/Earth - The "Human/Foundation" Secondary
        secondary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c', // Icon/Subtext Base
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Amber - The "Opportunity" Accent
        accent: {
          DEFAULT: '#F59E0B', // Amber-500
          hover: '#D97706', // Amber-600
          50: '#fffbeb',
          100: '#fef3c7',
        },
        // Alias standard colors to 'base' semantics if needed
        'base-blue': '#0f766e', // Remapping your old 'base-blue' calls to Spruce
        'base-black': '#1c1917', // Remapping old black to Warm Charcoal
        'base-gray': '#fafaf9',  // Remapping old gray to Warm Stone
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