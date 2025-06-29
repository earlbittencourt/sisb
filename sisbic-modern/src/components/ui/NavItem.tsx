import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false }) => {
  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150
        ${isActive 
          ? 'bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-200' 
          : 'text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/5 hover:text-primary-600 dark:hover:text-primary-200'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default NavItem; 