/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        phonixia: {
          dark: '#0f172a',
          gold: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}