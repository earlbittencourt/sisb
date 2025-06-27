import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const StepperInput: React.FC<StepperInputProps> = ({
  label,
  value,
  min = 0,
  max,
  step = 1,
  onChange,
  disabled = false,
  error,
  className = ''
}) => {
  const handleDecrement = () => {
    if (disabled) return;
    const newValue = value - step;
    if (newValue >= min) onChange(newValue);
  };
  const handleIncrement = () => {
    if (disabled) return;
    const newValue = value + step;
    if (max === undefined || newValue <= max) onChange(newValue);
  };
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      )}
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 disabled:opacity-50"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-20 text-center bg-white dark:bg-gray-700 border-t border-b border-gray-300 dark:border-gray-600 focus:border-ufba-blue focus:ring-ufba-blue text-gray-900 dark:text-white text-sm py-2 px-2 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800"
          style={{ borderRadius: 0 }}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
          className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 disabled:opacity-50"
        >
          <Plus size={16} />
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default StepperInput; 