/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        "stv-bg": "#09090f",
        "stv-surface": "#0f0f16",
        "stv-surface-2": "#14141c",
        "stv-accent": "#f97316",
        "stv-live": "#ff6b3d",
        "stv-amber": "#d8a86a",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
