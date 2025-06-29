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
          ? 'bg-white/10 text-white' 
          : 'text-gray-200 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default NavItem; 