import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfigurationStepCardProps {
  title: string;
  description: string;
  status: 'Concluído' | 'Pendente';
  path: string;
  icon: React.ReactNode;
  isHighlighted?: boolean;
}

const ConfigurationStepCard: React.FC<ConfigurationStepCardProps> = ({
  title,
  description,
  status,
  path,
  icon,
  isHighlighted = false
}) => {
  const { id } = useParams<{ id: string }>();
  const fullPath = `/editais/${id}/configurar/${path}`;

  return (
    <Link to={fullPath} className="block group h-full">
      <div
        className={cn(
          'relative bg-surface-1 dark:bg-surface-dark-1 border border-border-color dark:border-border-dark rounded-lg p-6 h-full',
          'transition-all duration-300 ease-in-out',
          'hover:scale-[1.03] hover:shadow-subtle hover:border-brand-primary/50 dark:hover:border-brand-primary-dark/50'
        )}
      >
        {/* Status Pill */}
        <div className="absolute top-4 right-4">
          {status === 'Concluído' ? (
            <div className="flex items-center gap-2 px-2.5 py-1 text-sm font-medium rounded-full bg-brand-success/10 text-brand-success dark:bg-brand-success-dark/20 dark:text-brand-success-dark">
              <CheckCircle size={14} />
              Concluído
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 text-sm font-medium rounded-full bg-brand-accent/10 text-brand-accent dark:bg-brand-accent-dark/20 dark:text-brand-accent-dark">
              <Clock size={14} />
              Pendente
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="mb-4">
          <div className="text-brand-primary dark:text-brand-primary-dark">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-content-main dark:text-content-main-dark mb-2">
            {title}
          </h3>
          <p className="text-sm text-content-secondary dark:text-content-secondary-dark">
            {description}
          </p>
        </div>

        {/* Action Link */}
        <div className="mt-4">
          <span className="inline-block text-brand-primary font-semibold hover:text-brand-primary-hover transition-colors duration-200 dark:text-brand-primary-dark dark:hover:text-brand-primary-dark-hover">
            Gerenciar →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ConfigurationStepCard; 