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
        bg: 'bg-status-warning-faint dark:bg-status-warning/20',
        text: 'text-status-warning-text dark:text-status-warning-light',
        border: 'border-status-warning/30 dark:border-status-warning/40'
      };
    }
    
    if (lowerStatus.includes('concluído') || lowerStatus.includes('concluido') || lowerStatus.includes('finalizado')) {
      return {
        bg: 'bg-status-success-faint dark:bg-status-success/10',
        text: 'text-status-success-text dark:text-status-success-light',
        border: 'border-status-success/30 dark:border-status-success/20'
      };
    }
    
    if (lowerStatus.includes('inscrições') || lowerStatus.includes('inscricoes') || lowerStatus.includes('aberto')) {
      return {
        bg: 'bg-status-info-faint dark:bg-status-info/10',
        text: 'text-status-info-text dark:text-status-info-light',
        border: 'border-status-info/30 dark:border-status-info/20'
      };
    }
    
    if (lowerStatus.includes('indisponível') || lowerStatus.includes('indisponivel') || lowerStatus.includes('cancelado')) {
      return {
        bg: 'bg-gray-50 dark:bg-gray-500/10',
        text: 'text-gray-700 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-500/20'
      };
    }
    
    // Default
    return {
      bg: 'bg-gray-50 dark:bg-gray-500/10',
      text: 'text-gray-700 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-500/20'
    };
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 rounded-full',
    md: 'text-sm px-3 py-1.5 rounded-full',
    lg: 'text-sm px-4 py-2 rounded-lg'
  };

  return (
    <span className={`
      inline-flex items-center justify-center font-medium
      ${config.bg} ${config.text} ${config.border}
      border ${sizeClasses[size]}
      transition-colors duration-150
    `}>
      {status}
    </span>
  );
};

export default StatusBadge; 