import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      brand: {
        primary: '#4285f4', // Google Blue
        secondary: '#db4437', // Google Red
        tertiary: '#f4b400', // Google Yellow
        quaternary: '#0f9d58', // Google Green
      },
      event: {
        blue: {
          light: '#d5edf8',
          medium: '#abcdde',
          dark: '#7d8be0',
        },
        green: {
          light: '#d5e2d3',
          medium: '#97e589',
          dark: '#28662b',
        },
        red: {
          light: '#ffd5cf',
          medium: '#ee8ea5',
          dark: '#98261e',
        },
        yellow: {
          light: '#fff6ed',
          medium: '#f4d44e',
          dark: '#c56a1d',
        },
        purple: {
          light: '#e6c6ff',
          medium: '#be8ce5',
          dark: '#5a2555',
        },
      },
      neutral: {
        white: '#ffffff',
        gray: {
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
        },
        black: '#000000',
      },
    },
    screens: {
      mobile: '320px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1280px',
    },
    extend: {},
  },
  plugins: [],
};

export default config;
