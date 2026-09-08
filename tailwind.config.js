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
        // Monochromatic fallbacks so legacy aliases safely resolve to 3-color palette
        kanchipuram: {
          DEFAULT: '#0A0A0A',
          hover: '#000000',
          light: '#FFFFFF',
          border: '#8A8A8A',
        },
        tumbler: {
          DEFAULT: '#0A0A0A',
          hover: '#000000',
          light: '#FFFFFF',
          border: '#8A8A8A',
        },
        marigold: {
          DEFAULT: '#0A0A0A',
          light: '#FFFFFF',
        },
        success: {
          DEFAULT: '#0A0A0A',
          light: '#FFFFFF',
          border: '#8A8A8A',
        },
        danger: {
          DEFAULT: '#0A0A0A',
          light: '#FFFFFF',
          border: '#8A8A8A',
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
