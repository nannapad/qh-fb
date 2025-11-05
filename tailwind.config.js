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
        primary: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#9333ea', // deep violet
          600: '#7c3aed',
          700: '#6b21a8',
          800: '#581c87',
          900: '#4c1d95',
        },
      },
    },
  },
  plugins: [],
}