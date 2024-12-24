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
          500: '#1D4ED8', // Blue color, replace with your desired shade
        },
      },
    },
  },
  plugins: [],
}
