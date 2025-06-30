import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string; // Ex: "+12.5%"
    direction: 'up' | 'down';
  };
  percent?: number;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  percent,
  className = ''
}) => {
  return (
    <div className={cn('bg-surface-1 dark:bg-surface-dark-1 border border-border-color dark:border-border-dark rounded-lg p-6 transition-all duration-200 hover:shadow-subtle hover:scale-[1.02]', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Header with icon and title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-primary/10 dark:bg-brand-primary-dark/10 rounded-lg text-brand-primary dark:text-brand-primary-dark">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-content-secondary dark:text-content-secondary-dark">
                {title}
              </h3>
            </div>
          </div>
          
          {/* Value, percent and trend */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-content-main dark:text-content-main-dark">
              {value}
            </span>
            {typeof percent === 'number' && (
              <span className="text-base font-medium text-brand-success dark:text-brand-success-dark">{percent}%</span>
            )}
            {trend && (
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend.direction === 'up' ? 'text-brand-success dark:text-brand-success-dark' : 'text-brand-danger dark:text-brand-danger-dark'
              )}>
              {trend.direction === 'up' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {trend.value}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard; 