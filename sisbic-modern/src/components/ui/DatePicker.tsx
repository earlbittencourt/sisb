'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';

import { cn } from '../../lib/utils';

export function DatePicker({
  value,
  onChange,
  className,
}: {
  value?: Date;
  onChange?: (date?: Date) => void;
  className?: string;
}) {

  const handleSelect = (date: Date | undefined, close: () => void) => {
    if (onChange) {
      onChange(date);
    }
    if (date) {
      close();
    }
  };

  return (
    <Popover className={cn('relative', className)}>
      {({ close }) => (
        <>
          <PopoverButton
            className={cn(
              'w-full justify-start text-left font-normal',
              'flex items-center gap-x-2 p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-text-primary placeholder-text-tertiary border-none focus:ring-2 focus:ring-ufba-blue-light transition-shadow shadow-sm hover:shadow-md',
              !value && 'text-text-tertiary'
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {value ? format(value, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
          </PopoverButton>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel
              anchor="bottom start"
              className={cn(
                'z-[100] mt-2 origin-top rounded-3xl border border-border-primary dark:border-white/20 bg-bg-glass dark:bg-gray-800/80 p-4 text-text-primary dark:text-white shadow-2xl backdrop-blur-xl',
                'focus:outline-none'
              )}
            >
              <DayPicker
                locale={ptBR}
                mode="single"
                selected={value}
                onSelect={(date) => handleSelect(date, close)}
                initialFocus
                captionLayout="dropdown"
                fromYear={new Date().getFullYear() - 50}
                toYear={new Date().getFullYear() + 5}
                classNames={{
                  caption: 'flex justify-between items-center mb-4',
                  caption_label: 'text-base font-bold hidden',
                  nav: 'flex items-center gap-1',
                  nav_button: 'h-8 w-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/20',
                  
                  caption_dropdowns: 'flex gap-2',
                  dropdown: 'appearance-none cursor-pointer rounded-lg border border-transparent bg-white/20 dark:bg-black/30 px-3 py-1.5 text-center font-semibold text-text-primary dark:text-white transition-colors hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ufba-blue dark:focus:ring-offset-gray-900',
                  dropdown_month: 'mr-2',

                  months: 'space-y-4',
                  month: 'w-full',
                  
                  head_row: 'flex justify-around text-xs text-text-secondary dark:text-white/50 mb-2',
                  head_cell: 'w-9 font-normal',
                  
                  table: 'w-full border-collapse',
                  row: 'flex w-full mt-2 justify-around',
                  cell: 'h-9 w-9 text-center p-0 relative',
                  
                  day: 'h-9 w-9 p-0 font-normal rounded-full text-sm transition-colors hover:bg-black/10 dark:hover:bg-white/20',
                  day_today: 'bg-ufba-blue/20 text-ufba-blue dark:text-white font-bold',
                  day_selected: 'bg-ufba-blue text-white hover:bg-ufba-blue-light focus:bg-ufba-blue-light',
                  day_outside: 'text-text-tertiary dark:text-white/40 opacity-70',
                  day_disabled: 'text-text-tertiary dark:text-white/30 opacity-50',
                  day_hidden: 'invisible',
                }}
              />
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
} 