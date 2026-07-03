import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#16233A", soft: "#2B3B57" },
        paper: { DEFAULT: "#F4F1EA", dark: "#0F1622" },
        card: { dark: "#161F30" },
        teal: { DEFAULT: "#1F7A6C", soft: "#E4F0EC" },
        clay: { DEFAULT: "#B4552F", soft: "#F6E4DA" },
        line: { DEFAULT: "#DED8C8", dark: "#2A3549" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
