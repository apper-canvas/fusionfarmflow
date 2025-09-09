/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#d9f1da',
          500: '#2D5016',
          600: '#1a3009',
          700: '#0f1e05'
        },
        secondary: {
          50: '#f0f7f2',
          100: '#d8ede0',
          500: '#4A7C59',
          600: '#3a6147',
          700: '#2a4535'
        },
        accent: {
          50: '#f5f9f5',
          100: '#e8f1e8',
          500: '#8FBC8F',
          600: '#7da97d',
          700: '#6a946a'
        },
        surface: '#F5F7FA',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}