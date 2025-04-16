/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#e82127',
        'secondary': '#171a20',
        'text': '#393c41',
        'light-gray': '#f4f4f4',
      },
      fontFamily: {
        'gotham': ['Gotham SSm', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 