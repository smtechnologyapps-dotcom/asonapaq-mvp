import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        omnex: {
          bg: "#050B14",
          surface: "#0A1420",
          border: "#12263A",
          accent: "#2DD4BF",
          accentDim: "#14B8A6",
          text: "#E6F1F5",
          muted: "#7A93A6",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        "headline-sm": ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(45, 212, 191, 0.3)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        omnex: "0.75rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
