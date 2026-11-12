import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F2F5FA',
          100: '#E3E9F3',
          200: '#C3CFE3',
          300: '#94A8CB',
          400: '#5F7BAA',
          500: '#3D5A8C',
          600: '#2B4675',
          700: '#1F3760',
          800: '#16294B',
          900: '#0E1C36',
          950: '#081124',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14,28,54,0.04), 0 8px 24px -12px rgba(14,28,54,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
