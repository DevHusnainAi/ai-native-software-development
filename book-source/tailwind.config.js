/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./docs/**/*.{md,mdx}",
    "./docusaurus.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "polar-night": {
          deep: "#001f3f",
          charcoal: "#111111",
          gray: "#aaaaaa",
          light: "#dddddd",
          white: "#ffffff",
        },
      },
      boxShadow: {
        "inset-subtle": "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        orb: "0 0 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(0, 0, 0, 0.5), 0 0 120px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        ambientPulse: {
          "0%, 100%": {
            opacity: "0.6",
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "translate(-50%, -50%) scale(1.1)",
          },
        },
        subtlePulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.1)" },
          "50%": { boxShadow: "0 0 12px 2px rgba(255, 255, 255, 0.08)" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(8px)" },
        },
        flowProgress: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-left":
          "fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
        "fade-in-right":
          "fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both",
        "ambient-pulse": "ambientPulse 4s ease-in-out infinite",
        "subtle-pulse": "subtlePulse 3s ease-in-out infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 2s ease-in-out infinite",
        "flow-progress": "flowProgress 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
