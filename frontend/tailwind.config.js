/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: "#0070f3", // Accent blue
        background: "#f9f9f9", // Light background
        text: "#333333", // Dark text
        accent: "#ff4757", // Vivid accent color (red)
        secondary: "#1e90ff", // Secondary vivid blue
      },
      fontSize: {
        xs: ".75rem",
        sm: ".875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
    },
  },
  plugins: [],
};
