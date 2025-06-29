'use client';

import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date?: Date) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  name,
  id,
  className = '',
  placeholder = 'Selecione uma data'
}) => {
  const inputId = id || name || (label ? `date-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const { theme } = useTheme();

  const handleSelect = (date: Date | undefined, close: () => void) => {
    if (onChange) {
      onChange(date);
    }
    if (date) {
      close();
    }
  };

  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-600 dark:text-slate-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Popover className="relative">
        {({ close }) => (
          <>
            <PopoverButton
              id={inputId}
              disabled={disabled}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-md border',
                'bg-white dark:bg-slate-800',
                'border-neutral-300 dark:border-slate-600',
                'text-neutral-900 dark:text-slate-100',
                'hover:border-neutral-400 dark:hover:border-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-ufba-blue focus:border-ufba-blue',
                'disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-neutral-500',
                'dark:disabled:bg-slate-700/50 dark:disabled:text-slate-400',
                error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : '',
                !value && 'text-neutral-500 dark:text-slate-400'
              )}
            >
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">
                {value ? format(value, 'dd/MM/yyyy', { locale: ptBR }) : placeholder}
              </span>
            </PopoverButton>

            <Transition
              enter=""
              enterFrom=""
              enterTo=""
              leave=""
              leaveFrom=""
              leaveTo=""
            >
              <PopoverPanel className="absolute z-50 mt-1">
                <div className={cn(
                  'bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-neutral-200 dark:border-slate-700 p-3',
                  'focus:outline-none min-w-[280px]'
                )}>
                  <DayPicker
                    key={theme}
                    mode="single"
                    selected={value}
                    defaultMonth={value}
                    month={value}
                    onSelect={(date) => handleSelect(date, close)}
                    locale={ptBR}
                    disabled={disabled}
                    showOutsideDays={false}
                    initialFocus
                    classNames={{
                      selected: 'ufba-datepicker-selected'
                    }}
                  />
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}; 