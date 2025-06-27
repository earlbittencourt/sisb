import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  href,
  className = ''
}) => {
  const baseClasses = 'nav-item w-full justify-start';
  const stateClasses = isActive ? 'nav-item-active' : 'nav-item-default';
  
  const content = (
    <>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(baseClasses, stateClasses, className)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(baseClasses, stateClasses, className)}
    >
      {content}
    </button>
  );
};

export default NavItem; 