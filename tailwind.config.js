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
        canvas: '#FFFFFF',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#0A0A0A',
          pure: '#000000',
        },
        grey: {
          DEFAULT: '#8A8A8A',
          hairline: '#8A8A8A',
        },
        muted: {
          DEFAULT: '#8A8A8A',
          light: '#8A8A8A',
        },
        border: {
          DEFAULT: '#8A8A8A',
          dark: '#0A0A0A',
        },
        // Functional Working Process Colors
        process: {
          DEFAULT: '#2563EB', // Cobalt Blue for active generation & AI work
          light: '#EFF6FF',
          border: '#BFDBFE',
        },
        success: {
          DEFAULT: '#059669', // Emerald Green for verified, approved, live
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
        pending: {
          DEFAULT: '#D97706', // Warm Amber for scheduled, queue, warning
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        danger: {
          DEFAULT: '#DC2626', // Rose for errors
          light: '#FEF2F2',
          border: '#FECACA',
        },
        // Monochromatic fallbacks so legacy aliases safely resolve
        kanchipuram: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          border: '#BFDBFE',
        },
        tumbler: {
          DEFAULT: '#D97706',
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
