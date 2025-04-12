/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        facebook: "#2176FF",
        whatsapp: "#46EE65",
        primary: "#007FFF",
        backgroundColor: "#FDF8DE",
      },
    },
  },
  plugins: [],
};
