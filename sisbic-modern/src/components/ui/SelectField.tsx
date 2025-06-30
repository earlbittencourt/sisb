import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  name,
  id,
  className = '',
  placeholder
}) => {
  const selectId = id || name || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={className}>
      <label 
        htmlFor={selectId}
        className="block text-sm font-medium text-neutral-600 dark:text-slate-300 mb-1"
      >
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 rounded-md border transition-all duration-200
          bg-white dark:bg-slate-800
          border-neutral-300 dark:border-slate-600
          text-neutral-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light
          disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-neutral-500
          dark:disabled:bg-slate-700/50 dark:disabled:text-slate-400
          ${error ? 'border-danger focus:ring-danger-light focus:border-danger' : ''}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-danger text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default SelectField; 