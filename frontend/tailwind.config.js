/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        winky: ['WinkySans', 'sans-serif'], // 定义简写名
      },
    },
  },
  plugins: [],
};
