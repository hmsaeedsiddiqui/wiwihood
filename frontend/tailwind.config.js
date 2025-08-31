/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from Figma design
        primary: {
          50: '#e8f7f0',
          100: '#c8ecda',
          200: '#a4e0c4',
          300: '#7dd3ad',
          400: '#5cc99c',
          500: '#2ECC71', // Main brand green
          600: '#29b866',
          700: '#22a05a',
          800: '#1c884e',
          900: '#136b3c',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Service category colors
        beauty: {
          50: '#fdf2f8',
          100: '#fce7f3',
          500: '#ec4899',
        },
        home: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
        },
        health: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
        },
        business: {
          50: '#f7fee7',
          100: '#ecfccb',
          500: '#65a30d',
        },
        automotive: {
          50: '#fefce8',
          100: '#fef3c7',
          500: '#f59e0b',
        },
        education: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          500: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
