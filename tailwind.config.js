/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF8',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1A1A2E',
          soft: '#2D3142',
        },
        muted: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
        },
        kanchipuram: {
          DEFAULT: '#3730A3',
          hover: '#312E81',
          light: '#EEF2FF',
          border: '#C7D2FE',
        },
        tumbler: {
          DEFAULT: '#D97706',
          hover: '#B45309',
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        marigold: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        success: {
          DEFAULT: '#059669',
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
          border: '#FECACA',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#D1D5DB',
        },
        // Backwards compatibility fallbacks
        space: {
          950: '#FAFAF8',
          900: '#FFFFFF',
          850: '#F3F4F6',
          800: '#E5E7EB',
          700: '#D1D5DB',
        },
        brand: {
          violet: '#3730A3',
          fuchsia: '#D97706',
          amber: '#F59E0B',
          orange: '#EA580C',
          cyan: '#0D9488',
        }
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
        'elevation': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
