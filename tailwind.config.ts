import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10222B",
        mist: "#EEF6F3",
        sea: "#0E7490",
        peach: "#FFB86B",
        sand: "#FFF8ED"
      },
      boxShadow: {
        card: "0 18px 50px rgba(16, 34, 43, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

