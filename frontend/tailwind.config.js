/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e7ecf5',
          100: '#c3d0e6',
          200: '#9bb1d4',
          300: '#7392c2',
          400: '#557ab5',
          500: '#3762a8',
          600: '#2f549a',
          700: '#254388',
          800: '#1c3476',
          900: '#0a192f',
          950: '#060f1d',
        },
        cyber: {
          50: '#e0fbff',
          100: '#b3f5ff',
          200: '#80eeff',
          300: '#4de7ff',
          400: '#26e2ff',
          500: '#00d4ff',
          600: '#00bfe6',
          700: '#00a4cc',
          800: '#0089b3',
          900: '#006080',
        },
        neon: {
          green: '#00e676',
          blue: '#2979ff',
          purple: '#d500f9',
          pink: '#ff1744',
          yellow: '#ffab00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #0a192f 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'neon-glow': 'linear-gradient(90deg, #00d4ff, #2979ff, #d500f9)',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 212, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.1)',
        'neon-lg': '0 0 20px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'glow-border': 'glow-border 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'glow-border': {
          '0%, 100%': { borderColor: 'rgba(0, 212, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 212, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
