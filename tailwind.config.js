/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "#FBF9F5",
          paper: "#FFFFFF",
          subtle: "#F5EFEB",
          card: "#FFFFFF",
          cardHover: "#FAF6F1",
          border: "#E6DDD4",
          borderHover: "#C8B9A9",
          espresso: "#28170D",
          walnut: "#3E271B",
          mocha: "#6E5648",
          sand: "#A08C7D",
          latte: "#DFD3C6",
          terracotta: "#C25E2E",
          amber: "#B45309",
          honey: "#D49A24",
          sage: "#3B694F",
          brick: "#B91C1C",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(62, 39, 27, 0.05), 0 1px 2px rgba(62, 39, 27, 0.03)',
        'warm-md': '0 4px 14px -2px rgba(62, 39, 27, 0.08), 0 2px 6px -1px rgba(62, 39, 27, 0.04)',
        'warm-lg': '0 12px 28px -6px rgba(62, 39, 27, 0.12), 0 4px 10px -2px rgba(62, 39, 27, 0.06)',
        'warm-lift': '0 18px 36px -8px rgba(62, 39, 27, 0.16)',
      },
      transitionTimingFunction: {
        'warm-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    },
  },
  plugins: [],
}
