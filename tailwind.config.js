/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        "stv-bg": "#0A0A0B",
        "stv-surface": "#15151A",
        "stv-surface-2": "#1d1d24",
        "stv-text": "#F5F1EA",
        "stv-accent": "#FF5C2B",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
