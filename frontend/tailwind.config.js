/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#FBF9FE',
          100: '#F4EEFF',
          200: '#E9DEFF',
          300: '#D5C2FE',
          400: '#B697FB',
          500: '#9767F7',
          600: '#803FEA',
          700: '#6C2BD1',
          800: '#5821AC',
          900: '#461D86',
        },
        brand: {
          bg: '#F9F8FD',
          card: '#FFFFFF',
          sidebar: '#FBF9FE',
          chatbg: '#FBF9FE',
          primary: '#7C3AED',
          primaryHover: '#6D28D9',
          accent: '#A855F7',
          lightPurple: '#F3EEFF',
          border: '#EDE5FC',
          textDark: '#1E1B4B',
          textMuted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(124, 58, 237, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 25px -3px rgba(124, 58, 237, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
