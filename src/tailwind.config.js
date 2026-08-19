// tailwind.config.js
/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0E1A",
        panel: "#12182B",
        hairline: "#232B45",
        muted: "#7C8AA5",
        cyan: { DEFAULT: "#5EEAD4", dim: "#2DD4BF33" },
        amber: { DEFAULT: "#FBBF24", dim: "#FBBF2433" },
        magenta: { DEFAULT: "#F472B6", dim: "#F472B633" },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};