import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStatusConfig = (status: string) => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('andamento') || lowerStatus.includes('ativo') || lowerStatus.includes('pendente') || lowerStatus.includes('análise')) {
      return {
        base: 'bg-brand-accent/10 text-brand-accent dark:bg-brand-accent-dark/20 dark:text-brand-accent-dark'
      };
    }
    
    if (lowerStatus.includes('concluído') || lowerStatus.includes('concluido') || lowerStatus.includes('finalizado')) {
      return {
        base: 'bg-brand-success/10 text-brand-success dark:bg-brand-success-dark/20 dark:text-brand-success-dark'
      };
    }
    
    if (lowerStatus.includes('inscrições') || lowerStatus.includes('inscricoes') || lowerStatus.includes('aberto')) {
      return {
        base: 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary-dark/20 dark:text-brand-primary-dark'
      };
    }
    
    if (lowerStatus.includes('indisponível') || lowerStatus.includes('indisponivel') || lowerStatus.includes('cancelado')) {
      return {
        base: 'bg-brand-danger/10 text-brand-danger dark:bg-brand-danger-dark/20 dark:text-brand-danger-dark'
      };
    }
    
    // Default
    return {
      base: 'bg-surface-0 text-content-secondary dark:bg-surface-dark-0 dark:text-content-secondary-dark border border-border-color dark:border-border-dark'
    };
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span className={`
      inline-flex items-center justify-center font-medium rounded-full
      whitespace-nowrap min-w-[120px]
      ${config.base} ${sizeClasses[size]}
      transition-colors duration-150
    `}>
      {status}
    </span>
  );
};

export default StatusBadge; 