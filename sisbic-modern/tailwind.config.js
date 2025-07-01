/**
 * ATENÇÃO: Todas as cores, fontes e pesos devem ser aplicados via variáveis do tema.
 * Nunca use valores hardcoded nos componentes. Crie novas variáveis aqui se necessário.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cores de superfície
        'surface-0': 'var(--surface-0)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        'surface-dark-0': 'var(--surface-dark-0)',
        'surface-dark-1': 'var(--surface-dark-1)',
        'surface-dark-2': 'var(--surface-dark-2)',
        'surface-dark-3': 'var(--surface-dark-3)',
        
        // Cores de conteúdo
        'content-main': 'var(--content-main)',
        'content-secondary': 'var(--content-secondary)',
        'content-main-dark': 'var(--content-main-dark)',
        'content-secondary-dark': 'var(--content-secondary-dark)',
        
        // Cores de borda
        'border-color': 'var(--border-color)',
        'border-dark': 'var(--border-dark)',
        
        // Cores da marca
        'brand-primary': 'var(--brand-primary)',
        'brand-primary-dark': 'var(--brand-primary-dark)',
        'brand-accent': 'var(--brand-accent)',
        'brand-accent-dark': 'var(--brand-accent-dark)',
        'brand-success': 'var(--brand-success)',
        'brand-success-dark': 'var(--brand-success-dark)',
        'brand-danger': 'var(--brand-danger)',
        'brand-danger-dark': 'var(--brand-danger-dark)',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'subtle': '0 4px 16px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};