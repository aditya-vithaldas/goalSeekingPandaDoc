import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Bold and modern
        brand: {
          50: "#f0f4ff",
          100: "#dfe8ff",
          200: "#b9d0ff",
          300: "#7aabff",
          400: "#3d7fff",
          500: "#1a56ff",
          600: "#0037ff",
          700: "#002ad6",
          800: "#0023b3",
          900: "#001d8f",
          950: "#000d47",
        },
        // Accent colors for energy and action
        accent: {
          orange: "#ff6b35",
          yellow: "#ffc233",
          green: "#00c48c",
          red: "#ff4757",
          purple: "#7c5dfa",
        },
        // Neutral tones
        slate: {
          850: "#1a1f2e",
          950: "#0d1117",
        },
        // Risk colors
        risk: {
          low: "#00c48c",
          medium: "#ffc233",
          high: "#ff6b35",
          critical: "#ff4757",
        },
        // Status colors
        status: {
          draft: "#94a3b8",
          pending: "#ffc233",
          review: "#7c5dfa",
          approved: "#00c48c",
          rejected: "#ff4757",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        "glow": "0 0 20px rgba(26, 86, 255, 0.3)",
        "glow-lg": "0 0 40px rgba(26, 86, 255, 0.4)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.12)",
        "bold": "0 10px 40px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "progress": "progress 1s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
