import React from 'react';
import { MoreVertical, Calendar, FileText } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '../../lib/utils';
import StatusBadge from './StatusBadge';

interface EditalCardProps {
  edital: {
    PEP_Codigo: number;
    PEP_Descricao: string;
    PRO_Descricao: string;
    PPS_Descricao?: string;
    PEP_DtInicio: string;
    PEP_DtFim: string;
  };
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const EditalCard: React.FC<EditalCardProps> = ({
  edital,
  onView,
  onEdit,
  onDelete,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <button
      onClick={onView}
      className={cn(
        'group bg-transparent dark:bg-transparent rounded-lg border border-border-color dark:border-border-dark p-6',
        'hover:border-brand-primary/50 dark:hover:border-brand-primary/50 hover:shadow-subtle transition-all duration-200 w-full text-left flex flex-col',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-content-main dark:text-content-main-dark truncate mb-2">
            {edital.PEP_Descricao}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-brand-accent/10 dark:bg-brand-accent-dark/10 rounded-lg">
              <FileText className="w-4 h-4 text-brand-accent dark:text-brand-accent-dark" />
            </div>
            <span className="text-sm font-medium text-content-main dark:text-content-main-dark">
              {edital.PRO_Descricao}
            </span>
          </div>
        </div>
        
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 rounded-lg hover:bg-surface-2/50 dark:hover:bg-surface-dark-2/50 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4 text-content-secondary dark:text-content-secondary-dark" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-surface-1 dark:bg-surface-dark-1 shadow-lg rounded-xl overflow-hidden z-50 border border-border-color dark:border-border-dark">
              <div className="p-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onView}
                      className={`${
                        active ? 'bg-surface-2/50 dark:bg-surface-dark-2/50' : ''
                      } group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-content-main dark:text-content-main-dark transition-colors duration-150`}
                    >
                      Visualizar
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onEdit}
                      className={`${
                        active ? 'bg-surface-2/50 dark:bg-surface-dark-2/50' : ''
                      } group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-content-main dark:text-content-main-dark transition-colors duration-150`}
                    >
                      Editar
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onDelete}
                      className={`${
                        active ? 'bg-surface-2/50 dark:bg-surface-dark-2/50' : ''
                      } group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-brand-danger dark:text-brand-danger-dark transition-colors duration-150`}
                    >
                      Excluir
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <StatusBadge status={edital.PPS_Descricao || 'Não definido'} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-surface-2/50 dark:bg-surface-dark-2/50 rounded-lg">
              <Calendar className="w-3 h-3 text-content-secondary dark:text-content-secondary-dark" />
            </div>
            <div>
              <p className="text-xs font-medium text-content-secondary dark:text-content-secondary-dark">Início</p>
              <p className="text-sm font-medium text-content-main dark:text-content-main-dark">
                {formatDate(edital.PEP_DtInicio)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-surface-2/50 dark:bg-surface-dark-2/50 rounded-lg">
              <Calendar className="w-3 h-3 text-content-secondary dark:text-content-secondary-dark" />
            </div>
            <div>
              <p className="text-xs font-medium text-content-secondary dark:text-content-secondary-dark">Término</p>
              <p className="text-sm font-medium text-content-main dark:text-content-main-dark">
                {formatDate(edital.PEP_DtFim)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default EditalCard; 