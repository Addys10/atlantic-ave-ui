import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/types/**/*.{js,ts}",
    "./src/lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      screens: {
        tb: '896px',
      },
      colors: {
        canvas: "#0a0a0a",
        bone: "#f4f1ea",
        line: "#1f1f1f",
        dim: "#8a8a85",
        mute: "#6b6b66",
        accent: "#cf3a17",
      },
      fontFamily: {
        cloister: ["var(--font-cloister)"],
        anton: ["var(--font-anton)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
