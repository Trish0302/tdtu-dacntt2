/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#ef6351",
          400: "#f4978e",
          300: "#f8ad9d",
          200: "#fbc4ab",
          100: "#ffe3e0",
        },
      },
    },
  },
  plugins: [],
};
