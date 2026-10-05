/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FFFFFF',
        navy: '#04275c',
        terracotta: '#45beff',
        sage: '#45beff',
        ink: '#000000',
        parchment: '#FFFFFF',
        night: '#000000',
        nightSurface: '#04275c',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 14px 30px -20px rgba(4, 39, 92, 0.45)',
        lift: '0 22px 40px -24px rgba(4, 39, 92, 0.56)',
      },
      keyframes: {
        badgePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        bookFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(-62deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      animation: {
        'badge-pulse': 'badgePulse 1.8s ease-in-out infinite',
        'book-flip': 'bookFlip 1.15s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
