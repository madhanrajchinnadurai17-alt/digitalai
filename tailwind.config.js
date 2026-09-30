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
        bg: '#0B0B12',
        surface: '#14141F',
        line: '#26263A',
        ink: {
          DEFAULT: '#F5F5FA',
          pure: '#FFFFFF',
          muted: '#9A9AB5',
        },
        muted: {
          DEFAULT: '#9A9AB5',
          light: '#7E7E9A',
        },
        grey: {
          DEFAULT: '#9A9AB5',
          hairline: '#26263A',
        },
        border: {
          DEFAULT: '#26263A',
          dark: '#3A3A54',
        },
        // AI Electric & Neon Brand Highlights
        ai: {
          violet: '#8B5CF6',
          cyan: '#22D3EE',
          glow: 'rgba(139, 92, 246, 0.35)',
        },
        // Functional Process Colors (AI Neon Translucent)
        process: {
          DEFAULT: '#8B5CF6',
          light: 'rgba(139, 92, 246, 0.12)',
          border: 'rgba(139, 92, 246, 0.35)',
        },
        success: {
          DEFAULT: '#34D399',
          light: 'rgba(52, 211, 153, 0.12)',
          border: 'rgba(52, 211, 153, 0.35)',
        },
        pending: {
          DEFAULT: '#FBBF24',
          light: 'rgba(251, 191, 36, 0.12)',
          border: 'rgba(251, 191, 36, 0.35)',
        },
        danger: {
          DEFAULT: '#FB7185',
          light: 'rgba(251, 113, 133, 0.12)',
          border: 'rgba(251, 113, 133, 0.35)',
        },
        // Aliases for compatibility
        kanchipuram: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: 'rgba(139, 92, 246, 0.12)',
          border: 'rgba(139, 92, 246, 0.35)',
        },
        tumbler: {
          DEFAULT: '#22D3EE',
          hover: '#06B6D4',
          light: 'rgba(34, 211, 238, 0.12)',
          border: 'rgba(34, 211, 238, 0.35)',
        },
        space: {
          950: '#07070C',
          900: '#0B0B12',
          850: '#10101A',
          800: '#14141F',
          700: '#26263A',
        },
        brand: {
          violet: '#8B5CF6',
          fuchsia: '#EC4899',
          amber: '#FBBF24',
          orange: '#F97316',
          cyan: '#22D3EE',
        }
      },
      fontFamily: {
        display: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'none': 'none',
        'ai-glow': '0 0 40px rgba(139, 92, 246, 0.35)',
        'cyan-glow': '0 0 35px rgba(34, 211, 238, 0.35)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px #26263A',
        'card-hover': '0 10px 30px -5px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.4)',
      },
      animation: {
        'waveform': 'waveform 1.2s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        waveform: {
          '0%': { height: '8px' },
          '100%': { height: '32px' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(34, 211, 238, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
