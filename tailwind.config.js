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
        primary: "#6952E0",
        secondary: "#DBFD7D",
        brandColorPrimary: "#67BC46",
        brandColorSecondary: "#404448",
        facebook: "#2176FF",
        whatsapp: "#46EE65",
      },
    },
  },
  plugins: [],
};
