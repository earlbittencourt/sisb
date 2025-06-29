import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

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
    <Link to={fullPath} className="group block">
      <div className={`
        relative bg-white dark:bg-gray-800 shadow-card rounded-lg p-6 h-full
        border transition-all duration-300 ease-in-out
        hover:shadow-lg hover:scale-[1.02]
        ${isHighlighted 
          ? 'border-primary dark:border-primary-light' 
          : 'border-gray-200 dark:border-gray-700'
        }
      `}>
        {/* Status Pill */}
        <div className="absolute top-4 right-4">
          {status === 'Concluído' ? (
            <div className="flex items-center gap-2 px-2.5 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle size={14} />
              Concluído
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
              <Clock size={14} />
              Pendente
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="mb-4">
          <div className="text-primary dark:text-primary-light">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-slate-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-slate-400">
            {description}
          </p>
        </div>

        {/* Action Link */}
        <div className="mt-4">
          <span className="inline-block text-primary font-semibold hover:text-primary-dark transition-colors duration-200 dark:text-primary-light dark:hover:text-white">
            Gerenciar →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ConfigurationStepCard; 