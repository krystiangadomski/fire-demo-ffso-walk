/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0a0a0a',
        bone: '#f5f1ea',
      },
      backdropBlur: {
        glass: '18px',
      },
    },
  },
  plugins: [],
};
