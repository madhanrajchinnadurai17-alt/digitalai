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
        white: '#FFFFFF',
        canvas: '#F8FAFC', // Soft modern slate-50 canvas
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#0F172A', // Slate 900 ink
          pure: '#020617',
        },
        primary: {
          DEFAULT: '#4F46E5', // Electric Indigo brand color
          hover: '#4338CA',
          light: '#EEF2FF',
          border: '#C7D2FE',
        },
        accent: {
          DEFAULT: '#6366F1', // Indigo 500
          light: '#F5F3FF',
        },
        grey: {
          DEFAULT: '#64748B', // Slate 500
          hairline: '#E2E8F0', // Slate 200
        },
        muted: {
          DEFAULT: '#64748B',
          light: '#94A3B8',
        },
        border: {
          DEFAULT: '#E2E8F0', // Crisp slate border
          dark: '#0F172A',
        },
        // Functional Working Process Colors
        process: {
          DEFAULT: '#3B82F6', // Vibrant Blue
          light: '#EFF6FF',
          border: '#BFDBFE',
        },
        success: {
          DEFAULT: '#10B981', // Emerald Green
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
        pending: {
          DEFAULT: '#F59E0B', // Warm Amber
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        danger: {
          DEFAULT: '#EF4444', // Red
          light: '#FEF2F2',
          border: '#FECACA',
        },
        // Legacy aliases
        kanchipuram: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
          border: '#C7D2FE',
        },
        tumbler: {
          DEFAULT: '#F59E0B',
          hover: '#B45309',
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        space: {
          950: '#FFFFFF',
          900: '#FFFFFF',
          850: '#FFFFFF',
          800: '#8A8A8A',
          700: '#8A8A8A',
        },
        brand: {
          violet: '#0A0A0A',
          fuchsia: '#0A0A0A',
          amber: '#0A0A0A',
          orange: '#0A0A0A',
          cyan: '#0A0A0A',
        }
      },
      fontFamily: {
        display: ['"Newsreader"', 'Georgia', 'serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'none': 'none',
        'card': 'none',
        'card-hover': 'none',
        'elevation': 'none',
      },
      animation: {
        'waveform': 'waveform 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        waveform: {
          '0%': { height: '8px' },
          '100%': { height: '32px' },
        }
      }
    },
  },
  plugins: [],
}
