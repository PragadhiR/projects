/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#3391fb',
          600: '#1d72f1',
          700: '#175bde',
          800: '#194bb3',
          900: '#1a428d',
          950: '#152a57',
        },
        ink: {
          50: '#f6f8fb',
          100: '#eef2f7',
          200: '#dde5ee',
          300: '#c2cfe0',
          400: '#8d9fb8',
          500: '#5f7290',
          600: '#475a78',
          700: '#364763',
          800: '#1f2a40',
          900: '#10182b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,64,120,0.05), 0 10px 30px -12px rgba(15,64,120,0.16)',
        'card-lg': '0 2px 6px rgba(15,64,120,0.07), 0 28px 60px -22px rgba(15,64,120,0.24)',
        glow: '0 0 0 1px rgba(51,145,251,0.25), 0 18px 50px -18px rgba(29,114,241,0.55)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.7)', opacity: '0.65' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'spin-slow': { '100%': { transform: 'rotate(360deg)' } },
        wave: {
          '0%,100%': { transform: 'scaleY(0.28)' },
          '50%': { transform: 'scaleY(1)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'draw-line': {
          '0%': { 'stroke-dashoffset': '1000' },
          '100%': { 'stroke-dashoffset': '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'fade-in-scale': 'fade-in-scale 0.5s ease-out both',
        'slide-up': 'slide-up 0.6s ease-out both',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        wave: 'wave 1.1s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'draw-line': 'draw-line 1.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};
