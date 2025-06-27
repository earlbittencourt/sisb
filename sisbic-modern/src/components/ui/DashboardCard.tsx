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
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className = ''
}) => {
  return (
    <div className={cn('bg-neutral-50 dark:bg-neutral-800 shadow-lifted rounded-lg p-6 transition-all duration-200 hover:shadow-subtle-lg', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Header with icon and title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {title}
              </h3>
            </div>
          </div>
          
          {/* Value and trend */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-neutral-800 dark:text-neutral-100">
              {value}
            </span>
            {trend && (
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend.direction === 'up' ? 'text-success' : 'text-danger'
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