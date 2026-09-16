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
          // Darkened for use as text on cream/ivory/white — the DEFAULT gold
          // reads beautifully as an accent (borders, pill backgrounds) but
          // only hits ~2.9:1 as text, below WCAG AA's 4.5:1. This clears
          // 4.5:1 while staying visibly gold.
          deep: "#8A6A38",
        },
        // Solid replacement for charcoal/40–70 opacity text, which drops
        // below WCAG AA contrast on cream/ivory/white backgrounds at those
        // opacities. Use this instead of charcoal/NN for any secondary body
        // text; ~7.4:1 on cream, well clear of the 4.5:1 minimum.
        "charcoal-muted": "#54504A",
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
