
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
        background: '#30253D',
        primary: '#877D92',
        secondary: '#9D82BD',
        terciary: '#AB9DBD',
        complementary: '#CCA2FF'
      },
    },
  },
  plugins: [],
}

