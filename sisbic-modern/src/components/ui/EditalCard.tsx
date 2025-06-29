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
    <div
      className={cn(
        'group bg-white dark:bg-gray-800 rounded-lg shadow-card border border-gray-200 dark:border-gray-700 p-6',
        'transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg',
        'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-2">
            {edital.PEP_Descricao}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {edital.PRO_Descricao}
            </span>
          </div>
        </div>
        
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4 text-gray-500" />
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
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
              <div className="p-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onView}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150`}
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
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150`}
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
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors duration-150`}
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
            <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-3 h-3 text-gray-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Início</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(edital.PEP_DtInicio)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="w-3 h-3 text-gray-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Término</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(edital.PEP_DtFim)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditalCard; 