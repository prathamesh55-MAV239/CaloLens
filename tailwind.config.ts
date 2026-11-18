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
        // Authoritative Envato Reference Design Tokens
        brand: {
          orange: "#FF990F",        // Main warm orange
          orangeBright: "#FFA82F",  // Bright orange highlight
          orangeSecondary: "#F9A83B", // Secondary warm amber
          orangeLight: "#FFE1AC",   // Light orange border & tint
          ivory: "#FFF3DF",         // Warm ivory surface
          cream: "#FFF8EC",         // Primary cream background
          burntRed: "#8D240D",      // Deep burnt red for titles & headings
          primaryRed: "#B30D08",    // Primary strong red for CTAs
          darkRed: "#A20E08",       // Darker red for active/hover states
          yellow: "#FFC84B",        // Golden yellow accent
          neutralSoft: "#F4F3F0",   // Soft neutral background
          textPrimary: "#65230F",   // Primary dark warm-brown body text
          textMuted: "#8E513F",     // Muted secondary text
          borderWarm: "#FFE1AC",    // Warm border accent
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', "Oswald", "Impact", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        warm: "0 10px 30px -5px rgba(141, 36, 13, 0.07)",
        "warm-lg": "0 20px 40px -10px rgba(141, 36, 13, 0.12)",
        "warm-sm": "0 4px 16px -2px rgba(141, 36, 13, 0.05)",
        orange: "0 10px 25px -5px rgba(255, 153, 15, 0.35)",
        red: "0 10px 25px -5px rgba(179, 13, 8, 0.35)",
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
