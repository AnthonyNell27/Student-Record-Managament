/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // ✅ Enable dark mode via .dark class
  theme: {
    extend: {
      borderRadius: {
        '3xl': '1.5rem', // ✅ custom large radius
      },
      colors: {
        // ✅ Extend with consistent dark palette if needed
        dark: {
          bg: '#1e293b',       // sidebar/bg
          card: '#334155',     // modals/panels
          text: '#f1f5f9',      // light text
          border: '#475569',
        },
      },
    },
  },
  plugins: [],
};
