import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStatusConfig = (status: string) => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('andamento') || lowerStatus.includes('ativo')) {
      return {
        base: 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
      };
    }
    
    if (lowerStatus.includes('concluído') || lowerStatus.includes('concluido') || lowerStatus.includes('finalizado')) {
      return {
        base: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
      };
    }
    
    if (lowerStatus.includes('inscrições') || lowerStatus.includes('inscricoes') || lowerStatus.includes('aberto')) {
      return {
        base: 'bg-primary-100 text-primary-800 dark:bg-primary-500/10 dark:text-primary-400'
      };
    }
    
    if (lowerStatus.includes('indisponível') || lowerStatus.includes('indisponivel') || lowerStatus.includes('cancelado')) {
      return {
        base: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
      };
    }
    
    // Default
    return {
      base: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
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