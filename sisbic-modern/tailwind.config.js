const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 👇 A NOVA PALETA MONOCROMÁTICA COMPLETA
        primary: {
          lightest: '#f0f3f9', // Um fundo de card/página quase branco, com um toque de azul
          lighter: '#dbeafe',  // Um fundo de hover sutil para listas
          light: '#60a5fa',   // Um azul mais claro para texto de links secundários ou ícones
          DEFAULT: '#2a4377',  // A COR BASE OFICIAL DA UFBA
          dark: '#22365f',    // Um tom mais escuro para hovers e estados ativos sutis
          darker: '#172545',   // O tom mais escuro para fundos de alto contraste, como a sidebar
        },
        // Neutros para fundos, textos, bordas, etc.
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Status Colors - Mantendo clareza de UX
        success: {
          DEFAULT: '#5EEAD4',
          light: '#67e8de',
          dark: '#14b8a6',
          faint: '#ecfdf5',
          text: '#065f46',
        },
        warning: {
          DEFAULT: '#fbbf24',
          light: '#fcd34d',
          dark: '#f59e0b',
          faint: '#fffbeb',
          text: '#92400e',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
          faint: '#fef2f2',
          text: '#991b1b',
        },
        
        // Mantendo compatibilidade com tokens existentes
        brand: {
          DEFAULT: '#2a4377',
          light: '#60a5fa',
          dark: '#22365f',
          faint: '#f0f3f9',
          subtle: '#dbeafe',
        },
        status: {
          success: {
            DEFAULT: '#5EEAD4',
            light: '#67e8de',
            faint: '#ecfdf5',
            text: '#065f46',
          },
          warning: {
            DEFAULT: '#fbbf24',
            light: '#fcd34d',
            faint: '#fffbeb',
            text: '#92400e',
          },
          danger: {
            DEFAULT: '#ef4444',
            light: '#f87171',
            faint: '#fef2f2',
            text: '#991b1b',
          },
          info: {
            DEFAULT: '#2a4377',
            light: '#60a5fa',
            faint: '#f0f3f9',
            text: '#172545',
          },
        },
        
        // UFBA Colors - Modernized
        'ufba-blue': {
          light: '#60a5fa',
          DEFAULT: '#2a4377',
          dark: '#22365f',
        },
        'ufba-blue-light': 'var(--ufba-blue-light)',
        'ufba-blue-dark': 'var(--ufba-blue-dark)',
        'ufba-blue-bright': 'var(--ufba-blue-bright)',
        'ufba-gold': 'var(--ufba-gold)',
        'ufba-gold-light': 'var(--ufba-gold-light)',
        'ufba-gold-dark': 'var(--ufba-gold-dark)',
        'ufba-gold-bright': 'var(--ufba-gold-bright)',
        
        // Text Colors
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',

        // UFBA Gray Scale
        'ufba-gray': {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        
        // Status Colors
        'ufba-success': 'var(--ufba-success)',
        'ufba-warning': 'var(--ufba-warning)',
        'ufba-danger': 'var(--ufba-danger)',
        'ufba-info': 'var(--ufba-info)',
        border: "hsl(var(--border))",
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'liquid-fade-in': 'liquidFadeIn 0.6s ease-out',
        'liquid-slide-up': 'liquidSlideUp 0.6s ease-out',
        'liquid-scale-in': 'liquidScaleIn 0.4s ease-out',
        'liquid-float-in': 'liquidFloatIn 0.8s ease-out',
        'flip-3d': 'flip-3d 0.5s ease-in-out',
        'spin-physics': 'spin-physics-kf 0.8s ease-out',
        'draw-check': 'draw-check-kf 0.5s ease-out forwards',
        'draw-line-1': 'draw-check-kf 0.2s 0.1s ease-out forwards',
        'draw-line-2': 'draw-check-kf 0.2s 0.3s ease-out forwards',
        'draw-line-3': 'draw-check-kf 0.2s 0.5s ease-out forwards',
        'redraw': 'redraw-kf 0.8s ease-out forwards',
        'redraw-29-2': 'redraw-29-2-kf 0.8s ease-out forwards',
        'redraw-29-9': 'redraw-29-9-kf 0.8s ease-out forwards',
        'bars-bounce': 'bars-bounce-kf 1.2s cubic-bezier(0.68,-0.55,0.27,1.55) forwards',
        'slow-float': 'slow-float-kf 1s ease-in-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'orbit': 'orbit 2s linear',
        'orbit-tr': 'orbit-tr-kf 1.2s ease-in-out',
        'orbit-tl': 'orbit-tl-kf 1.2s ease-in-out',
        'orbit-br': 'orbit-br-kf 1.2s ease-in-out',
        'orbit-bl': 'orbit-bl-kf 1.2s ease-in-out',
        'sway': 'sway-kf 1s ease-in-out',
        'redraw-8': 'redraw-8-kf 0.8s ease-out',
        'redraw-2': 'redraw-2-kf 0.8s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        liquidFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        liquidSlideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        liquidScaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        liquidFloatIn: {
          '0%': { transform: 'translateY(40px) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'flip-3d': {
            '0%': { transform: 'rotateY(0deg)' },
            '100%': { transform: 'rotateY(360deg)' },
        },
        'spin-physics-kf': {
          '0%': { transform: 'rotate(0deg)' },
          '70%': { transform: 'rotate(400deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'draw-check-kf': {
          'to': { 'stroke-dashoffset': 0 },
        },
        'redraw-kf': {
          '0%':   { 'stroke-dashoffset': 0 },
          '20%':  { 'stroke-dashoffset': 9 },
          '100%': { 'stroke-dashoffset': 0 },
        },
        'redraw-29-2-kf': {
            '0%': { 'stroke-dashoffset': '0' },
            '25%': { 'stroke-dashoffset': '16' },
            '100%': { 'stroke-dashoffset': '0' },
        },
        'redraw-29-9-kf': {
            '0%': { 'stroke-dashoffset': '0' },
            '25%': { 'stroke-dashoffset': '13' },
            '100%': { 'stroke-dashoffset': '0' },
        },
        'bars-bounce-kf': {
          '0%':   { transform: 'scaleY(1)' },
          '10%':  { transform: 'scaleY(1.4)' },
          '20%':  { transform: 'scaleY(0.7)' },
          '30%':  { transform: 'scaleY(1.2)' },
          '40%':  { transform: 'scaleY(0.8)' },
          '50%':  { transform: 'scaleY(1.1)' },
          '60%':  { transform: 'scaleY(0.9)' },
          '70%':  { transform: 'scaleY(1.05)' },
          '80%':  { transform: 'scaleY(0.95)' },
          '90%':  { transform: 'scaleY(1.02)' },
          '100%': { transform: 'scaleY(1)' },
        },
        'slow-float-kf': {
          '0%': { transform: 'scaleY(1)' },
          '25%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.2)' },
          '75%': { transform: 'scaleY(0.8)' },
          '100%': { transform: 'scaleY(1)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "orbit": {
          "0%": {
            transform: "rotate(0deg) translateX(5px) rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg) translateX(5px) rotate(-360deg)",
          },
        },
        'orbit-tr-kf': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translateX(2px) translateY(-2px)' }
        },
        'orbit-tl-kf': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translateX(-2px) translateY(-2px)' }
        },
        'orbit-br-kf': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translateX(2px) translateY(2px)' }
        },
        'orbit-bl-kf': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translateX(-2px) translateY(2px)' }
        },
        'sway-kf': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' }
        },
        'redraw-8-kf': {
            '0%, 100%': { 'stroke-dashoffset': 0 },
            '50%': { 'stroke-dashoffset': 8 },
        },
        'redraw-2-kf': {
            '0%, 100%': { 'stroke-dashoffset': 0 },
            '50%': { 'stroke-dashoffset': 2 },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'liquid-rest': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.12)',
        'liquid-hover': '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.16)',
        'liquid-active': '0 4px 15px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.20)',
        'liquid-elevated': '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.20)',
        'depth-1': 'var(--depth-1)',
        'depth-2': 'var(--depth-2)',
        'depth-3': 'var(--depth-3)',
        'depth-4': 'var(--depth-4)',
        'glow-blue-500': '0 0 20px 5px rgba(59, 130, 246, 0.5)',
        'subtle': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'subtle-lg': '0 8px 25px rgba(0, 0, 0, 0.12)',
        'elite': '0 4px 16px rgba(0, 0, 0, 0.04), 0 8px 32px rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': 'var(--glass-blur)',
      },
      backgroundImage: {
        'sidebar-gradient': 'var(--bg-sidebar)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      borderRadius: {
        'lg': '0.75rem', // 12px
        'xl': '1rem',   // 16px
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("tailwindcss-animate"),
  ],
} 