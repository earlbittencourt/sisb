import React from 'react';

interface ConfigLayoutProps {
  children: React.ReactNode;
  linkVoltar?: string;
}

const ConfigLayout: React.FC<ConfigLayoutProps> = ({ children }) => {
  return (
    <div className="p-6 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ConfigLayout; 