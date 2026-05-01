import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Desactivamos el modo oscuro automático del sistema
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4A6D32",
        secondary: "#FDFCF7",
        accent: "#F37021",
      },
    },
  },
  plugins: [],
};
export default config;
