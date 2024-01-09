/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1400px',
    },
    extend: {
      fontFamily: {
        standard: 'var(--font-family-standard)',
        firacode: 'var(--font-family-firacode)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
