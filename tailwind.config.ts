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
        ink: {
          50: "#f7f5f2",
          100: "#ede9e3",
          200: "#ddd6cb",
          300: "#c8bda8",
          400: "#b3a184",
          500: "#9e8765",
          600: "#8a7152",
          700: "#735c43",
          800: "#5e4b37",
          900: "#4a3b2c",
          950: "#2a2018",
        },
        gold: {
          50: "#fdf9ef",
          100: "#faf0d4",
          200: "#f3dfa5",
          300: "#eac56e",
          400: "#e2a83f",
          500: "#d48c1e",
          600: "#b56d14",
          700: "#935314",
          800: "#784419",
          900: "#64381a",
          950: "#381c0a",
        },
        vermilion: {
          500: "#c23b27",
          600: "#a82f1e",
          700: "#8c2619",
        },
        jade: {
          500: "#2d8a6e",
          600: "#247058",
          700: "#1c5744",
        },
      },
      fontFamily: {
        song: ["var(--font-song)", "serif"],
        hei: ["var(--font-hei)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "dice-roll": "diceRoll 0.6s ease-out",
        "typewriter": "typewriter 0.05s steps(1)",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        diceRoll: {
          "0%": { transform: "rotateZ(0deg) scale(1)" },
          "25%": { transform: "rotateZ(90deg) scale(1.2)" },
          "50%": { transform: "rotateZ(180deg) scale(1.1)" },
          "75%": { transform: "rotateZ(270deg) scale(1.15)" },
          "100%": { transform: "rotateZ(360deg) scale(1)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212, 140, 30, 0.4)" },
          "50%": { boxShadow: "0 0 20px 5px rgba(212, 140, 30, 0.2)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
