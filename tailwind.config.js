/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b0d13",
          800: "#121622",
          700: "#1a2032",
          600: "#222a41",
        },
        flare: {
          500: "#ff6a2a",
          400: "#ff8a4d",
        },
        signal: {
          500: "#23d3c2",
          400: "#4ee7da",
        },
        haze: {
          200: "#cdd6f9",
          100: "#e3e8ff",
        },
      },
      boxShadow: {
        glow: "0 20px 60px -35px rgba(35, 211, 194, 0.65)",
        ember: "0 20px 60px -35px rgba(255, 106, 42, 0.6)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(35, 211, 194, 0.25), transparent 55%), radial-gradient(circle at 30% 15%, rgba(255, 106, 42, 0.25), transparent 45%)",
        "grid-faint":
          "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular"],
      },
    },
  },
  plugins: [],
};
