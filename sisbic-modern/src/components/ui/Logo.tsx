import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 240,
  };
  const logoSize = sizeMap[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/logo.png"
        alt="Logo SISBIC"
        width={logoSize}
        height={logoSize}
        className="rounded-lg shadow-sm"
        style={{ objectFit: 'contain' }}
      />
      {showText && (
        <span className="font-semibold text-base text-neutral-900 dark:text-neutral-100 tracking-tight">
          SISBIC
        </span>
      )}
    </div>
  );
};

export default Logo; 