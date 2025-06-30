/**
 * ATENÇÃO: Todas as cores, fontes e pesos devem ser aplicados via variáveis do tema.
 * Nunca use valores hardcoded nos componentes. Crie novas variáveis aqui se necessário.
 */
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
      // =================================================================
      // A ALMA DO NOSSO DESIGN - PALETA "LAGOA E ARGILA"
      // Estrutura simplificada e final
      // =================================================================
      colors: {
        'surface-0': '#F8F7F5', // Areia Branca (Light)
        'surface-dark-0': '#1C1A19', // Fundo Escuro (Dark)

        'surface-1': '#FFFFFF', // Argila Clara (Light)
        'surface-dark-1': '#292524', // Painel Escuro (Dark)

        'border-color': '#E7E5E4', // Pedra Média (Light)
        'border-dark': '#44403C', // Borda Escura (Dark)

        'content-main': '#3D3A39', // Marrom Profundo (Light)
        'content-main-dark': '#F5F5F4', // Texto Principal (Dark)

        'content-secondary': '#78716C', // Argila Média (Light)
        'content-secondary-dark': '#A8A29E', // Texto Secundário (Dark)

        'brand-primary': '#0284C7', // Azul Cerúleo (Light)
        'brand-primary-dark': '#38BDF8', // Luar Azul (Dark)
        'brand-primary-hover': '#0369A1', // Hover Primário (Light)
        'brand-primary-dark-hover': '#0284C7', // Hover Primário (Dark)

        'brand-accent': '#D97706', // Terracota (Light)
        'brand-accent-dark': '#FBBF24', // Brasa (Dark)

        'brand-success': '#16A34A', // Verde Esmeralda (Light)
        'brand-success-dark': '#86EFAC', // Verde Sálvia (Dark)

        'brand-danger': '#DC2626', // Vermelho Sóbrio (Light)
        'brand-danger-dark': '#FCA5A5', // Vermelho Sóbrio (Dark)
      },
       boxShadow: {
        'subtle': '0 4px 16px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};