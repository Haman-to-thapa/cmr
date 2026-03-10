/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // A nice brand blue
        secondary: '#10b981', // Emerald green for success actions
      }
    },
  },
  plugins: [],
}

