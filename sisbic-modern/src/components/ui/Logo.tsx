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

  // Mapeamento de classes de altura do Tailwind
  const heightClassMap = {
    sm: 'h-7',    // Reduzido de h-8 (32px) para h-7 (~28px)
    md: 'h-9',    // Reduzido de h-10 (40px) para h-9 (~36px)
    lg: 'h-12',   // Reduzido de h-14 (56px) para h-12 (~48px)
    xl: 'h-52',   // Reduzido de h-60 (240px) para h-52 (~208px)
  };
  const heightClass = heightClassMap[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Logo único para ambos os temas */}
      <img
        className={`${heightClass} w-auto`}
        src="/logo-branco-ufba.png"
        alt="Logo UFBA"
        width={logoSize}
        height={logoSize}
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