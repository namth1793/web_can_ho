/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B4F9C',
        'primary-dark': '#0d3470',
        'primary-light': '#2563EB',
        accent: '#E53935',
        gold: '#F5C000',
        navy: '#0D2B55',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
