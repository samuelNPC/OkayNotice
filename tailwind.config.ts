import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fintech Branding: Deep Navy and a Sharp Electric Blue
        brand: {
          dark: "#0F172A", // Deep Slate for text/buttons
          blue: "#2563EB", // Trusted Blue for links/actions
          accent: "#F8FAFC", // Clean off-white background
        },
      },
      // Fine-tuning the blog typography
      typography: {
        DEFAULT: {
          css: {
            h2: {
              fontWeight: '900',
              letterSpacing: '-0.025em',
            },
            strong: {
              color: '#0F172A',
              fontWeight: '800',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // THE FIX: This enables blog formatting
  ],
};
export default config;
