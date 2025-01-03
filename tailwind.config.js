/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        // Dark mode specific colors
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          primary: '#90CAF9',
          text: '#E5E7EB',
        },
      },
    },
  },
  plugins: [],
} 