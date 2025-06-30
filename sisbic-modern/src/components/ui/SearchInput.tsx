import React, { useState, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onFilterClick?: () => void;
  className?: string;
  showFilterButton?: boolean;
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Buscar editais...',
  value,
  onChange,
  onClear,
  onFilterClick,
  className = '',
  showFilterButton = false,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'relative flex items-center bg-white dark:bg-stone-800 rounded-xl',
          'transition-all duration-200 ease-in-out',
          isFocused && '',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{ border: 'none', boxShadow: 'none' }}
      >
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center justify-center">
          <Search 
            className={cn(
              'w-4 h-4 text-stone-400'
            )} 
          />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-9 pr-12 py-2 bg-transparent text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-400',
            'focus:outline-none text-sm',
            'transition-all duration-200'
          )}
          style={{ border: 'none', boxShadow: 'none' }}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-4 p-1 rounded-lg transition-all duration-200',
              'hover:bg-stone-100 dark:hover:bg-stone-700',
              'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Filter Button */}
        {showFilterButton && (
          <button
            onClick={onFilterClick}
            className={cn(
              'absolute right-4 p-1.5 rounded-lg transition-all duration-200',
              'hover:bg-info-light dark:hover:bg-info/10',
              'text-stone-400 hover:text-info dark:hover:text-info-light',
              'border border-stone-200 dark:border-stone-700 hover:border-info-light dark:hover:border-info/30'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subtle animation on focus */}
      {isFocused && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export default SearchInput; 