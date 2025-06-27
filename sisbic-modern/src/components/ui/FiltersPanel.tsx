import React from 'react';
import { X, FileText, TrendingUp, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CustomCheckbox } from './CustomCheckbox';
import { FilterPill } from './FilterPill';

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  programas: Array<{ PRO_Codigo: number; PRO_Sigla: string }>;
  statusList: Array<{ PPS_Codigo: number; PPS_Descricao: string }>;
  filtros: {
    tipos: string[];
    status: string[];
  };
  onFiltroChange: (campo: 'tipos' | 'status', valor: string, checked: boolean) => void;
  activeFilters: string[];
  onRemoveFiltro: (filtro: string) => void;
  onClearFilters: () => void;
  className?: string;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  onClose,
  programas,
  statusList,
  filtros,
  onFiltroChange,
  activeFilters,
  onRemoveFiltro,
  onClearFilters,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className={cn('fixed inset-0 z-50 overflow-y-auto', className)}>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Filtros Avançados
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Filtros Ativos */}
            {activeFilters.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros Ativos</h3>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, idx) => (
                    <FilterPill
                      key={filter + idx}
                      label={filter}
                      onRemove={() => onRemoveFiltro(filter)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tipo de Programa */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tipo de Programa
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {programas.map(programa => (
                    <CustomCheckbox
                      key={programa.PRO_Codigo}
                      label={programa.PRO_Sigla}
                      checked={filtros.tipos.includes(programa.PRO_Codigo.toString())}
                      onChange={(e) => onFiltroChange('tipos', programa.PRO_Codigo.toString(), e.target.checked)}
                      className="w-full"
                    />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Status
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {statusList.map(status => (
                    <CustomCheckbox
                      key={status.PPS_Codigo}
                      label={status.PPS_Descricao}
                      checked={filtros.status.includes(status.PPS_Codigo.toString())}
                      onChange={(e) => onFiltroChange('status', status.PPS_Codigo.toString(), e.target.checked)}
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors border border-blue-100 dark:border-blue-900 rounded-lg"
            >
              Limpar filtros
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel; 