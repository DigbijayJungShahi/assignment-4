/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.html', './public/**/*.css'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],  daisyui: {
    themes: ['cupcake'],
  },
}

