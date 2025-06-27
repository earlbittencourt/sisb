import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CustomCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export function CustomCheckbox({ label, className, ...props }: CustomCheckboxProps) {
  return (
    <label className={cn('relative flex items-center cursor-pointer group', className)}>
      <input 
        type="checkbox" 
        className="peer sr-only" 
        {...props} 
      />
      <div 
        className="w-5 h-5 bg-neutral-200 dark:bg-neutral-700 rounded-md
                   flex items-center justify-center
                   peer-checked:bg-primary peer-checked:text-white
                   peer-focus:ring-2 peer-focus:ring-primary/20
                   transition-all duration-200 ease-out
                   group-hover:bg-neutral-300 dark:group-hover:bg-neutral-600
                   peer-checked:group-hover:bg-primary-dark"
      >
        <Check className="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors duration-200">
          {label}
        </span>
      )}
    </label>
  );
} 