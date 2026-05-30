import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#86868b',
          400: '#424245',
          500: '#1d1d1f',
        },
        primary: {
          light: '#FF8533',
          DEFAULT: '#FF6B00', // Brand Orange
          dark: '#E66100',
        },
        secondary: '#1d1d1f', // Using Apple Dark as secondary to contrast with Orange
      },
      borderRadius: {
        'apple-xl': '18px',
        'apple-2xl': '24px',
      },
      boxShadow: {
        'apple-soft': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'apple-medium': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'neu-out': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neu-in': 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff',
        'neu-out-sm': '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        'neu-in-sm': 'inset 2px 2px 4px #d1d1d1, inset -2px -2px 4px #ffffff',
      }
    },
  },
  plugins: [],
}
export default config
