import React from 'react';

interface InputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  error,
  required = false,
  name,
  id,
  className = ''
}) => {
  const inputId = id || name || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={className}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-600 dark:text-slate-300 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={`
          w-full px-3 py-2 rounded-md border transition-all duration-200
          bg-white dark:bg-slate-800
          border-neutral-300 dark:border-slate-600
          text-neutral-900 dark:text-slate-100
          placeholder:text-neutral-400 dark:placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light
          disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-neutral-500
          dark:disabled:bg-slate-700/50 dark:disabled:text-slate-400
          ${error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : ''}
        `}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField; 