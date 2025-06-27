import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterPillProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export function FilterPill({ label, onRemove, className }: FilterPillProps) {
  return (
    <div className={cn(
      'inline-flex items-center bg-primary/10 text-primary-dark dark:text-primary-light',
      'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
      'border border-primary/20 hover:border-primary/30',
      'group hover:bg-primary/15',
      className
    )}>
      <span className="mr-1">{label}</span>
      <button 
        onClick={onRemove} 
        className="ml-1 p-0.5 hover:bg-primary/20 rounded-full transition-all duration-200 ease-out
                   hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label={`Remover filtro ${label}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
} 