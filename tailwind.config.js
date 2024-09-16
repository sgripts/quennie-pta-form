/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';

module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [
      daisyui,
  ],
  daisyui: {
      themes: ['pastel']
  }
}

