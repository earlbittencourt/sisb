import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'link' | 'ghost' | 'success' | 'warning' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2 rounded-md gap-2',
    lg: 'px-6 py-3 text-lg rounded-md gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover dark:bg-brand-primary-dark dark:text-surface-0 dark:hover:bg-brand-primary-dark-hover',
    secondary: 'bg-surface-1 text-content-main border border-border-color hover:bg-border-color/60 dark:bg-surface-dark-1 dark:text-content-main-dark dark:border-border-dark dark:hover:bg-border-dark/60',
    link: 'text-content-secondary hover:text-brand-primary dark:text-content-secondary-dark dark:hover:text-brand-primary-dark',
    ghost: 'text-content-secondary hover:bg-surface-1 active:bg-border-color dark:text-content-secondary-dark dark:hover:bg-surface-dark-1 dark:active:bg-border-dark',
    success: 'bg-brand-success text-white hover:bg-brand-success/90 dark:bg-brand-success-dark dark:text-surface-dark-0 dark:hover:bg-brand-success-dark/90',
    warning: 'bg-brand-accent text-white hover:bg-brand-accent/90 dark:bg-brand-accent-dark dark:text-surface-dark-0 dark:hover:bg-brand-accent-dark/90',
    danger: 'bg-brand-danger text-white hover:bg-brand-danger/90 dark:bg-brand-danger-dark dark:text-surface-dark-0 dark:hover:bg-brand-danger-dark/90',
    glass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-content-main hover:bg-white/20 dark:bg-surface-dark-1/30 dark:border-white/10 dark:text-content-main-dark dark:hover:bg-surface-dark-1/40 active:scale-95',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-5 h-5" />
      ) : null}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-5 h-5" />
      )}
    </button>
  );
};

export default Button; 