import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-instrument)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "var(--font-fraunces)",
          "Playfair Display",
          "Georgia",
          "serif",
        ],
      },
      colors: {
        /* Core */
        stage: {
          bg: "#020204",
          ink: "#0a111d",
          surface: "#0b1420",
        },
        /* Cyan brand */
        cyanx: {
          bright: "#9ad9ec",
          core: "#3ec8e4",
          deep: "#0b859d",
          navy: "#012c3d",
        },
        /* Legacy green (checkout, admin) */
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
        },
        /* Ink */
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          500: "#64748b",
          700: "#2a3a48",
          800: "#1a2a38",
          900: "#0b1a26",
        },
      },
      fontSize: {
        /* Display scale */
        "d-1": ["clamp(56px, 6.5vw, 96px)", { lineHeight: "0.94", letterSpacing: "-0.038em" }],
        "d-2": ["clamp(44px, 5vw, 72px)", { lineHeight: "0.96", letterSpacing: "-0.035em" }],
        "d-3": ["clamp(32px, 3.6vw, 52px)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "d-4": ["clamp(24px, 2.6vw, 36px)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
      },
      spacing: {
        section: "120px",
        "section-sm": "80px",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        soft: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        retake: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "fade-up": "fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 500ms ease-out both",
        "marquee": "marquee 45s linear infinite",
        "pulse-soft": "pulse-soft 2200ms ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.15)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      backgroundImage: {
        "stage-gradient":
          "radial-gradient(60% 90% at 50% 100%, rgba(62,200,228,0.14), transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, #f4f6f8 0%, #e5e9ee 100%)",
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(62,200,228,0.35)",
        glow: "0 0 24px rgba(62,200,228,0.5)",
        "glow-lg": "0 0 40px rgba(62,200,228,0.6)",
        lift: "0 24px 60px rgba(4,24,43,0.28)",
        "lift-lg": "0 32px 80px rgba(4,24,43,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;