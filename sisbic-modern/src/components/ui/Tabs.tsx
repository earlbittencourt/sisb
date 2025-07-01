import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  children: (activeTabId: string) => React.ReactNode;
  defaultTab?: string;
}

export function Tabs({ tabs, children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <div>
      <div className="flex border-b border-border-color dark:border-border-dark mb-6 justify-center">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2',
                activeTab === tab.id
                  ? 'border-brand-primary dark:border-brand-primary-dark text-brand-primary dark:text-brand-primary-dark'
                  : 'border-transparent text-content-secondary dark:text-content-secondary-dark hover:text-content-main dark:hover:text-content-main-dark hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  activeTab === tab.id
                    ? 'bg-brand-primary/10 dark:bg-brand-primary-dark/10 text-brand-primary dark:text-brand-primary-dark'
                    : 'bg-surface-2 dark:bg-surface-dark-2 text-content-secondary dark:text-content-secondary-dark'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-8">{children(activeTab)}</div>
    </div>
  );
} 