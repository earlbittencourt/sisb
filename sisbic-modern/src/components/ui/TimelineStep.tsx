import React from 'react';
import { FiCheckCircle, FiCircle, FiPlayCircle } from 'react-icons/fi';
import { IconType } from 'react-icons';

const ICONS: Record<'completed' | 'active' | 'upcoming', IconType> = {
  completed: FiCheckCircle,
  active: FiPlayCircle,
  upcoming: FiCircle,
};
const COLORS = {
  completed: 'text-brand-success',
  active: 'text-brand-primary dark:text-brand-primary-dark',
  upcoming: 'text-content-secondary',
};

export function TimelineStep({ label, dateRange, status }: { label: string; dateRange: string; status: 'completed' | 'active' | 'upcoming' }) {
  const Icon = ICONS[status];
  const colorClass = COLORS[status];
  return (
    <div className="flex items-start gap-4">
      <Icon className={`h-6 w-6 mt-1 flex-shrink-0 ${colorClass}`} />
      <div>
        <p className={`font-semibold ${status === 'active' ? colorClass : 'text-content-main dark:text-content-main-dark'}`}>{label}</p>
        <p className="text-sm text-content-secondary dark:text-content-secondary-dark">{dateRange}</p>
      </div>
    </div>
  );
} 