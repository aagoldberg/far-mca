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
        // Terracotta / Burnt Orange - The "Community Builder" Primary
        // Warm, human, high-energy. Stands out from cold fintech blues.
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // Primary Base (Terracotta)
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Warm Sand/Stone - The "Foundation" Secondary
        // Grounded, physical, welcoming.
        secondary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Sage Green - The "Growth & Safety" Accent
        // Used for success states, money, and trust badges.
        accent: {
          DEFAULT: '#059669', // Emerald-600
          hover: '#047857',
          50: '#ecfdf5',
          100: '#d1fae5',
        },
        // Alias standard colors
        'base-blue': '#ea580c', // Remapped to Terracotta
        'base-black': '#1c1917', // Warm Charcoal
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
