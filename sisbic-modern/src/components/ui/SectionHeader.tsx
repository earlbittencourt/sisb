import React from 'react';

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, className = '' }) => (
  <h2 className={`font-serif text-2xl md:text-3xl text-content-main dark:text-content-main-dark mb-6 ${className}`}>
    {title}
  </h2>
); 