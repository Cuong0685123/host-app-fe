/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../gallery-mfe/src/**/*.{js,ts,jsx,tsx}", // Quét class trực tiếp từ MFE
    "../../gallery-mfe/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}