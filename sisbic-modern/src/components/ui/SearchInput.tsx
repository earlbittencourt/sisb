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
          'relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl',
          'transition-all duration-200 ease-in-out',
          'hover:border-gray-300 dark:hover:border-gray-600',
          isFocused && 'ring-2 ring-blue-500/20 border-blue-500 dark:border-blue-400 shadow-sm',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Search Icon */}
        <div className="absolute left-4 flex items-center justify-center">
          <Search 
            className={cn(
              'w-4 h-4 transition-colors duration-200',
              isFocused 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-500'
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
            'w-full pl-12 pr-12 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none text-sm font-medium',
            'transition-all duration-200'
          )}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-4 p-1 rounded-lg transition-all duration-200',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
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
              'hover:bg-blue-50 dark:hover:bg-blue-500/10',
              'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400',
              'border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30'
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