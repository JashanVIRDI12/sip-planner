/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        surface: '#1f2937',
        panel: '#111827',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
      },
      animation: {
        'fade-in-fast': 'fadeIn 0.3s ease-out',
        shimmer: 'shimmer 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
