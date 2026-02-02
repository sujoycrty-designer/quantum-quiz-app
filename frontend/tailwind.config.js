/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          950: '#020617',
          400: '#22d3ee',
        }
      }
    },
  },
  plugins: [],
}
