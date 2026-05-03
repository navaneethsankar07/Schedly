/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — map to CSS variables set per-theme
        "c-bg":       "var(--c-bg)",
        "c-card":     "var(--c-card)",
        "c-border":   "var(--c-border)",
        "c-text":     "var(--c-text)",
        "c-muted":    "var(--c-muted)",
        "c-accent":   "var(--c-accent)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "synthwave", "dracula", "luxury"],
  },
}
