import React from 'react';
import { FiX } from 'react-icons/fi';
// Importe a interface Filter conforme o seu projeto
// interface Filter { id: string; label: string; condition: string; value: string; }

export interface Filter {
  id: string;
  label: string;
  condition: string;
  value: string;
}

interface FilterPillProps {
  filter: Filter;
  onRemove: (id: string) => void;
}

export function FilterPill({ filter, onRemove }: FilterPillProps) {
  return (
    <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary/10 text-primary-dark dark:text-primary-light text-sm font-medium pl-3 pr-1.5 py-1 rounded-full">
      <span>{filter.label}</span>
      <span className="text-slate-500">{filter.condition}</span>
      <span className="font-semibold">{filter.value}</span>
      <button 
        onClick={() => onRemove(filter.id)} 
        className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
        aria-label={`Remover filtro ${filter.label}`}
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
} 