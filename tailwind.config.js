/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        'youtube-dark': '#0f0f0f',
        'youtube-gray': '#272727',
        'youtube-border': '#3f3f3f',
        'youtube-text': '#f1f1f1',
      },
    },
  },
  plugins: [],
}

