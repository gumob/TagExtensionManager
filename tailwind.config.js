/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
  darkMode: 'media',
  theme: {
    extend: {
      screens: {
        xs: '32rem',
        sm: '38rem',
        md: '48rem',
        lg: '64rem',
        xl: '80rem',
        '2xl': '96rem',
      },
      fontSize: {
        xs: '0.5rem', // 8px
        sm: '0.625rem', // 10px
        base: '0.75rem', // 12px
        lg: '0.875rem', // 14px
        xl: '1rem', // 16px
        '2xl': '1.125rem', // 18px
        '3xl': '1.5rem', // 24px
        '4xl': '2rem', // 32px
        '5xl': '2.5rem', // 40px
        '6xl': '3rem', // 48px
        '7xl': '3.5rem', // 56px
        '8xl': '4rem', // 64px
        '9xl': '4.5rem', // 72px
      },
    },
  },
  plugins: [],
};
