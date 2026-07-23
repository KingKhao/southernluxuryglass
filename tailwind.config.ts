import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "#FAF6EE",
        ivory: "#F3ECDD",
        charcoal: "#2A2621",
        emerald: {
          DEFAULT: "#2F4A3D",
          light: "#3F5F4E",
          dark: "#1F332A",
        },
        gold: {
          DEFAULT: "#B08D57",
          light: "#C7A876",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
