import React from 'react';
import { X } from 'lucide-react';

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
    <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-slate-700 text-primary-dark dark:text-slate-100 text-sm font-medium pl-3 pr-1.5 py-1 rounded-full">
      <span>{filter.label}</span>
      <span className="text-slate-500">{filter.condition}</span>
      <span className="font-semibold">{filter.value}</span>
      <button 
        onClick={() => onRemove(filter.id)} 
        className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
        aria-label={`Remover filtro ${filter.label}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
} 