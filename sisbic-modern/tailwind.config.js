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
        transparent: 'transparent',
        current: 'currentColor',
        white: '#ffffff',
        black: '#000000',
        // Novo Roxo/Índigo como Cor Primária de Acento
        primary: {
          50: '#eef2ff',  // Cor de fundo da sidebar
          100: '#e0e7ff', // Fundo de item ativo na sidebar
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // A cor de destaque principal
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Paleta Neutra para tudo mais
        slate: colors.slate,
        // Cores Semânticas
        green: colors.green,
        amber: colors.amber,
        red: colors.red,
      },
      boxShadow: {
        // Sombra sutil para os cards, quase imperceptível
        'subtle': '0 4px 16px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.05)',
        'modal': '0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
} 