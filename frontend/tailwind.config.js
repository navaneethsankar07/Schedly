/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "c-bg":       "rgb(var(--c-bg) / <alpha-value>)",
        "c-card":     "rgb(var(--c-card) / <alpha-value>)",
        "c-border":   "rgb(var(--c-border) / <alpha-value>)",
        "c-text":     "rgb(var(--c-text) / <alpha-value>)",
        "c-muted":    "rgb(var(--c-muted) / <alpha-value>)",
        "c-accent":   "rgb(var(--c-accent) / <alpha-value>)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
