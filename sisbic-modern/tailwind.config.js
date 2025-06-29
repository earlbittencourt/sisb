/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Azul de Ação, Vibrante
        primary: {
          light: '#60a5fa',   // Usado para highlights e foco
          DEFAULT: '#3b82f6', // Ação principal (botões, links ativos)
          dark: '#2563eb',    // Hover de botões
        },
        // Azul Institucional, Sóbrio
        institutional: {
          DEFAULT: '#2a4377', // Usado para o fundo da sidebar
        },
        // Paleta Neutra "Light & Airy"
        gray: {
          50:  '#f9fafb', // Fundo principal do Light Mode ("Canvas")
          100: '#f3f4f6',
          200: '#e5e7eb', // Bordas sutis (Light)
          300: '#d1d5db',
          400: '#9ca3b0', // Texto secundário (Dark)
          500: '#6b7280', // Texto secundário (Light)
          600: '#4b5563',
          700: '#374151', // Bordas (Dark) / Texto principal
          800: '#1f2937', // Fundo dos cards (Dark)
          900: '#111827', // Fundo principal (Dark)
        },
        // Cores Semânticas (mantidas para status)
        success: colors.green,
        amber: colors.amber,
        red: colors.red,
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'modal': '0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
} 