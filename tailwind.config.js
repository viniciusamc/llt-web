/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#31263E',
        background: '#221E22',
        primary: '#C94B4B',
        secondary: '#252525',
      },
    },
  },
  plugins: [],
}
