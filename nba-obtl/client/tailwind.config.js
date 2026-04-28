/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#e2e8f0",
        sky: "#dbeafe",
        brand: "#0f4c81",
        accent: "#d97706",
        slatewarm: "#f8fafc"
      },
      boxShadow: {
        panel: "0 24px 60px -32px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};
