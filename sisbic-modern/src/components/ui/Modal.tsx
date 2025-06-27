import React from 'react';
import { X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4'
};

const variantClasses = {
  default: 'bg-white dark:bg-gray-800',
  glass: 'bg-white/25 dark:bg-gray-800/15 backdrop-blur-xl backdrop-saturate-150',
  warning: 'bg-yellow-50 dark:bg-yellow-900/90',
  danger: 'bg-red-50 dark:bg-red-900/90'
};

const textColorClasses = {
  default: 'text-gray-900 dark:text-white',
  glass: 'text-gray-900 dark:text-white',
  warning: 'text-yellow-900 dark:text-yellow-100',
  danger: 'text-red-900 dark:text-red-100'
};

const closeButtonClasses = {
  default: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
  glass: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
  warning: 'text-yellow-700 hover:text-yellow-900 dark:text-yellow-200 dark:hover:text-yellow-100',
  danger: 'text-red-700 hover:text-red-900 dark:text-red-200 dark:hover:text-red-100'
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'default',
  size = 'md',
  showCloseButton = true,
  className = '',
  contentClassName = '',
  titleClassName = ''
}) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full relative rounded-2xl transition-all',
                  'glass-border',
                  variant === 'glass' && [
                    'bg-transparent',
                    'dark:bg-gray-900/40',
                    'backdrop-blur-xl',
                    'dark:backdrop-blur-md'
                  ],
                  sizeClasses[size],
                  className
                )}
              >
                <div className={cn('relative p-5 z-20', contentClassName)}>
                  {(title || showCloseButton) && (
        <div className="flex justify-between items-center mb-4">
                      {title && (
                        <Dialog.Title
                          className={cn(
                            'text-lg font-normal',
                            textColorClasses[variant],
                            titleClassName
                          )}
                        >
            {title}
                        </Dialog.Title>
                      )}
                      {showCloseButton && (
          <button
            onClick={onClose}
                          className={cn(
                            'transition-colors rounded-full p-1',
                            variant === 'glass' && 'hover:bg-black/10 dark:hover:bg-white/10',
                            closeButtonClasses[variant]
                          )}
          >
            <X size={20} />
          </button>
                      )}
        </div>
                  )}

                  <div className={textColorClasses[variant]}>
        {children}
      </div>
    </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal; 