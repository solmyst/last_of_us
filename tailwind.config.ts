import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        bg: {
          base: "rgb(var(--color-bg-base) / <alpha-value>)",
          surface: "rgb(var(--color-bg-surface) / <alpha-value>)",
          elevated: "rgb(var(--color-bg-elevated) / <alpha-value>)",
          overlay: "rgb(var(--color-bg-overlay) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-text-tertiary) / <alpha-value>)",
        },
        border: {
          subtle: "var(--border-subtle)",
          default: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        green: "rgb(var(--color-green) / <alpha-value>)",
        amber: "#d6a75f",
        red: "#ed8686",
        "pm-accent": "rgb(var(--color-jade) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
export default config;
