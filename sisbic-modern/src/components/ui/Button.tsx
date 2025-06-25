import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Classes específicas para cada variante usando Tailwind diretamente
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-ufba-gold to-ufba-gold-bright text-white hover:brightness-110 focus:ring-ufba-gold-light';
      case 'secondary':
        return 'bg-gradient-to-r from-ufba-blue to-ufba-blue-bright text-white hover:brightness-110 focus:ring-ufba-blue';
      case 'ghost':
        return 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 shadow-none';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300';
      case 'warning':
        return 'bg-gradient-to-r from-ufba-gold to-ufba-gold-light text-white hover:brightness-110 focus:ring-ufba-gold-light shadow-lg hover:shadow-xl hover:-translate-y-0.5';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300';
      default:
        return 'bg-gradient-to-r from-ufba-gold to-ufba-gold-bright text-white hover:brightness-110 focus:ring-ufba-gold-light';
    }
  };

  const classes = [
    baseClasses,
    sizeClasses[size],
    getVariantClasses(),
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2" />}
    </button>
  );
};

export default Button; 